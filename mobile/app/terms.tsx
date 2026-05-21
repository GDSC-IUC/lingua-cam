import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, FileText, CheckCircle2, XCircle } from 'lucide-react-native';
import { router } from 'expo-router';
import { useAppLanguageStore } from '../store/appLanguageStore';

export default function TermsScreen() {
  const { t } = useAppLanguageStore();

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top', 'bottom']}>
      {/* Header Fixed */}
      <View className="px-6 pt-4 pb-2 border-b border-surface-low bg-surface">
        <TouchableOpacity 
          activeOpacity={0.7} 
          onPress={() => router.back()}
          className="w-12 h-12 rounded-full items-center justify-center -ml-2"
        >
          <ArrowLeft color="#006850" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
        {/* Title Block */}
        <View className="mb-10">
          <View className="w-16 h-16 bg-primary-container rounded-3xl items-center justify-center mb-6 shadow-griot">
            <FileText color="#006850" size={32} />
          </View>
          <Text className="text-primary font-jakarta-bold text-4xl mb-4">{t('terms.title')}</Text>
          <View className="bg-primary-container/60 self-start px-4 py-1 rounded-full">
            <Text className="text-primary font-jakarta-bold text-xs uppercase tracking-widest">
              {t('terms.lastUpdated')} {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' }).toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Section 1 */}
        <View className="mb-8">
          <Text className="text-primary font-jakarta-bold text-xl mb-4">{t('terms.usageRules')}</Text>
          <Text className="text-primary/80 font-jakarta text-base leading-6 mb-6">
            {t('terms.usageRulesDesc')}
          </Text>
          
          <View className="space-y-4">
            <View className="flex-row items-center">
              <CheckCircle2 color="#006850" size={20} className="mr-3" />
              <Text className="text-primary/90 font-jakarta-medium text-base">{t('terms.learnActively')}</Text>
            </View>
            <View className="flex-row items-center">
              <CheckCircle2 color="#006850" size={20} className="mr-3" />
              <Text className="text-primary/90 font-jakarta-medium text-base">{t('terms.shareFriends')}</Text>
            </View>
            <View className="flex-row items-center">
              <XCircle color="#ba1a1a" size={20} className="mr-3" />
              <Text className="text-primary/90 font-jakarta-medium text-base">{t('terms.scrapeData')}</Text>
            </View>
          </View>
        </View>

        {/* Section 2 */}
        <View className="mb-12">
          <Text className="text-primary font-jakarta-bold text-xl mb-4">{t('terms.intellectualProperty')}</Text>
          <Text className="text-primary/80 font-jakarta text-base leading-6">
            {t('terms.intellectualPropertyDesc')}
          </Text>
        </View>

      </ScrollView>

      {/* Sticky Bottom Button */}
      <View className="px-6 py-4 bg-surface border-t border-surface-low">
        <TouchableOpacity 
          activeOpacity={0.8}
          onPress={() => router.back()}
          className="bg-primary h-14 rounded-full flex-row items-center justify-center shadow-griot"
        >
          <Text className="text-white font-jakarta-bold text-lg">{t('terms.acknowledge')} →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
