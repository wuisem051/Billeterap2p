import React, { useState } from 'react';
import { X, ArrowUpRight, AlertCircle, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { SUPPORTED_ASSETS } from '../../utils/cryptoAssets';

export default function WithdrawCryptoModal({ isOpen, onClose, balances, onWithdrawSuccess, rates }) {
  const [selectedSymbol, setSelectedSymbol] = useState('USDT');
  const [targetAddress, setTargetAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const asset = SUPPORTED_ASSETS.find(a => a.symbol === selectedSymbol) || SUPPORTED_ASSETS[0];
  const userBalance = balances[selectedSymbol] || 0;

  const handleWithdraw = async (e) => {
    e.preventDefault();
    setError('');

    const numAmount = parseFloat(amount);
    if (!targetAddress || targetAddress.length < 10) {
      setError('Por favor ingresa una dirección de destino válida.');
      return;
    }
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Ingresa un monto válido mayor a 0.');
      return;
    }
    if (numAmount < parseFloat(asset.minWithdraw)) {
      setError(`El retiro mínimo es de ${asset.minWithdraw} ${asset.symbol}`);
      return;
    }
    if (numAmount > userBalance) {
      setError('Saldo insuficiente en tu billetera para este retiro.');
      return;
    }

    setLoading(true);

    // Simulación de broadcast a la red blockchain
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      if (onWithdrawSuccess) {
        onWithdrawSuccess(selectedSymbol, numAmount);
      }
    }, 2000);
  };

  const handleReset = () => {
    setSuccess(false);
    setAmount('');
    setTargetAddress('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl relative">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <ArrowUpRight size={18} />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">Retirar Criptomonedas</h3>
              <p className="text-[11px] text-slate-400">Envío directo on-chain</p>
            </div>
          </div>
          <button onClick={handleReset} className="p-1 rounded-lg text-slate-400 hover:text-white bg-slate-800">
            <X size={16} />
          </button>
        </div>

        {!success ? (
          <form onSubmit={handleWithdraw} className="space-y-4">
            {/* Selector de Moneda */}
            <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-850">
              {SUPPORTED_ASSETS.map((a) => (
                <button
                  type="button"
                  key={a.symbol}
                  onClick={() => { setSelectedSymbol(a.symbol); setAmount(''); setError(''); }}
                  className={`py-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-0.5 ${
                    selectedSymbol === a.symbol
                      ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>{a.symbol}</span>
                </button>
              ))}
            </div>

            {/* Saldo Disponible */}
            <div className="flex justify-between items-center text-xs text-slate-400 px-1">
              <span>Disponible:</span>
              <span className="font-mono font-bold text-white">
                {userBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })} {asset.symbol}
              </span>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Dirección de Destino */}
            <div>
              <label className="text-xs text-slate-400 block mb-1">
                Dirección de Destino ({asset.network})
              </label>
              <input
                type="text"
                placeholder={`Ej: ${asset.address.slice(0, 12)}...`}
                value={targetAddress}
                onChange={(e) => setTargetAddress(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-rose-500"
                required
              />
            </div>

            {/* Monto */}
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <label>Monto a Retirar</label>
                <button
                  type="button"
                  onClick={() => setAmount(userBalance.toString())}
                  className="text-emerald-400 hover:underline font-bold"
                >
                  Máximo
                </button>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-base font-bold text-white font-mono focus:outline-none focus:border-rose-500"
                  required
                />
                <span className="absolute right-3.5 top-3 text-xs font-bold text-slate-400">
                  {asset.symbol}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 font-mono">
                Comisión de Red: {asset.fee} • Mínimo: {asset.minWithdraw} {asset.symbol}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-rose-500 hover:bg-rose-400 disabled:opacity-50 text-slate-950 font-extrabold text-sm transition-all shadow-lg shadow-rose-500/20 active:scale-95 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <span>Confirmar y Retirar {asset.symbol}</span>
              )}
            </button>
          </form>
        ) : (
          <div className="py-6 text-center space-y-4 animate-scale-up">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 size={40} />
            </div>
            <div>
              <h4 className="text-xl font-black text-white">¡Retiro Enviado!</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Tu transacción de <strong>{amount} {asset.symbol}</strong> ha sido transmitida a la red blockchain con éxito.
              </p>
            </div>
            <button
              onClick={handleReset}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all"
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
