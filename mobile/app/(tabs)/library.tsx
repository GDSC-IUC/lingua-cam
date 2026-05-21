import React from 'react';
import { View, Text } from 'react-native';
import { useAppLanguageStore } from '../../store/appLanguageStore';

export default function LibraryScreen() {
  const { t } = useAppLanguageStore();
  
  return (
    <View className="flex-1 bg-surface justify-center items-center">
      <Text className="font-jakarta-bold text-xl text-primary">{t('tabs.library')} ({t('common.comingSoon')})</Text>
    </View>
  );
}
