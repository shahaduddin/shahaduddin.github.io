import React, { useState, useMemo, useEffect } from 'react';
import { 
  Activity, Search, ZoomIn, ZoomOut, Maximize, 
  TrendingUp, Layers, Settings2, X,
  Plus, Trash2, Eye, EyeOff, Sliders, Download, Palette,
  Grid, Hash, Type, ChevronLeft, ChevronRight,
  PanelLeftClose, PanelLeftOpen, MousePointer2
} from 'lucide-react';
import { 
  ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, ReferenceLine, ReferenceDot, Legend
} from 'recharts';
import * as math from 'mathjs';

interface GraphFunction {
  id: string;
  expression: string;
  color: string;
  isVisible: boolean;
}

interface Parameter {
  name: string;
  value: number;
  min: number;
  max: number;
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#ef4444', '#06b6d4'];

export const GraphTool: React.FC = () => {
  const [functions, setFunctions] = useState<GraphFunction[]>([
    { id: '1', expression: 'a * sin(x * b)', color: COLORS[0], isVisible: true }
  ]);
  
  const [parameters, setParameters] = useState<Parameter[]>([
    { name: 'a', value: 1, min: -5, max: 5 },
    { name: 'b', value: 1, min: 0.1, max: 10 }
  ]);
  
  const [graphConfig, setGraphConfig] = useState({
    xMin: -10,
    xMax: 10,
    showDerivative: false,
    showIntegral: false,
    points: 300,
    gridLines: 10,
    showAxisLabels: true,
    showGrid: true
  });

  const [analysis, setAnalysis] = useState<{points: any[], roots: number[], targetId: string} | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfigPanel, setShowConfigPanel] = useState(false);
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);

  // Variable auto-sync detection logic
  useEffect(() => {
    const allExprs = functions.map(f => f.expression).join(' ');
    const detectedNames = Array.from(new Set(allExprs.match(/\b([a-wy-z])\b/gi) || []))
      .map((n: string) => n.toLowerCase());

    setParameters(prev => {
      const nextParams = prev.filter(p => detectedNames.includes(p.name));
      detectedNames.forEach(name => {
        if (!nextParams.find(p => p.name === name)) {
          nextParams.push({ name, value: 1, min: -10, max: 10 });
        }
      });
      return nextParams.sort((a, b) => a.name.localeCompare(b.name));
    });
  }, [functions]);

  const scope = useMemo(() => {
    const s: any = {};
    parameters.forEach(p => s[p.name] = p.value);
    return s;
  }, [parameters]);

  const addFunction = () => {
    const newId = (Math.max(0, ...functions.map(f => parseInt(f.id))) + 1).toString();
    setFunctions([...functions, { 
      id: newId, 
      expression: 'x', 
      color: COLORS[functions.length % COLORS.length], 
      isVisible: true 
    }]);
  };

  const removeFunction = (id: string) => {
    if (functions.length > 1) {
      setFunctions(functions.filter(f => f.id !== id));
      if (analysis?.targetId === id) setAnalysis(null);
    }
  };

  const toggleVisibility = (id: string) => {
    setFunctions(functions.map(f => f.id === id ? { ...f, isVisible: !f.isVisible } : f));
  };

  const updateFunctionExpr = (id: string, expr: string) => {
    setFunctions(functions.map(f => f.id === id ? { ...f, expression: expr } : f));
    setError(null);
  };

  const updateParam = (name: string, val: number) => {
    setParameters(parameters.map(p => p.name === name ? { ...p, value: val } : p));
  };

  const removeParameter = (name: string) => {
    setParameters(parameters.filter(p => p.name !== name));
  };

  const performAnalysis = (targetFn: GraphFunction) => {
      setIsAnalyzing(true);
      setError(null);
      
      setTimeout(() => {
        try {
            const f = math.compile(targetFn.expression.replace(/π/g, 'pi'));
            const points: any[] = [];
            const roots: number[] = [];
            const step = (graphConfig.xMax - graphConfig.xMin) / 400;
            
            let prevY: number | null = null;
            let prevSlope: number | null = null;

            for (let x = graphConfig.xMin; x <= graphConfig.xMax; x += step) {
                let y: any; 
                try { 
                  y = f.evaluate({ ...scope, x }); 
                } catch { continue; }
                
                if (typeof y !== 'number' || !isFinite(y)) { prevY = null; continue; }

                if (prevY !== null) {
                  if (prevY * y <= 0) {
                      const denom = y - prevY;
                      if (denom !== 0) {
                          const rootX = x - step * (y / denom);
                          const cleanRoot = Math.abs(rootX) < 1e-10 ? 0 : rootX;
                          roots.push(cleanRoot);
                          points.push({ x: cleanRoot, y: 0, type: 'root' });
                      }
                  }
                  const slope = (y - prevY) / step;
                  if (prevSlope !== null && prevSlope * slope < 0 && Math.abs(slope) < 20) { 
                      points.push({ x: x - step/2, y: (y+prevY)/2, type: prevSlope > 0 ? 'max' : 'min' });
                  }
                  prevSlope = slope;
                }
                prevY = y;
            }
            setAnalysis({ points, roots, targetId: targetFn.id });
        } catch (e: any) {
            setError("Analysis failed: Ensure function parameters are valid.");
        }
        setIsAnalyzing(false);
      }, 50);
  };

  const chartData = useMemo(() => {
    const data = [];
    const step = (graphConfig.xMax - graphConfig.xMin) / graphConfig.points;
    
    const compiledFns = functions.filter(f => f.isVisible).map(f => {
      try { return { id: f.id, fn: math.compile(f.expression.replace(/π/g, 'pi')) }; }
      catch { return null; }
    }).filter(f => f !== null);

    for (let x = graphConfig.xMin; x <= graphConfig.xMax; x += step) {
        const point: any = { x: Number(x.toFixed(4)) };
        compiledFns.forEach(cf => {
            try {
                const y = cf!.fn.evaluate({ ...scope, x });
                if (typeof y === 'number' && isFinite(y)) {
                    point[`y_${cf!.id}`] = y;
                    if (graphConfig.showDerivative) {
                        const h = 0.0001;
                        const y1 = cf!.fn.evaluate({ ...scope, x: x + h });
                        const y2 = cf!.fn.evaluate({ ...scope, x: x - h });
                        if (typeof y1 === 'number' && typeof y2 === 'number') {
                          point[`dy_${cf!.id}`] = (y1 - y2) / (2*h);
                        }
                    }
                }
            } catch {}
        });
        data.push(point);
    }
    return data;
  }, [functions, scope, graphConfig]);

  const zoom = (factor: number) => {
      const range = graphConfig.xMax - graphConfig.xMin;
      const center = (graphConfig.xMax + graphConfig.xMin) / 2;
      const newHalf = (range * factor) / 2;
      setGraphConfig(p => ({ ...p, xMin: center - newHalf, xMax: center + newHalf }));
  };

  const exportCSV = () => {
    if (chartData.length === 0) return;
    const headers = Object.keys(chartData[0]).join(',');
    const rows = chartData.map(d => Object.values(d).join(',')).join('\n');
    const blob = new Blob([`${headers}\n${rows}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pynum_graph_data.csv`;
    link.click();
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-950 overflow-hidden relative">
      
      {/* Workspace Header */}
      <div className="flex-none p-4 md:px-8 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex flex-wrap gap-4 items-center justify-between z-20 transition-colors shadow-sm">
         <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-emerald-600/20">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-[10px] font-black text-slate-900 dark:text-slate-100 uppercase tracking-tighter">Analytical Workspace</h2>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Interactive Plotting Engine</p>
            </div>
         </div>

         <div className="flex items-center gap-2">
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-inner">
              <button onClick={() => setGraphConfig(p => ({...p, showDerivative: !p.showDerivative}))} className={`p-2 rounded-lg transition-all ${graphConfig.showDerivative ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-400 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`} title="Toggle Derivatives"><Activity className="w-4 h-4" /></button>
              <button onClick={() => setGraphConfig(p => ({...p, showIntegral: !p.showIntegral}))} className={`p-2 rounded-lg transition-all ${graphConfig.showIntegral ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`} title="Fill Area (Integral)"><Layers className="w-4 h-4" /></button>
            </div>
            <button onClick={exportCSV} className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-emerald-600 rounded-xl border border-slate-200 dark:border-slate-700 transition-all" title="Export Data"><Download className="w-4 h-4" /></button>
            <button onClick={() => setShowConfigPanel(!showConfigPanel)} className={`p-2 rounded-xl border transition-all ${showConfigPanel ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg' : 'bg-white dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-800 hover:text-emerald-500'}`} title="View Settings"><Grid className="w-4 h-4" /></button>
         </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
         
         {/* Main Expression & Logic Panel (Left side, integrated) */}
         <div className={`transition-all duration-500 ease-in-out bg-slate-50/50 dark:bg-slate-900/30 border-r border-slate-200 dark:border-slate-800 flex flex-col z-10 shadow-sm relative ${isPanelCollapsed ? 'w-14' : 'w-full md:w-[380px]'}`}>
            <div className="flex-none p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/50 h-14">
               {!isPanelCollapsed ? (
                  <>
                    <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2"><Palette className="w-3.5 h-3.5 text-emerald-500" /> Expressions</h3>
                    <button 
                      onClick={() => setIsPanelCollapsed(true)} 
                      className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-500 dark:text-slate-400"
                      title="Collapse Panel"
                    >
                      <PanelLeftClose className="w-4 h-4" />
                    </button>
                  </>
               ) : (
                  <button 
                    onClick={() => setIsPanelCollapsed(false)} 
                    className="p-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-all text-white mx-auto shadow-lg shadow-emerald-600/20"
                    title="Expand Panel"
                  >
                    <PanelLeftOpen className="w-4 h-4" />
                  </button>
               )}
            </div>
            
            {!isPanelCollapsed ? (
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8 animate-in fade-in duration-500">
                {/* Function List */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                     <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Active Plots</span>
                     <button onClick={addFunction} className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition-all shadow-md shadow-emerald-600/20"><Plus className="w-3.5 h-3.5" /></button>
                  </div>
                  <div className="space-y-3">
                      {functions.map((f) => (
                         <div key={f.id} className={`p-4 rounded-2xl border transition-all ${f.isVisible ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm' : 'bg-slate-100/50 dark:bg-slate-900 border-dashed border-slate-200 dark:border-slate-800 opacity-60'}`}>
                             <div className="flex items-center gap-3 mb-3">
                                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: f.color }} />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex-1">f{f.id}(x)</span>
                                <div className="flex gap-1">
                                    <button onClick={() => performAnalysis(f)} className="p-1 text-slate-400 hover:text-emerald-600 transition-colors" title="Analyze Function"><Search className="w-3 h-3" /></button>
                                    <button onClick={() => toggleVisibility(f.id)} className="p-1 text-slate-400 hover:text-emerald-600 transition-colors" title="Toggle Visibility">{f.isVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}</button>
                                    <button onClick={() => removeFunction(f.id)} className="p-1 text-slate-400 hover:text-red-500 transition-colors" title="Remove"><Trash2 className="w-3 h-3" /></button>
                                </div>
                             </div>
                             <div className="relative group">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600 font-mono text-xs font-black">=</div>
                                <input 
                                  value={f.expression}
                                  onChange={(e) => updateFunctionExpr(f.id, e.target.value)}
                                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-8 pr-3 py-2 text-sm font-mono text-slate-800 dark:text-slate-100 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all"
                                  placeholder="e.g. x^2"
                                />
                             </div>
                         </div>
                      ))}
                  </div>
                </div>

                {/* Variable Scope Sliders */}
                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                   <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><Sliders className="w-3 h-3 text-emerald-500" /> Variable Sliders</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                   </div>
                   
                   {parameters.length === 0 ? (
                      <div className="p-6 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                         <p className="text-[9px] text-slate-400 font-bold uppercase">No variables detected</p>
                         <p className="text-[8px] text-slate-300 uppercase mt-1">Use a, b, c... in your functions</p>
                      </div>
                   ) : (
                      <div className="space-y-4">
                        {parameters.map((p) => (
                           <div key={p.name} className="space-y-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm relative group">
                               <div className="flex items-center justify-between">
                                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 font-mono uppercase tracking-widest">{p.name} = {p.value.toFixed(2)}</span>
                                  <div className="flex gap-2">
                                     <input type="number" value={p.min} onChange={e=>setParameters(parameters.map(x=>x.name===p.name?{...x, min: Number(e.target.value)}:x))} className="w-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1 py-0.5 text-[8px] font-mono text-center outline-none focus:border-emerald-400" />
                                     <span className="text-[8px] text-slate-300 uppercase self-center">to</span>
                                     <input type="number" value={p.max} onChange={e=>setParameters(parameters.map(x=>x.name===p.name?{...x, max: Number(e.target.value)}:x))} className="w-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1 py-0.5 text-[8px] font-mono text-center outline-none focus:border-emerald-400" />
                                  </div>
                               </div>
                               <input 
                                  type="range"
                                  min={p.min}
                                  max={p.max}
                                  step={(p.max - p.min) / 100}
                                  value={p.value}
                                  onChange={(e) => updateParam(p.name, parseFloat(e.target.value))}
                                  className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                />
                           </div>
                        ))}
                      </div>
                   )}
                </div>

                {/* Analysis Results Overlay inside panel */}
                {analysis && (
                    <div className="bg-emerald-900 rounded-2xl p-5 space-y-4 animate-in slide-in-from-bottom-2 text-white shadow-xl">
                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2"><Activity className="w-3 h-3" /> Analysis Result</span>
                            <button onClick={() => setAnalysis(null)}><X className="w-3 h-3 opacity-50 hover:opacity-100" /></button>
                        </div>
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <span className="text-[8px] font-bold text-white/50 uppercase">Intercepts</span>
                                <div className="flex flex-wrap gap-1">
                                    {analysis.roots.map((r, i) => <div key={i} className="px-2 py-0.5 bg-white/10 rounded text-[9px] font-mono">x={r.toFixed(3)}</div>)}
                                    {analysis.roots.length === 0 && <span className="text-[9px] italic opacity-40">None found</span>}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[8px] font-bold text-white/50 uppercase">Extrema</span>
                                <div className="grid gap-1">
                                    {analysis.points.filter(p=>p.type!=='root').slice(0, 3).map((p, i) => (
                                        <div key={i} className="flex justify-between text-[9px] bg-white/5 px-2 py-1 rounded">
                                            <span className="font-bold text-emerald-400 uppercase">{p.type}</span>
                                            <span className="font-mono opacity-70">({p.x.toFixed(2)}, {p.y.toFixed(2)})</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
              </div>
            ) : (
                /* Collapsed handle look */
                <div className="flex-1 flex flex-col items-center py-8 gap-12 text-slate-400">
                    <div className="[writing-mode:vertical-lr] rotate-180 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-4">
                        Expressions <div className="w-1 h-1 rounded-full bg-emerald-500"></div>
                    </div>
                    <div className="flex flex-col gap-4">
                       {functions.map(f => (
                           <div key={f.id} className="w-2 h-2 rounded-full" style={{ backgroundColor: f.color }} />
                       ))}
                    </div>
                </div>
            )}
         </div>

         {/* Plot Area */}
         <div className="flex-1 relative bg-white dark:bg-slate-950 min-h-0 z-0">
            {error && (
              <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 bg-red-600 text-white px-4 py-2 rounded-2xl flex items-center gap-2 text-xs font-bold shadow-2xl animate-in fade-in slide-in-from-top-2">
                  <Activity className="w-4 h-4" />
                  {error}
                  <button onClick={() => setError(null)} className="ml-2"><X className="w-3 h-3" /></button>
              </div>
            )}

            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                    {/* Increased contrast for grid lines by darkening the stroke and increasing opacity */}
                    {graphConfig.showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.4} />}
                    <XAxis 
                        dataKey="x" 
                        type="number" 
                        domain={[graphConfig.xMin, graphConfig.xMax]} 
                        tickCount={graphConfig.gridLines}
                        hide={!graphConfig.showAxisLabels}
                        axisLine={{ stroke: '#94a3b8', strokeWidth: 1 }}
                        tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 600}}
                    />
                    <YAxis 
                        type="number" 
                        domain={['auto', 'auto']} 
                        tickCount={graphConfig.gridLines}
                        hide={!graphConfig.showAxisLabels}
                        axisLine={{ stroke: '#94a3b8', strokeWidth: 1 }}
                        tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 600}}
                    />
                    <Tooltip 
                        contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '11px', backgroundColor: 'rgba(255,255,255,0.95)' }}
                        labelFormatter={(v) => `x: ${Number(v).toFixed(4)}`}
                    />
                    
                    <ReferenceLine y={0} stroke="#94a3b8" strokeWidth={2} strokeOpacity={0.5} />
                    <ReferenceLine x={0} stroke="#94a3b8" strokeWidth={2} strokeOpacity={0.5} />
                    
                    {functions.map(f => f.isVisible && (
                      <React.Fragment key={f.id}>
                        {graphConfig.showIntegral ? (
                           <Area type="monotone" dataKey={`y_${f.id}`} stroke={f.color} fill={f.color} fillOpacity={0.05} strokeWidth={3} isAnimationActive={false} />
                        ) : (
                           <Line type="monotone" dataKey={`y_${f.id}`} stroke={f.color} strokeWidth={3} dot={false} isAnimationActive={false} />
                        )}
                        {graphConfig.showDerivative && (
                           <Line type="monotone" dataKey={`dy_${f.id}`} stroke={f.color} strokeWidth={1.5} strokeDasharray="4 4" dot={false} isAnimationActive={false} />
                        )}
                      </React.Fragment>
                    ))}

                    {analysis?.points.map((pt, i) => (
                        <ReferenceDot key={i} x={pt.x} y={pt.y} r={4.5} fill={pt.type === 'root' ? '#ef4444' : '#f59e0b'} stroke="white" strokeWidth={2} />
                    ))}
                </ComposedChart>
            </ResponsiveContainer>

            {/* Navigation Floating Controls */}
            <div className="absolute bottom-6 right-6 flex flex-col gap-2">
                <div className="flex flex-col bg-white/90 dark:bg-slate-900/90 backdrop-blur rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-1">
                  <button onClick={() => zoom(0.5)} className="p-3 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition-all rounded-xl"><ZoomIn className="w-5 h-5" /></button>
                  <button onClick={() => zoom(2.0)} className="p-3 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition-all rounded-xl"><ZoomOut className="w-5 h-5" /></button>
                  <button onClick={() => setGraphConfig(p => ({...p, xMin: -10, xMax: 10}))} className="p-3 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition-all rounded-xl"><Maximize className="w-5 h-5" /></button>
                </div>
            </div>
         </div>
      </div>

      {/* Config Overlay - Fixed positioning at component root to overlap header and sidebars */}
      {showConfigPanel && (
        <>
          <div 
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[90]" 
            onClick={() => setShowConfigPanel(false)} 
          />
          <div className="fixed top-20 right-8 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.2)] animate-in zoom-in-95 origin-top-right z-[100] transition-colors">
             <div className="flex items-center justify-between mb-6">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                   <Grid className="w-4 h-4 text-emerald-600" />
                 </div>
                 <span className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-widest">Config</span>
               </div>
               <button 
                 onClick={() => setShowConfigPanel(false)} 
                 className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-400 hover:text-slate-900"
               >
                 <X className="w-4 h-4" />
               </button>
             </div>
             
             <div className="space-y-8">
                <div className="space-y-3">
                   <div className="flex items-center justify-between">
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Grid Density</span>
                     <span className="text-[10px] font-mono font-bold text-emerald-600">{graphConfig.gridLines}</span>
                   </div>
                   <input 
                      type="range" min="4" max="30" step="2" value={graphConfig.gridLines}
                      onChange={(e) => setGraphConfig(p => ({...p, gridLines: parseInt(e.target.value)}))}
                      className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                   />
                </div>
                
                <div className="grid gap-3">
                   <ConfigToggle 
                    label="Draw Grid" 
                    active={graphConfig.showGrid} 
                    onClick={() => setGraphConfig(p => ({...p, showGrid: !p.showGrid}))} 
                    icon={Grid}
                   />
                   <ConfigToggle 
                    label="Axis Labels" 
                    active={graphConfig.showAxisLabels} 
                    onClick={() => setGraphConfig(p => ({...p, showAxisLabels: !p.showAxisLabels}))} 
                    icon={Type}
                   />
                </div>
                
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                   <button 
                     onClick={() => setGraphConfig(p => ({...p, xMin: -10, xMax: 10, showGrid: true, showAxisLabels: true, gridLines: 10}))}
                     className="w-full py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-600 transition-colors"
                   >
                     Reset to Default
                   </button>
                </div>
             </div>
          </div>
        </>
      )}
    </div>
  );
};

const ConfigToggle = ({ label, active, onClick, icon: Icon }: any) => (
  <button 
    onClick={onClick}
    className={`flex items-center justify-between w-full p-4 rounded-2xl border transition-all ${active ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 shadow-sm' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 opacity-60 hover:opacity-100'}`}
  >
    <div className="flex items-center gap-3">
       <Icon className="w-4 h-4" />
       <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
    </div>
    <div className={`w-2 h-2 rounded-full transition-all duration-300 ${active ? 'bg-emerald-500 scale-125 shadow-[0_0_10px_#10b981]' : 'bg-slate-300 scale-100'}`} />
  </button>
);