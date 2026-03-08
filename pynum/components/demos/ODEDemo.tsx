import React, { useState, useMemo, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot, ReferenceLine } from 'recharts';
import { AlgorithmType } from '../../types';
import { compileMathFunction } from '../../utils/mathUtils';
import { 
  AlertCircle, Activity, Play, ChevronRight, 
  Table as TableIcon, MousePointerClick, 
  RotateCcw, FlaskConical, Gauge, ListOrdered, Info,
  Trash2, BookMarked, GitBranch, Binary
} from 'lucide-react';

interface ODEDemoProps {
  type: AlgorithmType;
}

interface IterationData {
  step: number;
  x: number;
  y: number;
  slope: number;
  k?: number[]; // [k1, k2, k3, k4]
}

const PRESETS = [
  {
    name: "Growth (dy/dx = y)",
    func: "y",
    x0: 0,
    y0: 1,
    h: 0.1,
    end: 2
  },
  {
    name: "Oscillator (dy/dx = -x)",
    func: "-x",
    x0: 0,
    y0: 5,
    h: 0.2,
    end: 10
  },
  {
    name: "Complex (dy/dx = x + y)",
    func: "x + y",
    x0: 0,
    y0: 1,
    h: 0.1,
    end: 2
  },
  {
    name: "Decay (dy/dx = -0.5y)",
    func: "-0.5 * y",
    x0: 0,
    y0: 10,
    h: 0.5,
    end: 10
  }
];

