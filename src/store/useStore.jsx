import { useState, createContext, useContext, useEffect } from 'react';
import { sampleCompanies } from '../data/sampleCompanies';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('alphavision_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [companies, setCompanies] = useState(() => {
    const saved = localStorage.getItem('alphavision_companies');
    return saved ? JSON.parse(saved) : sampleCompanies;
  });

  const [currentCompany, setCurrentCompany] = useState(companies[0]);
  const [compareWith, setCompareWith] = useState(null);
  const [view, setView] = useState('dashboard'); // 'dashboard', 'comparison', 'upload'

  useEffect(() => {
    localStorage.setItem('alphavision_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('alphavision_companies', JSON.stringify(companies));
  }, [companies]);

  const addCompany = (newCompany) => {
    setCompanies(prev => [...prev, { ...newCompany, id: Date.now().toString() }]);
  };

  const value = {
    user, setUser,
    companies, addCompany,
    currentCompany, setCurrentCompany,
    compareWith, setCompareWith,
    view, setView
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export const useStore = () => useContext(StoreContext);
