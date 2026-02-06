import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, ReferenceLine, ReferenceArea, ReferenceDot 
} from 'recharts';
import { AlgorithmType } from '../../types';
import { compileMathFunction } from '../../utils/mathUtils';
import { 
  AlertCircle,
  Zap, Activity, 
  Compass, Binary, 
  Settings as SettingsIcon,
  ListOrdered, Download,
  Trash2,
  Grid3X3,
  Move,
  Target,
  Clock,
  Percent,
  TrendingUp,
  MousePointer2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Search,
  ArrowRightLeft,
  ScanLine
} from 'lucide-react';

// --- Local Helpers for Input Validation ---
const isValidPartialNumeric = (val: string) => {
  if (val === '') return true;
  return /^-?\d*\.?\d*$/.test(val);
};

const isCompleteNumber = (val: string) => {
  if (val === '' || val === '-') return false;
  return !isNaN(Number(val));
};

// --- Interfaces ---
export interface IterationData {
  iter: number;
  a?: number;
  b?: number;
  c?: number; // For Muller
  x: number;
  fx: number;
  error?: number;
}

export interface Bracket {
  low: number;
  high: number;
}

interface RootsDemoProps {
  type: AlgorithmType;
}

export const RootsDemo: React.FC<RootsDemoProps> = ({ type }) => {
  // Graph Preferences
  const [showGrid, setShowGrid] = useState(true);
  const [showAxes, setShowAxes] = useState(true);
  const [showTooltip, setShowTooltip] = useState(true);
  const [showPoints, setShowPoints] = useState(true);
  const [zoom, setZoom] = useState(1);

  // Input states
  const [funcStr, setFuncStr] = useState('x^2 - 4');
  const [p1Str, setP1Str] = useState('0'); 
  const [p2Str, setP2Str] = useState('4');
  const [p3Str, setP3Str] = useState('2');
  const [maxIterStr, setMaxIterStr] = useState('50');
  const [toleranceStr, setToleranceStr] = useState('0.000001');
  
  // Internal scan state
  const [isScanning, setIsScanning] = useState(false);
  const [scanRange, setScanRange] = useState({ start: '-10', end: '10', step: '0.2' });
  const [foundBrackets, setFoundBrackets] = useState<Bracket[]>([]);
  const [showScanner, setShowScanner] = useState(false);

  // Result states
  const [iterations, setIterations] = useState<IterationData[]>([]);
  const [root, setRoot] = useState<number | null>(null);
  const [selectedIterIndex, setSelectedIterIndex] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  // Algorithm Flags
  const isFixedPoint = type === AlgorithmType.FIXED_POINT_ITERATION;
  const isIncrementalSearch = type === AlgorithmType.INCREMENTAL_SEARCH;
  const isMuller = type === AlgorithmType.MULLER;
  const isBracketing = type === AlgorithmType.BISECTION || type === AlgorithmType.FALSE_POSITION;

  // Dynamic Labels
  const labels = useMemo(() => {
    switch (type) {
      case AlgorithmType.NEWTON_RAPHSON: return { p1: "Initial Guess (x₀)", p2: null, p3: null };
      case AlgorithmType.SECANT: return { p1: "x₀ (Initial)", p2: "x₁ (Initial)", p3: null };
      case AlgorithmType.FIXED_POINT_ITERATION: return { p1: "Initial Guess (x₀)", p2: null, p3: null };
      case AlgorithmType.INCREMENTAL_SEARCH: return { p1: null, p2: null, p3: null };
      case AlgorithmType.MULLER: return { p1: "x₀", p2: "x₁", p3: "x₂" };
      default: return { p1: "Lower Bound (a)", p2: "Upper Bound (b)", p3: null };
    }
  }, [type]);

  // Sync inputs
  useEffect(() => {
    setErrorMsg(null);
    setIterations([]);
    setRoot(null);
    setSelectedIterIndex(null);
    setFoundBrackets([]);
    setShowScanner(false);
    setZoom(1);
    
    if (type === AlgorithmType.NEWTON_RAPHSON) {
      setFuncStr('x^2 - 4'); setP1Str('3');
    } else if (isFixedPoint) {
      setFuncStr('sqrt(x + 2)'); setP1Str('1.5');
    } else if (isIncrementalSearch) {
      setFuncStr('exp(x) - 3*x'); 
      // Auto-set reasonable defaults for search
      setScanRange({ start: '-5', end: '5', step: '0.1' });
    } else if (isMuller) {
      setFuncStr('x^3 - x - 2'); setP1Str('0'); setP2Str('1'); setP3Str('2');
    } else {
      setFuncStr('x^2 - 4'); setP1Str('0'); setP2Str('4');
    }
  }, [type, isIncrementalSearch, isFixedPoint, isMuller]);

  // Scanner Logic
  const scanIntervals = useCallback(async () => {
    try {
      setIsScanning(true);
      setErrorMsg(null);
      const f = compileMathFunction(funcStr);
      const brackets: Bracket[] = [];
      
      const start = parseFloat(scanRange.start);
      const end = parseFloat(scanRange.end);
      const step = parseFloat(scanRange.step);

      if (isNaN(start) || isNaN(end) || isNaN(step) || step <= 0) {
        throw new Error("Invalid scan parameters");
      }
      
      const stepSize = step;
      let x1 = start;
      let f1 = f(x1);
      let count = 0;
      
      while (x1 < end && count < 10000) {
        count++;
        let x2 = Math.min(x1 + stepSize, end);
        let f2 = f(x2);
        if (isFinite(f1) && isFinite(f2) && f1 * f2 <= 0) {
          brackets.push({ low: x1, high: x2 });
        }
        x1 = x2;
        f1 = f2;
        if (brackets.length > 50) break;
        if (count % 500 === 0) await new Promise(r => setTimeout(r, 0));
      }

      setFoundBrackets(brackets);
      if (isIncrementalSearch) {
        setIterations(brackets.map((b, i) => ({
          iter: i + 1, a: b.low, b: b.high, x: (b.low + b.high) / 2, fx: f((b.low + b.high) / 2)
        } as IterationData)));
      }
      setIsScanning(false);
    } catch (e: any) {
      setErrorMsg(e.message || "Scan failed.");
      setIsScanning(false);
    }
  }, [funcStr, scanRange, isIncrementalSearch]);

  // Solver Logic
  const solve = useCallback(() => {
    if (isIncrementalSearch) { scanIntervals(); return; }
    
    const p1 = Number(p1Str);
    const p2 = Number(p2Str);
    const p3 = Number(p3Str);
    const maxI = parseInt(maxIterStr);
    const tol = Number(toleranceStr);

    if (labels.p1 && !isCompleteNumber(p1Str)) { setErrorMsg("P1 input is incomplete or invalid"); return; }
    if (labels.p2 && !isCompleteNumber(p2Str)) { setErrorMsg("P2 input is incomplete or invalid"); return; }
    if (labels.p3 && !isCompleteNumber(p3Str)) { setErrorMsg("P3 input is incomplete or invalid"); return; }
    
    setErrorMsg(null);
    setIterations([]);
    setRoot(null);
    setZoom(1);

    try {
      const f = compileMathFunction(funcStr);
      const data: IterationData[] = [];
      
      if (isBracketing) {
        let l = p1, h = p2, c = 0, c_old = 0;
        if (f(l) * f(h) > 0) { setErrorMsg("Sign change not detected in interval. Try scanning for brackets."); return; }
        for (let i = 0; i < maxI; i++) {
          const fl = f(l), fh = f(h);
          c = type === AlgorithmType.BISECTION ? (l + h) / 2 : (l * fh - h * fl) / (fh - fl);
          const fc = f(c);
          let ea = i === 0 ? 100 : Math.abs((c - c_old) / c) * 100;
          data.push({ iter: i + 1, a: l, b: h, x: c, fx: fc, error: ea });
          if (Math.abs(fc) < 1e-15 || ea < tol) { setRoot(c); break; }
          c_old = c;
          if (fc * fl <= 0) h = c; else l = c;
        }
      } else if (type === AlgorithmType.NEWTON_RAPHSON) {
        let curr = p1;
        for (let i = 0; i < maxI; i++) {
          const fx = f(curr);
          const dfx = (f(curr + 1e-7) - f(curr - 1e-7)) / 2e-7;
          if (Math.abs(dfx) < 1e-18) break;
          const next = curr - fx / dfx;
          const ea = Math.abs((next - curr) / next) * 100;
          data.push({ iter: i + 1, a: curr, x: next, fx, error: ea });
          if (ea < tol || Math.abs(fx) < 1e-15) { setRoot(next); break; }
          curr = next;
        }
      } else if (isFixedPoint) {
        let curr = p1;
        for (let i = 0; i < maxI; i++) {
          const next = f(curr);
          const ea = Math.abs((next - curr) / next) * 100;
          data.push({ iter: i + 1, a: curr, x: next, fx: next, error: ea });
          if (ea < tol) { setRoot(next); break; }
          curr = next;
        }
      } else if (type === AlgorithmType.SECANT) {
        let x0 = p1, x1 = p2;
        for (let i = 0; i < maxI; i++) {
          const f0 = f(x0), f1 = f(x1);
          if (Math.abs(f1 - f0) < 1e-18) break;
          const x2 = x1 - f1 * (x1 - x0) / (f1 - f0);
          const ea = Math.abs((x2 - x1) / x2) * 100;
          data.push({ iter: i + 1, a: x0, b: x1, x: x2, fx: f(x2), error: ea });
          if (ea < tol || Math.abs(f(x2)) < 1e-15) { setRoot(x2); break; }
          x0 = x1; x1 = x2;
        }
      } else if (isMuller) {
        let x0 = p1, x1 = p2, x2 = p3;
        for (let i = 0; i < maxI; i++) {
          const f0 = f(x0), f1 = f(x1), f2 = f(x2);
          const h1 = x1 - x0, h2 = x2 - x1;
          const d1 = (f1 - f0) / h1, d2 = (f2 - f1) / h2;
          const a_val = (d2 - d1) / (h2 + h1);
          const b_val = a_val * h2 + d2;
          const c_val = f2;
          const disc = Math.sqrt(Math.max(0, b_val * b_val - 4 * a_val * c_val));
          const den = Math.abs(b_val + disc) > Math.abs(b_val - disc) ? b_val + disc : b_val - disc;
          if (Math.abs(den) < 1e-18) break;
          const dx = -2 * c_val / den;
          const x3 = x2 + dx;
          const ea = Math.abs(dx / x3) * 100;
          data.push({ iter: i + 1, a: x0, b: x1, c: x2, x: x3, fx: f(x3), error: ea });
          if (ea < tol || Math.abs(f(x3)) < 1e-15) { setRoot(x3); break; }
          x0 = x1; x1 = x2; x2 = x3;
        }
      }

      setIterations(data);
      if (data.length > 0) {
        setSelectedIterIndex(data.length - 1);
      }
    } catch (e: any) { setErrorMsg(e.message || "Calculation Error."); }
  }, [funcStr, p1Str, p2Str, p3Str, maxIterStr, toleranceStr, type, isBracketing, isFixedPoint, isIncrementalSearch, scanIntervals, labels, isMuller]);

  // Chart Data Preparation
  const { data: chartData, domain: chartDomain } = useMemo(() => {
    try {
      const f = compileMathFunction(funcStr);
      const data = [];
      
      let start = -5; 
      let end = 5;
      
      if (isIncrementalSearch) {
        start = parseFloat(scanRange.start) || -5;
        end = parseFloat(scanRange.end) || 5;
      } else {
        const p1 = Number(p1Str) || 0;
        const p2 = Number(p2Str) || 5;
        let min = Math.min(p1, p2, root || 0);
        let max = Math.max(p1, p2, root || 0);
        if (iterations.length > 0) iterations.forEach(it => { min = Math.min(min, it.x); max = Math.max(max, it.x); });
        start = min;
        end = max;
      }

      let span = Math.max(2, end - start);
      // Apply zoom factor
      span = span / zoom;

      const center = (start + end) / 2;
      const plotStart = center - span * 0.6;
      const plotEnd = center + span * 0.6;
      
      for (let i = 0; i <= 150; i++) {
        const val = plotStart + i * (plotEnd - plotStart) / 150;
        const y = f(val);
        if (isFinite(y) && Math.abs(y) < 1e5) data.push({ x: val, y, yLine: isFixedPoint ? val : undefined });
      }
      return { data, domain: { min: plotStart, max: plotEnd } };
    } catch { return { data: [], domain: { min: -5, max: 5 } }; }
  }, [funcStr, iterations, root, p1Str, p2Str, isFixedPoint, zoom, isIncrementalSearch, scanRange]);

  const activeIter = selectedIterIndex !== null ? iterations[selectedIterIndex] : null;

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto pb-10 animate-in fade-in duration-500">
      
      {/* Grid container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        
        {/* Left Column: Input & Summary */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* --- Logic for INCREMENTAL SEARCH Input --- */}
          {isIncrementalSearch ? (
             <section className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center">
                    <Search size={20} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Domain Analysis Configuration</span>
                </div>

                <div className="flex flex-col gap-6">
                   {/* Equation Input */}
                   <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 font-mono font-black italic text-base">f(x)=</div>
                      <input 
                        type="text" value={funcStr} onChange={e => { setFuncStr(e.target.value); setFoundBrackets([]); }}
                        className="w-full h-14 bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl pl-16 pr-4 font-mono text-sm focus:border-blue-500 outline-none transition-all shadow-inner"
                      />
                   </div>

                   {/* Combined Range Inputs */}
                   <div className="bg-slate-50 dark:bg-slate-950/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2 mb-3 text-slate-400">
                         <ScanLine size={14} />
                         <span className="text-[9px] font-black uppercase tracking-widest">Search Parameters</span>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                         <ModernInput label="Start" value={scanRange.start} onChange={v => setScanRange(s => ({...s, start: v}))} />
                         <ModernInput label="End" value={scanRange.end} onChange={v => setScanRange(s => ({...s, end: v}))} />
                         <ModernInput label="Step" value={scanRange.step} onChange={v => setScanRange(s => ({...s, step: v}))} />
                      </div>
                   </div>

                   {/* Action Button */}
                   <button 
                      onClick={scanIntervals} 
                      disabled={isScanning}
                      className="w-full h-12 bg-blue-600 hover:bg-blue-500 active:scale-[0.98] active:shadow-sm duration-150 text-white font-black rounded-xl transition-all shadow-lg shadow-blue-600/20 text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isScanning ? <Activity className="animate-spin" size={16}/> : <Zap size={16}/>}
                      {isScanning ? 'Scanning...' : 'Analyze Domain'}
                   </button>

                   {/* Result Chips Area (Built into this card for Incremental) */}
                   {foundBrackets.length > 0 && (
                      <div className="pt-6 border-t border-slate-100 dark:border-slate-800 animate-in slide-in-from-top-2">
                         <div className="flex justify-between items-center mb-3">
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Intervals Detected</span>
                            <button onClick={() => setFoundBrackets([])} className="text-slate-400 hover:text-red-500"><Trash2 size={14}/></button>
                         </div>
                         <div className="flex flex-wrap gap-2 max-h-[150px] overflow-y-auto custom-scrollbar">
                           {foundBrackets.map((b, i) => (
                             <div 
                               key={i} 
                               className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-lg text-[10px] font-mono font-bold text-blue-700 dark:text-blue-300"
                             >
                               [{b.low.toFixed(2)}, {b.high.toFixed(2)}]
                             </div>
                           ))}
                         </div>
                      </div>
                   )}
                </div>
             </section>

          ) : (
             /* --- Logic for STANDARD Algorithms (Newton, Bisection, etc.) --- */
            <>
              <section className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-[#10b981]/10 text-emerald-500 flex items-center justify-center">
                    <Binary size={20} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Equation Input</span>
                </div>

                <div className="relative mb-8 group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 font-mono font-black italic text-base">{isFixedPoint ? 'g(x)=' : 'f(x)='}</div>
                  <input 
                    type="text" value={funcStr} onChange={e => { setFuncStr(e.target.value); setFoundBrackets([]); }}
                    className="w-full h-14 bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl pl-16 pr-4 font-mono text-sm focus:border-emerald-500 outline-none transition-all shadow-inner"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  {labels.p1 && <ModernInput label={labels.p1} value={p1Str} onChange={setP1Str} />}
                  {labels.p2 && <ModernInput label={labels.p2} value={p2Str} onChange={setP2Str} />}
                  {labels.p3 && <ModernInput label={labels.p3} value={p3Str} onChange={setP3Str} />}
                </div>

                <div className="flex gap-2 h-14">
                  <button 
                    onClick={solve} 
                    className="flex-[2] h-full bg-emerald-600 hover:bg-emerald-500 active:scale-95 active:shadow-sm duration-150 text-white font-black rounded-2xl shadow-xl shadow-emerald-500/30 transition-all flex items-center justify-center gap-3 text-xs uppercase tracking-[0.2em]"
                  >
                    <Zap size={18} />
                    Solve
                  </button>
                  <button 
                    onClick={() => setShowScanner(!showScanner)} 
                    className={`flex-1 h-full rounded-2xl border-2 flex items-center justify-center gap-2 transition-all active:scale-95 duration-150 ${showScanner ? 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/20' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-500 hover:text-amber-600 hover:border-amber-300'}`}
                    title="Detect Intervals"
                  >
                    <Compass size={18} />
                  </button>
                  <button 
                    onClick={() => setShowSettings(!showSettings)} 
                    className={`w-14 h-full rounded-2xl border-2 flex items-center justify-center transition-all active:scale-95 duration-150 ${showSettings ? 'bg-slate-900 dark:bg-slate-100 border-slate-900 dark:border-slate-100 text-white dark:text-slate-900' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-500 hover:text-slate-900'}`}
                  >
                    <SettingsIcon size={18} />
                  </button>
                </div>

                {showSettings && (
                  <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-4 animate-in slide-in-from-top-4">
                    <ModernInput label="Accuracy (ε)" value={toleranceStr} onChange={setToleranceStr} />
                    <ModernInput label="Max Steps" value={maxIterStr} onChange={setMaxIterStr} />
                  </div>
                )}
              </section>

              {showScanner && (
                <section className="bg-amber-50 dark:bg-amber-900/10 rounded-[2rem] p-6 border border-amber-200 dark:border-amber-900/20 animate-in slide-in-from-top-4">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3 text-amber-700 dark:text-amber-400">
                      <Compass size={18} strokeWidth={2.5} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Bracket Scanner</span>
                    </div>
                    <button onClick={() => setFoundBrackets([])} className="p-1.5 text-amber-400 hover:text-amber-700 transition-transform active:scale-75 duration-150"><Trash2 size={16} /></button>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <ModernInput label="Start" value={scanRange.start} onChange={v => setScanRange(s => ({...s, start: v}))} light />
                    <ModernInput label="End" value={scanRange.end} onChange={v => setScanRange(s => ({...s, end: v}))} light />
                    <ModernInput label="Step" value={scanRange.step} onChange={v => setScanRange(s => ({...s, step: v}))} light />
                  </div>
                  <button 
                    onClick={scanIntervals} 
                    disabled={isScanning}
                    className="w-full h-11 bg-amber-600 hover:bg-amber-500 active:scale-[0.98] active:shadow-sm duration-150 text-white font-black rounded-xl transition-all shadow-lg shadow-amber-600/20 text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isScanning ? 'Scanning...' : 'Detect Intervals'}
                  </button>
                  {foundBrackets.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-2">
                      {foundBrackets.map((b, i) => (
                        <button 
                          key={i} 
                          onClick={() => { setP1Str(b.low.toString()); setP2Str(b.high.toString()); }} 
                          className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/30 rounded-lg text-[9px] font-mono font-bold text-amber-700 hover:bg-amber-50 active:scale-95 active:bg-amber-100 transition-all shadow-sm duration-150"
                        >
                          [{b.low.toFixed(2)}, {b.high.toFixed(2)}]
                        </button>
                      ))}
                    </div>
                  )}
                </section>
              )}
            </>
          )}

          {/* --- Analysis Result Card (Modified for Incremental Search) --- */}
          {(iterations.length > 0 || (isIncrementalSearch && foundBrackets.length > 0)) && (
            <section className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-200 dark:border-slate-800 shadow-sm animate-in fade-in slide-in-from-left-4">
              <div className="flex items-center gap-3 mb-6">
                <Target className={isIncrementalSearch ? "text-blue-500" : "text-emerald-500"} size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {isIncrementalSearch ? "Scan Summary" : "Analysis Result"}
                </span>
              </div>
              
              <div className="space-y-4">
                {isIncrementalSearch ? (
                  /* Incremental Search Specific Metrics */
                  <>
                     <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Intervals Found</p>
                          <p className="text-xl font-mono font-black text-slate-900 dark:text-white">
                             {foundBrackets.length}
                          </p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center">
                           <Search size={20} />
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <ArrowRightLeft size={12} />
                            <span className="text-[8px] font-black uppercase">Search Domain</span>
                          </div>
                          <span className="text-xs font-mono font-black text-slate-900 dark:text-white">
                             [{scanRange.start}, {scanRange.end}]
                          </span>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <ScanLine size={12} />
                            <span className="text-[8px] font-black uppercase">Resolution</span>
                          </div>
                          <span className="text-xs font-mono font-black text-slate-900 dark:text-white">
                             Δx = {scanRange.step}
                          </span>
                        </div>
                     </div>
                  </>
                ) : (
                  /* Standard Solver Metrics */
                  <>
                    <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Final Root Estimate</p>
                      <p className="text-xl font-mono font-black text-slate-900 dark:text-white break-all">
                        {root !== null ? root.toPrecision(12) : iterations[iterations.length-1]?.x.toPrecision(10)}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Clock size={12} />
                          <span className="text-[8px] font-black uppercase">Steps</span>
                        </div>
                        <span className="text-lg font-mono font-black text-slate-900 dark:text-white">{iterations.length}</span>
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Percent size={12} />
                          <span className="text-[8px] font-black uppercase">Rel. Error</span>
                        </div>
                        <span className={`text-sm font-mono font-black ${iterations[iterations.length-1]?.error! < 0.001 ? 'text-emerald-500' : 'text-amber-500'}`}>
                          {iterations[iterations.length-1]?.error?.toFixed(6)}%
                        </span>
                      </div>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <TrendingUp size={12} />
                        <span className="text-[8px] font-black uppercase">Final Residue</span>
                      </div>
                      <span className="text-xs font-mono font-black text-slate-500">
                        {iterations[iterations.length-1]?.fx.toExponential(8)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </section>
          )}

          {errorMsg && (
            <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-2xl flex items-start gap-3 animate-in shake">
              <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
              <p className="text-[10px] font-black text-red-700 dark:text-red-400 leading-tight uppercase tracking-widest">{errorMsg}</p>
            </div>
          )}
        </div>

        {/* Right/Bottom Column: Visualization & Step History */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          <section 
            className="bg-white dark:bg-slate-900 md:rounded-[2.5rem] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden h-[450px] md:h-[550px] select-none"
            tabIndex={-1}
            style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
          >
            {/* Inject Global Styles for Recharts to remove outlines */}
            <style>{`
              .recharts-wrapper { outline: none !important; }
              .recharts-surface { outline: none !important; }
              *:focus { outline: none !important; }
            `}</style>

            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50 backdrop-blur-md shrink-0">
              <div className="flex items-center gap-3">
                <Activity className="text-emerald-500" size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Visual Plot</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-px h-4 bg-slate-200 dark:bg-slate-800 mx-1"></div>
                <ToolbarButton active={false} onClick={() => setZoom(z => Math.max(0.2, z - 0.2))} icon={<ZoomOut size={15} />} />
                <ToolbarButton active={false} onClick={() => setZoom(1)} icon={<RotateCcw size={15} />} />
                <ToolbarButton active={false} onClick={() => setZoom(z => z + 0.2)} icon={<ZoomIn size={15} />} />
                <div className="w-px h-4 bg-slate-200 dark:bg-slate-800 mx-1"></div>
                <ToolbarButton active={showGrid} onClick={() => setShowGrid(!showGrid)} icon={<Grid3X3 size={15} />} />
                <ToolbarButton active={showAxes} onClick={() => setShowAxes(!showAxes)} icon={<Move size={15} />} />
                <ToolbarButton active={showTooltip} onClick={() => setShowTooltip(!showTooltip)} icon={<MousePointer2 size={15} />} />
              </div>
            </div>

            <div className="flex-1 relative outline-none ring-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                  {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.35} />}
                  <XAxis 
                    dataKey="x" 
                    type="number" 
                    domain={[chartDomain.min, chartDomain.max]} 
                    allowDataOverflow 
                    hide={!showAxes} 
                    stroke="#94a3b8" 
                    tick={{ fontSize: 9, fontWeight: 700 }}
                    axisLine={false}
                    tickCount={12}
                  />
                  <YAxis 
                    hide={!showAxes} 
                    stroke="#94a3b8" 
                    tick={{ fontSize: 9, fontWeight: 700 }} 
                    domain={['auto', 'auto']}
                    axisLine={false}
                    tickCount={10}
                  />
                  {showTooltip && (
                    <Tooltip 
                      contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '10px', background: 'rgba(255,255,255,0.98)' }}
                      itemStyle={{ fontWeight: 900, color: '#10b981' }}
                    />
                  )}
                  {showAxes && <ReferenceLine y={0} stroke="#475569" strokeOpacity={0.6} strokeWidth={2} />}
                  {showAxes && <ReferenceLine x={0} stroke="#475569" strokeOpacity={0.6} strokeWidth={1} />}
                  <Line 
                    type="monotone" 
                    dataKey="y" 
                    stroke="#10b981" 
                    strokeWidth={3} 
                    dot={showPoints ? { r: 2, strokeWidth: 0, fill: '#10b981' } : false} 
                    isAnimationActive={false} 
                  />
                  {activeIter && (
                    <>
                      <ReferenceDot x={activeIter.x} y={isFixedPoint ? activeIter.x : 0} r={6} fill="#f59e0b" stroke="#fff" strokeWidth={2} />
                      {(isBracketing || isIncrementalSearch) && activeIter.a !== undefined && activeIter.b !== undefined && (
                        <ReferenceArea x1={activeIter.a} x2={activeIter.b} fill="#3b82f6" fillOpacity={0.06} />
                      )}
                    </>
                  )}
                  {root !== null && (
                    <ReferenceLine x={root} stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" label={{ position: 'top', value: 'ROOT', fill: '#ef4444', fontSize: 9, fontWeight: 900 }} />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Only show History Table if NOT incremental search */}
          {!isIncrementalSearch && (
            <section className="bg-white dark:bg-slate-900 md:rounded-[2.5rem] rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="px-6 md:px-10 py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <ListOrdered className="text-slate-300" size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Step History Matrix</span>
                </div>
                <button 
                    onClick={() => {
                    const csv = iterations.map(it => `${it.iter},${it.x},${it.fx},${it.error}`).join('\n');
                    const blob = new Blob([`Iter,Value,FX,Error\n${csv}`], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a'); a.href = url; a.download = `roots_${type.toLowerCase()}.csv`; a.click();
                    }}
                    className="p-2 text-slate-400 hover:text-emerald-500 transition-all active:scale-90 active:text-emerald-500 duration-150"
                >
                    <Download size={18} />
                </button>
                </div>
                <div className="overflow-x-auto max-h-[500px]">
                <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead className="sticky top-0 bg-slate-50 dark:bg-slate-950 text-[9px] font-black uppercase text-slate-400 tracking-[0.25em] border-b border-slate-100 dark:border-slate-800 z-10">
                    <tr>
                        <th className="px-8 py-4">Step</th>
                        <th className="px-8 py-4">Value (x)</th>
                        <th className="px-8 py-4 text-right">Rel Error</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800 text-xs font-mono">
                    {iterations.map((row, i) => (
                        <tr 
                        key={i} 
                        onClick={() => setSelectedIterIndex(i)} 
                        className={`cursor-pointer transition-colors ${selectedIterIndex === i ? 'bg-emerald-50/50 dark:bg-emerald-900/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                        >
                        <td className="px-8 py-4 text-slate-400 font-bold">{row.iter}</td>
                        <td className="px-8 py-4 font-black text-slate-900 dark:text-slate-100 tracking-tight">{row.x.toPrecision(10)}</td>
                        <td className="px-8 py-4 text-right">
                            <span className={`px-2 py-1 rounded-lg font-black text-[9px] ${row.error !== undefined && row.error < 0.1 ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                            {row.error?.toFixed(6)}%
                            </span>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

// UI Components

const ToolbarButton = ({ active, onClick, icon }: { active: boolean, onClick: () => void, icon: React.ReactNode }) => (
  <button 
    onClick={onClick}
    className={`p-2 rounded-lg transition-all active:scale-90 duration-150 border outline-none ring-0 ${
      active 
      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 border-emerald-500' 
      : 'bg-white dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border-slate-100 dark:border-slate-700'
    }`}
  >
    {icon}
  </button>
);

const ModernInput = ({ label, value, onChange, light = false }: { label: string, value: string, onChange: (v: string) => void, light?: boolean }) => (
  <div className="flex flex-col gap-1.5 group">
    <label className={`text-[9px] font-black uppercase tracking-widest transition-colors ml-1 ${light ? 'text-amber-700/60' : 'text-slate-400 group-focus-within:text-emerald-500'}`}>{label}</label>
    <input 
      type="text" value={value} 
      spellCheck={false}
      onChange={e => isValidPartialNumeric(e.target.value) && onChange(e.target.value)}
      className={`h-11 border-2 rounded-xl px-4 text-xs font-mono outline-none transition-all shadow-sm ${light ? 'bg-white dark:bg-slate-900 border-amber-200 dark:border-amber-900/30 focus:border-amber-500' : 'bg-white dark:bg-slate-950 border-slate-50 dark:border-slate-800/50 focus:border-emerald-500'}`}
    />
  </div>
);