import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { Page } from './types';
import Login from './pages/Login';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ProductionOrders from './pages/ProductionOrders';
import Laundry from './pages/Laundry';
import Packing from './pages/Packing';
import Final from './pages/Final';
import Shipping from './pages/Shipping';
import Notifications from './pages/Notifications';
import Departments from './pages/Departments';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  if (!isAuthenticated) {
    return <Login />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'orders': return <ProductionOrders />;
      case 'laundry': return <Laundry />;
      case 'packing': return <Packing />;
      case 'final': return <Final />;
      case 'shipping': return <Shipping />;
      case 'notifications': return <Notifications />;
      case 'departments': return <Departments />;
      default: return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}
