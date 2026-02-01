import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlgorithmType } from '../../types';
import { compileMathFunction } from '../../utils/mathUtils';
import { AlertCircle, Calculator, Info } from 'lucide-react';

interface IntegrationDemoProps {
  type: AlgorithmType;
}

export const IntegrationDemo: React.FC<IntegrationDemoProps> = ({ type }) => {
  const [funcStr, setFuncStr] = useState("x^2");
  const [a, setA] = useState(0);
  const [b, setB] = useState(1);
  const [n, setN] = useState(10); // Segments
  const [result, setResult] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const chartData = useMemo(() => {
    try {
      const f = compileMathFunction(funcStr) as (val: number) => number;
      const data = [];
      const range = b - a;
      const plotStart = a - range * 0.1;
      const plotEnd = b + range * 0.1;
      const step = (plotEnd - plotStart) / 80;
      
      for (let plotVal = plotStart; plotVal <= plotEnd; plotVal += step) {
        data.push({ x: Number(plotVal.toFixed(3)), y: f(plotVal) });
      }
      return data;
    } catch { return []; }
  }, [funcStr, a, b]);

  const calculate = () => {
    setErrorMsg(null);
    setResult(null);
    try {
      const f = compileMathFunction(funcStr) as (val: number) => number;
      const h = (b - a) / n;
      let sum = f(a) + f(b);

      if (type === AlgorithmType.TRAPEZOIDAL) {
        for (let i = 1; i < n; i++) {
          const val = a + i * h;
          sum += 2 * f(val);
        }
        setResult((sum * h) / 2);
      } else {
        // Simpson
        if (n % 2 !== 0) {
          setErrorMsg("N must be an even integer for Simpson's 1/3 Rule.");
          return;
        }
        for (let i = 1; i < n; i++) {
          const val = a + i * h;
          if (i % 2 === 0) sum += 2 * f(val);
          else sum += 4 * f(val);
        }
        setResult((sum * h) / 3);
      }
    } catch (e) {
      setErrorMsg("Error evaluating function. Please check your syntax.");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
           <div className="col-span-2 md:col-span-1">
             <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">Function f(x)</label>
             <input className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 font-mono focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" 
               value={funcStr} onChange={e => setFuncStr(e.target.value)} />
           </div>
           <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">Lower Limit (a)</label>
              <input type="number" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" 
               value={a} onChange={e => setA(Number(e.target.value))} />
           </div>
           <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">Upper Limit (b)</label>
              <input type="number" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" 
               value={b} onChange={e => setB(Number(e.target.value))} />
           </div>
           <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">Segments (n)</label>
              <input type="number" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" 
               value={n} onChange={e => setN(Number(e.target.value))} />
           </div>
        </div>

        {errorMsg && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-tight">{errorMsg}</span>
            </div>
        )}

        <button onClick={calculate} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-8 rounded-xl w-full md:w-auto shadow-lg shadow-emerald-600/20 transition-all active:scale-95 flex items-center justify-center gap-2">
          <Calculator className="w-4 h-4" />
          Compute Integral
        </button>
      </div>

      {result !== null && (
        <div className="bg-slate-900 rounded-2xl p-8 text-center shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Calculator className="w-32 h-32 text-white" />
          </div>
          <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] block mb-2 relative z-10">Approximate Integration Result</span>
          <span className="text-5xl font-bold text-emerald-400 font-mono tracking-tighter relative z-10">{result.toFixed(8)}</span>
        </div>
      )}

      <div className="h-[400px] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm relative transition-colors">
        <div className="absolute top-6 left-6 z-10">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white/80 dark:bg-slate-900/80 px-2 py-1 rounded border border-slate-200 dark:border-slate-800 shadow-sm">Area under curve visualization</span>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 40, right: 20, left: 10, bottom: 10 }}>
             <defs>
                <linearGradient id="colorY" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="x" stroke="#94a3b8" tick={{fontSize: 11, fill: '#94a3b8'}} type="number" domain={['auto', 'auto']} />
            <YAxis stroke="#94a3b8" tick={{fontSize: 11, fill: '#94a3b8'}} />
            <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderColor: '#e2e8f0', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }} 
                itemStyle={{color: '#334155'}}
                formatter={(v: number) => v.toFixed(6)}
            />
            <Area type="monotone" dataKey="y" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorY)" isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30 p-5 rounded-2xl flex gap-3 items-center">
          <Info className="w-5 h-5 text-emerald-600 dark:text-emerald-500 shrink-0" />
          <p className="text-[11px] text-emerald-800 dark:text-emerald-400 font-medium leading-relaxed">
            <strong>Note:</strong> Higher segment counts (n) generally improve accuracy, but may increase computational overhead. Simpson's rule requires an <strong>even</strong> number of segments to fit parabolic arcs correctly.
          </p>
      </div>
    </div>
  );
};