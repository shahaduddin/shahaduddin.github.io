import React from 'react';
import { Copy, Download, Terminal, Info, Check } from 'lucide-react';
import { AlgorithmType, CodeLanguage } from '../types';

interface CodeBlockProps {
  code: string;
  language: CodeLanguage;
  algorithmName: AlgorithmType;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language, algorithmName }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadSource = () => {
    const extensions: Record<CodeLanguage, string> = { python: 'py', fortran: 'f90', cpp: 'cpp' };
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${algorithmName.toLowerCase().replace(/\s/g, '_')}.${extensions[language]}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const lines = code.split('\n');

  return (
    <div className="flex flex-col rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none group transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between px-3 sm:px-6 py-3 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
          </div>
          <div className="hidden sm:block h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1"></div>
          <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <Terminal className="w-3 h-3" />
            <span className="hidden sm:inline">{language} runtime environment</span>
            <span className="sm:hidden">{language}</span>
          </span>
        </div>
        
        <div className="flex items-center gap-2">
           <button 
            onClick={downloadSource}
            className="flex items-center gap-2 px-2 sm:px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg transition-all hover:border-emerald-200 dark:hover:border-emerald-900 active:scale-95 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download</span>
          </button>
          <button 
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 sm:px-4 py-1.5 text-xs font-bold text-white bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 rounded-lg transition-all active:scale-95 shadow-lg shadow-slate-900/10 min-w-[80px] justify-center"
          >
            {copied ? (
              <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Copied</span></span>
            ) : (
              <><Copy className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Copy</span></>
            )}
          </button>
        </div>
      </div>

      {/* Code Area */}
      <div className="flex relative bg-[#0f172a] font-mono text-sm leading-relaxed overflow-x-auto min-h-[300px]">
        {/* Line Numbers */}
        <div className="select-none py-6 px-3 sm:px-4 bg-slate-900/50 border-r border-slate-800/50 text-slate-600 text-right min-w-[40px] sm:min-w-[50px] text-xs">
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        
        {/* Actual Code */}
        <pre className="py-6 px-4 sm:px-6 text-slate-300 w-full overflow-x-auto custom-scrollbar text-[13px] sm:text-sm">
          <code>{code}</code>
        </pre>
      </div>

      {/* Footer Info */}
      <div className="px-4 sm:px-6 py-4 bg-emerald-50 dark:bg-emerald-900/10 border-t border-emerald-100 dark:border-emerald-900/30 flex items-center gap-3">
         <div className="w-7 h-7 sm:w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
            <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
         </div>
         <p className="text-[10px] sm:text-[11px] text-emerald-800 dark:text-emerald-400 font-medium leading-tight">
           {language === 'python' && "Requires Python 3.x. Standard library used for maximum compatibility."}
           {language === 'fortran' && "Standard F90+ code. Compile with 'gfortran' or similar compilers."}
           {language === 'cpp' && "Requires a C++11 or higher compliant compiler (e.g., g++, clang++)."}
         </p>
      </div>
    </div>
  );
};