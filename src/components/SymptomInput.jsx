import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './SymptomInput.css';

const SymptomInput = ({ onSubmit, isLoading }) => {
  const [symptoms, setSymptoms] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (symptoms.trim() && !isLoading) {
      onSubmit(symptoms);
    }
  };

  const exampleSymptoms = [
    'I have a headache and fever',
    'My stomach hurts and I feel nauseous',
    'I have a cough and congestion',
    'My joints are aching',
  ];

  return (
    <motion.div
      className="symptom-input-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2>Describe Your Symptoms</h2>
      <p className="instruction">
        Tell us how you're feeling. Be as descriptive as possible.
      </p>

      <form onSubmit={handleSubmit}>
        <textarea
          className="symptom-textarea"
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="e.g., I have a headache and fever, feeling tired..."
          rows={5}
          disabled={isLoading}
        />

        <button
          type="submit"
          className="analyze-button"
          disabled={!symptoms.trim() || isLoading}
        >
          {isLoading ? 'Analyzing...' : 'Analyze Symptoms'}
        </button>
      </form>

      <div className="examples">
        <p>Examples:</p>
        <div className="example-buttons">
          {exampleSymptoms.map((example, index) => (
            <button
              key={index}
              className="example-button"
              onClick={() => setSymptoms(example)}
              disabled={isLoading}
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default SymptomInput;