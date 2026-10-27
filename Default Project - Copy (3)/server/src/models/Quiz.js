import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  prompt: { type: String, required: true, trim: true },
  options: {
    type: [String],
    required: true,
    validate: [(value) => value.length >= 2, 'Each question needs at least two options'],
  },
  correctIndex: { type: Number, required: true, min: 0 },
  explanation: { type: String, default: '' },
});

const quizSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Easy' },
    emoji: { type: String, default: '🧠' },
    accent: { type: String, default: '#22d3ee' },
    estimatedMinutes: { type: Number, min: 1, max: 30, default: 5 },
    xpPerCorrect: { type: Number, min: 1, default: 20 },
    isActive: { type: Boolean, default: true },
    questions: { type: [questionSchema], required: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

/** Quiz shape that is safe to send to the browser before an attempt. */
export function toPublicQuiz(quiz) {
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
    questions: quiz.questions.map((question) => ({
      id: question._id.toString(),
      prompt: question.prompt,
      options: question.options,
    })),
  };
}

export const Quiz = mongoose.model('Quiz', quizSchema);
