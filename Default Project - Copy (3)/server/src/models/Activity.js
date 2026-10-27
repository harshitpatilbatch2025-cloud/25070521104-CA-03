import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: {
      type: String,
      required: true,
      enum: [
        'register',
        'login',
        'logout',
        'bookmark',
        'unbookmark',
        'article_read',
        'quiz_completed',
        'profile_updated',
        'password_changed',
      ],
      index: true,
    },
    title: { type: String, required: true },
    detail: { type: String, default: '' },
    meta: { type: mongoose.Schema.Types.Mixed, default: undefined },
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

activitySchema.index({ user: 1, createdAt: -1 });

export const Activity = mongoose.model('Activity', activitySchema);
