import mongoose, { Document, Schema } from 'mongoose';

type QuizType = 'mcq_audio' | 'mcq_image' | 'drag_drop' | 'fill_blank' | 'voice' | 'order' | 'memory';

export interface IQuizQuestion {
  type: QuizType;
  prompt?: string;
  audioUrl?: string;
  imageUrl?: string;
  options: string[];
  correctAnswer: string;
  xpValue: number;
}

export interface IQuiz extends Document {
  lessonId: mongoose.Types.ObjectId;
  passingScore: number;
  questions: IQuizQuestion[];
}

const QuizQuestionSchema = new Schema<IQuizQuestion>({
  type: {
    type: String,
    enum: ['mcq_audio', 'mcq_image', 'drag_drop', 'fill_blank', 'voice', 'order', 'memory'],
    required: true,
  },
  prompt: { type: String },
  audioUrl: { type: String },
  imageUrl: { type: String },
  options: [{ type: String }],
  correctAnswer: { type: String, required: true },
  xpValue: { type: Number, default: 10 },
});

const QuizSchema = new Schema<IQuiz>(
  {
    lessonId: { type: Schema.Types.ObjectId, ref: 'Lesson', required: true, unique: true },
    passingScore: { type: Number, default: 70 },
    questions: [QuizQuestionSchema],
  },
  { timestamps: true }
);

export default mongoose.model<IQuiz>('Quiz', QuizSchema);
