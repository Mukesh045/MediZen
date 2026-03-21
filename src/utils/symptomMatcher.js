import medicineDatabase from '../data/medicineDatabase.json';

export const matchSymptomsToMedicines = (detectedSymptoms) => {
  const medicines = medicineDatabase.medicines;
  const symptomMap = medicineDatabase.symptoms;

  const medicineScores = {};

  for (const symptomObj of detectedSymptoms) {
    const symptomName = symptomObj.symptom;
    const confidence = symptomObj.confidence;

    const relatedMedicineIds = symptomMap[symptomName] || [];

    for (const medicineId of relatedMedicineIds) {
      if (!medicineScores[medicineId]) {
        medicineScores[medicineId] = {
          id: medicineId,
          score: 0,
          matchedSymptoms: [],
        };
      }

      medicineScores[medicineId].score += confidence;
      medicineScores[medicineId].matchedSymptoms.push(symptomName);
    }
  }

  const rankedMedicines = Object.values(medicineScores)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map((item) => {
      const medicine = medicines.find((m) => m.id === item.id);
      return {
        ...medicine,
        matchScore: item.score,
        matchedSymptoms: item.matchedSymptoms,
        confidence: Math.min(item.score / 3, 1),
      };
    });

  return rankedMedicines;
};

export const getMedicineDetails = (medicineId) => {
  return medicineDatabase.medicines.find((m) => m.id === medicineId);
};

export const getRoutineForCondition = (condition) => {
  const routines = medicineDatabase.routines;

  const conditionMap = {
    headache: 'headache',
    migraine: 'headache',
    fever: 'cold_flu',
    cold: 'cold_flu',
    flu: 'cold_flu',
    allergies: 'allergies',
    'allergic rhinitis': 'allergies',
    'acid reflux': 'digestive',
    gerd: 'digestive',
    heartburn: 'digestive',
    'stomach pain': 'digestive',
    diabetes: 'diabetes',
    'high blood pressure': 'blood_pressure',
    hypertension: 'blood_pressure',
    'high cholesterol': 'blood_pressure',
    acne: 'skin_care',
    eczema: 'skin_care',
    rash: 'skin_care',
  };

  const routineKey = conditionMap[condition.toLowerCase()] || 'general_health';

  return routines[routineKey] || routines.general_health;
};

export const getSkinConditionInfo = (condition) => {
  return medicineDatabase.skinConditions[condition] || null;
};

export const extractKeywords = (text) => {
  const textLower = text.toLowerCase();

  const medicalTerms = [
    'headache', 'migraine', 'fever', 'chill', 'temperature',
    'cough', 'congestion', 'runny nose', 'sneezing',
    'nausea', 'vomiting', 'diarrhea', 'constipation', 'stomach pain',
    'chest pain', 'heart pain', 'shortness of breath', 'wheezing',
    'rash', 'itching', 'hives', 'swelling', 'redness',
    'fatigue', 'tiredness', 'dizziness', 'lightheaded',
    'anxiety', 'stress', 'depression', 'insomnia',
    'pain', 'ache', 'sore', 'cramp',
    'infection', 'inflammation',
  ];

  const found = [];
  for (const term of medicalTerms) {
    if (textLower.includes(term)) {
      found.push(term);
    }
  }

  return [...new Set(found)];
};

export const checkContraindications = (medicineId, userConditions) => {
  const medicine = getMedicineDetails(medicineId);
  if (!medicine || !userConditions) return { hasContraindication: false, warnings: [] };

  const warnings = [];
  const userConditionsLower = userConditions.map(c => c.toLowerCase());

  for (const contra of medicine.contraindications || []) {
    if (userConditionsLower.some(uc => uc.includes(contra) || contra.includes(uc))) {
      warnings.push(`Contraindicated for ${contra}`);
    }
  }

  return {
    hasContraindication: warnings.length > 0,
    warnings,
  };
};

export default {
  matchSymptomsToMedicines,
  getMedicineDetails,
  getRoutineForCondition,
  getSkinConditionInfo,
  extractKeywords,
  checkContraindications,
};