
import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import RightSidebar from './RightSidebar';

type LayoutProps = {
  children: React.ReactNode;
  showSidebars?: boolean;
};

const Layout: React.FC<LayoutProps> = ({ children, showSidebars = true }) => {
  return (
    <div className="flex flex-col min-h-screen bg-background cyber-bg">
      <Navbar />
      <div className="flex flex-1 pt-16 w-full">
        {showSidebars && (
          <div className="hidden md:block w-64 fixed left-0 h-screen pt-4">
            <Sidebar />
          </div>
        )}

        <main className={`${showSidebars ? 'md:ml-64 md:mr-64' : 'w-full'} flex-1 min-h-[calc(100vh-4rem)] transition-all duration-300 px-4 pb-20`}>
          <div className="max-w-4xl mx-auto animate-fade-up">
            {children}
          </div>
        </main>

        {showSidebars && (
          <div className="hidden lg:block w-64 fixed right-0 h-screen pt-4">
            <RightSidebar />
          </div>
        )}
      </div>
    </div>
  );
};

export default Layout;
