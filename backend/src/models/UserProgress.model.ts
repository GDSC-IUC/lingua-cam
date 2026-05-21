import mongoose, { Document, Schema } from 'mongoose';

export interface IUserProgress extends Document {
  userId: mongoose.Types.ObjectId;
  lessonId: mongoose.Types.ObjectId;
  languageId: mongoose.Types.ObjectId;
  completed: boolean;
  score: number;
  xpEarned: number;
  attempts: number;
  completedAt?: Date;
  lastAttemptAt: Date;
}

const UserProgressSchema = new Schema<IUserProgress>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    lessonId: { type: Schema.Types.ObjectId, ref: 'Lesson', required: true },
    languageId: { type: Schema.Types.ObjectId, ref: 'Language', required: true },
    completed: { type: Boolean, default: false },
    score: { type: Number, default: 0, min: 0, max: 100 },
    xpEarned: { type: Number, default: 0 },
    attempts: { type: Number, default: 0 },
    completedAt: { type: Date },
    lastAttemptAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

UserProgressSchema.index({ userId: 1, lessonId: 1 }, { unique: true });
UserProgressSchema.index({ userId: 1, languageId: 1 });

export default mongoose.model<IUserProgress>('UserProgress', UserProgressSchema);
