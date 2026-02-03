import React, { useState, useEffect, useRef } from 'react';
import { 
  Delete, Equal, Plus, Minus, X, Divide, 
  Clock, Trash2, Copy, History as HistoryIcon,
  X as CloseIcon, Calculator, ChevronLeft, Layout
} from 'lucide-react';
import * as math from 'mathjs';

interface HistoryItem {
  expression: string;
  result: string;
  timestamp: number;
}

export const CalculatorTool: React.FC = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [angleMode, setAngleMode] = useState<'RAD' | 'DEG'>('RAD');
  
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInput = (val: string) => {
    setInput(prev => prev + val);
    // Focus the input to keep the cursor visible, inputMode="none" prevents keyboard
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const clearInput = () => {
    setInput('');
    setResult('');
    setError(null);
  };

  const backspace = () => setInput(prev => prev.slice(0, -1));

  const getSanitizedExpression = (expr: string) => {
      return expr
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, 'pi')
        .replace(/√/g, 'sqrt')
        .replace(/Ans/g, history[0]?.result || '0');
  };

  const getEvaluationScope = () => {
      if (angleMode === 'DEG') {
         const toRad = (d: number) => d * (Math.PI / 180);
         return {
             sin: (x: number) => Math.sin(toRad(x)),
             cos: (x: number) => Math.cos(toRad(x)),
             tan: (x: number) => Math.tan(toRad(x)),
             asin: (x: number) => Math.asin(x) * (180 / Math.PI),
             acos: (x: number) => Math.acos(x) * (180 / Math.PI),
             atan: (x: number) => Math.atan(x) * (180 / Math.PI),
         };
      }
      return {};
  };

  const safeEvaluate = () => {
    try {
      const sanitized = getSanitizedExpression(input);
      const scope = getEvaluationScope();
      const res = math.evaluate(sanitized, scope);
      
      let formatted = "";
      if (typeof res === 'number') {
          formatted = math.format(res, { precision: 12 });
      } else {
          formatted = String(res);
      }

      setResult(formatted);
      setHistory(prev => [{
          expression: input,
          result: formatted,
          timestamp: Date.now()
      }, ...prev].slice(0, 50));
    } catch (e: any) {
      setError("Syntax Error");
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') { e.preventDefault(); safeEvaluate(); }
      if (e.key === 'Escape') clearInput();
      if (e.key === 'Backspace' && document.activeElement !== inputRef.current) backspace();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [input, angleMode, history]);

  const KeyBtn = ({ label, val, color = "default", onClick, className = "", colSpan = 1 }: any) => {
    const baseClass = `relative h-16 md:h-20 rounded-2xl flex items-center justify-center text-sm md:text-lg font-bold transition-all active:scale-95 select-none overflow-hidden group border shadow-sm`;
    const colors: any = {
      default: "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-800",
      slate: "bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800",
      emerald: "bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-600/20 border-emerald-500",
      amber: "bg-amber-50 dark:bg-amber-900/10 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30 border-amber-100 dark:border-amber-900/30",
      red: "bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 border-red-100 dark:border-red-900/30"
    };
    return (
      <button onClick={() => onClick ? onClick() : handleInput(val)} className={`${baseClass} ${colors[color]} ${className}`} style={{ gridColumn: colSpan > 1 ? `span ${colSpan} / span ${colSpan}` : undefined }}>
        <span className="relative z-10">{label}</span>
      </button>
    );
  };

  return (
    <div className="flex w-full h-[calc(100vh-3.5rem)] bg-white dark:bg-slate-950 overflow-hidden relative animate-in fade-in duration-500">
      
      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-slate-950">
           
           {/* Immersive Header/Display */}
           <div className="flex-none p-6 md:p-10 bg-slate-50/50 dark:bg-black/20 border-b border-slate-200 dark:border-slate-800 relative min-h-[220px] md:min-h-[280px] flex flex-col justify-end">
              <div className="absolute top-6 left-6 md:left-10 flex gap-3 z-10">
                 <button onClick={() => setAngleMode(m => m === 'DEG' ? 'RAD' : 'DEG')} className="px-4 py-2 bg-white dark:bg-slate-900 text-[10px] font-black text-emerald-600 dark:text-emerald-500 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm min-w-[70px] transition-all hover:border-emerald-300 uppercase tracking-widest">{angleMode}</button>
                 <button onClick={() => setIsHistoryOpen(!isHistoryOpen)} className={`p-2.5 rounded-xl border transition-all ${isHistoryOpen ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg' : 'bg-white dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-800 shadow-sm hover:text-emerald-500'}`}>
                    <HistoryIcon className="w-5 h-5" />
                 </button>
              </div>

              {error && (
                <div className="absolute top-6 right-6 md:right-10 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-100 dark:border-red-900/50 flex items-center gap-2 animate-in slide-in-from-top-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                   {error}
                </div>
              )}
              
              <div className="max-w-5xl mx-auto w-full space-y-6">
                 <input 
                    ref={inputRef}
                    type="text"
                    inputMode="none"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="w-full bg-transparent text-right text-4xl md:text-7xl font-light text-slate-800 dark:text-slate-100 outline-none placeholder:text-slate-200 dark:placeholder:text-slate-800 font-mono tracking-tight transition-all"
                    placeholder="0"
                    autoComplete="off"
                 />
                 <div className="h-16 text-2xl md:text-4xl font-bold text-emerald-500 font-mono tracking-wider opacity-90 truncate text-right drop-shadow-sm flex items-center justify-end gap-3">
                    {result && <span className="text-slate-300 dark:text-slate-700 text-lg md:text-2xl font-light">=</span>}
                    {result || ''}
                 </div>
              </div>
           </div>

           {/* Full Page Keypad */}
           <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-white dark:bg-slate-950 custom-scrollbar">
              <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 h-full">
                  
                  {/* Scientific Section */}
                  <div className="grid grid-cols-4 gap-4 lg:flex-1 content-start border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-800 pb-8 lg:pb-0 lg:pr-8">
                     <div className="col-span-4 mb-2 flex items-center gap-2">
                        <Calculator className="w-4 h-4 text-emerald-500" />
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Scientific Functions</span>
                     </div>
                     {[
                       {l: 'sin', v: 'sin('}, {l: 'cos', v: 'cos('}, {l: 'tan', v: 'tan('}, {l: 'π', v: 'pi'},
                       {l: 'asin', v: 'asin('}, {l: 'acos', v: 'acos('}, {l: 'atan', v: 'atan('}, {l: 'e', v: 'e'},
                       {l: 'ln', v: 'log('}, {l: 'log', v: 'log10('}, {l: 'x²', v: '^2'}, {l: '√', v: 'sqrt('},
                       {l: '^', v: '^'}, {l: '(', v: '('}, {l: ')', v: ')'}, {l: '!', v: '!'}
                     ].map(key => (
                         <KeyBtn key={key.l} label={key.l} val={key.v} color="slate" />
                     ))}
                  </div>

                  {/* Numeric/Action Section */}
                  <div className="grid grid-cols-4 gap-4 lg:flex-[1.2] content-start">
                     <div className="col-span-4 mb-2 flex items-center gap-2">
                        <Layout className="w-4 h-4 text-emerald-500" />
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Calculations</span>
                     </div>
                     <KeyBtn label="AC" onClick={clearInput} color="red" />
                     <KeyBtn label={<Delete className="w-6 h-6" />} onClick={backspace} color="red" />
                     <KeyBtn label="Ans" val="Ans" className="text-xs font-black uppercase tracking-widest" color="slate" />
                     <KeyBtn label={<Divide className="w-7 h-7" />} val="/" color="amber" />

                     <KeyBtn label="7" val="7" />
                     <KeyBtn label="8" val="8" />
                     <KeyBtn label="9" val="9" />
                     <KeyBtn label={<X className="w-7 h-7" />} val="*" color="amber" />

                     <KeyBtn label="4" val="4" />
                     <KeyBtn label="5" val="5" />
                     <KeyBtn label="6" val="6" />
                     <KeyBtn label={<Minus className="w-7 h-7" />} val="-" color="amber" />

                     <KeyBtn label="1" val="1" />
                     <KeyBtn label="2" val="2" />
                     <KeyBtn label="3" val="3" />
                     <KeyBtn label={<Plus className="w-7 h-7" />} val="+" color="amber" />

                     <KeyBtn label="0" val="0" />
                     <KeyBtn label="." val="." />
                     <KeyBtn label={<Equal className="w-10 h-10" />} onClick={safeEvaluate} color="emerald" colSpan={2} />
                  </div>
              </div>
           </div>
      </div>

      {/* Side History Drawer - Full Screen Height Overlay */}
      <div className={`fixed lg:absolute top-0 right-0 h-full w-full sm:w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-[-20px_0_40px_-15px_rgba(0,0,0,0.1)] z-50 transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) flex flex-col ${isHistoryOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-black/20">
              <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-slate-100">Activity Log</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{history.length} Entries</p>
                  </div>
              </div>
              <button onClick={() => setIsHistoryOpen(false)} className="p-2.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all hover:text-slate-900 active:scale-90"><CloseIcon className="w-5 h-5" /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar bg-white dark:bg-slate-950/20">
              {history.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                      <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                        <Calculator className="w-10 h-10 text-slate-300" />
                      </div>
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Memory is clear</p>
                  </div>
              ) : (
                  <div className="relative border-l-2 border-slate-100 dark:border-slate-800 ml-3 space-y-10">
                    {history.map((item, idx) => (
                        <div key={idx} className="relative pl-8 group">
                            <div className="absolute -left-[11px] top-1.5 w-5 h-5 rounded-full bg-white dark:bg-slate-900 border-2 border-emerald-500 group-hover:scale-125 transition-transform" />
                            <div className="bg-slate-50/50 dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-900 transition-all cursor-pointer shadow-sm relative overflow-hidden" onClick={() => { setInput(item.expression); setIsHistoryOpen(false); }}>
                                <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Copy className="w-3.5 h-3.5 text-emerald-500" />
                                </div>
                                <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mb-3 truncate pr-4">{item.expression}</div>
                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-lg font-black text-slate-800 dark:text-emerald-400 font-mono tracking-tight">{item.result}</span>
                                    <button 
                                      onClick={(e) => { 
                                        e.stopPropagation(); 
                                        navigator.clipboard.writeText(item.result);
                                      }} 
                                      className="p-1.5 text-slate-300 hover:text-emerald-600 transition-colors"
                                      title="Copy Result"
                                    >
                                      <Copy className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                  </div>
              )}
          </div>

          {history.length > 0 && (
              <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-black/10">
                  <button onClick={() => setHistory([])} className="w-full py-4 flex items-center justify-center gap-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all">
                      <Trash2 className="w-4 h-4" /> Clear All Records
                  </button>
              </div>
          )}
      </div>
    </div>
  );
};
