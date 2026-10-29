import React, { useState } from 'react';
import Navbar from './components/common/Navbar';
import HomeLanding from './components/home/HomeLanding';
import WalletDashboard from './components/wallet/WalletDashboard';
import PosTerminal from './components/pos/PosTerminal';
import P2pExchange from './components/p2p/P2pExchange';
import PinModal from './components/common/PinModal';
import CreateVoucherModal from './components/wallet/CreateVoucherModal';
import ReceiveCryptoModal from './components/wallet/ReceiveCryptoModal';
import WithdrawCryptoModal from './components/wallet/WithdrawCryptoModal';
import AuthModal from './components/auth/AuthModal';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DEFAULT_BALANCES } from './utils/cryptoAssets';

function MainApp() {
  const [currentRole, setCurrentRole] = useState('home');
  const [isVaultLocked, setIsVaultLocked] = useState(false);
  const [balances, setBalances] = useState(DEFAULT_BALANCES);
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const { currentUser, userProfile, setUserProfile } = useAuth();

  const rates = {
    vesRate: 36.80  // USDT / VES
  };

  const handleUnlockSuccess = (unlockedData) => {
    setIsVaultLocked(false);
  };

  // Descontar saldo al crear vales USDT
  const handleVoucherCreated = (v) => {
    setBalances(prev => ({
      ...prev,
      USDT: Math.max(0, prev.USDT - v.amount)
    }));
  };

  // Descontar saldo tras retiro on-chain exitoso
  const handleWithdrawSuccess = (symbol, amount) => {
    setBalances(prev => ({
      ...prev,
      [symbol]: Math.max(0, (prev[symbol] || 0) - amount)
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <div>
        <Navbar 
          currentRole={currentRole} 
          onSelectRole={setCurrentRole} 
          onOpenAuth={() => setIsAuthModalOpen(true)}
          isOnline={true}
        />

        <main className="container mx-auto py-2">
          {currentRole === 'home' && (
            <HomeLanding onLaunchApp={(role) => setCurrentRole(role)} />
          )}

          {currentRole === 'wallet' && (
            <WalletDashboard
              balances={balances}
              rates={rates}
              onOpenScanner={() => alert('Escáner activado: Cámara lista para leer QR de factura PoS')}
              onOpenReceive={() => setIsReceiveModalOpen(true)}
              onOpenWithdraw={() => setIsWithdrawModalOpen(true)}
              onOpenCreateVoucher={() => setIsVoucherModalOpen(true)}
              onLockVault={() => setIsVaultLocked(true)}
            />
          )}

          {currentRole === 'pos' && (
            <PosTerminal
              rates={rates}
              merchantName={userProfile?.displayName ? `PoS de ${userProfile.displayName}` : "Comercio Aliado P2P"}
            />
          )}

          {currentRole === 'p2p' && (
            <P2pExchange rates={rates} />
          )}
        </main>
      </div>

      {/* Modal de Registro e Inicio de Sesión Firebase */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => setCurrentRole('wallet')}
      />

      {/* Modal de Recepción Multi-Cripto (USDT, ETH, LTC, DOGE) */}
      <ReceiveCryptoModal
        isOpen={isReceiveModalOpen}
        onClose={() => setIsReceiveModalOpen(false)}
      />

      {/* Modal de Retiro Multi-Cripto On-Chain */}
      <WithdrawCryptoModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        balances={balances}
        rates={rates}
        onWithdrawSuccess={handleWithdrawSuccess}
      />

      {/* Modal de Desbloqueo Seguro por PIN */}
      <PinModal 
        isOpen={isVaultLocked} 
        onSuccess={handleUnlockSuccess} 
      />

      {/* Modal de Creación de Vale Off-Chain */}
      <CreateVoucherModal
        isOpen={isVoucherModalOpen}
        onClose={() => setIsVoucherModalOpen(false)}
        rates={rates}
        onVoucherCreated={handleVoucherCreated}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
