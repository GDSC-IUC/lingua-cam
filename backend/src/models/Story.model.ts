import mongoose, { Document, Schema } from 'mongoose';

export interface IStoryPage {
  pageNumber: number;
  text: string;
  textFr?: string;
  imageUrl?: string;
  audioUrl?: string;
  audioDurationMs?: number;
}

export interface IStory extends Document {
  languageId: mongoose.Types.ObjectId;
  title: string;
  titleFr?: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  coverImageUrl?: string;
  pages: IStoryPage[];
  totalPages: number;
  isPublished: boolean;
}

const StoryPageSchema = new Schema<IStoryPage>({
  pageNumber: { type: Number, required: true },
  text: { type: String, required: true },
  textFr: { type: String },
  imageUrl: { type: String },
  audioUrl: { type: String },
  audioDurationMs: { type: Number },
});

const StorySchema = new Schema<IStory>(
  {
    languageId: { type: Schema.Types.ObjectId, ref: 'Language', required: true },
    title: { type: String, required: true },
    titleFr: { type: String },
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    coverImageUrl: { type: String },
    pages: [StoryPageSchema],
    totalPages: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

StorySchema.pre('save', function () {
  this.totalPages = this.pages.length;
});

export default mongoose.model<IStory>('Story', StorySchema);
