import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import { LoginPage } from './components/auth/LoginPage';
import { RoleSelector } from './components/auth/RoleSelector';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { SellerDashboard } from './components/seller/SellerDashboard';
import { BuyerStorefront } from './components/buyer/BuyerStorefront';
import { WalletPage } from './components/buyer/WalletPage';
import { SolanaWalletProvider } from './components/providers/SolanaWalletProvider';
import { InsightPanel } from './components/seller/InsightPanel';
import { OrdersPanel } from './components/shared/OrdersPanel';
import { LandingPage } from './components/landing/LandingPage';
import { Loader2 } from 'lucide-react';

function MainContent() {
  const { user, profile, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'main' | 'dashboard' | 'wallet' | 'orders'>('main');

  const [showLanding, setShowLanding] = useState(true);
  console.log('DEBUG: showLanding is', showLanding);

  if (showLanding) {
    return <LandingPage onEnter={() => setShowLanding(false)} />;
  }

  if (loading) {
    return (
      <div className="w-full h-full bg-[#060608] flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20 animate-pulse">
          <span className="text-white text-2xl font-black italic">S</span>
        </div>
        <Loader2 className="animate-spin text-blue-400" size={24} />
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Memuat SolanaWarung...</p>
      </div>
    );
  }

  if (!user) {
    return <LoginPage onBackToLanding={() => setShowLanding(true)} />;
  }

  if (!profile) {
    return <RoleSelector />;
  }

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>      {activeTab === 'main' && profile?.role === 'buyer' && <BuyerStorefront onOrderCreated={() => setActiveTab('orders')} />}
      {activeTab === 'main' && profile?.role === 'seller' && <SellerDashboard />}
      {activeTab === 'dashboard' && <InsightPanel />}
      {activeTab === 'wallet' && <WalletPage />}
      {activeTab === 'orders' && <OrdersPanel />}
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SolanaWalletProvider>
        <MainContent />
      </SolanaWalletProvider>
    </AuthProvider>
  );
}
