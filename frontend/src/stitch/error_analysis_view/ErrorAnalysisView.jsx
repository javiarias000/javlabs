import { useNavigate } from 'react-router-dom';
import PortalLayout from '../../components/PortalLayout';
import './ErrorAnalysisView.css';

export default function ErrorAnalysisView() {
  const navigate = useNavigate();
  return (
    <PortalLayout>
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden technical-grid">
        <main className="flex-1 flex flex-col p-8 gap-8 max-w-[1600px] mx-auto w-full">

          <div className="flex flex-col gap-2">
            <h1 className="font-michroma text-4xl text-slate-100 tracking-tight uppercase">Análisis de Incidencias</h1>
            <div className="flex items-center gap-4">
              <span className="h-px w-12 bg-primary"></span>
              <p className="text-slate-500 text-xs uppercase tracking-[0.2em]">Technical precision error tracking for JAV LABS automation.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-navy-muted border-l-4 border-primary p-6 flex flex-col gap-1 hover:bg-slate-900 transition-colors">
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Tasa de Error</span>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-slate-100">0.2%</span>
                <span className="text-emerald-500 text-xs mb-1">▼ 0.05%</span>
              </div>
              <div className="w-full bg-slate-800 h-1 mt-4"><div className="bg-primary h-full w-[0.2%]"></div></div>
            </div>
            <div className="bg-navy-muted border-l-4 border-slate-700 p-6 flex flex-col gap-1 hover:bg-slate-900 transition-colors">
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Promedio de Resolución</span>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-slate-100">14m 30s</span>
              </div>
              <div className="w-full bg-slate-800 h-1 mt-4"><div className="bg-slate-600 h-full w-[45%]"></div></div>
            </div>
            <div className="bg-navy-muted border-l-4 border-error-glow p-6 flex flex-col gap-1 hover:bg-slate-900 transition-colors">
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Alertas Críticas</span>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-slate-100">2 Active</span>
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error-glow opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-error-glow"></span>
                </span>
              </div>
              <div className="w-full bg-slate-800 h-1 mt-4"><div className="bg-error-glow h-full w-full"></div></div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 items-start">
            <div className="lg:col-span-4 flex flex-col gap-4">
              <h3 className="font-michroma text-[10px] text-slate-500 uppercase tracking-widest mb-2">Real-time Pings</h3>
              <div className="flex flex-col border-l border-slate-800 ml-3">
                {[
                  { title: 'Error de Conexión API', time: '10:45:02:445', msg: 'Critical timeout detected on gateway-cluster-04. Retrying in 500ms...', tag: 'Critical', id: '0x992B', active: true },
                  { title: 'Timeout en Base de Datos', time: '10:42:15:102', msg: 'Latency threshold exceeded (>2500ms). DB Node 02 reported congestion.', tag: 'Network', id: '0x110F', active: true },
                  { title: 'Ping Exitoso', time: '10:35:00:000', msg: 'System heartbeat acknowledged. All services reporting nominal status.', tag: null, id: null, active: false },
                  { title: 'Autenticación Bypass', time: '10:30:12:881', msg: '', tag: null, id: null, active: false },
                ].map((item, i) => (
                  <div key={i} className={`relative pl-8 pb-8 group ${!item.active ? 'opacity-60 hover:opacity-100 transition-opacity' : ''}`}>
                    <div className={`absolute left-[-6px] top-1 rotate-45 ${item.active ? 'w-3 h-3 bg-primary glow-diamond' : 'w-2 h-2 bg-slate-600'}`}></div>
                    <div className={`p-4 border ${item.active ? 'bg-navy-muted/50 border-primary/30' : 'bg-transparent border-slate-800'}`}>
                      <div className="flex justify-between items-start mb-1">
                        <span className={`text-xs font-bold uppercase tracking-tighter ${item.active ? 'text-primary' : 'text-slate-300'}`}>{item.title}</span>
                        <span className="text-[10px] font-mono text-slate-500 tracking-tighter">{item.time}</span>
                      </div>
                      {item.msg && <p className="text-[11px] text-slate-400 font-mono leading-relaxed">{item.msg}</p>}
                      {item.tag && (
                        <div className="mt-3 flex gap-2">
                          <span className="px-2 py-0.5 bg-primary/10 text-primary text-[9px] font-bold uppercase tracking-widest border border-primary/20">{item.tag}</span>
                          <span className="px-2 py-0.5 bg-slate-800 text-slate-400 text-[9px] font-bold uppercase tracking-widest border border-slate-700 font-mono">ID: {item.id}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6 flex flex-col gap-4 h-full">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-michroma text-[10px] text-slate-500 uppercase tracking-widest">Technical View: Input vs Output</h3>
                <div className="flex gap-4">
                  <span className="flex items-center gap-2 text-[9px] text-emerald-500 uppercase font-bold"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Live Stream</span>
                  <span className="flex items-center gap-2 text-[9px] text-slate-500 uppercase font-bold">Node: EU-WEST-1</span>
                </div>
              </div>
              <div className="flex flex-col border border-slate-800 bg-background-dark h-[600px] overflow-hidden">
                <div className="flex divide-x divide-slate-800 border-b border-slate-800 bg-navy-muted">
                  <div className="flex-1 px-4 py-2 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Request Body (Input)</span>
                    <span className="material-symbols-outlined text-sm text-slate-600">code</span>
                  </div>
                  <div className="flex-1 px-4 py-2 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Server Response (Output)</span>
                    <span className="material-symbols-outlined text-sm text-primary">error</span>
                  </div>
                </div>
                <div className="flex-1 flex divide-x divide-slate-800 font-mono text-xs overflow-y-auto">
                  <div className="flex-1 bg-background-dark p-4">
                    <pre className="text-slate-300 text-[11px] leading-relaxed">{`{
  "header": {
    "agent": "JAV_LABS_AUTO",
    "version": "4.0.1"
  },
  "payload": {
    "task_id": "TX-9902",
    "action": "DEPLOY_SEQUENCE",
    "params": {
      "retry": true,
      "timeout": 5000
    }
  }
}`}</pre>
                  </div>
                  <div className="flex-1 bg-navy-muted/30 p-4 relative">
                    <pre className="text-slate-300 text-[11px] leading-relaxed relative z-10">{`HTTP/1.1 504 Gateway Timeout
Content-Type: application/json
{
  "error": "UPSTREAM_TIMEOUT",
  "message": "Request to node-02
  timed out after 5000ms.",
  "trace_id": "jav-778-992-aa"
}`}</pre>
                    <div className="absolute inset-0 bg-primary/5 pointer-events-none"></div>
                  </div>
                </div>
                <div className="bg-navy-muted border-t border-slate-800 px-4 py-2 flex justify-between items-center">
                  <div className="flex gap-4">
                    <span className="text-[9px] font-mono text-slate-500 uppercase">UTF-8</span>
                    <span className="text-[9px] font-mono text-slate-500 uppercase">JSON</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="text-slate-500 hover:text-white transition-colors"><span className="material-symbols-outlined text-sm">content_copy</span></button>
                    <button className="text-slate-500 hover:text-white transition-colors"><span className="material-symbols-outlined text-sm">fullscreen</span></button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 py-6 flex flex-wrap justify-between items-center gap-6">
            <div className="flex gap-12">
              {[
                { label: 'Core Engine Status', value: 'Operational', dot: true },
                { label: 'Active Threads', value: '1,204 / 2,000', dot: false },
                { label: 'Uptime', value: '99.98%', dot: false },
              ].map(s => (
                <div key={s.label} className="flex flex-col">
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{s.label}</span>
                  <div className="flex items-center gap-2">
                    {s.dot && <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>}
                    <span className="text-xs text-slate-300 font-bold font-mono tracking-tighter">{s.value}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 text-slate-500 text-[9px] uppercase tracking-widest">
              <span>© 2024 JAV LABS Automation Agency</span>
              <span className="h-4 w-px bg-slate-800"></span>
              <span>System v4.0.12-build-88</span>
            </div>
          </div>
        </main>
      </div>
    </PortalLayout>
  );
}
