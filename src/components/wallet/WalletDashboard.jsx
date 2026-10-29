import React, { useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  QrCode, 
  ArrowDownLeft, 
  ArrowUpRight,
  Ticket, 
  ShieldCheck, 
  History, 
  Sparkles,
  Lock,
  Coins
} from 'lucide-react';
import { SUPPORTED_ASSETS } from '../../utils/cryptoAssets';

export default function WalletDashboard({ 
  balances = { USDT: 125.50, ETH: 0.045, LTC: 1.85, DOGE: 420.00 },
  rates = { vesRate: 36.80 },
  onOpenScanner,
  onOpenReceive,
  onOpenWithdraw,
  onOpenCreateVoucher,
  onLockVault
}) {
  const [showBalance, setShowBalance] = useState(true);

  // Calcular valor total de la cartera en USD
  const totalUsdValue = Object.entries(balances).reduce((acc, [symbol, amount]) => {
    const asset = SUPPORTED_ASSETS.find(a => a.symbol === symbol);
    const rate = asset ? asset.rateUsd : 1.0;
    return acc + (amount * rate);
  }, 0);

  const totalVesValue = totalUsdValue * (rates.vesRate || 36.80);

  const [transactions] = useState([
    {
      id: 'tx_01',
      type: 'payment',
      title: 'Café Panadería Express (PoS)',
      amount: -4.50,
      symbol: 'USDT',
      timestamp: 'Hoy, 10:45 AM',
      status: 'confirmado'
    },
    {
      id: 'tx_02',
      type: 'receive',
      title: 'Depósito On-Chain DOGE',
      amount: +150.00,
      symbol: 'DOGE',
      timestamp: 'Hoy, 08:30 AM',
      status: 'confirmado'
    },
    {
      id: 'tx_03',
      type: 'voucher_created',
      title: 'Vale Digital Creado #892',
      amount: -15.00,
      symbol: 'USDT',
      timestamp: 'Ayer, 04:20 PM',
      status: 'bloqueado'
    },
    {
      id: 'tx_04',
      type: 'receive',
      title: 'Recarga Cajero P2P (Pago Móvil)',
      amount: +50.00,
      symbol: 'USDT',
      timestamp: '27 Oct, 02:15 PM',
      status: 'confirmado'
    }
  ]);

  return (
    <div className="w-full max-w-md mx-auto space-y-6 pb-24 animate-fade-in px-4">
      {/* Tarjeta de Saldo Principal Multi-Moneda */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 p-6 border border-slate-800/80 shadow-2xl backdrop-blur-xl">
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Cabecera de la tarjeta */}
        <div className="flex justify-between items-center text-slate-400 mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold tracking-wider uppercase text-emerald-400">
              Bóveda No Custodia Multi-Crypto
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setShowBalance(!showBalance)}
              className="p-1.5 rounded-lg hover:bg-slate-800/60 text-slate-400 hover:text-slate-200 transition-colors"
              title={showBalance ? "Ocultar Saldo" : "Mostrar Saldo"}
            >
              {showBalance ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {onLockVault && (
              <button 
                onClick={onLockVault}
                className="p-1.5 rounded-lg hover:bg-slate-800/60 text-slate-400 hover:text-amber-400 transition-colors"
                title="Bloquear Bóveda"
              >
                <Lock size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Monto Total Estimado */}
        <div className="my-4">
          <div className="flex items-baseline gap-2">
            <h1 className="text-4xl font-extrabold tracking-tight text-white font-mono">
              ${showBalance ? totalUsdValue.toFixed(2) : '••••••'}
            </h1>
            <span className="text-emerald-400 text-sm font-bold uppercase tracking-wider">
              USD Total
            </span>
          </div>

          <div className="flex items-center gap-3 mt-1 text-slate-400 text-sm">
            <span>≈ Bs. {showBalance ? totalVesValue.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '•••'}</span>
            <span>•</span>
            <span className="text-slate-300 font-medium">4 Activos Soportados</span>
          </div>
        </div>

        {/* Indicador de Seguridad Local */}
        <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span>Llaves Cifradas (AES-256)</span>
          </div>
          <span className="text-slate-400 font-mono">PIN Activo</span>
        </div>
      </div>

      {/* Botones de Acción Rápida (Escanear, Recibir, Retirar, Vale) */}
      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={onOpenScanner}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-900 border border-slate-800/80 hover:border-emerald-500/50 hover:bg-slate-850 active:scale-95 transition-all group shadow-md"
        >
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors mb-1.5">
            <QrCode size={20} />
          </div>
          <span className="text-[11px] font-semibold text-slate-200">Escanear</span>
        </button>

        <button
          onClick={onOpenReceive}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-900 border border-slate-800/80 hover:border-cyan-500/50 hover:bg-slate-850 active:scale-95 transition-all group shadow-md"
        >
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors mb-1.5">
            <ArrowDownLeft size={20} />
          </div>
          <span className="text-[11px] font-semibold text-slate-200">Recibir</span>
        </button>

        <button
          onClick={onOpenWithdraw}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-900 border border-slate-800/80 hover:border-rose-500/50 hover:bg-slate-850 active:scale-95 transition-all group shadow-md"
        >
          <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 group-hover:bg-rose-500 group-hover:text-slate-950 transition-colors mb-1.5">
            <ArrowUpRight size={20} />
          </div>
          <span className="text-[11px] font-semibold text-slate-200">Retirar</span>
        </button>

        <button
          onClick={onOpenCreateVoucher}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-900 border border-slate-800/80 hover:border-amber-500/50 hover:bg-slate-850 active:scale-95 transition-all group shadow-md"
        >
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors mb-1.5">
            <Ticket size={20} />
          </div>
          <span className="text-[11px] font-semibold text-slate-200">Crear Vale</span>
        </button>
      </div>

      {/* LISTA DE ACTIVOS CRIPTO (USDT, ETH, LTC, DOGE) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2 text-slate-300 font-semibold text-xs">
            <Coins size={15} />
            <span>Mis Criptomonedas</span>
          </div>
          <span className="text-[11px] text-slate-500">Tasas en tiempo real</span>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {SUPPORTED_ASSETS.map((asset) => {
            const amount = balances[asset.symbol] || 0;
            const usdEq = amount * asset.rateUsd;

            return (
              <div 
                key={asset.symbol}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center font-extrabold text-sm ${asset.iconColor}`}>
                    {asset.symbol.slice(0, 3)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-white">{asset.name}</span>
                      <span className="text-[10px] font-mono text-slate-500 uppercase">{asset.symbol}</span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono">
                      1 {asset.symbol} ≈ ${asset.rateUsd.toLocaleString()} USD
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm font-bold font-mono text-white">
                    {showBalance ? amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: asset.decimals }) : '••••'}
                  </p>
                  <p className="text-xs text-slate-400 font-mono">
                    ≈ ${showBalance ? usdEq.toFixed(2) : '•••'} USD
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Historial de Movimientos Locales */}
      <div className="space-y-2.5 pt-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2 text-slate-300 font-semibold text-xs">
            <History size={15} />
            <span>Actividad Reciente</span>
          </div>
          <span className="text-[11px] text-slate-500 hover:text-slate-400 cursor-pointer">Ver todo</span>
        </div>

        <div className="space-y-2">
          {transactions.map((tx) => (
            <div 
              key={tx.id} 
              className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800/60 hover:bg-slate-900 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${
                  tx.amount > 0 
                    ? 'bg-emerald-500/10 text-emerald-400' 
                    : tx.type === 'voucher_created'
                    ? 'bg-amber-500/10 text-amber-400'
                    : 'bg-rose-500/10 text-rose-400'
                }`}>
                  {tx.amount > 0 ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-200">{tx.title}</p>
                  <p className="text-[11px] text-slate-500">{tx.timestamp}</p>
                </div>
              </div>

              <div className="text-right">
                <p className={`text-xs font-mono font-bold ${
                  tx.amount > 0 ? 'text-emerald-400' : 'text-slate-200'
                }`}>
                  {tx.amount > 0 ? `+${tx.amount}` : tx.amount} {tx.symbol}
                </p>
                <p className="text-[10px] text-slate-500 capitalize">{tx.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
