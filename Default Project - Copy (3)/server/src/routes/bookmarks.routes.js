import { Router } from 'express';
import { Article } from '../models/Article.js';
import { Bookmark } from '../models/Bookmark.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { ApiError, asyncHandler } from '../utils/errors.js';
import { bookmarkSchema } from '../validators/schemas.js';
import { logActivity } from '../utils/progress.js';

const router = Router();

router.use(requireAuth);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const bookmarks = await Bookmark.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('article', 'title slug excerpt category level readTimeMinutes emoji accent author publishedAt')
      .lean();

    res.json({
      bookmarks: bookmarks
        .filter((bookmark) => bookmark.article)
        .map((bookmark) => ({
          id: bookmark._id.toString(),
          createdAt: bookmark.createdAt,
          article: { ...bookmark.article, id: bookmark.article._id.toString(), _id: undefined },
        })),
    });
  })
);

router.post(
  '/',
  validate(bookmarkSchema),
  asyncHandler(async (req, res) => {
    const article = await Article.findOne({ slug: req.body.articleSlug.toLowerCase() });
    if (!article) throw new ApiError(404, 'That article could not be found.');

    const existing = await Bookmark.findOne({ user: req.user._id, article: article._id });
    if (existing) {
      return res.status(200).json({
        message: 'This article is already in your saved list.',
        bookmarked: true,
        bookmarkId: existing._id.toString(),
      });
    }

    const bookmark = await Bookmark.create({ user: req.user._id, article: article._id });
    await logActivity(
      req.user._id,
      'bookmark',
      'Saved an article',
      article.title,
      { articleId: article._id.toString(), slug: article.slug }
    );

    res.status(201).json({
      message: 'Article saved to your bookmarks.',
      bookmarked: true,
      bookmarkId: bookmark._id.toString(),
    });
  })
);

router.delete(
  '/:slug',
  asyncHandler(async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug.toLowerCase() });
    if (!article) throw new ApiError(404, 'That article could not be found.');

    const result = await Bookmark.deleteOne({ user: req.user._id, article: article._id });
    if (result.deletedCount > 0) {
      await logActivity(
        req.user._id,
        'unbookmark',
        'Removed a bookmark',
        article.title,
        { articleId: article._id.toString(), slug: article.slug }
      );
    }

    res.json({ message: 'Bookmark removed.', bookmarked: false });
  })
);

export default router;
