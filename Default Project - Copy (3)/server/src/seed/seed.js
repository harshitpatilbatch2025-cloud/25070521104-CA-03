import '../config/env.js';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { Article } from '../models/Article.js';
import { Quiz } from '../models/Quiz.js';
import { articles } from './articles.js';
import { quizzes } from './quizzes.js';

/**
 * Idempotently upserts the curated articles and quizzes. User data is never touched.
 */
export async function seedDatabase({ log = false } = {}) {
  let articleCount = 0;
  let quizCount = 0;

  for (const article of articles) {
    await Article.replaceOne({ slug: article.slug }, article, { upsert: true });
    articleCount += 1;
  }

  for (const quiz of quizzes) {
    await Quiz.replaceOne({ slug: quiz.slug }, quiz, { upsert: true });
    quizCount += 1;
  }

  if (log) {
    console.log(`[seed] Upserted ${articleCount} articles and ${quizCount} quizzes.`);
  }

  return { articles: articleCount, quizzes: quizCount };
}

// Allow `npm run seed` to execute this file directly.
const isDirectRun = process.argv[1] && process.argv[1].replace(/\\/g, '/').endsWith('/seed/seed.js');

if (isDirectRun) {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/scamshield';
  try {
    await connectDB(uri);
    const result = await seedDatabase({ log: true });
    console.log(`[seed] Done. ${result.articles} articles / ${result.quizzes} quizzes ready.`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('[seed] Failed:', error.message);
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  }
}
