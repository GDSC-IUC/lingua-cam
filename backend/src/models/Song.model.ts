import mongoose, { Document, Schema } from 'mongoose';

export interface ISongLine {
  lineNumber: number;
  text: string;
  textFr?: string;
  startTimeMs: number;
  endTimeMs: number;
}

export interface ISong extends Document {
  languageId: mongoose.Types.ObjectId;
  title: string;
  titleFr?: string;
  audioUrl: string;
  coverImageUrl?: string;
  category: 'traditional' | 'children' | 'modern';
  lyrics: ISongLine[];
  isPublished: boolean;
}

const SongLineSchema = new Schema<ISongLine>({
  lineNumber: { type: Number, required: true },
  text: { type: String, required: true },
  textFr: { type: String },
  startTimeMs: { type: Number, required: true },
  endTimeMs: { type: Number, required: true },
});

const SongSchema = new Schema<ISong>(
  {
    languageId: { type: Schema.Types.ObjectId, ref: 'Language', required: true },
    title: { type: String, required: true },
    titleFr: { type: String },
    audioUrl: { type: String, required: true },
    coverImageUrl: { type: String },
    category: { type: String, enum: ['traditional', 'children', 'modern'], default: 'traditional' },
    lyrics: [SongLineSchema],
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<ISong>('Song', SongSchema);
