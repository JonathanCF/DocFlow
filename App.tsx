import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Layout } from './components/layout/Layout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { SupplierDashboard } from './pages/supplier/Dashboard';
import { AdminDashboard } from './pages/admin/Dashboard';
import { UserRole } from './types';

const MainContent: React.FC = () => {
  const { currentUser } = useApp();
  const [view, setView] = useState<'login' | 'register'>('login');

  // If not logged in, show Auth Pages
  if (!currentUser) {
    if (view === 'register') return <Register setView={setView} />;
    return <Login setView={setView} />;
  }

  // Logged in Routing
  return (
    <Layout>
      {currentUser.role === UserRole.ADMIN ? <AdminDashboard /> : <SupplierDashboard />}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
};

export default App;