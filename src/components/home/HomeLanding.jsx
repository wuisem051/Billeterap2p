import React from 'react';
import { 
  Zap, 
  ShieldCheck, 
  EyeOff, 
  Coins, 
  QrCode, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  Smartphone, 
  Users, 
  Store,
  Sparkles,
  Percent,
  Banknote
} from 'lucide-react';

export default function HomeLanding({ onLaunchApp }) {
  const benefits = [
    {
      icon: <EyeOff className="text-emerald-400" size={26} />,
      title: "100% Sin KYC ni Registro",
      desc: "Sin correos, sin números de teléfono ni datos personales. Entras y operas de inmediato con soberanía total."
    },
    {
      icon: <Lock className="text-teal-400" size={26} />,
      title: "Bóveda No Custodia Cifrada",
      desc: "Tus llaves privadas se cifran localmente en tu navegador con AES-256 (Web Crypto API) protegido por tu PIN personal."
    },
    {
      icon: <Zap className="text-amber-400" size={26} />,
      title: "Cobros PoS Instantáneos (< 1s)",
      desc: "Modo Punto de Venta optimizado para cajas de comercios. QR dinámicos con alerta sonora y visual inmediata."
    },
    {
      icon: <Sparkles className="text-cyan-400" size={26} />,
      title: "Vales Off-Chain Cero Gas",
      desc: "Genera cupones y vales digitales en USDT tipo Cashu para enviar o pagar en segundos sin comisiones de red."
    },
    {
      icon: <Banknote className="text-emerald-400" size={26} />,
      title: "Equivalencia en Vivo USDT / VES",
      desc: "Calculadora automática de cambio con tasas locales para que clientes y comerciantes sepan el valor exacto en Bolívares."
    },
    {
      icon: <Users className="text-violet-400" size={26} />,
      title: "Red de Cajeros P2P",
      desc: "Liquidez local instantánea para recargar o retirar saldo a Pago Móvil y efectivo mediante agentes locales."
    }
  ];

  const useCases = [
    {
      role: "Para Usuarios / Personas",
      badge: "Billetera Móvil",
      points: [
        "Pagar en comercios escaneando un QR en 2 segundos.",
        "Enviar saldo a amigos mediante vales o enlaces sin pagar comisiones.",
        "Respaldo y desbloqueo local mediante PIN de 4-6 dígitos."
      ],
      action: "wallet",
      cta: "Abrir Billetera"
    },
    {
      role: "Para Comercios y Negocios",
      badge: "Punto de Venta (PoS)",
      points: [
        "Teclado numérico táctil optimizado para velocidad en caja.",
        "Generación automática de factura con QR dinámico.",
        "Campana sonora y pantalla verde de confirmación instantánea."
      ],
      action: "pos",
      cta: "Abrir Terminal PoS"
    },
    {
      role: "Para Cajeros y Agentes",
      badge: "Liquidez P2P",
      points: [
        "Tablero de órdenes de compra y venta de USDT.",
        "Liquidación directa hacia cuentas de Pago Móvil.",
        "Gana márgenes de comisión ofreciendo liquidez de efectivo."
      ],
      action: "p2p",
      cta: "Ir a Cajeros P2P"
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-20 space-y-16 animate-fade-in text-slate-200">
      
      {/* HERO SECTION */}
      <section className="text-center pt-6 pb-4 space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wide">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Web3 PWA • Sin Custodios • Pagos Instantáneos
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
          La billetera no custodia de <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            pagos rápidos en USDT
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-400 leading-relaxed">
          Diseñada para comercios y personas en economías dinámicas. Cobra y paga al instante en 
          <strong> USDT y Bolívares</strong> sin bancos, sin registro de identidad y sin demoras.
        </p>

        {/* Botones de Entrada Rápida */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onLaunchApp('wallet')}
            className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm transition-all shadow-xl shadow-emerald-500/25 active:scale-95 flex items-center gap-2 group"
          >
            <span>Lanzar Billetera</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button
            onClick={() => onLaunchApp('pos')}
            className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-200 font-bold text-sm transition-all active:scale-95 flex items-center gap-2"
          >
            <Store size={18} className="text-emerald-400" />
            <span>Modo Punto de Venta</span>
          </button>
        </div>
      </section>

      {/* MÉTRICAS / PILARES CLAVE */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-center">
          <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono">&lt; 1s</p>
          <p className="text-xs text-slate-400 mt-1">Velocidad de Cobro</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-center">
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">0%</p>
          <p className="text-xs text-slate-400 mt-1">Gas / Comisiones Internas</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-center">
          <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono">AES-256</p>
          <p className="text-xs text-slate-400 mt-1">Cifrado de Grado Militar</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-center">
          <p className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">0 KYC</p>
          <p className="text-xs text-slate-400 mt-1">Privacidad Garantizada</p>
        </div>
      </section>

      {/* CUALIDADES Y BENEFICIOS */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">¿Por qué usar esta plataforma?</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            Combina la soberanía del dinero en efectivo con la conveniencia de los pagos digitales instantáneos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {benefits.map((b, idx) => (
            <div 
              key={idx}
              className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-900 transition-all space-y-3"
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-800/60 flex items-center justify-center">
                {b.icon}
              </div>
              <h3 className="font-bold text-base text-slate-100">{b.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CASOS DE USO SEGÚN ROL */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Tres modos en una sola aplicación</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Alterna sin complicaciones entre billetera personal, punto de venta y módulo P2P.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {useCases.map((uc, i) => (
            <div 
              key={i}
              className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-bold uppercase tracking-wider">
                  {uc.badge}
                </span>
                <h3 className="font-bold text-lg text-white">{uc.role}</h3>
                <ul className="space-y-2 pt-2">
                  {uc.points.map((pt, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs text-slate-400">
                      <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => onLaunchApp(uc.action)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 font-bold text-xs text-slate-200 transition-all active:scale-95"
              >
                {uc.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* BANNER DE SEGURIDAD Y PRIVACIDAD */}
      <section className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/50 border border-slate-800 relative overflow-hidden">
        <div className="max-w-xl space-y-3 relative z-10">
          <div className="flex items-center gap-2 text-emerald-400">
            <ShieldCheck size={24} />
            <span className="font-bold text-sm uppercase tracking-wider">Seguridad Soberana</span>
          </div>
          <h3 className="text-2xl font-black text-white">Tus llaves, tu dinero, tu control</h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            A diferencia de las plataformas tradicionales o exchanges centralizados, tus fondos nunca tocan 
            nuestros servidores. Tu saldo se almacena únicamente en tu dispositivo, respaldado por algoritmos 
            criptográficos abiertos.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onLaunchApp('wallet')}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-95"
            >
              Comenzar Ahora Mismo
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
