import React, { useState, useMemo, useEffect } from 'react';
import { ComposedChart, Line, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { AlgorithmType } from '../../types';
import { Table, FileText, Plus, Trash2, AlertTriangle, Grid3X3, ListOrdered, Play, Download, Trash, Beaker, ChevronDown, Binary, Sliders, Target } from 'lucide-react';

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
  const [inputMode, setInputMode] = useState<'table' | 'text'>('table');
  const [points, setPoints] = useState<Point[]>(PRESETS[0].points);
  const [pointsStr, setPointsStr] = useState(PRESETS[0].points.map(p => `${p.x},${p.y}`).join('; '));
  const [evalX, setEvalX] = useState<number>(1.5);
  const [resultY, setResultY] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    const val = e.target.value || '';
    setPointsStr(val);
    try {
      const parts = val.split(';').map(p => p.trim());
      const newPoints: Point[] = [];
      for (const p of parts) {
        if (!p) continue;
        const subparts = p.split(',');
        if (subparts.length < 2) continue;
        const x = parseFloat(subparts[0].trim());
        const y = parseFloat(subparts[1].trim());
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
    if (n <= 1) return 1;
    let res = 1;
    for(let i=2; i<=n; i++) res *= i;
    return res;
  };

  const calculateEvenlySpaced = (xi: number, pts: Point[], algo: AlgorithmType): number => {
    const n = pts.length;
    const table = Array.from({length: n}, () => Array(n).fill(0));
    for(let i=0; i<n; i++) table[i][0] = pts[i].y;
    
    // Build Forward Difference Table
    for (let j = 1; j < n; j++) {
      for (let i = 0; i < n - j; i++) {
        table[i][j] = table[i+1][j-1] - table[i][j-1];
      }
    }

    const h = pts[1].x - pts[0].x;
    if (Math.abs(h) < 1e-12) return pts[0].y;
    
    if (algo === AlgorithmType.NEWTON_FORWARD_DIFFERENCE) {
        const u = (xi - pts[0].x) / h; 
        let res = table[0][0], u_term = 1;
        for(let i=1; i<n; i++) { 
            u_term *= (u - (i - 1));
            res += (u_term * table[0][i]) / factorial(i); 
        }
        return res;
    } 
    
    if (algo === AlgorithmType.NEWTON_BACKWARD_DIFFERENCE) {
        const u = (xi - pts[n-1].x) / h; 
        let res = table[n-1][0], u_term = 1;
        for(let i=1; i<n; i++) { 
            u_term *= (u + (i - 1));
            // Backward coeffs are the bottom diagonal of the forward table: table[n-1-i][i]
            res += (u_term * table[n-1-i][i]) / factorial(i); 
        }
        return res;
    }

    if (algo === AlgorithmType.GAUSS_FORWARD_INTERPOLATION || algo === AlgorithmType.GAUSS_BACKWARD_INTERPOLATION) {
        const mid = Math.floor((n - 1) / 2);
        const u = (xi - pts[mid].x) / h;
        let res = table[mid][0], u_term = 1;
        
        for (let i = 1; i < n; i++) {
            if (algo === AlgorithmType.GAUSS_FORWARD_INTERPOLATION) {
                if (i % 2 !== 0) u_term *= (u - Math.floor(i / 2));
                else u_term *= (u + Math.floor(i / 2));
                const rowIdx = mid - Math.floor(i / 2);
                if (rowIdx >= 0 && rowIdx < n - i) res += (u_term * table[rowIdx][i]) / factorial(i);
            } else {
                if (i % 2 !== 0) u_term *= (u + Math.floor(i / 2));
                else u_term *= (u - Math.floor(i / 2));
                const rowIdx = mid - Math.floor((i + 1) / 2);
                if (rowIdx >= 0 && rowIdx < n - i) res += (u_term * table[rowIdx][i]) / factorial(i);
            }
        }
        return res;
    }
    
    return table[0][0];
  };

  const calculateSpline = (xi: number, pts: Point[], algo: AlgorithmType): number => {
    const n = pts.length - 1;
    if (algo === AlgorithmType.QUADRATIC_SPLINE) {
        const a = new Array(n).fill(0), b = new Array(n).fill(0), c = new Array(n).fill(0);
        a[0] = 0; c[0] = pts[0].y;
        const h0 = (pts[1].x - pts[0].x);
        if (h0 === 0) return 0;
        b[0] = (pts[1].y - pts[0].y) / h0;
        for (let i = 1; i < n; i++) {
            const hPrev = pts[i].x - pts[i-1].x, hCurr = pts[i+1].x - pts[i].x;
            b[i] = 2 * a[i-1] * hPrev + b[i-1];
            c[i] = pts[i].y;
            a[i] = (pts[i+1].y - pts[i].y - b[i] * hCurr) / (hCurr * hCurr);
        }
        for(let i=0; i < n; i++) {
            if (xi >= pts[i].x && xi <= pts[i+1].x) {
                const dx = xi - pts[i].x;
                return a[i]*dx*dx + b[i]*dx + c[i];
            }
        }
        return pts[n].y;
    } else {
        const h = new Array(n);
        for(let i=0; i<n; i++) h[i] = pts[i+1].x - pts[i].x;
        const alpha = new Array(n).fill(0);
        for(let i=1; i<n; i++) {
            if (h[i] === 0 || h[i-1] === 0) continue;
            alpha[i] = (3/h[i])*(pts[i+1].y - pts[i].y) - (3/h[i-1])*(pts[i].y - pts[i-1].y);
        }
        const l = new Array(n+1).fill(0), mu = new Array(n+1).fill(0), z = new Array(n+1).fill(0);
        l[0] = 1; 
        for(let i=1; i<n; i++) { 
            l[i] = 2*(pts[i+1].x - pts[i-1].x) - h[i-1]*mu[i-1]; 
            mu[i] = h[i]/l[i]; 
            z[i] = (alpha[i] - h[i-1]*z[i-1])/l[i]; 
        }
        l[n] = 1; 
        const c = new Array(n+1).fill(0), b = new Array(n).fill(0), d = new Array(n).fill(0), a = new Array(n).fill(0);
        for(let j=n-1; j>=0; j--) { 
            c[j] = z[j] - mu[j]*c[j+1]; 
            b[j] = (pts[j+1].y - pts[j].y)/h[j] - h[j]*(c[j+1] + 2*c[j])/3; 
            d[j] = (c[j+1] - c[j])/(3*h[j]); 
            a[j] = pts[j].y; 
        }
        for(let i=0; i < n; i++) { 
            if (xi >= pts[i].x && xi <= pts[i+1].x) { 
                const dx = xi - pts[i].x; 
                return a[i] + b[i]*dx + c[i]*dx*dx + d[i]*dx*dx*dx; 
            } 
        }
        return pts[n].y;
    }
  };

  const performInterpolation = (xi: number): number => {
    const pts = sortedPoints;
    const n = pts.length;
    if (n < 2) return 0;

    if (type === AlgorithmType.LINEAR_SPLINE) {
        for (let i = 0; i < n - 1; i++) {
            if (xi >= pts[i].x && xi <= pts[i+1].x) {
                const denom = (pts[i+1].x - pts[i].x);
                if (denom === 0) return pts[i].y;
                const m = (pts[i+1].y - pts[i].y) / denom;
                return pts[i].y + m * (xi - pts[i].x);
            }
        }
        return pts[n-1].y;
    } else if (type === AlgorithmType.QUADRATIC_SPLINE || type === AlgorithmType.CUBIC_SPLINE) {
        return calculateSpline(xi, pts, type);
    } else if (isEvenlySpacedMethod) {
        return calculateEvenlySpaced(xi, pts, type);
    } else {
        let result = 0;
        for (let i = 0; i < n; i++) {
            let term = pts[i].y;
            for (let j = 0; j < n; j++) {
              if (i !== j) {
                const denom = (pts[i].x - pts[j].x);
                if (denom === 0) continue;
                term = term * (xi - pts[j].x) / denom;
              }
            }
            result += term;
        }
        return result;
    }
  };

  const spacingError = useMemo(() => {
    if (!isEvenlySpacedMethod) return null;
    const pts = sortedPoints;
    if (pts.length < 2) return null;
    const h = pts[1].x - pts[0].x;
    for(let i=1; i < pts.length - 1; i++) {
        if (Math.abs((pts[i+1].x - pts[i].x) - h) > 0.005) return "Uneven node spacing detected (Tolerance: 0.005).";
    }
    return null;
  }, [sortedPoints, isEvenlySpacedMethod]);

  const handleCalculate = () => {
    if (spacingError) { setError(spacingError); return; }
    setResultY(performInterpolation(evalX));
  };

  const exportCSV = () => {
    const csvRows = ["X,Y"]; sortedPoints.forEach(p => csvRows.push(`${p.x},${p.y}`));
    const blob = new Blob([csvRows.join("\n")], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `interpolation_data.csv`; a.click();
  };

  const chartData = useMemo(() => {
    const pts = sortedPoints;
    if (pts.length < 2 || spacingError) return [];
    const minX = pts[0].x, maxX = pts[pts.length - 1].x, range = maxX - minX;
    const data = [];
    const isSpline = type.includes("Spline");
    const start = isSpline ? minX : minX - range * 0.2;
    const end = isSpline ? maxX : maxX + range * 0.2;
    const plotRange = end - start;
    const step = plotRange / 200;

    for (let x = start; x <= end; x += step) {
        const valY = performInterpolation(x);
        if (isFinite(valY)) data.push({ x: Number(x.toFixed(4)), y: valY });
    }
    return data;
  }, [sortedPoints, type, spacingError]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-colors">
        <div className="flex bg-slate-50 dark:bg-slate-950/50 border-b border-slate-100 dark:border-slate-800 p-1">
           <button 
             onClick={() => setInputMode('table')}
             className={`flex-1 flex items-center justify-center gap-2.5 py-3 text-xs font-black uppercase tracking-widest transition-all rounded-2xl ${inputMode === 'table' ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
           >
              <Table className="w-4 h-4" />
              Dataset Grid
           </button>
           <button 
             onClick={() => setInputMode('text')}
             className={`flex-1 flex items-center justify-center gap-2.5 py-3 text-xs font-black uppercase tracking-widest transition-all rounded-2xl ${inputMode === 'text' ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
           >
              <FileText className="w-4 h-4" />
              Serial String
           </button>
        </div>

        <div className="p-8">
           <div className="flex flex-col lg:flex-row gap-10">
              <div className="flex-1 space-y-6">
                 {inputMode === 'text' ? (
                     <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                       <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-3 px-1">Raw Input String</label>
                       <div className="relative group">
                           <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 opacity-40"><Binary className="w-4 h-4" /></div>
                           <input 
                             className={`w-full h-14 bg-slate-50 dark:bg-slate-950 border rounded-2xl pl-12 pr-4 text-sm text-slate-900 dark:text-slate-100 font-mono focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all shadow-inner ${error || spacingError ? 'border-red-300' : 'border-slate-200 dark:border-slate-800'}`} 
                             value={pointsStr} 
                             onChange={handleTextChange} 
                             placeholder="x1,y1; x2,y2; ..." 
                           />
                       </div>
                       <p className="mt-3 text-[10px] text-slate-400 font-medium italic">Format: Coordinate pairs separated by semicolons (e.g. 0,5; 1,10; 2,15)</p>
                     </div>
                 ) : (
                     <div className="space-y-4 animate-in fade-in duration-300">
                        <div className="flex items-center justify-between px-1">
                           <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Point Nodes</label>
                           <span className="text-[10px] font-mono font-black text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">{points.length} Samples</span>
                        </div>
                        <div className="border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden bg-slate-50/30 dark:bg-slate-950/30">
                           <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                              <table className="w-full text-left border-collapse">
                                  <thead className="bg-slate-50 dark:bg-slate-950 sticky top-0 z-10 border-b border-slate-100 dark:border-slate-800">
                                      <tr>
                                         <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest w-16 text-center">Id</th>
                                         <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Node (X)</th>
                                         <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Value (Y)</th>
                                         <th className="w-12"></th>
                                      </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                      {points.map((p, i) => (
                                          <tr key={i} className="group hover:bg-white dark:hover:bg-slate-900 transition-colors">
                                              <td className="px-6 py-3.5 text-center text-[10px] text-slate-300 dark:text-slate-700 font-black font-mono">#{i+1}</td>
                                              <td className="px-6 py-3.5"><input type="number" value={p.x} onChange={(e) => handleTableChange(i, 'x', e.target.value)} className="w-full bg-transparent text-sm font-mono text-slate-900 dark:text-slate-100 outline-none focus:text-emerald-600 transition-colors" /></td>
                                              <td className="px-6 py-3.5"><input type="number" value={p.y} onChange={(e) => handleTableChange(i, 'y', e.target.value)} className="w-full bg-transparent text-sm font-mono text-slate-900 dark:text-slate-100 outline-none focus:text-emerald-600 transition-colors" /></td>
                                              <td className="px-4">
                                                  <button onClick={() => removePoint(i)} className="p-2 text-slate-300 dark:text-slate-700 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                                              </td>
                                          </tr>
                                      ))}
                                  </tbody>
                              </table>
                           </div>
                           <div className="flex p-2 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 gap-2">
                               <button onClick={addPoint} className="flex-1 h-11 flex items-center justify-center gap-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-50 dark:hover:bg-emerald-900/10 hover:text-emerald-600 transition-all shadow-sm active:scale-95"><Plus className="w-4 h-4" />Append Node</button>
                               <button onClick={() => updatePoints([{x:0,y:0}, {x:1,y:1}])} className="h-11 px-4 flex items-center justify-center text-slate-400 hover:text-red-500 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl transition-all shadow-sm active:scale-95" title="Clear All"><Trash className="w-4 h-4" /></button>
                           </div>
                        </div>
                     </div>
                 )}
              </div>

              <div className="lg:w-80 space-y-8">
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2 px-1">
                       <Beaker className="w-3.5 h-3.5 text-emerald-500" /> Reference Templates
                    </label>
                    <div className="grid grid-cols-1 gap-2.5">
                       {PRESETS.map(p => (
                          <button 
                            key={p.name} 
                            onClick={() => { updatePoints(p.points); setResultY(null); }}
                            className="w-full text-left px-5 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-[1.25rem] group hover:border-emerald-300 dark:hover:border-emerald-800 transition-all shadow-sm active:scale-98"
                          >
                             <div className="flex items-center justify-between">
                                <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-tight group-hover:text-emerald-600 transition-colors">{p.name}</span>
                                <ChevronDown className="w-3 h-3 text-slate-300 -rotate-90 group-hover:text-emerald-500 transition-all" />
                             </div>
                             <p className="text-[9px] text-slate-400 font-bold uppercase mt-1 tracking-widest">{p.points.length} Points • Normalized</p>
                          </button>
                       ))}
                    </div>
                 </div>

                 <div className="bg-slate-900 dark:bg-black rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity"><Sliders className="w-32 h-32 text-white rotate-12" /></div>
                    <div className="relative z-10 space-y-6">
                        <div className="space-y-3">
                           <span className="text-[10px] text-emerald-400 font-black uppercase tracking-[0.2em] flex items-center gap-2"><Target className="w-3.5 h-3.5" /> Interpolate at X</span>
                           <input 
                             type="number" 
                             className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm font-mono text-white outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all" 
                             value={evalX} 
                             onChange={e => setEvalX(Number(e.target.value))} 
                           />
                        </div>
                        <button 
                          onClick={handleCalculate}
                          className="w-full h-14 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[11px] uppercase tracking-widest rounded-2xl shadow-xl shadow-emerald-600/20 active:scale-95 transition-all flex items-center justify-center gap-3"
                        >
                           <Play className="w-4 h-4 fill-current" /> Execute Method
                        </button>
                        <div className="pt-6 border-t border-white/5">
                           <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest block mb-3">Predicted Coordinate Y</span>
                           <div className={`text-4xl font-mono font-black tracking-tighter truncate transition-all ${resultY !== null ? 'text-emerald-400' : 'text-slate-800'}`}>
                              {resultY !== null ? resultY.toFixed(6) : "0.000000"}
                           </div>
                        </div>
                        <button onClick={exportCSV} className="w-full py-2 flex items-center justify-center gap-2 text-slate-500 hover:text-emerald-400 transition-colors text-[9px] font-black uppercase tracking-widest"><Download className="w-3 h-3" /> Export Dataset</button>
                    </div>
                 </div>
              </div>
           </div>

           {(error || spacingError) && (
              <div className="mt-8 flex items-center gap-3 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-5 rounded-2xl border border-red-100 dark:border-red-800/50 animate-in slide-in-from-top-2 duration-300">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <span className="text-[11px] font-black uppercase tracking-tight">{error || spacingError}</span>
              </div>
           )}
        </div>
      </div>

      <div className="h-[440px] bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm relative overflow-hidden transition-colors group">
        {!spacingError ? (
            <>
            <div className="absolute top-8 left-8 z-10 pointer-events-none flex items-center gap-2">
                <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.3em] bg-white/90 dark:bg-slate-900/90 px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-800 shadow-xl">Topographic Reconstruction</span>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            </div>
            <ResponsiveContainer width="100%" height="100%">
            <ComposedChart margin={{ top: 20, right: 20, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} />
                <XAxis dataKey="x" type="number" domain={['auto', 'auto']} stroke="#94a3b8" tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} tickFormatter={v => v.toFixed(1)} />
                <YAxis dataKey="y" stroke="#94a3b8" tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.98)', border: 'none', borderRadius: '18px', fontSize: '11px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', backdropFilter: 'blur(8px)', fontWeight: 700 }} 
                    itemStyle={{ color: '#10b981' }}
                    labelFormatter={(v) => `Coord X: ${Number(v).toFixed(4)}`}
                />
                <Line data={chartData} type="monotone" dataKey="y" stroke="#10b981" strokeWidth={4} dot={false} isAnimationActive={false} />
                <Scatter data={sortedPoints} fill="#3b82f6" r={6} stroke="white" strokeWidth={3} />
                {resultY !== null && (
                    <Scatter data={[{x: evalX, y: resultY}]} fill="#ec4899" shape="circle" r={9} stroke="white" strokeWidth={4} className="drop-shadow-lg" />
                )}
                <ReferenceLine y={0} stroke="#94a3b8" strokeOpacity={0.2} strokeWidth={2} />
                <ReferenceLine x={0} stroke="#94a3b8" strokeOpacity={0.2} strokeWidth={2} />
            </ComposedChart>
            </ResponsiveContainer>
            </>
        ) : (
             <div className="h-full flex flex-col items-center justify-center text-slate-300 dark:text-slate-700 gap-6">
                 <Grid3X3 className="w-20 h-20 opacity-10 animate-pulse" />
                 <p className="text-[11px] font-black uppercase tracking-[0.4em]">Signal Interrupted: Check Node Spacing</p>
             </div>
        )}
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-8 transition-colors">
         <div className="flex-1 space-y-4">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600"><ListOrdered className="w-5 h-5" /></div>
              <p className="font-black text-slate-800 dark:text-slate-200 uppercase text-xs tracking-widest">Algorithm Specification</p>
           </div>
           <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {isEvenlySpacedMethod ? (
                 <li className="flex gap-3 text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    <ChevronDown className="w-4 h-4 text-emerald-500 shrink-0 rotate-[-90deg]" />
                    <span>Requires equidistance nodes (step <em>h</em>). Uses finite difference operators for O(n!) complexity reduction.</span>
                 </li>
               ) : (
                 <li className="flex gap-3 text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    <ChevronDown className="w-4 h-4 text-emerald-500 shrink-0 rotate-[-90deg]" />
                    <span>Lagrange/Newton implementation suitable for non-uniform grids. Polynomial degree matches <em>n-1</em>.</span>
                 </li>
               )}
               <li className="flex gap-3 text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                  <ChevronDown className="w-4 h-4 text-emerald-500 shrink-0 rotate-[-90deg]" />
                  <span>Interactive dots on plot allow visual verification of data integrity. pink node represents current prediction.</span>
               </li>
           </ul>
         </div>
      </div>
    </div>
  );
};
