import * as tf from '@tensorflow/tfjs';

let symptomModel = null;
let symptomVectors = null;

const symptomKeywords = {
  // Pain related
  pain: ['pain', 'ache', 'hurt', 'sore', 'throb', 'stab', 'burn', 'cramp', 'discomfort'],
  body_pain: ['body pain', 'body ache', 'body hurts', 'muscle ache', 'joint ache', 'body soreness', '全身疼痛', '全身酸痛', 'body pain all over'],
  headache: ['headache', 'head pain', 'migraine', 'head hurts', 'pressure in head', 'head throbbing', 'head heavy', 'pain in head', 'sick headache', 'سر درد', 'दर्द सिर'],
  head_pain: ['head pain', 'head hurts', 'pain in head', 'head throbbing', 'headache', 'heavy head'],
  neck_pain: ['neck pain', 'neck ache', 'stiff neck', 'neck stiffness', 'pain in neck'],
  shoulder_pain: ['shoulder pain', 'shoulder ache', 'shoulder stiffness', 'pain in shoulder'],
  leg_pain: ['leg pain', 'leg ache', 'leg hurts', 'thigh pain', 'calf pain', 'pain in legs'],
  arm_pain: ['arm pain', 'arm ache', 'arm hurts', 'hand pain', 'wrist pain'],
  tooth_pain: ['tooth pain', 'toothache', 'tooth hurts', 'dental pain', 'tooth infection'],
  eye_pain: ['eye pain', 'eye ache', 'eyes hurt', 'pain in eyes', 'eye strain'],

  // Fever related
  fever: ['fever', 'hot', 'temperature', 'chill', 'shiver', 'high temp', 'febrile', 'feverish', 'feeling hot', 'burning up', 'got fever', 'high temperature', 'बुखार', 'तेज बुखार'],
  high_fever: ['high fever', 'severe fever', 'very high temperature', '102 fever', '103 fever', '104 fever'],
  mild_fever: ['mild fever', 'low grade fever', 'slight fever', 'temperature'],
  chills: ['chills', 'shivering', 'shiver', 'feeling cold', 'rigors'],
  sweating: ['sweating', 'sweat', 'night sweats', 'excessive sweating'],

  // Cold, Flu & Cough
  cold: ['cold', 'flu', 'runny nose', 'sore throat', 'sniffles', 'common cold', 'viral cold', 'nasal discharge', 'nasal congestion'],
  flu: ['flu', 'influenza', 'viral flu', 'seasonal flu', 'got flu'],
  cough: ['cough', 'coughing', 'tickle in throat', 'hack', 'coughing a lot', 'persistent cough', 'कफ', 'खांसी'],
  dry_cough: ['dry cough', 'tickly cough', 'hacking cough', 'non-productive cough'],
  wet_cough: ['wet cough', 'productive cough', 'cough with mucus', 'cough with phlegm'],
  chest_cough: ['chest cough', 'cough from chest', 'deep cough'],
  throat_irritation: ['throat pain', 'sore throat', 'throat infection', 'painful swallowing', 'pharyngitis', 'गले में दर्द', 'गला खराश'],
  sneezing: ['sneezing', 'sneeze', 'sneezes', 'cannot stop sneezing', 'frequent sneezing', 'छींक', 'छींक आना'],
  runny_nose: ['runny nose', 'nasal discharge', 'watery nose', 'nose running', 'dripping nose', 'नाक बहना', 'नाक से पानी'],
  blocked_nose: ['blocked nose', 'stuffy nose', 'congested nose', 'cannot breathe through nose', 'nose blocked', 'नाक बंद'],
  sore_throat: ['sore throat', 'throat pain', 'painful throat', 'throat scratchy'],
  congestion: ['congested', 'blocked', 'stuffy', 'cannot breathe', 'sinus', 'nasal congestion', 'chest congestion', 'सीने में भारीपन'],
  sinus: ['sinus', 'sinusitis', 'sinus infection', 'sinus pain', 'sinus pressure'],
  mucus: ['mucus', 'phlegm', 'sputum', 'slime', 'thick mucus'],
  sore_throat: ['sore throat', 'throat pain', 'painful swallowing', 'scratchy throat'],

  // Allergy related
  allergy: ['allergy', 'allergic', 'sneezing', 'watery eyes', 'pollen', 'allergic reaction', 'allergy symptoms', 'एलर्जी'],
  allergic_rhinitis: ['allergic rhinitis', 'hay fever', 'seasonal allergies', 'pollen allergy'],
  watery_eyes: ['watery eyes', 'teary eyes', 'eyes watering', 'eyes watery', 'ने आंसू आना'],
  itchy_eyes: ['itchy eyes', 'eye itching', 'eyes itch', 'eyes are itchy'],
  skin_allergy: ['skin allergy', 'allergic rash', 'allergic skin', 'hives', 'urticaria'],
  food_allergy: ['food allergy', 'allergic to food', 'food reaction'],
  dust_allergy: ['dust allergy', 'allergic to dust', 'dust mites'],

  // Digestive
  nausea: ['nausea', 'nauseous', 'sick', 'want to vomit', 'queasy', 'feel sick'],
  vomiting: ['vomit', 'throwing up', 'puke', 'throw up', 'vomited'],
  diarrhea: ['diarrhea', 'loose stool', 'watery stool', 'frequent bowel', ' loose motions'],
  constipation: ['constipation', 'cannot poop', 'hard stool', 'blocked', 'difficulty passing stool'],
  stomach_pain: ['stomach pain', 'belly pain', 'abdominal pain', 'tummy ache', 'पेट दर्द', 'पेट में दर्द'],
  gas: ['gas', 'bloating', 'flatulence', 'burping', 'indigestion'],
  acidity: ['acidity', 'acid', 'heartburn', 'acid reflux', 'sour stomach'],
  loss_of_appetite: ['loss of appetite', 'no appetite', 'not feeling hungry', 'cant eat'],
  bloating: ['bloating', 'bloated', 'stomach bloating', 'full feeling'],

  // Respiratory
  breathing: ['breath', 'breathe', 'wheezing', 'short of breath', 'breathing difficulty', 'breathlessness', 'cannot breathe'],
  wheezing: ['wheezing', 'whistling breath', 'noisy breathing'],
  chest_pain: ['chest pain', 'heart pain', 'tight chest', 'pressure in chest', 'pain in chest'],
  asthma: ['asthma', 'asthmatic', 'breathing problem', 'asthma attack'],
  shortness_of_breath: ['shortness of breath', 'breathlessness', 'difficulty breathing', 'cant breathe'],

  // General
  fatigue: ['tired', 'exhausted', 'fatigue', 'weak', 'no energy', 'drowsy', 'weakness', 'थकान', 'थका हुआ'],
  dizziness: ['dizzy', 'lightheaded', 'vertigo', 'spinning', 'unsteady', 'giddiness'],
  insomnia: ['insomnia', 'cannot sleep', 'no sleep', 'trouble sleeping', 'awake', 'cant sleep'],
  anxiety: ['anxiety', 'anxious', 'worried', 'nervous', 'panic', 'stress', 'tension'],
  depression: ['depressed', 'sad', 'hopeless', 'low mood', 'unhappy'],
  weakness: ['weakness', 'weak', 'fatigue', 'no strength', 'feeling weak'],
  body_weakness: ['body weakness', 'weakness in body', 'no energy', 'feeling weak'],

  // Other symptoms
  swelling: ['swelling', 'swollen', 'puffy', 'inflamed', ' edema', 'swelled'],
  rash: ['rash', 'red skin', 'spots', 'hives', 'bumps', 'itchy skin'],
  itching: ['itch', 'itchy', 'scratch', 'irritation', 'कँडी'],
  dryness: ['dry', 'dryness', 'flaky', 'peeling'],
  redness: ['red', 'redness', 'flushed', 'pink'],
  wound: ['wound', 'cut', 'scratch', 'injury', 'bleeding'],
  infection: ['infection', 'infected', 'pus', 'redness', 'warmth'],
};

