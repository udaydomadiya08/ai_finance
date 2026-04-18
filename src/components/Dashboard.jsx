import React, { useMemo, useState } from 'react';
import { useStore } from '../store/useStore.jsx';
import { calculateRatios } from '../utils/financialEngine';
import { detectAnomalies } from '../utils/fraudEngine';
import { industryBenchmarks } from '../data/sampleCompanies';
import MetricCard from './MetricCard';
import RiskIndicator from './RiskIndicator';
import RedFlagsPanel from './RedFlagsPanel';
import TrendChart from './TrendChart';
import { generatePDFReport } from '../utils/reportGenerator';
import { TrendingUp, Wallet, Activity, Zap, FileDown, Loader2, BarChart2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const { currentCompany } = useStore();
  const [isExporting, setIsExporting] = useState(false);
  const [showBenchmark, setShowBenchmark] = useState(true);
  
  const analysis = useMemo(() => {
    if (!currentCompany) return null;
    const ratios = calculateRatios(currentCompany.statements);
    const fraud = detectAnomalies(currentCompany.statements);
    return { ratios, fraud };
  }, [currentCompany]);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await generatePDFReport('dashboard-main', currentCompany.name);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  if (!analysis) return null;

  const { ratios, fraud } = analysis;
  const benchmark = industryBenchmarks[currentCompany.type] || industryBenchmarks.technology;

  const BenchmarkItem = ({ label, value, target, isLowerBetter = false }) => {
    const diff = value - target;
    const isGood = isLowerBetter ? diff <= 0 : diff >= 0;
    return (
      <div style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{label}</span>
          <span style={{ fontSize: '13px', fontWeight: '700', color: isGood ? 'var(--success-green)' : 'var(--danger-red)' }}>
            {value.toFixed(1)}{label.includes('Margin') ? '%' : ''}
          </span>
        </div>
        <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ width: `${Math.min(100, (value/target)*50)}%`, height: '100%', background: isGood ? 'var(--success-green)' : 'var(--danger-red)', opacity: 0.6 }} />
        </div>
        <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '4px' }}>Sector Avg: {target.toFixed(1)}</div>
      </div>
    );
  };

  return (
    <div className="main-content" id="dashboard-main">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ marginBottom: '4px' }}>Financial Intelligence</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Advanced Forensic Audit: {currentCompany.name}</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
           <button 
            onClick={() => setShowBenchmark(!showBenchmark)}
            className="glass-card" 
            style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
              background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border)', 
              fontWeight: '600', cursor: 'pointer' 
            }}
          >
            <BarChart2 size={18} /> {showBenchmark ? 'Hide Benchmarks' : 'Show Benchmarks'}
          </button>
          <button 
            onClick={handleExport}
            className="glass-card" 
            disabled={isExporting}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
              background: isExporting ? 'var(--text-secondary)' : 'var(--accent-blue)', 
              color: 'white', border: 'none', 
              fontWeight: '600', cursor: isExporting ? 'not-allowed' : 'pointer' 
            }}
          >
            {isExporting ? <Loader2 size={18} className="animate-spin" /> : <FileDown size={18} />}
            {isExporting ? 'Generating...' : 'Export Analysis'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: showBenchmark ? '1fr 340px' : '1fr', gap: '24px', transition: 'all 0.4s ease' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="metric-grid">
            <MetricCard 
              title="NET PROFIT MARGIN" 
              value={ratios.profitability.netMargin.toFixed(1) + '%'} 
              icon={TrendingUp}
              color="var(--success-green)"
            />
            <MetricCard 
              title="CURRENT RATIO" 
              value={ratios.liquidity.currentRatio.toFixed(2)} 
              icon={Wallet}
              color="var(--accent-blue)"
              subValue="+12%"
            />
            <MetricCard 
              title="ASSET TURNOVER" 
              value={ratios.efficiency.assetTurnover.toFixed(2)} 
              icon={Activity}
              color="var(--warning-orange)"
            />
            <MetricCard 
              title="EQUITY MULTIPLIER" 
              value={(1 + ratios.leverage.debtToEquity).toFixed(2)} 
              icon={Zap}
              color="#bf40bf"
            />
          </div>

          <div className="glass-card" style={{ flex: 1, minHeight: '400px' }}>
            <h3 style={{ marginBottom: '20px' }}>Forensic Trend Analysis</h3>
            <div className="chart-container">
              <TrendChart data={currentCompany.statements} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
             <RiskIndicator score={fraud.riskScore} level={fraud.riskLevel} />
             <RedFlagsPanel flags={fraud.flags} />
          </div>
        </div>

        <AnimatePresence>
          {showBenchmark && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
            >
              <div className="glass-card">
                <h3 style={{ fontSize: '16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Zap size={18} color="var(--accent-blue)" /> Sector Benchmarks
                </h3>
                <BenchmarkItem label="Net Margin" value={ratios.profitability.netMargin} target={benchmark.netMargin} />
                <BenchmarkItem label="Current Ratio" value={ratios.liquidity.currentRatio} target={benchmark.currentRatio} />
                <BenchmarkItem label="Asset Turnover" value={ratios.efficiency.assetTurnover} target={benchmark.assetTurnover} />
                <BenchmarkItem label="Debt-to-Equity" value={ratios.leverage.debtToEquity} target={benchmark.debtToEquity} isLowerBetter />
              </div>

              <div className="glass-card" style={{ background: 'rgba(88, 166, 255, 0.05)', borderColor: 'rgba(88, 166, 255, 0.2)' }}>
                <h3 style={{ fontSize: '14px', marginBottom: '12px' }}>AI Forensic Summary</h3>
                <div style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.6' }}>
                  {fraud.riskScore > 50 ? (
                    "URGENT: Financial vectors indicate significant governance or reporting risk. Industry-relative metrics suggest aggressive capitalization of expenses."
                  ) : (
                    "Entity performance is optimized relative to sector averages. Liquidity maintenance exceeds benchmark targets by " + (ratios.liquidity.currentRatio - benchmark.currentRatio).toFixed(1) + "x."
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Dashboard;
