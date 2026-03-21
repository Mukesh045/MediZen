import generalHealthDatabase from '../data/generalHealthDatabase.json';

export const getAllConditions = () => {
  const conditions = new Set();

  for (const medicine of generalHealthDatabase.medicines) {
    for (const use of medicine.uses) {
      conditions.add(use);
    }
  }

  return Array.from(conditions).sort();
};

export const detectCondition = (symptomText) => {
  const textLower = symptomText.toLowerCase();
  const detectedConditions = [];

  const conditionKeywords = {};

  for (const [symptom, medicineIds] of Object.entries(generalHealthDatabase.symptoms)) {
    const keywords = [];
    for (const id of medicineIds) {
      const medicine = generalHealthDatabase.medicines.find(m => m.id === id);
      if (medicine && medicine.uses) {
        keywords.push(...medicine.uses);
      }
    }
    conditionKeywords[symptom] = [...new Set(keywords)];
  }

  for (const [symptom, keywords] of Object.entries(conditionKeywords)) {
    for (const keyword of keywords) {
      if (textLower.includes(keyword)) {
        const existing = detectedConditions.find(c => c.symptom === symptom);
        if (existing) {
          existing.confidence = Math.min(existing.confidence + 0.2, 1);
        } else {
          detectedConditions.push({
            symptom,
            confidence: 0.8,
            matchedKeyword: keyword
          });
        }
        break;
      }
    }
  }

  return detectedConditions.sort((a, b) => b.confidence - a.confidence);
};

export const getMedicinesForSymptoms = (detectedSymptoms) => {
  const medicineScores = {};

  for (const symptomObj of detectedSymptoms) {
    const symptomName = symptomObj.symptom;
    const confidence = symptomObj.confidence;

    const relatedMedicineIds = generalHealthDatabase.symptoms[symptomName] || [];

    for (const medicineId of relatedMedicineIds) {
      if (!medicineScores[medicineId]) {
        medicineScores[medicineId] = {
          id: medicineId,
          score: 0,
          matchedSymptoms: []
        };
      }

      medicineScores[medicineId].score += confidence;
      medicineScores[medicineId].matchedSymptoms.push(symptomName);
    }
  }

  const rankedMedicines = Object.values(medicineScores)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map(item => {
      const medicine = generalHealthDatabase.medicines.find(m => m.id === item.id);
      return {
        ...medicine,
        matchScore: item.score,
        matchedSymptoms: item.matchedSymptoms,
        confidence: Math.min(item.score / 3, 1)
      };
    });

  const groupedByCondition = {};
  for (const med of rankedMedicines) {
    const key = med.uses[0];
    if (!groupedByCondition[key]) {
      groupedByCondition[key] = [];
    }
    groupedByCondition[key].push(med);
  }

  const result = [];
  for (const [condition, medicines] of Object.entries(groupedByCondition)) {
    const primary = medicines.find(m => m.higherPrice);
    const alternative = medicines.find(m => !m.higherPrice);

    if (primary || alternative) {
      result.push({
        condition: condition.replace(/_/g, ' '),
        primary,
        alternative,
        matchedSymptoms: [...new Set(medicines.flatMap(m => m.matchedSymptoms))]
      });
    }
  }

  return result;
};

export const getRoutineForCondition = (condition) => {
  const routines = generalHealthDatabase.routines;

  const conditionMap = {
    fever: 'fever',
    high_fever: 'fever',
    mild_fever: 'fever',
    cold: 'cold_flu',
    flu: 'cold_flu',
    cough: 'cough',
    dry_cough: 'cough',
    wet_cough: 'cough',
    congestion: 'cold_flu',
    allergy: 'allergy',
    allergic_rhinitis: 'allergy',
    headache: 'headache',
    head_pain: 'headache',
    body_pain: 'body_pain',
    general_health: 'general_health'
  };

  const routineKey = conditionMap[condition] || 'general_health';
  return routines[routineKey] || routines.general_health;
};

export const formatPrice = (price) => {
  return `₹${price.toLocaleString('en-IN')}`;
};

export const diagnoseGeneralCondition = async (symptomText) => {
  const detectedSymptoms = detectCondition(symptomText);

  if (detectedSymptoms.length === 0) {
    return {
      success: false,
      message: "Could not detect a specific condition. Please describe your symptoms in more detail.",
      detectedSymptoms: [],
      medicines: [],
      routine: null
    };
  }

  const medicines = getMedicinesForSymptoms(detectedSymptoms);
  const primaryCondition = detectedSymptoms[0].symptom;
  const routine = getRoutineForCondition(primaryCondition);

  return {
    success: true,
    detectedSymptoms: detectedSymptoms.map(s => s.symptom),
    primaryCondition,
    medicines,
    routine,
    timestamp: new Date().toISOString()
  };
};

export default {
  getAllConditions,
  detectCondition,
  getMedicinesForSymptoms,
  getRoutineForCondition,
  formatPrice,
  diagnoseGeneralCondition
};