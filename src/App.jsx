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

  // Proteger acceso: si no está logueado, abrir modal de autenticación
  const handleSelectRole = (role) => {
    if (role !== 'home' && !currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    setCurrentRole(role);
  };

  // Mantener sincronizado el saldo USDT con el perfil del usuario en Firestore
  const currentBalances = {
    ...balances,
    USDT: userProfile?.balanceUsdt !== undefined ? userProfile.balanceUsdt : (balances.USDT || 0)
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
          onSelectRole={handleSelectRole} 
          onOpenAuth={() => setIsAuthModalOpen(true)}
          isOnline={true}
        />

        <main className="container mx-auto py-2">
          {currentRole === 'home' && (
            <HomeLanding onLaunchApp={(role) => handleSelectRole(role)} />
          )}

          {currentRole === 'wallet' && (
            currentUser ? (
              <WalletDashboard
                balances={currentBalances}
                rates={rates}
                onOpenScanner={() => alert('Escáner activado: Cámara lista para leer QR de factura PoS')}
                onOpenReceive={() => setIsReceiveModalOpen(true)}
                onOpenWithdraw={() => setIsWithdrawModalOpen(true)}
                onOpenCreateVoucher={() => setIsVoucherModalOpen(true)}
                onLockVault={() => setIsVaultLocked(true)}
              />
            ) : (
              <div className="max-w-md mx-auto text-center py-16 px-4 space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center font-bold text-2xl">
                  🔒
                </div>
                <h2 className="text-xl font-bold text-white">Registro Requerido</h2>
                <p className="text-sm text-slate-400">
                  Para acceder a tu billetera y gestionar tus fondos debes registrarte o iniciar sesión con tu cuenta.
                </p>
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all"
                >
                  Crear Cuenta / Iniciar Sesión
                </button>
              </div>
            )
          )}

          {currentRole === 'pos' && (
            currentUser ? (
              <PosTerminal
                rates={rates}
                merchantName={userProfile?.displayName ? `PoS de ${userProfile.displayName}` : "Comercio Aliado P2P"}
              />
            ) : (
              <div className="max-w-md mx-auto text-center py-16 px-4 space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center font-bold text-2xl">
                  🔒
                </div>
                <h2 className="text-xl font-bold text-white">Acceso al Punto de Venta</h2>
                <p className="text-sm text-slate-400">
                  Registra tu negocio para empezar a recibir pagos en USDT.
                </p>
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all"
                >
                  Registrarse como Comercio
                </button>
              </div>
            )
          )}

          {currentRole === 'p2p' && (
            currentUser ? (
              <P2pExchange rates={rates} />
            ) : (
              <div className="max-w-md mx-auto text-center py-16 px-4 space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center font-bold text-2xl">
                  🔒
                </div>
                <h2 className="text-xl font-bold text-white">Cajeros y P2P</h2>
                <p className="text-sm text-slate-400">
                  Debes contar con una cuenta activa para comprar o vender USDT en bolívares.
                </p>
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all"
                >
                  Ingresar a P2P
                </button>
              </div>
            )
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
