import mongoose from 'mongoose';

/**
 * Connect to MongoDB. Fails fast with an actionable message so the API never
 * appears to work while silently dropping writes.
 */
export async function connectDB(uri) {
  mongoose.set('strictQuery', true);

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
  } catch (error) {
    console.error('\n[db] Could not connect to MongoDB.');
    console.error(`[db] URI: ${uri}`);
    console.error('[db] Is mongod running? Start it with `npm run db:start` from the project root,');
    console.error('[db] or put a local/Atlas connection string in server/.env (MONGODB_URI).\n');
    throw error;
  }

  const { host, port, name } = mongoose.connection;
  console.log(`[db] Connected to MongoDB ${host}:${port}/${name}`);

  mongoose.connection.on('disconnected', () => {
    console.warn('[db] MongoDB disconnected');
  });
  mongoose.connection.on('reconnected', () => {
    console.log('[db] MongoDB reconnected');
  });

  return mongoose.connection;
}

export function dbStatus() {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  return states[mongoose.connection.readyState] || 'unknown';
}
