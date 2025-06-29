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
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:pl-72">
        <Header 
          onMenuClick={() => setSidebarOpen(true)} 
          title={getPageTitle()}
        />
        
        {/* Content with responsive padding */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-6 xl:p-8 max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;