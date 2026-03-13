import { Link, useNavigate } from 'react-router-dom';
import PortalLayout from '../../components/PortalLayout';
import './TechnicalSupportChat.css';

export default function TechnicalSupportChat() {
  const navigate = useNavigate();
  return (
    <PortalLayout>
      <div className="flex flex-1 overflow-hidden h-screen">

        <main className="flex-1 flex flex-col relative bg-background-dark">
          <div className="flex-1 overflow-y-auto p-8 relative scrollbar-hide">
            <div className="absolute left-12 top-0 bottom-0 w-px resolution-path-line opacity-30"></div>
            <div className="max-w-4xl mx-auto space-y-12 relative">

              <div className="relative pl-16">
                <div className="absolute left-[-22px] top-1 size-4 bg-background-dark border border-primary rounded-full z-10 flex items-center justify-center">
                  <div className="size-1.5 bg-primary rounded-full"></div>
                </div>
                <div className="border-t border-b border-slate-800/50 py-4 mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="material-symbols-outlined text-primary text-lg">terminal</span>
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">System Event / 10:00:42 AM</span>
                  </div>
                  <div className="bg-system-gray/50 p-4 font-mono text-sm border border-slate-800/50">
                    <span className="text-primary mr-2">&gt;</span> initializing_diagnostic_sequence --target=node-04<br />
                    <span className="text-green-500 mr-2">&gt;</span> handshake_complete: status_ok
                  </div>
                </div>
              </div>

              <div className="relative pl-16 group">
                <div className="absolute left-[-22px] top-1 size-4 bg-background-dark border border-slate-500 rounded-full z-10"></div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-tighter">Site_Lead_Alpha</span>
                    <span className="text-[10px] text-slate-500 font-mono">10:05 AM</span>
                  </div>
                  <div className="bg-slate-800 p-5 max-w-xl border-l-4 border-slate-600">
                    <p className="text-sm font-medium leading-relaxed text-slate-200">The actuator on Node-04 is failing to meet the calibration baseline. We are seeing a 140ms delay in response timing. Need immediate override.</p>
                  </div>
                </div>
              </div>

              <div className="relative pl-16 flex justify-end">
                <div className="flex flex-col gap-2 items-end">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 font-mono">10:08 AM</span>
                    <span className="text-xs font-bold uppercase tracking-tighter text-primary">JAV_TECH_SUPPORT</span>
                  </div>
                  <div className="bg-primary text-white p-5 max-w-xl border-r-4 border-blue-400">
                    <p className="text-sm font-medium leading-relaxed">Acknowledged. Running a remote kernel sync to bypass the local controller latency. Please standby while I re-route the signal through the backup bus.</p>
                  </div>
                </div>
              </div>

              <div className="relative pl-16">
                <div className="absolute left-[-22px] top-1 size-4 bg-background-dark border border-primary rounded-full z-10 flex items-center justify-center shadow-[0_0_10px_rgba(13,127,242,0.5)]">
                  <div className="size-1.5 bg-primary rounded-full"></div>
                </div>
                <div className="py-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="material-symbols-outlined text-primary text-lg">monitoring</span>
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Diagnostic Output / 10:12:15 AM</span>
                  </div>
                  <div className="bg-black p-5 font-mono text-xs border border-slate-800 leading-relaxed">
                    <p className="text-slate-400">[INFO] Executing remote test on Actuator_ID: 04-B</p>
                    <p className="text-yellow-500">[WARN] High impedance detected in secondary actuator coil</p>
                    <p className="text-primary font-bold">[EXEC] Signal re-routing: Successful</p>
                    <div className="mt-3 h-1 w-full bg-slate-900"><div className="h-full bg-primary w-2/3"></div></div>
                  </div>
                </div>
              </div>

              <div className="relative pl-16">
                <div className="absolute left-[-22px] top-1 size-4 bg-background-dark border border-slate-500 rounded-full z-10"></div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-tighter">Site_Lead_Alpha</span>
                    <span className="text-[10px] text-slate-500 font-mono">10:15 AM</span>
                  </div>
                  <div className="bg-slate-800 p-5 max-w-xl border-l-4 border-slate-600">
                    <p className="text-sm font-medium leading-relaxed text-slate-200">Latency just dropped to 12ms. Calibration is back within green parameters. Can you confirm if this is a permanent fix or a temporary bypass?</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 bg-background-dark border-t border-slate-800">
            <div className="max-w-4xl mx-auto">
              <div className="relative flex items-center bg-system-gray border border-slate-700 shadow-xl">
                <div className="px-4 text-slate-500">
                  <span className="material-symbols-outlined">add_circle</span>
                </div>
                <textarea className="w-full bg-transparent border-none focus:ring-0 py-4 text-sm font-medium placeholder:text-slate-600 resize-none" placeholder="Enter technical command or message..." rows="1"></textarea>
                <div className="px-4 flex items-center gap-4">
                  <span className="material-symbols-outlined text-slate-500 cursor-pointer hover:text-white transition-colors">attach_file</span>
                  <button className="bg-primary hover:opacity-90 px-6 py-2 text-[10px] font-bold uppercase tracking-widest text-white transition-colors">Execute</button>
                </div>
              </div>
              <div className="flex justify-between items-center mt-3 px-1">
                <div className="flex gap-4">
                  <div className="flex items-center gap-1.5">
                    <div className="size-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Secure_Channel_Active</span>
                  </div>
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Encryption: AES-256</span>
                </div>
                <span className="text-[9px] font-mono text-slate-600">CMD + ENTER TO SEND</span>
              </div>
            </div>
          </div>
        </main>

        <aside className="w-72 border-l border-slate-800 flex flex-col bg-background-dark hidden lg:flex">
          <div className="p-6 border-b border-slate-800">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-4">Node Metrics</span>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-[10px] font-mono mb-1"><span>CPU LOAD</span><span className="text-primary">42.8%</span></div>
                <div className="h-1 w-full bg-slate-800"><div className="h-full bg-primary w-[42.8%]"></div></div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] font-mono mb-1"><span>IO LATENCY</span><span className="text-red-500">114ms</span></div>
                <div className="h-1 w-full bg-slate-800"><div className="h-full bg-red-500 w-[85%]"></div></div>
              </div>
            </div>
          </div>
          <div className="p-6">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-4">Diagnostic Assets</span>
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: 'architecture', label: 'Schematic'   },
                { icon: 'description',  label: 'Logs_Node04' },
                { icon: 'analytics',    label: 'Cal_Data'    },
                { icon: 'videocam',     label: 'CAM_B_FEED'  },
              ].map(a => (
                <div key={a.label} className="aspect-square bg-slate-800 border border-slate-700 flex flex-col items-center justify-center gap-2 hover:border-primary transition-colors cursor-pointer">
                  <span className="material-symbols-outlined text-slate-500">{a.icon}</span>
                  <span className="text-[8px] font-bold uppercase text-slate-500">{a.label}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </PortalLayout>
  );
}
