import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { AlgorithmType } from '../../types';
import { compileMathFunction } from '../../utils/mathUtils';
import { AlertCircle, Activity, Play } from 'lucide-react';

interface ODEDemoProps {
  type: AlgorithmType;
}

export const ODEDemo: React.FC<ODEDemoProps> = ({ type }) => {
  const [funcStr, setFuncStr] = useState("x + y"); // dy/dx = x + y
  const [x0, setX0] = useState(0);
  const [y0, setY0] = useState(1);
  const [h, setH] = useState(0.1);
  const [xEnd, setXEnd] = useState(1);
  const [maxSteps, setMaxSteps] = useState(1000);
  const [data, setData] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const solve = () => {
    setErrorMsg(null);
    try {
      // f(x, y) - compile for two arguments
      const f = compileMathFunction(funcStr, ['x', 'y']) as (x: number, y: number) => number;
      
      // Limit steps to maxSteps to prevent browser freeze
      let steps = Math.ceil((xEnd - x0) / h);
      if (steps > maxSteps) {
        setErrorMsg(`Step count (${steps}) exceeds limit (${maxSteps}). Increase 'h' or 'Max Steps'.`);
        return;
      }
      if (steps <= 0 || !isFinite(steps)) {
         setErrorMsg("Invalid range or step size (h). Check if xEnd > x0.");
         return;
      }

      const result = [{ x: Number(x0.toFixed(4)), y: y0 }];
      
      let currX = x0;
      let currY = y0;

      for (let i = 0; i < steps; i++) {
        if (type === AlgorithmType.EULER) {
          currY = currY + h * f(currX, currY);
        } else {
          // RK4
          const k1 = h * f(currX, currY);
          const k2 = h * f(currX + h/2, currY + k1/2);
          const k3 = h * f(currX + h/2, currY + k2/2);
          const k4 = h * f(currX + h, currY + k3);
          currY = currY + (k1 + 2*k2 + 2*k3 + k4) / 6;
        }
        currX = currX + h;
        result.push({ x: Number(currX.toFixed(4)), y: currY });
      }
      setData(result);
    } catch (e) {
      setErrorMsg("Invalid derivative function syntax. Use 'x' and 'y' as variables.");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
       <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
         <div className="grid grid-cols-2 md:grid-cols-6 gap-6 mb-6">
           <div className="col-span-2">
             <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase block mb-2 tracking-wider">dy/dx = f(x,y)</label>
             <input className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 font-mono focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" 
               value={funcStr} onChange={e => setFuncStr(e.target.value)} placeholder="e.g. x + y" />
           </div>
           <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase block mb-2 tracking-wider">x0</label>
              <input type="number" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" 
               value={x0} onChange={e => setX0(Number(e.target.value))} />
           </div>
           <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase block mb-2 tracking-wider">y0</label>
              <input type="number" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" 
               value={y0} onChange={e => setY0(Number(e.target.value))} />
           </div>
           <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase block mb-2 tracking-wider">Step (h)</label>
              <input type="number" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" 
               value={h} onChange={e => setH(Number(e.target.value))} step="0.01" />
           </div>
           <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase block mb-2 tracking-wider">Max Steps</label>
              <input type="number" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" 
               value={maxSteps} onChange={e => setMaxSteps(Number(e.target.value))} />
           </div>
         </div>

         {errorMsg && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-tight">{errorMsg}</span>
            </div>
         )}

         <button onClick={solve} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-8 rounded-xl w-full md:w-auto shadow-lg shadow-emerald-600/20 transition-all active:scale-95 flex items-center justify-center gap-2">
           <Play className="w-4 h-4" />
           Run Simulation
         </button>
       </div>

       <div className="h-[450px] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm relative transition-colors">
         <div className="absolute top-6 left-6 z-10">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white/80 dark:bg-slate-900/80 px-2 py-1 rounded border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-2">
                <Activity className="w-3 h-3 text-emerald-500" />
                Trajectory Solution
            </span>
         </div>
         <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 40, right: 30, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="x" stroke="#94a3b8" tick={{fontSize: 11, fill: '#94a3b8'}} label={{ value: 'x', position: 'insideBottomRight', offset: -10, fill: '#94a3b8', fontSize: 10, fontWeight: 800 }} />
            <YAxis stroke="#94a3b8" tick={{fontSize: 11, fill: '#94a3b8'}} />
            <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderColor: '#e2e8f0', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }} 
                itemStyle={{color: '#334155'}}
            />
            <Legend verticalAlign="top" height={40} iconType="circle" wrapperStyle={{fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: '#64748b'}} />
            <Line 
                type="monotone" 
                dataKey="y" 
                stroke="#3b82f6" 
                name={`${type} Approximation`} 
                strokeWidth={3} 
                dot={{r: 2, fill: '#3b82f6', stroke: '#fff', strokeWidth: 1}} 
                activeDot={{r: 6, strokeWidth: 0}}
                isAnimationActive={true}
                animationDuration={800}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};