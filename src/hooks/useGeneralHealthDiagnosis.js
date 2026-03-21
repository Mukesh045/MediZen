import { useState, useCallback } from 'react';
import { diagnoseGeneralCondition, detectCondition } from '../services/generalHealthDiagnosis';

export const useGeneralHealthDiagnosis = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  const diagnose = useCallback(async (symptomText) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await diagnoseGeneralCondition(symptomText);

      if (!result.success) {
        setError(result.message);
        return result;
      }

      setResults(result);
      return result;
    } catch (err) {
      const errorMessage = err.message || 'Failed to analyze symptoms';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults(null);
    setError(null);
  }, []);

  const quickDetect = useCallback((symptomText) => {
    return detectCondition(symptomText);
  }, []);

  return {
    diagnose,
    clearResults,
    quickDetect,
    isLoading,
    error,
    results
  };
};

export default useGeneralHealthDiagnosis;