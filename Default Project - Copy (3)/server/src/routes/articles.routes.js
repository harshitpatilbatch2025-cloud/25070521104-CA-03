import { Router } from 'express';
import { Article } from '../models/Article.js';
import { Bookmark } from '../models/Bookmark.js';
import { Progress } from '../models/Progress.js';
import { optionalAuth } from '../middleware/auth.js';
import { ApiError, asyncHandler } from '../utils/errors.js';

const router = Router();

const LIST_FIELDS = 'title slug excerpt category level readTimeMinutes emoji accent author featured publishedAt createdAt';

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

router.get(
  '/categories',
  asyncHandler(async (_req, res) => {
    const categories = await Article.distinct('category');
    res.json({ categories: categories.sort((a, b) => a.localeCompare(b)) });
  })
);

router.get(
  '/',
  optionalAuth,
  asyncHandler(async (req, res) => {
    const { category, q, featured } = req.query;
    const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 50);

    const filter = {};
    if (category && category !== 'All') filter.category = category;
    if (featured === 'true') filter.featured = true;
    if (q) {
      const pattern = new RegExp(escapeRegex(String(q)), 'i');
      filter.$or = [{ title: pattern }, { excerpt: pattern }, { category: pattern }];
    }

    const articles = await Article.find(filter)
      .select(LIST_FIELDS)
      .sort({ featured: -1, publishedAt: -1 })
      .limit(limit)
      .lean();

    let bookmarkedIds = new Set();
    if (req.user) {
      const bookmarkDocs = await Bookmark.find({
        user: req.user._id,
        article: { $in: articles.map((article) => article._id) },
      })
        .select('article')
        .lean();
      bookmarkedIds = new Set(bookmarkDocs.map((bookmark) => bookmark.article.toString()));
    }

    res.json({
      articles: articles.map((article) => ({
        ...article,
        id: article._id.toString(),
        _id: undefined,
        bookmarked: bookmarkedIds.has(article._id.toString()),
      })),
      count: articles.length,
    });
  })
);

router.get(
  '/:slug',
  optionalAuth,
  asyncHandler(async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug.toLowerCase() }).lean();
    if (!article) {
      throw new ApiError(404, 'That article could not be found.');
    }

    let bookmarked = false;
    let read = false;
    if (req.user) {
      const [bookmarkExists, progress] = await Promise.all([
        Bookmark.exists({ user: req.user._id, article: article._id }),
        Progress.findOne({ user: req.user._id }).select('articlesRead').lean(),
      ]);
      bookmarked = Boolean(bookmarkExists);
      read = Boolean(
        progress?.articlesRead?.some((entry) => entry.article.toString() === article._id.toString())
      );
    }

    const related = await Article.find({
      _id: { $ne: article._id },
      category: article.category,
    })
      .select(LIST_FIELDS)
      .limit(3)
      .lean();

    const serialize = (doc) => {
      const { _id, ...rest } = doc;
      return { ...rest, id: _id.toString() };
    };

    res.json({
      article: serialize(article),
      bookmarked,
      read,
      related: related.map(serialize),
    });
  })
);

export default router;
