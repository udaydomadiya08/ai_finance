import React from 'react';
import { useStore } from '../store/useStore.jsx';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const AnalysisTable = () => {
  const { currentCompany } = useStore();
  
  if (!currentCompany) return null;

  const { statements } = currentCompany;
  const years = ['2023', '2024', '2025']; // Mock years based on 3-period data

  const formatCurrency = (val) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(val);

  const calculateGrowth = (current, previous) => {
    if (!previous) return null;
    return ((current - previous) / previous) * 100;
  };

  const GrowthIndicator = ({ val }) => {
    if (val === null) return <Minus size={14} color="var(--text-secondary)" />;
    const isPositive = val > 0;
    return (
      <span style={{ 
        display: 'inline-flex', alignItems: 'center', gap: '4px', 
        fontSize: '11px', color: isPositive ? 'var(--success-green)' : 'var(--danger-red)',
        fontWeight: '600'
      }}>
        {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        {Math.abs(val).toFixed(1)}%
      </span>
    );
  };

  const rows = [
    { label: 'Revenue', data: statements.revenue, type: 'currency' },
    { label: 'Net Profit', data: statements.netProfit, type: 'currency' },
    { label: 'Operating Cash Flow', data: statements.operatingCashFlow, type: 'currency' },
    { label: 'Total Assets', data: statements.assets, type: 'currency' },
    { label: 'Total Liabilities', data: statements.liabilities, type: 'currency' },
    { label: 'Equity', data: statements.equity, type: 'currency' },
  ];

  return (
    <div className="glass-card" style={{ overflowX: 'auto', padding: '0' }}>
      <div style={{ padding: '24px', borderBottom: '1px solid var(--border)' }}>
        <h3 style={{ fontSize: '16px' }}>Detailed Financial Extract</h3>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Three-period forensic reconciliation</p>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
        <thead>
          <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
            <th style={{ padding: '16px 24px', fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>METRIC</th>
            {years.map((year, i) => (
              <th key={year} style={{ padding: '16px 24px', fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600', textAlign: 'right' }}>
                {year}
              </th>
            ))}
            <th style={{ padding: '16px 24px', fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600', textAlign: 'right' }}>GROWTH (LTM)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }} className="table-row-hover">
              <td style={{ padding: '16px 24px', fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{row.label}</td>
              {row.data.map((val, i) => (
                <td key={i} style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--text-primary)', textAlign: 'right', fontFamily: 'monospace' }}>
                  {formatCurrency(val)}
                </td>
              ))}
              <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                <GrowthIndicator val={calculateGrowth(row.data[row.data.length - 1], row.data[row.data.length - 2])} />
              </td>
            </tr>
          ))}
          {/* Calculated Ratios Row */}
          <tr style={{ background: 'rgba(88, 166, 255, 0.05)' }}>
            <td style={{ padding: '16px 24px', fontSize: '13px', fontWeight: '700', color: 'var(--accent-blue)' }}>Net Margin (%)</td>
            {statements.revenue.map((rev, i) => (
              <td key={i} style={{ padding: '16px 24px', fontSize: '13px', fontWeight: '700', color: 'var(--accent-blue)', textAlign: 'right' }}>
                {((statements.netProfit[i] / rev) * 100).toFixed(1)}%
              </td>
            ))}
            <td style={{ padding: '16px 24px', textAlign: 'right' }}>
               <GrowthIndicator val={
                 calculateGrowth(
                   (statements.netProfit[statements.netProfit.length - 1] / statements.revenue[statements.revenue.length - 1]),
                   (statements.netProfit[statements.netProfit.length - 2] / statements.revenue[statements.revenue.length - 2])
                 )
               } />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AnalysisTable;