export const loadSymptomModel = async () => {
  if (symptomModel) return symptomModel;

  await tf.ready();

  symptomModel = {
    version: '1.0.0',
    loaded: true,
  };

  console.log('Symptom analysis model loaded');
  return symptomModel;
};

export const analyzeSymptoms = async (symptomText) => {
  await loadSymptomModel();

  const textLower = symptomText.toLowerCase();
  const detectedSymptoms = [];

  for (const [symptom, keywords] of Object.entries(symptomKeywords)) {
    for (const keyword of keywords) {
      if (textLower.includes(keyword)) {
        detectedSymptoms.push({
          symptom,
          confidence: keywords.indexOf(keyword) === 0 ? 1.0 : 0.8 - keywords.indexOf(keyword) * 0.1,
          matchedKeyword: keyword,
        });
        break;
      }
    }
  }

  const uniqueSymptoms = [];
  const seen = new Set();
  for (const s of detectedSymptoms) {
    if (!seen.has(s.symptom)) {
      seen.add(s.symptom);
      uniqueSymptoms.push(s);
    }
  }

  return uniqueSymptoms.sort((a, b) => b.confidence - a.confidence);
};

export const getSymptomCategory = (symptoms) => {
  const categories = {
    respiratory: ['cough', 'congestion', 'breathing', 'cold', 'allergy'],
    digestive: ['nausea', 'vomiting', 'diarrhea', 'constipation', 'stomach_pain'],
    pain: ['pain', 'headache', 'chest_pain', 'back_pain', 'joint_pain', 'muscle_pain'],
    skin: ['rash', 'itching', 'acne', 'dryness', 'redness', 'swelling'],
    general: ['fever', 'fatigue', 'dizziness', 'insomnia', 'anxiety', 'depression'],
  };

  for (const [category, categorySymptoms] of Object.entries(categories)) {
    for (const symptom of symptoms) {
      if (categorySymptoms.includes(symptom.symptom)) {
        return category;
      }
    }
  }

  return 'general';
};

export default {
  loadSymptomModel,
  analyzeSymptoms,
  getSymptomCategory,
};