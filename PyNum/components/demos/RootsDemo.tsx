import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceArea, ReferenceDot, Scatter } from 'recharts';
import { SAMPLE_FUNCTIONS } from '../../constants';
import { AlgorithmType } from '../../types';
import { compileMathFunction } from '../../utils/mathUtils';
import { AlertCircle, MousePointerClick, Crosshair, PlayCircle, Search, Wand2, ArrowRightCircle, Zap, Activity, CheckCircle2 } from 'lucide-react';

interface RootsDemoProps {
  type: AlgorithmType;
}

interface IterationData {
  iter: number;
  a?: number;
  b?: number;
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

export const RootsDemo: React.FC<RootsDemoProps> = ({ type }) => {
  const [funcStr, setFuncStr] = useState(SAMPLE_FUNCTIONS[0].value);
  const [p1, setP1] = useState<number>(0); 
  const [p2, setP2] = useState<number>(4);
  const [p3, setP3] = useState<number>(2); // For Muller
  const [maxIter, setMaxIter] = useState<number>(50);
  const [tolerance, setTolerance] = useState<number>(0.000001);
  
  const [searchRange, setSearchRange] = useState({ start: -10, end: 10, step: 0.5 });
  const [foundBrackets, setFoundBrackets] = useState<Bracket[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [lastSetBracket, setLastSetBracket] = useState<number | null>(null);

  const [iterations, setIterations] = useState<IterationData[]>([]);
  const [root, setRoot] = useState<number | null>(null);
  const [selectedIterIndex, setSelectedIterIndex] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isBracketing = type === AlgorithmType.BISECTION || type === AlgorithmType.FALSE_POSITION;
  const isFixedPoint = type === AlgorithmType.FIXED_POINT_ITERATION;
  const isIncrementalSearch = type === AlgorithmType.INCREMENTAL_SEARCH;
  const isMuller = type === AlgorithmType.MULLER;

  useEffect(() => {
    setIterations([]);
    setRoot(null);
    setSelectedIterIndex(null);
    setErrorMsg(null);
    setFoundBrackets([]);
    setIsScanning(false);
    setLastSetBracket(null);
    
    if (type === AlgorithmType.NEWTON_RAPHSON) {
      setP1(2);
    } else if (type === AlgorithmType.FIXED_POINT_ITERATION) {
      setFuncStr('1 + 1/x');
      setP1(1.5);
    } else if (isIncrementalSearch) {
      setP1(-5);
      setP2(5);
    } else if (isMuller) {
        setP1(0); setP2(1); setP3(2);
    } else {
      setP1(0);
      setP2(4);
    }
  }, [type]);

  const labels = useMemo(() => {
    switch (type) {
      case AlgorithmType.NEWTON_RAPHSON:
        return { p1: "Initial Guess (x0)", p2: null, p3: null };
      case AlgorithmType.SECANT:
        return { p1: "x0 (Initial)", p2: "x1 (Initial)", p3: null };
      case AlgorithmType.FIXED_POINT_ITERATION:
        return { p1: "Initial Guess (x0)", p2: null, p3: null };
      case AlgorithmType.INCREMENTAL_SEARCH:
        return { p1: "Search Start", p2: "Search End", p3: null };
      case AlgorithmType.MULLER:
        return { p1: "x0", p2: "x1", p3: "x2" };
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
      
      const startX = isIncrementalSearch ? p1 : searchRange.start;
      const endX = isIncrementalSearch ? p2 : searchRange.end;
      const stepSize = isIncrementalSearch ? 0.2 : searchRange.step;
      
      let x1 = startX;
      const totalSteps = Math.ceil((endX - startX) / stepSize);
      
      let f1 = f(x1);
      let stepCount = 0;

      while (x1 < endX) {
        let x2 = x1 + stepSize;
        let f2 = f(x2);
        if (f1 * f2 < 0) {
          brackets.push({ low: x1, high: x2 });
        }
        x1 = x2;
        f1 = f2;
        stepCount++;
        setScanProgress((stepCount / totalSteps) * 100);
        if (stepCount % 5 === 0) await new Promise(r => setTimeout(r, 10));
      }

      setFoundBrackets(brackets);
      if (isIncrementalSearch) {
          setIterations(brackets.map((b, i) => ({
              iter: i + 1,
              a: b.low,
              b: b.high,
              x: (b.low + b.high) / 2, 
              fx: f((b.low + b.high) / 2)
          })));
          if (brackets.length > 0) setSelectedIterIndex(0);
      }
      setIsScanning(false);
    } catch (e) {
      setErrorMsg("Invalid function syntax.");
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

        if (f(low) * f(high) >= 0) {
          setErrorMsg("No sign change between bounds. Use 'Auto-find Bounds' to locate a root interval.");
          return;
        }

        for (let i = 0; i < maxIter; i++) {
          if (type === AlgorithmType.BISECTION) {
            c = (low + high) / 2;
          } else {
             const flow = f(low);
             const fhigh = f(high);
             if (Math.abs(fhigh - flow) < 1e-15) {
                 setErrorMsg("Denominator near zero. Method failed.");
                 break;
             }
             c = (low * fhigh - high * flow) / (fhigh - flow);
          }

          const fc = f(c);
          let ea = 0;
          if (i > 0) ea = Math.abs((c - c_old) / c) * 100;

          iterData.push({ 
            iter: i + 1, a: low, b: high, x: c, fx: fc, 
            error: i === 0 ? undefined : ea 
          });

          if (Math.abs(fc) < 1e-15 || (i > 0 && ea < tolerance)) {
             setRoot(c);
             break;
          }

          c_old = c;
          if (fc * f(low) < 0) high = c;
          else low = c;
        }
        if (iterData.length === maxIter && !root) setRoot(c);
      } 
      else if (type === AlgorithmType.NEWTON_RAPHSON) {
        const h = 1e-5;
        const df = (v: number) => (f(v + h) - f(v - h)) / (2 * h);
        let curr = p1;
        
        for (let i = 0; i < maxIter; i++) {
          const fx = f(curr);
          const dfx = df(curr);
          
          if (Math.abs(dfx) < 1e-12) {
              setErrorMsg("Derivative near zero. Calculation aborted.");
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
                 setErrorMsg("Secant slope is zero. Try different initial points.");
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
            const a = (d2 - d1) / (h2 + h1);
            const b = a * h2 + d2;
            const c = f2;
            
            const disc = Math.sqrt(Math.max(0, b * b - 4 * a * c));
            const den = Math.abs(b + disc) > Math.abs(b - disc) ? b + disc : b - disc;
            
            if (Math.abs(den) < 1e-15) {
                setErrorMsg("Muller denominator near zero.");
                break;
            }
            
            const dx = -2 * c / den;
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
                  setErrorMsg("Sequence diverged.");
                  break;
              }
              curr = next;
          }
      }
      setIterations(iterData);
      if (iterData.length > 0) setSelectedIterIndex(iterData.length - 1);
    } catch (e) {
      setErrorMsg("Invalid mathematical expression.");
    }
  };

  const applyBracket = (b: Bracket, index: number) => {
    setP1(b.low);
    setP2(b.high);
    setLastSetBracket(index);
    setTimeout(() => {
        setIsSearching(false);
        setFoundBrackets([]);
        if (isBracketing) solve();
    }, 400);
  };

  const chartData = useMemo(() => {
    try {
      const f = compileMathFunction(funcStr) as (val: number) => number;
      const data = [];
      let start = p1; 
      let end = p2 || p1 + 2;

      if (iterations.length > 0) {
         const allX = iterations.map(i => i.x).concat([p1, p2 || p1]);
         iterations.forEach(iter => { if(iter.a !== undefined) allX.push(iter.a) });
         start = Math.min(...allX);
         end = Math.max(...allX);
      }
      
      const range = Math.abs(end - start) || 1;
      const padding = Math.max(range * 0.3, 2);
      start -= padding;
      end += padding;

      const step = (end - start) / 120;
      for (let val = start; val <= end; val += step) {
        data.push({ 
            x: Number(val.toFixed(2)), 
            y: f(val),
            yLine: isFixedPoint ? val : undefined 
        });
      }
      return data;
    } catch (e) {
      return [];
    }
  }, [funcStr, p1, p2, type, iterations, isFixedPoint]);

  const activeIter = selectedIterIndex !== null ? iterations[selectedIterIndex] : null;

  const vizLines = useMemo(() => {
    if (!activeIter) return null;
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
  }, [activeIter, funcStr, type]);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden transition-colors">
        {isScanning && (
            <div className="absolute inset-x-0 top-0 h-1 bg-emerald-100 dark:bg-emerald-950 overflow-hidden">
                <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${scanProgress}%` }} />
            </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-4 space-y-2">
                <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        {isFixedPoint ? "Function g(x)" : "Function f(x)"}
                    </label>
                    {!isIncrementalSearch && (
                        <button 
                            onClick={() => setIsSearching(!isSearching)}
                            className={`text-[10px] flex items-center gap-1 font-bold transition-all px-2 py-0.5 rounded border ${isSearching ? 'bg-emerald-600 text-white border-emerald-700' : 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 border-emerald-100 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/50'}`}
                        >
                            <Search className="w-3 h-3" />
                            {isSearching ? 'Close Facility' : 'Auto-find Bounds'}
                        </button>
                    )}
                </div>
                <input 
                    type="text" 
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg pl-4 pr-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 font-mono focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                    onChange={(e) => setFuncStr(e.target.value)}
                    value={funcStr}
                />
            </div>
            
            <div className="col-span-4 md:col-span-2 space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">{labels.p1}</label>
                <input 
                    type="number" 
                    value={p1} 
                    onChange={e => setP1(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                />
            </div>

            {labels.p2 && (
                <div className="col-span-4 md:col-span-2 space-y-2">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">{labels.p2}</label>
                    <input 
                        type="number" 
                        value={p2} 
                        onChange={e => setP2(Number(e.target.value))}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                    />
                </div>
            )}

            {labels.p3 && (
                <div className="col-span-4 md:col-span-2 space-y-2">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">{labels.p3}</label>
                    <input 
                        type="number" 
                        value={p3} 
                        onChange={e => setP3(Number(e.target.value))}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                    />
                </div>
            )}

            {!isIncrementalSearch && (
                <div className="col-span-12 md:col-span-2 space-y-2">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tolerance</label>
                    <input 
                        type="number" 
                        value={tolerance} 
                        onChange={e => setTolerance(Number(e.target.value))}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                        step="0.000001"
                    />
                </div>
            )}

            <div className="col-span-12 md:col-span-2 flex items-end">
                <button 
                    onClick={solve}
                    disabled={isScanning}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 px-4 rounded-lg transition-all shadow-md shadow-emerald-600/20 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {isIncrementalSearch ? <Activity className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                    {isIncrementalSearch ? 'Scan Bounds' : 'Find Root'}
                </button>
            </div>
        </div>

        {isSearching && (
            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 animate-in slide-in-from-top-4 duration-500">
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-2">
                             <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded">
                                 <Crosshair className="w-3.5 h-3.5" />
                             </div>
                             <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Auto-find Bounds Facility</h4>
                        </div>
                        <div className="flex flex-wrap items-end gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Search Range</label>
                                <div className="flex items-center gap-1">
                                    <input type="number" className="w-20 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2 py-1 text-xs text-slate-900 dark:text-slate-100" value={searchRange.start} onChange={e=>setSearchRange({...searchRange, start:Number(e.target.value)})}/>
                                    <span className="text-slate-400">to</span>
                                    <input type="number" className="w-20 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2 py-1 text-xs text-slate-900 dark:text-slate-100" value={searchRange.end} onChange={e=>setSearchRange({...searchRange, end:Number(e.target.value)})}/>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Step Size</label>
                                <input type="number" step="0.1" className="w-20 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2 py-1 text-xs text-slate-900 dark:text-slate-100" value={searchRange.step} onChange={e=>setSearchRange({...searchRange, step:Number(e.target.value)})}/>
                            </div>
                            <button 
                                onClick={scanForBrackets}
                                disabled={isScanning}
                                className="bg-slate-800 dark:bg-slate-700 text-white text-[10px] font-bold uppercase px-4 py-2 rounded hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors flex items-center gap-2 active:scale-95 disabled:opacity-50"
                            >
                                {isScanning ? <Activity className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />} 
                                {isScanning ? 'Scanning Range...' : 'Scan for Sign Changes'}
                            </button>
                        </div>
                    </div>
                    
                    <div className="md:w-72 border-l border-slate-100 dark:border-slate-800 pl-6">
                        <label className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase mb-2 block">Scanned Results</label>
                        {foundBrackets.length > 0 ? (
                            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2 pb-2">
                                {foundBrackets.map((b, i) => (
                                    <div key={i} className="flex items-center justify-between bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2 rounded-lg group hover:border-emerald-300 dark:hover:border-emerald-700 transition-all">
                                        <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400">[{b.low.toFixed(2)}, {b.high.toFixed(2)}]</span>
                                        <button 
                                            onClick={() => applyBracket(b, i)}
                                            className={`flex items-center gap-1.5 px-2 py-1 rounded text-[9px] font-bold uppercase transition-all ${lastSetBracket === i ? 'bg-emerald-600 text-white' : 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50'}`}
                                        >
                                            {lastSetBracket === i ? <CheckCircle2 className="w-3 h-3" /> : <ArrowRightCircle className="w-3 h-3" />}
                                            {lastSetBracket === i ? 'Applied' : 'Set Bounds'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-24 flex flex-col items-center justify-center text-slate-300 dark:text-slate-700 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                                <Search className="w-5 h-5 mb-1 opacity-50" />
                                <span className="text-[9px] font-bold uppercase">No brackets found yet</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}
      </div>

      {errorMsg && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 px-4 py-3 rounded-lg flex items-center gap-3 animate-in fade-in shadow-sm">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            <span className="text-sm font-medium">{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[450px] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-1 relative overflow-hidden shadow-sm transition-colors">
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 pointer-events-none">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase bg-white/90 dark:bg-slate-900/90 px-2 py-1 rounded border border-slate-200 dark:border-slate-800 shadow-sm">Functional View</span>
                {activeIter && (
                    <span className="text-xs bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-1 rounded border border-emerald-100 dark:border-emerald-800 font-mono font-medium">
                        {isIncrementalSearch ? `Found Bracket ${activeIter.iter}` : `Step ${activeIter.iter}`}
                    </span>
                )}
            </div>
            
            <div className="w-full h-full p-2">
                <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="x" stroke="#64748b" type="number" domain={['auto', 'auto']} allowDataOverflow tickFormatter={(v) => v.toFixed(2)} tick={{fontSize: 12, fill: '#64748b'}} />
                    <YAxis stroke="#64748b" tickFormatter={(v) => v.toFixed(2)} tick={{fontSize: 12, fill: '#64748b'}} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ color: '#334155' }}
                        formatter={(val: number) => typeof val === 'number' ? val.toFixed(6) : val}
                        labelFormatter={(label) => `x: ${Number(label).toFixed(4)}`}
                    />
                    <ReferenceLine y={0} stroke="#94a3b8" strokeWidth={1} />
                    <Line type="monotone" dataKey="y" stroke="#10b981" strokeWidth={2} dot={false} isAnimationActive={false} />
                    
                    {isFixedPoint && (
                        <Line type="monotone" dataKey="yLine" stroke="#94a3b8" strokeDasharray="5 5" strokeWidth={1} dot={false} isAnimationActive={false} />
                    )}
                    
                    {activeIter && (
                        <>
                            {(isBracketing || isIncrementalSearch || isMuller) && activeIter.a !== undefined && activeIter.b !== undefined && (
                                <ReferenceArea x1={activeIter.a} x2={activeIter.b} fill="#3b82f6" fillOpacity={0.08} />
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
                            <ReferenceDot x={activeIter.x} y={isFixedPoint ? activeIter.x : 0} r={5} fill="#f59e0b" stroke="white" strokeWidth={2} />
                            {!isFixedPoint && !isIncrementalSearch && <ReferenceLine x={activeIter.x} stroke="#f59e0b" strokeDasharray="2 2" strokeOpacity={0.5} />}
                            {(type === AlgorithmType.NEWTON_RAPHSON || isMuller) && activeIter.a !== undefined && (
                                <ReferenceDot x={activeIter.a} y={activeIter.fx} r={4} fill="#ec4899" stroke="white" strokeWidth={2} />
                            )}
                        </>
                    )}

                    {root !== null && !activeIter && (
                        <ReferenceLine x={root} stroke="#ef4444" strokeWidth={2} label={{ position: 'top', value: 'Result', fill: '#ef4444', fontSize: 11, fontWeight: 700 }} />
                    )}
                </LineChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="lg:col-span-1 flex flex-col gap-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between h-full shadow-sm relative overflow-hidden transition-colors">
                <div>
                    <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-6 tracking-widest flex items-center gap-2">
                        <Activity className="w-3.5 h-3.5 text-emerald-500" />
                        Analysis Stats
                    </h3>
                    
                    {iterations.length > 0 ? (
                        <div className="space-y-6">
                            <div>
                                <span className="text-slate-500 dark:text-slate-400 text-xs block mb-1 font-semibold uppercase">
                                    {isIncrementalSearch ? "Scanned Intervals Found" : "Root Estimate"}
                                </span>
                                <span className="text-3xl font-mono text-emerald-600 dark:text-emerald-400 font-bold break-all tracking-tight">
                                    {isIncrementalSearch ? iterations.length : iterations[iterations.length-1].x?.toFixed(6)}
                                </span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors">
                                    <span className="text-slate-400 dark:text-slate-500 text-[10px] uppercase block mb-1 font-bold">
                                        {isIncrementalSearch ? 'Brackets' : 'Steps'}
                                    </span>
                                    <span className="text-slate-700 dark:text-slate-300 font-mono text-xl font-medium">{iterations.length}</span>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors">
                                    <span className="text-slate-400 dark:text-slate-500 text-[10px] uppercase block mb-1 font-bold">Process</span>
                                    <span className={`font-mono text-lg font-bold ${(iterations[iterations.length-1].error || 0) < 0.01 ? 'text-emerald-500' : 'text-amber-500'}`}>
                                        {isIncrementalSearch ? 'Completed' : 'Converged'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-10 text-slate-400 dark:text-slate-600 space-y-3">
                            <Crosshair className="w-12 h-12 opacity-10" />
                            <span className="text-sm font-medium">Calculation pending</span>
                        </div>
                    )}
                </div>
                {iterations.length > 0 && (
                    <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div> Function Curve
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div> Computed Solution
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>

      {iterations.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm animate-in slide-in-from-bottom-2 duration-300 transition-colors">
             <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/50">
                <h3 className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase flex items-center gap-2 tracking-wider">
                    <MousePointerClick className="w-4 h-4 text-emerald-500" />
                    {isIncrementalSearch ? 'Root Location Scan Results' : 'Iteration convergence data'}
                </h3>
             </div>
             <div className="overflow-x-auto max-h-96 custom-scrollbar">
                <table className="w-full text-sm text-left text-slate-600 dark:text-slate-400">
                    <thead className="text-xs text-slate-400 dark:text-slate-500 uppercase bg-slate-50 dark:bg-slate-950 sticky top-0 z-10 font-bold transition-colors">
                    <tr>
                        <th className="px-6 py-4 w-16 text-center">Step</th>
                        {(isBracketing || isIncrementalSearch) ? (
                            <>
                             <th className="px-6 py-4 text-right">Low Bound (a)</th>
                             <th className="px-6 py-4 text-right">High Bound (b)</th>
                            </>
                        ) : type === AlgorithmType.SECANT ? (
                            <>
                             <th className="px-6 py-4 text-right">x<sub>i-1</sub></th>
                             <th className="px-6 py-4 text-right">x<sub>i</sub></th>
                            </>
                        ) : isMuller ? (
                            <>
                             <th className="px-6 py-4 text-right">x<sub>0</sub></th>
                             <th className="px-6 py-4 text-right">x<sub>1</sub></th>
                             <th className="px-6 py-4 text-right">x<sub>2</sub></th>
                            </>
                        ) : type === AlgorithmType.FIXED_POINT_ITERATION ? (
                            <>
                             <th className="px-6 py-4 text-right">x<sub>i</sub></th>
                             <th className="px-6 py-4 text-right">g(x<sub>i</sub>)</th>
                            </>
                        ) : (
                            <>
                             <th className="px-6 py-4 text-right">x<sub>n</sub></th>
                             <th className="px-6 py-4 text-right">f(x<sub>n</sub>)</th>
                             <th className="px-6 py-4 text-right">f'(x<sub>n</sub>)</th>
                            </>
                        )}
                        
                        {!isIncrementalSearch && (
                            <th className="px-6 py-4 text-right text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50/30 dark:bg-emerald-900/10">
                                {type === AlgorithmType.NEWTON_RAPHSON || isMuller ? 'x_{next}' : (isFixedPoint ? 'x_{i+1}' : 'Root estimate')}
                            </th>
                        )}
                        
                        {(type !== AlgorithmType.NEWTON_RAPHSON && !isFixedPoint && !isIncrementalSearch) && <th className="px-6 py-4 text-right">f(x)</th>}
                        {!isIncrementalSearch && <th className="px-6 py-4 text-right">Rel. Error %</th>}
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {iterations.map((row, i) => (
                        <tr 
                            key={i} 
                            onClick={() => setSelectedIterIndex(i)}
                            className={`cursor-pointer transition-all ${
                                selectedIterIndex === i 
                                ? 'bg-emerald-50 dark:bg-emerald-900/10 text-emerald-900 dark:text-emerald-200' 
                                : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                            }`}
                        >
                            <td className="px-6 py-3 text-center font-mono text-slate-400 dark:text-slate-500 font-medium">{row.iter}</td>
                            
                            {(isBracketing || type === AlgorithmType.SECANT || isIncrementalSearch) && (
                                <>
                                <td className="px-6 py-3 text-right font-mono text-slate-500 dark:text-slate-400">{row.a?.toFixed(4)}</td>
                                <td className="px-6 py-3 text-right font-mono text-slate-500 dark:text-slate-400">{row.b?.toFixed(4)}</td>
                                </>
                            )}
                            {isMuller && (
                                <>
                                <td className="px-6 py-3 text-right font-mono text-slate-500 dark:text-slate-400">{row.a?.toFixed(4)}</td>
                                <td className="px-6 py-3 text-right font-mono text-slate-500 dark:text-slate-400">{row.b?.toFixed(4)}</td>
                                <td className="px-6 py-3 text-right font-mono text-slate-500 dark:text-slate-400">{row.c?.toFixed(4)}</td>
                                </>
                            )}
                            {type === AlgorithmType.NEWTON_RAPHSON && (
                                <>
                                 <td className="px-6 py-3 text-right font-mono text-slate-500 dark:text-slate-400">{row.a?.toPrecision(6)}</td>
                                 <td className="px-6 py-3 text-right font-mono text-slate-500 dark:text-slate-400">{row.fx?.toExponential(2)}</td>
                                 <td className="px-6 py-3 text-right font-mono text-slate-500 dark:text-slate-400">{row.dfx?.toExponential(2)}</td>
                                </>
                            )}
                            {isFixedPoint && (
                                <>
                                 <td className="px-6 py-3 text-right font-mono text-slate-500 dark:text-slate-400">{row.a?.toPrecision(6)}</td>
                                 <td className="px-6 py-3 text-right font-mono text-slate-500 dark:text-slate-400">{row.x?.toPrecision(6)}</td>
                                </>
                            )}

                            {!isIncrementalSearch && (
                                <td className="px-6 py-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/10 dark:bg-emerald-900/5">{row.x?.toPrecision(8)}</td>
                            )}
                            
                            {(type !== AlgorithmType.NEWTON_RAPHSON && !isFixedPoint && !isIncrementalSearch) && <td className="px-6 py-3 text-right font-mono text-slate-500 dark:text-slate-400">{row.fx?.toExponential(2)}</td>}
                            
                            {!isIncrementalSearch && (
                                <td className={`px-6 py-3 text-right font-mono font-medium ${ (row.error || 100) < 0.1 ? 'text-emerald-500' : 'text-amber-500' }`}>
                                    {row.error !== undefined ? row.error.toPrecision(3) : '-'}
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