import React from 'react';
import { useStore } from '../store/useStore.jsx';
import { LayoutDashboard, FileUp, ShieldAlert, BarChart3, LogOut } from 'lucide-react';

const Sidebar = () => {
  const { setUser, currentCompany, view, setView } = useStore();

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Overview' },
    { id: 'upload', icon: FileUp, label: 'Upload Data' },
    { id: 'comparison', icon: BarChart3, label: 'Comparison' },
  ];

  return (
    <div className="sidebar" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ padding: '4px', background: 'var(--accent-blue)', borderRadius: '6px' }}>
            <ShieldAlert size={16} color="white" />
          </div>
          AlphaVision
        </h2>
      </div>

      <nav style={{ flex: 1 }}>
        {navItems.map((item, idx) => (
          <div 
            key={idx} 
            onClick={() => setView(item.id)}
            className="nav-item" 
            style={{ 
              display: 'flex', alignItems: 'center', gap: '12px', 
              padding: '12px', borderRadius: '8px', cursor: 'pointer',
              color: view === item.id ? 'var(--accent-blue)' : 'var(--text-secondary)',
              background: view === item.id ? 'rgba(88, 166, 255, 0.1)' : 'transparent',
              marginBottom: '4px', fontSize: '14px',
              transition: 'all 0.2s'
            }}
          >
            <item.icon size={18} />
            {item.label}
          </div>
        ))}
      </nav>

      <div style={{ marginTop: 'auto' }}>
        <div style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', marginBottom: '16px' }}>
          <p style={{ fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '4px' }}>CURRENT ENTITY</p>
          <p style={{ fontSize: '12px', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {currentCompany?.name || 'No Entity'}
          </p>
        </div>
        <div 
          onClick={() => setUser(null)}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', cursor: 'pointer', color: '#ff6b6b' }}
        >
          <LogOut size={18} />
          <span style={{ fontSize: '14px' }}>Sign Out</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
