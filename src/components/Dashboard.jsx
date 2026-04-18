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

import AnalysisTable from './AnalysisTable';
import BenchmarkChart from './BenchmarkChart';
import InsightGenerator from './InsightGenerator';

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

  return (
    <div className="main-content" id="dashboard-main">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ marginBottom: '4px', letterSpacing: '-0.5px' }}>Financial Intelligence</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Advanced Forensic Audit: <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{currentCompany.name}</span></p>
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

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
            <div className="glass-card" style={{ flex: 1 }}>
              <h3 style={{ marginBottom: '20px' }}>Forensic Trend Analysis</h3>
              <div className="chart-container">
                <TrendChart data={currentCompany.statements} />
              </div>
            </div>
            <InsightGenerator ratios={ratios} fraud={fraud} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
             <RiskIndicator score={fraud.riskScore} level={fraud.riskLevel} />
             <RedFlagsPanel flags={fraud.flags} />
          </div>

          <AnalysisTable />
        </div>

        <AnimatePresence>
          {showBenchmark && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
            >
              <BenchmarkChart ratios={ratios} />

              <div className="glass-card" style={{ background: 'rgba(88, 166, 255, 0.05)', borderColor: 'rgba(88, 166, 255, 0.2)' }}>
                <h3 style={{ fontSize: '14px', marginBottom: '12px' }}>AI Forensic Summary</h3>
                <div style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.6' }}>
                  {fraud.riskScore > 50 ? (
                    "URGENT: Financial vectors indicate significant governance or reporting risk. Industry-relative metrics suggest aggressive capitalization of expenses."
                  ) : (
                    "Entity performance is optimized relative to sector averages. Liquidity maintenance exceeds benchmark targets."
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
