import mongoose, { Document, Schema } from 'mongoose';

export interface ILesson extends Document {
  languageId: mongoose.Types.ObjectId;
  title: string;
  theme: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  order: number;
  xpReward: number;
  estimatedMinutes: number;
  audioIntroUrl?: string;
  illustrationUrl?: string;
  isOfflineAvailable: boolean;
  isPublished: boolean;
}

const LessonSchema = new Schema<ILesson>(
  {
    languageId: { type: Schema.Types.ObjectId, ref: 'Language', required: true },
    title: { type: String, required: true },
    theme: { type: String, required: true },
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    order: { type: Number, required: true },
    xpReward: { type: Number, default: 50 },
    estimatedMinutes: { type: Number, default: 10 },
    audioIntroUrl: { type: String },
    illustrationUrl: { type: String },
    isOfflineAvailable: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

LessonSchema.index({ languageId: 1, order: 1 });
LessonSchema.index({ languageId: 1, isPublished: 1 });

export default mongoose.model<ILesson>('Lesson', LessonSchema);
