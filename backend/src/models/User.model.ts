import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  username: string;
  email?: string;
  passwordHash?: string;
  avatar: string;
  preferredLanguageId?: mongoose.Types.ObjectId;
  interfaceLang: 'fr' | 'en';
  isGuest: boolean;
  streak: number;
  lastStreakDate?: Date;
  totalXp: number;
  level: string;
  refreshTokenHash?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true, trim: true, minlength: 2, maxlength: 30 },
    email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    passwordHash: { type: String, select: false },
    avatar: { type: String, default: 'default' },
    preferredLanguageId: { type: Schema.Types.ObjectId, ref: 'Language' },
    interfaceLang: { type: String, enum: ['fr', 'en'], default: 'fr' },
    isGuest: { type: Boolean, default: false },
    streak: { type: Number, default: 0 },
    lastStreakDate: { type: Date },
    totalXp: { type: Number, default: 0 },
    level: { type: String, default: 'novice' },
    refreshTokenHash: { type: String, select: false },
  },
  { timestamps: true }
);

// Hash password avant sauvegarde
UserSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash') || !this.passwordHash) return next();
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  next();
});

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.passwordHash) return false;
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Calculer le niveau selon le XP
UserSchema.pre('save', function (next) {
  const xp = this.totalXp;
  if (xp < 100) this.level = 'novice';
  else if (xp < 500) this.level = 'apprenti';
  else if (xp < 1500) this.level = 'intermediaire';
  else if (xp < 4000) this.level = 'expert';
  else this.level = 'maitre';
  next();
});

export default mongoose.model<IUser>('User', UserSchema);
