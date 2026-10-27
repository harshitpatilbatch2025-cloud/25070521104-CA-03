import mongoose from 'mongoose';

const readArticleSchema = new mongoose.Schema(
  {
    article: { type: mongoose.Schema.Types.ObjectId, ref: 'Article', required: true },
    readAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const completedQuizSchema = new mongoose.Schema(
  {
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    bestPercentage: { type: Number, default: 0, min: 0, max: 100 },
    attemptCount: { type: Number, default: 0, min: 0 },
    lastAttemptAt: { type: Date },
  },
  { _id: false }
);

const progressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    xp: { type: Number, default: 0, min: 0 },
    articlesRead: { type: [readArticleSchema], default: [] },
    completedQuizzes: { type: [completedQuizSchema], default: [] },
    streakDays: { type: Number, default: 0, min: 0 },
    lastActivityAt: { type: Date, default: null },
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

export const Progress = mongoose.model('Progress', progressSchema);
