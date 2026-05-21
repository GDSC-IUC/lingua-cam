import { VocabularyItem } from '../hooks/useQueries';

export type QuestionType = 'MULTIPLE_CHOICE' | 'TEXT_INPUT' | 'FILL_BLANK';

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  wordItem: VocabularyItem;
  options?: VocabularyItem[]; // Optionnel, utilisé pour MULTIPLE_CHOICE et FILL_BLANK
  prompt: string;
  subPrompt?: string;
}

export const shuffleArray = <T>(array: T[]): T[] => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export const generateQuiz = (vocabulary: VocabularyItem[], langName: string): QuizQuestion[] => {
  const questions: QuizQuestion[] = [];

  // Pour chaque mot de la leçon, on génère une question aléatoire pour s'assurer de couvrir tout le vocabulaire
  vocabulary.forEach((item, index) => {
    let type: QuestionType = 'MULTIPLE_CHOICE';
    const rand = Math.random();
    
    // Si une phrase exemple existe et qu'elle contient le mot exact (ignorer la casse), on peut faire un Fill Blank
    const canFillBlank = item.exampleSentence && new RegExp(item.word, 'gi').test(item.exampleSentence);

    if (rand > 0.7 && canFillBlank) {
      type = 'FILL_BLANK';
    } else if (rand > 0.4) {
      type = 'TEXT_INPUT';
    }

    let prompt = '';
    let subPrompt = '';
    let options: VocabularyItem[] = [];

    // Choix des fausses réponses (distracteurs) parmi le reste du vocabulaire
    const buildOptions = () => {
      const others = vocabulary.filter(v => v._id !== item._id);
      // On prend jusqu'à 3 fausses réponses
      const falsies = shuffleArray(others).slice(0, 3);
      return shuffleArray([item, ...falsies]);
    };

    if (type === 'MULTIPLE_CHOICE') {
      // Soit on demande de traduire du Français -> Langue locale
      // Soit Langue locale -> Français
      if (Math.random() > 0.5) {
        prompt = `Que veut dire "${item.word}" ?`;
        subPrompt = 'Sélectionnez la bonne traduction.';
      } else {
        prompt = `Comment dit-on "${item.meaning}" ?`;
        subPrompt = `Sélectionnez le bon terme en ${langName}.`;
      }
      options = buildOptions();
    } else if (type === 'TEXT_INPUT') {
      prompt = `Comment écrivez-vous "${item.meaning}" en ${langName} ?`;
      subPrompt = 'Tapez le mot exact (les accents sont ignorés).';
    } else if (type === 'FILL_BLANK') {
      const blanked = item.exampleSentence!.replace(new RegExp(item.word, 'gi'), '_____');
      prompt = `"${item.exampleTranslation}"`;
      subPrompt = `Complétez : ${blanked}`;
      options = buildOptions(); // L'utilisateur doit choisir le bon mot pour remplir le trou (plus accessible sur mobile)
    }

    questions.push({
      id: `${item._id}-${Math.random().toString(36).substring(7)}`, // ID unique
      type,
      wordItem: item,
      prompt,
      subPrompt,
      options
    });
  });

  // On mélange les questions finales pour que le quiz ne soit pas ordonné
  return shuffleArray(questions);
};
