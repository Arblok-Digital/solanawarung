import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';

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
    <div className="w-full h-full bg-[#060608] font-sans text-[#F0EEE8] flex flex-col relative">
      <Header />
      <main className="flex-1 flex flex-col md:flex-row relative w-full min-h-0">
        <aside className="hidden md:flex md:w-64 bg-[#0c111d] border-r border-white/5 z-30 flex-col shrink-0 relative h-full">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </aside>
        <section className="flex-1 w-full min-w-0 overflow-y-auto overflow-x-hidden bg-[#060608] pb-20 md:pb-8">
          {children}
        </section>
      </main>
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};
