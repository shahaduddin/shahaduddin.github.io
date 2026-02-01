import React, { useState, useMemo, useEffect } from 'react';
import { ComposedChart, Line, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlgorithmType } from '../../types';
import { Table, FileText, Plus, Trash2, AlertTriangle, Grid3X3, ListOrdered, Play, Download, Trash, Beaker, ChevronDown } from 'lucide-react';

interface InterpolationDemoProps {
  type: AlgorithmType;
}

interface Point {
  x: number;
  y: number;
}

const PRESETS = [
  {
    name: "Linear Trend",
    points: [{x: 0, y: 0}, {x: 1, y: 2.1}, {x: 2, y: 3.9}, {x: 3, y: 6.2}, {x: 4, y: 8.0}]
  },
  {
    name: "Runge's Phenomenon",
    points: [{x: -1, y: 0.038}, {x: -0.6, y: 0.1}, {x: -0.2, y: 0.8}, {x: 0.2, y: 0.8}, {x: 0.6, y: 0.1}, {x: 1, y: 0.038}]
  },
  {
    name: "Sine Wave (0 to π)",
    points: [{x: 0, y: 0}, {x: 0.78, y: 0.707}, {x: 1.57, y: 1}, {x: 2.35, y: 0.707}, {x: 3.14, y: 0}]
  },
  {
    name: "Exponential",
    points: [{x: 0, y: 1}, {x: 1, y: 2.71}, {x: 2, y: 7.38}, {x: 3, y: 20.08}]
  }
];

