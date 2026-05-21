import mongoose from 'mongoose';
import 'dotenv/config';
import Language from '../models/Language.model';
import Lesson from '../models/Lesson.model';
import VocabularyItem from '../models/VocabularyItem.model';

const MONGO_URI = process.env.MONGO_URI;

// ─────────────────────────────────────────────────────────────────────────────
// VOCABULARY DATA PER LANGUAGE
// ─────────────────────────────────────────────────────────────────────────────

const vocabData: Record<string, Record<string, { word: string; meaning: string; meaningEn: string; phonetic?: string; exampleSentence?: string; exampleTranslation?: string; tags: string[] }[]>> = {

  ghomala: {
    salutations: [
      { word: "Njoh", meaning: "Bienvenue / Bonjour", meaningEn: "Welcome / Hello", phonetic: "/ɲɔh/", exampleSentence: "Njoh kom!", exampleTranslation: "Bienvenue chez nous!", tags: ['greeting'] },
      { word: "Mesep", meaning: "Merci", meaningEn: "Thank you", phonetic: "/me.sep/", exampleSentence: "Mesep sa!", exampleTranslation: "Merci beaucoup!", tags: ['politeness'] },
      { word: "Wèh", meaning: "Oui", meaningEn: "Yes", phonetic: "/wɛh/", exampleSentence: "Wèh, m'kɛ kom.", exampleTranslation: "Oui, je suis là.", tags: ['basic'] },
      { word: "Aw", meaning: "Non", meaningEn: "No", phonetic: "/aw/", exampleSentence: "Aw, m'ke'.", exampleTranslation: "Non, ce n'est pas ça.", tags: ['basic'] },
      { word: "Ŋgɛ wò?", meaning: "Comment vas-tu ?", meaningEn: "How are you?", phonetic: "/ŋgɛ wɔ/", exampleSentence: "Ŋgɛ wò pa?", exampleTranslation: "Comment allez-vous tous?", tags: ['greeting'] },
      { word: "M'tó", meaning: "Je vais bien", meaningEn: "I'm fine", phonetic: "/m-tó/", exampleSentence: "M'tó, mesep!", exampleTranslation: "Je vais bien, merci!", tags: ['greeting'] },
    ],
    famille: [
      { word: "Pa", meaning: "Père", meaningEn: "Father", phonetic: "/pa/", exampleSentence: "Pa m'to kom.", exampleTranslation: "Mon père est arrivé.", tags: ['family'] },
      { word: "Ma", meaning: "Mère", meaningEn: "Mother", phonetic: "/ma/", exampleSentence: "Ma m'pap toŋ.", exampleTranslation: "Ma mère prépare à manger.", tags: ['family'] },
      { word: "Mbwi", meaning: "Enfant", meaningEn: "Child", phonetic: "/mbwi/", exampleSentence: "Mbwi wò toŋ kap.", exampleTranslation: "L'enfant joue dehors.", tags: ['family'] },
      { word: "Nkon", meaning: "Frère", meaningEn: "Brother", phonetic: "/ŋkɔn/", exampleSentence: "Nkon kom!", exampleTranslation: "Mon frère est là!", tags: ['family'] },
      { word: "Mfon", meaning: "Chef / Roi", meaningEn: "Chief / King", phonetic: "/mfɔn/", exampleSentence: "Mfon wap toŋ kap.", exampleTranslation: "Le chef est dehors.", tags: ['society'] },
    ],
    chiffres: [
      { word: "Pó", meaning: "Un (1)", meaningEn: "One", phonetic: "/pó/", exampleSentence: "M'teh pó.", exampleTranslation: "J'en veux un.", tags: ['numbers'] },
      { word: "Pé", meaning: "Deux (2)", meaningEn: "Two", phonetic: "/pé/", exampleSentence: "Mbwi pé kap.", exampleTranslation: "Deux enfants jouent.", tags: ['numbers'] },
      { word: "Táh", meaning: "Trois (3)", meaningEn: "Three", phonetic: "/táh/", exampleSentence: "Táh pɛ.", exampleTranslation: "Il y en a trois.", tags: ['numbers'] },
      { word: "Nɛ", meaning: "Quatre (4)", meaningEn: "Four", phonetic: "/nɛ/", exampleSentence: "Nɛ pa'a.", exampleTranslation: "Quatre personnes.", tags: ['numbers'] },
      { word: "Tɛn", meaning: "Cinq (5)", meaningEn: "Five", phonetic: "/tɛn/", exampleSentence: "Tɛn ne tó.", exampleTranslation: "Cinq sont là.", tags: ['numbers'] },
    ],
    nature: [
      { word: "Temtem", meaning: "Soleil", meaningEn: "Sun", phonetic: "/tem.tem/", exampleSentence: "Temtem hɛp.", exampleTranslation: "Le soleil brille.", tags: ['nature'] },
      { word: "Kpɔ", meaning: "Eau", meaningEn: "Water", phonetic: "/kpɔ/", exampleSentence: "Teh kpɔ!", exampleTranslation: "Donne-moi de l'eau!", tags: ['nature'] },
      { word: "Ŋɔt", meaning: "Arbre", meaningEn: "Tree", phonetic: "/ŋɔt/", exampleSentence: "Ŋɔt wap ke'e.", exampleTranslation: "L'arbre est grand.", tags: ['nature'] },
      { word: "Nzhɛk", meaning: "Pluie", meaningEn: "Rain", phonetic: "/nʒɛk/", exampleSentence: "Nzhɛk hɛp hɛp.", exampleTranslation: "Il pleut beaucoup.", tags: ['nature'] },
    ],
  },

  medumba: {
    salutations: [
      { word: "Ndi", meaning: "Bonjour / Salut", meaningEn: "Hello / Hi", phonetic: "/ndi/", exampleSentence: "Ndi, ŋgə wô?", exampleTranslation: "Bonjour, comment vas-tu?", tags: ['greeting'] },
      { word: "Ŋgə wô?", meaning: "Comment vas-tu ?", meaningEn: "How are you?", phonetic: "/ŋgə wô/", exampleSentence: "Pa, ŋgə wô?", exampleTranslation: "Père, comment vas-tu?", tags: ['greeting'] },
      { word: "M'nɔ", meaning: "Je vais bien", meaningEn: "I'm fine / I'm well", phonetic: "/m-nɔ/", exampleSentence: "M'nɔ, asante!", exampleTranslation: "Je vais bien, merci!", tags: ['greeting'] },
      { word: "Weé", meaning: "Oui", meaningEn: "Yes", phonetic: "/We.é/", exampleSentence: "Weé, m'tó.", exampleTranslation: "Oui, je suis là.", tags: ['basic'] },
      { word: "Néé", meaning: "Non", meaningEn: "No", phonetic: "/né.é/", exampleSentence: "Néé, ke' si.", exampleTranslation: "Non, c'est différent.", tags: ['basic'] },
      { word: "Akam", meaning: "Au revoir", meaningEn: "Goodbye", phonetic: "/a.kam/", exampleSentence: "Akam, wɔ mɔ!", exampleTranslation: "Au revoir, à bientôt!", tags: ['greeting'] },
    ],
    famille: [
      { word: "Paa", meaning: "Père", meaningEn: "Father", phonetic: "/paː/", exampleSentence: "Paa to'o.", exampleTranslation: "Père est arrivé.", tags: ['family'] },
      { word: "Maa", meaning: "Mère", meaningEn: "Mother", phonetic: "/maː/", exampleSentence: "Maa tô ndap.", exampleTranslation: "Mère est à la maison.", tags: ['family'] },
      { word: "Nɔk", meaning: "Enfant / Fils", meaningEn: "Child / Son", phonetic: "/nɔk/", exampleSentence: "Nɔk wam kap.", exampleTranslation: "Mon enfant joue.", tags: ['family'] },
      { word: "Ndap", meaning: "Maison / Famille", meaningEn: "Home / Family", phonetic: "/ndap/", exampleSentence: "M'to ndap.", exampleTranslation: "Je rentre à la maison.", tags: ['family', 'places'] },
      { word: "Ngwɛ'", meaning: "Femme", meaningEn: "Woman / Wife", phonetic: "/ŋgwɛʔ/", exampleSentence: "Ngwɛ' wam to'o.", exampleTranslation: "Ma femme est arrivée.", tags: ['family'] },
    ],
    chiffres: [
      { word: "Mɔ'", meaning: "Un (1)", meaningEn: "One", phonetic: "/mɔʔ/", exampleSentence: "Mɔ' ndap.", exampleTranslation: "Une maison.", tags: ['numbers'] },
      { word: "Bà", meaning: "Deux (2)", meaningEn: "Two", phonetic: "/bà/", exampleSentence: "Nɔk bà.", exampleTranslation: "Deux enfants.", tags: ['numbers'] },
      { word: "Làk", meaning: "Trois (3)", meaningEn: "Three", phonetic: "/làk/", exampleSentence: "Làk nɔk kap.", exampleTranslation: "Trois enfants jouent.", tags: ['numbers'] },
      { word: "Nàŋ", meaning: "Quatre (4)", meaningEn: "Four", phonetic: "/nàŋ/", exampleSentence: "Nàŋ pɛ ndap.", exampleTranslation: "Quatre dans la maison.", tags: ['numbers'] },
      { word: "Tɛ̀n", meaning: "Cinq (5)", meaningEn: "Five", phonetic: "/tɛ̀n/", exampleSentence: "Tɛ̀n ngwɛ'.", exampleTranslation: "Cinq femmes.", tags: ['numbers'] },
    ],
    nature: [
      { word: "Nzɔ'", meaning: "Eau / Rivière", meaningEn: "Water / River", phonetic: "/nzɔʔ/", exampleSentence: "Sɔ' nzɔ'!", exampleTranslation: "Cherche de l'eau!", tags: ['nature'] },
      { word: "Mbɔŋ", meaning: "Soleil", meaningEn: "Sun", phonetic: "/mbɔŋ/", exampleSentence: "Mbɔŋ tɔŋ.", exampleTranslation: "Le soleil se lève.", tags: ['nature'] },
      { word: "Ngom", meaning: "Arbre", meaningEn: "Tree", phonetic: "/ŋgom/", exampleSentence: "Ngom wap ke'e.", exampleTranslation: "L'arbre est grand.", tags: ['nature'] },
    ],
  },

  yemba: {
    salutations: [
      { word: "Ndi", meaning: "Bonjour", meaningEn: "Good morning / Hello", phonetic: "/ndi/", exampleSentence: "Ndi, É ŋgɛ?", exampleTranslation: "Bonjour, comment ça va?", tags: ['greeting'] },
      { word: "É ŋgɛ?", meaning: "Comment vas-tu ?", meaningEn: "How are you?", phonetic: "/é ŋgɛ/", exampleSentence: "Pa, é ŋgɛ?", exampleTranslation: "Père, comment vas-tu?", tags: ['greeting'] },
      { word: "Té", meaning: "Merci", meaningEn: "Thank you", phonetic: "/té/", exampleSentence: "Té tshu!", exampleTranslation: "Merci beaucoup!", tags: ['politeness'] },
      { word: "Yɔ", meaning: "Oui", meaningEn: "Yes", phonetic: "/jɔ/", exampleSentence: "Yɔ, m'ne.", exampleTranslation: "Oui, c'est moi.", tags: ['basic'] },
      { word: "È'è", meaning: "Non", meaningEn: "No", phonetic: "/èʔè/", exampleSentence: "È'è, ke' ndo.", exampleTranslation: "Non, ce n'est pas ici.", tags: ['basic'] },
      { word: "Wolo", meaning: "Au revoir", meaningEn: "Goodbye", phonetic: "/wo.lo/", exampleSentence: "Wolo, sɔp dzɔ!", exampleTranslation: "Au revoir, bonne nuit!", tags: ['greeting'] },
    ],
    famille: [
      { word: "Pa", meaning: "Père", meaningEn: "Father", phonetic: "/pa/", exampleSentence: "Pa m'to.", exampleTranslation: "Mon père arrive.", tags: ['family'] },
      { word: "Ma", meaning: "Mère", meaningEn: "Mother", phonetic: "/ma/", exampleSentence: "Ma tô nzhɔ.", exampleTranslation: "Mère est à la maison.", tags: ['family'] },
      { word: "Nzhi", meaning: "Enfant", meaningEn: "Child", phonetic: "/nʒi/", exampleSentence: "Nzhi wam ke'.", exampleTranslation: "Mon enfant est là.", tags: ['family'] },
      { word: "Nton", meaning: "Frère / Sœur", meaningEn: "Sibling", phonetic: "/ntɔn/", exampleSentence: "Nton wam tshu.", exampleTranslation: "Mon frère est grand.", tags: ['family'] },
      { word: "Nzhɔ", meaning: "Maison", meaningEn: "Home", phonetic: "/nʒɔ/", exampleSentence: "M'to nzhɔ.", exampleTranslation: "Je rentre à la maison.", tags: ['places'] },
    ],
    chiffres: [
      { word: "Mó", meaning: "Un (1)", meaningEn: "One", phonetic: "/mó/", exampleSentence: "Mó nzhi.", exampleTranslation: "Un enfant.", tags: ['numbers'] },
      { word: "Bàb", meaning: "Deux (2)", meaningEn: "Two", phonetic: "/bàb/", exampleSentence: "Bàb nton.", exampleTranslation: "Deux frères.", tags: ['numbers'] },
      { word: "Tát", meaning: "Trois (3)", meaningEn: "Three", phonetic: "/tát/", exampleSentence: "Tát pɛ nzhɔ.", exampleTranslation: "Trois dans la maison.", tags: ['numbers'] },
      { word: "Nài", meaning: "Quatre (4)", meaningEn: "Four", phonetic: "/nài/", exampleSentence: "Nài nzhi kap.", exampleTranslation: "Quatre enfants jouent.", tags: ['numbers'] },
      { word: "Tɛ̀n", meaning: "Cinq (5)", meaningEn: "Five", phonetic: "/tɛ̀n/", exampleSentence: "Tɛ̀n pa'a.", exampleTranslation: "Cinq personnes.", tags: ['numbers'] },
    ],
    nature: [
      { word: "Tsì", meaning: "Eau", meaningEn: "Water", phonetic: "/tsì/", exampleSentence: "Kɔ tsì pa!", exampleTranslation: "Apporte de l'eau!", tags: ['nature'] },
      { word: "Ngɔ'", meaning: "Feu", meaningEn: "Fire", phonetic: "/ŋgɔʔ/", exampleSentence: "Ngɔ' hɔp.", exampleTranslation: "Le feu est allumé.", tags: ['nature'] },
      { word: "Nzɔ", meaning: "Pluie", meaningEn: "Rain", phonetic: "/nzɔ/", exampleSentence: "Nzɔ hɛp.", exampleTranslation: "Il pleut.", tags: ['nature'] },
      { word: "Mbɔŋ", meaning: "Soleil", meaningEn: "Sun", phonetic: "/mbɔŋ/", exampleSentence: "Mbɔŋ ɣɛp.", exampleTranslation: "Le soleil brille.", tags: ['nature'] },
    ],
  },

  ewondo: {
    salutations: [
      { word: "Mbolo", meaning: "Bonjour / Salut", meaningEn: "Hello / Greetings", phonetic: "/mbo.lo/", exampleSentence: "Mbolo, wô yé?", exampleTranslation: "Bonjour, comment ça va?", tags: ['greeting'] },
      { word: "Abé", meaning: "Merci", meaningEn: "Thank you", phonetic: "/a.bé/", exampleSentence: "Abé mininga!", exampleTranslation: "Merci beaucoup!", tags: ['politeness'] },
      { word: "Yé", meaning: "Oui", meaningEn: "Yes", phonetic: "/jé/", exampleSentence: "Yé, mine.", exampleTranslation: "Oui, c'est moi.", tags: ['basic'] },
      { word: "Aane", meaning: "Non", meaningEn: "No", phonetic: "/a.ane/", exampleSentence: "Aane, mba'a si.", exampleTranslation: "Non, ce n'est pas comme ça.", tags: ['basic'] },
      { word: "Mbo wô?", meaning: "Comment vas-tu ?", meaningEn: "How are you?", phonetic: "/mbo wô/", exampleSentence: "Mbo wô, tara?", exampleTranslation: "Comment vas-tu, père?", tags: ['greeting'] },
      { word: "Me fap", meaning: "Je vais bien", meaningEn: "I'm fine", phonetic: "/me fap/", exampleSentence: "Me fap, abé yem!", exampleTranslation: "Je vais bien, merci à toi!", tags: ['greeting'] },
    ],
    famille: [
      { word: "Tara", meaning: "Père", meaningEn: "Father", phonetic: "/ta.ra/", exampleSentence: "Tara abé!", exampleTranslation: "Merci père!", tags: ['family'] },
      { word: "Mame", meaning: "Mère", meaningEn: "Mother", phonetic: "/ma.me/", exampleSentence: "Mame dzal obok.", exampleTranslation: "Mère prépare la nourriture.", tags: ['family'] },
      { word: "Kimi", meaning: "Enfant", meaningEn: "Child", phonetic: "/ki.mi/", exampleSentence: "Kimi yem kap.", exampleTranslation: "Mon enfant joue.", tags: ['family'] },
      { word: "Ntôle", meaning: "Frère", meaningEn: "Brother", phonetic: "/n-tô.le/", exampleSentence: "Ntôle yem toŋ.", exampleTranslation: "Mon frère est arrivé.", tags: ['family'] },
      { word: "Ngon", meaning: "Fille / Sœur", meaningEn: "Daughter / Sister", phonetic: "/ŋgɔn/", exampleSentence: "Ngon yem dzal.", exampleTranslation: "Ma sœur fait à manger.", tags: ['family'] },
    ],
    chiffres: [
      { word: "Bo", meaning: "Un (1)", meaningEn: "One", phonetic: "/bo/", exampleSentence: "Lo bo.", exampleTranslation: "Il en a un.", tags: ['numbers'] },
      { word: "Ba", meaning: "Deux (2)", meaningEn: "Two", phonetic: "/ba/", exampleSentence: "Kimi ba kap.", exampleTranslation: "Deux enfants jouent.", tags: ['numbers'] },
      { word: "Lé", meaning: "Trois (3)", meaningEn: "Three", phonetic: "/lé/", exampleSentence: "Lé toŋ.", exampleTranslation: "Trois sont venus.", tags: ['numbers'] },
      { word: "Nyéé", meaning: "Quatre (4)", meaningEn: "Four", phonetic: "/ɲéé/", exampleSentence: "Nyéé ngon.", exampleTranslation: "Quatre filles.", tags: ['numbers'] },
      { word: "Tán", meaning: "Cinq (5)", meaningEn: "Five", phonetic: "/tán/", exampleSentence: "Tán ntôle.", exampleTranslation: "Cinq frères.", tags: ['numbers'] },
      { word: "Sámba", meaning: "Dix (10)", meaningEn: "Ten", phonetic: "/sám.ba/", exampleSentence: "Sámba zok.", exampleTranslation: "Dix élèves.", tags: ['numbers'] },
    ],
    nature: [
      { word: "Nguia", meaning: "Eau", meaningEn: "Water", phonetic: "/ŋgu.ja/", exampleSentence: "Pa nguia!", exampleTranslation: "Apporte de l'eau!", tags: ['nature'] },
      { word: "Wulu", meaning: "Soleil", meaningEn: "Sun", phonetic: "/wu.lu/", exampleSentence: "Wulu dzem.", exampleTranslation: "Le soleil est chaud.", tags: ['nature'] },
      { word: "Osam", meaning: "Arbre", meaningEn: "Tree", phonetic: "/o.sam/", exampleSentence: "Osam tsé ke'e.", exampleTranslation: "L'arbre est très grand.", tags: ['nature'] },
      { word: "Ngwi", meaning: "Pluie", meaningEn: "Rain", phonetic: "/ŋgwi/", exampleSentence: "Ngwi wu dzam.", exampleTranslation: "La pluie tombe fort.", tags: ['nature'] },
    ],
  },

  bassa: {
    salutations: [
      { word: "Me yéga", meaning: "Bonjour (matin)", meaningEn: "Good morning", phonetic: "/me jé.ga/", exampleSentence: "Me yéga, ŋkɛ́ nwi?", exampleTranslation: "Bonjour, comment vas-tu?", tags: ['greeting'] },
      { word: "Inyanga", meaning: "Merci", meaningEn: "Thank you", phonetic: "/i.ɲa.ŋga/", exampleSentence: "Inyanga ma!", exampleTranslation: "Merci beaucoup!", tags: ['politeness'] },
      { word: "Hii", meaning: "Oui", meaningEn: "Yes", phonetic: "/hiː/", exampleSentence: "Hii, mine i.", exampleTranslation: "Oui, c'est moi.", tags: ['basic'] },
      { word: "Máŋgé", meaning: "Non", meaningEn: "No", phonetic: "/má.ŋgé/", exampleSentence: "Máŋgé, ke' si.", exampleTranslation: "Non, ce n'est pas ça.", tags: ['basic'] },
      { word: "ŋkɛ́ nwi?", meaning: "Comment vas-tu ?", meaningEn: "How are you?", phonetic: "/ŋkɛ́ nwi/", exampleSentence: "Tate, ŋkɛ́ nwi?", exampleTranslation: "Père, comment vas-tu?", tags: ['greeting'] },
      { word: "M'hɔm", meaning: "Je vais bien", meaningEn: "I'm fine", phonetic: "/m-hɔm/", exampleSentence: "M'hɔm, inyanga!", exampleTranslation: "Je vais bien, merci!", tags: ['greeting'] },
    ],
    famille: [
      { word: "Tate", meaning: "Père", meaningEn: "Father", phonetic: "/ta.te/", exampleSentence: "Tate to'o ñlem.", exampleTranslation: "Père est rentré à la maison.", tags: ['family'] },
      { word: "Nyango", meaning: "Mère", meaningEn: "Mother", phonetic: "/ɲa.ŋgo/", exampleSentence: "Nyango dzal ndúm.", exampleTranslation: "Mère prépare à manger.", tags: ['family'] },
      { word: "Mwana", meaning: "Enfant", meaningEn: "Child", phonetic: "/mwa.na/", exampleSentence: "Mwana wam kap.", exampleTranslation: "Mon enfant joue.", tags: ['family'] },
      { word: "Mbam", meaning: "Frère / Sœur", meaningEn: "Sibling", phonetic: "/mbam/", exampleSentence: "Mbam wam to'o.", exampleTranslation: "Mon frère/ma sœur est arrivé(e).", tags: ['family'] },
      { word: "Ñlem", meaning: "Maison / Chez soi", meaningEn: "Home", phonetic: "/ɲlem/", exampleSentence: "M'to ñlem!", exampleTranslation: "Je rentre à la maison!", tags: ['places'] },
    ],
    chiffres: [
      { word: "Muñ", meaning: "Un (1)", meaningEn: "One", phonetic: "/muɲ/", exampleSentence: "Muñ mwana.", exampleTranslation: "Un enfant.", tags: ['numbers'] },
      { word: "Bali", meaning: "Deux (2)", meaningEn: "Two", phonetic: "/ba.li/", exampleSentence: "Bali tate.", exampleTranslation: "Deux pères.", tags: ['numbers'] },
      { word: "Lend", meaning: "Trois (3)", meaningEn: "Three", phonetic: "/lɛnd/", exampleSentence: "Lend mbam.", exampleTranslation: "Trois frères/sœurs.", tags: ['numbers'] },
      { word: "Nyal", meaning: "Quatre (4)", meaningEn: "Four", phonetic: "/ɲal/", exampleSentence: "Nyal mwana kap.", exampleTranslation: "Quatre enfants jouent.", tags: ['numbers'] },
      { word: "Tan", meaning: "Cinq (5)", meaningEn: "Five", phonetic: "/tan/", exampleSentence: "Tan nyango.", exampleTranslation: "Cinq femmes.", tags: ['numbers'] },
    ],
    nature: [
      { word: "Maŋ", meaning: "Eau", meaningEn: "Water", phonetic: "/maŋ/", exampleSentence: "Kɔ maŋ i!", exampleTranslation: "Donne-moi de l'eau!", tags: ['nature'] },
      { word: "Ñjom", meaning: "Forêt / Brousse", meaningEn: "Forest / Bush", phonetic: "/ɲjom/", exampleSentence: "Tate to ñjom.", exampleTranslation: "Père est en forêt.", tags: ['nature'] },
      { word: "Mbɔŋ", meaning: "Soleil", meaningEn: "Sun", phonetic: "/mbɔŋ/", exampleSentence: "Mbɔŋ hɛp!", exampleTranslation: "Le soleil est fort!", tags: ['nature'] },
      { word: "Ndiŋ", meaning: "Pluie", meaningEn: "Rain", phonetic: "/ndiŋ/", exampleSentence: "Ndiŋ wu.", exampleTranslation: "Il pleut.", tags: ['nature'] },
    ],
  },

  bulu: {
    salutations: [
      { word: "Mbolani", meaning: "Bienvenue / Bonjour", meaningEn: "Welcome / Hello", phonetic: "/mbo.la.ni/", exampleSentence: "Mbolani, wô yé?", exampleTranslation: "Bienvenue, comment vas-tu?", tags: ['greeting'] },
      { word: "Akiba", meaning: "Merci", meaningEn: "Thank you", phonetic: "/a.ki.ba/", exampleSentence: "Akiba mininga!", exampleTranslation: "Merci beaucoup!", tags: ['politeness'] },
      { word: "Yë́", meaning: "Oui", meaningEn: "Yes", phonetic: "/jě/", exampleSentence: "Yë́, mine mé.", exampleTranslation: "Oui, c'est bien moi.", tags: ['basic'] },
      { word: "Awée", meaning: "Non", meaningEn: "No", phonetic: "/a.wée/", exampleSentence: "Awée, mbaa si.", exampleTranslation: "Non, ce n'est pas comme ça.", tags: ['basic'] },
      { word: "Mbo wô?", meaning: "Comment vas-tu ?", meaningEn: "How are you?", phonetic: "/mbo wô/", exampleSentence: "Etua, mbo wô?", exampleTranslation: "Père, comment vas-tu?", tags: ['greeting'] },
      { word: "Me fap", meaning: "Je vais bien", meaningEn: "I'm fine", phonetic: "/me fap/", exampleSentence: "Me fap, akiba yem!", exampleTranslation: "Je vais bien, merci à toi!", tags: ['greeting'] },
    ],
    famille: [
      { word: "Etua", meaning: "Père", meaningEn: "Father", phonetic: "/e.tu.a/", exampleSentence: "Etua toŋ ayong.", exampleTranslation: "Père est dans le village.", tags: ['family'] },
      { word: "Enam", meaning: "Mère", meaningEn: "Mother", phonetic: "/e.nam/", exampleSentence: "Enam dzal obok.", exampleTranslation: "Mère prépare à manger.", tags: ['family'] },
      { word: "Moan", meaning: "Enfant", meaningEn: "Child", phonetic: "/mo.an/", exampleSentence: "Moan wam kap.", exampleTranslation: "Mon enfant joue.", tags: ['family'] },
      { word: "Nnom", meaning: "Mari / Homme", meaningEn: "Husband / Man", phonetic: "/nnom/", exampleSentence: "Nnom wam toŋ.", exampleTranslation: "Mon mari est là.", tags: ['family'] },
      { word: "Ngon", meaning: "Fille / Femme", meaningEn: "Girl / Woman", phonetic: "/ŋgɔn/", exampleSentence: "Ngon wam dzal.", exampleTranslation: "Ma fille prépare.", tags: ['family'] },
    ],
    chiffres: [
      { word: "Abo", meaning: "Un (1)", meaningEn: "One", phonetic: "/a.bo/", exampleSentence: "Moan abo.", exampleTranslation: "Un enfant.", tags: ['numbers'] },
      { word: "Eba", meaning: "Deux (2)", meaningEn: "Two", phonetic: "/e.ba/", exampleSentence: "Eba nnom.", exampleTranslation: "Deux hommes.", tags: ['numbers'] },
      { word: "Elé", meaning: "Trois (3)", meaningEn: "Three", phonetic: "/e.lé/", exampleSentence: "Elé enam.", exampleTranslation: "Trois femmes.", tags: ['numbers'] },
      { word: "Ebaa", meaning: "Quatre (4)", meaningEn: "Four", phonetic: "/e.baː/", exampleSentence: "Ebaa moan kap.", exampleTranslation: "Quatre enfants jouent.", tags: ['numbers'] },
      { word: "Etán", meaning: "Cinq (5)", meaningEn: "Five", phonetic: "/e.tán/", exampleSentence: "Etán pɛ nda.", exampleTranslation: "Cinq dans la maison.", tags: ['numbers'] },
    ],
    nature: [
      { word: "Ndog", meaning: "Eau", meaningEn: "Water", phonetic: "/ndɔg/", exampleSentence: "Kɔ ndog i!", exampleTranslation: "Apporte-moi de l'eau!", tags: ['nature'] },
      { word: "Oveng", meaning: "Arbre / Forêt", meaningEn: "Tree / Forest", phonetic: "/o.veŋ/", exampleSentence: "Etua to oveng.", exampleTranslation: "Père est en forêt.", tags: ['nature'] },
      { word: "Nguia", meaning: "Soleil", meaningEn: "Sun", phonetic: "/ŋgu.ja/", exampleSentence: "Nguia dzem.", exampleTranslation: "Le soleil est chaud.", tags: ['nature'] },
      { word: "Ngwi", meaning: "Pluie", meaningEn: "Rain", phonetic: "/ŋgwi/", exampleSentence: "Ngwi wu.", exampleTranslation: "Il pleut.", tags: ['nature'] },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// LESSONS CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const lessonThemes = [
  { key: 'salutations', title: 'Les Salutations', theme: 'Salutations & Formules de politesse', order: 1, xpReward: 80, estimatedMinutes: 8 },
  { key: 'famille', title: 'La Famille', theme: 'Vocabulaire de la famille', order: 2, xpReward: 100, estimatedMinutes: 10 },
  { key: 'chiffres', title: 'Les Chiffres', theme: 'Chiffres de 1 à 10', order: 3, xpReward: 100, estimatedMinutes: 10 },
  { key: 'nature', title: 'La Nature', theme: 'Nature, eau, soleil, pluie', order: 4, xpReward: 120, estimatedMinutes: 12 },
];

// ─────────────────────────────────────────────────────────────────────────────
// SEED
// ─────────────────────────────────────────────────────────────────────────────
const seedData = async () => {
  if (!MONGO_URI) {
    console.error('❌ MONGO_URI is not defined in .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB for seeding...');

    await Language.deleteMany({});
    await Lesson.deleteMany({});
    await VocabularyItem.deleteMany({});
    console.log('🗑️  Cleared existing data.');

    // ── LANGUAGES ──────────────────────────────────────────────────────────
    const languages = [
      {
        code: 'ghomala',
        name: "Ghomala'",
        region: 'Ouest',
        subRegions: ['Bamboutos', 'Hauts-Plateaux'],
        color: '#8E24AA',
        gradientColors: ['#8E24AA', '#AB47BC'],
        description: "Langue principale du peuple Bamiléké de la région Ouest. Parlée par plus d'1 million de locuteurs.",
        speakersEstimate: 1200000,
        phase: 1,
        isActive: true,
        order: 1,
      },
      {
        code: 'medumba',
        name: 'Medumba',
        region: 'Ouest',
        subRegions: ['Ndé'],
        color: '#D84315',
        gradientColors: ['#D84315', '#F4511E'],
        description: 'Langue bamiléké parlée principalement dans le Ndé, autour de Bangangté.',
        speakersEstimate: 600000,
        phase: 1,
        isActive: true,
        order: 2,
      },
      {
        code: 'yemba',
        name: 'Yémba',
        region: 'Ouest',
        subRegions: ['Menoua'],
        color: '#6D4C41',
        gradientColors: ['#6D4C41', '#8D6E63'],
        description: 'Langue de la Menoua, parlée autour de Dschang et ses villages.',
        speakersEstimate: 450000,
        phase: 1,
        isActive: true,
        order: 3,
      },
      {
        code: 'ewondo',
        name: 'Ewondo',
        region: 'Centre',
        subRegions: ['Mfoundi', 'Lékié'],
        color: '#007A5E',
        gradientColors: ['#007A5E', '#004D3C'],
        description: 'Langue du peuple Beti, parlée à Yaoundé et dans de nombreuses villes du Cameroun.',
        speakersEstimate: 600000,
        phase: 1,
        isActive: true,
        order: 4,
      },
      {
        code: 'bassa',
        name: "Bassa'a",
        region: 'Littoral / Centre',
        subRegions: ['Sanaga-Maritime', 'Nyong-et-Kéllé'],
        color: '#1E88E5',
        gradientColors: ['#1E88E5', '#42A5F5'],
        description: 'Langue bantoue du peuple Bassa, entre le Littoral et le Centre.',
        speakersEstimate: 700000,
        phase: 1,
        isActive: true,
        order: 5,
      },
      {
        code: 'bulu',
        name: 'Bulu',
        region: 'Sud',
        subRegions: ['Dja-et-Lobo', 'Mvila'],
        color: '#2E7D32',
        gradientColors: ['#2E7D32', '#43A047'],
        description: 'Langue bantoue du peuple Bulu, parlée dans la région Sud du Cameroun.',
        speakersEstimate: 400000,
        phase: 1,
        isActive: true,
        order: 6,
      },
      // Phase 2
      {
        code: 'douala',
        name: 'Duala',
        region: 'Littoral',
        subRegions: ['Wouri'],
        color: '#0097A7',
        gradientColors: ['#0097A7', '#26C6DA'],
        description: 'La langue historique de la ville de Douala.',
        speakersEstimate: 300000,
        phase: 2,
        isActive: false,
        order: 7,
      },
      {
        code: 'fulfulde',
        name: 'Fulfuldé',
        region: 'Adamaoua / Nord',
        subRegions: ['Adamaoua', 'Nord', 'Extrême-Nord'],
        color: '#FF8F00',
        gradientColors: ['#FF8F00', '#FFB300'],
        description: 'Langue peule, lingua franca du Grand Nord camerounais.',
        speakersEstimate: 3000000,
        phase: 2,
        isActive: false,
        order: 8,
      },
    ];

    const createdLanguages = await Language.insertMany(languages);
    console.log(`✅ Inserted ${createdLanguages.length} languages.`);

    // ── LESSONS & VOCABULARY ───────────────────────────────────────────────
    let totalLessons = 0;
    let totalVocab = 0;

    for (const lang of createdLanguages) {
      if (lang.phase !== 1) continue;

      const langVocab = vocabData[lang.code];
      if (!langVocab) {
        console.warn(`⚠️  No vocab data for ${lang.code}, skipping.`);
        continue;
      }

      for (const theme of lessonThemes) {
        const themeVocab = langVocab[theme.key];
        if (!themeVocab || themeVocab.length === 0) continue;

        const lesson = await Lesson.create({
          languageId: lang._id,
          title: theme.title,
          theme: theme.theme,
          level: 'beginner',
          order: theme.order,
          xpReward: theme.xpReward,
          estimatedMinutes: theme.estimatedMinutes,
          isPublished: true,
          isOfflineAvailable: true,
        });

        const vocabItems = themeVocab.map(v => ({
          lessonId: lesson._id,
          languageId: lang._id,
          ...v,
          validatedByNative: false,
        }));

        await VocabularyItem.insertMany(vocabItems);
        totalLessons++;
        totalVocab += vocabItems.length;
      }

      console.log(`  ✅ ${lang.name}: ${Object.keys(langVocab).length} leçons créées.`);
    }

    console.log(`\n🎉 Seeding terminé!`);
    console.log(`   Langues : ${createdLanguages.length}`);
    console.log(`   Leçons  : ${totalLessons}`);
    console.log(`   Mots    : ${totalVocab}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
