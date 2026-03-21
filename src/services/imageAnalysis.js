import * as mobilenet from '@tensorflow-models/mobilenet';

let model = null;

export const loadMobileNetModel = async () => {
  if (model) return model;

  try {
    model = await mobilenet.load({
      version: 2,
      alpha: 1.0,
    });
    console.log('MobileNet model loaded successfully');
    return model;
  } catch (error) {
    console.error('Failed to load MobileNet model:', error);
    throw error;
  }
};

export const analyzeSkinImage = async (imageElement) => {
  const mobilenetModel = await loadMobileNetModel();

  try {
    const predictions = await mobilenetModel.classify(imageElement);

    const skinConditions = mapPredictionsToConditions(predictions);

    return {
      predictions: predictions.map((p) => ({
        className: p.className,
        probability: p.probability,
      })),
      detectedConditions: skinConditions,
    };
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  }
};

const mapPredictionsToConditions = (predictions) => {
  const conditionKeywords = {
    acne: ['comedo', 'blackhead', 'whitehead', 'acne', 'pimple'],
    rash: ['rash', 'skin', 'eczema', 'dermatitis', 'lesion'],
    wound: ['cut', 'injury', 'scratch', 'wound'],
    scar: ['scar', 'mark', 'spot'],
    mole: ['mole', 'nevus', 'birthmark'],
    normal_skin: ['skin', 'face', 'hand', 'body'],
    infection: ['infection', 'infected'],
  };

  const detected = [];

  for (const prediction of predictions) {
    const classNameLower = prediction.className.toLowerCase();

    for (const [condition, keywords] of Object.entries(conditionKeywords)) {
      for (const keyword of keywords) {
        if (classNameLower.includes(keyword)) {
          detected.push({
            condition,
            confidence: prediction.probability,
            matchedOn: keyword,
          });
          break;
        }
      }
    }
  }

  const uniqueConditions = [];
  const seen = new Set();
  for (const c of detected) {
    if (!seen.has(c.condition)) {
      seen.add(c.condition);
      uniqueConditions.push(c);
    }
  }

  return uniqueConditions.sort((a, b) => b.confidence - a.confidence);
};

export const createImageElement = (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      resolve(img);
    };

    img.onerror = (error) => {
      reject(new Error('Failed to load image'));
    };

    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target.result;
    };
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    reader.readAsDataURL(file);
  });
};

export default {
  loadMobileNetModel,
  analyzeSkinImage,
  createImageElement,
};