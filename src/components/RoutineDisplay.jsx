import React from 'react';
import { motion } from 'framer-motion';
import './RoutineDisplay.css';

const TimeBlock = ({ title, time, items, index, icon }) => {
  return (
    <motion.div
      className="routine-block"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.15 }}
    >
      <div className="block-header">
        <div className="time-icon">{icon}</div>
        <div>
          <h3>{title}</h3>
          <span className="time-range">{time}</span>
        </div>
      </div>
      <ul className="routine-items">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </motion.div>
  );
};

const RoutineDisplay = ({ routine, category }) => {
  if (!routine) {
    return null;
  }

  const timeBlocks = [
    {
      title: 'Morning',
      time: '6:00 AM - 12:00 PM',
      items: routine.morning || [],
      icon: '🌅',
    },
    {
      title: 'Afternoon',
      time: '12:00 PM - 6:00 PM',
      items: routine.afternoon || [],
      icon: '☀️',
    },
    {
      title: 'Evening',
      time: '6:00 PM - 10:00 PM',
      items: routine.evening || [],
      icon: '🌙',
    },
  ];

  return (
    <motion.div
      className="routine-display-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="routine-header">
        <h2>Daily Health Routine</h2>
        <p className="category-tag">{category?.replace('_', ' ') || 'General Health'}</p>
      </div>

      <div className="routine-timeline">
        {timeBlocks.map((block, index) => (
          <TimeBlock
            key={block.title}
            title={block.title}
            time={block.time}
            items={block.items}
            index={index}
            icon={block.icon}
          />
        ))}
      </div>

      <div className="routine-footer">
        <p>
          💡 <strong>Tip:</strong> Consistency is key. Try to follow this routine daily
          for best results.
        </p>
      </div>
    </motion.div>
  );
};

export default RoutineDisplay;