export const ODEDemo: React.FC<ODEDemoProps> = ({ type }) => {
  const [funcStr, setFuncStr] = useState(PRESETS[2].func);
  const [x0, setX0] = useState(PRESETS[2].x0);
  const [y0, setY0] = useState(PRESETS[2].y0);
  const [h, setH] = useState(PRESETS[2].h);
  const [xEnd, setXEnd] = useState(PRESETS[2].end);
  const [maxStepsLimit] = useState(500);
  
  const [iterations, setIterations] = useState<IterationData[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const isRK4 = type === AlgorithmType.RK4;

  useEffect(() => {
    setIterations([]);
    setSelectedIndex(null);
    setErrorMsg(null);
  }, [type]);

  const solve = () => {
    setErrorMsg(null);
    setIsSimulating(true);
    
    setTimeout(() => {
      try {
        const f = compileMathFunction(funcStr, ['x', 'y']) as (x: number, y: number) => number;
        let steps = Math.ceil((xEnd - x0) / h);
        if (steps > maxStepsLimit) {
          setErrorMsg(`Step count (${steps}) exceeds limit (${maxStepsLimit}).`);
          setIsSimulating(false);
          return;
        }
        if (steps <= 0 || !isFinite(steps)) {
           setErrorMsg("Invalid range.");
           setIsSimulating(false);
           return;
        }

        const results: IterationData[] = [];
        let currX = x0, currY = y0;
        results.push({ step: 0, x: Number(currX.toFixed(4)), y: currY, slope: f(currX, currY) });

        for (let i = 1; i <= steps; i++) {
          if (!isRK4) {
            const slope = f(currX, currY);
            currY += h * slope;
          } else {
            const k1 = f(currX, currY);
            const k2 = f(currX + h/2, currY + (h * k1)/2);
            const k3 = f(currX + h/2, currY + (h * k2)/2);
            const k4 = f(currX + h, currY + h * k3);
            currY += (h / 6) * (k1 + 2*k2 + 2*k3 + k4);
            results[results.length-1].k = [k1, k2, k3, k4];
          }
          currX += h;
          results.push({ step: i, x: Number(currX.toFixed(4)), y: currY, slope: f(currX, currY) });
        }
        setIterations(results);
        setSelectedIndex(results.length - 1);
      } catch (e) { setErrorMsg("Syntax error."); }
      setIsSimulating(false);
    }, 50);
  };

  const applyPreset = (p: typeof PRESETS[0]) => {
    setFuncStr(p.func); setX0(p.x0); setY0(p.y0); setH(p.h); setXEnd(p.end);
    setIterations([]); setSelectedIndex(null); setErrorMsg(null);
  };

  const clearPlot = () => {
    setIterations([]);
    setSelectedIndex(null);
    setErrorMsg(null);
  };

  const activePoint = selectedIndex !== null ? iterations[selectedIndex] : null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><FlaskConical className="w-3.5 h-3.5 text-emerald-500" /> Equation Definition</h3>
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 font-mono text-xs font-black">dy/dx = </div>
                <input className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl pl-16 pr-4 py-3 text-sm text-slate-900 dark:text-slate-100 font-mono focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all" 
                  value={funcStr} onChange={e => { setFuncStr(e.target.value); setIterations([]); }} />
              </div>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map(p => (
                  <button key={p.name} onClick={() => applyPreset(p)} className="px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-600 dark:text-slate-400 rounded-lg hover:text-emerald-600 transition-all">
                    {(p.name || '').split('(')[0]}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               <InputGroup label="Initial x₀" value={x0} onChange={v => {setX0(v); setIterations([]);}} />
               <InputGroup label="Initial y₀" value={y0} onChange={v => {setY0(v); setIterations([]);}} />
               <InputGroup label="Step Size h" value={h} onChange={v => {setH(v); setIterations([]);}} step={0.01} />
               <InputGroup label="Interval End" value={xEnd} onChange={v => {setXEnd(v); setIterations([]);}} />
            </div>
          </div>
          <div className="lg:w-48 flex flex-col justify-end gap-3">
             <button onClick={solve} disabled={isSimulating} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3.5 rounded-2xl shadow-xl shadow-emerald-600/20 transition-all active:scale-95 flex items-center justify-center gap-2">
               {isSimulating ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />} {iterations.length > 0 ? 'Update Plot' : 'Execute Solver'}
             </button>
             <button onClick={clearPlot} disabled={iterations.length === 0} className="w-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold py-3 rounded-2xl text-[10px] uppercase tracking-widest hover:bg-red-50 hover:text-red-600 transition-all disabled:opacity-30">Clear</button>
          </div>
        </div>
        {errorMsg && <div className="mt-6 bg-red-50 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3 border border-red-100 animate-in slide-in-from-top-2"><AlertCircle className="w-5 h-5" /> <span className="text-xs font-black uppercase">{errorMsg}</span></div>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-6 h-[520px] shadow-sm relative transition-colors">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={iterations} onMouseMove={(e) => e.activeTooltipIndex !== undefined && setSelectedIndex(e.activeTooltipIndex)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="x" stroke="#94a3b8" type="number" domain={['auto', 'auto']} tick={{fontSize: 10, fill: '#94a3b8'}} />
                <YAxis stroke="#94a3b8" tick={{fontSize: 10, fill: '#94a3b8'}} />
                <Tooltip contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', backgroundColor: 'rgba(255,255,255,0.98)' }} />
                <Line type="monotone" dataKey="y" stroke="#10b981" strokeWidth={4} dot={false} activeDot={{r: 8, fill: '#f59e0b'}} isAnimationActive={false} />
                {activePoint && <ReferenceDot x={activePoint.x} y={activePoint.y} r={6} fill="#f59e0b" stroke="#fff" strokeWidth={3} />}
              </LineChart>
            </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative transition-colors overflow-hidden flex-1 group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Gauge className="w-32 h-32 text-emerald-600 rotate-12" />
            </div>
            <div className="relative z-10 flex flex-col h-full">
                <span className="text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] block mb-8 flex items-center gap-2"><Crosshair className="w-4 h-4" /> Point Telemetry</span>
                
                {activePoint ? (
                   <div className="space-y-12">
                      <div className="animate-in fade-in duration-300">
                         <span className="text-slate-400 text-[10px] font-black uppercase block mb-2 tracking-widest leading-none">Approximated y({activePoint.x})</span>
                         <div className="text-5xl md:text-6xl font-mono font-black text-slate-900 dark:text-white tracking-tighter break-all">{activePoint.y.toFixed(6)}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
                            <span className="text-[9px] text-slate-400 font-black uppercase block mb-1 tracking-widest leading-none">Slope f(x,y)</span>
                            <span className="text-lg font-mono font-black text-emerald-600">{activePoint.slope.toFixed(4)}</span>
                         </div>
                         <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
                            <span className="text-[9px] text-slate-400 font-black uppercase block mb-1 tracking-widest leading-none">Interval</span>
                            <span className="text-lg font-mono font-black text-emerald-600">{h}</span>
                         </div>
                      </div>
                   </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-300 space-y-4">
                        <Binary className="w-12 h-12 opacity-10 animate-pulse" />
                        <p className="text-[9px] font-black uppercase tracking-[0.3em]">No Simulation Active</p>
                    </div>
                )}

                <div className="mt-auto pt-8 border-t border-slate-100 dark:border-slate-800">
                    <div className="bg-emerald-50/50 dark:bg-emerald-900/10 p-4 rounded-2xl flex gap-3">
                        <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-emerald-800 dark:text-emerald-400 font-medium leading-relaxed italic">
                            Move cursor over the graph to inspect local telemetry and slope data.
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

const InputGroup = ({ label, value, onChange, step = 1 }: { label: string, value: number, onChange: (v: number) => void, step?: number }) => (
  <div className="space-y-1.5 flex-1">
    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1 leading-none">{label}</label>
    <input type="number" step={step} value={value} onChange={e => onChange(Number(e.target.value))}
      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-mono text-slate-900 dark:text-slate-100 outline-none focus:border-emerald-500 shadow-sm transition-all" />
  </div>
);

const Crosshair = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/></svg>
);