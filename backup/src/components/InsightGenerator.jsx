import React, { useState, useEffect } from 'react';
import { Brain, Sparkles, ChevronRight } from 'lucide-react';

const InsightGenerator = ({ ratios, fraud }) => {
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const generateInsight = () => {
    let insights = [];
    if (ratios.profitability.netMargin > 20) {
      insights.push("Exceptional profitability profile with dominant market pricing power.");
    } else if (ratios.profitability.netMargin < 5) {
      insights.push("Thin margin operating environment; critical focus needed on cost optimization.");
    }

    if (fraud.riskScore > 50) {
      insights.push("WARNING: High forensic variability detected in revenue recognition and cash convergence mapping.");
    } else {
      insights.push("Financial integrity remains high with consistent correlation between GAAP earnings and cash flow.");
    }

    if (ratios.leverage.debtToEquity > 2) {
      insights.push("Aggressive capital structure noted. Insolvency risk elevated if EBITDA growth plateaus.");
    }

    return insights.join(' ');
  };

  const fullText = generateInsight();

  useEffect(() => {
    setTypedText('');
    let i = 0;
    setIsTyping(true);
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 20);
    return () => clearInterval(interval);
  }, [fullText]);

  return (
    <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(88, 166, 255, 0.1), rgba(187, 128, 255, 0.1))', borderColor: 'rgba(88, 166, 255, 0.2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <div style={{ padding: '6px', background: 'var(--accent-blue)', borderRadius: '6px' }}>
          <Brain size={16} color="white" />
        </div>
        <h3 style={{ fontSize: '15px', color: 'var(--accent-blue)' }}>AI Forensic Narrative</h3>
        <Sparkles size={14} color="var(--accent-blue)" style={{ marginLeft: 'auto' }} />
      </div>

      <div style={{ minHeight: '80px', position: 'relative' }}>
        <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text-primary)', fontStyle: 'italic' }}>
          "{typedText}"
          {isTyping && <span className="cursor-blink" style={{ display: 'inline-block', width: '2px', height: '14px', background: 'var(--accent-blue)', marginLeft: '2px' }} />}
        </p>
      </div>

      <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '12px' }}>
        <button style={{ 
          background: 'transparent', border: '1px solid var(--accent-blue)', color: 'var(--accent-blue)',
          padding: '6px 12px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'
        }}>
          Explore Anomaly Map <ChevronRight size={14} />
        </button>
      </div>

      <style>{`
        .cursor-blink { animation: blink 0.8s infinite; }
        @keyframes blink { 0%, 100% { opacity: 0; } 50% { opacity: 1; } }
      `}</style>
    </div>
  );
};

export default InsightGenerator;
