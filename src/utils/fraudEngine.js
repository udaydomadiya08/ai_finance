/**
 * Fraud Detection Engine (Forensics Logic)
 */

export const detectAnomalies = (data) => {
  const { revenue, netProfit, operatingCashFlow, liabilities } = data;
  const flags = [];
  let riskScore = 0;

  // 1. Revenue Spike without Profit Spike
  const revGrowth = (revenue[revenue.length - 1] - revenue[revenue.length - 2]) / revenue[revenue.length - 2];
  if (revGrowth > 0.5) {
    flags.push({
      type: 'warning',
      title: 'Aggressive Revenue Spike',
      description: `Revenue grew by ${(revGrowth * 100).toFixed(1)}% YoY. High risk of channel stuffing or revenue manipulation.`
    });
    riskScore += 25;
  }

  // 2. Profit vs Cash Flow Divergence (Classic Fraud Signal)
  const latestProfit = netProfit[netProfit.length - 1];
  const latestOCF = operatingCashFlow[operatingCashFlow.length - 1];
  if (latestProfit > 0 && latestOCF < 0) {
    flags.push({
      type: 'danger',
      title: 'Earnings-to-Cash Divergence',
      description: 'Positive net income reported despite negative operating cash flow. Signal of potential accounting irregularities.'
    });
    riskScore += 40;
  }

  // 3. Debt Explosion
  const debtGrowth = (liabilities[liabilities.length - 1] - liabilities[liabilities.length - 2]) / liabilities[liabilities.length - 2];
  if (debtGrowth > 0.8) {
    flags.push({
      type: 'warning',
      title: 'Rapid Leverage Increase',
      description: `Total liabilities jumped by ${(debtGrowth * 100).toFixed(1)}% in a single period.`
    });
    riskScore += 15;
  }

  // ML-Based (Lightweight Z-Score)
  const avgRev = revenue.reduce((a, b) => a + b, 0) / revenue.length;
  const stdDevRev = Math.sqrt(revenue.map(x => Math.pow(x - avgRev, 2)).reduce((a, b) => a + b, 0) / revenue.length);
  const zScore = (revenue[revenue.length - 1] - avgRev) / stdDevRev;

  if (Math.abs(zScore) > 2) {
    flags.push({
      type: 'info',
      title: 'Statistical Outlier Detected',
      description: 'The latest fiscal period shows a revenue figure that is statistically improbable based on historical variance.'
    });
    riskScore += 10;
  }

  return {
    riskScore: Math.min(100, riskScore),
    flags,
    riskLevel: riskScore > 60 ? 'HIGH' : riskScore > 30 ? 'MEDIUM' : 'LOW'
  };
};
