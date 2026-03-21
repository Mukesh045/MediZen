import skinMedicineDatabase from '../data/skinMedicineDatabase.json';

export const getAllSkinConditions = () => {
  return Object.keys(skinMedicineDatabase.skinConditions).map(condition => ({
    name: condition,
    symptoms: skinMedicineDatabase.skinConditions[condition].symptoms,
    tips: skinMedicineDatabase.skinConditions[condition].tips
  }));
};

export const detectSkinCondition = (symptomText) => {
  const textLower = symptomText.toLowerCase();
  const detectedConditions = [];

  const skinConditionKeywords = {
    acne: ['acne', 'pimple', 'pimples', 'zit', 'breakout', 'blackhead', 'whitehead', 'comedone', 'pustule', 'cystic acne', 'oily skin', 'skin breakout', 'face breakout', '治痘', 'acne vulgaris'],
    eczema: ['eczema', 'dermatitis', 'atopic', 'dry skin', 'itchy skin', 'skin inflammation', 'red patches', 'flaky skin', 'rough skin', 'skin irritation', 'neurodermatitis'],
    ringworm: ['ringworm', 'tinea', 'fungal infection', 'athlete foot', "athlete's foot", 'jock itch', 'candidiasis', 'skin fungus', 'circular rash', 'red ring'],
    scabies: ['scabies', 'burrow', 'parasite', 'mite', 'intense itching night', 'itch at night'],
    wart: ['wart', 'verruca', 'plantar wart', 'common wart', 'rough bump', 'cauliflower bump'],
    psoriasis: ['psoriasis', 'plaque', 'silvery scale', 'thick skin', 'red patches scales', 'psoriatic'],
    sunburn: ['sunburn', 'sun burn', 'burned skin', 'sun exposure', 'blister sunburn', 'red burned skin'],
    hives: ['hives', 'urticaria', 'welts', 'itchy welts', 'raised itchy', 'allergic rash'],
    insect_bites: ['insect bite', 'mosquito bite', 'bug bite', 'bite mark', 'sting', 'bee sting'],
    minor_burns: ['burn', 'minor burn', 'hot water burn', 'heat burn', 'touch burn'],
    scar: ['scar', 'scars', 'scar tissue', 'old scar', 'surgical scar', 'acne scar', 'mark'],
    dark_spots: ['dark spot', 'hyperpigmentation', 'melasma', 'age spot', 'sun spot', 'brown spot', 'uneven skin tone', 'skin discoloration', 'post acne mark', 'pigmentation']
  };

  const conditionWeights = {
    acne: 0,
    eczema: 0,
    ringworm: 0,
    scabies: 0,
    wart: 0,
    psoriasis: 0,
    sunburn: 0,
    hives: 0,
    insect_bites: 0,
    minor_burns: 0,
    scar: 0,
    dark_spots: 0
  };

  for (const [condition, keywords] of Object.entries(skinConditionKeywords)) {
    for (const keyword of keywords) {
      if (textLower.includes(keyword)) {
        const weight = keywords.indexOf(keyword) === 0 ? 2 : 1;
        conditionWeights[condition] += weight;
      }
    }
  }

  for (const [condition, weight] of Object.entries(conditionWeights)) {
    if (weight > 0) {
      detectedConditions.push({
        condition,
        confidence: Math.min(weight / 3, 1),
        weight
      });
    }
  }

  return detectedConditions
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 3);
};

export const getMedicinesForCondition = (conditionName) => {
  const condition = skinMedicineDatabase.skinConditions[conditionName];
  if (!condition) return [];

  const medicines = [];
  const medicineIds = condition.medicines;

  for (const medId of medicineIds) {
    const higherPriceMed = skinMedicineDatabase.skinMedicines.find(m => m.id === medId);
    if (higherPriceMed) {
      const lowerPriceAlt = skinMedicineDatabase.skinMedicines.find(
        m => m.alternativeTo === medId && !m.higherPrice
      );

      medicines.push({
        primary: higherPriceMed,
        alternative: lowerPriceAlt || null,
        tips: condition.tips
      });
    }
  }

  return medicines;
};

export const getSkinRoutine = (conditionName) => {
  const routineMap = {
    acne: 'acne',
    eczema: 'eczema',
    ringworm: 'fungal_infection',
    scabies: 'general_skin',
    wart: 'general_skin',
    psoriasis: 'general_skin',
    sunburn: 'general_skin',
    hives: 'general_skin',
    insect_bites: 'general_skin',
    minor_burns: 'general_skin',
    scar: 'general_skin',
    dark_spots: 'general_skin'
  };

  const routineKey = routineMap[conditionName] || 'general_skin';
  return skinMedicineDatabase.routines[routineKey] || skinMedicineDatabase.routines.general_skin;
};

export const getSkinTips = (conditionName) => {
  const condition = skinMedicineDatabase.skinConditions[conditionName];
  return condition ? condition.tips : [];
};

export const getSkinMedicineDetails = (medicineId) => {
  return skinMedicineDatabase.skinMedicines.find(m => m.id === medicineId);
};

export const formatPrice = (price) => {
  return `₹${price.toLocaleString('en-IN')}`;
};

export const diagnoseSkinCondition = async (symptomText, imageAnalysis = null) => {
  const detectedConditions = detectSkinCondition(symptomText);

  if (detectedConditions.length === 0) {
    return {
      success: false,
      message: "Could not detect a specific skin condition. Please describe your skin problem in more detail.",
      detectedConditions: [],
      medicines: [],
      routine: null,
      tips: []
    };
  }

  const primaryCondition = detectedConditions[0].condition;
  const medicines = getMedicinesForCondition(primaryCondition);
  const routine = getSkinRoutine(primaryCondition);
  const tips = getSkinTips(primaryCondition);

  return {
    success: true,
    detectedConditions,
    primaryCondition,
    medicines,
    routine,
    tips,
    imageAnalysis,
    timestamp: new Date().toISOString()
  };
};

export default {
  getAllSkinConditions,
  detectSkinCondition,
  getMedicinesForCondition,
  getSkinRoutine,
  getSkinTips,
  getSkinMedicineDetails,
  formatPrice,
  diagnoseSkinCondition
};