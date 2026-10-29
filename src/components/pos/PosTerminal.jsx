import React, { useState } from 'react';
import { 
  Delete, 
  RotateCcw, 
  CheckCircle2, 
  QrCode, 
  Loader2, 
  X
} from 'lucide-react';
import QRCode from 'react-qr-code';
import { generatePosInvoice } from '../../utils/cryptoUtils';
import { playSuccessSound } from '../../utils/soundUtils';

export default function PosTerminal({ 
  rates = { vesRate: 36.80 },
  merchantName = "Punto de Venta P2P"
}) {
  const [inputAmount, setInputAmount] = useState('0');
  const [currencyMode, setCurrencyMode] = useState('USDT'); // 'USDT' | 'VES'
  const [activeInvoice, setActiveInvoice] = useState(null);
  const [invoiceStatus, setInvoiceStatus] = useState('idle');

  const numericAmount = parseFloat(inputAmount) || 0;
  
  // Si cobra en USDT: monto en USDT es directo. Si cobra en VES: se divide entre la tasa
  const amountInUsdt = currencyMode === 'USDT'
    ? numericAmount 
    : numericAmount / (rates.vesRate || 1);

  // Equivalente en Bolívares
  const amountInVes = currencyMode === 'VES' 
    ? numericAmount 
    : (numericAmount * rates.vesRate);

  const handleKeyPress = (val) => {
    if (val === 'C') {
      setInputAmount('0');
      return;
    }
    if (val === 'backspace') {
      setInputAmount((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'));
      return;
    }
    if (val === '.') {
      if (!inputAmount.includes('.')) {
        setInputAmount((prev) => prev + '.');
      }
      return;
    }
    setInputAmount((prev) => (prev === '0' ? val : prev + val));
  };

  const handleGenerateInvoice = async () => {
    if (numericAmount <= 0) return;
    
    const invoice = await generatePosInvoice(
      amountInUsdt.toFixed(2),
      `Cobro en ${merchantName}`
    );

    setActiveInvoice(invoice);
    setInvoiceStatus('waiting');

    // Simulación de cobro instantáneo (<4s)
    setTimeout(() => {
      setInvoiceStatus('success');
      playSuccessSound();
    }, 3800);
  };

  const handleReset = () => {
    setInputAmount('0');
    setActiveInvoice(null);
    setInvoiceStatus('idle');
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 flex flex-col justify-between min-h-[82vh]">
      {/* Cabecera del Comercio */}
      <div className="text-center space-y-1 mb-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          Terminal PoS Activa (USDT)
        </div>
        <h2 className="text-lg font-bold text-slate-100">{merchantName}</h2>
      </div>

      {/* Display Principal */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-6 text-center shadow-xl">
        <div className="flex justify-center gap-2 mb-3">
          <button 
            onClick={() => setCurrencyMode('USDT')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              currencyMode === 'USDT' 
                ? 'bg-emerald-500 text-slate-950 shadow-md' 
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            USDT ($)
          </button>
          <button 
            onClick={() => setCurrencyMode('VES')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              currencyMode === 'VES' 
                ? 'bg-emerald-500 text-slate-950 shadow-md' 
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Bolívares (Bs)
          </button>
        </div>

        <div className="text-5xl font-extrabold text-white font-mono tracking-tight my-2">
          {currencyMode === 'USDT' ? '$ ' : 'Bs. '}
          {inputAmount}
        </div>

        {/* Equivalencia Directa USDT <-> VES */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800/80 text-xs font-mono">
          <div className="text-slate-400">
            Total a Cobrar: <span className="text-emerald-400 font-bold">{amountInUsdt.toFixed(2)} USDT</span>
          </div>
          <div className="text-slate-400">
            {currencyMode === 'USDT' ? `≈ Bs. ${amountInVes.toFixed(2)}` : `≈ ${amountInUsdt.toFixed(2)} USDT`}
          </div>
        </div>
      </div>

      {/* Teclado Numérico */}
      <div className="grid grid-cols-3 gap-2.5 my-4">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'backspace'].map((key) => (
          <button
            key={key}
            onClick={() => handleKeyPress(key)}
            className="h-16 rounded-2xl bg-slate-900 border border-slate-850 hover:bg-slate-800 active:scale-95 text-xl font-bold text-slate-200 transition-all flex items-center justify-center shadow-sm"
          >
            {key === 'backspace' ? <Delete size={22} className="text-slate-400" /> : key}
          </button>
        ))}
      </div>

      {/* Botones de Cobro */}
      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={() => handleKeyPress('C')}
          className="col-span-1 h-14 rounded-2xl bg-slate-850 border border-slate-800 text-slate-400 hover:text-white font-bold flex items-center justify-center"
        >
          <RotateCcw size={20} />
        </button>
        <button
          onClick={handleGenerateInvoice}
          disabled={numericAmount <= 0}
          className="col-span-3 h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:pointer-events-none text-slate-950 font-extrabold text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
        >
          <QrCode size={20} />
          Cobrar con QR USDT
        </button>
      </div>

      {/* MODAL COBRO DINÁMICO */}
      {activeInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`w-full max-w-sm rounded-3xl p-6 border transition-all duration-300 ${
            invoiceStatus === 'success' 
              ? 'bg-emerald-950/90 border-emerald-500 shadow-2xl shadow-emerald-500/40' 
              : 'bg-slate-900 border-slate-800'
          }`}>
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Factura #{activeInvoice.invoiceId.slice(-6)}
              </span>
              <button 
                onClick={handleReset}
                className="p-1 rounded-lg text-slate-400 hover:text-white bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            {invoiceStatus === 'waiting' ? (
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-white rounded-2xl shadow-inner flex items-center justify-center">
                  <QRCode
                    size={200}
                    value={activeInvoice.payloadString}
                    viewBox={`0 0 256 256`}
                  />
                </div>

                <div className="text-center">
                  <p className="text-3xl font-black text-white font-mono">
                    {activeInvoice.amountUsdt.toFixed(2)} <span className="text-emerald-400">USDT</span>
                  </p>
                  <p className="text-slate-400 font-mono text-xs mt-1">
                    ≈ Bs. {(activeInvoice.amountUsdt * (rates.vesRate || 1)).toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-slate-400 text-xs animate-pulse">
                  <Loader2 size={16} className="animate-spin text-emerald-400" />
                  <span>Esperando pago del cliente...</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center py-6 space-y-4 text-center animate-scale-up">
                <div className="w-20 h-20 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/50">
                  <CheckCircle2 size={48} className="stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">¡PAGO RECIBIDO!</h3>
                  <p className="text-emerald-300 font-mono text-xl font-bold mt-1">
                    +{activeInvoice.amountUsdt.toFixed(2)} USDT
                  </p>
                  <p className="text-xs text-emerald-400/80 mt-1">
                    Acreditado instantáneamente en la bóveda
                  </p>
                </div>

                <button
                  onClick={handleReset}
                  className="w-full mt-4 py-3 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold transition-all shadow-md active:scale-95"
                >
                  Nuevo Cobro
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
