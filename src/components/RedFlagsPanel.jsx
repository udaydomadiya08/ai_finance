import React from 'react';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

const RedFlagsPanel = ({ flags }) => {
  return (
    <div className="glass-card">
      <h3 style={{ fontSize: '16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <AlertTriangle size={18} color="var(--warning-orange)" /> Forensic Red Flags
      </h3>
      
      {flags.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>No critical anomalies detected in the current audit period.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {flags.map((flag, idx) => (
            <div key={idx} style={{ 
              display: 'flex', gap: '12px', padding: '12px', 
              borderRadius: '8px', background: 'rgba(255,255,255,0.03)',
              borderLeft: `4px solid ${flag.type === 'danger' ? 'var(--danger-red)' : flag.type === 'warning' ? 'var(--warning-orange)' : 'var(--accent-blue)'}`
            }}>
              <div style={{ color: flag.type === 'danger' ? 'var(--danger-red)' : flag.type === 'warning' ? 'var(--warning-orange)' : 'var(--accent-blue)' }}>
                {flag.type === 'danger' ? <AlertCircle size={18} /> : <Info size={18} />}
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>{flag.title}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{flag.description}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RedFlagsPanel;
