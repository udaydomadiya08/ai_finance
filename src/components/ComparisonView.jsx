import React from 'react';
import { useStore } from '../store/useStore.jsx';
import { calculateRatios } from '../utils/financialEngine';
import { detectAnomalies } from '../utils/fraudEngine';
import { ArrowRight, TrendingUp, ShieldAlert, BarChart2 } from 'lucide-react';

const ComparisonView = () => {
  const { currentCompany, compareWith, companies, setCompareWith } = useStore();

  const companyA = currentCompany;
  const companyB = compareWith || companies.find(c => c.id !== companyA.id) || companyA;

  const analysisA = calculateRatios(companyA.statements);
  const analysisB = calculateRatios(companyB.statements);
  const fraudA = detectAnomalies(companyA.statements);
  const fraudB = detectAnomalies(companyB.statements);

  const ComparisonRow = ({ label, valA, valB, suffix = '', isBetter = (a, b) => a > b }) => {
    const betterA = isBetter(valA, valB);
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '16px', borderBottom: '1px solid var(--border)', fontSize: '14px' }}>
        <div style={{ color: 'var(--text-secondary)' }}>{label}</div>
        <div style={{ color: betterA ? 'var(--success-green)' : 'inherit', fontWeight: betterA ? '700' : '400' }}>
          {valA.toFixed(2)}{suffix}
        </div>
        <div style={{ color: !betterA ? 'var(--success-green)' : 'inherit', fontWeight: !betterA ? '700' : '400' }}>
          {valB.toFixed(2)}{suffix}
        </div>
      </div>
    );
  };

  return (
    <div className="main-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <BarChart2 size={24} color="var(--accent-blue)" /> Side-by-Side Comparison
        </h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          {companies.map(c => (
            <button 
              key={c.id}
              onClick={() => setCompareWith(c)}
              style={{
                padding: '6px 12px', borderRadius: '6px', fontSize: '12px',
                background: companyB.id === c.id ? 'var(--success-green)' : 'rgba(255,255,255,0.05)',
                color: 'white', border: '1px solid var(--border)', cursor: 'pointer'
              }}
            >
              Compare with {c.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card" style={{ padding: 0 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '20px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontWeight: '700' }}>METRIC</div>
          <div style={{ fontWeight: '700', color: 'var(--accent-blue)' }}>{companyA.name}</div>
          <div style={{ fontWeight: '700', color: 'var(--success-green)' }}>{companyB.name}</div>
        </div>

        <ComparisonRow label="Net Profit Margin" valA={analysisA.profitability.netMargin} valB={analysisB.profitability.netMargin} suffix="%" />
        <ComparisonRow label="Current Ratio" valA={analysisA.liquidity.currentRatio} valB={analysisB.liquidity.currentRatio} />
        <ComparisonRow label="Asset Turnover" valA={analysisA.efficiency.assetTurnover} valB={analysisB.efficiency.assetTurnover} />
        <ComparisonRow label="Debt-to-Equity" valA={analysisA.leverage.debtToEquity} valB={analysisB.leverage.debtToEquity} isBetter={(a, b) => a < b} />
        <ComparisonRow label="Fraud Risk Score" valA={fraudA.riskScore} valB={fraudB.riskScore} isBetter={(a, b) => a < b} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '24px' }}>
        <div className="glass-card">
          <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>STRATEGIC DELTA</h3>
          <p style={{ marginTop: '12px', fontSize: '15px' }}>
             {companyA.name} shows a {Math.abs(analysisA.profitability.netMargin - analysisB.profitability.netMargin).toFixed(1)}% 
             {analysisA.profitability.netMargin > analysisB.profitability.netMargin ? ' stronger ' : ' weaker '} 
             profitability profile compared to {companyB.name}.
          </p>
        </div>
        <div className="glass-card" style={{ background: fraudA.riskScore > fraudB.riskScore ? 'rgba(248, 81, 73, 0.05)' : 'rgba(63, 185, 80, 0.05)' }}>
          <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>RISK COMPARISON</h3>
          <p style={{ marginTop: '12px', fontSize: '15px' }}>
            {fraudA.riskScore > fraudB.riskScore ? 
              `WARNING: ${companyA.name} maintains a higher forensic risk profile.` : 
              `STABILITY: ${companyA.name} presents a cleaner financial audit trail than ${companyB.name}.`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComparisonView;
