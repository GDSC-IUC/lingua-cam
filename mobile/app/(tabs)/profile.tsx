import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Settings, Award, Zap, Flame, BookOpen, Calendar, Globe } from 'lucide-react-native';
import { TonalCard } from '../../components/ui/TonalCard';
import { router } from 'expo-router';
import { useAppLanguageStore } from '../../store/appLanguageStore';
import { useProgressStore } from '../../store/progressStore';
import { useUserStore } from '../../store/userStore';
import { getLevel } from '../../utils/levelSystem';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useAppLanguageStore();
  const { totalXp, completedLessons, currentStreak } = useProgressStore();
  const { userName } = useUserStore();
  const userLevel = getLevel(totalXp);
  const initials = (userName || 'NK').slice(0, 2).toUpperCase();

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView className="flex-1 px-6 pt-4 pb-32" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between mb-8">
          <Text className="text-primary font-jakarta-bold text-3xl">{t('profile.title')}</Text>
          <TouchableOpacity 
            activeOpacity={0.7} 
            onPress={() => router.push('/settings')}
            className="w-12 h-12 bg-white rounded-full items-center justify-center"
          >
            <Settings color="#006850" size={24} />
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View className="items-center mb-8">
          <View className="w-28 h-28 bg-primary rounded-full items-center justify-center mb-4 shadow-griot">
             <Text className="text-white font-jakarta-bold text-4xl">{initials}</Text>
          </View>
          <Text className="text-primary font-jakarta-bold text-2xl">{userName || 'Lingua-Cam Learner'}</Text>
          <Text className="text-primary/70 font-jakarta-medium text-base mb-4">Niveau {userLevel}</Text>
          
          <View className="bg-primary/10 px-4 py-2 rounded-full">
            <Text className="text-primary font-jakarta-bold">{totalXp} XP Total</Text>
          </View>
        </View>

        {/* Stats */}
        <View className="flex-row space-x-4 mb-8">
          <TonalCard className="flex-1 p-4 items-center shadow-griot mr-2">
            <Text className="text-primary font-jakarta-bold text-2xl mb-1">{completedLessons.length}</Text>
            <Text className="text-primary/70 font-jakarta text-xs text-center">{t('profile.lessonsCompleted')}</Text>
          </TonalCard>
          <TonalCard className="flex-1 p-4 items-center shadow-griot ml-2">
            <Text className="text-primary font-jakarta-bold text-2xl mb-1">{currentStreak} 🔥</Text>
            <Text className="text-primary/70 font-jakarta text-xs text-center">{t('profile.dayStreak')}</Text>
          </TonalCard>
        </View>

        {/* Achievements Section */}
        <Text className="text-primary font-jakarta-bold text-xl mb-4 mt-2">{t('profile.achievements')}</Text>

        {/* Grid 2x2 Badges */}
        <View className="flex-row flex-wrap justify-between pb-32">
          {[
            { id: 1, title: 'Early Bird', desc: 'Completed 5 morning lessons', icon: <Flame color="#6e5a00" size={24} />, bg: 'bg-[#fbd115]' },
            { id: 2, title: 'Perfect Week', desc: '7 day streak achieved', icon: <Calendar color="#006850" size={24} />, bg: 'bg-[#90efcd]' },
            { id: 3, title: 'Ewondo Specialist', desc: 'Level 3 in Ewondo', icon: <Globe color="#ba001e" size={24} />, bg: 'bg-[#ffb3c1]' },
            { id: 4, title: 'Bassa Beginner', desc: 'Complete first Bassa lesson', icon: <Award color="#6b7280" size={24} />, bg: 'bg-gray-200', inactive: true },
          ].map(badge => (
            <TonalCard key={badge.id} className="w-[47%] mb-4 items-center px-2 py-6">
              <View className={`${badge.bg} w-16 h-16 rounded-full items-center justify-center mb-3 ${badge.inactive ? 'opacity-50' : ''}`}>
                {badge.icon}
              </View>
              <Text className={`font-jakarta-bold text-center text-sm mb-1 ${badge.inactive ? 'text-gray-500' : 'text-primary'}`}>{badge.title}</Text>
              <Text className="font-jakarta text-center text-[10px] text-gray-500">{badge.desc}</Text>
            </TonalCard>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
