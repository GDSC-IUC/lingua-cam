import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions, TextInput, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import { GriotButton } from '../../components/ui/GriotButton';
import { useAppLanguageStore } from '../../store/appLanguageStore';
import { generateQuiz, QuizQuestion } from '../../utils/quizGenerator';
import { checkPermissiveMatch } from '../../utils/textHelpers';
import { useProgressStore } from '../../store/progressStore';
import { useLanguageStore } from '../../store/languageStore';
import { useLanguages } from '../../hooks/useQueries';

export default function PracticeScreen() {
  const { t } = useAppLanguageStore();
  const { selectedLanguageId } = useLanguageStore();
  const { data: languages } = useLanguages();
  
  const currentLanguage = languages?.find(l => (l as any).code === selectedLanguageId);
  const langName = currentLanguage?.name || 'la langue';

  const { wordsToReview, removeWordFromReview } = useProgressStore();

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);

  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Capture words to review ONCE when screen loads so it doesn't shrink mid-quiz
  useEffect(() => {
    if (wordsToReview.length > 0) {
      setQuestions(generateQuiz(wordsToReview, langName));
    }
  }, []);

  const screenWidth = Dimensions.get('window').width;
  const cardWidth = (screenWidth - 48 - 16) / 2;

  if (wordsToReview.length === 0 && questions.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-surface items-center justify-center px-6">
        <Text className="text-6xl mb-6">🏆</Text>
        <Text className="text-3xl font-jakarta-bold text-primary mb-2 text-center">Rien à réviser !</Text>
        <Text className="text-lg font-jakarta text-primary/80 mb-10 text-center">Vous maîtrisez tout le vocabulaire passé !</Text>
      </SafeAreaView>
    );
  }

  if (questions.length === 0) {
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
      removeWordFromReview(currentQ.wordItem._id);
    }
    setIsAnswerChecked(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOptionId(null);
      setTextInput('');
      setIsAnswerChecked(false);
      setIsCorrect(false);
    } else {
      setCurrentIndex(questions.length); 
    }
  };

  if (isFinished) {
    return (
      <SafeAreaView className="flex-1 bg-surface items-center justify-center px-6">
        <Text className="text-6xl mb-6">🎇</Text>
        <Text className="text-3xl font-jakarta-bold text-primary mb-2 text-center">Session Terminée !</Text>
        <Text className="text-lg font-jakarta text-primary/80 mb-10 text-center">
          Vous avez validé et corrigé {score} mots.
        </Text>
        <GriotButton 
          title="Retourner à l'Accueil" 
          onPress={() => router.replace('/(tabs)')} 
          className="w-full"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="flex-row items-center px-6 py-4 justify-between">
        <TouchableOpacity onPress={() => router.replace('/(tabs)')}>
          <X color="#006850" size={24} />
        </TouchableOpacity>
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

        {(currentQ.type === 'MULTIPLE_CHOICE' || currentQ.type === 'FILL_BLANK') && currentQ.options && (
          <View className="flex-row flex-wrap justify-between pb-60">
            {currentQ.options.map((opt) => {
               const isSelected = selectedOptionId === opt._id;
               let bgColor = '#ffffff';
               let borderColor = 'transparent';

               if (isAnswerChecked) {
                 if (opt._id === currentQ.wordItem._id) {
                   borderColor = '#4CAF50';
                   bgColor = '#E8F5E9';
                 } else if (isSelected && opt._id !== currentQ.wordItem._id) {
                   borderColor = '#F44336';
                   bgColor = '#FFEBEE';
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
          <View className="pb-60 px-4 shadow-sm">
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

      <View style={{ position: 'absolute', bottom: 110, left: 24, right: 24 }}>
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
