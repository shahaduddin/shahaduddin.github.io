import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot, ReferenceLine, Scatter, ComposedChart } from 'recharts';
import { AlgorithmType } from '../../types';
import { compileMathFunction } from '../../utils/mathUtils';
import { Calculator, Info, AlertTriangle, Zap, Target, Binary, Settings2 } from 'lucide-react';

interface DifferentiationDemoProps {
  type: AlgorithmType;
}

export const DifferentiationDemo: React.FC<DifferentiationDemoProps> = ({ type }) => {
  const [funcStr, setFuncStr] = useState("x^2 + sin(x)");
  const [targetX, setTargetX] = useState(1);
  const [h, setH] = useState(0.1);
  const [result, setResult] = useState<number | null>(null);
  const [lastCalculatedTarget, setLastCalculatedTarget] = useState(1);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleCalculate = () => {
    setErrorMsg(null);
    try {
      const f = compileMathFunction(funcStr) as (x: number) => number;
      let val = 0;
      switch (type) {
        case AlgorithmType.FORWARD_DIFFERENCE:
          val = (f(targetX + h) - f(targetX)) / h;
          break;
        case AlgorithmType.BACKWARD_DIFFERENCE:
          val = (f(targetX) - f(targetX - h)) / h;
          break;
        case AlgorithmType.CENTRAL_DIFFERENCE:
          val = (f(targetX + h) - f(targetX - h)) / (2 * h);
          break;
        case AlgorithmType.SECOND_DERIVATIVE_CENTRAL:
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
      {/* Redesigned Input Panel */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm transition-colors">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Row 1: Function Input */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
              <Binary className="w-3.5 h-3.5 text-emerald-500" />
              Mathematical Expression
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 font-mono text-sm font-black italic">f(x) =</div>
              <input 
                type="text" 
                className="w-full h-14 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl pl-16 pr-4 text-sm text-slate-900 dark:text-slate-100 font-mono focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all shadow-inner"
                value={funcStr}
                onChange={e => { setFuncStr(e.target.value); setResult(null); }}
                placeholder="e.g. x^2 + 5x - 2"
              />
            </div>
          </div>

          {/* Row 2: Parameters & Action */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Evaluation (x)</label>
              <input 
                type="number" 
                className="w-full h-12 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 text-sm font-mono focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                value={targetX}
                onChange={e => { setTargetX(Number(e.target.value)); setResult(null); }}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Step size (h)</label>
              <input 
                type="number" 
                className="w-full h-12 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 text-sm font-mono focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                value={h}
                step="0.01"
                min="0.0001"
                onChange={e => { setH(Number(e.target.value)); setResult(null); }}
              />
            </div>
            <div className="md:col-span-2">
              <button 
                onClick={handleCalculate}
                className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl transition-all shadow-lg shadow-emerald-600/20 active:scale-95 flex items-center justify-center gap-2.5 text-[11px] uppercase tracking-widest"
              >
                <Zap className="w-4 h-4" />
                Compute Derivative
              </button>
            </div>
          </div>
        </div>
        
        {errorMsg && (
          <div className="mt-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-5 py-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 shadow-sm max-w-4xl mx-auto">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
            <span className="text-[11px] font-black uppercase tracking-tight">{errorMsg}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-4 h-[500px] shadow-sm relative overflow-hidden transition-colors group">
           <ResponsiveContainer width="100%" height="100%">
             <ComposedChart data={chartData} margin={{ top: 40, right: 40, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} />
                <XAxis 
                    dataKey="x" 
                    type="number" 
                    domain={['auto', 'auto']} 
                    tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 600}} 
                    stroke="#e2e8f0"
                />
                <YAxis tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 600}} stroke="#e2e8f0" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.98)', borderRadius: '18px', border: '1px solid #f1f5f9', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', backdropFilter: 'blur(8px)', fontSize: '11px' }}
                  formatter={(v: number) => v.toFixed(6)}
                  labelFormatter={(l) => `x = ${Number(l).toFixed(3)}`}
                />
                <ReferenceLine y={0} stroke="#94a3b8" strokeWidth={2} strokeOpacity={0.3} />
                <ReferenceLine x={0} stroke="#94a3b8" strokeWidth={2} strokeOpacity={0.3} />
                <Line type="monotone" dataKey="y" stroke="#10b981" strokeWidth={4} dot={false} isAnimationActive={false} />
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
                  />
                )}
                <Scatter data={pointsOfIntr} fill="#3b82f6" />
                {pointsOfIntr.map((p, i) => (
                  <ReferenceDot 
                    key={i} 
                    x={p.x} 
                    y={p.y} 
                    r={p.role === 'target' ? 7 : 5} 
                    fill={p.role === 'target' ? "#f59e0b" : "#3b82f6"} 
                    stroke="white" 
                    strokeWidth={3} 
                  />
                ))}
             </ComposedChart>
           </ResponsiveContainer>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between overflow-hidden relative min-h-[260px] transition-colors group">
            <div className="absolute -right-8 -bottom-8 opacity-5 dark:opacity-20 rotate-12 transition-transform group-hover:scale-110 duration-700">
              <Zap className="w-48 h-48 text-emerald-600 dark:text-emerald-400" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-8">
                 <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                 <p className="text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em]">Analytical Result</p>
              </div>
              
              <h3 className={`text-6xl font-mono font-black tracking-tighter mb-2 transition-all ${result !== null ? 'text-slate-900 dark:text-white' : 'text-slate-200 dark:text-slate-800'}`}>
                {result !== null ? result.toFixed(6) : "---"}
              </h3>
              <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-4">
                {type === AlgorithmType.SECOND_DERIVATIVE_CENTRAL ? "Instantaneous Curvature" : "Instantaneous Slope"}
              </p>
            </div>

            <div className="relative z-10 flex items-center justify-between mt-10 pt-8 border-t border-slate-100 dark:border-white/5">
               <div>
                  <span className="text-[9px] text-slate-400 font-black uppercase block mb-1 tracking-widest">Resolution (h)</span>
                  <span className="text-sm font-mono font-black text-emerald-600 dark:text-emerald-400">{h}</span>
               </div>
               <div className="text-right">
                  <span className="text-[9px] text-slate-400 font-black uppercase block mb-1 tracking-widest">Calculated At</span>
                  <span className="text-sm font-mono font-black text-emerald-600 dark:text-emerald-400">{result !== null ? lastCalculatedTarget.toFixed(3) : "N/A"}</span>
               </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm space-y-6 transition-colors">
             <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                <Info className="w-4 h-4 text-emerald-600" />
                <h4 className="text-[10px] font-black uppercase tracking-widest">Visual Legend</h4>
             </div>
             
             <div className="space-y-4">
                <div className="flex items-center gap-4 group">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-50 dark:ring-emerald-900/30"></div>
                  <span className="text-xs text-slate-600 dark:text-slate-400 font-bold uppercase tracking-tight">Function Curve f(x)</span>
                </div>
                {type !== AlgorithmType.SECOND_DERIVATIVE_CENTRAL && result !== null && (
                  <div className="flex items-center gap-4 group">
                    <div className="w-3 h-3 rounded-full bg-pink-500 ring-4 ring-pink-50 dark:ring-pink-900/30"></div>
                    <span className="text-xs text-slate-600 dark:text-slate-400 font-bold uppercase tracking-tight">Local Tangent</span>
                  </div>
                )}
                <div className="flex items-center gap-4 group">
                  <div className="w-3 h-3 rounded-full bg-amber-500 ring-4 ring-amber-50 dark:ring-amber-900/30"></div>
                  <span className="text-xs text-slate-600 dark:text-slate-400 font-bold uppercase tracking-tight">Anchor Point (x)</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
