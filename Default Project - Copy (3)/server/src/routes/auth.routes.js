import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { User } from '../models/User.js';
import { ApiError, asyncHandler } from '../utils/errors.js';
import { registerSchema, loginSchema } from '../validators/schemas.js';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import { signToken, setAuthCookie, clearAuthCookie } from '../utils/tokens.js';
import { getOrCreateProgress, logActivity } from '../utils/progress.js';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 60,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Too many attempts. Please wait a few minutes and try again.' },
});

router.post(
  '/register',
  authLimiter,
  validate(registerSchema),
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      throw new ApiError(409, 'An account with this email already exists. Try logging in instead.');
    }

    const passwordHash = await User.hashPassword(password);
    let user;
    try {
      user = await User.create({ name, email, passwordHash });
    } catch (error) {
      if (error.code === 11000) {
        throw new ApiError(409, 'An account with this email already exists. Try logging in instead.');
      }
      throw error;
    }

    await getOrCreateProgress(user._id);
    await logActivity(
      user._id,
      'register',
      'Joined ScamShield',
      'Your learning journey started — welcome aboard!'
    );

    const token = signToken(user);
    setAuthCookie(res, token);

    res.status(201).json({
      message: `Welcome to ScamShield, ${user.name.split(' ')[0]}!`,
      user: user.toPublic(),
    });
  })
);

router.post(
  '/login',
  authLimiter,
  validate(loginSchema),
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) {
      throw new ApiError(401, 'Invalid email or password.');
    }

    const valid = await user.verifyPassword(password);
    if (!valid) {
      throw new ApiError(401, 'Invalid email or password.');
    }

    user.lastLoginAt = new Date();
    await user.save();
    await getOrCreateProgress(user._id);
    await logActivity(user._id, 'login', 'Logged in', 'Your session is secured with an httpOnly cookie.');

    const token = signToken(user);
    setAuthCookie(res, token);

    res.json({
      message: `Welcome back, ${user.name.split(' ')[0]}!`,
      user: user.toPublic(),
    });
  })
);

router.post(
  '/logout',
  asyncHandler(async (req, res) => {
    clearAuthCookie(res);
    res.json({ message: 'You have been logged out securely.' });
  })
);

router.get(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    res.json({ user: req.user.toPublic() });
  })
);

export default router;
