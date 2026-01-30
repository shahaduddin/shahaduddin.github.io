import React, { useState, useMemo } from 'react';
import { ComposedChart, Line, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlgorithmType } from '../../types';
import { Table, FileText, Plus, Trash2, AlertTriangle, Grid3X3, ListOrdered } from 'lucide-react';

interface InterpolationDemoProps {
  type: AlgorithmType;
}

interface Point {
  x: number;
  y: number;
}

export const InterpolationDemo: React.FC<InterpolationDemoProps> = ({ type }) => {
  const [inputMode, setInputMode] = useState<'text' | 'table'>('table');
  const [pointsStr, setPointsStr] = useState("0,1; 1,2; 2,9; 3,28; 4,65");
  const [evalX, setEvalX] = useState<number>(1.5);
  const [points, setPoints] = useState<Point[]>([
    {x: 0, y: 1}, {x: 1, y: 2}, {x: 2, y: 9}, {x: 3, y: 28}, {x: 4, y: 65}
  ]);
  const [error, setError] = useState<string | null>(null);

  const isEvenlySpacedMethod = 
    type === AlgorithmType.NEWTON_FORWARD_DIFFERENCE || 
    type === AlgorithmType.NEWTON_BACKWARD_DIFFERENCE ||
    type === AlgorithmType.GAUSS_FORWARD_INTERPOLATION ||
    type === AlgorithmType.GAUSS_BACKWARD_INTERPOLATION;

  // Always use sorted points for calculations to ensure Splines/Difference methods work correctly
  // regardless of input order in the table.
  const sortedPoints = useMemo(() => {
    return [...points].sort((a, b) => a.x - b.x);
  }, [points]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPointsStr(val);
    try {
      const parts = val.split(';').map(p => p.trim());
      const newPoints: Point[] = [];
      for (const p of parts) {
        if (!p) continue;
        const [x, y] = p.split(',').map(n => parseFloat(n.trim()));
        if (!isNaN(x) && !isNaN(y)) {
          newPoints.push({ x, y });
        }
      }
      if (newPoints.length >= 2) {
        setPoints(newPoints);
        setError(null);
      } else {
        // Keep old points if input is incomplete/invalid to prevent crash, but show error
        // Actually, standard behavior is usually to just let it be invalid until fixed
        // But for chart stability we often guard.
      }
    } catch (err) {
      setError("Invalid format. Use x,y; x,y");
    }
  };

  const updatePoints = (newPoints: Point[]) => {
    setPoints(newPoints);
    setPointsStr(newPoints.map(p => `${p.x},${p.y}`).join('; '));
    setError(null);
  };

  const handleTableChange = (index: number, field: 'x' | 'y', value: string) => {
    const newPoints = [...points];
    const numVal = parseFloat(value);
    // Allow typing by checking if valid number, else keep previous or 0? 
    // Usually standard controlled input behavior. 
    // Here we will just update.
    newPoints[index] = { ...newPoints[index], [field]: isNaN(numVal) ? 0 : numVal };
    updatePoints(newPoints);
  };

  const addPoint = () => {
    const lastPoint = sortedPoints[sortedPoints.length - 1] || { x: 0, y: 0 };
    const newPoints = [...points, { x: lastPoint.x + 1, y: 0 }];
    updatePoints(newPoints);
  };

  const removePoint = (index: number) => {
    if (points.length <= 2) {
      setError("Minimum 2 points required");
      return;
    }
    const newPoints = points.filter((_, i) => i !== index);
    updatePoints(newPoints);
  };

  // Helper to calculate Factorial
  const factorial = (n: number): number => {
    if (n === 0 || n === 1) return 1;
    let res = 1;
    for(let i=2; i<=n; i++) res *= i;
    return res;
  };

  // Precompute spline coefficients when points change
  const splineData = useMemo(() => {
    const pts = sortedPoints;
    if (pts.length < 2) return null;

    if (type === AlgorithmType.QUADRATIC_SPLINE) {
      const n = pts.length - 1;
      const a = new Array(n).fill(0);
      const b = new Array(n).fill(0);
      const c = new Array(n).fill(0);
      
      a[0] = 0;
      c[0] = pts[0].y;
      b[0] = (pts[1].y - pts[0].y) / (pts[1].x - pts[0].x);

      for (let i = 1; i < n; i++) {
         const hPrev = pts[i].x - pts[i-1].x;
         const hCurr = pts[i+1].x - pts[i].x;
         b[i] = 2 * a[i-1] * hPrev + b[i-1];
         c[i] = pts[i].y;
         a[i] = (pts[i+1].y - pts[i].y - b[i] * hCurr) / (hCurr * hCurr);
      }
      return { a, b, c };
    } 
    else if (type === AlgorithmType.CUBIC_SPLINE) {
      const n = pts.length - 1;
      const h = new Array(n);
      for(let i=0; i<n; i++) h[i] = pts[i+1].x - pts[i].x;
      
      const alpha = new Array(n).fill(0);
      for(let i=1; i<n; i++) {
        alpha[i] = (3/h[i])*(pts[i+1].y - pts[i].y) - (3/h[i-1])*(pts[i].y - pts[i-1].y);
      }
      
      const l = new Array(n+1).fill(0);
      const mu = new Array(n+1).fill(0);
      const z = new Array(n+1).fill(0);
      l[0] = 1; mu[0] = 0; z[0] = 0;
      
      for(let i=1; i<n; i++) {
        l[i] = 2*(pts[i+1].x - pts[i-1].x) - h[i-1]*mu[i-1];
        mu[i] = h[i]/l[i];
        z[i] = (alpha[i] - h[i-1]*z[i-1])/l[i];
      }
      l[n] = 1; z[n] = 0;
      
      const c = new Array(n+1).fill(0);
      const b = new Array(n).fill(0);
      const d = new Array(n).fill(0);
      const a = new Array(n).fill(0);
      
      for(let j=n-1; j>=0; j--) {
        c[j] = z[j] - mu[j]*c[j+1];
        b[j] = (pts[j+1].y - pts[j].y)/h[j] - h[j]*(c[j+1] + 2*c[j])/3;
        d[j] = (c[j+1] - c[j])/(3*h[j]);
        a[j] = pts[j].y;
      }
      return { a, b, c, d };
    }
    return null;
  }, [sortedPoints, type]);

  // Difference Tables for Evenly Spaced Methods
  const diffTable = useMemo(() => {
      if (!isEvenlySpacedMethod) return null;
      const pts = sortedPoints;
      const n = pts.length;
      if (n === 0) return null;

      const table = Array.from({length: n}, () => Array(n).fill(0));
      // First col is y
      for(let i=0; i<n; i++) table[i][0] = pts[i].y;

      // Calculate the entire difference table
      // Standard definition: diff[i][j] = diff[i+1][j-1] - diff[i][j-1]
      for (let j = 1; j < n; j++) {
          for (let i = 0; i < n - j; i++) {
              table[i][j] = table[i+1][j-1] - table[i][j-1];
          }
      }
      return table;
  }, [sortedPoints, type, isEvenlySpacedMethod]);

  const interpolate = (xi: number): number => {
    const pts = sortedPoints;
    const n = pts.length;
    if (n < 2) return 0;

    // 1. Splines
    if (type === AlgorithmType.LINEAR_SPLINE) {
        for (let i = 0; i < n - 1; i++) {
            if (xi >= pts[i].x && xi <= pts[i+1].x) {
                const m = (pts[i+1].y - pts[i].y) / (pts[i+1].x - pts[i].x);
                return pts[i].y + m * (xi - pts[i].x);
            }
        }
        return 0; 
    } else if (type === AlgorithmType.QUADRATIC_SPLINE) {
        if (!splineData) return 0;
        const { a, b, c } = splineData as any;
        for(let i=0; i < n - 1; i++) {
             if (xi >= pts[i].x && xi <= pts[i+1].x) {
                 const dx = xi - pts[i].x;
                 return a[i]*dx*dx + b[i]*dx + c[i];
             }
        }
        return 0;
    } else if (type === AlgorithmType.CUBIC_SPLINE) {
        if (!splineData) return 0;
        const { a, b, c, d } = splineData as any;
        for(let i=0; i < n - 1; i++) {
             if (xi >= pts[i].x && xi <= pts[i+1].x) {
                 const dx = xi - pts[i].x;
                 return a[i] + b[i]*dx + c[i]*dx*dx + d[i]*dx*dx*dx;
             }
        }
        return 0;
    }
    // 2. Central Difference Methods (Gauss)
    else if (
        type === AlgorithmType.GAUSS_FORWARD_INTERPOLATION || 
        type === AlgorithmType.GAUSS_BACKWARD_INTERPOLATION
    ) {
        if (!diffTable) return 0;
        const h = pts[1].x - pts[0].x;
        const mid = Math.floor(n / 2); 
        const u = (xi - pts[mid].x) / h;
        
        let result = diffTable[mid][0]; // y[mid]
        let u_term = 1;
        
        for (let i = 1; i < n; i++) {
            if (type === AlgorithmType.GAUSS_FORWARD_INTERPOLATION) {
                 if (i === 1) u_term *= u;
                 else if (i % 2 === 0) u_term *= (u - Math.floor(i/2));
                 else u_term *= (u + Math.floor(i/2));
                 
                 const idx = mid - Math.floor(i/2);
                 if (idx >= 0 && idx < n - i) {
                     result += (u_term * diffTable[idx][i]) / factorial(i);
                 }
            } else {
                 if (i === 1) u_term *= u;
                 else if (i % 2 === 0) u_term *= (u + (i/2)); 
                 else u_term *= (u - Math.floor(i/2));

                 const idx = mid - Math.floor((i+1)/2);
                 if (idx >= 0 && idx < n - i) {
                     result += (u_term * diffTable[idx][i]) / factorial(i);
                 }
            }
        }
        return result;
    }
    // 3. Newton Forward/Backward
    else if (isEvenlySpacedMethod) {
        if (!diffTable) return 0;
        const h = pts[1].x - pts[0].x;
        
        if (type === AlgorithmType.NEWTON_FORWARD_DIFFERENCE) {
            const u = (xi - pts[0].x) / h;
            let result = diffTable[0][0];
            let u_term = 1;
            for(let i=1; i<n; i++) {
                u_term = u_term * (u - (i-1));
                result += (u_term * diffTable[0][i]) / factorial(i);
            }
            return result;
        } else {
            // Backward
            const u = (xi - pts[n-1].x) / h;
            let result = diffTable[n-1][0];
            let u_term = 1;
            for(let i=1; i<n; i++) {
                u_term = u_term * (u + (i-1));
                result += (u_term * diffTable[n-1][i]) / factorial(i);
            }
            return result;
        }
    }
    // 4. Lagrange / Divided Difference (General Polynomial)
    else {
        let result = 0;
        for (let i = 0; i < n; i++) {
            let term = pts[i].y;
            for (let j = 0; j < n; j++) {
                if (i !== j) {
                    term = term * (xi - pts[j].x) / (pts[i].x - pts[j].x);
                }
            }
            result += term;
        }
        return result;
    }
  };

  // Validation for Evenly Spaced
  const spacingError = useMemo(() => {
    if (!isEvenlySpacedMethod) return null;
    const pts = sortedPoints;
    if (pts.length < 2) return null;
    const h = pts[1].x - pts[0].x;
    for(let i=1; i < pts.length - 1; i++) {
        if (Math.abs((pts[i+1].x - pts[i].x) - h) > 0.0001) {
            return "Points must be evenly spaced for this method.";
        }
    }
    return null;
  }, [sortedPoints, isEvenlySpacedMethod]);

  const chartData = useMemo(() => {
    const pts = sortedPoints;
    if (pts.length < 2 || spacingError) return [];
    
    const minX = pts[0].x;
    const maxX = pts[pts.length - 1].x;
    const range = maxX - minX;
    const step = range / 100;
    
    const data = [];
    const isSpline = type.includes("Spline");
    const start = isSpline ? minX : minX - range * 0.1;
    const end = isSpline ? maxX : maxX + range * 0.1;

    for (let x = start; x <= end; x += step) {
      data.push({ x: Number(x.toFixed(2)), y: interpolate(x) });
    }
    if (isSpline) {
       data.push({ x: maxX, y: interpolate(maxX) });
    }
    return data;
  }, [sortedPoints, type, interpolate, spacingError]);

  const evalResult = useMemo(() => {
     try {
       if (spacingError) return null;
       const pts = sortedPoints;
       if (pts.length < 2) return null;

       if (type.includes("Spline")) {
          if (evalX < pts[0].x || evalX > pts[pts.length-1].x) return null;
       }
       return interpolate(evalX);
     } catch { return null; }
  }, [evalX, sortedPoints, type, interpolate, spacingError]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col gap-6">
         
         <div className="flex flex-col md:flex-row gap-6">
             {/* Input Section */}
             <div className="flex-1 space-y-4">
                 <div className="flex items-center justify-between">
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Data Points</label>
                     <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                        <button
                           onClick={() => setInputMode('table')}
                           className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                             inputMode === 'table' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                           }`}
                        >
                           <Table className="w-3.5 h-3.5" />
                           Table
                        </button>
                        <button
                           onClick={() => setInputMode('text')}
                           className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                             inputMode === 'text' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                           }`}
                        >
                           <FileText className="w-3.5 h-3.5" />
                           Text
                        </button>
                     </div>
                 </div>

                 {inputMode === 'text' ? (
                     <div>
                       <input 
                         className={`w-full bg-slate-50 border rounded-lg px-4 py-3 text-sm text-slate-900 font-mono focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all ${error || spacingError ? 'border-red-400 focus:ring-red-500/20' : 'border-slate-300'}`} 
                         value={pointsStr} 
                         onChange={handleTextChange} 
                         placeholder="0,1; 1,2; 2,5"
                       />
                       <p className="mt-2 text-[10px] text-slate-400">Format: x,y; x,y; ...</p>
                     </div>
                 ) : (
                     <div className="border border-slate-200 rounded-lg overflow-hidden">
                        <div className="max-h-[220px] overflow-y-auto custom-scrollbar">
                           <table className="w-full text-sm">
                               <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                                   <tr>
                                      <th className="px-4 py-2 text-left text-xs font-bold text-slate-500 uppercase w-12 text-center">#</th>
                                      <th className="px-4 py-2 text-left text-xs font-bold text-slate-500 uppercase">X</th>
                                      <th className="px-4 py-2 text-left text-xs font-bold text-slate-500 uppercase">Y</th>
                                      <th className="w-10"></th>
                                   </tr>
                               </thead>
                               <tbody className="divide-y divide-slate-100">
                                   {points.map((p, i) => (
                                       <tr key={i} className="group hover:bg-slate-50 transition-colors">
                                           <td className="px-4 py-2 text-center text-xs text-slate-400 font-mono">{i+1}</td>
                                           <td className="px-4 py-2">
                                               <input 
                                                 type="number" 
                                                 value={p.x} 
                                                 onChange={(e) => handleTableChange(i, 'x', e.target.value)}
                                                 className="w-full bg-transparent border border-transparent hover:border-slate-200 focus:border-emerald-500 rounded px-2 py-1 text-slate-800 font-mono outline-none transition-all focus:bg-white"
                                               />
                                           </td>
                                           <td className="px-4 py-2">
                                               <input 
                                                 type="number" 
                                                 value={p.y} 
                                                 onChange={(e) => handleTableChange(i, 'y', e.target.value)}
                                                 className="w-full bg-transparent border border-transparent hover:border-slate-200 focus:border-emerald-500 rounded px-2 py-1 text-slate-800 font-mono outline-none transition-all focus:bg-white"
                                               />
                                           </td>
                                           <td className="px-2">
                                               <button 
                                                onClick={() => removePoint(i)}
                                                className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-all opacity-0 group-hover:opacity-100"
                                               >
                                                   <Trash2 className="w-4 h-4" />
                                               </button>
                                           </td>
                                       </tr>
                                   ))}
                               </tbody>
                           </table>
                        </div>
                        <button 
                            onClick={addPoint} 
                            className="w-full py-2.5 flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider border-t border-slate-200 transition-colors"
                        >
                            <Plus className="w-4 h-4" /> Add Data Point
                        </button>
                     </div>
                 )}
                 {(error || spacingError) && (
                     <div className="flex items-center gap-2 text-red-600 text-xs font-medium bg-red-50 p-3 rounded-lg border border-red-100 animate-in slide-in-from-top-1">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        {error || spacingError}
                     </div>
                 )}
             </div>

             {/* Evaluate Section */}
             <div className="md:w-64 space-y-4">
                 <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Evaluate Interpolation</label>
                 <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                    <div>
                        <span className="text-xs text-slate-400 font-bold uppercase mb-1.5 block">Target X</span>
                        <input 
                            type="number" 
                            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" 
                            value={evalX} 
                            onChange={e => setEvalX(Number(e.target.value))} 
                        />
                    </div>
                    
                    <div className="pt-4 border-t border-slate-200">
                        <span className="text-xs text-slate-400 font-bold uppercase mb-2 block">Result Y</span>
                        <div className="text-2xl font-mono font-bold text-emerald-600 truncate bg-white border border-emerald-100 rounded-lg p-3 text-center shadow-sm">
                            {evalResult !== null ? evalResult.toFixed(6) : "---"}
                        </div>
                    </div>
                 </div>
             </div>
         </div>
      </div>

      <div className="h-80 bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        {spacingError ? (
             <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3">
                 <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center">
                     <Grid3X3 className="w-6 h-6 text-slate-300" />
                 </div>
                 <p className="text-sm font-medium">Visualization unavailable due to uneven spacing</p>
             </div>
        ) : (
            <ResponsiveContainer width="100%" height="100%">
            <ComposedChart>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="x" type="number" domain={['auto', 'auto']} stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis dataKey="y" stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                    itemStyle={{ color: '#334155' }}
                    labelStyle={{ color: '#64748b' }}
                    formatter={(value: number) => value.toFixed(6)}
                />
                <Line data={chartData} type="monotone" dataKey="y" stroke="#10b981" strokeWidth={3} dot={false} isAnimationActive={false} />
                <Scatter data={sortedPoints} fill="#f59e0b" r={6} stroke="#fff" strokeWidth={2} />
                {evalResult !== null && (
                    <Scatter data={[{x: evalX, y: evalResult}]} fill="#ef4444" shape="star" r={10} name="Evaluation Point" />
                )}
            </ComposedChart>
            </ResponsiveContainer>
        )}
      </div>

      <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 text-sm text-slate-600 shadow-sm flex gap-3">
         <ListOrdered className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
         <div className="space-y-1">
           <p><strong className="text-slate-900">Algorithm Note:</strong></p>
           <ul className="list-disc pl-4 space-y-1 text-xs text-slate-500">
               {isEvenlySpacedMethod && <li>Newton and Gauss methods strictly require <strong>evenly spaced X values</strong>.</li>}
               {type === AlgorithmType.LINEAR_SPLINE && <li>Linear Spline connects points with straight lines (C0 continuous).</li>}
               {type === AlgorithmType.QUADRATIC_SPLINE && <li>Quadratic Spline ensures continuity of the first derivative.</li>}
               {type === AlgorithmType.CUBIC_SPLINE && <li>Cubic Spline ensures continuity of the second derivative (Natural Spline).</li>}
               {!isEvenlySpacedMethod && !type.includes("Spline") && <li>General interpolation methods work for any distribution of points.</li>}
               <li>Points are automatically sorted by X coordinate for calculations.</li>
           </ul>
         </div>
      </div>
    </div>
  );
};