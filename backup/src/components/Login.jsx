import React, { useState } from 'react';
import { useStore } from '../store/useStore.jsx';
import { Lock, Shield, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const { setUser } = useStore();
  const [email, setEmail] = useState('demo@alphavision.ai');

  const handleLogin = (e) => {
    e.preventDefault();
    setUser({ email, name: 'Premium Investor' });
  };

  return (
    <div className="login-screen" style={{
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh',
      background: 'radial-gradient(circle at center, #1a1f2e 0%, #0a0c10 100%)'
    }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card" 
        style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}
      >
        <div style={{ marginBottom: '24px' }}>
          <div style={{ 
            width: '64px', height: '64px', borderRadius: '16px', 
            background: 'var(--accent-blue)', display: 'flex', 
            alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px'
          }}>
            <Shield size={32} color="white" />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>AlphaVision AI</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Enterprise Financial Intelligence & Fraud Defense</p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '16px', textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>EMAIL ADDRESS</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%', padding: '12px', borderRadius: '8px', 
                background: '#0d1117', border: '1px solid var(--border)',
                color: 'white', boxSizing: 'border-box'
              }} 
            />
          </div>
          <div style={{ marginBottom: '24px', textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>ACCESS KEY</label>
            <input 
              type="password" 
              defaultValue="••••••••"
              disabled
              style={{
                width: '100%', padding: '12px', borderRadius: '8px', 
                background: '#0d1117', border: '1px solid var(--border)',
                color: 'white', boxSizing: 'border-box', opacity: 0.5
              }} 
            />
          </div>
          <button 
            type="submit"
            style={{
              width: '100%', padding: '14px', borderRadius: '8px',
              background: 'var(--accent-blue)', color: 'white',
              border: 'none', fontWeight: '600', cursor: 'pointer'
            }}
          >
            Authorize Access
          </button>
        </form>

        <div style={{ marginTop: '24px', fontSize: '12px', color: 'var(--text-secondary)' }}>
          <Lock size={12} inline style={{ marginRight: '4px' }} /> Secure Socket Layer Active
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
