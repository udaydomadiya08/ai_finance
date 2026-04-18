import React from 'react';
import { motion } from 'framer-motion';

const MetricCard = ({ title, value, subValue, icon: Icon, color }) => {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="glass-card" 
      style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>{title}</span>
        <div style={{ padding: '6px', borderRadius: '8px', background: `${color}15`, color: color }}>
          <Icon size={16} />
        </div>
      </div>
      <div style={{ fontSize: '24px', fontWeight: '700' }}>{value}</div>
      {subValue && (
        <div style={{ fontSize: '12px', color: subValue.startsWith('+') ? 'var(--success-green)' : 'var(--text-secondary)' }}>
          {subValue} <span style={{ color: 'var(--text-secondary)' }}>vs prev period</span>
        </div>
      )}
    </motion.div>
  );
};

export default MetricCard;
