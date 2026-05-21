import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Check, Trophy } from 'lucide-react-native';
import { router } from 'expo-router';
import { GriotButton } from '../components/ui/GriotButton';
import { useAppLanguageStore } from '../store/appLanguageStore';
import { useProgressStore } from '../store/progressStore';
import { useLanguageStore } from '../store/languageStore';
import { useLanguages, useLessons, useLesson, VocabularyItem } from '../hooks/useQueries';
import { checkPermissiveMatch } from '../utils/textHelpers';
import { shuffleArray } from '../utils/quizGenerator';
import * as Speech from 'expo-speech';
import { sanitizeForTTS } from '../utils/textHelpers';

// ─── Types de Défis ───────────────────────────────────────────────────
interface ChallengeConfig {
  title: string;
  description: string;
  emoji: string;
  xpReward: number;
}

const CHALLENGE_TEMPLATES: ChallengeConfig[] = [
  { title: 'Traducteur Éclair', description: 'Traduisez 3 mots en langue locale le plus vite possible !', emoji: '⚡', xpReward: 50 },
  { title: 'Oreille Absolue', description: 'Écoutez et écrivez le mot que vous entendez.', emoji: '👂', xpReward: 60 },
  { title: 'Mémoire Visuelle', description: 'Associez chaque mot à sa traduction correcte.', emoji: '🧠', xpReward: 45 },
  { title: 'Phrase Mystère', description: 'Complétez la phrase avec le bon mot.', emoji: '🔮', xpReward: 55 },
  { title: 'Sprint Vocabulaire', description: 'Trouvez la traduction de 5 mots d\'affilée !', emoji: '🏃', xpReward: 70 },
  { title: 'Défi Inversé', description: 'On vous donne le mot local, trouvez le sens en français.', emoji: '🔄', xpReward: 50 },
];

