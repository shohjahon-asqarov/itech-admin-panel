import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getPageTitle = () => {
    const path = window.location.pathname;
    switch (path) {
      case '/dashboard': return 'Dashboard';
      case '/leads': return 'Lidlar';
      case '/teachers': return "O'qituvchilar";
      case '/testimonials': return 'Sharhlar';
      case '/courses': return 'Kurslar';
      case '/settings': return 'Sozlamalar';
      default: return 'Dashboard';
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content - No margin on desktop, sidebar is fixed */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          onMenuClick={() => setSidebarOpen(true)} 
          title={getPageTitle()}
        />
        
        {/* Content with proper padding to account for fixed sidebar */}
        <main className="flex-1 overflow-auto lg:pl-72">
          <div className="p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;