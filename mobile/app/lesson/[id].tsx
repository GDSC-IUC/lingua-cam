import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Volume2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAudioPlayer } from 'expo-audio';
import * as Speech from 'expo-speech';
import { useAppLanguageStore } from '../../store/appLanguageStore';
import { useLesson, useLessons, Lesson } from '../../hooks/useQueries';
import { sanitizeForTTS } from '../../utils/textHelpers';

function LessonContent({ lesson, allLessons }: { lesson: Lesson; allLessons: Lesson[] }) {
  const { t } = useAppLanguageStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  const vocabulary = lesson.vocabulary || [];
  const currentWord = vocabulary[currentIndex];

  const player = useAudioPlayer(currentWord?.audioUrl || null);

  // Trouver la leçon suivante dans la liste globale de cette langue
  const currentIndexInLessons = allLessons.findIndex(l => l._id === lesson._id);
  const nextLesson = currentIndexInLessons !== -1 ? allLessons[currentIndexInLessons + 1] : undefined;

  const handlePlayAudio = () => {
    // S'il y'a un URL Backend, on utilise le player classique
    if (player && currentWord?.audioUrl) {
      player.play();
    } else if (currentWord?.word) {
      // Sinon on fait un Fallback TTS (utile tant qu'il n'y a pas d'audio dans la BDD)
      const sanitizedWord = sanitizeForTTS(currentWord.word);
      Speech.speak(sanitizedWord, { 
        language: 'fr-FR', // On utilise le francais comme base d'accent temporaire
        pitch: 0.9, 
        rate: 0.85 
      });
    }
  };

  const handleNext = () => {
    if (currentIndex < vocabulary.length - 1) {
      // Mot suivant
      setCurrentIndex(prev => prev + 1);
    } else {
      // Fin du vocabulaire de cette leçon : On passe directement à son Quiz de Validation !
      router.replace(`/quiz/${lesson._id}`);
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      {/* Header */}
      <View className="flex-row items-center px-6 py-4">
        <TouchableOpacity 
          className="w-10 h-10 bg-surface-low rounded-full items-center justify-center mr-4"
          onPress={handleBack}
        >
          <ArrowLeft color="#006850" size={20} />
        </TouchableOpacity>
        <Text className="flex-1 text-center font-jakarta-bold text-xl text-primary -ml-14">
          {lesson.title}
        </Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-4" contentContainerStyle={{ alignItems: 'center', paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {/* Image du mot ou illustration par défaut */}
        {currentWord?.imageUrl ? (
          <View className="w-full aspect-square bg-[#1a141b] rounded-[48px] overflow-hidden mb-8 shadow-griot">
             <Image 
               source={{ uri: currentWord.imageUrl }} 
               className="w-full h-full opacity-90"
               resizeMode="cover"
             />
          </View>
        ) : (
          <View className="w-full aspect-square bg-[#f0fff8] rounded-[48px] items-center justify-center mb-8 shadow-griot border-[6px] border-[#90efcd]/40" style={{ maxHeight: 280 }}>
            <Text className="text-[120px]">✨</Text>
          </View>
        )}

        {/* Mots massive typography */}
        <Text className="text-5xl font-jakarta-bold text-primary mb-2 text-center" numberOfLines={2}>
          {currentWord?.word || '...'}
        </Text>
        <Text className="text-xl font-jakarta text-primary/70 mb-10 text-center">
          {currentWord?.meaning || '...'}
        </Text>

        {/* Boutons d'action (Audio & Next) */}
        <View className="flex-row w-full space-x-4 justify-between">
          
          <TouchableOpacity 
            activeOpacity={0.8} 
            onPress={handlePlayAudio}
            className="flex-1 rounded-[32px] shadow-griot"
          >
            <LinearGradient
              colors={['#006850', '#90efcd']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="flex-1 rounded-[32px] p-6 items-center justify-center min-h-[140px]"
            >
              <Volume2 color="white" size={38} className="mb-3" />
              <Text className="text-white font-jakarta-bold text-xl">{t('lesson.playAudio') || 'Écouter'}</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            activeOpacity={0.8} 
            onPress={handleNext}
            className="flex-1 rounded-[32px] bg-primary-container p-6 items-center justify-center min-h-[140px] shadow-griot border-2 border-primary/20"
          >
            <Text className="text-primary font-jakarta-bold text-xl text-center">
              {currentIndex < vocabulary.length - 1 ? 'Suivant' : 'Passer au Quiz'}
            </Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const { data: lesson, isLoading, error } = useLesson(id);
  const { data: allLessons } = useLessons(lesson?.languageId);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-surface items-center justify-center">
        <ActivityIndicator size="large" color="#006850" />
      </SafeAreaView>
    );
  }

  if (error || !lesson) {
    return (
      <SafeAreaView className="flex-1 bg-surface items-center justify-center">
        <Text className="text-primary font-jakarta-bold">Error loading lesson</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4 bg-primary px-6 py-2 rounded-full">
          <Text className="text-white">Retour</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return <LessonContent lesson={lesson} allLessons={allLessons || []} />;
}
