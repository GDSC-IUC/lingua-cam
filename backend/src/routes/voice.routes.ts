import { Router } from 'express';
import { scoreVoice } from '../controllers/voice.controller';
import multer from 'multer';
import path from 'path';

const router = Router();

// Configure multer for temp storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.post('/score', upload.single('audio'), scoreVoice);

export default router;