export default function ChallengeScreen() {
  const { t } = useAppLanguageStore();
  const { selectedLanguageId } = useLanguageStore();
  const { data: languages } = useLanguages();
  const currentLanguage = languages?.find(l => (l as any).code === selectedLanguageId);
  const { data: allLessons } = useLessons(currentLanguage?._id);
  
  const { getDailyChallenge, completeDailyChallenge, dailyChallengeCompleted } = useProgressStore();
  const challenge = getDailyChallenge();
  const config = CHALLENGE_TEMPLATES[challenge.index] || CHALLENGE_TEMPLATES[0];

  // Choisir une leçon au hasard (basé sur l'index du défi pour la stabilité du jour)
  const randomLessonId = allLessons && allLessons.length > 0
    ? allLessons[challenge.index % allLessons.length]._id
    : undefined;
  
  // Charger la leçon complète AVEC son vocabulaire via GET /lessons/:id
  const { data: fullLesson } = useLesson(randomLessonId);

  const [words, setWords] = useState<VocabularyItem[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [textInput, setTextInput] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [localScore, setLocalScore] = useState(0);

  useEffect(() => {
    if (fullLesson?.vocabulary && fullLesson.vocabulary.length > 0) {
      setWords(shuffleArray(fullLesson.vocabulary).slice(0, Math.min(5, fullLesson.vocabulary.length)));
    }
  }, [fullLesson]);

  const totalQuestions = words.length;
  const currentWord = words[currentIdx];
  const isFinished = currentIdx >= totalQuestions;
  const screenWidth = Dimensions.get('window').width;

  // Décide quelle question poser selon le type de défi
  const getPromptAndTarget = () => {
    if (!currentWord) return { prompt: '', target: '' };
    const idx = challenge.index;
    if (idx === 0 || idx === 4) {
      // Traducteur Éclair / Sprint : FR → Langue
      return { prompt: `Comment dit-on "${currentWord.meaning}" ?`, target: currentWord.word };
    } else if (idx === 1) {
      // Oreille Absolue : écouter et écrire
      return { prompt: `Écoutez puis écrivez le mot :`, target: currentWord.word };
    } else if (idx === 3) {
      // Phrase Mystère
      if (currentWord.exampleSentence) {
        const blanked = currentWord.exampleSentence.replace(new RegExp(currentWord.word, 'gi'), '_____');
        return { prompt: `Complétez : "${blanked}"`, target: currentWord.word };
      }
      return { prompt: `Comment dit-on "${currentWord.meaning}" ?`, target: currentWord.word };
    } else {
      // Défi Inversé / Mémoire : Langue → FR
      return { prompt: `Que signifie "${currentWord.word}" ?`, target: currentWord.meaning };
    }
  };

  const { prompt, target } = getPromptAndTarget();

  const handlePlayAudio = () => {
    if (currentWord) {
      Speech.speak(sanitizeForTTS(currentWord.word), { language: 'fr-FR', pitch: 0.9, rate: 0.85 });
    }
  };

  const handleCheck = () => {
    const correct = checkPermissiveMatch(textInput, target);
    setIsCorrect(correct);
    if (correct) setLocalScore(prev => prev + 1);
    setIsChecked(true);
  };

  const handleNext = () => {
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx(prev => prev + 1);
      setTextInput('');
      setIsChecked(false);
      setIsCorrect(false);
    } else {
      // Fin du défi !
      const earnedXp = Math.round(config.xpReward * (localScore / totalQuestions));
      const pctScore = Math.round(((localScore + (isCorrect ? 1 : 0)) / totalQuestions) * 100);
      completeDailyChallenge(earnedXp, pctScore);
      setCurrentIdx(totalQuestions);
    }
  };

  // Défi déjà terminé aujourd'hui
  if (challenge.completed) {
    return (
      <SafeAreaView className="flex-1 bg-surface items-center justify-center px-6">
        <Text className="text-6xl mb-6">{challenge.score > 70 ? '🏆' : '💪'}</Text>
        <Text className="text-3xl font-jakarta-bold text-primary mb-2 text-center">
          {challenge.score > 70 ? 'Défi Réussi !' : 'Défi Tenté !'}
        </Text>
        <Text className="text-lg font-jakarta text-primary/80 mb-2 text-center">
          Votre score : {challenge.score}%
        </Text>
        <Text className="text-lg font-jakarta-bold text-secondary mb-6">
          + {challenge.xp} XP gagnés
        </Text>
        <Text className="text-base font-jakarta text-primary/60 mb-10 text-center">
          Rendez-vous demain pour un nouveau défi quotidien. 💪
        </Text>
        <TouchableOpacity 
          onPress={() => router.replace('/(tabs)')}
          className="py-4 px-8 rounded-full border-2 border-primary/30"
        >
          <Text className="text-primary font-jakarta-bold text-lg">Retour à l'Accueil</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (words.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-surface items-center justify-center px-6">
        <Text className="text-3xl font-jakarta-bold text-primary text-center">Chargement du défi...</Text>
      </SafeAreaView>
    );
  }

  // Écran de fin du défi
  if (isFinished) {
    const pct = Math.round((localScore / totalQuestions) * 100);
    return (
      <SafeAreaView className="flex-1 bg-surface items-center justify-center px-6">
        <Text className="text-6xl mb-6">{pct > 70 ? '🏆' : '💪'}</Text>
        <Text className="text-3xl font-jakarta-bold text-primary mb-2 text-center">Défi Terminé !</Text>
        <Text className="text-lg font-jakarta text-primary/80 mb-2 text-center">
          Score : {localScore}/{totalQuestions} ({pct}%)
        </Text>
        <Text className="text-lg font-jakarta-bold text-secondary mb-10">
          + {Math.round(config.xpReward * (localScore / totalQuestions))} XP gagnés !
        </Text>
        <GriotButton 
          title="Retour à l'Accueil" 
          onPress={() => router.replace('/(tabs)')}
          className="w-full"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface">
      {/* Header */}
      <View className="flex-row justify-between items-center px-6 py-4">
        <TouchableOpacity onPress={() => router.back()}>
          <X color="#00362e" size={24} />
        </TouchableOpacity>
        <View className="flex-1 px-4">
          <View className="h-2 w-full bg-primary/20 rounded-full overflow-hidden">
            <View className="h-full bg-primary" style={{ width: `${(currentIdx / totalQuestions) * 100}%` }} />
          </View>
        </View>
        <Text className="text-primary font-jakarta-bold">{currentIdx + 1}/{totalQuestions}</Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false}>
        {/* Défi info */}
        <View className="items-center mb-8">
          <Text className="text-5xl mb-3">{config.emoji}</Text>
          <Text className="text-2xl font-jakarta-bold text-on-surface text-center mb-2">{config.title}</Text>
          <Text className="text-sm font-jakarta text-primary/80 text-center">{config.description}</Text>
        </View>

        {/* Question */}
        <Text className="text-2xl font-jakarta-bold text-primary text-center mb-8">
          {prompt}
        </Text>

        {/* Bouton écouter pour le défi "Oreille Absolue" */}
        {challenge.index === 1 && (
          <TouchableOpacity 
            onPress={handlePlayAudio}
            className="self-center bg-primary/10 px-8 py-4 rounded-full mb-8 flex-row items-center"
          >
            <Text className="text-primary font-jakarta-bold text-lg">🔊 Écouter le mot</Text>
          </TouchableOpacity>
        )}

        {/* Zone de saisie */}
        <View className="pb-32 px-4">
          <TextInput 
            value={textInput}
            onChangeText={setTextInput}
            editable={!isChecked}
            placeholder="Tapez votre réponse ici..."
            placeholderTextColor="#A0AAB2"
            className={`w-full bg-white rounded-2xl p-6 text-xl font-jakarta text-center border-4 ${
              !isChecked ? (textInput ? 'border-[#90efcd]' : 'border-transparent') : 
              (isCorrect ? 'border-[#4CAF50] bg-[#E8F5E9] text-green-700' : 'border-[#F44336] bg-[#FFEBEE] text-red-700')
            }`}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {isChecked && !isCorrect && (
            <Text className="text-center font-jakarta-bold text-red-500 mt-4 text-lg">
              Réponse correcte : {target}
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Footer */}
      <View className="absolute bottom-6 left-6 right-6">
        {!isChecked ? (
          <GriotButton 
            title="Vérifier"
            onPress={handleCheck}
            variant={textInput.length > 0 ? 'primary' : 'secondary'}
            className={textInput.length > 0 ? '' : 'opacity-70'}
          />
        ) : (
          <View className="w-full">
            <GriotButton 
              title="Continuer"
              onPress={handleNext}
              className={`${isCorrect ? 'bg-[#4CAF50]' : 'bg-[#F44336]'}`}
              textClassName="text-white"
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
