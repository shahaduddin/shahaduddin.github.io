import React from 'react';
import { AlgorithmType, TheoryData } from '../types';
import { THEORY_CONTENT } from '../constants';
import { 
  FileText, Download, Sigma, ListChecks, 
  ChevronRight, ArrowRight, Info
} from 'lucide-react';

interface TheoryViewProps {
  algorithm: AlgorithmType;
}

export const TheoryView: React.FC<TheoryViewProps> = ({ algorithm }) => {
  const data: TheoryData = THEORY_CONTENT[algorithm];

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-600 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
        <FileText className="w-12 h-12 mb-4 opacity-10" />
        <p className="font-bold uppercase text-[10px] tracking-widest">Theoretical Data Pending</p>
      </div>
    );
  }

  // Path logic based on PyNum/PDF/ directory
  const getPdfPath = () => {
    const fileName = data.title.replace(/\s+/g, '_') + '.pdf';
    return `/PDF/${fileName}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-4xl mx-auto px-2">
      
      {/* Simplified Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-10 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden transition-colors">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <nav className="flex items-center gap-2 text-emerald-600 dark:text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-4">
              <span>Theory Module</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-slate-400 dark:text-slate-600">Core Concepts</span>
            </nav>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight mb-3">
              {data.title}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed max-w-2xl">
              {data.concept}
            </p>
          </div>
          
          <a 
            href={getPdfPath()}
            download
            className="flex items-center justify-center gap-3 bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white px-6 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-xl shadow-slate-900/10 active:scale-95 shrink-0"
          >
            <Download className="w-4 h-4" />
            Download Full PDF
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Mathematical Foundation */}
        <section className="bg-slate-900 dark:bg-black rounded-3xl p-6 md:p-8 border border-slate-800 shadow-2xl relative group overflow-hidden transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Sigma className="w-32 h-32 text-white" />
          </div>
          <h3 className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
            Primary Formula
          </h3>
          <div className="bg-slate-800/40 dark:bg-slate-900/40 rounded-2xl p-8 flex justify-center items-center overflow-x-auto border border-white/5 backdrop-blur-sm">
            <code className="text-xl md:text-2xl font-mono text-emerald-300 font-bold text-center break-all">
              {data.formula}
            </code>
          </div>
        </section>

        {/* Simplified Procedure List */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
           <h3 className="text-slate-900 dark:text-slate-100 text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
             <ListChecks className="w-4 h-4 text-emerald-600" />
             Implementation Steps
           </h3>
           <div className="space-y-3">
              {data.steps.map((step, idx) => (
                <div key={idx} className="flex gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 transition-colors">
                  <span className="shrink-0 w-8 h-8 rounded-lg bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-sm shadow-sm border border-slate-200 dark:border-slate-600">
                    {idx + 1}
                  </span>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed pt-1.5 font-medium">
                    {step}
                  </p>
                </div>
              ))}
           </div>
        </section>

        {/* Convergence Quick Note */}
        <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30 p-5 rounded-2xl flex gap-3 items-center">
          <Info className="w-5 h-5 text-emerald-600 dark:text-emerald-500 shrink-0" />
          <p className="text-xs text-emerald-800 dark:text-emerald-400 font-bold italic uppercase tracking-tight">
            <span className="opacity-60 mr-2 underline decoration-emerald-200">Convergence Stability:</span> 
            {data.convergence}
          </p>
        </div>
      </div>
    </div>
  );
};