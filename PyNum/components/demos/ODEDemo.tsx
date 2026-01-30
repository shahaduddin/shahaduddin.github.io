import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { AlgorithmType } from '../../types';
import { compileMathFunction } from '../../utils/mathUtils';

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

  const solve = () => {
    try {
      // f(x, y) - compile for two arguments
      const f = compileMathFunction(funcStr, ['x', 'y']) as (x: number, y: number) => number;
      
      // Limit steps to maxSteps to prevent browser freeze
      let steps = Math.ceil((xEnd - x0) / h);
      if (steps > maxSteps) {
        alert(`Number of steps (${steps}) exceeds maximum allowed (${maxSteps}). Increase step size or max steps.`);
        steps = maxSteps;
      }
      if (steps <= 0 || !isFinite(steps)) {
         alert("Invalid range or step size.");
         return;
      }

      const result = [{ x: x0, y: y0 }];
      
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
      alert("Invalid derivative function. Check syntax.");
    }
  };

  return (
    <div className="space-y-6">
       <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
         <div className="grid grid-cols-2 md:grid-cols-6 gap-6 mb-6">
           <div className="col-span-2">
             <label className="text-xs font-bold text-slate-500 uppercase">dy/dx = f(x,y)</label>
             <input className="w-full mt-2 bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 font-mono focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" 
               value={funcStr} onChange={e => setFuncStr(e.target.value)} placeholder="e.g. x + y" />
             <p className="text-[10px] text-slate-400 mt-1 font-medium">Supports: x+y, sin(x)*y, y^2</p>
           </div>
           <div>
              <label className="text-xs font-bold text-slate-500 uppercase">x0</label>
              <input type="number" className="w-full mt-2 bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" 
               value={x0} onChange={e => setX0(Number(e.target.value))} />
           </div>
           <div>
              <label className="text-xs font-bold text-slate-500 uppercase">y0</label>
              <input type="number" className="w-full mt-2 bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" 
               value={y0} onChange={e => setY0(Number(e.target.value))} />
           </div>
           <div>
              <label className="text-xs font-bold text-slate-500 uppercase">Step (h)</label>
              <input type="number" className="w-full mt-2 bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" 
               value={h} onChange={e => setH(Number(e.target.value))} step="0.01" />
           </div>
           <div>
              <label className="text-xs font-bold text-slate-500 uppercase">Max Steps</label>
              <input type="number" className="w-full mt-2 bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" 
               value={maxSteps} onChange={e => setMaxSteps(Number(e.target.value))} />
           </div>
         </div>
         <button onClick={solve} className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 px-6 rounded-lg w-full md:w-auto shadow-md shadow-emerald-600/20 transition-all hover:scale-105 active:scale-95">
           Simulate ODE
         </button>
       </div>

       <div className="h-80 bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 20, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="x" stroke="#64748b" label={{ value: 'x', position: 'insideBottom', fill: '#64748b', dy: 10 }} tick={{fontSize: 12}} />
            <YAxis stroke="#64748b" label={{ value: 'y', angle: -90, position: 'insideLeft', fill: '#64748b' }} tick={{fontSize: 12}} />
            <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} itemStyle={{color: '#334155'}} />
            <Legend verticalAlign="top" height={36}/>
            <Line type="monotone" dataKey="y" stroke="#3b82f6" name={`${type} Approximation`} strokeWidth={3} dot={{r: 3, fill: '#3b82f6', stroke: '#fff'}} activeDot={{r: 6}} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};