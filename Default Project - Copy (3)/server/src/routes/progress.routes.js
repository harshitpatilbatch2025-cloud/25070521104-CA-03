import { Router } from 'express';
import { Article } from '../models/Article.js';
import { Progress } from '../models/Progress.js';
import { Quiz } from '../models/Quiz.js';
import { requireAuth } from '../middleware/auth.js';
import { ApiError, asyncHandler } from '../utils/errors.js';
import { getOrCreateProgress, touchStreak, logActivity, levelInfo } from '../utils/progress.js';

const router = Router();

router.use(requireAuth);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const progress = await getOrCreateProgress(req.user._id);
    const [readArticles, completedQuizzes] = await Promise.all([
      Article.find({ _id: { $in: progress.articlesRead.map((entry) => entry.article) } })
        .select('title slug category emoji accent readTimeMinutes')
        .lean(),
      Quiz.find({ _id: { $in: progress.completedQuizzes.map((entry) => entry.quiz) } })
        .select('title slug emoji accent category difficulty')
        .lean(),
    ]);

    const readMap = new Map(readArticles.map((article) => [article._id.toString(), article]));
    const quizMap = new Map(completedQuizzes.map((quiz) => [quiz._id.toString(), quiz]));

    res.json({
      progress: {
        ...levelInfo(progress.xp),
        streakDays: progress.streakDays,
        lastActivityAt: progress.lastActivityAt,
        articlesRead: progress.articlesRead.map((entry) => ({
          readAt: entry.readAt,
          article: readMap.get(entry.article.toString()) || null,
        })),
        completedQuizzes: progress.completedQuizzes.map((entry) => ({
          bestPercentage: entry.bestPercentage,
          attemptCount: entry.attemptCount,
          lastAttemptAt: entry.lastAttemptAt,
          quiz: quizMap.get(entry.quiz.toString()) || null,
        })),
      },
    });
  })
);

router.post(
  '/read/:slug',
  asyncHandler(async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug.toLowerCase() });
    if (!article) throw new ApiError(404, 'That article could not be found.');

    const progress = await getOrCreateProgress(req.user._id);
    const alreadyRead = progress.articlesRead.some(
      (entry) => entry.article.toString() === article._id.toString()
    );

    if (alreadyRead) {
      return res.json({
        message: 'You have already completed this article.',
        alreadyRead: true,
        xpAwarded: 0,
        progress: { ...levelInfo(progress.xp), streakDays: progress.streakDays },
      });
    }

    progress.articlesRead.push({ article: article._id, readAt: new Date() });
    progress.xp += 10;
    touchStreak(progress);
    await progress.save();

    await logActivity(
      req.user._id,
      'article_read',
      'Completed an article',
      `${article.title} (+10 XP)`,
      { articleId: article._id.toString(), slug: article.slug }
    );

    res.status(201).json({
      message: 'Article marked as read. +10 XP',
      alreadyRead: false,
      xpAwarded: 10,
      progress: { ...levelInfo(progress.xp), streakDays: progress.streakDays },
    });
  })
);

export default router;
