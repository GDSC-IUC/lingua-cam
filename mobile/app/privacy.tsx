import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Shield } from 'lucide-react-native';
import { router } from 'expo-router';
import { TonalCard } from '../components/ui/TonalCard';
import { useAppLanguageStore } from '../store/appLanguageStore';

export default function PrivacyScreen() {
  const { t } = useAppLanguageStore();

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center mb-8">
          <TouchableOpacity 
            activeOpacity={0.7} 
            onPress={() => router.back()}
            className="w-12 h-12 bg-surface rounded-full items-center justify-center -ml-2"
          >
            <ArrowLeft color="#006850" size={24} />
          </TouchableOpacity>
          <Text className="text-primary font-jakarta-bold text-xl ml-2">{t('privacy.title')}</Text>
        </View>

        {/* Hero Section */}
        <View className="mb-8">
          <View className="w-16 h-16 bg-primary-container rounded-full items-center justify-center mb-4">
            <Shield color="#006850" size={32} />
          </View>
          <Text className="text-primary font-jakarta-bold text-3xl">{t('privacy.title')}</Text>
        </View>

        {/* Content Sections */}
        <TonalCard className="p-5 mb-4 shadow-griot">
          <Text className="text-primary font-jakarta-bold text-lg mb-2">{t('privacy.dataCollection')}</Text>
          <Text className="text-primary/80 font-jakarta text-base leading-6">
            {t('privacy.dataCollectionDesc')}
          </Text>
        </TonalCard>

        <TonalCard className="p-5 mb-8 shadow-griot">
          <Text className="text-primary font-jakarta-bold text-lg mb-2">{t('privacy.yourRights')}</Text>
          <Text className="text-primary/80 font-jakarta text-base leading-6">
            {t('privacy.yourRightsDesc')}
          </Text>
        </TonalCard>

        <View className="items-center mb-4">
          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={() => router.back()}
            className="bg-primary px-8 py-4 rounded-full"
          >
            <Text className="text-white font-jakarta-bold text-lg">{t('common.back')}</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-center font-jakarta text-primary/50 text-xs mb-10">{t('privacy.lastUpdated')} {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
