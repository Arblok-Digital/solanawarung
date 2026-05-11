import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: 'main' | 'dashboard' | 'wallet' | 'orders';
  setActiveTab: (tab: 'main' | 'dashboard' | 'wallet' | 'orders') => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  activeTab, 
  setActiveTab 
}) => {
  return (
    <div className="w-full h-full bg-[#060608] font-sans text-[#F0EEE8] flex flex-col overflow-hidden">
      <Header />
      <main className="flex-1 flex overflow-hidden">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <section className="flex-1 overflow-y-auto bg-[#060608]">
          {children}
        </section>
      </main>
    </div>
  );
};
