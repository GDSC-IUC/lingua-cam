import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Dimensions, TextInput, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import { GriotButton } from '../../components/ui/GriotButton';
import { useAppLanguageStore } from '../../store/appLanguageStore';
import { useLesson, useLanguages, useLessons } from '../../hooks/useQueries';
import { generateQuiz, QuizQuestion } from '../../utils/quizGenerator';
import { checkPermissiveMatch } from '../../utils/textHelpers';
import { useProgressStore } from '../../store/progressStore';
import { useLanguageStore } from '../../store/languageStore';

export default function QuizScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useAppLanguageStore();
  const { selectedLanguageId } = useLanguageStore();
  const { data: languages } = useLanguages();
  
  const currentLanguage = languages?.find(l => (l as any).code === selectedLanguageId);
  const langName = currentLanguage?.name || 'la langue';

  const { data: lesson, isLoading } = useLesson(id);
  const { data: allLessons } = useLessons(currentLanguage?._id);
  const { addCompletedLesson, addWordToReview } = useProgressStore();

  // Calculer la leçon suivante
  const currentLessonIndex = allLessons?.findIndex(l => l._id === id) ?? -1;
  const nextLesson = (currentLessonIndex !== -1 && allLessons) ? allLessons[currentLessonIndex + 1] : undefined;

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);

  // States for current question
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Initialisation du quiz une seule fois avec useMemo/useEffect
  useEffect(() => {
    if (lesson?.vocabulary && lesson.vocabulary.length > 0) {
      setQuestions(generateQuiz(lesson.vocabulary, langName));
    }
  }, [lesson, langName]);

  const screenWidth = Dimensions.get('window').width;
  const cardWidth = (screenWidth - 48 - 16) / 2;

  if (isLoading || questions.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-surface items-center justify-center">
        <ActivityIndicator size="large" color="#006850" />
      </SafeAreaView>
    );
  }

  const currentQ = questions[currentIndex];
  const isFinished = currentIndex >= questions.length;

  const handleCheck = () => {
    let correct = false;

    if (currentQ.type === 'TEXT_INPUT') {
      correct = checkPermissiveMatch(textInput, currentQ.wordItem.word);
    } else {
      correct = selectedOptionId === currentQ.wordItem._id;
    }

    setIsCorrect(correct);
    if (correct) {
      setScore(prev => prev + 1);
    } else {
      addWordToReview(currentQ.wordItem);
    }
    setIsAnswerChecked(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      // Reset states
      setSelectedOptionId(null);
      setTextInput('');
      setIsAnswerChecked(false);
      setIsCorrect(false);
    } else {
      // Fin du quiz, accorder l'XP final !
      const percentageScore = Math.round(((score + (isCorrect ? 1 : 0)) / questions.length) * 100);
      const xpEarned = Math.round(((lesson?.xpReward) || 100) * (percentageScore / 100));
      
      if (currentLanguage && lesson?._id) {
         addCompletedLesson(lesson._id, currentLanguage._id, xpEarned);
      }
      setCurrentIndex(questions.length); // Trigger isFinished UI
    }
  };

  if (isFinished) {
    const finalPercentage = Math.round((score / questions.length) * 100);
    const isLastLesson = !nextLesson;
    return (
      <SafeAreaView className="flex-1 bg-surface items-center justify-center px-6">
        <Text className="text-6xl mb-6">{finalPercentage > 70 ? '🎉' : '💪'}</Text>
        <Text className="text-4xl font-jakarta-bold text-primary mb-2 text-center">{t('quiz.title')} {t('home.complete')} !</Text>
        <Text className="text-lg font-jakarta text-primary/80 mb-10 text-center">
          {t('quiz.check')?.split(' ')[0] || 'Score'} : {score} / {questions.length} ({finalPercentage}%)
        </Text>

        {isLastLesson ? (
          /* Dernière leçon de la langue → bouton vers le récap */
          <GriotButton 
            title={t('languageComplete.title').replace(' 🎉', '') || 'Félicitations !'}
            onPress={() => router.replace('/language-complete')}
            className="w-full mb-4"
          />
        ) : (
          /* Il reste des leçons → bouton leçon suivante */
          <GriotButton 
            title={`${t('lesson.next')} : ${nextLesson.title}`}
            onPress={() => router.replace(`/lesson/${nextLesson._id}`)}
            className="w-full mb-4"
          />
        )}

        <TouchableOpacity 
          onPress={() => router.replace('/(tabs)')}
          className="w-full py-4 rounded-full border-2 border-primary/30 items-center"
        >
          <Text className="text-primary font-jakarta-bold text-lg">{t('languageComplete.backToHome') || "Retour à l'Accueil"}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface">
      {/* Quiz Header */}
      <View className="flex-row items-center px-6 py-4 justify-between">
        <TouchableOpacity onPress={() => router.replace('/(tabs)')}>
          <X color="#006850" size={24} />
        </TouchableOpacity>
        
        {/* Progress Display */}
        <View className="flex-1 px-4">
          <View className="h-2 w-full bg-primary/20 rounded-full overflow-hidden">
            <View 
              className="h-full bg-primary" 
              style={{ width: `${((currentIndex) / questions.length) * 100}%` }} 
            />
          </View>
        </View>

        <Text className="font-jakarta-bold text-primary">{currentIndex + 1} / {questions.length}</Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false}>
        {/* Enoncé */}
        <View className="mb-8">
          <Text className="text-3xl font-jakarta-bold text-on-surface text-center leading-tight mb-3">
            {currentQ.prompt}
          </Text>
          {currentQ.subPrompt ? (
            <Text className="text-sm font-jakarta text-primary/80 text-center px-4 font-bold">
              {currentQ.subPrompt}
            </Text>
          ) : null}
        </View>

        {/* Options UI */}
        {(currentQ.type === 'MULTIPLE_CHOICE' || currentQ.type === 'FILL_BLANK') && currentQ.options && (
          <View className="flex-row flex-wrap justify-between pb-32">
            {currentQ.options.map((opt) => {
               const isSelected = selectedOptionId === opt._id;
               let bgColor = '#ffffff';
               let borderColor = 'transparent';

               if (isAnswerChecked) {
                 if (opt._id === currentQ.wordItem._id) {
                   borderColor = '#4CAF50'; // Vert (Correct)
                   bgColor = '#E8F5E9';
                 } else if (isSelected && opt._id !== currentQ.wordItem._id) {
                   borderColor = '#F44336'; // Rouge (Incorrect)
                   bgColor = '#FFEBEE';
                 } else {
                   bgColor = '#ffffff';
                   borderColor = 'transparent';
                 }
               } else if (isSelected) {
                 borderColor = '#90efcd';
                 bgColor = '#f0fff8';
               }

               return (
                <TouchableOpacity 
                  key={opt._id}
                  disabled={isAnswerChecked}
                  onPress={() => setSelectedOptionId(opt._id)}
                  activeOpacity={0.9}
                  style={{ width: cardWidth, height: cardWidth * 1.2, backgroundColor: bgColor, borderColor, borderWidth: 4 }}
                  className="mb-4 rounded-[32px] overflow-hidden shadow-sm"
                >
                  <View className="flex-1 p-4 justify-center items-center">
                     {/* Text Option directly without image fallback for now */}
                     <Text className={`font-jakarta-bold text-center ${isAnswerChecked && opt._id === currentQ.wordItem._id ? 'text-green-700' : 'text-primary'} text-lg`}>
                       {currentQ.prompt.includes('Que veut dire') ? opt.meaning : opt.word}
                     </Text>
                  </View>
                </TouchableOpacity>
               )
            })}
          </View>
        )}

        {currentQ.type === 'TEXT_INPUT' && (
          <View className="pb-32 px-4 shadow-sm">
             <TextInput 
                value={textInput}
                onChangeText={setTextInput}
                editable={!isAnswerChecked}
                placeholder="Tapez le mot ici..."
                placeholderTextColor="#A0AAB2"
                className={`w-full bg-white rounded-2xl p-6 text-xl font-jakarta text-center border-4 ${
                  !isAnswerChecked ? (textInput ? 'border-[#90efcd]' : 'border-transparent') : 
                  (isCorrect ? 'border-[#4CAF50] bg-[#E8F5E9] text-green-700' : 'border-[#F44336] bg-[#FFEBEE] text-red-700')
                }`}
                autoCapitalize="none"
                autoCorrect={false}
             />
             {isAnswerChecked && !isCorrect && (
               <Text className="text-center font-jakarta-bold text-red-500 mt-4 text-lg">
                 Réponse correcte : {currentQ.wordItem.word}
               </Text>
             )}
          </View>
        )}
      </ScrollView>

      {/* Footer Floating check Area */}
      <View className="absolute bottom-6 left-6 right-6">
        {!isAnswerChecked ? (
          <GriotButton 
            title={t('quiz.check') || 'Vérifier'}
            onPress={handleCheck}
            variant={(currentQ.type === 'TEXT_INPUT' ? textInput.length > 0 : selectedOptionId) ? 'primary' : 'secondary'}
            className={(currentQ.type === 'TEXT_INPUT' ? textInput.length > 0 : selectedOptionId) ? '' : 'opacity-70'}
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
