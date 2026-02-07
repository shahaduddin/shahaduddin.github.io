import React, { useState, useEffect, useRef } from 'react';
import { 
  Delete, Equal, Plus, Minus, X, Divide, 
  Clock, Trash2, Copy, History as HistoryIcon,
  X as CloseIcon, Calculator, Layout, 
  Binary, Atom, ChevronRight, Search, Info,
  Filter, Grid, ChevronDown
} from 'lucide-react';
import * as math from 'mathjs';

interface HistoryItem {
  expression: string;
  result: string;
  timestamp: number;
  isRoots?: boolean;
}

type ConstantCategory = 'Physics' | 'Math' | 'Earth/Eng' | 'All';

interface Constant {
  label: string;
  val: string;
  title: string;
  unit: string;
  category: ConstantCategory;
}

const CONSTANTS: Constant[] = [
  // Physics / Fundamental
  { label: 'c', val: '299792458', title: 'Speed of Light', unit: 'm/s', category: 'Physics' },
  { label: 'G', val: '6.67430e-11', title: 'Gravitational Constant', unit: 'm³/kg·s²', category: 'Physics' },
  { label: 'h', val: '6.62607e-34', title: 'Planck Constant', unit: 'J·s', category: 'Physics' },
  { label: 'k', val: '1.38065e-23', title: 'Boltzmann Constant', unit: 'J/K', category: 'Physics' },
  { label: 'N_A', val: '6.02214e23', title: 'Avogadro Number', unit: 'mol⁻¹', category: 'Physics' },
  { label: 'R', val: '8.31446', title: 'Molar Gas Constant', unit: 'J/mol·K', category: 'Physics' },
  { label: 'e', val: '1.60218e-19', title: 'Elementary Charge', unit: 'C', category: 'Physics' },
  { label: 'm_e', val: '9.10938e-31', title: 'Electron Mass', unit: 'kg', category: 'Physics' },
  { label: 'm_p', val: '1.67262e-27', title: 'Proton Mass', unit: 'kg', category: 'Physics' },
  { label: 'm_n', val: '1.67492e-27', title: 'Neutron Mass', unit: 'kg', category: 'Physics' },
  { label: 'ε_0', val: '8.85418e-12', title: 'Vacuum Permittivity', unit: 'F/m', category: 'Physics' },
  { label: 'μ_0', val: '1.25663e-6', title: 'Vacuum Permeability', unit: 'N/A²', category: 'Physics' },
  { label: 'σ', val: '5.67037e-8', title: 'Stefan-Boltzmann', unit: 'W/m²·K⁴', category: 'Physics' },
  { label: 'Φ_0', val: '2.06783e-15', title: 'Magnetic Flux Quantum', unit: 'Wb', category: 'Physics' },
  { label: 'α', val: '0.007297', title: 'Fine Structure Constant', unit: '', category: 'Physics' },
  { label: 'R_∞', val: '10973731', title: 'Rydberg Constant', unit: 'm⁻¹', category: 'Physics' },
  { label: 'u', val: '1.66053e-27', title: 'Atomic Mass Unit', unit: 'kg', category: 'Physics' },
  { label: 'k_e', val: '8.98755e9', title: 'Coulomb Constant', unit: 'N·m²/C²', category: 'Physics' },
  { label: 'μ_B', val: '9.27401e-24', title: 'Bohr Magneton', unit: 'J/T', category: 'Physics' },
  { label: 'a_0', val: '5.29177e-11', title: 'Bohr Radius', unit: 'm', category: 'Physics' },
  { label: 'Z_0', val: '376.7303', title: 'Vacuum Impedance', unit: 'Ω', category: 'Physics' },

  // Mathematics
  { label: 'φ', val: '1.618033988749', title: 'Golden Ratio', unit: '', category: 'Math' },
  { label: 'γ', val: '0.5772156649', title: 'Euler-Mascheroni', unit: '', category: 'Math' },
  { label: 'C', val: '0.915965594', title: 'Catalan Constant', unit: '', category: 'Math' },
  { label: '√2', val: '1.414213562', title: 'Pythagoras Const', unit: '', category: 'Math' },
  { label: '√3', val: '1.732050807', title: 'Theodorus Const', unit: '', category: 'Math' },

  // Engineering & Earth Science
  { label: 'g', val: '9.80665', title: 'Standard Gravity', unit: 'm/s²', category: 'Earth/Eng' },
  { label: 'v_s', val: '343', title: 'Speed of Sound', unit: 'm/s', category: 'Earth/Eng' },
  { label: 'M_e', val: '5.9722e24', title: 'Earth Mass', unit: 'kg', category: 'Earth/Eng' },
  { label: 'R_e', val: '6371000', title: 'Earth Radius', unit: 'm', category: 'Earth/Eng' },
  { label: 'F', val: '96485.33', title: 'Faraday Constant', unit: 'C/mol', category: 'Earth/Eng' },
  { label: 'P_0', val: '101325', title: 'Standard Atmosphere', unit: 'Pa', category: 'Earth/Eng' },
];

