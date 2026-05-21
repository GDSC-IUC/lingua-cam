import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, MoreVertical, RefreshCcw, Volume2, Check } from 'lucide-react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppLanguageStore } from '../store/appLanguageStore';

export default function ReviewScreen() {
  const { t } = useAppLanguageStore();
  return (
    <SafeAreaView className="flex-1 bg-surface">
      {/* Header */}
      <View className="flex-row justify-between items-center px-6 py-4">
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft color="#006850" size={24} />
        </TouchableOpacity>
        <Text className="text-primary font-jakarta-bold text-xl">{t('review.title')}</Text>
        <TouchableOpacity>
          <MoreVertical color="#006850" size={24} />
        </TouchableOpacity>
      </View>

      {/* Progress Dots */}
      <View className="flex-row items-center justify-center space-x-2 my-4">
        <View className="w-2 h-2 rounded-full bg-tertiary-fixed" />
        <View className="w-2 h-2 rounded-full bg-tertiary-fixed" />
        <View className="w-4 h-4 rounded-full bg-primary items-center justify-center p-1" />
        <View className="w-2 h-2 rounded-full bg-primary-container" />
        <View className="w-2 h-2 rounded-full bg-primary-container" />
        <Text className="text-primary font-jakarta ml-2">3 of 5</Text>
      </View>

      <View className="flex-1 px-6 items-center pt-2">
        {/* Flashcard géante */}
        <View className="w-full bg-white rounded-[48px] p-6 items-center shadow-griot relative overflow-hidden min-h-[450px]">
          {/* Flip icon top right */}
          <TouchableOpacity className="absolute top-6 right-6 w-10 h-10 bg-surface rounded-full items-center justify-center z-10">
            <RefreshCcw color="#006850" size={18} />
          </TouchableOpacity>

          {/* Character illustration */}
          <View className="w-48 h-48 mb-6 mt-4">
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1506803682981-6e718a9dd3ee?q=80&w=300&auto=format&fit=crop' }} 
              className="w-full h-full rounded-full"
            />
          </View>

          <View className="bg-tertiary-fixed px-4 py-1 rounded-full mb-3">
            <Text className="text-tertiary font-jakarta-bold text-xs uppercase tracking-widest">Ewondo</Text>
          </View>

          <Text className="text-5xl font-jakarta-bold text-primary mb-6">Aboro</Text>

          {/* Audio Button */}
          <TouchableOpacity className="w-16 h-16 bg-primary-container rounded-full items-center justify-center mb-8 shadow-griot">
            <Volume2 color="#006850" size={24} fill="#006850" />
          </TouchableOpacity>

          <View className="w-24 h-px bg-surface-low mb-6" />

          <Text className="text-primary font-jakarta text-xl">Hello</Text>
        </View>

        {/* Actions en bas */}
        <View className="flex-row w-full space-x-4 justify-between mt-auto mb-10 pt-4">
          <TouchableOpacity 
            className="flex-1 rounded-[32px] bg-primary-container p-4 items-center justify-center min-h-[120px] shadow-griot"
          >
            <RefreshCcw color="#fbd115" size={28} className="mb-3" />
            <Text className="text-primary font-jakarta-bold text-base">{t('review.needPractice')}</Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.8} className="flex-1 rounded-[32px] shadow-griot">
             <LinearGradient
                colors={['#006850', '#00A87F']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="flex-1 rounded-[32px] p-4 items-center justify-center min-h-[120px]"
             >
                <View className="w-8 h-8 rounded-full bg-white items-center justify-center mb-3">
                  <Check color="#006850" size={18} strokeWidth={3} />
                </View>
                <Text className="text-white font-jakarta-bold text-base">{t('review.iKnowThis')}</Text>
             </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
