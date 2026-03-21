import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './GeneralHealthInput.css';

const healthConditions = [
  { id: 'fever', label: 'Fever', icon: '🌡️', symptoms: ['high temperature', 'feeling hot', 'chills', 'shivering'] },
  { id: 'head_pain', label: 'Head Pain', icon: '🤕', symptoms: ['headache', 'migraine', 'head throbbing', 'head hurts'] },
  { id: 'body_pain', label: 'Body Pain', icon: '💪', symptoms: ['body ache', 'muscle pain', 'body hurts', 'fatigue'] },
  { id: 'cold', label: 'Cold / Flu', icon: '🤧', symptoms: ['runny nose', 'sneezing', 'blocked nose', 'sore throat'] },
  { id: 'cough', label: 'Cough', icon: '😷', symptoms: ['dry cough', 'wet cough', 'coughing', 'throat irritation'] },
  { id: 'allergy', label: 'Allergy', icon: '🤲', symptoms: ['sneezing', 'itchy eyes', 'watery eyes', 'allergic reaction'] },
  { id: 'nausea', label: 'Nausea / Vomiting', icon: '🤢', symptoms: ['nausea', 'vomiting', 'feel sick', 'stomach upset'] },
  { id: 'diarrhea', label: 'Diarrhea', icon: '💧', symptoms: ['loose stools', 'frequent bowel', 'watery stool'] },
  { id: 'acidity', label: 'Acidity / Gas', icon: '🔥', symptoms: ['heartburn', 'acidity', 'gas', 'stomach pain'] },
  { id: 'weakness', label: 'Weakness / Fatigue', icon: '🔋', symptoms: ['tired', 'weak', 'no energy', 'fatigue'] }
];

const GeneralHealthInput = ({ onSubmit, isLoading }) => {
  const [selectedCondition, setSelectedCondition] = useState(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [customDescription, setCustomDescription] = useState('');

  const handleConditionSelect = (conditionId) => {
    setSelectedCondition(conditionId);
    setSelectedSymptoms([]);
  };

  const handleSymptomToggle = (symptom) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let description = '';

    if (selectedCondition) {
      const condition = healthConditions.find(c => c.id === selectedCondition);
      description = condition.label.toLowerCase();
    }

    if (selectedSymptoms.length > 0) {
      description += ' with ' + selectedSymptoms.join(', ');
    }

    if (customDescription.trim()) {
      description += '. ' + customDescription;
    }

    if (!selectedCondition && !customDescription.trim()) {
      return;
    }

    onSubmit(description);
  };

  const getSymptomOptions = () => {
    const condition = healthConditions.find(c => c.id === selectedCondition);
    return condition ? condition.symptoms : [];
  };

  return (
    <div className="general-health-input">
      <div className="input-header">
        <h3>What are you experiencing?</h3>
        <p>Select your symptoms and get medicine recommendations</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="condition-grid">
          {healthConditions.map((condition) => (
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
            <h4>Specific symptoms:</h4>
            <div className="symptoms-grid">
              {getSymptomOptions().map((symptom) => (
                <label key={symptom} className="symptom-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedSymptoms.includes(symptom)}
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
          <label htmlFor="generalDesc">
            Additional details (optional)
          </label>
          <textarea
            id="generalDesc"
            value={customDescription}
            onChange={(e) => setCustomDescription(e.target.value)}
            placeholder="How long have you had these symptoms? Any other details..."
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
              <span className="btn-icon">💊</span>
              Get Medicine Recommendations
            </>
          )}
        </motion.button>
      </form>

      <div className="quick-tips">
        <h5>💡 Quick Select</h5>
        <div className="quick-tags">
          <button onClick={() => { setSelectedCondition('fever'); onSubmit('fever high temperature'); }}>Fever</button>
          <button onClick={() => { setSelectedCondition('head_pain'); onSubmit('headache migraine'); }}>Headache</button>
          <button onClick={() => { setSelectedCondition('cold'); onSubmit('cold runny nose sneezing'); }}>Cold</button>
          <button onClick={() => { setSelectedCondition('cough'); onSubmit('cough dry cough'); }}>Cough</button>
          <button onClick={() => { setSelectedCondition('allergy'); onSubmit('allergy sneezing watery eyes'); }}>Allergy</button>
          <button onClick={() => { setSelectedCondition('body_pain'); onSubmit('body pain muscle ache'); }}>Body Pain</button>
        </div>
      </div>
    </div>
  );
};

export default GeneralHealthInput;