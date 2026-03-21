import { useState, useCallback } from 'react';
import { analyzeSymptoms, getSymptomCategory } from '../services/mlModel';
import {
  matchSymptomsToMedicines,
  getRoutineForCondition,
  extractKeywords,
} from '../utils/symptomMatcher';

export const useAIDiagnosis = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  const diagnose = useCallback(async (symptomText, imageAnalysis = null) => {
    setIsLoading(true);
    setError(null);

    try {
      const keywords = extractKeywords(symptomText);

      const detectedSymptoms = await analyzeSymptoms(symptomText);

      const medicines = matchSymptomsToMedicines(detectedSymptoms);

      const category = getSymptomCategory(detectedSymptoms);

      const routine = getRoutineForCondition(
        detectedSymptoms.length > 0 ? detectedSymptoms[0].symptom : 'general_health'
      );

      const diagnosisResults = {
        detectedSymptoms: detectedSymptoms.map(s => s.symptom),
        keywords,
        medicines,
        category,
        routine,
        imageAnalysis,
        timestamp: new Date().toISOString(),
      };

      setResults(diagnosisResults);
      return diagnosisResults;
    } catch (err) {
      const errorMessage = err.message || 'Failed to analyze symptoms';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const analyzeImage = useCallback(async (imageFile) => {
    setIsLoading(true);
    setError(null);

    try {
      const { createImageElement, analyzeSkinImage } = await import('../services/imageAnalysis');

      const imageElement = await createImageElement(imageFile);
      const analysisResult = await analyzeSkinImage(imageElement);

      const skinConditions = analysisResult.detectedConditions || [];
      let diagnosisResults = null;

      if (skinConditions.length > 0) {
        const primaryCondition = skinConditions[0].condition;
        diagnosisResults = await diagnose(`skin condition: ${primaryCondition}`, analysisResult);
      }

      return {
        imageAnalysis: analysisResult,
        diagnosisResults,
      };
    } catch (err) {
      const errorMessage = err.message || 'Failed to analyze image';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [diagnose]);

  const clearResults = useCallback(() => {
    setResults(null);
    setError(null);
  }, []);

  return {
    diagnose,
    analyzeImage,
    clearResults,
    isLoading,
    error,
    results,
  };
};

export default useAIDiagnosis;