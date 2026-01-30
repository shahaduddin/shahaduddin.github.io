import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlgorithmType } from '../../types';
import { compileMathFunction } from '../../utils/mathUtils';

interface IntegrationDemoProps {
  type: AlgorithmType;
}

export const IntegrationDemo: React.FC<IntegrationDemoProps> = ({ type }) => {
  const [funcStr, setFuncStr] = useState("x^2");
  const [a, setA] = useState(0);
  const [b, setB] = useState(1);
  const [n, setN] = useState(10); // Segments
  const [result, setResult] = useState<number | null>(null);

  const chartData = useMemo(() => {
    try {
      const f = compileMathFunction(funcStr) as (val: number) => number;
      const data = [];
      const step = (b - a) / 50;
      for (let plotVal = a; plotVal <= b; plotVal += step) {
        data.push({ x: Number(plotVal.toFixed(2)), y: f(plotVal) });
      }
      return data;
    } catch { return []; }
  }, [funcStr, a, b]);

  const calculate = () => {
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
          alert("N must be even for Simpson's Rule");
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
      alert("Error evaluating function. Check syntax.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
           <div className="col-span-2 md:col-span-1">
             <label className="text-xs font-bold text-slate-500 uppercase">Function f(x)</label>
             <input className="w-full mt-2 bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 font-mono focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" 
               value={funcStr} onChange={e => setFuncStr(e.target.value)} />
             <p className="text-[10px] text-slate-400 mt-1 font-medium">{'Supports: sin(x), x^3, \\frac{1}{x}'}</p>
           </div>
           <div>
              <label className="text-xs font-bold text-slate-500 uppercase">Lower Limit (a)</label>
              <input type="number" className="w-full mt-2 bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" 
               value={a} onChange={e => setA(Number(e.target.value))} />
           </div>
           <div>
              <label className="text-xs font-bold text-slate-500 uppercase">Upper Limit (b)</label>
              <input type="number" className="w-full mt-2 bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" 
               value={b} onChange={e => setB(Number(e.target.value))} />
           </div>
           <div>
              <label className="text-xs font-bold text-slate-500 uppercase">Segments (n)</label>
              <input type="number" className="w-full mt-2 bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" 
               value={n} onChange={e => setN(Number(e.target.value))} />
           </div>
        </div>
        <button onClick={calculate} className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 px-6 rounded-lg w-full md:w-auto shadow-md shadow-emerald-600/20 transition-all hover:scale-105 active:scale-95">
          Compute Integral
        </button>
      </div>

      {result !== null && (
        <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-xl text-center shadow-sm">
          <span className="text-slate-500 text-xs font-bold uppercase tracking-widest block mb-2">Approximate Integral</span>
          <span className="text-4xl font-bold text-emerald-600 font-mono tracking-tight">{result.toFixed(6)}</span>
        </div>
      )}

      <div className="h-72 bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
             <defs>
                <linearGradient id="colorY" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="x" stroke="#94a3b8" tick={{fontSize: 12}} />
            <YAxis stroke="#94a3b8" tick={{fontSize: 12}} />
            <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} itemStyle={{color: '#334155'}} />
            <Area type="monotone" dataKey="y" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorY)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};