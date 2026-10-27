import { Progress } from '../models/Progress.js';
import { Bookmark } from '../models/Bookmark.js';
import { QuizAttempt } from '../models/QuizAttempt.js';
import { Activity } from '../models/Activity.js';
import { Article } from '../models/Article.js';
import { Quiz } from '../models/Quiz.js';
import { getOrCreateProgress, levelInfo } from './progress.js';

/** Aggregates everything the personalized dashboard needs, straight from MongoDB. */
export async function buildDashboard(user) {
  const userId = user._id;
  const [progress, bookmarkCount, attempts, recentAttempts, recentActivity, bookmarks, articleCount, quizCount] =
    await Promise.all([
      getOrCreateProgress(userId),
      Bookmark.countDocuments({ user: userId }),
      QuizAttempt.find({ user: userId }).select('percentage passed completedAt'),
      QuizAttempt.find({ user: userId })
        .sort({ completedAt: -1 })
        .limit(5)
        .populate('quiz', 'title slug emoji accent category')
        .lean(),
      Activity.find({ user: userId }).sort({ createdAt: -1 }).limit(8).lean(),
      Bookmark.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(4)
        .populate('article', 'title slug category emoji accent readTimeMinutes excerpt')
        .lean(),
      Article.countDocuments({}),
      Quiz.countDocuments({ isActive: true }),
    ]);

  const attemptCount = attempts.length;
  const averagePercentage = attemptCount
    ? Math.round(attempts.reduce((sum, attempt) => sum + attempt.percentage, 0) / attemptCount)
    : 0;
  const bestPercentage = attemptCount ? Math.max(...attempts.map((attempt) => attempt.percentage)) : 0;
  const passedCount = attempts.filter((attempt) => attempt.passed).length;

  const readIds = new Set(progress.articlesRead.map((entry) => entry.article.toString()));
  const completedQuizIds = new Set(progress.completedQuizzes.map((entry) => entry.quiz.toString()));

  const [readArticles, completedQuizDetails] = await Promise.all([
    Article.find({ _id: { $in: [...readIds] } })
      .select('title slug category emoji accent readTimeMinutes')
      .lean(),
    Quiz.find({ _id: { $in: [...completedQuizIds] } })
      .select('title slug emoji accent category')
      .lean(),
  ]);

  return {
    stats: {
      ...levelInfo(progress.xp),
      bookmarks: bookmarkCount,
      quizAttempts: attemptCount,
      averageScore: averagePercentage,
      bestScore: bestPercentage,
      quizzesPassed: passedCount,
      articlesRead: readIds.size,
      streakDays: progress.streakDays,
      lastActivityAt: progress.lastActivityAt,
      totalArticles: articleCount,
      totalQuizzes: quizCount,
      learningGoalMinutes: user.preferences?.learningGoalMinutes ?? 15,
    },
    progress: {
      xp: progress.xp,
      streakDays: progress.streakDays,
      articlesRead: progress.articlesRead.map((entry) => ({
        articleId: entry.article.toString(),
        readAt: entry.readAt,
      })),
      completedQuizzes: progress.completedQuizzes.map((entry) => ({
        quizId: entry.quiz.toString(),
        bestPercentage: entry.bestPercentage,
        attemptCount: entry.attemptCount,
        lastAttemptAt: entry.lastAttemptAt,
      })),
    },
    readArticles,
    completedQuizDetails,
    recentAttempts: recentAttempts.map((attempt) => ({
      id: attempt._id.toString(),
      quizTitle: attempt.quizTitle,
      quiz: attempt.quiz,
      score: attempt.score,
      totalQuestions: attempt.totalQuestions,
      percentage: attempt.percentage,
      passed: attempt.passed,
      xpEarned: attempt.xpEarned,
      completedAt: attempt.completedAt,
    })),
    recentActivity: recentActivity.map((item) => ({
      id: item._id.toString(),
      type: item.type,
      title: item.title,
      detail: item.detail,
      createdAt: item.createdAt,
    })),
    bookmarks: bookmarks
      .filter((bookmark) => bookmark.article)
      .map((bookmark) => ({
        id: bookmark._id.toString(),
        createdAt: bookmark.createdAt,
        article: bookmark.article,
      })),
  };
}
