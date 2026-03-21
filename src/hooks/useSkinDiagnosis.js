import { useState, useCallback } from 'react';
import { diagnoseSkinCondition, detectSkinCondition } from '../services/skinDiagnosis';

export const useSkinDiagnosis = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  const diagnose = useCallback(async (symptomText, imageAnalysis = null) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await diagnoseSkinCondition(symptomText, imageAnalysis);

      if (!result.success) {
        setError(result.message);
        return result;
      }

      setResults(result);
      return result;
    } catch (err) {
      const errorMessage = err.message || 'Failed to analyze skin condition';
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
      const { createSkinImageElement, analyzeSkinImage } = await import('../services/skinImageAnalysis');

      const imageElement = await createSkinImageElement(imageFile);
      const analysisResult = await analyzeSkinImage(imageElement);

      const description = analysisResult.description || 'skin condition';
      const result = await diagnose(description, analysisResult);

      return {
        imageAnalysis: analysisResult,
        diagnosisResults: result
      };
    } catch (err) {
      const errorMessage = err.message || 'Failed to analyze skin image';
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

  const quickDetect = useCallback((symptomText) => {
    return detectSkinCondition(symptomText);
  }, []);

  return {
    diagnose,
    analyzeImage,
    clearResults,
    quickDetect,
    isLoading,
    error,
    results
  };
};

export default useSkinDiagnosis;