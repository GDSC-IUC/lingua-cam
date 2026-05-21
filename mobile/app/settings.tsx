import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Edit3, Lock, Link as LinkIcon, Bell, Volume2, LogOut, ChevronRight, Globe, Check, Trash2, AlertTriangle } from 'lucide-react-native';
import { router } from 'expo-router';
import { TonalCard } from '../components/ui/TonalCard';
import { useAppLanguageStore } from '../store/appLanguageStore';
import { useProgressStore } from '../store/progressStore';
import { useUserStore } from '../store/userStore';
import { useLanguageStore } from '../store/languageStore';
import { getLevel } from '../utils/levelSystem';

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const { language, setLanguage, t } = useAppLanguageStore();
  const { totalXp, resetProgress } = useProgressStore();
  const { userName, resetUser } = useUserStore();
  const { setLanguage: setLearningLanguage } = useLanguageStore();
  const userLevel = getLevel(totalXp);
  const initials = (userName || 'NK').slice(0, 2).toUpperCase();

  const handleDeleteAllData = () => {
    Alert.alert(
      t('settings.deleteDataTitle'),
      t('settings.deleteDataMessage'),
      [
        { text: t('settings.cancel'), style: 'cancel' },
        {
          text: t('settings.deleteConfirm'),
          style: 'destructive',
          onPress: () => {
            resetProgress();
            resetUser();
            setLearningLanguage('ewondo');
            // Naviguer vers language-selection sans passer par le splash
            // pour éviter le conflit de timer expo-keep-awake
            router.replace('/language-selection');
          },
        },
      ]
    );
  };

  const SettingRow = ({ icon, title, isToggle, value, onToggle, onPress }: any) => (
    <TouchableOpacity 
      activeOpacity={isToggle ? 1 : 0.7} 
      onPress={onPress}
      className="flex-row items-center py-4"
    >
      <View className="w-10 h-10 rounded-full bg-surface items-center justify-center mr-4 flex-shrink-0">
        {icon}
      </View>
      <Text className="text-primary font-jakarta-medium text-lg flex-1">{title}</Text>
      {isToggle ? (
        <Switch 
          value={value} 
          onValueChange={onToggle}
          trackColor={{ false: '#d1e3df', true: '#006850' }}
          thumbColor="#ffffff"
        />
      ) : (
        <ChevronRight color="#006850" size={20} style={{ flexShrink: 0 }} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-surface pt-4">
      <View className="flex-row items-center justify-between mb-8 px-6">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="w-12 h-12 bg-surface rounded-full items-center justify-center -ml-2"
        >
          <ArrowLeft color="#006850" size={24} />
        </TouchableOpacity>
        <Text className="text-primary font-jakarta-bold text-xl">{t('settings.title')}</Text>
        <View className="w-12" />
      </View>

      <ScrollView className="flex-1 px-6 pb-20" showsVerticalScrollIndicator={false}>
        {/* Profile Card Summary */}
        <TonalCard variant="low" className="mb-8 flex-row items-center px-6 py-6">
          <View className="w-20 h-20 bg-primary rounded-full items-center justify-center mr-4 border-2 border-primary-container">
            <Text className="text-white font-jakarta-bold text-2xl">{initials}</Text>
          </View>
          <View>
            <Text className="text-primary font-jakarta-bold text-2xl mb-1">{userName || 'Lingua-Cam Learner'}</Text>
            <Text className="text-primary/70 font-jakarta text-sm mb-3">{totalXp} XP</Text>
            <View className="bg-tertiary-fixed self-start px-3 py-1 rounded-full flex-row items-center">
              <Text className="text-tertiary font-jakarta-semibold text-xs">★ Niveau {userLevel}</Text>
            </View>
          </View>
        </TonalCard>

        {/* Account Section */}
        <Text className="text-primary font-jakarta-bold text-lg mb-4">{t('settings.account')}</Text>
        <TonalCard className="mb-8 p-2 px-4 shadow-griot">
          <SettingRow icon={<Edit3 color="#006850" size={20} />} title={t('settings.editProfile')} />
          <View className="h-px bg-surface-low w-full" />
          <SettingRow icon={<Lock color="#006850" size={20} />} title={t('settings.changePassword')} />
          <View className="h-px bg-surface-low w-full" />
          <SettingRow icon={<LinkIcon color="#006850" size={20} />} title={t('settings.linkedAccounts')} />
          <View className="h-px bg-surface-low w-full" />
          <TouchableOpacity 
            activeOpacity={0.7} 
            onPress={() => setShowLanguagePicker(!showLanguagePicker)}
            className="flex-row items-center py-4"
          >
            <View className="w-10 h-10 rounded-full bg-surface items-center justify-center mr-4 flex-shrink-0">
              <Globe color="#006850" size={20} />
            </View>
            <Text className="text-primary font-jakarta-medium text-lg flex-1">{t('settings.appLanguage')}</Text>
            <Text className="text-primary/70 font-jakarta text-sm mr-2 flex-shrink-0">{language === 'en' ? t('settings.english') : t('settings.french')}</Text>
            <ChevronRight color="#006850" size={20} style={{ flexShrink: 0, transform: [{ rotate: showLanguagePicker ? '90deg' : '0deg' }] }} />
          </TouchableOpacity>
          {showLanguagePicker && (
            <View className="ml-14 mr-4 mb-4">
              <TouchableOpacity onPress={() => setLanguage('en')} className="flex-row items-center justify-between py-3">
                <Text className={`font-jakarta-medium ${language === 'en' ? 'text-primary' : 'text-primary/60'}`}>{t('settings.english')}</Text>
                {language === 'en' && <Check color="#006850" size={16} />}
              </TouchableOpacity>
              <View className="h-px bg-surface-low w-full" />
              <TouchableOpacity onPress={() => setLanguage('fr')} className="flex-row items-center justify-between py-3">
                <Text className={`font-jakarta-medium ${language === 'fr' ? 'text-primary' : 'text-primary/60'}`}>{t('settings.french')}</Text>
                {language === 'fr' && <Check color="#006850" size={16} />}
              </TouchableOpacity>
            </View>
          )}
        </TonalCard>

        {/* Legal Links */}
        <Text className="text-primary font-jakarta-bold text-lg mb-4">{t('settings.legal')}</Text>
        <TonalCard className="mb-8 p-2 px-4 shadow-griot">
          <SettingRow icon={<Lock color="#006850" size={20} />} title={t('settings.privacyPolicy')} onPress={() => router.push('/privacy')} />
          <View className="h-px bg-surface-low w-full" />
          <SettingRow icon={<Edit3 color="#006850" size={20} />} title={t('settings.termsOfService')} onPress={() => router.push('/terms')} />
        </TonalCard>

        {/* Danger Zone */}
        <Text className="text-red-500 font-jakarta-bold text-lg mb-4">{t('settings.dangerZone')}</Text>
        <TonalCard className="mb-8 p-2 px-4 border border-red-200">
          <TouchableOpacity 
            activeOpacity={0.7} 
            onPress={handleDeleteAllData}
            className="flex-row items-center py-4"
          >
            <View className="w-10 h-10 rounded-full bg-red-50 items-center justify-center mr-4 flex-shrink-0">
              <Trash2 color="#ef4444" size={20} />
            </View>
            <View className="flex-1 mr-3">
              <Text className="text-red-500 font-jakarta-medium text-lg">{t('settings.deleteAllData')}</Text>
              <Text className="text-red-400/70 font-jakarta text-xs">{t('settings.deleteAllDataDesc')}</Text>
            </View>
            <AlertTriangle color="#ef4444" size={20} style={{ flexShrink: 0 }} />
          </TouchableOpacity>
        </TonalCard>

        {/* Logout Button */}
        <TouchableOpacity activeOpacity={0.8} className="bg-red-500 rounded-full py-4 flex-row justify-center items-center mb-4">
          <LogOut color="white" size={20} className="mr-2" />
          <Text className="text-white font-jakarta-bold text-lg">{t('settings.logOut')}</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
