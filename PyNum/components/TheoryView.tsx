import React from 'react';
import { AlgorithmType, TheoryData } from '../types';
import { THEORY_CONTENT } from '../constants';
import { BookOpen, CheckCircle2, AlertTriangle, ArrowRight, Sigma } from 'lucide-react';

interface TheoryViewProps {
  algorithm: AlgorithmType;
}

export const TheoryView: React.FC<TheoryViewProps> = ({ algorithm }) => {
  const data: TheoryData = THEORY_CONTENT[algorithm];

  if (!data) {
    return <div className="text-slate-500 p-8 text-center">Theory content not available for this algorithm.</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header */}
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600">
            <BookOpen className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              {data.title}
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              {data.concept}
            </p>
          </div>
        </div>
      </div>

      {/* Formula Section */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
            <Sigma className="w-24 h-24 text-slate-900" />
        </div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            Formula & Syntax
        </h3>
        <div className="bg-slate-50 rounded-xl p-8 flex justify-center items-center overflow-x-auto border border-slate-100">
          <code className="text-xl md:text-2xl font-mono text-emerald-700 font-medium">
            {data.formula}
          </code>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Convergence */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
             <AlertTriangle className="w-4 h-4 text-amber-500" />
             <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                Convergence & Stability
             </h3>
          </div>
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm h-full hover:border-amber-200 transition-colors">
            <p className="text-slate-600 leading-relaxed">
              {data.convergence}
            </p>
          </div>
        </div>

        {/* Algorithm Steps */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <CheckCircle2 className="w-4 h-4 text-blue-500" />
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
               Algorithm Steps
            </h3>
          </div>
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:border-blue-200 transition-colors">
            <ul className="space-y-4">
              {data.steps.map((step, idx) => (
                <li key={idx} className="flex gap-3 text-slate-600 text-sm">
                  <div className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[10px] font-bold">
                      {idx + 1}
                  </div>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};