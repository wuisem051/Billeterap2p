import React, { useState } from 'react';
import { 
  Building2, 
  ArrowLeftRight, 
  PhoneCall, 
  CheckCircle, 
  Clock, 
  Search,
  Filter,
  DollarSign
} from 'lucide-react';

export default function P2pExchange({ rates = { usdRate: 65000, vesRate: 36.5 } }) {
  const [tab, setTab] = useState('sell'); // 'buy' (recargar) | 'sell' (liquidar a Pago Móvil)
  const [orders, setOrders] = useState([
    {
      id: 'ord_101',
      agent: 'CajeroExpress_Ccs',
      reputation: '99.8% (420 ops)',
      type: 'buy', // el cajero compra sats / paga bolívares
      rateVes: 37.10,
      minLimit: 10,
      maxLimit: 250,
      methods: ['Pago Móvil Banesco', 'Mercantil'],
      online: true
    },
    {
      id: 'ord_102',
      agent: 'SatsLiquidity_Vzla',
      reputation: '100% (89 ops)',
      type: 'buy',
      rateVes: 36.95,
      minLimit: 5,
      maxLimit: 120,
      methods: ['Pago Móvil Venezuela', 'Bancaribe'],
      online: true
    },
    {
      id: 'ord_103',
      agent: 'CaracasP2P_Fast',
      reputation: '98.5% (150 ops)',
      type: 'sell', // el cajero vende sats / recibe bolívares
      rateVes: 36.40,
      minLimit: 15,
      maxLimit: 500,
      methods: ['Pago Móvil Todos los Bancos', 'Efectivo USD'],
      online: true
    }
  ]);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderAmountUsd, setOrderAmountUsd] = useState('20');
  const [step, setStep] = useState('list'); // 'list' | 'trade' | 'completed'

  const filteredOrders = orders.filter(o => tab === 'sell' ? o.type === 'buy' : o.type === 'sell');

  return (
    <div className="w-full max-w-md mx-auto space-y-4 pb-24 px-4 animate-fade-in">
      {/* Selector de Operación */}
      <div className="flex bg-slate-900 p-1 rounded-2xl border border-slate-800">
        <button
          onClick={() => { setTab('sell'); setStep('list'); }}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all ${
            tab === 'sell' 
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Retirar a Pago Móvil
        </button>
        <button
          onClick={() => { setTab('buy'); setStep('list'); }}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all ${
            tab === 'buy' 
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Recargar con Pago Móvil
        </button>
      </div>

      {step === 'list' ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Cajeros P2P Disponibles ({filteredOrders.length})</span>
            <span className="text-emerald-400 font-mono">Tasa Promedio: Bs. {rates.vesRate}</span>
          </div>

          {filteredOrders.map((ord) => (
            <div 
              key={ord.id}
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition-all space-y-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="font-bold text-sm text-slate-200">{ord.agent}</span>
                  </div>
                  <span className="text-xs text-slate-500">{ord.reputation}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400">Tasa Cajero</span>
                  <p className="text-base font-extrabold text-emerald-400 font-mono">
                    Bs. {ord.rateVes.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {ord.methods.map((m, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-300 font-medium">
                    {m}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
                <span className="text-slate-500">Límites: ${ord.minLimit} - ${ord.maxLimit} USD</span>
                <button
                  onClick={() => {
                    setSelectedOrder(ord);
                    setStep('trade');
                  }}
                  className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 font-bold transition-all text-xs"
                >
                  {tab === 'sell' ? 'Retirar' : 'Recargar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Pantalla de Orden P2P */
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-200 text-sm">
              Operación con {selectedOrder?.agent}
            </h3>
            <button 
              onClick={() => setStep('list')}
              className="text-xs text-slate-400 hover:text-white"
            >
              Volver
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-slate-400">Monto a Operar en USD</label>
            <input 
              type="number" 
              value={orderAmountUsd}
              onChange={(e) => setOrderAmountUsd(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono font-bold text-lg focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-850 space-y-1 text-xs font-mono">
            <div className="flex justify-between text-slate-400">
              <span>Recibirás aproximadamente:</span>
              <span className="text-emerald-400 font-bold">
                Bs. {((parseFloat(orderAmountUsd) || 0) * (selectedOrder?.rateVes || 1)).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Método:</span>
              <span>Pago Móvil Inmediato</span>
            </div>
          </div>

          <button
            onClick={() => setStep('completed')}
            className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
          >
            Confirmar Orden y Notificar Cajero
          </button>
        </div>
      )}

      {step === 'completed' && (
        <div className="p-6 rounded-3xl bg-emerald-950/80 border border-emerald-500 text-center space-y-3">
          <CheckCircle className="mx-auto text-emerald-400" size={44} />
          <h4 className="font-bold text-white text-base">¡Orden P2P en Proceso!</h4>
          <p className="text-xs text-slate-300">
            El agente ha recibido tu solicitud. El depósito de bolívares se enviará en menos de 5 minutos.
          </p>
          <button 
            onClick={() => setStep('list')}
            className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
          >
            Listo
          </button>
        </div>
      )}
    </div>
  );
}
