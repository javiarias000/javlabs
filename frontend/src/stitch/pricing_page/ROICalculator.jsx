import { useState } from 'react';

export default function ROICalculator() {
  const [saleVal, setSaleVal]           = useState(50);
  const [extraSales, setExtraSales]     = useState(15);
  const [interactions, setInteractions] = useState(1000);
  const [channels, setChannels]         = useState(1);
  const [open, setOpen]                 = useState(false);

  const plans = [
    { id: 'basico', name: 'Básico',      monthly: 72, setup: 210,  maxInteractions: 1000,  maxChannels: 1, hoursSaved: 15 },
    { id: 'pro',    name: 'Profesional', monthly: 150, setup: 420,  maxInteractions: 5000,  maxChannels: 3, hoursSaved: 40 },
    { id: 'emp',    name: 'Empresarial', monthly: 240, setup: 720,  maxInteractions: 20000, maxChannels: 99, hoursSaved: 80 },
  ];

  const fmt = (n) => '$' + Math.round(Math.abs(n)).toLocaleString('es');
  const extraRevenue = saleVal * extraSales;

  const calcFit = (plan) => {
    const interOk = interactions <= plan.maxInteractions;
    const chanOk  = channels <= plan.maxChannels;
    if (interOk && chanOk) return 'ok';
    if (!interOk || !chanOk) return 'bad';
    return 'warn';
  };

  // Calcular valor del tiempo ahorrado (horas * valor promedio hora en LATAM ~$15-25)
  const avgHourlyValue = saleVal > 0 ? 15 : 0; // Valor conservador de hora de trabajo
  const timeSavedValue = (plan) => plan.hoursSaved * avgHourlyValue;
  const totalROI = (plan) => extraRevenue + timeSavedValue(plan) - plan.monthly;

  const eligible = plans.filter(p => calcFit(p) !== 'bad');
  const recommended = eligible.length > 0
    ? eligible.reduce((a, b) => (extraRevenue - a.monthly) >= (extraRevenue - b.monthly) ? a : b)
    : null;

  const SliderRow = ({ label, value, min, max, step, onChange, display }) => (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-5">
      <span className="text-slate-400 text-sm font-montserrat sm:w-48 md:w-64 flex-shrink-0">{label}</span>
      <div className="flex-1 flex items-center gap-3">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(+e.target.value)}
          className="flex-1 accent-primary h-2"
        />
        <span className="text-white text-sm font-bold font-montserrat min-w-[60px] sm:min-w-[80px] text-right whitespace-nowrap">
          {display}
        </span>
      </div>
    </div>
  );

  return (
    <div className="mt-16">
      {/* Trigger bar */}
      <div className="p-6 rounded-xl border border-slate-800 bg-navy-darker/50 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-primary">payments</span>
          </div>
          <div>
            <p className="text-white font-michroma text-sm uppercase">¿Realmente vale la pena?</p>
            <p className="text-slate-400 text-xs font-montserrat mt-1">
              El sistema cuesta <span className="text-primary font-bold">$72-240/mes</span>. Si te libera 15-80 horas,
              el ahorro en tu tiempo vale <span className="text-green-400 font-bold">$450-2,400/mes</span>.
            </p>
          </div>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="flex-shrink-0 px-8 py-3 text-sm font-bold uppercase tracking-widest text-white rounded hover:opacity-90 transition-all font-montserrat whitespace-nowrap flex items-center gap-2"
          style={{ background: 'linear-gradient(90deg, #0d7ff2, #8b5cf6)' }}>
          <span className="material-symbols-outlined text-sm">calculate</span>
          Ver Mi ROI
          <span className="material-symbols-outlined text-sm">{open ? 'expand_less' : 'expand_more'}</span>
        </button>
      </div>

      {/* Calculator panel */}
      {open && (
        <div className="mt-4 p-8 rounded-xl border border-slate-800 bg-navy-darker">

          {/* Explanation */}
          <div className="mb-8 p-4 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-slate-300 text-sm font-montserrat leading-relaxed">
              <span className="text-primary font-bold">¿Cómo calculamos el ahorro?</span>{' '}
              El sistema automatizado recupera horas de trabajo manual que puedes dedicar a vender o crecer.
              <br/><br/>
              <strong className="text-white">Ejemplo real:</strong> Si tu tiempo vale $30/hora y el sistema te libera 40 horas/mes (plan Profesional),
              eso es <span className="text-green-400 font-bold">$1,200 en valor</span>. El plan cuesta $150/mes.
              Tu ganancia neta: <span className="text-primary font-bold">$1,050/mes</span>. ROI: <span className="text-green-400 font-bold">700%</span>.
            </p>
          </div>

          {/* Sliders */}
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 font-montserrat mb-6">Calcula tu ahorro mensual</p>
          <SliderRow
            label="¿Cuánto vale cada venta o cita que generas?"
            value={saleVal} min={10} max={1000} step={10}
            onChange={setSaleVal}
            display={fmt(saleVal)}
          />
          <SliderRow
            label="¿Ventas/citas adicionales que el sistema te traería?"
            value={extraSales} min={1} max={100} step={1}
            onChange={setExtraSales}
            display={extraSales}
          />
          <SliderRow
            label="¿Cuántas interacciones (mensajes, consultas) recibes al mes?"
            value={interactions} min={100} max={20000} step={100}
            onChange={setInteractions}
            display={interactions.toLocaleString('es')}
          />
          <SliderRow
            label="¿En cuántos canales te contactan clientes?"
            value={channels} min={1} max={3} step={1}
            onChange={setChannels}
            display={channels === 1 ? '1 canal' : channels === 2 ? '2 canales' : '3+ canales'}
          />

          {/* Summary metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
            {[
              { label: 'Ingresos extra por mes',          value: fmt(extraRevenue),                                      color: 'text-green-400' },
              { label: 'Plan que más te conviene',         value: recommended ? recommended.name : 'Ninguno cubre',       color: 'text-primary'   },
              { label: 'Meses para recuperar la inversión',value: recommended && (extraRevenue - recommended.monthly) > 0
                  ? Math.ceil(recommended.setup / (extraRevenue - recommended.monthly)) + ' meses'
                  : '—',                                                                                                  color: 'text-white'     },
            ].map(m => (
              <div key={m.label} className="bg-background-dark rounded-lg p-4 border border-slate-800">
                <p className="text-slate-500 text-xs font-montserrat uppercase tracking-widest mb-2">{m.label}</p>
                <p className={`font-michroma text-2xl ${m.color}`}>{m.value}</p>
              </div>
            ))}
          </div>

          {/* Plan cards */}
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 font-montserrat mb-6">Comparativa por plan</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map(plan => {
              const fit      = calcFit(plan);
              const timeVal  = timeSavedValue(plan);
              const totalRoi = totalROI(plan);
              const payback  = totalRoi > 0 ? Math.ceil(plan.setup / totalRoi) : null;
              const isRec    = recommended?.id === plan.id;

              const fitConfig = {
                ok:   { cls: 'bg-green-900/30 text-green-400 border-green-800',   icon: 'check_circle', txt: 'Cubre tus necesidades' },
                warn: { cls: 'bg-yellow-900/30 text-yellow-400 border-yellow-800', icon: 'warning',      txt: 'Cubre parcialmente'    },
                bad:  { cls: 'bg-red-900/30 text-red-400 border-red-800',          icon: 'cancel',       txt: 'No cubre tus límites'  },
              }[fit];

              return (
                <div key={plan.id}
                  className="rounded-xl p-6 border transition-all duration-300"
                  style={isRec
                    ? { background: 'linear-gradient(135deg, #0d1b2a, #0d2a4a)', border: '1px solid rgba(13,127,242,0.5)', boxShadow: '0 0 30px rgba(13,127,242,0.1)' }
                    : { background: '#0a1628', border: '1px solid #1e293b' }}>

                  {isRec && (
                    <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white mb-4 font-montserrat"
                      style={{ background: 'linear-gradient(90deg, #0d7ff2, #8b5cf6)' }}>
                      <span className="material-symbols-outlined text-xs">star</span>
                      Recomendado para ti
                    </div>
                  )}

                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest font-montserrat">{plan.name}</p>
                  <p className="font-michroma text-2xl text-white mt-1">${plan.monthly}<span className="text-slate-500 text-sm font-montserrat">/mes</span></p>
                  <p className="text-slate-600 text-xs font-montserrat mt-1 mb-4">+ ${plan.setup.toLocaleString('es')} setup</p>

                  <div className="h-px bg-slate-800 mb-4" />

                  {/* Lo que ganas */}
                  <p className="text-slate-500 text-xs font-montserrat mb-1">Valor que obtienes / mes</p>
                  <p className="font-michroma text-lg text-green-400 mb-1">
                    +{fmt(extraRevenue)} (ventas extra)
                  </p>
                  <p className="font-michroma text-lg text-white mb-2">
                    +{fmt(timeVal)} (tiempo liberado)
                  </p>
                  <p className="text-slate-400 text-xs mb-3">{plan.hoursSaved}+ horas libres/mes</p>

                  <p className={`font-michroma text-xl ${totalRoi >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {totalRoi >= 0 ? '+' : '-'}{fmt(totalRoi)}
                  </p>
                  <p className="text-slate-500 text-xs font-montserrat mt-1">
                    Ganancia neta después del plan
                  </p>

                  {payback ? (
                    <p className="text-slate-500 text-xs font-montserrat mt-2">
                      Recuperas el setup en <span className="text-white font-bold">{payback} {payback === 1 ? 'mes' : 'meses'}</span>
                    </p>
                  ) : (
                    <p className="text-red-400 text-xs font-montserrat mt-2">El ROI mensual es negativo</p>
                  )}

                  <div className={`mt-4 flex items-center gap-2 text-xs font-montserrat px-3 py-2 rounded-lg border ${fitConfig.cls}`}>
                    <span className="material-symbols-outlined text-sm">{fitConfig.icon}</span>
                    {fitConfig.txt}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
