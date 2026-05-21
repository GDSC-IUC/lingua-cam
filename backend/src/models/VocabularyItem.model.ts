import mongoose, { Document, Schema } from 'mongoose';

export interface IVocabularyItem extends Document {
  lessonId: mongoose.Types.ObjectId;
  languageId: mongoose.Types.ObjectId;
  word: string;
  meaning: string;
  meaningEn?: string;
  phonetic?: string;
  audioUrl?: string;
  imageUrl?: string;
  exampleSentence?: string;
  exampleTranslation?: string;
  tags: string[];
  difficultyLevel: number;
  validatedByNative: boolean;
}

const VocabularyItemSchema = new Schema<IVocabularyItem>(
  {
    lessonId: { type: Schema.Types.ObjectId, ref: 'Lesson', required: true },
    languageId: { type: Schema.Types.ObjectId, ref: 'Language', required: true },
    word: { type: String, required: true },
    meaning: { type: String, required: true },
    meaningEn: { type: String },
    phonetic: { type: String },
    audioUrl: { type: String },
    imageUrl: { type: String },
    exampleSentence: { type: String },
    exampleTranslation: { type: String },
    tags: [{ type: String }],
    difficultyLevel: { type: Number, min: 1, max: 5, default: 1 },
    validatedByNative: { type: Boolean, default: false },
  },
  { timestamps: true }
);

VocabularyItemSchema.index({ lessonId: 1 });
VocabularyItemSchema.index({ languageId: 1 });
VocabularyItemSchema.index({ word: 'text', meaning: 'text' });

export default mongoose.model<IVocabularyItem>('VocabularyItem', VocabularyItemSchema);
