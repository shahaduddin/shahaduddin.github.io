import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceArea, ReferenceDot } from 'recharts';
import { SAMPLE_FUNCTIONS } from '../../constants';
import { AlgorithmType } from '../../types';
import { compileMathFunction } from '../../utils/mathUtils';
import { AlertCircle, MousePointerClick, Crosshair, PlayCircle } from 'lucide-react';

interface RootsDemoProps {
  type: AlgorithmType;
}

interface IterationData {
  iter: number;
  a?: number;
  b?: number;
  dfx?: number;
  x: number;
  fx: number;
  error?: number;
}

export const RootsDemo: React.FC<RootsDemoProps> = ({ type }) => {
  const [funcStr, setFuncStr] = useState(SAMPLE_FUNCTIONS[0].value);
  const [p1, setP1] = useState<number>(0); 
  const [p2, setP2] = useState<number>(4);
  const [maxIter, setMaxIter] = useState<number>(50);
  const [tolerance, setTolerance] = useState<number>(0.000001);
  
  const [iterations, setIterations] = useState<IterationData[]>([]);
  const [root, setRoot] = useState<number | null>(null);
  const [selectedIterIndex, setSelectedIterIndex] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isBracketing = type === AlgorithmType.BISECTION || type === AlgorithmType.FALSE_POSITION;
  const isFixedPoint = type === AlgorithmType.FIXED_POINT_ITERATION;

  useEffect(() => {
    setIterations([]);
    setRoot(null);
    setSelectedIterIndex(null);
    setErrorMsg(null);
    if (type === AlgorithmType.NEWTON_RAPHSON) {
      setP1(2);
    } else if (type === AlgorithmType.FIXED_POINT_ITERATION) {
      setFuncStr('1 + 1/x');
      setP1(1.5);
    } else {
      setP1(0);
      setP2(4);
    }
  }, [type]);

  const labels = useMemo(() => {
    switch (type) {
      case AlgorithmType.NEWTON_RAPHSON:
        return { p1: "Initial Guess (x0)", p2: null };
      case AlgorithmType.SECANT:
        return { p1: "x0 (Initial)", p2: "x1 (Initial)" };
      case AlgorithmType.FIXED_POINT_ITERATION:
        return { p1: "Initial Guess (x0)", p2: null };
      default:
        return { p1: "Lower Bound (a)", p2: "Upper Bound (b)" };
    }
  }, [type]);

  const chartData = useMemo(() => {
    try {
      const f = compileMathFunction(funcStr) as (val: number) => number;
      const data = [];
      let start = p1; 
      let end = p2 || p1 + 2;

      if (iterations.length > 0) {
         const allX = iterations.map(i => i.x).concat([p1, p2 || p1]);
         if (type === AlgorithmType.NEWTON_RAPHSON || isFixedPoint) {
             iterations.forEach(iter => { if(iter.a !== undefined) allX.push(iter.a) });
         }
         start = Math.min(...allX);
         end = Math.max(...allX);
      }
      
      const range = Math.abs(end - start) || 1;
      const padding = Math.max(range * 0.2, 1);
      start -= padding;
      end += padding;

      const step = (end - start) / 100;
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

  const solve = () => {
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
          setErrorMsg("Function must have opposite signs at bounds a and b.");
          return;
        }

        for (let i = 0; i < maxIter; i++) {
          if (type === AlgorithmType.BISECTION) {
            c = (low + high) / 2;
          } else {
             const flow = f(low);
             const fhigh = f(high);
             if (Math.abs(fhigh - flow) < 1e-15) {
                 setErrorMsg("Division by zero in formula (flat slope).");
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
            x: c, 
            fx: fc, 
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
              setErrorMsg("Derivative near zero. Method fails.");
              break;
          }
          
          const next = curr - fx / dfx;
          const ea = Math.abs((next - curr) / next) * 100;

          iterData.push({
            iter: i + 1,
            a: curr,
            x: next,
            fx: fx,
            dfx: dfx,
            error: ea
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
                 setErrorMsg("Division by zero (flat slope).");
                 break;
            }

            const x2 = x1 - fx1 * (x1 - x0) / (fx1 - fx0);
            const ea = Math.abs((x2 - x1) / x2) * 100;

            iterData.push({ 
                iter: i + 1, 
                a: x0,
                b: x1,
                x: x2,
                fx: f(x2), 
                error: ea 
            });

            if (ea < tolerance) {
                setRoot(x2);
                break;
            }
            x0 = x1;
            x1 = x2;
        }
      } 
      else if (type === AlgorithmType.FIXED_POINT_ITERATION) {
          let curr = p1;
          for (let i = 0; i < maxIter; i++) {
              const next = f(curr);
              const ea = Math.abs((next - curr) / next) * 100;
              
              iterData.push({
                  iter: i + 1,
                  a: curr,
                  x: next,
                  fx: next,
                  error: ea
              });

              if (ea < tolerance) {
                  setRoot(next);
                  break;
              }
              if (!isFinite(next)) {
                  setErrorMsg("Diverged to Infinity");
                  break;
              }
              curr = next;
          }
      }
      setIterations(iterData);
      if (iterData.length > 0) setSelectedIterIndex(iterData.length - 1);
    } catch (e) {
      setErrorMsg("Invalid function syntax.");
    }
  };

  const activeIter = selectedIterIndex !== null ? iterations[selectedIterIndex] : null;

  const vizLines = useMemo(() => {
    if (!activeIter) return null;
    try {
        const f = compileMathFunction(funcStr) as (v:number)=>number;
        
        if (type === AlgorithmType.FALSE_POSITION || type === AlgorithmType.SECANT) {
             if (activeIter.a === undefined || activeIter.b === undefined) return null;
             return [
                 { x: activeIter.a, y: f(activeIter.a) },
                 { x: activeIter.b, y: f(activeIter.b) }
             ] as [{x: number, y: number}, {x: number, y: number}];
        }
        
        if (type === AlgorithmType.NEWTON_RAPHSON) {
            if (activeIter.a === undefined) return null;
            return [
                { x: activeIter.a, y: activeIter.fx },
                { x: activeIter.x, y: 0 }
            ] as [{x: number, y: number}, {x: number, y: number}];
        }
        
        if (type === AlgorithmType.FIXED_POINT_ITERATION) {
             if (activeIter.a === undefined) return null;
             return [
                 { x: activeIter.a, y: activeIter.a }, 
                 { x: activeIter.a, y: activeIter.x },
                 { x: activeIter.x, y: activeIter.x }
             ] as any; 
        }

    } catch { return null; }
    return null;
  }, [activeIter, funcStr, type]);

  const verticalLine = useMemo(() => {
     if (type === AlgorithmType.NEWTON_RAPHSON && activeIter && activeIter.a !== undefined) {
         return [
             { x: activeIter.a, y: 0 },
             { x: activeIter.a, y: activeIter.fx }
         ] as [{x: number, y: number}, {x: number, y: number}];
     }
     return null;
  }, [activeIter, type]);

  return (
    <div className="space-y-6">
      {/* Controls Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-4 space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {isFixedPoint ? "Function g(x)" : "Function f(x)"}
                </label>
                <div className="relative group">
                    <input 
                        type="text" 
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-4 pr-3 py-2.5 text-sm text-slate-900 font-mono focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-400"
                        onChange={(e) => setFuncStr(e.target.value)}
                        value={funcStr}
                    />
                </div>
            </div>
            
            <div className="col-span-6 md:col-span-2 space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider truncate" title={labels.p1}>{labels.p1}</label>
                <input 
                    type="number" 
                    value={p1} 
                    onChange={e => setP1(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                />
            </div>

            {labels.p2 && (
                <div className="col-span-6 md:col-span-2 space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider truncate" title={labels.p2}>{labels.p2}</label>
                    <input 
                        type="number" 
                        value={p2} 
                        onChange={e => setP2(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                    />
                </div>
            )}

            <div className="col-span-6 md:col-span-2 space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tolerance</label>
                <input 
                    type="number" 
                    value={tolerance} 
                    onChange={e => setTolerance(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                    step="0.000001"
                />
            </div>

            <div className="col-span-12 md:col-span-2 flex items-end">
                <button 
                    onClick={solve}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 px-4 rounded-lg transition-all shadow-md shadow-emerald-600/20 active:scale-95 flex items-center justify-center gap-2"
                >
                    <PlayCircle className="w-4 h-4" />
                    Calculate
                </button>
            </div>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2 shadow-sm">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-sm font-medium">{errorMsg}</span>
        </div>
      )}

      {/* Visualization Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graph */}
        <div className="lg:col-span-2 h-[450px] bg-white rounded-2xl border border-slate-200 p-1 relative overflow-hidden shadow-sm">
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 pointer-events-none">
                <span className="text-xs font-bold text-slate-500 uppercase bg-white/90 px-2 py-1 rounded border border-slate-200 shadow-sm">Visualization</span>
                {activeIter && (
                    <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded border border-emerald-100 font-mono font-medium">
                        Iter {activeIter.iter}
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
                        contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ color: '#334155' }}
                        formatter={(val: number) => val.toFixed(6)}
                        labelFormatter={(label) => `x: ${Number(label).toFixed(4)}`}
                    />
                    <ReferenceLine y={0} stroke="#94a3b8" strokeWidth={1} />
                    <Line type="monotone" dataKey="y" stroke="#10b981" strokeWidth={2} dot={false} isAnimationActive={false} />
                    
                    {isFixedPoint && (
                        <Line type="monotone" dataKey="yLine" stroke="#94a3b8" strokeDasharray="5 5" strokeWidth={1} dot={false} isAnimationActive={false} />
                    )}
                    
                    {activeIter && (
                        <>
                            {isBracketing && activeIter.a !== undefined && activeIter.b !== undefined && (
                                <ReferenceArea 
                                    x1={activeIter.a} 
                                    x2={activeIter.b} 
                                    fill="#3b82f6" 
                                    fillOpacity={0.08} 
                                />
                            )}
                            {vizLines && (
                                !isFixedPoint ? (
                                    <ReferenceLine 
                                        segment={vizLines as any} 
                                        stroke="#ec4899" 
                                        strokeDasharray="4 4" 
                                        strokeWidth={2}
                                    />
                                ) : (
                                    <>
                                    <ReferenceLine segment={[vizLines[0], vizLines[1]]} stroke="#ec4899" strokeWidth={2} />
                                    <ReferenceLine segment={[vizLines[1], vizLines[2]]} stroke="#ec4899" strokeWidth={2} />
                                    </>
                                )
                            )}
                            {verticalLine && (
                                <ReferenceLine segment={verticalLine} stroke="#94a3b8" strokeDasharray="3 3" />
                            )}
                            <ReferenceDot x={activeIter.x} y={isFixedPoint ? activeIter.x : 0} r={4} fill="#f59e0b" stroke="white" strokeWidth={2} />
                            
                            {!isFixedPoint && <ReferenceLine x={activeIter.x} stroke="#f59e0b" strokeDasharray="2 2" strokeOpacity={0.5} />}
                            
                            {type === AlgorithmType.NEWTON_RAPHSON && activeIter.a !== undefined && (
                                <ReferenceDot x={activeIter.a} y={activeIter.fx} r={4} fill="#ec4899" stroke="white" strokeWidth={2} />
                            )}

                            {(activeIter.a !== undefined && (isBracketing || type === AlgorithmType.SECANT)) && <ReferenceDot x={activeIter.a} y={0} r={3} fill="#3b82f6" stroke="none" opacity={0.6} />}
                            {(activeIter.b !== undefined && (isBracketing || type === AlgorithmType.SECANT)) && <ReferenceDot x={activeIter.b} y={0} r={3} fill="#3b82f6" stroke="none" opacity={0.6} />}
                        </>
                    )}

                    {root !== null && !activeIter && (
                        <ReferenceLine x={root} stroke="#ef4444" label={{ position: 'top', value: 'Root', fill: '#ef4444', fontSize: 12, fontWeight: 600 }} />
                    )}
                </LineChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Info Card */}
        <div className="lg:col-span-1 flex flex-col gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between h-full shadow-sm">
                <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase mb-6 tracking-widest">Current State</h3>
                    
                    {iterations.length > 0 ? (
                        <div className="space-y-6">
                            <div>
                                <span className="text-slate-500 text-xs block mb-1 font-semibold uppercase">Estimated Root</span>
                                <span className="text-3xl font-mono text-emerald-600 font-bold break-all tracking-tight">
                                    {iterations[iterations.length-1].x?.toFixed(6)}
                                </span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <span className="text-slate-400 text-[10px] uppercase block mb-1 font-bold">Iterations</span>
                                    <span className="text-slate-700 font-mono text-xl font-medium">{iterations.length}</span>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <span className="text-slate-400 text-[10px] uppercase block mb-1 font-bold">Error</span>
                                    <span className="text-amber-500 font-mono text-xl font-medium">
                                        {iterations[iterations.length-1].error !== undefined 
                                        ? (iterations[iterations.length-1].error as number) < 0.0001 ? '< 0.01%' : (iterations[iterations.length-1].error as number).toFixed(2) + '%'
                                        : '-'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-10 text-slate-400 space-y-3">
                            <Crosshair className="w-12 h-12 opacity-10" />
                            <span className="text-sm font-medium">Ready to compute</span>
                        </div>
                    )}
                </div>

                {iterations.length > 0 && (
                    <div className="space-y-3 pt-6 border-t border-slate-100">
                        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div> Function f(x)
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                            <div className="w-2.5 h-2.5 rounded-full bg-pink-500"></div> 
                            {type === AlgorithmType.NEWTON_RAPHSON ? 'Tangent' : 'Secant'} Line
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div> Root Estimate
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* Table */}
      {iterations.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
             <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-sm font-bold text-slate-600 uppercase flex items-center gap-2 tracking-wider">
                    <MousePointerClick className="w-4 h-4 text-emerald-500" />
                    Iteration Log
                </h3>
             </div>
             <div className="overflow-x-auto max-h-96 custom-scrollbar">
                <table className="w-full text-sm text-left text-slate-600">
                    <thead className="text-xs text-slate-400 uppercase bg-slate-50 sticky top-0 z-10 font-semibold">
                    <tr>
                        <th className="px-6 py-3 w-16 text-center bg-slate-50">#</th>
                        {isBracketing ? (
                            <>
                             <th className="px-6 py-3 text-right">Low (a)</th>
                             <th className="px-6 py-3 text-right">High (b)</th>
                            </>
                        ) : type === AlgorithmType.SECANT ? (
                            <>
                             <th className="px-6 py-3 text-right">x<sub>i-1</sub></th>
                             <th className="px-6 py-3 text-right">x<sub>i</sub></th>
                            </>
                        ) : type === AlgorithmType.FIXED_POINT_ITERATION ? (
                            <>
                             <th className="px-6 py-3 text-right">x<sub>i</sub></th>
                             <th className="px-6 py-3 text-right">g(x<sub>i</sub>)</th>
                            </>
                        ) : (
                            <>
                             <th className="px-6 py-3 text-right">x<sub>n</sub></th>
                             <th className="px-6 py-3 text-right">f(x<sub>n</sub>)</th>
                             <th className="px-6 py-3 text-right">f'(x<sub>n</sub>)</th>
                            </>
                        )}
                        
                        <th className="px-6 py-3 text-right text-emerald-600 font-bold bg-slate-50">
                            {type === AlgorithmType.NEWTON_RAPHSON ? 'x_{n+1}' : (isFixedPoint ? 'x_{i+1}' : 'Root Est.')}
                        </th>
                        
                        {(type !== AlgorithmType.NEWTON_RAPHSON && !isFixedPoint) && <th className="px-6 py-3 text-right">f(Root)</th>}
                        <th className="px-6 py-3 text-right">Error %</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                    {iterations.map((row, i) => (
                        <tr 
                            key={i} 
                            onClick={() => setSelectedIterIndex(i)}
                            className={`cursor-pointer transition-colors ${
                                selectedIterIndex === i 
                                ? 'bg-emerald-50 text-emerald-900' 
                                : 'hover:bg-slate-50'
                            }`}
                        >
                            <td className="px-6 py-3 text-center font-mono text-slate-400">{row.iter}</td>
                            
                            {(isBracketing || type === AlgorithmType.SECANT) && (
                                <>
                                <td className="px-6 py-3 text-right font-mono text-slate-500">{row.a?.toPrecision(5)}</td>
                                <td className="px-6 py-3 text-right font-mono text-slate-500">{row.b?.toPrecision(5)}</td>
                                </>
                            )}
                            {type === AlgorithmType.NEWTON_RAPHSON && (
                                <>
                                 <td className="px-6 py-3 text-right font-mono text-slate-500">{row.a?.toPrecision(6)}</td>
                                 <td className="px-6 py-3 text-right font-mono text-slate-500">{row.fx?.toExponential(2)}</td>
                                 <td className="px-6 py-3 text-right font-mono text-slate-500">{row.dfx?.toExponential(2)}</td>
                                </>
                            )}
                            {isFixedPoint && (
                                <>
                                 <td className="px-6 py-3 text-right font-mono text-slate-500">{row.a?.toPrecision(6)}</td>
                                 <td className="px-6 py-3 text-right font-mono text-slate-500">{row.x?.toPrecision(6)}</td>
                                </>
                            )}

                            <td className="px-6 py-3 text-right font-mono font-bold text-emerald-600">{row.x?.toPrecision(6)}</td>
                            {(type !== AlgorithmType.NEWTON_RAPHSON && !isFixedPoint) && <td className="px-6 py-3 text-right font-mono text-slate-500">{row.fx?.toExponential(2)}</td>}
                            
                            <td className="px-6 py-3 text-right font-mono text-amber-500 font-medium">
                                {row.error !== undefined ? row.error.toExponential(2) : '-'}
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