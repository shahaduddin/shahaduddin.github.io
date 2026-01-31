import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot, ReferenceLine, Scatter, ComposedChart } from 'recharts';
import { AlgorithmType } from '../../types';
import { compileMathFunction } from '../../utils/mathUtils';
import { SAMPLE_FUNCTIONS_DIFF } from '../../constants';
import { Calculator, Play, Info, AlertTriangle, TrendingUp } from 'lucide-react';

interface DifferentiationDemoProps {
  type: AlgorithmType;
}

export const DifferentiationDemo: React.FC<DifferentiationDemoProps> = ({ type }) => {
  const [funcStr, setFuncStr] = useState("x^2");
  const [targetX, setTargetX] = useState(1);
  const [h, setH] = useState(0.1);
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
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
      setResult(val);
    } catch (e) {
      alert("Invalid function syntax.");
    }
  };

  const chartData = useMemo(() => {
    try {
      const f = compileMathFunction(funcStr) as (x: number) => number;
      const data = [];
      const range = 2;
      const start = targetX - range;
      const end = targetX + range;
      const step = (end - start) / 100;

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
      const fTarget = f(targetX);
      const slope = result;
      const data = [];
      const range = 1.5;
      const start = targetX - range;
      const end = targetX + range;
      const step = (end - start) / 50;

      for (let x = start; x <= end; x += step) {
        // Line equation: y - y1 = m(x - x1) -> y = m(x - x1) + y1
        data.push({
          x: Number(x.toFixed(3)),
          tangentY: slope * (x - targetX) + fTarget
        });
      }
      return data;
    } catch {
      return null;
    }
  }, [funcStr, targetX, result, type]);

  const pointsOfIntr = useMemo(() => {
    try {
      const f = compileMathFunction(funcStr) as (x: number) => number;
      const points = [{ x: targetX, y: f(targetX), name: 'Point x' }];
      
      if (type === AlgorithmType.FORWARD_DIFFERENCE) {
        points.push({ x: targetX + h, y: f(targetX + h), name: 'x + h' });
      } else if (type === AlgorithmType.BACKWARD_DIFFERENCE) {
        points.push({ x: targetX - h, y: f(targetX - h), name: 'x - h' });
      } else if (type === AlgorithmType.CENTRAL_DIFFERENCE || type === AlgorithmType.SECOND_DERIVATIVE_CENTRAL) {
        points.push({ x: targetX - h, y: f(targetX - h), name: 'x - h' });
        points.push({ x: targetX + h, y: f(targetX + h), name: 'x + h' });
      }
      return points;
    } catch { return []; }
  }, [funcStr, targetX, h, type]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          <div className="md:col-span-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Function f(x)</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {SAMPLE_FUNCTIONS_DIFF.map(fn => (
                <button 
                  key={fn.label}
                  onClick={() => { setFuncStr(fn.value); setResult(null); }}
                  className="text-[10px] bg-slate-100 hover:bg-emerald-100 hover:text-emerald-700 px-2 py-0.5 rounded transition-all font-medium text-slate-600 border border-slate-200"
                >
                  {fn.label}
                </button>
              ))}
            </div>
            <input 
              type="text" 
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 font-mono focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
              value={funcStr}
              onChange={e => { setFuncStr(e.target.value); setResult(null); }}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Evaluate at x</label>
            <input 
              type="number" 
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
              value={targetX}
              onChange={e => { setTargetX(Number(e.target.value)); setResult(null); }}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Step Size (h)</label>
            <input 
              type="number" 
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
              value={h}
              onChange={e => { setH(Number(e.target.value)); setResult(null); }}
              step="0.01"
            />
          </div>
          <button 
            onClick={calculate}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-6 rounded-lg transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 active:scale-95"
          >
            <Play className="w-4 h-4" />
            Differentiate
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8 bg-white rounded-2xl border border-slate-200 p-4 h-[400px] shadow-sm relative">
           <div className="absolute top-6 left-6 z-10">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white/80 px-2 py-1 rounded border border-slate-100">Functional View</span>
           </div>
           <ResponsiveContainer width="100%" height="100%">
             <ComposedChart data={chartData} margin={{ top: 20, right: 20, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="x" type="number" domain={['auto', 'auto']} tick={{fontSize: 10}} />
                <YAxis tick={{fontSize: 10}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(v: number) => v.toFixed(4)}
                />
                <ReferenceLine x={targetX} stroke="#94a3b8" strokeDasharray="3 3" />
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
                  <ReferenceDot key={i} x={p.x} y={p.y} r={4} fill={i === 0 ? "#f59e0b" : "#3b82f6"} stroke="#fff" strokeWidth={2} />
                ))}
             </ComposedChart>
           </ResponsiveContainer>
        </div>

        <div className="md:col-span-4 flex flex-col gap-6">
          <div className="bg-emerald-600 rounded-2xl p-6 text-white shadow-lg shadow-emerald-600/20 flex flex-col justify-between overflow-hidden relative">
            <div className="absolute -right-8 -bottom-8 opacity-10">
              <TrendingUp className="w-32 h-32" />
            </div>
            <div>
              <p className="text-emerald-100 text-xs font-bold uppercase tracking-widest mb-2">Approximate Result</p>
              <h3 className="text-4xl font-bold font-mono truncate">
                {result !== null ? result.toFixed(8) : "---"}
              </h3>
              <p className="text-emerald-200 text-[10px] mt-2 font-medium">
                {type === AlgorithmType.SECOND_DERIVATIVE_CENTRAL ? "f''(x)" : "f'(x)"} value
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-emerald-500/50 flex items-center justify-between">
               <span className="text-[10px] text-emerald-200">h = {h}</span>
               <span className="text-[10px] text-emerald-200">x = {targetX}</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
             <div className="flex items-center gap-2 text-slate-800">
                <Info className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider">Visual Guide</h4>
             </div>
             <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-xs text-slate-600">Function Curve f(x)</span>
                </div>
                {type !== AlgorithmType.SECOND_DERIVATIVE_CENTRAL && (
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                    <span className="text-xs text-slate-600">Approximate Tangent</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span className="text-xs text-slate-600">Evaluation Point (x)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-xs text-slate-600">Nodes used for calculation</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3 shadow-sm">
        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-xs font-bold text-amber-800 uppercase tracking-wider">Numerical Stability Note</p>
          <p className="text-xs text-amber-700 leading-relaxed">
            As step size <span className="font-mono">h</span> decreases, the truncation error decreases. However, if <span className="font-mono">h</span> is too small (e.g., &lt; 1e-8), 
            <strong> catastrophic cancellation</strong> (rounding error) often occurs because we are subtracting two very close values and dividing by a tiny number.
          </p>
        </div>
      </div>
    </div>
  );
};