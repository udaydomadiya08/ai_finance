export const industryBenchmarks = {
  technology: {
    netMargin: 15,
    currentRatio: 2.0,
    debtToEquity: 1.5,
    assetTurnover: 0.8
  },
  retail: {
    netMargin: 5,
    currentRatio: 1.2,
    debtToEquity: 2.5,
    assetTurnover: 2.5
  },
  startup: {
    netMargin: -10,
    currentRatio: 3.0,
    debtToEquity: 0.5,
    assetTurnover: 0.4
  }
};

export const sampleCompanies = [
  {
    id: '1',
    name: 'TechFlow Solutions (Healthy)',
    type: 'technology',
    industry: 'Technology',
    statements: {
      revenue: [1000000, 1500000, 2200000],
      netProfit: [100000, 250000, 400000],
      operatingCashFlow: [80000, 200000, 350000],
      assets: [500000, 800000, 1200000],
      liabilities: [100000, 150000, 200000],
      equity: [400000, 650000, 1000000],
    }
  },
  {
    id: '2',
    name: 'GlitchCorp Inc. (High Risk)',
    type: 'retail',
    industry: 'Retail',
    statements: {
      revenue: [5000000, 7500000, 12000000],
      netProfit: [500000, 800000, 1500000],
      operatingCashFlow: [600000, 200000, -500000],
      assets: [2000000, 3000000, 4500000],
      liabilities: [1000000, 2000000, 4000000],
      equity: [1000000, 1000000, 500000],
    }
  }
];
