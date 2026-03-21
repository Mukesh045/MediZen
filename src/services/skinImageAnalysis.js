export const createSkinImageElement = (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.onload = () => {
        resolve(img);
      };
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      img.src = e.target.result;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
};

export const analyzeSkinImage = async (imageElement) => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = 224;
  canvas.height = 224;
  ctx.drawImage(imageElement, 0, 0, 224, 224);

  const imageData = ctx.getImageData(0, 0, 224, 224);
  const data = imageData.data;

  let r = 0, g = 0, b = 0;
  for (let i = 0; i < data.length; i += 4) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
  }

  const pixelCount = data.length / 4;
  r = Math.floor(r / pixelCount);
  g = Math.floor(g / pixelCount);
  b = Math.floor(b / pixelCount);

  const redness = Math.abs(r - g) + Math.abs(r - b);
  const darkness = (r + g + b) / 3;

  const conditions = [];

  if (redness > 80 && r > g && r > b) {
    conditions.push({
      condition: 'ringworm',
      confidence: Math.min(0.4 + (redness / 200), 0.85),
      description: 'Detected signs of possible fungal infection (ringworm)'
    });
  }

  if (darkness > 150 && redness > 100) {
    conditions.push({
      condition: 'acne',
      confidence: Math.min(0.3 + ((255 - darkness) / 200), 0.8),
      description: 'Detected possible acne symptoms'
    });
  }

  if (darkness < 80) {
    conditions.push({
      condition: 'eczema',
      confidence: 0.6,
      description: 'Detected dry skin patterns - possible eczema'
    });
  }

  conditions.push({
    condition: 'general',
    confidence: 0.3,
    description: 'Please provide more description of your symptoms'
  });

  conditions.sort((a, b) => b.confidence - a.confidence);

  const dominantColor = `rgb(${r}, ${g}, ${b})`;

  return {
    detectedConditions: conditions,
    description: conditions[0]?.description || 'Analyzed skin image',
    imageColors: { r, g, b, dominantColor },
    analysisType: 'basic'
  };
};

export default {
  createSkinImageElement,
  analyzeSkinImage
};