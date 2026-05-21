import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Trophy, Globe, Home, BookOpen, RotateCcw } from 'lucide-react-native';
import { GriotButton } from '../components/ui/GriotButton';
import { TonalCard } from '../components/ui/TonalCard';
import { useAppLanguageStore } from '../store/appLanguageStore';
import { useLanguageStore } from '../store/languageStore';
import { useProgressStore } from '../store/progressStore';
import { useLanguages, useLessons } from '../hooks/useQueries';
import { getLevel } from '../utils/levelSystem';

export default function LanguageCompleteScreen() {
  const { t } = useAppLanguageStore();
  const { selectedLanguageId } = useLanguageStore();
  const { data: languages } = useLanguages();
  const currentLanguage = languages?.find(l => (l as any).code === selectedLanguageId);
  const { data: lessons } = useLessons(currentLanguage?._id);
  const { getCompletedCountByLanguage, totalXp, wordsToReview } = useProgressStore();

  const langName = currentLanguage?.name || selectedLanguageId || '...';
  const completedCount = currentLanguage ? getCompletedCountByLanguage(currentLanguage._id) : 0;
  const totalLessons = lessons?.length || 0;
  const userLevel = getLevel(totalXp);

  // Mots à réviser pour cette langue uniquement
  const langWordsToReview = wordsToReview.filter(w => 
    lessons?.some(l => l._id === w.lessonId)
  );

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ alignItems: 'center', paddingHorizontal: 24, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Gradient */}
        <LinearGradient
          colors={['#006850', '#90efcd']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="w-full rounded-[32px] items-center py-10 px-6 mt-6 mb-8"
        >
          <Text className="text-7xl mb-4">🎓</Text>
          <Text className="text-3xl font-jakarta-bold text-white text-center mb-2">
            {t('languageComplete.title')}
          </Text>
          <Text className="text-lg font-jakarta text-white/90 text-center">
            {t('languageComplete.subtitle').replace('{lang}', langName)}
          </Text>
        </LinearGradient>

        {/* Stats Recap */}
        <View className="flex-row w-full space-x-3 mb-6">
          <TonalCard className="flex-1 p-4 items-center mr-2">
            <Text className="text-3xl font-jakarta-bold text-primary mb-1">{completedCount}</Text>
            <Text className="text-primary/70 font-jakarta text-xs text-center">{t('languageComplete.lessonsCompleted')}</Text>
          </TonalCard>
          <TonalCard className="flex-1 p-4 items-center mx-1">
            <Text className="text-3xl font-jakarta-bold text-primary mb-1">{totalXp}</Text>
            <Text className="text-primary/70 font-jakarta text-xs text-center">XP</Text>
          </TonalCard>
          <TonalCard className="flex-1 p-4 items-center ml-2">
            <Text className="text-3xl font-jakarta-bold text-primary mb-1">{userLevel}</Text>
            <Text className="text-primary/70 font-jakarta text-xs text-center">{t('languageComplete.level')}</Text>
          </TonalCard>
        </View>

        {/* Words to Review Card */}
        {langWordsToReview.length > 0 && (
          <TonalCard className="w-full p-5 mb-6 flex-row items-center">
            <View className="w-12 h-12 bg-[#fbd115]/20 rounded-full items-center justify-center mr-4">
              <BookOpen color="#6e5a00" size={22} />
            </View>
            <View className="flex-1">
              <Text className="text-primary font-jakarta-bold text-base">
                {t('languageComplete.wordsToReview')}
              </Text>
              <Text className="text-primary/70 font-jakarta text-sm">
                {langWordsToReview.length} {t('languageComplete.wordsToReviewCount')}
              </Text>
            </View>
            <TouchableOpacity 
              onPress={() => router.replace('/(tabs)/practice')}
              className="bg-primary-container px-4 py-2 rounded-full"
            >
              <Text className="text-primary font-jakarta-bold text-sm">{t('languageComplete.reviewNow')}</Text>
            </TouchableOpacity>
          </TonalCard>
        )}

        {/* Encouragement Message */}
        <View className="w-full bg-white rounded-[24px] p-6 mb-8 border border-primary/10">
          <Text className="text-primary font-jakarta-bold text-lg mb-2 text-center">
            {t('languageComplete.whatsNext')}
          </Text>
          <Text className="text-primary/70 font-jakarta text-sm text-center leading-5">
            {t('languageComplete.whatsNextDesc').replace('{lang}', langName)}
          </Text>
        </View>

        {/* Action Buttons */}
        <View className="w-full space-y-4">
          {/* Apprendre une autre langue */}
          <GriotButton
            title={t('languageComplete.learnAnotherLanguage')}
            onPress={() => router.replace('/language-selection')}
            icon={<Globe color="white" size={20} />}
            className="w-full mb-4"
          />

          {/* Retour à l'accueil */}
          <TouchableOpacity
            onPress={() => router.replace('/(tabs)')}
            className="w-full py-4 rounded-full border-2 border-primary/30 items-center flex-row justify-center"
          >
            <Home color="#006850" size={18} />
            <Text className="text-primary font-jakarta-bold text-lg ml-2">
              {t('languageComplete.backToHome')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
