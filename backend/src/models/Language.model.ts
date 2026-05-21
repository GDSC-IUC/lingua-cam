import mongoose, { Document, Schema } from 'mongoose';

export interface ILanguage extends Document {
  code: string;
  name: string;
  region: string;
  subRegions: string[];
  color: string;
  gradientColors: string[];
  iconUrl?: string;
  mapCoordinates?: { lat: number; lng: number };
  description?: string;
  speakersEstimate?: number;
  phase: 1 | 2 | 3;
  isActive: boolean;
  order: number;
}

const LanguageSchema = new Schema<ILanguage>(
  {
    code: { type: String, required: true, unique: true, lowercase: true },
    name: { type: String, required: true },
    region: { type: String, required: true },
    subRegions: [{ type: String }],
    color: { type: String, default: '#007A5E' },
    gradientColors: [{ type: String }],
    iconUrl: { type: String },
    mapCoordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
    description: { type: String },
    speakersEstimate: { type: Number },
    phase: { type: Number, enum: [1, 2, 3], default: 1 },
    isActive: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<ILanguage>('Language', LanguageSchema);
