import React from 'react';
import { useStore } from '../store/useStore.jsx';
import { industryBenchmarks } from '../data/sampleCompanies';
import { motion } from 'framer-motion';

const BenchmarkChart = ({ ratios }) => {
  const { currentCompany } = useStore();
  const benchmark = industryBenchmarks[currentCompany.type] || industryBenchmarks.technology;

  const metrics = [
    { key: 'netMargin', label: 'Net Margin (%)', value: ratios.profitability.netMargin, target: benchmark.netMargin, isPercentage: true },
    { key: 'currentRatio', label: 'Current Ratio', value: ratios.liquidity.currentRatio, target: benchmark.currentRatio },
    { key: 'assetTurnover', label: 'Asset Turnover', value: ratios.efficiency.assetTurnover, target: benchmark.assetTurnover },
    { key: 'debtToEquity', label: 'Debt-to-Equity', value: ratios.leverage.debtToEquity, target: benchmark.debtToEquity, isLowerBetter: true }
  ];

  return (
    <div className="glass-card">
      <h3 style={{ fontSize: '16px', marginBottom: '24px' }}>Industry Performance Benchmark</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {metrics.map((m) => {
          const diff = m.value - m.target;
          const isGood = m.isLowerBetter ? diff <= 0 : diff >= 0;
          const percentageOfTarget = Math.min(100, Math.max(10, (m.value / m.target) * 50));

          return (
            <div key={m.key}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{m.label}</span>
                <span style={{ fontWeight: '700', color: isGood ? 'var(--success-green)' : 'var(--danger-red)' }}>
                  {m.value.toFixed(2)}{m.isPercentage ? '%' : ''}
                  <span style={{ fontSize: '10px', marginLeft: '4px', opacity: 0.6 }}>
                    vs {m.target}{m.isPercentage ? '%' : ''}
                  </span>
                </span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', position: 'relative', overflow: 'hidden' }}>
                <div 
                  style={{ 
                    position: 'absolute', left: '50%', top: 0, bottom: 0, width: '2px', 
                    background: 'var(--text-secondary)', opacity: 0.3, zIndex: 1 
                  }} 
                  title="Industry Average"
                />
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentageOfTarget}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  style={{ 
                    height: '100%', 
                    background: isGood ? 'var(--success-green)' : 'var(--danger-red)',
                    boxShadow: `0 0 10px ${isGood ? 'var(--success-green)' : 'var(--danger-red)'}40`
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: '20px', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', fontSize: '11px', color: 'var(--text-secondary)' }}>
        * Vertical line represents industry sector average for <strong>{currentCompany.type.toUpperCase()}</strong>.
      </div>
    </div>
  );
};

export default BenchmarkChart;
