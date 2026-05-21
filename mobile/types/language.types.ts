// Types partagés pour les données Nkolo
export interface Language {
  _id: string;
  code: string;
  name: string;
  region: string;
  color: string;
  gradientColors: string[];
  iconUrl?: string;
  speakersEstimate?: number;
  lessonCount: number;
  isActive: boolean;
}

export interface Lesson {
  _id: string;
  languageId: string;
  title: string;
  theme: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  order: number;
  xpReward: number;
  estimatedMinutes: number;
  audioIntroUrl?: string;
  illustrationUrl?: string;
  isOfflineAvailable: boolean;
  vocabulary?: VocabularyItem[];
}

export interface VocabularyItem {
  _id: string;
  lessonId: string;
  languageId: string;
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
}

export type QuizType = 'mcq_audio' | 'mcq_image' | 'drag_drop' | 'fill_blank' | 'voice' | 'order' | 'memory';

export interface QuizQuestion {
  type: QuizType;
  prompt?: string;
  audioUrl?: string;
  imageUrl?: string;
  options: string[];
  correctAnswer: string;
  xpValue: number;
}

export interface Quiz {
  _id: string;
  lessonId: string;
  passingScore: number;
  questions: QuizQuestion[];
}

export interface Story {
  _id: string;
  languageId: string;
  title: string;
  titleFr?: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  coverImageUrl?: string;
  totalPages: number;
  pages: StoryPage[];
}

export interface StoryPage {
  pageNumber: number;
  text: string;
  textFr?: string;
  imageUrl?: string;
  audioUrl?: string;
  audioDurationMs?: number;
}

export interface Song {
  _id: string;
  languageId: string;
  title: string;
  titleFr?: string;
  audioUrl: string;
  coverImageUrl?: string;
  category: 'traditional' | 'children' | 'modern';
  lyrics: SongLine[];
}

export interface SongLine {
  lineNumber: number;
  text: string;
  textFr?: string;
  startTimeMs: number;
  endTimeMs: number;
}
