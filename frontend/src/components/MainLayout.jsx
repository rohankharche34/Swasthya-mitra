import React from 'react';
import { Outlet } from 'react-router-dom';
import AppNavbar from './AppNavbar';
import AppFooter from './AppFooter';

function MainLayout({user,handleLogout,roomId,handleConnectDoctor}) {
  return (
    <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
      <AppNavbar user={user} handleLogout={handleLogout} roomId={roomId} handleConnectDoctor={handleConnectDoctor}/>
      <main style={{ flex: 1 }}>
        <Outlet /> {/* This will render the active page (e.g., HomePage, DashboardPage) */}
      </main>
      <AppFooter />
    </div>
  );
}

export default MainLayout;