import React from 'react';
import { motion } from 'framer-motion';
import { formatPrice } from '../services/skinDiagnosis';
import './SkinResults.css';

const SkinResults = ({ diagnosisResult }) => {
  const { primaryCondition, medicines, routine, tips, detectedConditions } = diagnosisResult;

  const formatConditionName = (name) => {
    return name
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="skin-results">
      <motion.div
        className="diagnosis-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2>Skin Condition Detected</h2>
        <div className="condition-badge">
          {formatConditionName(primaryCondition)}
        </div>
        <div className="confidence-info">
          {detectedConditions.map((cond, index) => (
            <span key={index} className="confidence-tag">
              {formatConditionName(cond.condition)} ({Math.round(cond.confidence * 100)}%)
            </span>
          ))}
        </div>
      </motion.div>

      {medicines.length > 0 && (
        <motion.div
          className="medicines-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h3>Recommended Medicines</h3>
          <p className="section-subtitle">Two options for each medicine - choose based on your budget</p>

          {medicines.map((medPair, index) => (
            <div key={index} className="medicine-pair">
              <div className="medicine-header">
                <h4>Treatment Option {index + 1}</h4>
              </div>

              <div className="medicine-options">
                <div className={`medicine-card premium ${medPair.primary.higherPrice ? 'primary' : ''}`}>
                  <div className="price-badge recommended">RECOMMENDED</div>
                  <div className="medicine-name">{medPair.primary.name}</div>
                  <div className="medicine-price">
                    <span className="price-value">{formatPrice(medPair.primary.price)}</span>
                    <span className="price-unit">{medPair.primary.priceUnit}</span>
                  </div>
                  <div className="effectiveness">
                    <span className="label">Effectiveness:</span>
                    <span className="value">{medPair.primary.effectiveness}</span>
                  </div>
                  <div className="medicine-details">
                    <div className="detail-section">
                      <h5>Uses:</h5>
                      <p>{medPair.primary.uses.join(', ')}</p>
                    </div>
                    <div className="detail-section">
                      <h5>How to Apply:</h5>
                      <p>{medPair.primary.application}</p>
                    </div>
                    <div className="detail-section">
                      <h5>Dosage:</h5>
                      <p>{medPair.primary.dosage}</p>
                    </div>
                    <div className="detail-section">
                      <h5>Side Effects:</h5>
                      <p>{medPair.primary.sideEffects.join(', ')}</p>
                    </div>
                    {medPair.primary.tips && (
                      <div className="detail-section">
                        <h5>Tips:</h5>
                        <ul className="tips-list">
                          {medPair.primary.tips.map((tip, i) => (
                            <li key={i}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {medPair.alternative && (
                  <div className="medicine-card budget">
                    <div className="price-badge budget-badge">BUDGET OPTION</div>
                    <div className="medicine-name">{medPair.alternative.name}</div>
                    <div className="medicine-price">
                      <span className="price-value">{formatPrice(medPair.alternative.price)}</span>
                      <span className="price-unit">{medPair.alternative.priceUnit}</span>
                    </div>
                    <div className="savings-badge">
                      Save {formatPrice(medPair.primary.price - medPair.alternative.price)}
                    </div>
                    <div className="effectiveness">
                      <span className="label">Effectiveness:</span>
                      <span className="value">{medPair.alternative.effectiveness}</span>
                    </div>
                    <div className="medicine-details">
                      <div className="detail-section">
                        <h5>Uses:</h5>
                        <p>{medPair.alternative.uses.join(', ')}</p>
                      </div>
                      <div className="detail-section">
                        <h5>How to Apply:</h5>
                        <p>{medPair.alternative.application}</p>
                      </div>
                      <div className="detail-section">
                        <h5>Dosage:</h5>
                        <p>{medPair.alternative.dosage}</p>
                      </div>
                      <div className="detail-section">
                        <h5>Side Effects:</h5>
                        <p>{medPair.alternative.sideEffects.join(', ')}</p>
                      </div>
                      {medPair.alternative.tips && (
                        <div className="detail-section">
                          <h5>Tips:</h5>
                          <ul className="tips-list">
                            {medPair.alternative.tips.map((tip, i) => (
                              <li key={i}>{tip}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {tips.length > 0 && (
        <motion.div
          className="tips-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h3>Care Tips for {formatConditionName(primaryCondition)}</h3>
          <ul className="care-tips">
            {tips.map((tip, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <span className="tip-icon">✓</span>
                {tip}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}

      {routine && (
        <motion.div
          className="routine-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h3>Daily Care Routine</h3>
          <div className="routine-grid">
            {Object.entries(routine).map(([timeOfDay, activities]) => (
              <div key={timeOfDay} className="routine-card">
                <h4>{timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)}</h4>
                <ul>
                  {activities.map((activity, index) => (
                    <li key={index}>{activity}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="disclaimer">
        <p>
          ⚠️ <strong>Important:</strong> This is general information only.
          Please consult a dermatologist for proper diagnosis and treatment.
          Prices are approximate and may vary by region and pharmacy.
        </p>
      </div>
    </div>
  );
};

export default SkinResults;