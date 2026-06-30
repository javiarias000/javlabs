import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PortalLayout from '../../components/PortalLayout';
import { useAuth } from '../../context/AuthContext';

const WIZARD_URL = import.meta.env.VITE_MARKETING_URL || null;

const MOCK_CAMPAIGNS = [
  { id: 1, name: 'Campaña Verano 2025', status: 'ACTIVE',   reach: 12400, clicks: 874,  conversions: 43, budget: 150 },
  { id: 2, name: 'Lanzamiento Producto',status: 'PAUSED',   reach: 8200,  clicks: 560,  conversions: 28, budget: 80  },
  { id: 3, name: 'Retargeting Clientes', status: 'ACTIVE',  reach: 5100,  clicks: 420,  conversions: 61, budget: 60  },
];

const STATUS_MAP = {
  ACTIVE: { label: 'Activa',    dot: 'bg-emerald-500', text: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  PAUSED: { label: 'Pausada',   dot: 'bg-amber-500',   text: 'text-amber-400',   bg: 'bg-amber-500/10 border-amber-500/20'   },
  ENDED:  { label: 'Terminada', dot: 'bg-slate-500',   text: 'text-slate-400',   bg: 'bg-slate-500/10 border-slate-500/20'   },
};

function WizardPanel() {
  if (!WIZARD_URL) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="size-20 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-amber-400 text-4xl">rocket_launch</span>
        </div>
        <h3 className="text-white font-michroma text-xl mb-3">Wizard de Campañas</h3>
        <p className="text-slate-400 text-sm max-w-md leading-relaxed mb-8">
          El wizard inteligente de Meta Ads te permite crear campañas de Facebook e Instagram paso a paso,
          con asistencia de IA (Claude) y análisis en tiempo real.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 w-full max-w-xl">
          {[
            { icon: 'smart_toy',  label: 'Asistente IA',     desc: 'Claude analiza y sugiere estrategias' },
            { icon: 'campaign',   label: '9 pasos guiados',   desc: 'Desde estrategia hasta publicación' },
            { icon: 'analytics',  label: 'Dashboard real',    desc: 'Métricas en vivo de tus campañas' },
          ].map(f => (
            <div key={f.label} className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-left">
              <span className="material-symbols-outlined text-amber-400 text-2xl mb-2 block">{f.icon}</span>
              <p className="text-white text-xs font-bold mb-1">{f.label}</p>
              <p className="text-slate-500 text-xs">{f.desc}</p>
            </div>
          ))}
        </div>
        <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800 text-left max-w-md">
          <span className="material-symbols-outlined text-primary flex-shrink-0 mt-0.5 text-sm">info</span>
          <p className="text-slate-400 text-xs">
            El wizard se despliega como servicio independiente. Para activarlo configura{' '}
            <code className="text-amber-400 bg-slate-800 px-1 rounded text-[11px]">VITE_MARKETING_URL</code>{' '}
            con la URL del servicio en EasyPanel.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-bold text-sm">Wizard de Campañas Meta Ads</h3>
          <p className="text-slate-500 text-xs mt-0.5">Crea y gestiona campañas con asistencia IA directamente desde aquí</p>
        </div>
        <a
          href={WIZARD_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-bold hover:bg-amber-500/20 transition-all"
        >
          <span className="material-symbols-outlined text-sm">open_in_new</span>
          Abrir en nueva pestaña
        </a>
      </div>
      <div className="rounded-xl overflow-hidden border border-slate-800" style={{ height: '75vh' }}>
        <iframe
          src={WIZARD_URL}
          title="Meta Ads Wizard"
          className="w-full h-full"
          style={{ border: 'none', background: '#0D1B2A' }}
          allow="camera; microphone"
        />
      </div>
    </div>
  );
}

export default function MarketingDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('campaigns');

  const totalReach       = MOCK_CAMPAIGNS.reduce((s, c) => s + c.reach, 0);
  const totalClicks      = MOCK_CAMPAIGNS.reduce((s, c) => s + c.clicks, 0);
  const totalConversions = MOCK_CAMPAIGNS.reduce((s, c) => s + c.conversions, 0);
  const totalBudget      = MOCK_CAMPAIGNS.reduce((s, c) => s + c.budget, 0);
  const avgCPL           = totalConversions > 0 ? (totalBudget / totalConversions).toFixed(2) : '—';

  const TABS = [
    { key: 'campaigns', label: 'Campañas',  icon: 'campaign'     },
    { key: 'wizard',    label: 'Wizard IA', icon: 'smart_toy'    },
    { key: 'reports',   label: 'Reportes',  icon: 'bar_chart'    },
  ];

  return (
    <PortalLayout>
      <div className="p-8 space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-amber-400">campaign</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Marketing Meta</h1>
              <p className="text-slate-400 text-sm">Facebook &amp; Instagram · {user?.company || 'Tu empresa'}</p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('wizard')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-accent text-white text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-primary/20"
          >
            <span className="material-symbols-outlined text-sm">smart_toy</span>
            Crear campaña con IA
          </button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Alcance total',  value: totalReach.toLocaleString(),       icon: 'visibility',      color: 'text-primary'      },
            { label: 'Clics',          value: totalClicks.toLocaleString(),      icon: 'ads_click',       color: 'text-violet-400'   },
            { label: 'Conversiones',   value: totalConversions.toLocaleString(), icon: 'conversion_path', color: 'text-emerald-400'  },
            { label: 'Costo por lead', value: `$${avgCPL}`,                      icon: 'attach_money',    color: 'text-amber-400'    },
          ].map(kpi => (
            <div key={kpi.label} className="bg-slate-900 border border-slate-800 p-5 rounded-xl group hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <p className="text-slate-500 text-xs uppercase tracking-widest font-bold">{kpi.label}</p>
                <span className={`material-symbols-outlined text-xl opacity-40 group-hover:opacity-100 transition-opacity ${kpi.color}`}>{kpi.icon}</span>
              </div>
              <p className={`text-3xl font-bold font-michroma ${kpi.color}`}>{kpi.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-slate-800">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all -mb-px ${
                activeTab === tab.key
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-slate-500 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-base">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Campañas */}
        {activeTab === 'campaigns' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                <h2 className="text-white font-bold text-sm uppercase tracking-wider">Campañas activas</h2>
                <span className="text-xs text-slate-500 uppercase tracking-widest">{MOCK_CAMPAIGNS.length} campañas</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-800/50 text-slate-400 text-[10px] uppercase tracking-widest font-bold">
                    <tr>
                      <th className="px-6 py-4">Campaña</th>
                      <th className="px-6 py-4">Estado</th>
                      <th className="px-6 py-4">Alcance</th>
                      <th className="px-6 py-4">Clics (CTR)</th>
                      <th className="px-6 py-4">Conversiones</th>
                      <th className="px-6 py-4">Presupuesto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {MOCK_CAMPAIGNS.map(c => {
                      const st = STATUS_MAP[c.status] || STATUS_MAP.ENDED;
                      const ctr = c.reach > 0 ? ((c.clicks / c.reach) * 100).toFixed(2) : '0';
                      return (
                        <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="px-6 py-4 text-white font-medium">{c.name}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold uppercase border ${st.bg} ${st.text}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                              {st.label}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-300">{c.reach.toLocaleString()}</td>
                          <td className="px-6 py-4">
                            <span className="text-slate-300">{c.clicks.toLocaleString()}</span>
                            <span className="text-slate-600 text-xs ml-1">({ctr}%)</span>
                          </td>
                          <td className="px-6 py-4 text-emerald-400 font-bold">{c.conversions}</td>
                          <td className="px-6 py-4 text-slate-400">${c.budget}/mes</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Info banner */}
            <div className="flex items-start gap-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
              <span className="material-symbols-outlined text-amber-400 flex-shrink-0 mt-0.5">info</span>
              <div>
                <p className="text-amber-300 text-sm font-bold mb-1">Datos sincronizados desde Meta Business</p>
                <p className="text-slate-500 text-xs">
                  Las métricas se actualizan cada 24 horas. Para cambios urgentes en presupuesto o segmentación,
                  contacta a tu gestor a través de{' '}
                  <button onClick={() => navigate('/soporte')} className="text-amber-400 underline underline-offset-2">Soporte</button>
                  {' '}o usa el{' '}
                  <button onClick={() => setActiveTab('wizard')} className="text-amber-400 underline underline-offset-2">Wizard IA</button>.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Wizard IA */}
        {activeTab === 'wizard' && <WizardPanel />}

        {/* Reportes */}
        {activeTab === 'reports' && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="size-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-amber-400 text-3xl">bar_chart</span>
            </div>
            <h3 className="text-white font-michroma text-lg mb-2">Reportes en preparación</h3>
            <p className="text-slate-500 text-sm max-w-sm">
              Los reportes detallados de rendimiento estarán disponibles en el próximo ciclo de facturación.
            </p>
            <button
              onClick={() => navigate('/soporte')}
              className="mt-6 px-5 py-2 rounded-lg border border-slate-700 text-slate-400 text-sm hover:border-amber-500/40 hover:text-amber-400 transition-all"
            >
              Solicitar reporte manual
            </button>
          </div>
        )}

      </div>
    </PortalLayout>
  );
}
