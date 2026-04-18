/**
 * Core Financial Logic for AI Finance AI
 */

export const calculateRatios = (data) => {
  const { revenue, netProfit, assets, liabilities, equity, operatingCashFlow } = data;
  
  // Latest figures (index: length - 1)
  const rev = revenue[revenue.length - 1];
  const profit = netProfit[netProfit.length - 1];
  const ast = assets[assets.length - 1];
  const liab = liabilities[liabilities.length - 1];
  const eq = equity[equity.length - 1];
  const ocf = operatingCashFlow[operatingCashFlow.length - 1];

  return {
    profitability: {
      netMargin: (profit / rev) * 100,
      roa: (profit / ast) * 100,
      roe: (profit / eq) * 100,
    },
    liquidity: {
      currentRatio: ast / liab, // simplified: assuming all assets/liabs in this MVP
    },
    leverage: {
      debtToEquity: liab / eq,
    },
    efficiency: {
      assetTurnover: rev / ast,
    },
    healthScore: calculateHealthScore(rev, profit, ast, liab, eq),
  };
};

const calculateHealthScore = (rev, profit, ast, liab, eq) => {
  // Simple formula for MVP: Weighted average of normalized metrics
  let score = 0;
  if (profit > 0) score += 40 * (profit / rev); // Profitability weight
  if (ast > liab) score += 30; // Solvency weight
  if (rev > 0) score += 30 * Math.min(1, rev / ast); // Efficiency weight
  return Math.min(100, Math.max(0, score * 2)); // Scale to 100
};
