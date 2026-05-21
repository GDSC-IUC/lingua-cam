import { Router } from 'express';
import { searchDictionary } from '../controllers/dictionary.controller';

const router = Router();

router.get('/', searchDictionary);

export default router;
