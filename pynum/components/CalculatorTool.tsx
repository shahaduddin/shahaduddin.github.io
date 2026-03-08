
import React, { useState, useEffect, useRef } from 'react';
import { 
  Delete, Equal, Plus, Minus, X, Divide, 
  Clock, Trash2, Copy, History as HistoryIcon,
  X as CloseIcon, Calculator, Layout, 
  Binary, Atom, ChevronRight, Hash, Search, Info,
  Filter, Grid, ChevronDown
} from 'lucide-react';
import * as math from 'mathjs';
import { findRoots } from '../utils/mathUtils';

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

const MathDisplayRenderer: React.FC<{ text: string }> = ({ text }) => {
  if (!text) return <span className="text-slate-200 dark:text-slate-800">0</span>;

  const renderNthRoot = (input: string) => {
    if (!input) return [];
    const regex = /nthRoot\(([^,]+),\s*([^)]+)\)/g;
    const items: (string | React.ReactNode)[] = [];
    let lastIdx = 0;
    let match;

    while ((match = regex.exec(input)) !== null) {
      items.push(input.substring(lastIdx, match.index));
      items.push(
        <span key={match.index} className="inline-flex items-center -mb-1">
          <sup className="text-[0.55em] -mr-0.5 mb-1.5 font-bold text-emerald-600 dark:text-emerald-500">{match[2]}</sup>
          <span className="text-[1.15em] font-serif italic">√</span>
          <span className="border-t-2 border-slate-800 dark:border-slate-100 px-1 pt-0.5 -mt-0.5 leading-none font-mono">
            {match[1]}
          </span>
        </span>
      );
      lastIdx = regex.lastIndex;
    }
    items.push(input.substring(lastIdx));
    return items;
  };

  const basicPretty = (content: any) => {
    if (typeof content !== 'string') return content;
    return content
      .replace(/\*/g, '×')
      .replace(/\//g, '÷')
      .replace(/pi/g, 'π')
      .replace(/sqrt/g, '√');
  };

  const firstPass = renderNthRoot(text);
  const finalPass = firstPass.map((part, i) => (
     <React.Fragment key={i}>{basicPretty(part)}</React.Fragment>
  ));

  return <>{finalPass}</>;
};

