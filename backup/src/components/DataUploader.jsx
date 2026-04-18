import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileUp, Info, CheckCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useStore } from '../store/useStore.jsx';

const DataUploader = () => {
  const { addCompany, setView } = useStore();

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Robust Elite Mapper
      // Attempts to find Revenue, Profit, OCF columns by looking for keywords
      const findCol = (keywords) => {
        const row = jsonData[0];
        if (!row) return [];
        const key = Object.keys(row).find(k => 
          keywords.some(kw => k.toLowerCase().includes(kw.toLowerCase()))
        );
        return key ? jsonData.map(r => parseFloat(r[key]) || 0) : [0,0,0];
      };

      const newEntity = {
        name: file.name.split('.')[0],
        type: 'technology',
        industry: 'Technology',
        statements: {
          revenue: findCol(['revenue', 'sales', 'turnover']),
          netProfit: findCol(['profit', 'income', 'net']),
          operatingCashFlow: findCol(['cash', 'ocf', 'operating']),
          assets: findCol(['assets']),
          liabilities: findCol(['liabilities', 'debt']),
          equity: findCol(['equity']),
        }
      };

      addCompany(newEntity);
      alert('ELITE Intelligence: Entity synthesized and added to portfolio.');
      setView('dashboard');
    };

    reader.readAsArrayBuffer(file);
  }, [addCompany, setView]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'], 'text/csv': ['.csv'] } });

  return (
    <div style={{ padding: '40px' }}>
      <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <FileUp size={24} color="var(--accent-blue)" /> Data Ingestion Terminal
        </h2>
        
        <div {...getRootProps()} style={{
          border: '2px dashed var(--border)',
          borderRadius: '12px',
          padding: '60px 40px',
          textAlign: 'center',
          cursor: 'pointer',
          background: isDragActive ? 'rgba(88, 166, 255, 0.05)' : 'transparent',
          borderColor: isDragActive ? 'var(--accent-blue)' : 'var(--border)',
          transition: 'all 0.2s ease'
        }}>
          <input {...getInputProps()} />
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <div style={{ padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}>
              <FileUp size={32} color="var(--accent-blue)" />
            </div>
          </div>
          {isDragActive ? (
            <p style={{ fontWeight: '600' }}>Drop to synthesize...</p>
          ) : (
            <>
              <p style={{ fontWeight: '600', marginBottom: '8px' }}>Drag & Drop Statements</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>AI will automatically map headers to financial vectors</p>
            </>
          )}
        </div>

        <div style={{ marginTop: '32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ padding: '16px', borderRadius: '8px', background: 'rgba(88, 166, 255, 0.05)', display: 'flex', gap: '12px' }}>
            <CheckCircle size={18} color="var(--success-green)" />
            <div style={{ fontSize: '12px' }}>Header Normalization Active</div>
          </div>
          <div style={{ padding: '16px', borderRadius: '8px', background: 'rgba(210, 153, 34, 0.05)', display: 'flex', gap: '12px' }}>
            <Info size={18} color="var(--warning-orange)" />
            <div style={{ fontSize: '12px' }}>Multi-period required for trend analysis</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataUploader;
