import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Star, Play, Flame, Disc, Globe } from 'lucide-react-native';
import { TonalCard } from '../../components/ui/TonalCard';
import { router } from 'expo-router';
import { useAppLanguageStore } from '../../store/appLanguageStore';
import { useLanguageStore } from '../../store/languageStore';
import { LANGUAGES } from '../../constants/languages';
import { useLanguages, useLessons } from '../../hooks/useQueries';
import { useProgressStore } from '../../store/progressStore';
import { useUserStore } from '../../store/userStore';
import { getLevel, levelProgress, xpForNextLevel } from '../../utils/levelSystem';

export default function HomeScreen() {
  const { t } = useAppLanguageStore();
  const { selectedLanguageId } = useLanguageStore();

  // Nom de la langue depuis le store local — instantané, pas d'API
  const selectedLangConfig = LANGUAGES.find(l => l.code === selectedLanguageId);
  const selectedLangName = selectedLangConfig?.name ?? selectedLanguageId ?? '...';

  // Fetch all languages once (cached) to get the MongoDB _id matching the chosen code
  const { data: languages, isLoading: isLoadingLanguages, error: langError, isError: isLangError } = useLanguages();
  const currentLanguage = languages?.find(l => (l as any).code === selectedLanguageId);

  // Fetch lessons only when we have the DB language id
  const { data: lessons, isLoading: isLoadingLessons, error: lessonError, isError: isLessonError } = useLessons(currentLanguage?._id);
  
  // Progression Locale !
  const { getCompletedCountByLanguage, completedLessons, totalXp, currentStreak, wordsToReview } = useProgressStore();
  const completedCount = currentLanguage ? getCompletedCountByLanguage(currentLanguage._id) : 0;
  const totalLessons = lessons?.length || 1; // evite division par 0
  const percentage = Math.round((completedCount / totalLessons) * 100) || 0;
  const hasStarted = completedCount > 0;
  const userLevel = getLevel(totalXp);

  // Nom utilisateur
  const { userName } = useUserStore();

  // Défi quotidien
  const { getDailyChallenge } = useProgressStore();
  const dailyChallenge = getDailyChallenge();

  const handleChallengePress = () => {
    if (dailyChallenge.completed) {
      Alert.alert(
        t('home.dailyChallenge') || 'Défi Quotidien',
        'Vous avez déjà complété le défi du jour ! \nRendez-vous demain pour un nouveau défi. 💪',
        [{ text: 'OK' }]
      );
    } else {
      router.push('/challenge');
    }
  };

  // Détection fin de langue : première leçon non validée. Si aucune → tout est fait.
  const nextUncompletedLesson = lessons?.find(l => !completedLessons.some(c => c.lessonId === l._id));
  const allLessonsCompleted = lessons && lessons.length > 0 && !nextUncompletedLesson;
  // La leçon affichée : soit la prochaine non faite, soit la première si tout est fait (pour recommencer)
  const currentLesson = nextUncompletedLesson || lessons?.[0];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{t('home.greeting')}</Text>
            <Text style={styles.name}>{userName || 'Learner'}!</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              onPress={() => router.push('/language-selection')}
              style={styles.globeBtn}
              activeOpacity={0.7}
            >
              <Globe color="#006850" size={20} />
            </TouchableOpacity>
            <View style={styles.levelBadge}>
              <Star color="#6e5a00" size={14} fill="#fbd115" />
              <View style={{ marginLeft: 6 }}>
                <Text style={styles.levelText}>Niveau {userLevel}</Text>
                <Text style={styles.xpText}>{totalXp} XP  •  {currentStreak} 🔥</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Hero Card — Leçon actuelle ou Récap */}
        <View style={styles.heroCard}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>
              {allLessonsCompleted ? t('home.allLessonsCompleted') : t('home.currentLessonBadge')}
            </Text>
          </View>

          {isLoadingLanguages || isLoadingLessons ? (
            <View style={styles.heroLoading}>
              <ActivityIndicator color="#ffffff" size="small" />
              <Text style={styles.heroLoadingText}>Chargement {selectedLangName}...</Text>
            </View>
          ) : isLangError || isLessonError ? (
            <View style={styles.heroLoading}>
              <Text style={styles.heroDesc}>Erreur réseau: {langError?.message || lessonError?.message}. Vérifiez la connexion.</Text>
            </View>
          ) : !currentLanguage ? (
            <View style={styles.heroLoading}>
              <Text style={styles.heroDesc}>Langue non trouvée dans la base de données.</Text>
            </View>
          ) : allLessonsCompleted ? (
            <>
              <Text style={styles.heroTitle}>
                {t('home.perfectYourSkills')} — {selectedLangName} ✨
              </Text>
              <Text style={styles.heroDesc}>
                {t('home.masterDesc')}
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.heroTitle}>
                {currentLesson ? currentLesson.title : `Apprendre le ${selectedLangName}`}
              </Text>
              <Text style={styles.heroDesc}>
                {currentLesson?.description ??
                  `Commencez votre voyage d'apprentissage avec la langue ${selectedLangName}.`}
              </Text>
            </>
          )}

          <TouchableOpacity
            style={styles.heroBtn}
            activeOpacity={0.8}
            onPress={() => router.push(currentLesson ? `/lesson/${currentLesson._id}` : '/(tabs)/practice')}
          >
            <Play color="#006850" size={16} fill="#006850" />
            <Text style={styles.heroBtnText}>
              {allLessonsCompleted 
                ? t('home.perfectYourSkills')
                : hasStarted 
                  ? t('home.continueLearning') 
                  : 'Commencer'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Daily Goal (Progress Local) */}
        <TonalCard className="mb-6 items-center py-8 bg-white border border-surface-low">
          <Text className="text-gray-900 font-jakarta-bold text-xl mb-4">{t('home.dailyGoal')} ({selectedLangName})</Text>
          <View className="w-32 h-32 rounded-full border-8 border-primary justify-center items-center mb-4">
            <Text className="text-primary font-jakarta-bold text-3xl">{percentage}%</Text>
            <Text className="text-gray-500 font-jakarta-bold text-[10px] uppercase">{t('home.complete')}</Text>
          </View>
          <Text className="text-gray-500 font-jakarta text-sm">{completedCount} / {lessons?.length || 0} Leçons Terminées</Text>
        </TonalCard>

        {/* Daily Challenge */}
        <TonalCard variant="tertiary" className={`mb-6 flex-row items-center border border-[#f5b800]/20 ${dailyChallenge.completed ? 'opacity-60' : ''}`}>
          <View className="bg-[#e5a000]/20 p-4 rounded-full mr-4">
            <Flame color="#6e5a00" size={24} fill="#6e5a00" />
          </View>
          <View className="flex-1">
            <Text className="text-tertiary font-jakarta-bold text-lg">{t('home.dailyChallenge')}</Text>
            <Text className="text-tertiary/80 font-jakarta text-sm">{dailyChallenge.completed ? '✅ Complété !' : t('home.challengeDesc')}</Text>
          </View>
          <TouchableOpacity
            style={styles.challengeBtn}
            onPress={handleChallengePress}
            activeOpacity={0.8}
          >
            <Text style={styles.challengeBtnText}>{dailyChallenge.completed ? '✅' : t('home.start')}</Text>
          </TouchableOpacity>
        </TonalCard>

        {/* Review Session */}
        <TouchableOpacity activeOpacity={0.9} onPress={() => router.push('/(tabs)/practice')}>
          <TonalCard variant="low" className="mb-10 flex-row items-center">
            <View className="bg-primary/10 p-4 rounded-full mr-4">
              <Disc color="#006850" size={24} fill="#006850" />
            </View>
            <View className="flex-1 mr-2">
              <Text className="text-gray-900 font-jakarta-bold text-lg">{t('home.reviewSession')}</Text>
              <Text className="text-primary font-jakarta text-sm">{wordsToReview.length} mots à réviser</Text>
            </View>
            <View className="bg-primary-container px-4 py-2 rounded-full">
              <Text className="text-primary font-jakarta-bold">Réviser</Text>
            </View>
          </TonalCard>
        </TouchableOpacity>

        <View style={{ height: 120 }} />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 16,
    marginBottom: 24,
  },
  greeting: {
    color: 'rgba(0,104,80,0.7)',
    fontSize: 16,
    marginBottom: 2,
  },
  name: {
    color: '#006850',
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 38,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  globeBtn: {
    backgroundColor: '#bcfeee',
    borderRadius: 999,
    padding: 10,
  },
  levelBadge: {
    backgroundColor: '#90efcd',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelText: {
    color: '#006850',
    fontSize: 12,
    fontWeight: '700',
  },
  xpText: {
    color: '#006850',
    fontSize: 11,
  },
  heroCard: {
    backgroundColor: '#006850',
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    minHeight: 200,
    shadowColor: '#00362e',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 6,
  },
  heroBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 14,
  },
  heroBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  heroTitle: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 8,
    lineHeight: 32,
  },
  heroDesc: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  heroLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  heroLoadingText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  heroBtn: {
    backgroundColor: '#90efcd',
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
  },
  heroBtnText: {
    color: '#006850',
    fontSize: 15,
    fontWeight: '700',
  },
  challengeBtn: {
    backgroundColor: '#6e5a00',
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  challengeBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});
