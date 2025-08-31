import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import MealAnalyzer from './components/MealAnalyzer';
import PersonalCoach from './components/PersonalCoach';
import History from './components/History';
import Login from './components/Login';
import { Page } from './types';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<Page>(Page.Analyzer);

  const renderPage = useCallback(() => {
    switch (currentPage) {
      case Page.Analyzer:
        return <MealAnalyzer />;
      case Page.Coach:
        return <PersonalCoach />;
      case Page.History:
        return <History />;
      default:
        return <MealAnalyzer />;
    }
  }, [currentPage]);
  
  const handleLogin = () => {
      setIsAuthenticated(true);
  };
  
  const handleLogout = () => {
      setIsAuthenticated(false);
      setCurrentPage(Page.Analyzer);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-base-100 text-content font-sans">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} onLogout={handleLogout} />
      <main className="p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          {renderPage()}
        </div>
      </main>
      <footer className="text-center p-4 mt-8 text-gray-500 text-sm">
        <p>Powered by AI. Nutritional information is an estimate and should not be considered medical advice.</p>
      </footer>
    </div>
  );
};

export default App;