export const InterpolationDemo: React.FC<InterpolationDemoProps> = ({ type }) => {
  const [inputMode, setInputMode] = useState<'text' | 'table'>('table');
  const [points, setPoints] = useState<Point[]>(PRESETS[0].points);
  const [pointsStr, setPointsStr] = useState("");
  const [evalX, setEvalX] = useState<number>(1.5);
  const [resultY, setResultY] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPresets, setShowPresets] = useState(false);

  const isEvenlySpacedMethod = 
    type === AlgorithmType.NEWTON_FORWARD_DIFFERENCE || 
    type === AlgorithmType.NEWTON_BACKWARD_DIFFERENCE ||
    type === AlgorithmType.GAUSS_FORWARD_INTERPOLATION ||
    type === AlgorithmType.GAUSS_BACKWARD_INTERPOLATION;

  const sortedPoints = useMemo(() => {
    return [...points].sort((a, b) => a.x - b.x);
  }, [points]);

  useEffect(() => {
    setResultY(null);
    setError(null);
  }, [type, points, evalX]);

  const updatePoints = (newPoints: Point[]) => {
    setPoints(newPoints);
    setPointsStr(newPoints.map(p => `${p.x},${p.y}`).join('; '));
    setError(null);
  };

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
      }
    } catch (err) {
      setError("Invalid format. Use x,y; x,y");
    }
  };

  const handleTableChange = (index: number, field: 'x' | 'y', value: string) => {
    const newPoints = [...points];
    const numVal = parseFloat(value);
    newPoints[index] = { ...newPoints[index], [field]: isNaN(numVal) ? 0 : numVal };
    updatePoints(newPoints);
  };

  const addPoint = () => {
    const lastPoint = sortedPoints[sortedPoints.length - 1] || { x: 0, y: 0 };
    updatePoints([...points, { x: lastPoint.x + 1, y: 0 }]);
  };

  const removePoint = (index: number) => {
    if (points.length <= 2) {
      setError("Minimum 2 points required");
      return;
    }
    updatePoints(points.filter((_, i) => i !== index));
  };

  const factorial = (n: number): number => {
    if (n === 0 || n === 1) return 1;
    let res = 1;
    for(let i=2; i<=n; i++) res *= i;
    return res;
  };

  const splineData = useMemo(() => {
    const pts = sortedPoints;
    if (pts.length < 2) return null;

    if (type === AlgorithmType.QUADRATIC_SPLINE) {
      const n = pts.length - 1;
      const a = new Array(n).fill(0), b = new Array(n).fill(0), c = new Array(n).fill(0);
      a[0] = 0; c[0] = pts[0].y;
      b[0] = (pts[1].y - pts[0].y) / (pts[1].x - pts[0].x);
      for (let i = 1; i < n; i++) {
         const hPrev = pts[i].x - pts[i-1].x, hCurr = pts[i+1].x - pts[i].x;
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
      for(let i=1; i<n; i++) alpha[i] = (3/h[i])*(pts[i+1].y - pts[i].y) - (3/h[i-1])*(pts[i].y - pts[i-1].y);
      const l = new Array(n+1).fill(0), mu = new Array(n+1).fill(0), z = new Array(n+1).fill(0);
      l[0] = 1; mu[0] = 0; z[0] = 0;
      for(let i=1; i<n; i++) {
        l[i] = 2*(pts[i+1].x - pts[i-1].x) - h[i-1]*mu[i-1];
        mu[i] = h[i]/l[i];
        z[i] = (alpha[i] - h[i-1]*z[i-1])/l[i];
      }
      l[n] = 1; z[n] = 0;
      const c = new Array(n+1).fill(0), b = new Array(n).fill(0), d = new Array(n).fill(0), a = new Array(n).fill(0);
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

  const diffTable = useMemo(() => {
      if (!isEvenlySpacedMethod) return null;
      const pts = sortedPoints;
      const n = pts.length;
      if (n === 0) return null;
      const table = Array.from({length: n}, () => Array(n).fill(0));
      for(let i=0; i<n; i++) table[i][0] = pts[i].y;
      for (let j = 1; j < n; j++) {
          for (let i = 0; i < n - j; i++) table[i][j] = table[i+1][j-1] - table[i][j-1];
      }
      return table;
  }, [sortedPoints, type, isEvenlySpacedMethod]);

  const spacingError = useMemo(() => {
    if (!isEvenlySpacedMethod) return null;
    const pts = sortedPoints;
    if (pts.length < 2) return null;
    const h = pts[1].x - pts[0].x;
    for(let i=1; i < pts.length - 1; i++) {
        if (Math.abs((pts[i+1].x - pts[i].x) - h) > 0.001) return "Points must be evenly spaced for this method.";
    }
    return null;
  }, [sortedPoints, isEvenlySpacedMethod]);

  const performInterpolation = (xi: number): number => {
    const pts = sortedPoints;
    const n = pts.length;
    if (n < 2) return 0;

    if (type === AlgorithmType.LINEAR_SPLINE) {
        for (let i = 0; i < n - 1; i++) {
            if (xi >= pts[i].x && xi <= pts[i+1].x) {
                const m = (pts[i+1].y - pts[i].y) / (pts[i+1].x - pts[i].x);
                return pts[i].y + m * (xi - pts[i].x);
            }
        }
    } else if (type === AlgorithmType.QUADRATIC_SPLINE) {
        if (!splineData) return 0;
        const { a, b, c } = splineData as any;
        for(let i=0; i < n - 1; i++) {
             if (xi >= pts[i].x && xi <= pts[i+1].x) {
                 const dx = xi - pts[i].x;
                 return a[i]*dx*dx + b[i]*dx + c[i];
             }
        }
    } else if (type === AlgorithmType.CUBIC_SPLINE) {
        if (!splineData) return 0;
        const { a, b, c, d } = splineData as any;
        for(let i=0; i < n - 1; i++) {
             if (xi >= pts[i].x && xi <= pts[i+1].x) {
                 const dx = xi - pts[i].x;
                 return a[i] + b[i]*dx + c[i]*dx*dx + d[i]*dx*dx*dx;
             }
        }
    } else if (type === AlgorithmType.GAUSS_FORWARD_INTERPOLATION || type === AlgorithmType.GAUSS_BACKWARD_INTERPOLATION) {
        if (!diffTable) return 0;
        const h = pts[1].x - pts[0].x, mid = Math.floor(n / 2), u = (xi - pts[mid].x) / h;
        let result = diffTable[mid][0], u_term = 1;
        for (let i = 1; i < n; i++) {
            if (type === AlgorithmType.GAUSS_FORWARD_INTERPOLATION) {
                 if (i === 1) u_term *= u;
                 else if (i % 2 === 0) u_term *= (u - Math.floor(i/2));
                 else u_term *= (u + Math.floor(i/2));
                 const idx = mid - Math.floor(i/2);
                 if (idx >= 0 && idx < n - i) result += (u_term * diffTable[idx][i]) / factorial(i);
            } else {
                 if (i === 1) u_term *= u;
                 else if (i % 2 === 0) u_term *= (u + Math.floor(i/2)); 
                 else u_term *= (u - Math.floor(i/2));
                 const idx = mid - Math.floor((i+1)/2);
                 if (idx >= 0 && idx < n - i) result += (u_term * diffTable[idx][i]) / factorial(i);
            }
        }
        return result;
    } else if (isEvenlySpacedMethod) {
        if (!diffTable) return 0;
        const h = pts[1].x - pts[0].x;
        if (type === AlgorithmType.NEWTON_FORWARD_DIFFERENCE) {
            const u = (xi - pts[0].x) / h;
            let result = diffTable[0][0], u_term = 1;
            for(let i=1; i<n; i++) { u_term = u_term * (u - (i-1)); result += (u_term * diffTable[0][i]) / factorial(i); }
            return result;
        } else {
            const u = (xi - pts[n-1].x) / h;
            let result = diffTable[n-1][0], u_term = 1;
            for(let i=1; i<n; i++) { u_term = u_term * (u + (i-1)); result += (u_term * diffTable[n-1][i]) / factorial(i); }
            return result;
        }
    } else {
        let result = 0;
        for (let i = 0; i < n; i++) {
            let term = pts[i].y;
            for (let j = 0; j < n; j++) if (i !== j) term = term * (xi - pts[j].x) / (pts[i].x - pts[j].x);
            result += term;
        }
        return result;
    }
    return 0;
  };

  const handleCalculate = () => {
    if (spacingError) {
        setError(spacingError);
        return;
    }
    const val = performInterpolation(evalX);
    setResultY(val);
  };

  const exportCSV = () => {
    const csvRows = ["X,Y"];
    sortedPoints.forEach(p => csvRows.push(`${p.x},${p.y}`));
    const blob = new Blob([csvRows.join("\n")], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interpolation_data_${type.replace(/\s/g, '_')}.csv`;
    a.click();
  };

  const chartData = useMemo(() => {
    const pts = sortedPoints;
    if (pts.length < 2 || spacingError) return [];
    const minX = pts[0].x, maxX = pts[pts.length - 1].x, range = maxX - minX, step = range / 120;
    const data = [];
    const isSpline = type.includes("Spline");
    const start = isSpline ? minX : minX - range * 0.2;
    const end = isSpline ? maxX : maxX + range * 0.2;
    for (let x = start; x <= end; x += step) data.push({ x: Number(x.toFixed(3)), y: performInterpolation(x) });
    if (isSpline) data.push({ x: maxX, y: performInterpolation(maxX) });
    return data;
  }, [sortedPoints, type, spacingError]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex flex-col gap-6 transition-colors">
         
         <div className="flex flex-col md:flex-row gap-6">
             <div className="flex-1 space-y-4">
                 <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Input Dataset</label>
                        <div className="relative">
                            <button 
                                onClick={() => setShowPresets(!showPresets)}
                                className="flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors border border-emerald-100 dark:border-emerald-800"
                            >
                                <Beaker className="w-3 h-3" />
                                Samples
                                <ChevronDown className={`w-3 h-3 transition-transform ${showPresets ? 'rotate-180' : ''}`} />
                            </button>
                            {showPresets && (
                                <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-30 overflow-hidden py-1 animate-in zoom-in-95 origin-top-left transition-colors">
                                    {PRESETS.map(p => (
                                        <button 
                                            key={p.name}
                                            onClick={() => { setPoints(p.points); setShowPresets(false); setResultY(null); }}
                                            className="w-full text-left px-4 py-2 text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors border-b border-slate-50 dark:border-slate-700/50 last:border-0"
                                        >
                                            {p.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                     </div>
                     <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-inner">
                        <button onClick={() => setInputMode('table')} className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold uppercase transition-all ${inputMode === 'table' ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}><Table className="w-3.5 h-3.5" />Table</button>
                        <button onClick={() => setInputMode('text')} className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold uppercase transition-all ${inputMode === 'text' ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}><FileText className="w-3.5 h-3.5" />Text</button>
                     </div>
                 </div>

                 {inputMode === 'text' ? (
                     <div className="animate-in fade-in duration-300">
                       <input className={`w-full bg-slate-50 dark:bg-slate-950 border rounded-lg px-4 py-3 text-sm text-slate-900 dark:text-slate-100 font-mono focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all ${error || spacingError ? 'border-red-300' : 'border-slate-300 dark:border-slate-800'}`} value={pointsStr} onChange={handleTextChange} placeholder="0,1; 1,2; 2,5" />
                       <p className="mt-2 text-[10px] text-slate-400 dark:text-slate-500">Syntax: x1,y1; x2,y2; x3,y3 ...</p>
                     </div>
                 ) : (
                     <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden animate-in fade-in duration-300">
                        <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
                           <table className="w-full text-sm">
                               <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
                                   <tr>
                                      <th className="px-4 py-2 text-left text-xs font-bold text-slate-400 dark:text-slate-500 uppercase w-12 text-center">#</th>
                                      <th className="px-4 py-2 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">X Node</th>
                                      <th className="px-4 py-2 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Y Value</th>
                                      <th className="w-10"></th>
                                   </tr>
                               </thead>
                               <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                   {points.map((p, i) => (
                                       <tr key={i} className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                                           <td className="px-4 py-2 text-center text-xs text-slate-400 dark:text-slate-500 font-mono">{i+1}</td>
                                           <td className="px-4 py-2"><input type="number" value={p.x} onChange={(e) => handleTableChange(i, 'x', e.target.value)} className="w-full bg-transparent px-2 py-1 text-slate-800 dark:text-slate-200 font-mono text-sm outline-none focus:bg-white dark:focus:bg-slate-800 focus:ring-1 focus:ring-emerald-100 dark:focus:ring-emerald-900/30 rounded" /></td>
                                           <td className="px-4 py-2"><input type="number" value={p.y} onChange={(e) => handleTableChange(i, 'y', e.target.value)} className="w-full bg-transparent px-2 py-1 text-slate-800 dark:text-slate-200 font-mono text-sm outline-none focus:bg-white dark:focus:bg-slate-800 focus:ring-1 focus:ring-emerald-100 dark:focus:ring-emerald-900/30 rounded" /></td>
                                           <td className="px-2">
                                               <button onClick={() => removePoint(i)} className="p-1.5 text-slate-300 dark:text-slate-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-md transition-all opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                                           </td>
                                       </tr>
                                   ))}
                               </tbody>
                           </table>
                        </div>
                        <div className="flex bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
                            <button onClick={addPoint} className="flex-1 py-2.5 flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-black uppercase tracking-wider transition-colors"><Plus className="w-3.5 h-3.5" />Add Point</button>
                            <div className="w-px bg-slate-200 dark:bg-slate-800"></div>
                            <button onClick={() => updatePoints([{x:0,y:0}, {x:1,y:1}])} className="flex-1 py-2.5 flex items-center justify-center gap-2 hover:bg-red-50 dark:hover:bg-red-900/10 text-red-500 text-[10px] font-black uppercase tracking-wider transition-colors"><Trash className="w-3.5 h-3.5" />Clear</button>
                        </div>
                     </div>
                 )}
             </div>

             <div className="md:w-72 space-y-4">
                 <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Evaluation & Control</label>
                 <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4 shadow-inner">
                    <div>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase mb-1.5 block">Evaluate at X</span>
                        <input type="number" className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all shadow-sm" value={evalX} onChange={e => setEvalX(Number(e.target.value))} />
                    </div>
                    
                    <button 
                        onClick={handleCalculate}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
                    >
                        <Play className="w-4 h-4" />
                        Calculate Result
                    </button>

                    <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase mb-2 block">Interpolated Y</span>
                        <div className={`text-2xl font-mono font-bold truncate rounded-lg p-3 text-center border transition-all ${resultY !== null ? 'bg-white dark:bg-slate-900 border-emerald-200 dark:border-emerald-900/50 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-300 dark:text-slate-700'}`}>
                            {resultY !== null ? resultY.toFixed(6) : "---"}
                        </div>
                    </div>

                    <button 
                        onClick={exportCSV}
                        className="w-full text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 text-[10px] font-bold uppercase flex items-center justify-center gap-2 transition-colors"
                    >
                        <Download className="w-3 h-3" />
                        Export CSV
                    </button>
                 </div>
             </div>
         </div>

         {(error || spacingError) && (
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-xs font-bold bg-red-50 dark:bg-red-900/10 p-3 rounded-lg border border-red-100 dark:border-red-900/50 animate-in slide-in-from-top-1 uppercase">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {error || spacingError}
            </div>
         )}
      </div>

      <div className="h-80 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm relative overflow-hidden transition-colors">
        {spacingError ? (
             <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-700 gap-3">
                 <Grid3X3 className="w-12 h-12 opacity-10" />
                 <p className="text-sm font-medium">Visualization disabled</p>
             </div>
        ) : (
            <>
            <div className="absolute top-6 left-6 z-10 pointer-events-none">
                <span className="text-[10px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest bg-white/80 dark:bg-slate-900/80 px-2 py-1 rounded border border-slate-100 dark:border-slate-800">Interactive Map</span>
            </div>
            <ResponsiveContainer width="100%" height="100%">
            <ComposedChart>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="x" type="number" domain={['auto', 'auto']} stroke="#94a3b8" tick={{fill: '#94a3b8', fontSize: 10}} />
                <YAxis dataKey="y" stroke="#94a3b8" tick={{fill: '#94a3b8', fontSize: 10}} />
                <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px' }} 
                    formatter={(v: number) => v.toFixed(6)} 
                />
                <Line data={chartData} type="monotone" dataKey="y" stroke="#10b981" strokeWidth={3} dot={false} isAnimationActive={false} />
                <Scatter data={sortedPoints} fill="#f59e0b" r={5} stroke="#fff" strokeWidth={2} />
                {resultY !== null && (
                    <Scatter data={[{x: evalX, y: resultY}]} fill="#ef4444" shape="circle" r={8} stroke="#fff" strokeWidth={3} />
                )}
            </ComposedChart>
            </ResponsiveContainer>
            </>
        )}
      </div>

      <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-xl border border-slate-200 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-400 shadow-sm flex gap-3 transition-colors">
         <ListOrdered className="w-5 h-5 text-emerald-600 dark:text-emerald-500 shrink-0 mt-0.5" />
         <div className="space-y-1">
           <p className="font-bold text-slate-800 dark:text-slate-200 uppercase text-[10px] tracking-wider mb-1">Method Properties</p>
           <ul className="list-disc pl-4 space-y-1 text-xs">
               {isEvenlySpacedMethod && <li>Newton & Gauss methods require a constant step <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1 rounded">{"h = x_{i+1} - x_i"}</span>.</li>}
               {type.includes("Cubic Spline") && <li><strong>Natural Cubic Spline:</strong> Imposes boundary condition <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1 rounded">S''(x_0) = S''(x_n) = 0</span>.</li>}
               {type === AlgorithmType.LAGRANGE && <li><strong>Lagrange:</strong> Constructs a single polynomial of degree <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1 rounded">n-1</span>. Watch for oscillations at endpoints!</li>}
               <li>Visualization range extends 20% beyond boundaries to show extrapolation behavior.</li>
           </ul>
         </div>
      </div>
    </div>
  );
};