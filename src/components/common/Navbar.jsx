import React from 'react';
import { Wallet, Store, ArrowLeftRight, Wifi, Home, LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ currentRole, onSelectRole, onOpenAuth, isOnline = true }) {
  const { currentUser, userProfile, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-850 px-4 py-3 mb-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Brand / Logo que lleva a Home */}
        <button 
          onClick={() => onSelectRole('home')}
          className="flex items-center gap-2 hover:opacity-90 transition-opacity text-left"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-black text-slate-950 text-sm shadow-md shadow-emerald-500/20">
            ⚡
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold tracking-tight text-white text-base leading-none">CARTERA</span>
            <span className="text-[10px] text-emerald-400 font-mono">P2P • USDT</span>
          </div>
        </button>

        {/* Roles Switcher */}
        <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-2xl gap-0.5">
          <button
            onClick={() => onSelectRole('home')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              currentRole === 'home' 
                ? 'bg-emerald-500 text-slate-950 shadow-sm' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Home size={14} />
            <span className="hidden sm:inline">Inicio</span>
          </button>
          <button
            onClick={() => onSelectRole('wallet')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              currentRole === 'wallet' 
                ? 'bg-emerald-500 text-slate-950 shadow-sm' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Wallet size={14} />
            <span className="hidden sm:inline">Billetera</span>
          </button>
          <button
            onClick={() => onSelectRole('pos')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              currentRole === 'pos' 
                ? 'bg-emerald-500 text-slate-950 shadow-sm' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Store size={14} />
            <span className="hidden sm:inline">PoS</span>
          </button>
          <button
            onClick={() => onSelectRole('p2p')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              currentRole === 'p2p' 
                ? 'bg-emerald-500 text-slate-950 shadow-sm' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ArrowLeftRight size={14} />
            <span className="hidden sm:inline">P2P</span>
          </button>
        </div>

        {/* Auth / Perfil & Estado */}
        <div className="flex items-center gap-2">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-bold text-slate-200">
                  {userProfile?.displayName || currentUser.email.split('@')[0]}
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">
                  {userProfile?.balanceUsdt !== undefined ? `${userProfile.balanceUsdt.toFixed(2)} USDT` : 'Conectado'}
                </span>
              </div>
              <button
                onClick={logout}
                title="Cerrar Sesión"
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-emerald-500 hover:text-slate-950 border border-slate-800 text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <LogIn size={14} />
              <span className="hidden sm:inline">Acceder</span>
            </button>
          )}

          <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 pl-1">
            <Wifi size={13} className={isOnline ? 'text-emerald-400' : 'text-rose-500'} />
          </div>
        </div>
      </div>
    </header>
  );
}
