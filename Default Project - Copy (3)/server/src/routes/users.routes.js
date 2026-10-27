import { Router } from 'express';
import { User } from '../models/User.js';
import { Bookmark } from '../models/Bookmark.js';
import { QuizAttempt } from '../models/QuizAttempt.js';
import { Activity } from '../models/Activity.js';
import { Progress } from '../models/Progress.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { ApiError, asyncHandler } from '../utils/errors.js';
import { updateProfileSchema, changePasswordSchema } from '../validators/schemas.js';
import { buildDashboard } from '../utils/dashboard.js';
import { logActivity } from '../utils/progress.js';
import { clearAuthCookie } from '../utils/tokens.js';

const router = Router();

router.use(requireAuth);

router.get(
  '/me',
  asyncHandler(async (req, res) => {
    res.json({ user: req.user.toPublic() });
  })
);

router.patch(
  '/me',
  validate(updateProfileSchema),
  asyncHandler(async (req, res) => {
    const user = req.user;
    const { name, preferences } = req.body;

    if (name !== undefined) user.name = name;
    if (preferences) {
      const current = user.preferences?.toObject ? user.preferences.toObject() : { ...user.preferences };
      user.preferences = { ...current, ...preferences };
    }

    await user.save();
    await logActivity(user._id, 'profile_updated', 'Profile updated', 'Your preferences and profile were saved.');

    res.json({ message: 'Profile updated successfully.', user: user.toPublic() });
  })
);

router.put(
  '/me/password',
  validate(changePasswordSchema),
  asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+passwordHash');
    if (!user) throw new ApiError(404, 'User not found.');

    const valid = await user.verifyPassword(currentPassword);
    if (!valid) {
      throw new ApiError(400, 'Your current password is incorrect.', [
        { field: 'currentPassword', message: 'Your current password is incorrect.' },
      ]);
    }

    user.passwordHash = await User.hashPassword(newPassword);
    await user.save();
    await logActivity(user._id, 'password_changed', 'Password changed', 'Your password was updated.');

    res.json({ message: 'Password changed successfully.' });
  })
);

router.get(
  '/me/stats',
  asyncHandler(async (req, res) => {
    const dashboard = await buildDashboard(req.user);
    res.json({ dashboard });
  })
);

router.get(
  '/me/activity',
  asyncHandler(async (req, res) => {
    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 50);
    const page = Math.max(Number(req.query.page) || 1, 1);
    const [items, total] = await Promise.all([
      Activity.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Activity.countDocuments({ user: req.user._id }),
    ]);

    res.json({
      activity: items.map((item) => ({
        id: item._id.toString(),
        type: item.type,
        title: item.title,
        detail: item.detail,
        createdAt: item.createdAt,
      })),
      pagination: { page, limit, total },
    });
  })
);

router.delete(
  '/me',
  asyncHandler(async (req, res) => {
    const userId = req.user._id;
    await Promise.all([
      Bookmark.deleteMany({ user: userId }),
      QuizAttempt.deleteMany({ user: userId }),
      Progress.deleteMany({ user: userId }),
      Activity.deleteMany({ user: userId }),
    ]);
    await User.deleteOne({ _id: userId });
    clearAuthCookie(res);
    res.json({ message: 'Your account and all associated data have been deleted.' });
  })
);

export default router;
