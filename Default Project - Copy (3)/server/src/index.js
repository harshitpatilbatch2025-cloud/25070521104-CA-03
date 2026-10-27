import './config/env.js';
import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { connectDB, dbStatus } from './config/db.js';
import { ApiError } from './utils/errors.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/users.routes.js';
import articleRoutes from './routes/articles.routes.js';
import bookmarkRoutes from './routes/bookmarks.routes.js';
import quizRoutes from './routes/quizzes.routes.js';
import progressRoutes from './routes/progress.routes.js';
import { seedDatabase } from './seed/seed.js';
import { User } from './models/User.js';
import { Article } from './models/Article.js';
import { Quiz } from './models/Quiz.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = Number(process.env.PORT) || 5000;

if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'replace-with-a-long-random-secret') {
  console.error('[config] Refusing to start: set a strong JWT_SECRET in server/.env');
  process.exit(1);
}

app.disable('x-powered-by');
app.set('trust proxy', 1);

const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173,http://localhost:4173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  helmet({
    // The SPA is served by Vite in development and Express in production.
    // CSP is configured by the host in production; disabling it here avoids
    // blocking Google Fonts and Vite's dev client.
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new ApiError(403, 'This origin is not allowed to access the API.'));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: false, limit: '100kb' }));
app.use(cookieParser());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.use(
  '/api',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 600,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { message: 'Too many requests. Please slow down and try again shortly.' },
  })
);

app.get('/api/health', async (_req, res) => {
  const [users, articles, quizzes] = await Promise.all([
    User.countDocuments(),
    Article.countDocuments(),
    Quiz.countDocuments(),
  ]);
  res.json({
    status: dbStatus() === 'connected' ? 'ok' : 'degraded',
    database: dbStatus(),
    counts: { users, articles, quizzes },
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/progress', progressRoutes);

app.use('/api', (_req, _res, next) => {
  next(new ApiError(404, 'API endpoint not found.'));
});

// Serve the production React build when it exists.
const clientDist = path.resolve(__dirname, '../../client/dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist, { index: false, maxAge: '1h' }));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// Central error handler. Never leaks stack traces to the browser.
app.use((err, _req, res, _next) => {
  let status = err.status || 500;
  let message = err.message || 'Something went wrong. Please try again.';
  let errors = err.errors;

  if (err.name === 'CastError') {
    status = 400;
    message = 'Invalid request.';
  } else if (err.name === 'ValidationError') {
    status = 422;
    message = 'Please check the details you submitted.';
    errors = Object.values(err.errors).map((item) => ({ field: item.path, message: item.message }));
  } else if (err.code === 11000) {
    status = 409;
    message = 'That record already exists.';
  }

  if (status >= 500) {
    console.error('[api] Unhandled error:', err);
    message = 'Something went wrong on our side. Please try again.';
  }

  res.status(status).json({ message, ...(errors ? { errors } : {}) });
});

async function start() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/scamshield';
  await connectDB(uri);

  if (process.env.SEED_ON_START !== 'false') {
    await seedDatabase({ log: true });
  }

  app.listen(PORT, () => {
    console.log(`[api] ScamShield API listening on http://localhost:${PORT}`);
    console.log(`[api] Allowed browser origins: ${allowedOrigins.join(', ')}`);
  });
}

start().catch((error) => {
  console.error('[api] Failed to start:', error.message);
  process.exit(1);
});

async function shutdown(signal) {
  console.log(`\n[api] ${signal} received, closing connection…`);
  await mongoose.disconnect().catch(() => {});
  process.exit(0);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
