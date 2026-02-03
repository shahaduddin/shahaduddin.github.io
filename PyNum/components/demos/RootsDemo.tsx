import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceArea, ReferenceDot } from 'recharts';
import { AlgorithmType } from '../../types';
import { compileMathFunction } from '../../utils/mathUtils';
import { 
  AlertCircle, Crosshair, PlayCircle, Search, 
  Wand2, ArrowRightCircle, Zap, Activity, CheckCircle2, 
  Compass, Info, Binary, RotateCcw, ChevronDown, ListOrdered,
  Settings as SettingsIcon, Sliders, Layout, Sparkles, X, Lightbulb
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
  const [p3, setP3] = useState<number>(2); // For Muller
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

  useEffect(() => {
    setIterations([]);
    setRoot(null);
    setSelectedIterIndex(null);
    setErrorMsg(null);
    setFoundBrackets([]);
    setIsScanning(false);
    setLastSetBracket(null);
    setShowSettings(false);
    
    if (type === AlgorithmType.NEWTON_RAPHSON) {
      setFuncStr('x^2 - 4');
      setP1(2);
    } else if (type === AlgorithmType.FIXED_POINT_ITERATION) {
      setFuncStr('1 + 1/x');
      setP1(1.5);
    } else if (isIncrementalSearch) {
      setFuncStr('exp(x) - 3x');
      setSearchRange({ start: -5, end: 5, step: 0.2 });
    } else if (isMuller) {
        setFuncStr('x^3 - x - 2');
        setP1(0); setP2(1); setP3(2);
    } else {
      setFuncStr('x^2 - 4');
      setP1(0);
      setP2(4);
    }
  }, [type]);

  const labels = useMemo(() => {
    switch (type) {
      case AlgorithmType.NEWTON_RAPHSON:
        return { p1: "Initial Guess (x₀)", p2: null, p3: null };
      case AlgorithmType.SECANT:
        return { p1: "x₀ (Initial)", p2: "x₁ (Initial)", p3: null };
      case AlgorithmType.FIXED_POINT_ITERATION:
        return { p1: "Initial Guess (x₀)", p2: null, p3: null };
      case AlgorithmType.INCREMENTAL_SEARCH:
        return { p1: null, p2: null, p3: null };
      case AlgorithmType.MULLER:
        return { p1: "x₀", p2: "x₁", p3: "x₂" };
      default:
        return { p1: "Lower Bound (a)", p2: "Upper Bound (b)", p3: null };
    }
  }, [type]);

  const scanForBrackets = async () => {
    try {
      setIsScanning(true);
      setErrorMsg(null);
      setLastSetBracket(null);
      const f = compileMathFunction(funcStr) as (val: number) => number;
      const brackets: Bracket[] = [];
      
      const startX = searchRange.start;
      const endX = searchRange.end;
      const stepSize = Math.max(0.01, searchRange.step);
      
      let x1 = startX;
      let f1: number;
      
      try {
        f1 = f(x1);
      } catch {
        f1 = NaN;
      }

      while (x1 < endX) {
        let x2 = Math.min(x1 + stepSize, endX);
        let f2: number;
        try {
          f2 = f(x2);
        } catch {
          f2 = NaN;
        }

        if (!isNaN(f1) && !isNaN(f2) && isFinite(f1) && isFinite(f2)) {
          if (f1 * f2 <= 0) {
            if (f1 !== 0 || x1 === startX) {
               brackets.push({ low: x1, high: x2 });
            }
          }
        }
        
        x1 = x2;
        f1 = f2;
        
        if (brackets.length > 100) break; 
        if (Math.abs(x1 % (stepSize * 10)) < 1e-10) await new Promise(r => setTimeout(r, 0));
      }

      setFoundBrackets(brackets);
      
      if (isIncrementalSearch) {
          setIterations(brackets.map((b, i) => ({
              iter: i + 1,
              a: b.low,
              b: b.high,
              fa: f(b.low),
              fb: f(b.high),
              x: (b.low + b.high) / 2, 
              fx: f((b.low + b.high) / 2)
          })));
          if (brackets.length > 0) {
            setSelectedIterIndex(0);
            setRoot(null);
          } else {
            setErrorMsg("No intervals with sign changes located in this domain.");
          }
      } else if (brackets.length === 0) {
          setErrorMsg("Scan complete: No potential roots detected in this range.");
      }
      setIsScanning(false);
    } catch (e) {
      setErrorMsg("Scanner Error: Failed to evaluate function over range.");
      setIsScanning(false);
    }
  };

  const solve = () => {
    if (isIncrementalSearch) {
        scanForBrackets();
        return;
    }

    setErrorMsg(null);
    setIterations([]);
    setRoot(null);
    setSelectedIterIndex(null);

    try {
      const f = compileMathFunction(funcStr) as (val: number) => number;
      const iterData: IterationData[] = [];
      
      if (isBracketing) {
        let low = Math.min(p1, p2);
        let high = Math.max(p1, p2);
        let c = 0;
        let c_old = 0;

        if (f(low) * f(high) > 0) {
          setErrorMsg("Sign change not detected between bounds. Try 'Find Brackets'.");
          return;
        }

        for (let i = 0; i < maxIter; i++) {
          if (type === AlgorithmType.BISECTION) {
            c = (low + high) / 2;
          } else {
             const flow = f(low);
             const fhigh = f(high);
             if (Math.abs(fhigh - flow) < 1e-18) {
                 setErrorMsg("Numerical failure: Flat slope (f(b) ≈ f(a)).");
                 break;
             }
             c = (low * fhigh - high * flow) / (fhigh - flow);
          }

          const fc = f(c);
          let ea = 0;
          if (i > 0) ea = Math.abs((c - c_old) / c) * 100;

          iterData.push({ 
            iter: i + 1, 
            a: low, 
            b: high, 
            fa: f(low),
            fb: f(high),
            x: c, 
            fx: fc, 
            error: i === 0 ? undefined : ea 
          });

          if (Math.abs(fc) < 1e-15 || (i > 0 && ea < tolerance)) {
             setRoot(c);
             break;
          }

          c_old = c;
          if (fc * f(low) <= 0) high = c;
          else low = c;
        }
        if (iterData.length === maxIter && !root) setRoot(c);
      } 
      else if (type === AlgorithmType.NEWTON_RAPHSON) {
        const h_deriv = 1e-5;
        const df = (v: number) => (f(v + h_deriv) - f(v - h_deriv)) / (2 * h_deriv);
        let curr = p1;
        
        for (let i = 0; i < maxIter; i++) {
          const fx = f(curr);
          const dfx = df(curr);
          
          if (Math.abs(dfx) < 1e-12) {
              setErrorMsg("Stalled: Derivative is zero (inflection point).");
              break;
          }
          
          const next = curr - fx / dfx;
          const ea = Math.abs((next - curr) / next) * 100;

          iterData.push({
            iter: i + 1, a: curr, x: next, fx: fx, dfx: dfx, error: ea
          });

          if (ea < tolerance) {
            setRoot(next);
            break;
          }
          curr = next;
        }
      }
      else if (type === AlgorithmType.SECANT) {
        let x0 = p1;
        let x1 = p2;
        
        for (let i = 0; i < maxIter; i++) {
            const fx0 = f(x0);
            const fx1 = f(x1);

            if (Math.abs(fx1 - fx0) < 1e-15) {
                 setErrorMsg("Failure: Secant points resulted in zero denominator.");
                 break;
            }

            const x2 = x1 - fx1 * (x1 - x0) / (fx1 - fx0);
            const ea = Math.abs((x2 - x1) / x2) * 100;

            iterData.push({ 
                iter: i + 1, a: x0, b: x1, x: x2, fx: f(x2), error: ea 
            });

            if (ea < tolerance) {
                setRoot(x2);
                break;
            }
            x0 = x1;
            x1 = x2;
        }
      } 
      else if (isMuller) {
        let x0 = p1, x1 = p2, x2 = p3;
        for (let i = 0; i < maxIter; i++) {
            const f0 = f(x0), f1 = f(x1), f2 = f(x2);
            const h1 = x1 - x0, h2 = x2 - x1;
            const d1 = (f1 - f0) / h1, d2 = (f2 - f1) / h2;
            const a_coef = (d2 - d1) / (h2 + h1);
            const b_coef = a_coef * h2 + d2;
            const c_coef = f2;
            
            const disc = Math.sqrt(Math.max(0, b_coef * b_coef - 4 * a_coef * c_coef));
            const den = Math.abs(b_coef + disc) > Math.abs(b_coef - disc) ? b_coef + disc : b_coef - disc;
            
            if (Math.abs(den) < 1e-18) {
                setErrorMsg("Muller failure: Quadratic roots could not be computed.");
                break;
            }
            
            const dx = -2 * c_coef / den;
            const x3 = x2 + dx;
            const ea = Math.abs(dx / x3) * 100;

            iterData.push({
                iter: i + 1, a: x0, b: x1, c: x2, x: x3, fx: f(x3), error: ea
            });

            if (ea < tolerance) {
                setRoot(x3);
                break;
            }
            x0 = x1; x1 = x2; x2 = x3;
        }
      }
      else if (type === AlgorithmType.FIXED_POINT_ITERATION) {
          let curr = p1;
          for (let i = 0; i < maxIter; i++) {
              const next = f(curr);
              const ea = Math.abs((next - curr) / next) * 100;
              
              iterData.push({
                  iter: i + 1, a: curr, x: next, fx: next, error: ea
              });

              if (ea < tolerance) {
                  setRoot(next);
                  break;
              }
              if (!isFinite(next)) {
                  setErrorMsg("Divergence: Values are becoming infinite.");
                  break;
              }
              curr = next;
          }
      }
      setIterations(iterData);
      if (iterData.length > 0) setSelectedIterIndex(iterData.length - 1);
    } catch (e) {
      setErrorMsg("Error: Invalid expression or mathematical domain violation.");
    }
  };

  const applyBracket = (b: Bracket, index: number) => {
    const mid = (b.low + b.high) / 2;
    
    // Intelligently set the inputs based on the algorithm's requirements
    if (isBracketing || isSecant) {
      setP1(b.low);
      setP2(b.high);
    } else if (isMuller) {
      setP1(b.low);
      setP2(mid);
      setP3(b.high);
    } else if (isNewton || isFixedPoint) {
      setP1(mid);
    }

    setLastSetBracket(index);
    setErrorMsg(null);
    
    // Auto-trigger solve for relevant methods after applying
    if (!isIncrementalSearch) {
      setTimeout(() => solve(), 50);
    }
  };

  const chartData = useMemo(() => {
    try {
      const f = compileMathFunction(funcStr) as (val: number) => number;
      const data = [];
      let start = isIncrementalSearch ? searchRange.start : p1; 
      let end = isIncrementalSearch ? searchRange.end : (p2 || p1 + 5);

      if (iterations.length > 0 && !isIncrementalSearch) {
         const allX = iterations.map(i => i.x).concat([p1, p2 || p1]);
         iterations.forEach(iter => { if(iter.a !== undefined) allX.push(iter.a) });
         start = Math.min(...allX);
         end = Math.max(...allX);
      }
      
      const range = Math.abs(end - start) || 5;
      const padding = isIncrementalSearch ? range * 0.1 : Math.max(range * 0.4, 2);
      start -= padding;
      end += padding;

      const stepCount = 300;
      const stepSize = (end - start) / stepCount;
      for (let i = 0; i <= stepCount; i++) {
        const val = start + i * stepSize;
        try {
            const y = f(val);
            if (isFinite(y)) {
                data.push({ 
                    x: Number(val.toFixed(4)), 
                    y: y,
                    yLine: isFixedPoint ? val : undefined 
                });
            }
        } catch { }
      }
      return data;
    } catch (e) {
      return [];
    }
  }, [funcStr, p1, p2, type, iterations, isFixedPoint, isIncrementalSearch, searchRange]);

  const activeIter = selectedIterIndex !== null ? iterations[selectedIterIndex] : null;

  const vizLines = useMemo(() => {
    if (!activeIter || isIncrementalSearch) return null;
    try {
        const f = compileMathFunction(funcStr) as (v:number)=>number;
        if (type === AlgorithmType.FALSE_POSITION || type === AlgorithmType.SECANT) {
             if (activeIter.a === undefined || activeIter.b === undefined) return null;
             return [{ x: activeIter.a, y: f(activeIter.a) }, { x: activeIter.b, y: f(activeIter.b) }];
        }
        if (type === AlgorithmType.NEWTON_RAPHSON) {
            if (activeIter.a === undefined) return null;
            return [{ x: activeIter.a, y: activeIter.fx }, { x: activeIter.x, y: 0 }];
        }
        if (type === AlgorithmType.FIXED_POINT_ITERATION) {
             if (activeIter.a === undefined) return null;
             return [
                 { x: activeIter.a, y: activeIter.a }, 
                 { x: activeIter.a, y: activeIter.x },
                 { x: activeIter.x, y: activeIter.x }
             ]; 
        }
    } catch { return null; }
    return null;
  }, [activeIter, funcStr, type, isIncrementalSearch]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Control Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm transition-colors">
        <div className="max-w-6xl mx-auto space-y-8">
            
            {/* Input & Main Button Group */}
            <div className="flex flex-col md:flex-row gap-6 items-end">
                <div className="flex-1 space-y-3 w-full">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2 px-1">
                        <Binary className="w-3.5 h-3.5 text-emerald-500" />
                        {isFixedPoint ? "Mapping x = g(x)" : "Equation f(x) = 0"}
                    </label>
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 font-mono text-sm font-black italic">
                            {isFixedPoint ? "g(x) =" : "f(x) =" }
                        </div>
                        <input 
                            type="text" 
                            className="w-full h-12 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl pl-20 pr-4 text-sm text-slate-900 dark:text-slate-100 font-mono focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all shadow-inner"
                            onChange={(e) => {
                                setFuncStr(e.target.value);
                                setFoundBrackets([]);
                            }}
                            value={funcStr}
                        />
                    </div>
                </div>

                <div className="flex gap-2.5 w-full md:w-auto shrink-0">
                    <button 
                        onClick={() => setShowSettings(!showSettings)}
                        className={`w-12 h-12 flex items-center justify-center rounded-xl border transition-all active:scale-90 shadow-sm ${showSettings ? 'bg-emerald-600 border-emerald-600 text-white shadow-emerald-500/20' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-emerald-500'}`}
                        title="Advanced Settings"
                    >
                        <SettingsIcon className={`w-5 h-5 transition-transform duration-500 ${showSettings ? 'rotate-90' : ''}`} />
                    </button>
                    <button 
                        onClick={solve}
                        disabled={isScanning}
                        className="flex-1 md:flex-none h-12 px-8 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl shadow-lg shadow-emerald-600/20 active:scale-95 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 text-[11px] uppercase tracking-widest"
                    >
                        {isIncrementalSearch ? <Search className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                        {isIncrementalSearch ? 'Scan' : 'Solve'}
                    </button>
                    <button 
                        onClick={() => { setIterations([]); setRoot(null); setErrorMsg(null); setFoundBrackets([]); }}
                        className="w-12 h-12 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-red-500 rounded-xl transition-all active:scale-90 flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-sm"
                        title="Reset All"
                    >
                        <RotateCcw className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Parameter & Quick Utility Bar */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                    {labels.p1 && <InputGroup label={labels.p1} value={p1} onChange={setP1} />}
                    {labels.p2 && <InputGroup label={labels.p2} value={p2} onChange={setP2} />}
                    {labels.p3 && <InputGroup label={labels.p3} value={p3} onChange={setP3} />}
                </div>
                
                <div className="flex flex-col pt-1 w-full md:w-auto">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-3 px-1">{isIncrementalSearch ? "" : "Root Assistance"}</p>
                    <div className="flex flex-wrap gap-3">
                        {isBracketing && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                               <div className="flex flex-col gap-1.5 min-w-[100px]">
                                 <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Lower Bound</label>
                                 <input type="number" value={searchRange.start} onChange={v => setSearchRange({...searchRange, start: Number(v.target.value)})} className="w-full h-11 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 text-xs font-mono text-center outline-none focus:border-emerald-500 shadow-sm" placeholder="Start" />
                               </div>
                               <div className="flex flex-col gap-1.5 min-w-[100px]">
                                 <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Upper Bound</label>
                                 <input type="number" value={searchRange.end} onChange={v => setSearchRange({...searchRange, end: Number(v.target.value)})} className="w-full h-11 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 text-xs font-mono text-center outline-none focus:border-emerald-500 shadow-sm" placeholder="End" />
                               </div>
                            </div>
                        )}
                        {!isIncrementalSearch && (
                           <button 
                              onClick={scanForBrackets}
                              disabled={isScanning}
                              className="h-11 flex items-center gap-2 px-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-xl border border-emerald-100 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-all font-black text-[10px] uppercase tracking-wider shadow-sm"
                           >
                              {isScanning ? <Activity className="w-3.5 h-3.5 animate-spin" /> : <Compass className="w-3.5 h-3.5" />}
                              {isScanning ? 'Scanning...' : 'Find Brackets'}
                           </button>
                        )}
                    </div>
                </div>
            </div>

            {/* In-Line Scan Results */}
            {foundBrackets.length > 0 && !isIncrementalSearch && (
                <div className="mt-4 p-6 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800 animate-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-amber-500" />
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">Located Intervals</h4>
                        </div>
                        <button onClick={() => setFoundBrackets([])} className="p-1 hover:bg-red-50 rounded"><X className="w-3 h-3 text-slate-400" /></button>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                        {foundBrackets.map((b, i) => (
                            <button 
                                key={i}
                                onClick={() => applyBracket(b, i)}
                                className={`group flex items-center gap-3 px-4 py-2.5 rounded-xl border-2 transition-all ${lastSetBracket === i ? 'bg-emerald-600 border-emerald-600 text-white shadow-md' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-emerald-400'}`}
                            >
                                <span className="text-xs font-mono font-black">[{b.low.toFixed(2)}, {b.high.toFixed(2)}]</span>
                                {lastSetBracket === i ? <CheckCircle2 className="w-3 h-3" /> : <ArrowRightCircle className="w-3 h-3 opacity-20 group-hover:opacity-100" />}
                            </button>
                        ))}
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase italic">
                        <Lightbulb className="w-3 h-3" />
                        Tip: Click an interval to auto-populate parameters and solve.
                    </div>
                </div>
            )}

            {/* Advanced Settings Drawer */}
            {showSettings && (
                <div className="p-6 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-200 dark:border-slate-800 animate-in slide-in-from-top-4 duration-500">
                    {isIncrementalSearch ? (
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <Compass className="w-4 h-4 text-emerald-500" />
                                <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">Domain Configuration</h4>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Lower Bound</label>
                                    <input type="number" value={searchRange.start} onChange={v => setSearchRange({...searchRange, start: Number(v.target.value)})} className="w-full h-11 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 text-xs font-mono text-center outline-none focus:border-emerald-500 shadow-sm" placeholder="Start" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Upper Bound</label>
                                    <input type="number" value={searchRange.end} onChange={v => setSearchRange({...searchRange, end: Number(v.target.value)})} className="w-full h-11 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 text-xs font-mono text-center outline-none focus:border-emerald-500 shadow-sm" placeholder="End" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Step Size</label>
                                    <input type="number" step="0.1" value={searchRange.step} onChange={v => setSearchRange({...searchRange, step: Number(v.target.value)})} className="w-full h-11 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 text-xs font-mono text-center outline-none focus:border-emerald-500 shadow-sm" placeholder="Step" />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <Sliders className="w-4 h-4 text-blue-500" />
                                    <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">Solver Precision</h4>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <InputGroup label="Tolerance (ε)" value={tolerance} onChange={setTolerance} step={0.000001} />
                                    <InputGroup label="Max Steps" value={maxIter} onChange={setMaxIter} />
                                </div>
                            </div>

                            <div className="space-y-6 lg:border-l lg:border-slate-200 lg:dark:border-slate-800 lg:pl-10">
                                <div className="flex items-center gap-3">
                                    <Compass className="w-4 h-4 text-emerald-500" />
                                    <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">Scanner Bounds</h4>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    <InputGroup label="Start" value={searchRange.start} onChange={v => setSearchRange({...searchRange, start: v})} />
                                    <InputGroup label="End" value={searchRange.end} onChange={v => setSearchRange({...searchRange, end: v})} />
                                    <InputGroup label="Step" value={searchRange.step} onChange={v => setSearchRange({...searchRange, step: v})} step={0.1} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>

        {errorMsg && (
            <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-5 py-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 shadow-sm max-w-6xl mx-auto">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                <div className="flex-1">
                    <span className="text-[11px] font-black uppercase tracking-tight">{errorMsg}</span>
                </div>
            </div>
        )}
      </div>

      {/* Main Analysis Display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[520px] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-2 relative overflow-hidden shadow-sm transition-colors group">
            <div className="w-full h-full p-4">
                <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} />
                    <XAxis dataKey="x" stroke="#94a3b8" type="number" domain={['auto', 'auto']} tickFormatter={(v) => v.toFixed(1)} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 600}} />
                    <YAxis stroke="#94a3b8" tickFormatter={(v) => v.toPrecision(2)} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 600}} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.98)', borderColor: '#e2e8f0', borderRadius: '18px', fontSize: '11px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', backdropFilter: 'blur(8px)', border: '1px solid #f1f5f9' }}
                        itemStyle={{ color: '#059669', fontWeight: 700 }}
                        formatter={(val: number) => typeof val === 'number' ? val.toFixed(8) : val}
                        labelFormatter={(label) => `Coord x: ${Number(label).toFixed(4)}`}
                    />
                    <ReferenceLine y={0} stroke="#94a3b8" strokeWidth={2} strokeOpacity={0.3} />
                    <Line type="monotone" dataKey="y" stroke="#10b981" strokeWidth={4} dot={false} isAnimationActive={false} />
                    
                    {isFixedPoint && (
                        <Line type="monotone" dataKey="yLine" stroke="#94a3b8" strokeDasharray="5 5" strokeWidth={1} dot={false} isAnimationActive={false} />
                    )}
                    
                    {activeIter && (
                        <>
                            {(isBracketing || isIncrementalSearch || isMuller) && activeIter.a !== undefined && activeIter.b !== undefined && (
                                <ReferenceArea x1={activeIter.a} x2={activeIter.b} fill="#3b82f6" fillOpacity={0.08} stroke="#3b82f6" strokeOpacity={0.2} strokeDasharray="3 3" />
                            )}
                            {vizLines && (
                                !isFixedPoint ? (
                                    <ReferenceLine segment={vizLines as any} stroke="#ec4899" strokeDasharray="4 4" strokeWidth={2} />
                                ) : (
                                    <>
                                    <ReferenceLine segment={[vizLines[0], vizLines[1]]} stroke="#ec4899" strokeWidth={2} />
                                    <ReferenceLine segment={[vizLines[1], vizLines[2]]} stroke="#ec4899" strokeWidth={2} />
                                    </>
                                )
                            )}
                            <ReferenceDot x={activeIter.x} y={isFixedPoint ? activeIter.x : 0} r={7} fill="#f59e0b" stroke="white" strokeWidth={3} />
                            {!isFixedPoint && !isIncrementalSearch && <ReferenceLine x={activeIter.x} stroke="#f59e0b" strokeDasharray="3 3" strokeOpacity={0.6} />}
                            {(type === AlgorithmType.NEWTON_RAPHSON || isMuller) && activeIter.a !== undefined && (
                                <ReferenceDot x={activeIter.a} y={activeIter.fx} r={5} fill="#ec4899" stroke="white" strokeWidth={2} />
                            )}
                        </>
                    )}

                    {root !== null && !activeIter && (
                        <ReferenceLine x={root} stroke="#ef4444" strokeWidth={3} label={{ position: 'top', value: 'ROOT FOUND', fill: '#ef4444', fontSize: 10, fontWeight: 900, letterSpacing: '0.1em' }} />
                    )}
                </LineChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="flex flex-col gap-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 text-slate-900 dark:text-white shadow-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden flex-1 group transition-colors">
                <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                   <Activity className="w-48 h-48 text-emerald-400 rotate-12" />
                </div>

                <div className="relative z-10 flex flex-col h-full">
                    <h3 className="text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
                        <Crosshair className="w-4 h-4" />
                        Computational Metrics
                    </h3>
                    
                    {iterations.length > 0 ? (
                        <div className="space-y-10 flex-1">
                            <div>
                                <span className="text-slate-400 dark:text-slate-500 text-[10px] block mb-2 font-black uppercase tracking-widest">
                                    {isIncrementalSearch ? "Valid Brackets Located" : "Root Approximation"}
                                </span>
                                <div className="text-5xl font-mono font-black tracking-tighter break-all text-slate-900 dark:text-white">
                                    {isIncrementalSearch ? iterations.length : iterations[iterations.length-1].x?.toFixed(8)}
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-50 dark:bg-white/5 backdrop-blur-sm p-5 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm">
                                    <span className="text-slate-400 text-[9px] uppercase block mb-1 font-black tracking-widest leading-none">
                                        {isIncrementalSearch ? 'Total Found' : 'Cycles'}
                                    </span>
                                    <span className="text-emerald-600 dark:text-emerald-400 font-mono text-3xl font-black">{iterations.length}</span>
                                </div>
                                <div className="bg-slate-50 dark:bg-white/5 backdrop-blur-sm p-5 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm">
                                    <span className="text-slate-400 text-[9px] uppercase block mb-1 font-black tracking-widest leading-none">{isIncrementalSearch ? 'Logic' : 'Integrity'}</span>
                                    <span className={`font-black text-[11px] uppercase tracking-wider ${(iterations[iterations.length-1].error || 0) < 1 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500'}`}>
                                        {isIncrementalSearch ? 'IVT Valid' : 'Verified'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center py-10 text-slate-400 dark:text-slate-700 space-y-4">
                            <Binary className="w-16 h-16 opacity-10 animate-pulse" />
                            <p className="text-[10px] font-black uppercase tracking-[0.3em]">Awaiting Signal Input</p>
                        </div>
                    )}

                    {iterations.length > 0 && (
                        <div className="pt-8 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">
                            <span className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500"></div> System Status: OK
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30 p-6 rounded-3xl flex gap-4 transition-colors">
                <Info className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                    <p className="text-[10px] font-black text-emerald-900 dark:text-emerald-300 uppercase tracking-widest leading-none mb-1">Logic Pattern</p>
                    <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80 font-medium leading-relaxed italic">
                        {isIncrementalSearch 
                          ? "Scans the entire selected domain. Uses the sign of f(x) to identify regions that must contain a zero cross-over point." 
                          : type === AlgorithmType.BISECTION 
                            ? "Guaranteed convergence via the Intermediate Value Theorem. Robust but slow (linear speed)." 
                            : "High-speed solver using local derivative information for parabolic or quadratic precision."}
                    </p>
                </div>
            </div>
        </div>
      </div>

      {/* Step Trace Table */}
      {iterations.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm animate-in slide-in-from-bottom-4 duration-500 transition-colors">
             <div className="px-10 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/50">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-xl shadow-emerald-500/20">
                      <ListOrdered className="w-5 h-5" />
                   </div>
                   <div>
                      <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-[0.2em]">
                          {isIncrementalSearch ? 'Search Results Log' : 'Step-by-Step Convergence'}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          {isIncrementalSearch ? 'Located intervals with guaranteed roots' : 'Detailed iteration path and precision tracking'}
                      </p>
                   </div>
                </div>
             </div>
             
             <div className="overflow-x-auto max-h-[440px] custom-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase bg-slate-50/80 dark:bg-slate-950/80 sticky top-0 z-20 transition-colors backdrop-blur-sm border-b border-slate-100 dark:border-slate-800">
                    <tr>
                        <th className="px-10 py-5 w-24 text-center">{isIncrementalSearch ? 'Region' : 'Step'}</th>
                        {(isBracketing || isIncrementalSearch) ? (
                            <>
                             <th className="px-10 py-5">Node (a)</th>
                             <th className="px-10 py-5">Node (b)</th>
                             <th className="px-10 py-5">Sign Change</th>
                            </>
                        ) : type === AlgorithmType.SECANT ? (
                            <>
                             <th className="px-10 py-5">Node x<sub>i-1</sub></th>
                             <th className="px-10 py-5">Node x<sub>i</sub></th>
                            </>
                        ) : isMuller ? (
                            <>
                             <th className="px-10 py-5">x₀</th>
                             <th className="px-10 py-5">x₁</th>
                             <th className="px-10 py-5">x₂</th>
                            </>
                        ) : type === AlgorithmType.FIXED_POINT_ITERATION ? (
                            <>
                             <th className="px-10 py-5">Node x<sub>i</sub></th>
                             <th className="px-10 py-5">Value g(x<sub>i</sub>)</th>
                            </>
                        ) : (
                            <>
                             <th className="px-10 py-5">Point x<sub>n</sub></th>
                             <th className="px-10 py-5">Value f(x<sub>n</sub>)</th>
                             <th className="px-10 py-5">f'(x<sub>n</sub>)</th>
                            </>
                        )}
                        
                        <th className="px-10 py-5 text-emerald-600 dark:text-emerald-400 bg-emerald-50/20 dark:bg-emerald-900/10">
                            {isIncrementalSearch ? 'Midpoint (Estimate)' : (type === AlgorithmType.NEWTON_RAPHSON || isMuller ? 'Next Est' : (isFixedPoint ? 'Result' : 'Root Est'))}
                        </th>
                        
                        {!isIncrementalSearch && <th className="px-10 py-5 text-right">Rel Error</th>}
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800/40">
                    {iterations.map((row, i) => (
                        <tr 
                            key={i} 
                            onClick={() => setSelectedIterIndex(i)}
                            className={`cursor-pointer transition-all group ${
                                selectedIterIndex === i 
                                ? 'bg-emerald-50 dark:bg-emerald-900/20' 
                                : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/20'
                            }`}
                        >
                            <td className="px-10 py-4 text-center">
                               <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-[11px] font-mono font-black transition-all ${selectedIterIndex === i ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                                  {row.iter}
                               </span>
                            </td>
                            
                            {(isBracketing || type === AlgorithmType.SECANT || isIncrementalSearch) && (
                                <>
                                <td className="px-10 py-4 font-mono text-xs font-bold text-slate-600 dark:text-slate-400">{row.a?.toFixed(4)}</td>
                                <td className="px-10 py-4 font-mono text-xs font-bold text-slate-600 dark:text-slate-400">{row.b?.toFixed(4)}</td>
                                <td className="px-10 py-4">
                                    <div className="flex gap-1.5">
                                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black ${(row.fa || 0) > 0 ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>{(row.fa || 0) > 0 ? '+' : '-'}</span>
                                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black ${(row.fb || 0) > 0 ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>{(row.fb || 0) > 0 ? '+' : '-'}</span>
                                    </div>
                                </td>
                                </>
                            )}
                            {isMuller && (
                                <>
                                <td className="px-10 py-4 font-mono text-xs text-slate-500">{row.a?.toFixed(4)}</td>
                                <td className="px-10 py-4 font-mono text-xs text-slate-500">{row.b?.toFixed(4)}</td>
                                <td className="px-10 py-4 font-mono text-xs text-slate-500">{row.c?.toFixed(4)}</td>
                                </>
                            )}
                            {type === AlgorithmType.NEWTON_RAPHSON && (
                                <>
                                 <td className="px-10 py-4 font-mono text-xs text-slate-600 dark:text-slate-400">{row.a?.toPrecision(5)}</td>
                                 <td className="px-10 py-4 font-mono text-xs text-slate-500">{row.fx?.toExponential(2)}</td>
                                 <td className="px-10 py-4 font-mono text-xs text-slate-500">{row.dfx?.toExponential(2)}</td>
                                </>
                            )}
                            {isFixedPoint && (
                                <>
                                 <td className="px-10 py-4 font-mono text-xs text-slate-600 dark:text-slate-400">{row.a?.toPrecision(5)}</td>
                                 <td className="px-10 py-4 font-mono text-xs text-slate-600 dark:text-slate-400">{row.x?.toPrecision(5)}</td>
                                </>
                            )}

                            <td className="px-10 py-4 font-mono font-black text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50/10 dark:bg-emerald-900/10 rounded-xl shadow-inner">{row.x?.toPrecision(8)}</td>
                            
                            {!isIncrementalSearch && (
                                <td className="px-10 py-4 text-right">
                                    <span className={`text-[10px] font-black font-mono transition-colors ${ (row.error || 100) < 0.1 ? 'text-emerald-600' : 'text-amber-500' }`}>
                                        {row.error !== undefined ? row.error.toPrecision(3) + '%' : '---'}
                                    </span>
                                </td>
                            )}
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

const InputGroup = ({ label, value, onChange, step = 1 }: { label: string, value: number, onChange: (v: number) => void, step?: number }) => (
  <div className="space-y-1.5 flex-1 group">
    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.1em] px-1 truncate block leading-none transition-colors group-focus-within:text-emerald-500">{label}</label>
    <input 
      type="number" 
      step={step}
      value={value} 
      onChange={e => onChange(Number(e.target.value))}
      className="w-full h-11 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 text-xs font-mono text-slate-900 dark:text-slate-100 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all shadow-sm"
    />
  </div>
);

const Crosshair = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/></svg>
);