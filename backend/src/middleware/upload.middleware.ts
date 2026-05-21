import multer from 'multer';
import path from 'path';

const storage = multer.memoryStorage();

const fileFilter = (_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedAudio = /audio\/(mpeg|ogg|wav|mp4|webm)/;
  const allowedImage = /image\/(jpeg|jpg|png|webp|svg\+xml)/;

  if (allowedAudio.test(file.mimetype) || allowedImage.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Format de fichier non supporté. Utilisez MP3, OGG, WAV, JPEG, PNG ou WebP.'));
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB max
  fileFilter,
});
