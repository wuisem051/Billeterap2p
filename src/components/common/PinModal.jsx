import React, { useState } from 'react';
import { Lock, KeyRound, ShieldAlert } from 'lucide-react';
import { saveVault, loadVault, hasVault } from '../../utils/cryptoUtils';

export default function PinModal({ isOpen, onSuccess }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const isFirstTime = !hasVault();

  if (!isOpen) return null;

  const handleKeyPress = (digit) => {
    if (pin.length < 6) {
      setPin(prev => prev + digit);
      setError('');
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
  };

  const handleConfirm = async () => {
    if (pin.length < 4) {
      setError('El PIN debe tener al menos 4 dígitos');
      return;
    }

    try {
      if (isFirstTime) {
        // Inicializar bóveda por defecto
        const initialData = {
          seed: window.crypto.randomUUID(),
          balanceSats: 150000,
          created: Date.now()
        };
        await saveVault(initialData, pin);
        onSuccess(initialData);
      } else {
        const vault = await loadVault(pin);
        onSuccess(vault);
      }
    } catch (err) {
      setError('PIN Incorrecto');
      setPin('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-lg flex items-center justify-center p-4">
      <div className="w-full max-w-xs rounded-3xl bg-slate-900 border border-slate-800 p-6 text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center">
          <KeyRound size={28} />
        </div>

        <div>
          <h3 className="font-extrabold text-white text-lg">
            {isFirstTime ? 'Crea tu PIN de Bóveda' : 'Ingresa tu PIN'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {isFirstTime ? 'Protegerá tus llaves con cifrado AES-256 local' : 'Desbloquea tu saldo no custodio'}
          </p>
        </div>

        {/* Círculos de estado de PIN */}
        <div className="flex justify-center gap-3 my-2">
          {[0, 1, 2, 3, 4, 5].map((idx) => (
            <div
              key={idx}
              className={`w-3.5 h-3.5 rounded-full transition-all ${
                pin.length > idx 
                  ? 'bg-emerald-400 scale-110 shadow-md shadow-emerald-500/30' 
                  : 'bg-slate-800 border border-slate-700'
              }`}
            />
          ))}
        </div>

        {error && (
          <p className="text-xs font-semibold text-rose-400 flex items-center justify-center gap-1">
            <ShieldAlert size={14} /> {error}
          </p>
        )}

        {/* Teclado */}
        <div className="grid grid-cols-3 gap-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((k) => (
            <button
              key={k}
              onClick={() => {
                if (k === 'C') setPin('');
                else if (k === '⌫') handleDelete();
                else handleKeyPress(k);
              }}
              className="h-12 rounded-xl bg-slate-850 hover:bg-slate-800 text-lg font-bold text-slate-200 transition-all active:scale-95 flex items-center justify-center"
            >
              {k}
            </button>
          ))}
        </div>

        <button
          onClick={handleConfirm}
          disabled={pin.length < 4}
          className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-extrabold text-sm transition-all"
        >
          {isFirstTime ? 'Guardar y Entrar' : 'Desbloquear'}
        </button>
      </div>
    </div>
  );
}
