import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SkinSymptomInput from './components/SkinSymptomInput';
import SkinImageUpload from './components/SkinImageUpload';
import SkinResults from './components/SkinResults';
import GeneralHealthInput from './components/GeneralHealthInput';
import GeneralHealthResults from './components/GeneralHealthResults';
import LoadingSpinner from './components/LoadingSpinner';
import useSkinDiagnosis from './hooks/useSkinDiagnosis';
import useGeneralHealthDiagnosis from './hooks/useGeneralHealthDiagnosis';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('symptoms');
  const [diagnosisMode, setDiagnosisMode] = useState('skin');

  const {
    diagnose: diagnoseSkin,
    analyzeImage: analyzeImageSkin,
    isLoading: isLoadingSkin,
    error: errorSkin,
    results: resultsSkin,
    clearResults: clearResultsSkin
  } = useSkinDiagnosis();

  const {
    diagnose: diagnoseGeneral,
    isLoading: isLoadingGeneral,
    error: errorGeneral,
    results: resultsGeneral,
    clearResults: clearResultsGeneral
  } = useGeneralHealthDiagnosis();

  const isSkinMode = diagnosisMode === 'skin';
  const isLoading = isSkinMode ? isLoadingSkin : isLoadingGeneral;
  const error = isSkinMode ? errorSkin : errorGeneral;
  const results = isSkinMode ? resultsSkin : resultsGeneral;
  const clearResults = isSkinMode ? clearResultsSkin : clearResultsGeneral;

  const handleSymptomSubmit = async (symptoms) => {
    if (isSkinMode) {
      await diagnoseSkin(symptoms);
    } else {
      await diagnoseGeneral(symptoms);
    }
  };

  const handleImageSelect = async (imageFile) => {
    if (isSkinMode) {
      await analyzeImageSkin(imageFile);
    }
  };

  const handleReset = () => {
    clearResults();
  };

  const handleModeChange = (mode) => {
    setDiagnosisMode(mode);
    clearResults();
    setActiveTab('symptoms');
  };

  return (
    <div className="app">
      <header className="app-header">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img src="./logo.svg" alt="MediZen" className="header-logo" />
          <h1>MediZen</h1>
          <p>AI-Powered Medicine Advisor</p>
        </motion.div>
      </header>

      <main className="app-main">
        <div className="mode-selector">
          <motion.button
            className={`mode-btn ${diagnosisMode === 'skin' ? 'active' : ''}`}
            onClick={() => handleModeChange('skin')}
            whileTap={{ scale: 0.95 }}
          >
            <span className="mode-icon">🧴</span>
            Skin Problems
            <span className="mode-badge">Dual Pricing</span>
          </motion.button>
          <motion.button
            className={`mode-btn ${diagnosisMode === 'general' ? 'active' : ''}`}
            onClick={() => handleModeChange('general')}
            whileTap={{ scale: 0.95 }}
          >
            <span className="mode-icon">💊</span>
            General Health
            <span className="mode-badge">Dual Pricing</span>
          </motion.button>
        </div>

        <div className="disclaimer-banner">
          ⚠️ <strong>Important:</strong> This application provides general information
          only. It is NOT a substitute for professional medical advice. Always consult
          a qualified healthcare provider for diagnosis and treatment.
        </div>

        {!results ? (
          <div className="input-section">
            <AnimatePresence mode="wait">
              {isSkinMode ? (
                <motion.div
                  key="skin-input"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="skin-tabs">
                    <button
                      className={`skin-tab ${activeTab === 'symptoms' ? 'active' : ''}`}
                      onClick={() => setActiveTab('symptoms')}
                    >
                      <span>📝</span> Describe Problem
                    </button>
                    <button
                      className={`skin-tab ${activeTab === 'image' ? 'active' : ''}`}
                      onClick={() => setActiveTab('image')}
                    >
                      <span>📷</span> Upload Photo
                    </button>
                  </div>

                  <AnimatePresence mode="wait">
                    {activeTab === 'symptoms' ? (
                      <motion.div
                        key="skin-symptoms"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                      >
                        <SkinSymptomInput
                          onSubmit={handleSymptomSubmit}
                          isLoading={isLoading}
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="skin-image"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                      >
                        <SkinImageUpload
                          onImageSelect={handleImageSelect}
                          isLoading={isLoading}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.div
                  key="general-input"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <GeneralHealthInput
                    onSubmit={handleSymptomSubmit}
                    isLoading={isLoading}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {isLoading && (
              <div className="loading-overlay">
                <LoadingSpinner
                  message={isSkinMode ? "Analyzing your skin condition..." : "Analyzing your symptoms..."}
                />
              </div>
            )}

            {error && (
              <motion.div
                className="error-message"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p>{error}</p>
                <button onClick={handleReset}>Try Again</button>
              </motion.div>
            )}
          </div>
        ) : (
          <div className="results-section">
            <motion.button
              className="back-button"
              onClick={handleReset}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              ← New Analysis
            </motion.button>

            {isSkinMode ? (
              <SkinResults diagnosisResult={results} />
            ) : (
              <GeneralHealthResults diagnosisResult={results} />
            )}
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>
          {isSkinMode
            ? 'Skin Medicine Database with Dual Pricing Options'
            : 'General Health Medicine Database with Dual Pricing Options'}
        </p>
      </footer>
    </div>
  );
}

export default App;