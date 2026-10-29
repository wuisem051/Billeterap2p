import React, { useState } from 'react';
import { Ticket, X, Copy, Check, Sparkles } from 'lucide-react';
import QRCode from 'react-qr-code';
import { createOffchainVoucher } from '../../utils/cryptoUtils';

export default function CreateVoucherModal({ isOpen, onClose, onVoucherCreated, rates }) {
  const [usdtAmount, setUsdtAmount] = useState('10.00');
  const [memo, setMemo] = useState('');
  const [generatedVoucher, setGeneratedVoucher] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    const numUsdt = parseFloat(usdtAmount) || 0;
    if (numUsdt <= 0) return;

    const voucher = await createOffchainVoucher(numUsdt.toFixed(2), memo);
    setGeneratedVoucher(voucher);
    if (onVoucherCreated) {
      onVoucherCreated(voucher.voucherData);
    }
  };

  const handleCopy = () => {
    if (!generatedVoucher) return;
    navigator.clipboard.writeText(generatedVoucher.tokenString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setGeneratedVoucher(null);
    setMemo('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl relative">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 text-amber-400">
            <Ticket size={20} />
            <h3 className="font-bold text-white text-base">Crear Vale USDT Off-Chain</h3>
          </div>
          <button onClick={handleReset} className="p-1 rounded-lg text-slate-400 hover:text-white bg-slate-800">
            <X size={16} />
          </button>
        </div>

        {!generatedVoucher ? (
          <div className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Monto en USDT</label>
              <input
                type="number"
                step="0.01"
                value={usdtAmount}
                onChange={(e) => setUsdtAmount(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-white font-mono font-bold text-xl focus:border-amber-500 focus:outline-none"
              />
              <p className="text-[11px] text-slate-500 mt-1 font-mono">
                ≈ Bs. {((parseFloat(usdtAmount) || 0) * (rates?.vesRate || 36.80)).toFixed(2)}
              </p>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Nota / Concepto (Opcional)</label>
              <input
                type="text"
                placeholder="Ej. Pago de almuerzo"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-sm text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <button
              onClick={handleGenerate}
              className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm transition-all active:scale-95 shadow-lg shadow-amber-500/20"
            >
              Generar Token Vale USDT
            </button>
          </div>
        ) : (
          <div className="space-y-4 text-center">
            <div className="p-3 bg-white rounded-2xl mx-auto w-fit shadow-md">
              <QRCode size={180} value={generatedVoucher.tokenString} />
            </div>

            <div>
              <p className="text-2xl font-black text-amber-400 font-mono">
                {generatedVoucher.voucherData.amount.toFixed(2)} USDT
              </p>
              <p className="text-xs text-slate-400">Token canjeable instantáneamente sin custodio ni comisiones</p>
            </div>

            <button
              onClick={handleCopy}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
            >
              {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
              {copied ? '¡Copiado al Portapapeles!' : 'Copiar Token para Enviar'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