export const CalculatorTool: React.FC = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isConstOpen, setIsConstOpen] = useState(false);
  const [isFuncOpen, setIsFuncOpen] = useState(false);
  const [isNthRootOpen, setIsNthRootOpen] = useState(false);
  const [angleMode, setAngleMode] = useState<'RAD' | 'DEG'>('RAD');
  const [constSearch, setConstSearch] = useState('');
  const [constCategory, setConstCategory] = useState<ConstantCategory>('All');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [detailConst, setDetailConst] = useState<Constant | null>(null);
  
  const [nrValue, setNrValue] = useState('');
  const [nrIndex, setNrIndex] = useState('');
  
  const inputRef = useRef<HTMLInputElement>(null);
  const expressionContainerRef = useRef<HTMLDivElement>(null);
  const resultContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (resultContainerRef.current) {
      resultContainerRef.current.scrollLeft = resultContainerRef.current.scrollWidth;
    }
  }, [result]);

  useEffect(() => {
    if (expressionContainerRef.current) {
      expressionContainerRef.current.scrollLeft = expressionContainerRef.current.scrollWidth;
    }
  }, [input]);

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

  const clearInput = () => { setInput(''); setResult(''); setError(null); inputRef.current?.focus(); };
  
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
      .replace(/(\d+(\.\d+)?)\s*P\s*(\d+(\.\d+)?)/g, 'permutations($1, $3)')
      .replace(/(\d+(\.\d+)?)\s*C\s*(\d+(\.\d+)?)/g, 'combinations($1, $3)')
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
        sec: (x: number) => 1 / Math.cos(toRad(x)),
        csc: (x: number) => 1 / Math.sin(toRad(x)),
        cot: (x: number) => 1 / Math.tan(toRad(x)),
        asin: (x: number) => fromRad(Math.asin(x)),
        acos: (x: number) => fromRad(Math.acos(x)),
        atan: (x: number) => fromRad(Math.atan(x)),
        asec: (x: number) => fromRad(Math.acos(1 / x)),
        acsc: (x: number) => fromRad(Math.asin(1 / x)),
        acot: (x: number) => fromRad(Math.atan(1 / x)),
        sinh: (x: number) => Math.sinh(toRad(x)),
        cosh: (x: number) => Math.cosh(toRad(x)),
        tanh: (x: number) => Math.tanh(toRad(x)),
        sech: (x: number) => 1 / Math.cosh(toRad(x)),
        csch: (x: number) => 1 / Math.sinh(toRad(x)),
        coth: (x: number) => 1 / Math.tanh(toRad(x)),
        asinh: (x: number) => fromRad(Math.asinh(x)),
        acosh: (x: number) => fromRad(Math.acosh(x)),
        atanh: (x: number) => fromRad(Math.atanh(x)),
        asech: (x: number) => fromRad(Math.acosh(1 / x)),
        acsch: (x: number) => fromRad(Math.asinh(1 / x)),
        acoth: (x: number) => fromRad(Math.atanh(1 / x)),
      };
    }
    return {};
  };

  const safeEvaluate = () => {
    try {
      if (!input.trim()) return;
      const sanitized = getSanitizedExpression(input);

      if (input.toLowerCase().includes('x')) {
        const roots = findRoots(sanitized);
        const resString = roots.join('; ');
        setResult(resString);
        addToHistory(input, resString, true);
        setError(null);
        return;
      }

      const scope = getEvaluationScope();
      const res = math.evaluate(sanitized, scope);
      const formatted = math.format(res, { precision: 12 });
      setResult(formatted);
      addToHistory(input, formatted);
      setError(null);
    } catch (e: any) {
      setError("Calculation Error");
    }
    inputRef.current?.focus();
  };

  const addToHistory = (expr: string, res: string, isRoots = false) => {
    setHistory(prev => [{ expression: expr, result: res, timestamp: Date.now(), isRoots }, ...prev].slice(0, 50));
  };

  const confirmNthRoot = () => {
    if (!nrValue || !nrIndex) return;
    insertAtCursor(`nthRoot(${nrValue}, ${nrIndex})`);
    setIsNthRootOpen(false);
    setNrValue('');
    setNrIndex('');
  };

  const KeyBtn = ({ label, val, variant = "default", onClick, colSpan = 1, title = "" }: any) => {
    const variants: any = {
      default: "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 shadow-sm",
      function: "bg-slate-50/60 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-800",
      action: "bg-emerald-600 text-white hover:bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-600/10",
      operator: "bg-amber-50/60 dark:bg-amber-950/20 text-amber-600 dark:text-amber-500 hover:bg-amber-100 dark:hover:bg-amber-950/30 border-amber-100 dark:border-amber-900/30",
      danger: "bg-red-50/60 dark:bg-red-950/20 text-red-600 dark:text-red-500 hover:bg-red-100 dark:hover:bg-red-950/30 border-red-100 dark:border-red-900/30"
    };
    return (
      <button 
        type="button" title={title}
        onClick={() => onClick ? onClick() : insertAtCursor(val)} 
        className={`h-14 rounded-2xl flex items-center justify-center text-[15px] font-bold transition-all active:scale-95 border ${variants[variant]} ${colSpan > 1 ? `col-span-${colSpan}` : ''}`} 
      >
        {label}
      </button>
    );
  };

  const filteredConstants = CONSTANTS.filter(c => {
    const matchesSearch = c.label.toLowerCase().includes(constSearch.toLowerCase()) || 
                          c.title.toLowerCase().includes(constSearch.toLowerCase());
    const matchesCategory = constCategory === 'All' || c.category === constCategory;
    return matchesSearch && matchesCategory;
  });

  const insertFunction = (val: string) => {
    insertAtCursor(val);
    setIsFuncOpen(false);
  };

  return (
    <div className="flex flex-col lg:flex-row w-full h-screen bg-white dark:bg-slate-950 overflow-hidden relative selection:bg-emerald-200 dark:selection:bg-emerald-900/40">
      
      {/* Nth Root Modal */}
      {isNthRootOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2rem] shadow-2xl p-8 border border-slate-200 dark:border-slate-800 scale-100 transform transition-all animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400">nth Root Input</h3>
              <button onClick={() => setIsNthRootOpen(false)} className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"><CloseIcon size={18}/></button>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-950 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
                <div className="flex flex-col items-center">
                   <input 
                      type="text" value={nrIndex} onChange={(e) => setNrIndex(e.target.value)}
                      placeholder="n" className="w-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-emerald-600 outline-none p-1 mb-1"
                   />
                   <span className="text-3xl font-serif">√</span>
                </div>
                <div className="flex-1">
                   <input 
                      type="text" value={nrValue} onChange={(e) => setNrValue(e.target.value)}
                      placeholder="Value" className="w-full text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xl font-mono font-bold outline-none p-3"
                   />
                </div>
              </div>
              <button onClick={confirmNthRoot} className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-600/20 transition-all active:scale-95">Insert Root</button>
            </div>
          </div>
        </div>
      )}

      {/* Constant Detail Dialog */}
      {detailConst && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 border border-slate-200 dark:border-slate-800 animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-8">
              <div className="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center"><SymbolRenderer symbol={detailConst.label} className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-serif" /></div>
              <button onClick={() => setDetailConst(null)} className="p-3 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-colors"><CloseIcon size={20}/></button>
            </div>
            <div className="space-y-6">
              <div><label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Constant Name</label><div className="text-xl font-black text-slate-800 dark:text-slate-100">{detailConst.title}</div></div>
              <div><label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Numerical Value</label><div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 font-mono text-lg font-bold text-emerald-600 break-all">{detailConst.val}</div></div>
              {detailConst.unit && (<div><label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Standard Unit</label><div className="text-sm font-bold text-slate-500 dark:text-slate-400">{detailConst.unit}</div></div>)}
              <button onClick={() => { insertAtCursor(detailConst.val); setDetailConst(null); setIsConstOpen(false); }} className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-600/20 transition-all active:scale-95">Insert Into Expression</button>
            </div>
          </div>
        </div>
      )}

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
        {/* Display Area: Tight vertical padding, safe top for controls */}
        <div className="flex-none px-6 md:px-8 pt-16 pb-1 flex flex-col justify-start bg-gradient-to-b from-slate-50/50 to-transparent dark:from-slate-900/30 dark:to-transparent relative border-b border-slate-100 dark:border-slate-900 transition-all">
          <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
            <button onClick={() => setAngleMode(m => m === 'DEG' ? 'RAD' : 'DEG')} className="px-3 py-1.5 text-[10px] font-black bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm hover:border-emerald-500 transition-all uppercase tracking-widest active:scale-95">{angleMode}</button>
            <button onClick={() => { setIsHistoryOpen(!isHistoryOpen); setIsConstOpen(false); setIsFuncOpen(false); }} className={`p-2 rounded-lg border transition-all active:scale-95 ${isHistoryOpen ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg' : 'bg-white dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-800 hover:text-emerald-500'}`}><HistoryIcon size={16}/></button>
            <button onClick={() => { setIsConstOpen(!isConstOpen); setIsHistoryOpen(false); setIsFuncOpen(false); }} className={`p-2 rounded-lg border transition-all active:scale-95 ${isConstOpen ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg' : 'bg-white dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-800 hover:text-emerald-500'}`}><Atom size={16}/></button>
            <button onClick={() => { setIsFuncOpen(!isFuncOpen); setIsHistoryOpen(false); setIsConstOpen(false); }} className={`p-2 rounded-lg border transition-all active:scale-95 ${isFuncOpen ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg' : 'bg-white dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-800 hover:text-emerald-500'}`}><Grid size={16}/></button>
          </div>

          {error && <div className="absolute top-4 right-4 px-4 py-2 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-[9px] font-black uppercase tracking-widest border border-red-100 dark:border-red-900/50 flex items-center gap-2 animate-in slide-in-from-right-8"><div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"/> {error}</div>}

          <div className="max-w-5xl mx-auto w-full flex flex-col items-end gap-0">
            {/* Expression Display: Tight horizontal scrolling, no visible scrollbar */}
            <div 
              ref={expressionContainerRef}
              className="w-full text-right overflow-x-auto no-scrollbar scroll-smooth cursor-text py-1"
            >
              <div className="flex flex-row justify-end items-center text-right text-4xl md:text-5xl lg:text-6xl font-light text-slate-800 dark:text-slate-100 tracking-tight font-mono whitespace-nowrap px-1 leading-tight">
                <MathDisplayRenderer text={input} />
              </div>
            </div>
            
            <input 
              ref={inputRef} type="text" value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyDown={(e) => { if (e.key === 'Enter') safeEvaluate(); if (e.key === 'Escape') clearInput(); }}
              inputMode="none" autoComplete="off" autoFocus className="sr-only"
            />

            {/* Result Display: Hidden scrollbars, horizontal scroll only, fixed vertical height to avoid Y-axis scroll */}
            <div 
              ref={resultContainerRef}
              className="h-10 flex items-center justify-end w-full overflow-x-auto overflow-y-hidden no-scrollbar scroll-smooth"
            >
              <div className="text-xl md:text-2xl font-black text-emerald-500 dark:text-emerald-400 font-mono tracking-tighter drop-shadow-sm whitespace-nowrap min-w-full text-right px-1 leading-none">
                {result}
              </div>
            </div>
          </div>
        </div>

        {/* Keypad */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-white dark:bg-slate-950 no-scrollbar">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 pb-2">
            
            {/* Advanced Lab Section */}
            <div className="md:col-span-5 grid grid-cols-4 gap-2.5 h-fit">
              <div className="col-span-4 flex items-center gap-3 mb-1 px-1">
                <Binary size={14} className="text-emerald-500"/>
                <span className="text-[9px] font-black uppercase text-slate-400 dark:text-slate-600 tracking-[0.4em]">Primary Ops</span>
              </div>
              {[
                {label: 'x²', val: '^2'}, {label: '^', val: '^'}, {label: '√', val: 'sqrt('}, {label: 'ⁿ√', onClick: () => setIsNthRootOpen(true), variant: 'function'},
                {label: 'log', val: 'log10('}, {label: 'ln', val: 'ln('}, {label: 'x!', val: '!'}, {label: 'mod', val: ' mod '},
                {label: 'π', val: 'π'}, {label: 'e', val: 'e'}, {label: '(', val: '('}, {label: ')', val: ')'},
                {label: <span className="italic font-serif text-lg">x</span>, val: 'x', colSpan: 2}, {label: ',', val: ','}, {label: 'abs', val: 'abs('}
              ].map((k, i) => (
                <KeyBtn key={i} {...k} variant={k.variant || "function"} />
              ))}
            </div>

            {/* Arithmetic Section */}
            <div className="md:col-span-7 grid grid-cols-4 gap-2.5 h-fit">
              <div className="col-span-4 flex items-center gap-3 mb-1 px-1">
                <Layout size={14} className="text-emerald-500"/>
                <span className="text-[9px] font-black uppercase text-slate-400 dark:text-slate-600 tracking-[0.4em]">Calculations</span>
              </div>
              <KeyBtn label="AC" onClick={clearInput} variant="danger"/>
              <KeyBtn label={<Delete size={20}/>} onClick={backspace} variant="danger"/>
              <KeyBtn label="Ans" val="Ans" variant="function"/>
              <KeyBtn label={<Divide size={22}/>} val="/" variant="operator"/>

              <KeyBtn label="7" val="7"/>
              <KeyBtn label="8" val="8"/>
              <KeyBtn label="9" val="9"/>
              <KeyBtn label={<X size={20}/>} val="×" variant="operator"/>

              <KeyBtn label="4" val="4"/>
              <KeyBtn label="5" val="5"/>
              <KeyBtn label="6" val="6"/>
              <KeyBtn label={<Minus size={22}/>} val="-" variant="operator"/>

              <KeyBtn label="1" val="1"/>
              <KeyBtn label="2" val="2"/>
              <KeyBtn label="3" val="3"/>
              <KeyBtn label={<Plus size={22}/>} val="+" variant="operator"/>

              <KeyBtn label="0" val="0"/>
              <KeyBtn label="." val="."/>
              <KeyBtn label={<Equal size={32}/>} onClick={safeEvaluate} variant="action" colSpan={2}/>
            </div>
          </div>
        </div>
      </div>

      {(isHistoryOpen || isConstOpen || isFuncOpen) && (
        <div className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-[105]" onClick={() => { setIsHistoryOpen(false); setIsConstOpen(false); setIsFuncOpen(false); }} />
      )}

      {/* Side Panels */}
      <div className={`fixed inset-y-0 right-0 w-full sm:w-[480px] bg-white dark:bg-slate-900 border-l border-slate-100 dark:border-slate-800 z-[110] transform transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] flex flex-col shadow-[-40px_0_80px_-20px_rgba(0,0,0,0.1)] ${isFuncOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-10 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center"><Grid className="text-emerald-600 dark:text-emerald-400" size={24}/></div>
            <div>
              <h3 className="font-black text-slate-900 dark:text-slate-100 text-base tracking-[0.2em] uppercase">Functions Lab</h3>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest opacity-60">Formula Library</p>
            </div>
          </div>
          <button onClick={() => setIsFuncOpen(false)} className="p-4 text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all"><CloseIcon size={24}/></button>
        </div>
        <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar bg-slate-50/20 dark:bg-slate-950/20 pb-24">
          <div>
            <div className="flex items-center gap-3 mb-6 px-1">
              <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.4em]">Trigonometry</span>
              <div className="h-[1px] flex-1 bg-slate-100 dark:bg-slate-800"/>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[{label: 'sin', val: 'sin('}, {label: 'cos', val: 'cos('}, {label: 'tan', val: 'tan('}, {label: 'asin', val: 'asin('}, {label: 'acos', val: 'acos('}, {label: 'atan', val: 'atan('}, {label: 'sec', val: 'sec('}, {label: 'cosec', val: 'csc('}, {label: 'cot', val: 'cot('}, {label: 'asec', val: 'asec('}, {label: 'acosec', val: 'acsc('}, {label: 'acot', val: 'acot('}].map((f, i) => (
                <button key={i} onClick={() => insertFunction(f.val)} className="py-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 text-[13px] font-bold text-slate-600 dark:text-slate-300 hover:border-emerald-400 hover:text-emerald-600 transition-all active:scale-95 shadow-sm">{f.label}</button>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-6 px-1">
              <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.4em]">Hyperbolic</span>
              <div className="h-[1px] flex-1 bg-slate-100 dark:bg-slate-800"/>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[{label: 'sinh', val: 'sinh('}, {label: 'cosh', val: 'cosh('}, {label: 'tanh', val: 'tanh('}, {label: 'asinh', val: 'asinh('}, {label: 'acosh', val: 'acosh('}, {label: 'atanh', val: 'atanh('}, {label: 'sech', val: 'sech('}, {label: 'csch', val: 'csch('}, {label: 'coth', val: 'coth('}, {label: 'asech', val: 'asech('}, {label: 'acsch', val: 'acsch('}, {label: 'acoth', val: 'acoth('}].map((f, i) => (
                <button key={i} onClick={() => insertFunction(f.val)} className="py-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 text-[13px] font-bold text-slate-600 dark:text-slate-300 hover:border-emerald-400 hover:text-emerald-600 transition-all active:scale-95 shadow-sm">{f.label}</button>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-6 px-1">
              <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.4em]">Statistics</span>
              <div className="h-[1px] flex-1 bg-slate-100 dark:bg-slate-800"/>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[{label: 'nPr', val: ' P '}, {label: 'nCr', val: ' C '}, {label: 'mean', val: 'mean('}, {label: 'median', val: 'median('}, {label: 'std', val: 'std('}, {label: 'var', val: 'var('}].map((f, i) => (
                <button key={i} onClick={() => insertFunction(f.val)} className="py-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 text-[13px] font-bold text-slate-600 dark:text-slate-300 hover:border-emerald-400 hover:text-emerald-600 transition-all active:scale-95 shadow-sm">{f.label}</button>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-6 px-1">
              <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.4em]">Advanced Alg</span>
              <div className="h-[1px] flex-1 bg-slate-100 dark:bg-slate-800"/>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[{label: 'floor', val: 'floor('}, {label: 'ceil', val: 'ceil('}, {label: 'round', val: 'round('}, {label: 'exp', val: 'exp('}, {label: 'gamma', val: 'gamma('}, {label: 'to', val: ' to '}].map((f, i) => (
                <button key={i} onClick={() => insertFunction(f.val)} className="py-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 text-[13px] font-bold text-slate-600 dark:text-slate-300 hover:border-emerald-400 hover:text-emerald-600 transition-all active:scale-95 shadow-sm">{f.label}</button>
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
              <div className="w-14 h-14 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center"><Atom className="text-emerald-600 dark:text-emerald-400" size={24}/></div>
              <div><h3 className="font-black text-slate-900 dark:text-slate-100 text-base tracking-[0.2em] uppercase">Universal Constants</h3><p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest opacity-60">Emerald Collection</p></div>
            </div>
            <button onClick={() => setIsConstOpen(false)} className="p-4 text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all"><CloseIcon size={24}/></button>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-1 group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400"><Search size={18} /></div>
                <input type="text" placeholder="Symbol or name..." value={constSearch} onChange={(e) => setConstSearch(e.target.value)} className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-300 outline-none focus:border-emerald-400 dark:focus:border-emerald-600 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700"/>
              </div>
              <button onClick={() => setShowFilterMenu(!showFilterMenu)} className={`p-4 rounded-2xl border transition-all ${showFilterMenu ? 'bg-emerald-600 text-white border-emerald-500 shadow-md scale-95' : 'bg-slate-50 dark:bg-slate-950 text-slate-400 border-slate-100 dark:border-slate-800 hover:text-emerald-500'}`}><Filter size={20} /></button>
            </div>
            {showFilterMenu && (
              <div className="flex items-center gap-2 overflow-x-auto py-2 no-scrollbar animate-in slide-in-from-top-2 fade-in duration-300">
                 {(['All', 'Physics', 'Math', 'Earth/Eng'] as ConstantCategory[]).map(cat => (
                   <button key={cat} onClick={() => setConstCategory(cat)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all flex-shrink-0 ${constCategory === cat ? 'bg-emerald-600 text-white border-emerald-500 shadow-md' : 'bg-slate-50 dark:bg-slate-950 text-slate-400 border-slate-100 dark:border-slate-800 hover:text-emerald-500 hover:border-emerald-300'}`}>{cat}</button>
                 ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-8 no-scrollbar bg-slate-50/20 dark:bg-slate-950/20 pb-24">
          {filteredConstants.length === 0 ? (<div className="h-full flex flex-col items-center justify-center text-slate-200 dark:text-slate-800/40"><Search size={80} className="mb-8 stroke-[0.3px]"/><p className="text-xs font-black uppercase tracking-[0.5em]">No Constants Match</p></div>) : (<div className="grid grid-cols-4 sm:grid-cols-5 gap-3">{filteredConstants.map((c, idx) => (
            <div key={idx} className="group relative bg-white dark:bg-slate-900/40 aspect-square rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-emerald-400/40 dark:hover:border-emerald-600/40 transition-all hover:shadow-xl hover:shadow-emerald-500/5 overflow-hidden flex flex-col"><button onClick={() => { insertAtCursor(c.val); setIsConstOpen(false); }} className="w-full h-full flex items-center justify-center active:scale-90 transition-transform"><SymbolRenderer symbol={c.label} className="text-xl font-black text-slate-800 dark:text-emerald-400 font-serif" /></button><button onClick={(e) => { e.stopPropagation(); setDetailConst(c); }} className="absolute top-1 right-1 p-1 text-slate-200 hover:text-emerald-500 dark:text-slate-700 dark:hover:text-emerald-400 transition-colors opacity-0 group-hover:opacity-100"><Info size={12} /></button></div>
          ))}</div>)}
        </div>
      </div>
      {/* History Side Panel */}
      <div className={`fixed inset-y-0 right-0 w-full sm:w-[480px] bg-white dark:bg-slate-900 border-l border-slate-100 dark:border-slate-800 z-[110] transform transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] flex flex-col shadow-[-40px_0_80px_-20px_rgba(0,0,0,0.1)] ${isHistoryOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-10 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center"><Clock className="text-emerald-600 dark:text-emerald-400" size={24}/></div>
            <div><h3 className="font-black text-slate-900 dark:text-slate-100 text-base tracking-[0.2em] uppercase">Session Lab</h3><p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest opacity-60">Log Analysis</p></div>
          </div>
          <button onClick={() => setIsHistoryOpen(false)} className="p-4 text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all"><CloseIcon size={24}/></button>
        </div>
        <div className="flex-1 overflow-y-auto p-10 space-y-8 no-scrollbar bg-slate-50/20 dark:bg-slate-950/20 pb-24">
          {history.length === 0 ? (<div className="h-full flex flex-col items-center justify-center text-slate-200 dark:text-slate-800/40"><Calculator size={100} className="mb-8 stroke-[0.3px]"/><p className="text-xs font-black uppercase tracking-[0.5em]">No Data Logs</p></div>) : history.map((item, idx) => (
            <div key={idx} onClick={() => { setInput(item.expression); setIsHistoryOpen(false); }} className="group relative bg-white dark:bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 hover:border-emerald-400/40 dark:hover:border-emerald-600/40 transition-all cursor-pointer hover:shadow-2xl hover:shadow-emerald-500/5"><div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0"><ChevronRight size={18} className="text-emerald-500"/></div><div className="text-[11px] font-mono font-black text-slate-300 dark:text-slate-600 mb-4 truncate pr-12 uppercase tracking-tighter flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 group-hover:bg-emerald-400 transition-colors"/>{item.expression}</div><div className="text-2xl font-black text-slate-900 dark:text-emerald-400 font-mono tracking-tighter break-all leading-tight drop-shadow-sm">{item.result}</div>{item.isRoots && <div className="mt-5 flex items-center gap-2"><div className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase tracking-[0.2em] rounded-full border border-emerald-100/50 dark:border-emerald-900/30">Root Solving Log</div></div>}</div>
          ))}
        </div>
        {history.length > 0 && (<div className="p-10 border-t border-slate-50 dark:border-slate-800 bg-white dark:bg-slate-900 absolute bottom-0 left-0 right-0"><button onClick={() => setHistory([])} className="w-full py-5 rounded-[2rem] border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-red-50 dark:hover:bg-red-950/20 transition-all flex items-center justify-center gap-4"><Trash2 size={16}/> Wipe Entire Log</button></div>)}
      </div>
    </div>
  );
};
