import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceArea, ReferenceDot } from 'recharts';
import { AlgorithmType } from '../../types';
import { compileMathFunction } from '../../utils/mathUtils';
import { 
  AlertCircle, PlayCircle, Search, 
  Zap, Activity, CheckCircle2, 
  Compass, Binary, RotateCcw, Settings as SettingsIcon, 
  Sliders, Sparkles, X, Lightbulb, ChevronRight, FunctionSquare,
  Target, Info
} from 'lucide-react';

interface IterationData {
  iter: number;
  a?: number;
  b?: number;
  fa?: number;
  fb?: number;
  c?: number;
  dfx?: number;
  x: number;
  fx: number;
  error?: number;
}

interface Bracket {
  low: number;
  high: number;
}

interface RootsDemoProps {
  type: AlgorithmType;
}

export const RootsDemo: React.FC<RootsDemoProps> = ({ type }) => {
  const [funcStr, setFuncStr] = useState('x^2 - 4');
  const [p1, setP1] = useState<number>(0); 
  const [p2, setP2] = useState<number>(4);
  const [p3, setP3] = useState<number>(2); 
  const [maxIter, setMaxIter] = useState<number>(50);
  const [tolerance, setTolerance] = useState<number>(0.000001);
  
  const [searchRange, setSearchRange] = useState({ start: -10, end: 10, step: 0.5 });
  const [foundBrackets, setFoundBrackets] = useState<Bracket[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [lastSetBracket, setLastSetBracket] = useState<number | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const [iterations, setIterations] = useState<IterationData[]>([]);
  const [root, setRoot] = useState<number | null>(null);
  const [selectedIterIndex, setSelectedIterIndex] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isBracketing = type === AlgorithmType.BISECTION || type === AlgorithmType.FALSE_POSITION;
  const isFixedPoint = type === AlgorithmType.FIXED_POINT_ITERATION;
  const isIncrementalSearch = type === AlgorithmType.INCREMENTAL_SEARCH;
  const isMuller = type === AlgorithmType.MULLER;
  const isSecant = type === AlgorithmType.SECANT;
  const isNewton = type === AlgorithmType.NEWTON_RAPHSON;

  // Sync parameters with algorithm selection
  useEffect(() => {
    setIterations([]); setRoot(null); setErrorMsg(null); setFoundBrackets([]);
    
    if (isNewton) { setFuncStr('x^2 - 4'); setP1(2); } 
    else if (isFixedPoint) { setFuncStr('1 + 1/x'); setP1(1.5); } 
    else if (isIncrementalSearch) { setFuncStr('exp(x) - 3x'); } 
    else if (isMuller) { setFuncStr('x^3 - x - 2'); setP1(0); setP2(1); setP3(2); } 
    else { setFuncStr('x^2 - 4'); setP1(0); setP2(4); }
  }, [type]);

  const labels = useMemo(() => {
    switch (type) {
      case AlgorithmType.NEWTON_RAPHSON: return { p1: "Initial Guess (x₀)", p2: null, p3: null };
      case AlgorithmType.SECANT: return { p1: "x₀ (Initial)", p2: "x₁ (Initial)", p3: null };
      case AlgorithmType.FIXED_POINT_ITERATION: return { p1: "Initial Guess (x₀)", p2: null, p3: null };
      case AlgorithmType.MULLER: return { p1: "x₀", p2: "x₁", p3: "x₂" };
      default: return { p1: "Lower Bound (a)", p2: "Upper Bound (b)", p3: null };
    }
  }, [type]);

  const scanForBrackets = async () => {
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
        if (f1 * f2 <= 0) brackets.push({ low: x1, high: x2 });
        x1 = x2; f1 = f2;
        if (brackets.length > 50) break;
      }

      setFoundBrackets(brackets);
      if (isIncrementalSearch) {
          setIterations(brackets.map((b, i) => ({ iter: i + 1, a: b.low, b: b.high, x: (b.low + b.high) / 2, fx: f((b.low + b.high) / 2) })));
      }
      setIsScanning(false);
    } catch (e) { setErrorMsg("Scanner Error: Failed to evaluate domain."); setIsScanning(false); }
  };

  const solve = () => {
    if (isIncrementalSearch) { scanForBrackets(); return; }
    setErrorMsg(null); setIterations([]); setRoot(null);

    try {
      const f = compileMathFunction(funcStr) as (val: number) => number;
      const iterData: IterationData[] = [];
      
      if (isBracketing) {
        let low = Math.min(p1, p2), high = Math.max(p1, p2), c = 0, c_old = 0;
        if (f(low) * f(high) > 0) { setErrorMsg("No sign change between bounds. Use 'Scan Domain'."); return; }

        for (let i = 0; i < maxIter; i++) {
          c = type === AlgorithmType.BISECTION ? (low + high) / 2 : (low * f(high) - high * f(low)) / (f(high) - f(low));
          const fc = f(c);
          let ea = i > 0 ? Math.abs((c - c_old) / c) * 100 : 100;
          iterData.push({ iter: i+1, a: low, b: high, fa: f(low), fb: f(high), x: c, fx: fc, error: ea });
          if (Math.abs(fc) < 1e-12 || ea < tolerance) { setRoot(c); break; }
          c_old = c;
          if (fc * f(low) <= 0) high = c; else low = c;
        }
      } 
      else if (isNewton) {
        let curr = p1;
        const df = (v: number) => (f(v + 1e-5) - f(v - 1e-5)) / 2e-5;
        for (let i = 0; i < maxIter; i++) {
          const fx = f(curr), dfx = df(curr);
          if (Math.abs(dfx) < 1e-12) { setErrorMsg("Stalled: Derivative near zero."); break; }
          const next = curr - fx / dfx;
          const ea = Math.abs((next - curr) / next) * 100;
          iterData.push({ iter: i+1, a: curr, x: next, fx: fx, dfx: dfx, error: ea });
          if (ea < tolerance) { setRoot(next); break; }
          curr = next;
        }
      }
      else if (isSecant) {
        let x0 = p1, x1 = p2;
        for (let i = 0; i < maxIter; i++) {
            const fx0 = f(x0), fx1 = f(x1);
            if (Math.abs(fx1 - fx0) < 1e-15) break;
            const x2 = x1 - fx1 * (x1 - x0) / (fx1 - fx0);
            const ea = Math.abs((x2 - x1) / x2) * 100;
            iterData.push({ iter: i+1, a: x0, b: x1, x: x2, fx: f(x2), error: ea });
            if (ea < tolerance) { setRoot(x2); break; }
            x0 = x1; x1 = x2;
        }
      }
      setIterations(iterData);
      if (iterData.length > 0) setSelectedIterIndex(iterData.length - 1);
    } catch (e) { setErrorMsg("Calculation Error: Check function syntax."); }
  };

  const chartData = useMemo(() => {
    try {
      const f = compileMathFunction(funcStr) as (val: number) => number;
      const data = [];
      let start = isIncrementalSearch ? searchRange.start : p1 - 2; 
      let end = isIncrementalSearch ? searchRange.end : (p2 || p1 + 4);
      const step = (end - start) / 200;
      for (let i = 0; i <= 200; i++) {
        const x = start + i * step;
        const y = f(x);
        if (isFinite(y) && Math.abs(y) < 1000) data.push({ x, y, yLine: isFixedPoint ? x : undefined });
      }
      return data;
    } catch { return []; }
  }, [funcStr, p1, p2, type, searchRange, isIncrementalSearch]);

  const activeIter = iterations[selectedIterIndex || 0];

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      
      {/* 1. CONTROL PANEL */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
        <div className="max-w-6xl mx-auto space-y-8">
            
            {/* Primary Input Section */}
            <div className="grid lg:grid-cols-12 gap-6 items-end">
                <div className="lg:col-span-7 space-y-3">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2 px-1">
                        <FunctionSquare className="w-3.5 h-3.5 text-emerald-500" />
                        {isFixedPoint ? "Mapping x = g(x)" : "Equation Definition f(x) = 0"}
                    </label>
                    <div className="relative group">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r border-slate-200 dark:border-slate-800 pr-4">
                            <span className="text-emerald-600 font-mono text-sm font-black italic">{isFixedPoint ? "g(x)" : "f(x)"}</span>
                            <span className="text-slate-300 dark:text-slate-700 font-light">=</span>
                        </div>
                        <input 
                            type="text" 
                            className="w-full h-14 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl pl-24 pr-4 text-sm text-slate-900 dark:text-slate-100 font-mono focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                            onChange={(e) => setFuncStr(e.target.value)}
                            value={funcStr}
                        />
                    </div>
                </div>

                <div className="lg:col-span-5 flex gap-3">
                    <button 
                        onClick={() => setShowSettings(!showSettings)}
                        className={`w-14 h-14 flex items-center justify-center rounded-2xl border transition-all active:scale-95 ${showSettings ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-emerald-500'}`}
                    >
                        <SettingsIcon className={`w-5 h-5 ${showSettings ? 'rotate-90 transition-transform' : ''}`} />
                    </button>
                    <button 
                        onClick={solve}
                        className="flex-1 h-14 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl shadow-xl shadow-emerald-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-xs uppercase tracking-widest"
                    >
                        {isIncrementalSearch ? <Search className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                        {isIncrementalSearch ? 'Scan Domain' : 'Solve Method'}
                    </button>
                    <button 
                        onClick={() => { setIterations([]); setRoot(null); }}
                        className="w-14 h-14 bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-red-500 rounded-2xl flex items-center justify-center transition-colors"
                    >
                        <RotateCcw className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Parameter Input Row */}
            <div className="flex flex-wrap items-end gap-6">
                <div className="flex-1 min-w-[300px] grid grid-cols-2 md:grid-cols-3 gap-4">
                    {labels.p1 && <InputGroup label={labels.p1} value={p1} onChange={setP1} icon={Target} />}
                    {labels.p2 && <InputGroup label={labels.p2} value={p2} onChange={setP2} icon={Target} />}
                    {labels.p3 && <InputGroup label={labels.p3} value={p3} onChange={setP3} icon={Target} />}
                </div>

                {!isIncrementalSearch && (
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Domain Assistant</label>
                        <button 
                            onClick={scanForBrackets}
                            className="h-14 px-6 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/50 rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-blue-100 transition-all active:scale-95"
                        >
                            <Compass className="w-4 h-4" />
                            Auto-Locate Brackets
                        </button>
                    </div>
                )}
            </div>

            {/* Interval Chips */}
            {foundBrackets.length > 0 && !isIncrementalSearch && (
                <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-[2rem] border border-slate-100 dark:border-slate-800 animate-in slide-in-from-top-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-amber-500" />
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Located Intervals</h4>
                        </div>
                        <button onClick={() => setFoundBrackets([])}><X className="w-4 h-4 text-slate-400" /></button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {foundBrackets.map((b, i) => (
                            <button 
                                key={i}
                                onClick={() => { setP1(b.low); setP2(b.high); setLastSetBracket(i); }}
                                className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all border-2 ${lastSetBracket === i ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-emerald-500'}`}
                            >
                                [{b.low.toFixed(2)}, {b.high.toFixed(2)}]
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Advanced Settings Drawer */}
            {showSettings && (
                <div className="p-8 bg-slate-50 dark:bg-slate-950 rounded-[2rem] border border-slate-200 dark:border-slate-800 animate-in zoom-in-95">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <InputGroup label="Tolerance (ε)" value={tolerance} onChange={setTolerance} step={0.000001} icon={Sliders} />
                        <InputGroup label="Max Iterations" value={maxIter} onChange={setMaxIter} icon={Sliders} />
                        <div className="space-y-3">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Compass className="w-3.5 h-3.5"/> Scan Step</label>
                             <input type="number" step="0.1" value={searchRange.step} onChange={e => setSearchRange({...searchRange, step: Number(e.target.value)})} className="w-full h-12 bg-white dark:bg-slate-800 rounded-xl px-4 text-xs font-mono border border-slate-200 dark:border-slate-700 outline-none focus:border-emerald-500" />
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>

      {/* 2. MAIN VISUALIZATION & METRICS */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chart View */}
        <div className="lg:col-span-2 h-[550px] bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-6 shadow-sm group">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg text-emerald-600"><Activity className="w-4 h-4"/></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Geometric Analysis</span>
                </div>
            </div>
            <ResponsiveContainer width="100%" height="90%">
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="x" type="number" domain={['auto', 'auto']} fontSize={10} tick={{fill: '#94a3b8'}} />
                    <YAxis fontSize={10} tick={{fill: '#94a3b8'}} />
                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px' }} />
                    <ReferenceLine y={0} stroke="#94a3b8" />
                    <Line type="monotone" dataKey="y" stroke="#10b981" strokeWidth={3} dot={false} isAnimationActive={false} />
                    {root !== null && <ReferenceDot x={root} y={0} r={6} fill="#10b981" stroke="#fff" strokeWidth={2} />}
                    {activeIter && (
                        <ReferenceArea x1={activeIter.a} x2={activeIter.b || activeIter.x} fill="#10b981" fillOpacity={0.05} />
                    )}
                </LineChart>
            </ResponsiveContainer>
        </div>

        {/* Metrics Sidebar */}
        <div className="space-y-6">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden h-[380px] flex flex-col justify-between">
                <div className="absolute top-0 right-0 p-8 opacity-10"><Zap className="w-48 h-48 rotate-12" /></div>
                <div className="relative z-10">
                    <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest block mb-10">Computational Status</span>
                    {iterations.length > 0 ? (
                        <div className="space-y-8">
                            <div>
                                <h4 className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Final Approximation</h4>
                                <div className="text-4xl font-mono font-black tracking-tighter text-emerald-400">{iterations[iterations.length-1].x.toFixed(8)}</div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-8">
                                <div>
                                    <span className="text-[10px] text-slate-500 font-black uppercase block mb-1">Steps</span>
                                    <span className="text-2xl font-black">{iterations.length}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-slate-500 font-black uppercase block mb-1">Error</span>
                                    <span className="text-2xl font-black text-amber-500">{iterations[iterations.length-1].error?.toFixed(2)}%</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-20 opacity-20">
                            <Binary className="w-16 h-16 mx-auto mb-4" />
                            <p className="text-[10px] font-black uppercase">Waiting for Solve</p>
                        </div>
                    )}
                </div>
                {root !== null && (
                    <div className="bg-emerald-500/20 border border-emerald-500/30 p-4 rounded-2xl flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Convergence Verified</span>
                    </div>
                )}
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] flex items-start gap-4 shadow-sm">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-2xl text-blue-500"><Lightbulb className="w-5 h-5"/></div>
                <div>
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Did you know?</h5>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                        {isNewton ? "Newton's method uses the tangent line's slope. If the derivative is zero, the algorithm will stall." : "Bisection uses the IVT theorem. It is guaranteed to find a root if the bounds have opposite signs."}
                    </p>
                </div>
            </div>
        </div>
      </div>

      {/* 3. STEP TRACE TABLE */}
      {iterations.length > 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm animate-in slide-in-from-bottom-8">
               <div className="px-10 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400"><Activity className="w-5 h-5" /></div>
                     <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest">Iteration Log</h3>
                  </div>
                  <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 text-[9px] font-black uppercase tracking-widest rounded-full">{iterations.length} Cycles Logged</span>
               </div>
               <div className="overflow-x-auto max-h-[400px] custom-scrollbar">
                  <table className="w-full text-left">
                      <thead className="bg-slate-50 dark:bg-slate-950/50 sticky top-0 z-10 text-[10px] font-black uppercase text-slate-400">
                          <tr>
                              <th className="px-10 py-5">Step</th>
                              <th className="px-10 py-5">x Approximation</th>
                              <th className="px-10 py-5">Value f(x)</th>
                              <th className="px-10 py-5 text-right">Rel Error</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {iterations.map((row, i) => (
                              <tr key={i} className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${selectedIterIndex === i ? 'bg-emerald-50 dark:bg-emerald-900/10' : ''}`} onClick={() => setSelectedIterIndex(i)}>
                                  <td className="px-10 py-4 font-black text-xs text-slate-400">#{row.iter}</td>
                                  <td className="px-10 py-4 font-mono text-xs font-bold text-slate-800 dark:text-slate-200">{row.x.toFixed(8)}</td>
                                  <td className="px-10 py-4 font-mono text-xs text-slate-500">{row.fx.toExponential(4)}</td>
                                  <td className="px-10 py-4 text-right">
                                      <span className={`text-[10px] font-black px-2 py-1 rounded-md ${row.error && row.error < 1 ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'text-amber-500 bg-amber-50 dark:bg-amber-900/20'}`}>
                                          {row.error?.toPrecision(3)}%
                                      </span>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
               </div>
          </div>
      )}
    </div>
  );
};

// Reusable Components matching Dashboard Theme
const InputGroup = ({ label, value, onChange, step = 1, icon: Icon }: { label: string, value: number, onChange: (v: number) => void, step?: number, icon: any }) => (
  <div className="space-y-3 flex-1 group min-w-[140px]">
    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2 px-1 group-focus-within:text-emerald-500 transition-colors">
        <Icon className="w-3.5 h-3.5" />
        {label}
    </label>
    <input 
      type="number" 
      step={step}
      value={value} 
      onChange={e => onChange(Number(e.target.value))}
      className="w-full h-14 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 text-xs font-mono text-slate-900 dark:text-slate-100 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all shadow-sm"
    />
  </div>
);