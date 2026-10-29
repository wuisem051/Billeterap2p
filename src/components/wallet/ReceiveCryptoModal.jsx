import React, { useState } from 'react';
import { X, Copy, Check, QrCode, ArrowDownLeft, ShieldCheck, AlertCircle } from 'lucide-react';
import QRCode from 'react-qr-code';
import { SUPPORTED_ASSETS } from '../../utils/cryptoAssets';

export default function ReceiveCryptoModal({ isOpen, onClose, selectedSymbol = 'USDT' }) {
  const [currentSymbol, setCurrentSymbol] = useState(selectedSymbol);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const asset = SUPPORTED_ASSETS.find(a => a.symbol === currentSymbol) || SUPPORTED_ASSETS[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(asset.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl relative">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <ArrowDownLeft size={18} />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">Recibir Criptomonedas</h3>
              <p className="text-[11px] text-slate-400">Dirección de depósito directa</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white bg-slate-800">
            <X size={16} />
          </button>
        </div>

        {/* Selector de Moneda */}
        <div className="grid grid-cols-4 gap-1.5 mb-4 p-1 bg-slate-950 rounded-2xl border border-slate-850">
          {SUPPORTED_ASSETS.map((a) => (
            <button
              key={a.symbol}
              onClick={() => setCurrentSymbol(a.symbol)}
              className={`py-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-0.5 ${
                currentSymbol === a.symbol
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{a.symbol}</span>
            </button>
          ))}
        </div>

        {/* QR Code */}
        <div className="p-4 bg-white rounded-2xl mx-auto w-fit shadow-md my-2">
          <QRCode size={180} value={asset.address} viewBox="0 0 256 256" />
        </div>

        {/* Red y Detalles */}
        <div className="text-center my-3 space-y-1">
          <span className="inline-block px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-[11px] font-mono">
            Red: {asset.network}
          </span>
          <p className="text-xs text-slate-400">Envía solo <strong className="text-white">{asset.name} ({asset.symbol})</strong> a esta dirección.</p>
        </div>

        {/* Caja de Dirección */}
        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2">
          <span className="text-xs font-mono text-slate-300 truncate">
            {asset.address}
          </span>
          <button
            onClick={handleCopy}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors shrink-0"
            title="Copiar Dirección"
          >
            {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
          </button>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
          <span>Depósito mínimo: {asset.minDeposit} {asset.symbol}</span>
          <span className="text-emerald-400 font-semibold">Confirmación automática</span>
        </div>
      </div>
    </div>
  );
}
