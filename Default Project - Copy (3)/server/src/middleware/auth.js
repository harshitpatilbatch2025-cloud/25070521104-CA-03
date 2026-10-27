import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { ApiError } from '../utils/errors.js';
import { COOKIE_NAME } from '../utils/tokens.js';

async function resolveUser(req) {
  const header = req.headers.authorization || '';
  const bearer = header.startsWith('Bearer ') ? header.slice(7) : null;
  const token = req.cookies?.[COOKIE_NAME] || bearer;

  if (!token) return null;

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub);
    return user || null;
  } catch {
    return null;
  }
}

/** Rejects the request unless a valid session cookie / bearer token is present. */
export async function requireAuth(req, _res, next) {
  try {
    const user = await resolveUser(req);
    if (!user) {
      throw new ApiError(401, 'Please log in to continue.');
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

/** Attaches req.user when logged in, but never rejects. */
export async function optionalAuth(req, _res, next) {
  try {
    req.user = await resolveUser(req);
  } catch {
    req.user = null;
  }
  next();
}
