import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot, ReferenceLine, Scatter, ComposedChart } from 'recharts';
import { AlgorithmType } from '../../types';
import { compileMathFunction } from '../../utils/mathUtils';
import { SAMPLE_FUNCTIONS_DIFF } from '../../constants';
import { Calculator, Info, AlertTriangle, Zap, Target } from 'lucide-react';

interface DifferentiationDemoProps {
  type: AlgorithmType;
}

export const DifferentiationDemo: React.FC<DifferentiationDemoProps> = ({ type }) => {
  const [funcStr, setFuncStr] = useState("x^2");
  const [targetX, setTargetX] = useState(1);
  const [h, setH] = useState(0.1);
  const [result, setResult] = useState<number | null>(null);
  const [lastCalculatedTarget, setLastCalculatedTarget] = useState(1);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Manual calculation logic triggered by the button
  const handleCalculate = () => {
    setErrorMsg(null);
    try {
      const f = compileMathFunction(funcStr) as (x: number) => number;
      let val = 0;
      switch (type) {
        case AlgorithmType.FORWARD_DIFFERENCE:
          // Formula: [f(x + h) - f(x)] / h
          val = (f(targetX + h) - f(targetX)) / h;
          break;
        case AlgorithmType.BACKWARD_DIFFERENCE:
          // Formula: [f(x) - f(x - h)] / h
          val = (f(targetX) - f(targetX - h)) / h;
          break;
        case AlgorithmType.CENTRAL_DIFFERENCE:
          // Formula: [f(x + h) - f(x - h)] / 2h
          val = (f(targetX + h) - f(targetX - h)) / (2 * h);
          break;
        case AlgorithmType.SECOND_DERIVATIVE_CENTRAL:
          // Formula: [f(x + h) - 2f(x) + f(x - h)] / h^2
          val = (f(targetX + h) - 2 * f(targetX) + f(targetX - h)) / (h * h);
          break;
      }
      if (!isFinite(val)) throw new Error("Result is not finite.");
      setResult(val);
      setLastCalculatedTarget(targetX);
    } catch (e) {
      setResult(null);
      setErrorMsg("Evaluation error. Ensure function is defined at target point.");
    }
  };

  const chartData = useMemo(() => {
    try {
      const f = compileMathFunction(funcStr) as (x: number) => number;
      const data = [];
      const range = 4;
      const start = targetX - range;
      const end = targetX + range;
      const step = (end - start) / 150;

      for (let x = start; x <= end; x += step) {
        data.push({
          x: Number(x.toFixed(3)),
          y: f(x)
        });
      }
      return data;
    } catch {
      return [];
    }
  }, [funcStr, targetX]);

  const tangentLineData = useMemo(() => {
    if (result === null || type === AlgorithmType.SECOND_DERIVATIVE_CENTRAL) return null;
    try {
      const f = compileMathFunction(funcStr) as (x: number) => number;
      const fTarget = f(lastCalculatedTarget);
      const slope = result;
      const data = [];
      const range = 1.5;
      const start = lastCalculatedTarget - range;
      const end = lastCalculatedTarget + range;
      const step = (end - start) / 40;

      for (let x = start; x <= end; x += step) {
        data.push({
          x: Number(x.toFixed(3)),
          tangentY: slope * (x - lastCalculatedTarget) + fTarget
        });
      }
      return data;
    } catch {
      return null;
    }
  }, [funcStr, lastCalculatedTarget, result, type]);

  const pointsOfIntr = useMemo(() => {
    if (result === null) return [];
    try {
      const f = compileMathFunction(funcStr) as (x: number) => number;
      const points = [{ x: lastCalculatedTarget, y: f(lastCalculatedTarget), name: 'Point x', role: 'target' }];
      
      if (type === AlgorithmType.FORWARD_DIFFERENCE) {
        points.push({ x: lastCalculatedTarget + h, y: f(lastCalculatedTarget + h), name: 'x + h', role: 'node' });
      } else if (type === AlgorithmType.BACKWARD_DIFFERENCE) {
        points.push({ x: lastCalculatedTarget - h, y: f(lastCalculatedTarget - h), name: 'x - h', role: 'node' });
      } else if (type === AlgorithmType.CENTRAL_DIFFERENCE || type === AlgorithmType.SECOND_DERIVATIVE_CENTRAL) {
        points.push({ x: lastCalculatedTarget - h, y: f(lastCalculatedTarget - h), name: 'x - h', role: 'node' });
        points.push({ x: lastCalculatedTarget + h, y: f(lastCalculatedTarget + h), name: 'x + h', role: 'node' });
      }
      return points;
    } catch { return []; }
  }, [funcStr, lastCalculatedTarget, h, type, result]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
          <div className="md:col-span-4">
            <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Function f(x)</label>
                <div className="flex gap-1">
                    {SAMPLE_FUNCTIONS_DIFF.map(fn => (
                        <button 
                            key={fn.label}
                            onClick={() => {
                              setFuncStr(fn.value);
                              setResult(null);
                              setErrorMsg(null);
                            }}
                            className="text-[9px] bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-slate-400 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 transition-all font-bold uppercase"
                        >
                            {fn.label}
                        </button>
                    ))}
                </div>
            </div>
            <input 
              type="text" 
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 font-mono focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
              value={funcStr}
              onChange={e => {
                setFuncStr(e.target.value);
                setResult(null);
              }}
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">Eval at x</label>
            <input 
              type="number" 
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
              value={targetX}
              onChange={e => {
                setTargetX(Number(e.target.value));
                setResult(null);
              }}
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">Step (h)</label>
            <input 
              type="number" 
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
              value={h}
              onChange={e => {
                setH(Number(e.target.value));
                setResult(null);
              }}
              step="0.01"
              min="0.0001"
            />
          </div>
          <div className="md:col-span-4">
             <button 
                onClick={handleCalculate}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-lg transition-all shadow-md shadow-emerald-600/20 active:scale-95 flex items-center justify-center gap-2"
             >
                <Calculator className="w-4 h-4" />
                Calculate Derivative
             </button>
          </div>
        </div>
        
        {errorMsg && (
            <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-bold uppercase tracking-tight">
                <AlertTriangle className="w-4 h-4" />
                {errorMsg}
            </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 h-[450px] shadow-sm relative overflow-hidden group">
           <div className="absolute top-6 left-6 z-10 flex items-center gap-3">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-white/90 dark:bg-slate-900/90 px-2 py-1 rounded border border-slate-200 dark:border-slate-800 shadow-sm">Numerical Differentiation Plot</span>
           </div>

           <div className="absolute inset-0 bg-slate-50 opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none"></div>

           <ResponsiveContainer width="100%" height="100%">
             <ComposedChart 
                data={chartData} 
                margin={{ top: 40, right: 40, left: 10, bottom: 20 }}
             >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis 
                    dataKey="x" 
                    type="number" 
                    domain={['auto', 'auto']} 
                    tick={{fontSize: 10, fill: '#94a3b8'}} 
                    stroke="#e2e8f0"
                />
                <YAxis tick={{fontSize: 10, fill: '#94a3b8'}} stroke="#e2e8f0" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backdropFilter: 'blur(4px)' }}
                  formatter={(v: number) => v.toFixed(6)}
                  labelFormatter={(l) => `x = ${Number(l).toFixed(3)}`}
                />
                
                {/* Visual marker for pending target point */}
                <ReferenceLine x={targetX} stroke="#94a3b8" strokeDasharray="3 3" strokeOpacity={0.3} />
                
                <Line type="monotone" dataKey="y" stroke="#10b981" strokeWidth={3} dot={false} isAnimationActive={false} />
                
                {tangentLineData && (
                  <Line 
                    data={tangentLineData} 
                    type="monotone" 
                    dataKey="tangentY" 
                    stroke="#ec4899" 
                    strokeWidth={2} 
                    strokeDasharray="5 5" 
                    dot={false} 
                    isAnimationActive={false} 
                    name="Tangent Approximation"
                  />
                )}

                <Scatter data={pointsOfIntr} fill="#3b82f6" />
                
                {pointsOfIntr.map((p, i) => (
                  <ReferenceDot 
                    key={i} 
                    x={p.x} 
                    y={p.y} 
                    r={p.role === 'target' ? 6 : 4} 
                    fill={p.role === 'target' ? "#f59e0b" : "#3b82f6"} 
                    stroke="#fff" 
                    strokeWidth={2} 
                  />
                ))}
             </ComposedChart>
           </ResponsiveContainer>
        </div>

        <div className="md:col-span-4 flex flex-col gap-6">
          <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl shadow-slate-900/10 flex flex-col justify-between overflow-hidden relative min-h-[220px]">
            <div className="absolute -right-8 -bottom-8 opacity-20 rotate-12">
              <Zap className="w-32 h-32 text-emerald-400" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                 <Target className="w-4 h-4 text-emerald-400" />
                 <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em]">Solution Module</p>
              </div>
              
              <h3 className={`text-5xl font-mono font-bold tracking-tighter mb-1 transition-all ${result !== null ? 'text-white' : 'text-slate-700'}`}>
                {result !== null ? result.toFixed(6) : "---"}
              </h3>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-4">
                {type === AlgorithmType.SECOND_DERIVATIVE_CENTRAL ? "Curvature [f''(x)]" : "Slope [f'(x)]"}
              </p>
            </div>

            <div className="relative z-10 grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/5">
               <div>
                  <span className="text-[9px] text-slate-500 font-bold uppercase block mb-1">Step Size</span>
                  <span className="text-xs font-mono text-emerald-400">{h}</span>
               </div>
               <div className="text-right">
                  <span className="text-[9px] text-slate-500 font-bold uppercase block mb-1">Calculated at</span>
                  <span className="text-xs font-mono text-emerald-400">{result !== null ? lastCalculatedTarget.toFixed(3) : "N/A"}</span>
               </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
             <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                <Info className="w-4 h-4 text-emerald-600" />
                <h4 className="text-[10px] font-black uppercase tracking-widest">Calculated View Legend</h4>
             </div>
             
             <div className="space-y-4">
                <div className="flex items-center gap-3 group">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-50 dark:ring-emerald-900/30 transition-all group-hover:scale-125"></div>
                  <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Function Curve f(x)</span>
                </div>
                {type !== AlgorithmType.SECOND_DERIVATIVE_CENTRAL && result !== null && (
                  <div className="flex items-center gap-3 group animate-in fade-in">
                    <div className="w-2.5 h-2.5 rounded-full bg-pink-500 ring-4 ring-pink-50 dark:ring-pink-900/30 transition-all group-hover:scale-125"></div>
                    <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Approx. Tangent Line</span>
                  </div>
                )}
                <div className="flex items-center gap-3 group">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-amber-50 dark:ring-amber-900/30 transition-all group-hover:scale-125"></div>
                  <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Point of Interest (x)</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};