import React from 'react';

const RiskIndicator = ({ score, level }) => {
  const getColor = () => {
    if (score > 60) return 'var(--danger-red)';
    if (score > 30) return 'var(--warning-orange)';
    return 'var(--success-green)';
  };

  const getLabel = () => {
    if (score > 60) return 'CRITICAL RISK';
    if (score > 30) return 'MEDIUM RISK';
    return 'STABLE / LOW RISK';
  };

  return (
    <div className="glass-card" style={{ textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, height: '4px', width: `${score}%`, background: getColor() }} />
      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>FORENSIC RISK SCORE</p>
      <div style={{ fontSize: '48px', fontWeight: '800', color: getColor() }}>{score}</div>
      <div style={{ 
        display: 'inline-block', padding: '4px 12px', borderRadius: '4px', 
        fontSize: '11px', fontWeight: '700', background: `${getColor()}20`, 
        color: getColor(), marginTop: '8px' 
      }}>
        {getLabel()}
      </div>
    </div>
  );
};

export default RiskIndicator;
