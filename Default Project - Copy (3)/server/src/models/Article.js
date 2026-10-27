import mongoose from 'mongoose';

const blockSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['p', 'h2', 'ul', 'quote'], default: 'p' },
    text: { type: String },
    items: { type: [String], default: undefined },
  },
  { _id: false }
);

const articleSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    title: { type: String, required: true, trim: true },
    excerpt: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true, index: true },
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    readTimeMinutes: { type: Number, min: 1, max: 60, default: 5 },
    emoji: { type: String, default: '🛡️' },
    accent: { type: String, default: '#22d3ee' },
    author: { type: String, default: 'ScamShield Research Team' },
    featured: { type: Boolean, default: false, index: true },
    body: { type: [blockSchema], default: [] },
    tips: { type: [String], default: [] },
    publishedAt: { type: Date, default: Date.now },
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

export const Article = mongoose.model('Article', articleSchema);
