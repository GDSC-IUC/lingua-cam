import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LANGUAGES } from '../constants/languages';
import { useLanguageStore } from '../store/languageStore';
import { useAppLanguageStore } from '../store/appLanguageStore';
import { useUserStore } from '../store/userStore';

export default function LanguageSelectionScreen() {
  const { selectedLanguageId, setLanguage } = useLanguageStore();
  const { t } = useAppLanguageStore();
  const { userName } = useUserStore();

  function handleSelectLanguage(code: string) {
    setLanguage(code);
    // Si pas de nom défini → onboarding, sinon → accueil
    if (!userName) {
      router.replace('/onboarding');
    } else {
      router.replace('/(tabs)');
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{t('languageSelection.choose')}</Text>
          <Text style={styles.description}>{t('languageSelection.description')}</Text>
        </View>

        {/* Liste des langues */}
        <View style={styles.list}>
          {LANGUAGES.map((lang) => {
            const isSelected = selectedLanguageId === lang.code;
            const isPhase1 = lang.phase === 1;

            return (
              <TouchableOpacity
                key={lang.code}
                activeOpacity={isPhase1 ? 0.75 : 1}
                onPress={() => isPhase1 && handleSelectLanguage(lang.code)}
                style={[
                  styles.card,
                  isSelected && styles.cardSelected,
                  !isPhase1 && styles.cardDisabled,
                ]}
              >
                {/* Bannière avec Image Culturelle ou Emoji */}
                <View style={[styles.cardBanner, { backgroundColor: lang.color + '22' }]}>
                  {lang.image ? (
                    <Image source={lang.image} style={styles.cardImage} resizeMode="cover" />
                  ) : (
                    <Text style={styles.emoji}>{lang.emoji}</Text>
                  )}
                  {/* Overlay optionnel pour adoucir l'image et lier le design */}
                  {lang.image && (
                    <View style={[styles.imageOverlay, { backgroundColor: lang.color + '40' }]} />
                  )}
                  {!isPhase1 && (
                    <View style={styles.comingSoonBadge}>
                      <Text style={styles.comingSoonText}>{t('languageSelection.comingSoon')}</Text>
                    </View>
                  )}
                </View>

                <View style={styles.cardBody}>
                  <Text style={[styles.langName, !isPhase1 && styles.dimmed]}>{lang.name}</Text>
                  <Text style={styles.langRegion}>{lang.region} · {t('languageSelection.region')}</Text>
                </View>

                {/* Indicateur de sélection */}
                {isSelected && (
                  <View style={[styles.selectedDot, { backgroundColor: lang.color }]} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d6fff4',
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 24,
    marginBottom: 28,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#006850',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 36,
  },
  description: {
    fontSize: 14,
    color: '#00362e',
    textAlign: 'center',
    lineHeight: 22,
  },
  list: {
    gap: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    marginBottom: 4,
    shadowColor: '#00362e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  cardSelected: {
    borderColor: '#90efcd',
    backgroundColor: '#f0fff8',
  },
  cardDisabled: {
    opacity: 0.55,
  },
  cardBanner: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  emoji: {
    fontSize: 48,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  comingSoonBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  comingSoonText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  cardBody: {
    padding: 16,
  },
  langName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#00362e',
    marginBottom: 4,
  },
  dimmed: {
    color: '#6B7280',
  },
  langRegion: {
    fontSize: 13,
    color: '#6B7280',
  },
  selectedDot: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
