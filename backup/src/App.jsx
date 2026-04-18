import React from 'react';
import { useStore } from './store/useStore.jsx';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import DataUploader from './components/DataUploader';
import ComparisonView from './components/ComparisonView';
import ReportPreview from './components/ReportPreview';

function App() {
  const { user, currentCompany, setCurrentCompany, companies, view } = useStore();

  if (!user) {
    return <Login />;
  }

  const renderView = () => {
    switch(view) {
      case 'dashboard': return <Dashboard />;
      case 'comparison': return <ComparisonView />;
      case 'upload': return <DataUploader />;
      case 'report': return <ReportPreview />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <header style={{ 
          padding: '20px 40px', borderBottom: '1px solid var(--border)', 
          background: 'rgba(13, 17, 23, 0.5)', backdropFilter: 'blur(8px)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          position: 'sticky', top: 0, zIndex: 10
        }}>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {companies.map(company => (
              <button 
                key={company.id}
                onClick={() => setCurrentCompany(company)}
                style={{
                  padding: '6px 12px', borderRadius: '6px', fontSize: '11px', whiteSpace: 'nowrap',
                  background: currentCompany.id === company.id ? 'var(--accent-blue)' : 'rgba(255,255,255,0.05)',
                  color: currentCompany.id === company.id ? 'white' : 'var(--text-secondary)',
                  border: '1px solid ' + (currentCompany.id === company.id ? 'var(--accent-blue)' : 'var(--border)'),
                  cursor: 'pointer', transition: 'all 0.2s'
                }}
              >
                {company.name}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}><strong>{user.name}</strong></span>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #58a6ff, #3fb950)' }} />
          </div>
        </header>

        {renderView()}
      </div>
    </div>
  );
}

export default App;
