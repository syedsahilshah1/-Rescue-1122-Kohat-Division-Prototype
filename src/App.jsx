import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Analytics from './pages/Analytics';
import Incidents from './pages/Incidents';
import GPSTracker from './pages/MapViewer';
import HospitalStatus from './pages/HospitalStatus';
import AuditLogs from './pages/AuditLogs';
import FleetStatus from './pages/FleetStatus';

const DashboardLayout = ({ children, activeTab, setActiveTab }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f172a' }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main style={{
        flex: 1,
        marginLeft: '300px',
        padding: '2rem',
        maxWidth: 'calc(100vw - 320px)'
      }}>
        {children}
      </main>
    </div>
  );
};

const AppContent = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user, loading } = useAuth();

  useEffect(() => {
    const handleTabChange = (e) => {
      if (e.detail) setActiveTab(e.detail);
    };
    window.addEventListener('change-tab', handleTabChange);
    return () => window.removeEventListener('change-tab', handleTabChange);
  }, []);

  if (loading) {
    return <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>Initializing Rescue System...</div>;
  }

  if (!user) {
    return <Login />;
  }

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'dashboard' && <Analytics />}
      {activeTab === 'incidents' && <Incidents />}
      {activeTab === 'map' && <GPSTracker />}
      {activeTab === 'hospitals' && <HospitalStatus />}
      {activeTab === 'audit' && <AuditLogs />}
      {activeTab === 'fleet' && <FleetStatus />}
    </DashboardLayout>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