/**
 * Renders labels with subscripts (denoted by _) properly
 */
const SymbolRenderer: React.FC<{ symbol: string; className?: string }> = ({ symbol, className }) => {
  if (!symbol) return null;
  const parts = symbol.split('_');
  if (parts.length === 1) return <span className={className}>{symbol}</span>;
  return (
    <span className={className}>
      {parts[0]}<sub className="text-[0.65em] leading-none ml-[1px] translate-y-[0.1em] inline-block font-bold">{parts[1]}</sub>
    </span>
  );
};

/**
 * Find polynomial roots (simplified version for old app compatibility)
 */
const findRoots = (expr: string): string[] => {
  try {
    // Simple root finding for linear equations
    if (expr.includes('x')) {
      // Extract coefficients for ax + b = 0
      const exprWithoutSpaces = expr.replace(/\s+/g, '');
      const match = exprWithoutSpaces.match(/([+-]?\d*\.?\d*)x\s*([+-]?\d+\.?\d*)?/);
      
      if (match) {
        const a = match[1] === '' || match[1] === '+' ? 1 : match[1] === '-' ? -1 : parseFloat(match[1]);
        const b = match[2] ? parseFloat(match[2]) : 0;
        
        if (a === 0) {
          return b === 0 ? ["Infinite solutions"] : ["No solution"];
        }
        
        const root = -b / a;
        return [math.format(root, { precision: 8 })];
      }
    }
    
    // Try to evaluate normally
    const res = math.evaluate(expr);
    if (typeof res === 'number') {
      return [math.format(res, { precision: 8 })];
    }
    
    return ["Expression evaluation failed"];
  } catch (err) {
    return ["Calculation error"];
  }
};

