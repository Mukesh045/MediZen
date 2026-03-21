import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './SkinSymptomInput.css';

const skinConditions = [
  { id: 'acne', label: 'Acne / Pimples', icon: '🔴' },
  { id: 'eczema', label: 'Eczema / Dermatitis', icon: '🔶' },
  { id: 'ringworm', label: 'Ringworm / Fungal', icon: '⭕' },
  { id: 'scabies', label: 'Scabies', icon: '🐜' },
  { id: 'wart', label: 'Warts', icon: '📌' },
  { id: 'psoriasis', label: 'Psoriasis', icon: '🩹' },
  { id: 'sunburn', label: 'Sunburn', icon: '☀️' },
  { id: 'hives', label: 'Hives / Urticaria', icon: '⚡' },
  { id: 'insect_bites', label: 'Insect Bites', icon: '🦟' },
  { id: 'minor_burns', label: 'Minor Burns', icon: '🔥' },
  { id: 'scar', label: 'Scars', icon: '💫' },
  { id: 'dark_spots', label: 'Dark Spots / Melasma', icon: '🌑' }
];

const SkinSymptomInput = ({ onSubmit, isLoading }) => {
  const [selectedCondition, setSelectedCondition] = useState(null);
  const [customDescription, setCustomDescription] = useState('');
  const [symptoms, setSymptoms] = useState([]);

  const handleConditionSelect = (conditionId) => {
    setSelectedCondition(conditionId);
  };

  const handleSymptomToggle = (symptom) => {
    if (symptoms.includes(symptom)) {
      setSymptoms(symptoms.filter(s => s !== symptom));
    } else {
      setSymptoms([...symptoms, symptom]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let description = '';

    if (selectedCondition) {
      description = `${selectedCondition.replace(/_/g, ' ')}`;
    }

    if (symptoms.length > 0) {
      description += ` with ${symptoms.join(', ')}`;
    }

    if (customDescription.trim()) {
      description += `. ${customDescription}`;
    }

    if (!selectedCondition && !customDescription.trim()) {
      return;
    }

    onSubmit(description);
  };

  const getSymptomOptions = () => {
    const symptomMap = {
      acne: ['red bumps', 'blackheads', 'whiteheads', 'pustules', 'oily skin', 'scars'],
      eczema: ['dry skin', 'itching', 'redness', 'flaky patches', 'rough texture', 'cracking'],
      ringworm: ['circular rash', 'red ring', 'itching', 'scaly skin', 'spreading'],
      scabies: ['intense itching', 'burrows', 'rash at night', 'small bumps', 'between fingers'],
      wart: ['rough bump', 'black dots', 'cauliflower texture', 'painful', 'spreading'],
      psoriasis: ['red patches', 'silvery scales', 'thick plaques', 'cracking', 'nail changes'],
      sunburn: ['red skin', 'pain', 'blisters', 'peeling', 'swelling'],
      hives: ['raised welts', 'itching', 'redness', 'swelling', 'temporary marks'],
      insect_bites: ['red bump', 'swelling', 'itching', 'pain', 'warmth'],
      minor_burns: ['redness', 'pain', 'blistering', 'swelling', 'tight skin'],
      scar: ['raised scar', 'depressed scar', 'discoloration', 'itching', 'tightness'],
      dark_spots: ['brown patches', 'uneven tone', 'melasma', 'post-acne marks', 'age spots']
    };

    return selectedCondition ? symptomMap[selectedCondition] || [] : [];
  };

  return (
    <div className="skin-symptom-input">
      <div className="input-header">
        <h3>Describe Your Skin Problem</h3>
        <p>Select your skin condition and any symptoms you're experiencing</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="condition-grid">
          {skinConditions.map((condition) => (
            <motion.button
              key={condition.id}
              type="button"
              className={`condition-btn ${selectedCondition === condition.id ? 'selected' : ''}`}
              onClick={() => handleConditionSelect(condition.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="condition-icon">{condition.icon}</span>
              <span className="condition-label">{condition.label}</span>
            </motion.button>
          ))}
        </div>

        {selectedCondition && (
          <motion.div
            className="symptoms-section"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <h4>What symptoms do you have?</h4>
            <div className="symptoms-grid">
              {getSymptomOptions().map((symptom) => (
                <label key={symptom} className="symptom-checkbox">
                  <input
                    type="checkbox"
                    checked={symptoms.includes(symptom)}
                    onChange={() => handleSymptomToggle(symptom)}
                  />
                  <span className="checkbox-custom"></span>
                  <span className="symptom-text">{symptom}</span>
                </label>
              ))}
            </div>
          </motion.div>
        )}

        <div className="custom-description">
          <label htmlFor="customDesc">
            Additional details (optional)
          </label>
          <textarea
            id="customDesc"
            value={customDescription}
            onChange={(e) => setCustomDescription(e.target.value)}
            placeholder="Describe how long you've had this problem, any triggers, what you've tried before, etc."
            rows={3}
          />
        </div>

        <motion.button
          type="submit"
          className="submit-btn"
          disabled={isLoading || (!selectedCondition && !customDescription.trim())}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isLoading ? (
            <span className="loading-text">Analyzing...</span>
          ) : (
            <>
              <span className="btn-icon">🔍</span>
              Get Medicine Recommendations
            </>
          )}
        </motion.button>
      </form>

      <div className="input-tips">
        <h5>💡 Quick Tips</h5>
        <ul>
          <li>Select the condition that best matches your skin problem</li>
          <li>Check all symptoms that apply to you</li>
          <li>Providing more details helps us give better recommendations</li>
        </ul>
      </div>
    </div>
  );
};

export default SkinSymptomInput;