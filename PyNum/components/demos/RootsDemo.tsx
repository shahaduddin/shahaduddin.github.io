import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceArea, ReferenceDot } from 'recharts';
import { AlgorithmType } from '../../types';
import { compileMathFunction } from '../../utils/mathUtils';
import { 
  Zap, Activity, CheckCircle2, Compass, Binary, 
  RotateCcw, Settings as SettingsIcon, Sliders, 
  Sparkles, X, Target, FunctionSquare, Search, 
  ListOrdered, Calculator, Info, AlertCircle
} from 'lucide-react';

interface IterationData {
  iter: number;
  a?: number;
  b?: number;
  fa?: number;
  fb?: number;
  x: number;
  fx: number;
  error?: number;
}

interface Bracket {
  low: number;
  high: number;
}

export const RootsDemo: React.FC<{ type: AlgorithmType }> = ({ type }) => {
  // --- State ---
  const [funcStr, setFuncStr] = useState('x^2 - 4');
  const [p1, setP1] = useState<number>(0); 
  const [p2, setP2] = useState<number>(4);
  const [p3, setP3] = useState<number>(2); 
  const [maxIter, setMaxIter] = useState<number>(50);
  const [tolerance, setTolerance] = useState<number>(0.0001);
  const [searchRange, setSearchRange] = useState({ start: -10, end: 10, step: 0.5 });
  const [foundBrackets, setFoundBrackets] = useState<Bracket[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [iterations, setIterations] = useState<IterationData[]>([]);
  const [root, setRoot] = useState<number | null>(null);
  const [selectedIterIndex, setSelectedIterIndex] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // --- Helpers ---
  const isBracketing = type === AlgorithmType.BISECTION || type === AlgorithmType.FALSE_POSITION;
  const isIncremental = type === AlgorithmType.INCREMENTAL_SEARCH;
  const isNewton = type === AlgorithmType.NEWTON_RAPHSON;
  const isSecant = type === AlgorithmType.SECANT;
  const isMuller = type === AlgorithmType.MULLER;

  // Reset when algorithm changes
  useEffect(() => {
    setIterations([]); setRoot(null); setErrorMsg(null); setFoundBrackets([]);
    if (isNewton) { setFuncStr('x^2 - 4'); setP1(2); } 
    else if (isIncremental) { setFuncStr('exp(x) - 3x'); } 
    else if (isMuller) { setFuncStr('x^3 - x - 2'); setP1(0); setP2(1); setP3(2); } 
    else { setFuncStr('x^2 - 4'); setP1(0); setP2(4); }
  }, [type]);

  // --- Logic ---
  const scanDomain = async () => {
    try {
      setIsScanning(true); setErrorMsg(null);
      const f = compileMathFunction(funcStr) as (val: number) => number;
      const brackets: Bracket[] = [];
      const { start, end, step } = searchRange;
      let x1 = start;
      let f1 = f(x1);

      while (x1 < end) {
        let x2 = Math.min(x1 + step, end);
        let f2 = f(x2);
        if (f1 * f2 <= 0 && isFinite(f1) && isFinite(f2)) brackets.push({ low: x1, high: x2 });
        x1 = x2; f1 = f2;
        if (brackets.length > 20) break;
      }

      setFoundBrackets(brackets);
      if (isIncremental && brackets.length > 0) {
        setIterations(brackets.map((b, i) => ({ iter: i + 1, a: b.low, b: b.high, x: (b.low + b.high) / 2, fx: f((b.low + b.high) / 2) })));
      }
      setIsScanning(false);
    } catch (e) { setErrorMsg("Scanner Error: Check syntax."); setIsScanning(false); }
  };

  const solve = () => {
    if (isIncremental) { scanDomain(); return; }
    setErrorMsg(null); setIterations([]); setRoot(null);

    try {
      const f = compileMathFunction(funcStr) as (val: number) => number;
      const iterData: IterationData[] = [];
      
      if (isBracketing) {
        let a = p1, b = p2, c = 0, c_old = 0;
        if (f(a) * f(b) > 0) { setErrorMsg("Opposite signs required at bounds."); return; }
        for (let i = 0; i < maxIter; i++) {
          c = type === AlgorithmType.BISECTION ? (a + b) / 2 : (a * f(b) - b * f(a)) / (f(b) - f(a));
          const fc = f(c);
          const ea = i > 0 ? Math.abs((c - c_old) / c) * 100 : 100;
          iterData.push({ iter: i + 1, a, b, x: c, fx: fc, error: ea });
          if (Math.abs(fc) < 1e-12 || ea < tolerance) { setRoot(c); break; }
          c_old = c;
          if (fc * f(a) <= 0) b = c; else a = c;
        }
      } else if (isNewton) {
        let curr = p1;
        const df = (v: number) => (f(v + 1e-5) - f(v - 1e-5)) / 2e-5;
        for (let i = 0; i < maxIter; i++) {
          const fx = f(curr), dfx = df(curr);
          if (Math.abs(dfx) < 1e-10) break;
          const next = curr - fx / dfx;
          const ea = Math.abs((next - curr) / next) * 100;
          iterData.push({ iter: i+1, a: curr, x: next, fx, error: ea });
          if (ea < tolerance) { setRoot(next); break; }
          curr = next;
        }
      }
      setIterations(iterData);
      if (iterData.length > 0) setSelectedIterIndex(iterData.length - 1);
    } catch (e) { setErrorMsg("Computation Error: Math violation."); }
  };

  const chartData = useMemo(() => {
    try {
      const f = compileMathFunction(funcStr) as (val: number) => number;
      const data = [];
      const start = isIncremental ? searchRange.start : p1 - 2;
      const end = isIncremental ? searchRange.end : (p2 || p1 + 4);
      const step = (end - start) / 100;
      for (let i = 0; i <= 100; i++) {
        const x = start + i * step;
        const y = f(x);
        if (isFinite(y) && Math.abs(y) < 500) data.push({ x, y });
      }
      return data;
    } catch { return []; }
  }, [funcStr, p1, p2, type, searchRange, isIncremental]);

  const activeIter = iterations[selectedIterIndex ?? -1];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      
      {/* 1. INPUT STATION */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
        <div className="space-y-8">
            <div className="grid lg:grid-cols-12 gap-4 items-end">
                <div className="lg:col-span-8 space-y-3">
                    <label className="flex items-center gap-2 px-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <FunctionSquare className="w-4 h-4 text-emerald-500" /> Solve Expression
                    </label>
                    <div className="relative">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-3 border-r border-slate-200 dark:border-slate-800 pr-4">
                            <span className="text-emerald-600 font-mono text-sm font-black italic">f(x)=0</span>
                        </div>
                        <input 
                            className="w-full h-14 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl pl-24 pr-4 text-sm font-mono focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                            value={funcStr} onChange={(e) => setFuncStr(e.target.value)}
                        />
                    </div>
                </div>
                <div className="lg:col-span-4 flex gap-2">
                    <button onClick={() => setShowSettings(!showSettings)} className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all ${showSettings ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'}`}>
                        <SettingsIcon className="w-5 h-5" />
                    </button>
                    <button onClick={solve} className="flex-1 h-14 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-3 text-[11px] uppercase tracking-widest active:scale-95 transition-all">
                        {isIncremental ? <Search className="w-4 h-4" /> : <Zap className="w-4 h-4" />} {isIncremental ? 'Scan' : 'Solve'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <InputBox label={isNewton ? "Guess (x₀)" : "Lower (a)"} value={p1} onChange={setP1} />
                {(isBracketing || isSecant || isMuller) && <InputBox label={isSecant ? "x₁" : "Upper (b)"} value={p2} onChange={setP2} />}
                {isMuller && <InputBox label="x₂" value={p3} onChange={setP3} />}
                {!isIncremental && (
                  <button onClick={scanDomain} className="h-14 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/50 rounded-2xl flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-widest hover:bg-blue-100 transition-all">
                    <Compass className="w-4 h-4" /> Find Brackets
                  </button>
                )}
            </div>

            {foundBrackets.length > 0 && !isIncremental && (
              <div className="flex flex-wrap gap-2 animate-in slide-in-from-top-4">
                {foundBrackets.map((b, i) => (
                  <button key={i} onClick={() => { setP1(b.low); setP2(b.high); }} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-mono font-bold hover:bg-emerald-500 hover:text-white transition-all">
                    [{b.low.toFixed(2)}, {b.high.toFixed(2)}]
                  </button>
                ))}
              </div>
            )}

            {showSettings && (
              <div className="grid md:grid-cols-3 gap-6 p-6 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95">
                <InputBox label="Tolerance" value={tolerance} onChange={setTolerance} step={0.0001} />
                <InputBox label="Max Steps" value={maxIter} onChange={setMaxIter} />
                <InputBox label="Scan Step" value={searchRange.step} onChange={(v) => setSearchRange({...searchRange, step: v})} step={0.1} />
              </div>
            )}
        </div>
      </div>

      {/* 2. VISUALS & METRICS GRID */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-6 md:p-8 h-[500px] shadow-sm relative">
            <div className="flex items-center gap-2 mb-6 text-slate-400">
                <Activity className="w-4 h-4 text-emerald-500" />
                <span className="text-[10px] font-black uppercase tracking-widest">Convergence Chart</span>
            </div>
            <ResponsiveContainer width="100%" height="90%">
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                    <XAxis dataKey="x" type="number" domain={['auto', 'auto']} fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis fontSize={10} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                    <ReferenceLine y={0} stroke="#94a3b8" />
                    <Line type="monotone" dataKey="y" stroke="#10b981" strokeWidth={3} dot={false} isAnimationActive={false} />
                    {root !== null && <ReferenceDot x={root} y={0} r={6} fill="#10b981" stroke="white" strokeWidth={2} />}
                    {activeIter && <ReferenceArea x1={activeIter.a} x2={activeIter.b ?? activeIter.x} fill="#10b981" fillOpacity={0.05} />}
                </LineChart>
            </ResponsiveContainer>
        </div>

        <div className="space-y-6">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white h-[360px] flex flex-col justify-between relative overflow-hidden">
                <Zap className="absolute -bottom-10 -right-10 w-48 h-48 opacity-10 rotate-12" />
                <div className="relative z-10">
                   <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest block mb-10">Computation Metrics</span>
                   {iterations.length > 0 ? (
                       <div className="space-y-6">
                           <div>
                               <p className="text-slate-500 text-[10px] font-black uppercase mb-1">Final Approximation</p>
                               <h3 className="text-4xl md:text-5xl font-mono font-black tracking-tighter text-emerald-400 break-all">
                                 {iterations[iterations.length-1].x.toFixed(6)}
                               </h3>
                           </div>
                           <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
                               <div><p className="text-[9px] text-slate-500 font-black uppercase">Steps</p><p className="text-2xl font-black">{iterations.length}</p></div>
                               <div><p className="text-[9px] text-slate-500 font-black uppercase">Error</p><p className="text-2xl font-black text-amber-500">{(iterations[iterations.length-1].error || 0).toFixed(4)}%</p></div>
                           </div>
                       </div>
                   ) : (
                       <div className="py-20 text-center opacity-20"><Calculator className="w-12 h-12 mx-auto mb-2" /><p className="text-[10px] font-black uppercase">Awaiting Solve</p></div>
                   )}
                </div>
                {root !== null && <div className="bg-emerald-500/20 border border-emerald-500/30 p-4 rounded-2xl flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400" /><span className="text-[10px] font-black uppercase tracking-widest">Convergence Verified</span></div>}
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 flex items-start gap-4 shadow-sm">
                <Info className="w-6 h-6 text-blue-500 shrink-0" />
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  {isNewton ? "Newton's method converges quadratically but requires a non-zero derivative." : "Bracketing methods are slower but guaranteed to converge via IVT."}
                </p>
            </div>
        </div>
      </div>

      {/* 3. TRACE TABLE */}
      {iterations.length > 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm animate-in slide-in-from-bottom-8">
               <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/50">
                  <div className="flex items-center gap-4">
                     <ListOrdered className="w-5 h-5 text-slate-400" />
                     <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest">Iteration Trace</h3>
                  </div>
                  <span className="px-4 py-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 text-[10px] font-black uppercase rounded-full">{iterations.length} Cycles</span>
               </div>
               <div className="overflow-x-auto max-h-[400px] custom-scrollbar">
                  <table className="w-full text-left">
                      <thead className="bg-slate-50 dark:bg-slate-950 sticky top-0 z-10 text-[10px] font-black uppercase text-slate-400 border-b border-slate-200 dark:border-slate-800">
                          <tr><th className="px-8 py-4">#</th><th className="px-8 py-4">Root Est (x)</th><th className="px-8 py-4">Residual f(x)</th><th className="px-8 py-4 text-right">Rel Error</th></tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {iterations.map((row, i) => (
                              <tr key={i} className={`hover:bg-emerald-50/30 dark:hover:bg-emerald-900/10 transition-colors cursor-pointer ${selectedIterIndex === i ? 'bg-emerald-50/50 dark:bg-emerald-900/20' : ''}`} onClick={() => setSelectedIterIndex(i)}>
                                  <td className="px-8 py-4 text-xs font-black text-slate-400">{row.iter}</td>
                                  <td className="px-8 py-4 font-mono text-xs font-bold">{row.x.toPrecision(8)}</td>
                                  <td className="px-8 py-4 font-mono text-xs text-slate-500">{row.fx.toExponential(4)}</td>
                                  <td className="px-8 py-4 text-right"><span className={`text-[10px] font-black px-2 py-1 rounded-md ${row.error && row.error < 1 ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'text-amber-500 bg-amber-50 dark:bg-amber-900/20'}`}>{row.error?.toFixed(4)}%</span></td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
               </div>
          </div>
      )}

      {errorMsg && (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-md px-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-red-600 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p className="text-xs font-black uppercase tracking-widest">{errorMsg}</p>
                  <button onClick={() => setErrorMsg(null)} className="ml-auto"><X className="w-4 h-4" /></button>
              </div>
          </div>
      )}
    </div>
  );
};

const InputBox = ({ label, value, onChange, step = 1 }: any) => (
  <div className="space-y-2 group">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 group-focus-within:text-emerald-500 transition-colors">{label}</label>
    <input 
      type="number" step={step} value={value} onChange={e => onChange(Number(e.target.value))}
      className="w-full h-14 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 text-xs font-mono outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all"
    />
  </div>
);
