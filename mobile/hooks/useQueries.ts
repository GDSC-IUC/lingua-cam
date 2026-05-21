import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '../services/api';

// --- TYPES ---
export interface Language {
  _id: string;
  code: string;
  name: string;
  region: string;
  color?: string;
  gradientColors?: string[];
  description?: string;
  speakersEstimate?: number;
  phase?: number;
  isActive?: boolean;
  order?: number;
  lessonCount?: number;
}

export interface Lesson {
  _id: string;
  title: string;
  description: string;
  languageId: string;
  order: number;
  xpReward?: number;
  vocabulary: VocabularyItem[];
}

export interface VocabularyItem {
  _id: string;
  lessonId: string;
  word: string;
  meaning: string;
  meaningEn?: string;
  phonetic?: string;
  audioUrl?: string;
  imageUrl?: string;
  exampleSentence?: string;
  exampleTranslation?: string;
  tags?: string[];
}

export interface VoiceScoreResponse {
  score: number;
  spokenText: string;
  targetText: string;
}

// --- QUERIES ---

export const useLanguages = () => {
  return useQuery({
    queryKey: ['languages'],
    queryFn: async () => {
      const response = await api.get('/languages');
      return response.data.data as Language[];
    },
  });
};

export const useLessons = (languageId?: string) => {
  return useQuery({
    queryKey: ['lessons', languageId],
    queryFn: async () => {
      const response = await api.get(`/languages/${languageId}/lessons`);
      return response.data.data as Lesson[];
    },
    enabled: !!languageId,
  });
};

export const useLesson = (lessonId?: string) => {
  return useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: async () => {
      const response = await api.get(`/lessons/${lessonId}`);
      return response.data.data as Lesson;
    },
    enabled: !!lessonId,
  });
};

// Vocabulary is now included in lesson details, but we keep this as backup if needed
export const useVocabulary = (lessonId?: string) => {
  return useQuery({
    queryKey: ['vocabulary', lessonId],
    queryFn: async () => {
      const response = await api.get(`/vocabulary`, {
        params: { lessonId }
      });
      return response.data.data as VocabularyItem[];
    },
    enabled: !!lessonId,
  });
};

// --- MUTATIONS ---

export const useScoreVoice = () => {
  return useMutation({
    mutationFn: async ({ audioUri, targetText }: { audioUri: string; targetText: string }) => {
      const formData = new FormData();
      
      // Adapt the file object based on React Native's requirements to send FormData
      // file name and type might require inference or hardcoding based on the recorder
      const filename = audioUri.split('/').pop() || 'recording.m4a';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `audio/${match[1]}` : `audio/m4a`;

      formData.append('audio', {
        uri: audioUri,
        name: filename,
        type,
      } as any);

      formData.append('targetText', targetText);

      const response = await api.post('/voice/score', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data as VoiceScoreResponse;
    },
  });
};
