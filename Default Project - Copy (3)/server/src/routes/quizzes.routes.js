import { Router } from 'express';
import mongoose from 'mongoose';
import { Quiz, toPublicQuiz } from '../models/Quiz.js';
import { QuizAttempt } from '../models/QuizAttempt.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { ApiError, asyncHandler } from '../utils/errors.js';
import { submitQuizSchema } from '../validators/schemas.js';
import { getOrCreateProgress, touchStreak, logActivity, levelInfo } from '../utils/progress.js';

const router = Router();

function quizSummary(quiz, attemptStats) {
  return {
    id: quiz._id.toString(),
    slug: quiz.slug,
    title: quiz.title,
    description: quiz.description,
    category: quiz.category,
    difficulty: quiz.difficulty,
    emoji: quiz.emoji,
    accent: quiz.accent,
    estimatedMinutes: quiz.estimatedMinutes,
    xpPerCorrect: quiz.xpPerCorrect,
    questionCount: quiz.questions.length,
    attemptCount: attemptStats?.attemptCount || 0,
    bestPercentage: attemptStats?.bestPercentage ?? null,
    lastAttemptAt: attemptStats?.lastAttemptAt || null,
  };
}

router.get(
  '/',
  optionalAuth,
  asyncHandler(async (req, res) => {
    const quizzes = await Quiz.find({ isActive: true }).sort({ createdAt: 1 });

    let statsByQuiz = new Map();
    if (req.user) {
      const stats = await QuizAttempt.aggregate([
        { $match: { user: new mongoose.Types.ObjectId(req.user._id) } },
        {
          $group: {
            _id: '$quiz',
            attemptCount: { $sum: 1 },
            bestPercentage: { $max: '$percentage' },
            lastAttemptAt: { $max: '$completedAt' },
          },
        },
      ]);
      statsByQuiz = new Map(stats.map((entry) => [entry._id.toString(), entry]));
    }

    res.json({ quizzes: quizzes.map((quiz) => quizSummary(quiz, statsByQuiz.get(quiz._id.toString()))) });
  })
);

router.get(
  '/attempts/mine',
  requireAuth,
  asyncHandler(async (req, res) => {
    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 50);
    const attempts = await QuizAttempt.find({ user: req.user._id })
      .sort({ completedAt: -1 })
      .limit(limit)
      .populate('quiz', 'title slug emoji accent category difficulty')
      .lean();

    res.json({
      attempts: attempts.map((attempt) => ({
        id: attempt._id.toString(),
        quizTitle: attempt.quizTitle,
        quiz: attempt.quiz,
        score: attempt.score,
        totalQuestions: attempt.totalQuestions,
        percentage: attempt.percentage,
        passed: attempt.passed,
        xpEarned: attempt.xpEarned,
        durationSeconds: attempt.durationSeconds,
        completedAt: attempt.completedAt,
      })),
    });
  })
);

router.get(
  '/attempts/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) throw new ApiError(400, 'Invalid attempt id.');
    const attempt = await QuizAttempt.findOne({ _id: req.params.id, user: req.user._id })
      .populate('quiz', 'title slug emoji accent')
      .lean();
    if (!attempt) throw new ApiError(404, 'Attempt not found.');

    res.json({
      attempt: {
        ...attempt,
        id: attempt._id.toString(),
        _id: undefined,
        quizId: attempt.quiz?._id?.toString(),
      },
    });
  })
);

router.get(
  '/:slug',
  optionalAuth,
  asyncHandler(async (req, res) => {
    const quiz = await Quiz.findOne({ slug: req.params.slug.toLowerCase(), isActive: true });
    if (!quiz) throw new ApiError(404, 'That quiz could not be found.');

    let attempts = [];
    if (req.user) {
      attempts = await QuizAttempt.find({ user: req.user._id, quiz: quiz._id })
        .sort({ completedAt: -1 })
        .limit(5)
        .select('score totalQuestions percentage passed xpEarned completedAt')
        .lean();
    }

    res.json({
      quiz: toPublicQuiz(quiz),
      attempts: attempts.map((attempt) => ({
        id: attempt._id.toString(),
        score: attempt.score,
        totalQuestions: attempt.totalQuestions,
        percentage: attempt.percentage,
        passed: attempt.passed,
        xpEarned: attempt.xpEarned,
        completedAt: attempt.completedAt,
      })),
    });
  })
);