export const CalculatorTool: React.FC = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // UI States
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isConstOpen, setIsConstOpen] = useState(false);
  const [isFuncOpen, setIsFuncOpen] = useState(false);
  const [angleMode, setAngleMode] = useState<'RAD' | 'DEG'>('RAD');
  const [constSearch, setConstSearch] = useState('');
  const [constCategory, setConstCategory] = useState<ConstantCategory>('All');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [detailConst, setDetailConst] = useState<Constant | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const resultContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll result to the end when it changes
  useEffect(() => {
    if (resultContainerRef.current) {
      resultContainerRef.current.scrollLeft = resultContainerRef.current.scrollWidth;
    }
  }, [result]);

  // Focus input on component mount (old app behavior)
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const insertAtCursor = (val: string) => {
    if (val === undefined || val === null) return;
    const inputEl = inputRef.current;
    if (!inputEl) return;
    
    const start = inputEl.selectionStart || 0;
    const end = inputEl.selectionEnd || 0;
    const newValue = input.substring(0, start) + val + input.substring(end);
    setInput(newValue);
    
    setTimeout(() => {
      const pos = start + (val.toString().length);
      inputEl.selectionStart = inputEl.selectionEnd = pos;
      inputEl.focus();
    }, 0);
  };

  const clearInput = () => { 
    setInput(''); 
    setResult(''); 
    setError(null); 
    setTimeout(() => inputRef.current?.focus(), 0);
  };
  
  const backspace = () => {
    const inputEl = inputRef.current;
    if (!inputEl) return;
    const start = inputEl.selectionStart || 0;
    const end = inputEl.selectionEnd || 0;
    if (start === end && start > 0) {
      const newValue = input.substring(0, start - 1) + input.substring(end);
      setInput(newValue);
      setTimeout(() => { inputEl.selectionStart = inputEl.selectionEnd = start - 1; inputEl.focus(); }, 0);
    } else if (start !== end) {
      const newValue = input.substring(0, start) + input.substring(end);
      setInput(newValue);
      setTimeout(() => { inputEl.selectionStart = inputEl.selectionEnd = start; inputEl.focus(); }, 0);
    }
  };

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
      const fromRad = (r: number) => r * (180 / Math.PI);
      return {
        sin: (x: number) => Math.sin(toRad(x)),
        cos: (x: number) => Math.cos(toRad(x)),
        tan: (x: number) => Math.tan(toRad(x)),
        asin: (x: number) => fromRad(Math.asin(x)),
        acos: (x: number) => fromRad(Math.acos(x)),
        atan: (x: number) => fromRad(Math.atan(x)),
      };
    }
    return {};
  };

  const safeEvaluate = () => {
    try {
      if (!input.trim()) return;
      const sanitized = getSanitizedExpression(input);

      // Check if expression contains 'x' for root finding
      if (input.toLowerCase().includes('x')) {
        const roots = findRoots(sanitized);
        const resString = roots.join('; ');
        setResult(resString);
        setHistory(prev => [{
          expression: input,
          result: resString,
          timestamp: Date.now(),
          isRoots: true
        }, ...prev].slice(0, 50));
        setError(null);
        return;
      }

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
      setError(null);
    } catch (e: any) {
      setError("Syntax Error");
    }
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      safeEvaluate();
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      clearInput();
    }
  };

  const KeyBtn = ({ label, val, color = "default", onClick, className = "", colSpan = 1, title = "" }: any) => {
    const baseClass = `relative h-16 md:h-20 rounded-2xl flex items-center justify-center text-sm md:text-lg font-bold transition-all active:scale-95 select-none overflow-hidden group border shadow-sm cursor-pointer`;
    const colors: any = {
      default: "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-800",
      slate: "bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800",
      emerald: "bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-600/20 border-emerald-500",
      amber: "bg-amber-50 dark:bg-amber-900/10 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30 border-amber-100 dark:border-amber-900/30",
      red: "bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 border-red-100 dark:border-red-900/30"
    };
    return (
      <button 
        type="button"
        title={title}
        onClick={() => onClick ? onClick() : insertAtCursor(val)} 
        className={`${baseClass} ${colors[color]} ${className}`} 
        style={{ gridColumn: colSpan > 1 ? `span ${colSpan} / span ${colSpan}` : undefined }}
      >
        <span className="relative z-10">{label}</span>
      </button>
    );
  };

  const filteredConstants = CONSTANTS.filter(c => {
    const matchesSearch = c.label.toLowerCase().includes(constSearch.toLowerCase()) || 
                          c.title.toLowerCase().includes(constSearch.toLowerCase());
    const matchesCategory = constCategory === 'All' || c.category === constCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex w-full h-[calc(100vh-3.5rem)] bg-white dark:bg-slate-950 overflow-hidden relative animate-in fade-in duration-500">
      
      {/* Constant Detail Dialog */}
      {detailConst && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 border border-slate-200 dark:border-slate-800 animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-8">
              <div className="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center">
                <SymbolRenderer symbol={detailConst.label} className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-serif" />
              </div>
              <button onClick={() => setDetailConst(null)} className="p-3 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-colors"><CloseIcon size={20}/></button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Constant Name</label>
                <div className="text-xl font-black text-slate-800 dark:text-slate-100">{detailConst.title}</div>
              </div>
              
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Numerical Value</label>
                <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 font-mono text-lg font-bold text-emerald-600 break-all">
                  {detailConst.val}
                </div>
              </div>

              {detailConst.unit && (
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Standard Unit</label>
                  <div className="text-sm font-bold text-slate-500 dark:text-slate-400">{detailConst.unit}</div>
                </div>
              )}

              <button 
                onClick={() => { insertAtCursor(detailConst.val); setDetailConst(null); setIsConstOpen(false); }}
                className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-600/20 transition-all active:scale-95"
              >
                Insert Into Expression
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-slate-950">
           
           {/* Immersive Header/Display */}
           <div className="flex-none p-6 md:p-10 bg-slate-50/50 dark:bg-black/20 border-b border-slate-200 dark:border-slate-800 relative min-h-[220px] md:min-h-[280px] flex flex-col justify-end">
              <div className="absolute top-6 left-6 md:left-10 flex gap-3 z-10">
                 <button 
                   type="button"
                   onClick={() => setAngleMode(m => m === 'DEG' ? 'RAD' : 'DEG')} 
                   className="px-4 py-2 bg-white dark:bg-slate-900 text-[10px] font-black text-emerald-600 dark:text-emerald-500 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm min-w-[70px] transition-all hover:border-emerald-300 uppercase tracking-widest"
                 >
                   {angleMode}
                 </button>
                 <button 
                   type="button"
                   onClick={() => { setIsHistoryOpen(!isHistoryOpen); setIsConstOpen(false); setIsFuncOpen(false); }} 
                   className={`p-2.5 rounded-xl border transition-all ${isHistoryOpen ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg' : 'bg-white dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-800 shadow-sm hover:text-emerald-500'}`}
                 >
                    <HistoryIcon className="w-5 h-5" />
                 </button>
                 <button 
                   type="button"
                   onClick={() => { setIsConstOpen(!isConstOpen); setIsHistoryOpen(false); setIsFuncOpen(false); }} 
                   className={`p-2.5 rounded-xl border transition-all ${isConstOpen ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg' : 'bg-white dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-800 hover:text-emerald-500 shadow-sm'}`}
                 >
                    <Atom className="w-5 h-5" />
                 </button>
                 <button 
                   type="button"
                   onClick={() => { setIsFuncOpen(!isFuncOpen); setIsHistoryOpen(false); setIsConstOpen(false); }} 
                   className={`p-2.5 rounded-xl border transition-all ${isFuncOpen ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg' : 'bg-white dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-800 hover:text-emerald-500 shadow-sm'}`}
                 >
                    <Grid className="w-5 h-5" />
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
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-transparent text-right text-4xl md:text-7xl font-light text-slate-800 dark:text-slate-100 outline-none placeholder:text-slate-200 dark:placeholder:text-slate-800 font-mono tracking-tight transition-all caret-emerald-500"
                    placeholder="0"
                    autoComplete="off"
                    autoFocus
                 />
                 <div 
                    ref={resultContainerRef}
                    className="h-16 text-2xl md:text-4xl font-bold text-emerald-500 font-mono tracking-wider opacity-90 truncate text-right drop-shadow-sm flex items-center justify-end gap-3 overflow-x-auto no-scrollbar"
                 >
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
                        <Binary className="w-4 h-4 text-emerald-500" />
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Scientific Functions</span>
                     </div>
                     {[
                       {l: 'sin', v: 'sin('}, {l: 'cos', v: 'cos('}, {l: 'tan', v: 'tan('}, {l: 'π', v: 'π'},
                       {l: 'asin', v: 'asin('}, {l: 'acos', v: 'acos('}, {l: 'atan', v: 'atan('}, {l: 'e', v: 'e'},
                       {l: 'ln', v: 'ln('}, {l: 'log', v: 'log10('}, {l: 'x²', v: '^2'}, {l: '√', v: 'sqrt('},
                       {l: '^', v: '^'}, {l: '(', v: '('}, {l: ')', v: ')'}, {l: '!', v: '!'},
                       {l: <span className="italic font-serif text-lg">x</span>, v: 'x', col: 2}, {l: ',', v: ','}, {l: 'abs', v: 'abs('}
                     ].map(key => (
                         <KeyBtn 
                           key={key.l} 
                           label={key.l} 
                           val={key.v} 
                           color="slate" 
                           colSpan={key.col || 1}
                         />
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
                     <KeyBtn label={<X className="w-7 h-7" />} val="×" color="amber" />

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

      {/* Functions Lab Side Panel */}
      <div className={`fixed inset-y-0 right-0 w-full sm:w-[480px] bg-white dark:bg-slate-900 border-l border-slate-100 dark:border-slate-800 z-[110] transform transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] flex flex-col shadow-[-40px_0_80px_-20px_rgba(0,0,0,0.1)] ${isFuncOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-10 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center">
              <Grid className="text-emerald-600 dark:text-emerald-400" size={24}/>
            </div>
            <div>
              <h3 className="font-black text-slate-900 dark:text-slate-100 text-base tracking-[0.2em] uppercase">Functions Lab</h3>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest opacity-60">Formula Library</p>
            </div>
          </div>
          <button onClick={() => setIsFuncOpen(false)} className="p-4 text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all"><CloseIcon size={24}/></button>
        </div>

        <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar bg-slate-50/20 dark:bg-slate-950/20 pb-24">
          
          {/* Section: Trigonometry */}
          <div>
            <div className="flex items-center gap-3 mb-6 px-1">
              <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.4em]">Trigonometry</span>
              <div className="h-[1px] flex-1 bg-slate-100 dark:bg-slate-800"/>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                {label: 'sin', val: 'sin('}, {label: 'cos', val: 'cos('}, {label: 'tan', val: 'tan('},
                {label: 'asin', val: 'asin('}, {label: 'acos', val: 'acos('}, {label: 'atan', val: 'atan('},
                {label: 'sec', val: 'sec('}, {label: 'cosec', val: 'csc('}, {label: 'cot', val: 'cot('},
                {label: 'asec', val: 'asec('}, {label: 'acosec', val: 'acsc('}, {label: 'acot', val: 'acot('}
              ].map((f, i) => (
                <button key={i} onClick={() => insertAtCursor(f.val)} className="py-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 text-[13px] font-bold text-slate-600 dark:text-slate-300 hover:border-emerald-400 hover:text-emerald-600 transition-all active:scale-95 shadow-sm">
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section: Hyperbolic */}
          <div>
            <div className="flex items-center gap-3 mb-6 px-1">
              <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.4em]">Hyperbolic</span>
              <div className="h-[1px] flex-1 bg-slate-100 dark:bg-slate-800"/>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                {label: 'sinh', val: 'sinh('}, {label: 'cosh', val: 'cosh('}, {label: 'tanh', val: 'tanh('},
                {label: 'asinh', val: 'asinh('}, {label: 'acosh', val: 'acosh('}, {label: 'atanh', val: 'atanh('},
                {label: 'sech', val: 'sech('}, {label: 'csch', val: 'csch('}, {label: 'coth', val: 'coth('},
                {label: 'asech', val: 'asech('}, {label: 'acsch', val: 'acsch('}, {label: 'acoth', val: 'acoth('}
              ].map((f, i) => (
                <button key={i} onClick={() => insertAtCursor(f.val)} className="py-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 text-[13px] font-bold text-slate-600 dark:text-slate-300 hover:border-emerald-400 hover:text-emerald-600 transition-all active:scale-95 shadow-sm">
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section: Statistics & Combinatorics */}
          <div>
            <div className="flex items-center gap-3 mb-6 px-1">
              <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.4em]">Statistics</span>
              <div className="h-[1px] flex-1 bg-slate-100 dark:bg-slate-800"/>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                {label: 'nPr', val: 'permutations('}, {label: 'nCr', val: 'combinations('}, {label: 'mean', val: 'mean('},
                {label: 'median', val: 'median('}, {label: 'std', val: 'std('}, {label: 'var', val: 'var('}
              ].map((f, i) => (
                <button key={i} onClick={() => insertAtCursor(f.val)} className="py-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 text-[13px] font-bold text-slate-600 dark:text-slate-300 hover:border-emerald-400 hover:text-emerald-600 transition-all active:scale-95 shadow-sm">
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Constants Side Panel */}
      <div className={`fixed inset-y-0 right-0 w-full sm:w-[480px] bg-white dark:bg-slate-900 border-l border-slate-100 dark:border-slate-800 z-[110] transform transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] flex flex-col shadow-[-40px_0_80px_-20px_rgba(0,0,0,0.1)] ${isConstOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-10 border-b border-slate-50 dark:border-slate-800 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center">
                <Atom className="text-emerald-600 dark:text-emerald-400" size={24}/>
              </div>
              <div>
                <h3 className="font-black text-slate-900 dark:text-slate-100 text-base tracking-[0.2em] uppercase">Universal Constants</h3>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest opacity-60">Emerald Collection</p>
              </div>
            </div>
            <button onClick={() => setIsConstOpen(false)} className="p-4 text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all"><CloseIcon size={24}/></button>
          </div>
          
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-1 group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
                  <Search size={18} />
                </div>
                <input 
                  type="text" 
                  placeholder="Symbol or name..." 
                  value={constSearch}
                  onChange={(e) => setConstSearch(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-300 outline-none focus:border-emerald-400 dark:focus:border-emerald-600 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700"
                />
              </div>
              <button 
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className={`p-4 rounded-2xl border transition-all ${showFilterMenu ? 'bg-emerald-600 text-white border-emerald-500 shadow-md scale-95' : 'bg-slate-50 dark:bg-slate-950 text-slate-400 border-slate-100 dark:border-slate-800 hover:text-emerald-500'}`}
              >
                <Filter size={20} />
              </button>
            </div>

            {showFilterMenu && (
              <div className="flex items-center gap-2 overflow-x-auto py-2 custom-scrollbar animate-in slide-in-from-top-2 fade-in duration-300">
                 {(['All', 'Physics', 'Math', 'Earth/Eng'] as ConstantCategory[]).map(cat => (
                   <button
                     key={cat}
                     onClick={() => setConstCategory(cat)}
                     className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all flex-shrink-0 ${constCategory === cat ? 'bg-emerald-600 text-white border-emerald-500 shadow-md' : 'bg-slate-50 dark:bg-slate-950 text-slate-400 border-slate-100 dark:border-slate-800 hover:text-emerald-500 hover:border-emerald-300'}`}
                   >
                     {cat}
                   </button>
                 ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-50/20 dark:bg-slate-950/20 pb-24">
          {filteredConstants.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-200 dark:text-slate-800/40">
              <Search size={80} className="mb-8 stroke-[0.3px]"/>
              <p className="text-xs font-black uppercase tracking-[0.5em]">No Constants Match</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
              {filteredConstants.map((c, idx) => (
                <div 
                  key={idx} 
                  className="group relative bg-white dark:bg-slate-900/40 aspect-square rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-emerald-400/40 dark:hover:border-emerald-600/40 transition-all hover:shadow-xl hover:shadow-emerald-500/5 overflow-hidden flex flex-col"
                >
                  <button 
                    onClick={() => { insertAtCursor(c.val); setIsConstOpen(false); }}
                    className="w-full h-full flex items-center justify-center active:scale-90 transition-transform"
                  >
                    <SymbolRenderer symbol={c.label} className="text-xl font-black text-slate-800 dark:text-emerald-400 font-serif" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setDetailConst(c); }}
                    className="absolute top-1 right-1 p-1 text-slate-200 hover:text-emerald-500 dark:text-slate-700 dark:hover:text-emerald-400 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Info size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* History Side Panel */}
      <div className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 z-50 transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) flex flex-col ${isHistoryOpen ? 'translate-x-0' : 'translate-x-full'}`}>
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
              <button 
                type="button"
                onClick={() => setIsHistoryOpen(false)} 
                className="p-2.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all hover:text-slate-900 active:scale-90"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
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
                            <div className="bg-slate-50/50 dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-900 transition-all cursor-pointer shadow-sm relative overflow-hidden" onClick={() => { setInput(item.expression); setIsHistoryOpen(false); setTimeout(() => inputRef.current?.focus(), 100); }}>
                                <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Copy className="w-3.5 h-3.5 text-emerald-500" />
                                </div>
                                <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mb-3 truncate pr-4">{item.expression}</div>
                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-lg font-black text-slate-800 dark:text-emerald-400 font-mono tracking-tight">{item.result}</span>
                                    <button 
                                      type="button"
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
                                {item.isRoots && <div className="mt-3 flex items-center gap-2">
                                  <div className="px-2 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[8px] font-black uppercase tracking-[0.1em] rounded-full border border-emerald-100/50 dark:border-emerald-900/30">Root Solving</div>
                                </div>}
                            </div>
                        </div>
                    ))}
                  </div>
              )}
          </div>

          {history.length > 0 && (
              <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-black/10">
                  <button 
                    type="button"
                    onClick={() => setHistory([])} 
                    className="w-full py-4 flex items-center justify-center gap-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all"
                  >
                      <Trash2 className="w-4 h-4" /> Clear All Records
                  </button>
              </div>
          )}
      </div>
    </div>
  );
};