router.post(
  '/:slug/attempt',
  requireAuth,
  validate(submitQuizSchema),
  asyncHandler(async (req, res) => {
    const quiz = await Quiz.findOne({ slug: req.params.slug.toLowerCase(), isActive: true });
    if (!quiz) throw new ApiError(404, 'That quiz could not be found.');

    const { answers, durationSeconds = 0 } = req.body;
    if (answers.length !== quiz.questions.length) {
      throw new ApiError(422, `Please answer all ${quiz.questions.length} questions before submitting.`);
    }

    const answerMap = new Map();
    for (const answer of answers) {
      if (answerMap.has(answer.questionId)) {
        throw new ApiError(422, 'Each question can only be answered once.');
      }
      answerMap.set(answer.questionId, answer);
    }

    const gradedAnswers = quiz.questions.map((question) => {
      const answer = answerMap.get(question._id.toString());
      if (!answer) throw new ApiError(422, 'An answer is missing for one or more questions.');
      if (!Number.isInteger(answer.selectedIndex) || answer.selectedIndex < 0 || answer.selectedIndex >= question.options.length) {
        throw new ApiError(422, 'One of the selected answers is invalid.');
      }
      return {
        question: question._id,
        questionPrompt: question.prompt,
        selectedIndex: answer.selectedIndex,
        correctIndex: question.correctIndex,
        isCorrect: answer.selectedIndex === question.correctIndex,
      };
    });

    const score = gradedAnswers.filter((answer) => answer.isCorrect).length;
    const totalQuestions = quiz.questions.length;
    const percentage = Math.round((score / totalQuestions) * 100);
    const passed = percentage >= 70;
    const xpEarned = score * quiz.xpPerCorrect + (percentage === 100 ? 25 : 0);
    const completedAt = new Date();

    const attempt = await QuizAttempt.create({
      user: req.user._id,
      quiz: quiz._id,
      quizTitle: quiz.title,
      answers: gradedAnswers,
      score,
      totalQuestions,
      percentage,
      passed,
      xpEarned,
      durationSeconds: Math.min(Math.round(durationSeconds), 3600),
      completedAt,
    });

    const progress = await getOrCreateProgress(req.user._id);
    progress.xp += xpEarned;
    touchStreak(progress, completedAt);

    const existing = progress.completedQuizzes.find((entry) => entry.quiz.toString() === quiz._id.toString());
    if (existing) {
      existing.attemptCount += 1;
      existing.bestPercentage = Math.max(existing.bestPercentage, percentage);
      existing.lastAttemptAt = completedAt;
    } else {
      progress.completedQuizzes.push({
        quiz: quiz._id,
        bestPercentage: percentage,
        attemptCount: 1,
        lastAttemptAt: completedAt,
      });
    }
    await progress.save();

    await logActivity(
      req.user._id,
      'quiz_completed',
      `Completed "${quiz.title}"`,
      `Scored ${score}/${totalQuestions} (${percentage}%) and earned ${xpEarned} XP.`,
      { quizId: quiz._id.toString(), slug: quiz.slug, percentage, score, xpEarned }
    );

    res.status(201).json({
      message: passed ? 'Great work — you passed the quiz!' : 'Quiz submitted. Review the explanations and try again.',
      attempt: {
        id: attempt._id.toString(),
        quizId: quiz._id.toString(),
        quizSlug: quiz.slug,
        quizTitle: quiz.title,
        score,
        totalQuestions,
        percentage,
        passed,
        xpEarned,
        completedAt,
      },
      review: quiz.questions.map((question, index) => ({
        questionId: question._id.toString(),
        prompt: question.prompt,
        options: question.options,
        correctIndex: question.correctIndex,
        selectedIndex: gradedAnswers[index].selectedIndex,
        isCorrect: gradedAnswers[index].isCorrect,
        explanation: question.explanation,
      })),
      progress: {
        ...levelInfo(progress.xp),
        streakDays: progress.streakDays,
      },
    });
  })
);

export default router;
