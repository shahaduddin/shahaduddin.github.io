import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { CodeBlock } from './components/CodeBlock';
import { RootsDemo } from './components/demos/RootsDemo';
import { IntegrationDemo } from './components/demos/IntegrationDemo';
import { ODEDemo } from './components/demos/ODEDemo';
import { InterpolationDemo } from './components/demos/InterpolationDemo';
import { LinearSystemDemo } from './components/demos/LinearSystemDemo';
import { DifferentiationDemo } from './components/demos/DifferentiationDemo';
import { TheoryView } from './components/TheoryView';
import { ChatBot } from './components/ChatBot';
import { AlgorithmType, TopicCategory } from './types';
import { PYTHON_SNIPPETS, FORTRAN_SNIPPETS } from './constants';
import { Info, Code, FileCode, BookOpen, Menu, Layers } from 'lucide-react';

const App: React.FC = () => {
  const [currentAlgo, setCurrentAlgo] = useState<AlgorithmType>(AlgorithmType.BISECTION);
  const [activeTab, setActiveTab] = useState<'demo' | 'code' | 'theory'>('demo');
  const [codeLang, setCodeLang] = useState<'python' | 'fortran'>('python');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderContent = () => {
    if (activeTab === 'theory') {
      return <TheoryView algorithm={currentAlgo} />;
    }

    if (activeTab === 'code') {
      return (
        <div className="space-y-4 animate-in fade-in duration-300">
           <div className="flex items-center justify-between bg-white border border-slate-200 rounded-t-xl px-4 py-3 shadow-sm">
             <div className="flex gap-2">
                <button 
                  onClick={() => setCodeLang('python')}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${codeLang === 'python' ? 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
                >
                  Python
                </button>
                <button 
                   onClick={() => setCodeLang('fortran')}
                   className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${codeLang === 'fortran' ? 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
                >
                  Fortran
                </button>
             </div>
             <span className="text-xs text-slate-400 uppercase font-mono hidden sm:inline bg-slate-50 px-2 py-1 rounded border border-slate-100">
               {currentAlgo.replace(/\s/g, '_').toUpperCase()}.{codeLang === 'python' ? 'PY' : 'F90'}
             </span>
           </div>
           
           <CodeBlock 
              code={codeLang === 'python' ? PYTHON_SNIPPETS[currentAlgo] : FORTRAN_SNIPPETS[currentAlgo]} 
              language={codeLang}
           />

           <div className="bg-emerald-50 border border-emerald-100 text-emerald-900 p-4 rounded-b-xl flex gap-3 shadow-sm">
              <FileCode className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-sm leading-relaxed">
               {codeLang === 'python' 
                 ? "Standard Python 3 implementation using native libraries or NumPy where appropriate."
                 : "Standard Fortran 90 implementation. Compile with gfortran."}
             </p>
           </div>
         </div>
      );
    }

    // Demo View
    switch (currentAlgo) {
      case AlgorithmType.BISECTION:
      case AlgorithmType.FALSE_POSITION:
      case AlgorithmType.NEWTON_RAPHSON:
      case AlgorithmType.SECANT:
      case AlgorithmType.FIXED_POINT_ITERATION:
        return <RootsDemo type={currentAlgo} />;
      case AlgorithmType.GAUSSIAN:
      case AlgorithmType.GAUSS_JORDAN:
      case AlgorithmType.JACOBI:
      case AlgorithmType.GAUSS_SEIDEL:
      case AlgorithmType.LU_DECOMPOSITION:
      case AlgorithmType.CHOLESKY_DECOMPOSITION:
      case AlgorithmType.QR_DECOMPOSITION:
      case AlgorithmType.MATRIX_INVERSE:
      case AlgorithmType.MATRIX_DETERMINANT:
      case AlgorithmType.MATRIX_TRANSPOSE:
      case AlgorithmType.MATRIX_ADDITION:
      case AlgorithmType.MATRIX_SUBTRACTION:
      case AlgorithmType.MATRIX_MULTIPLICATION:
        return <LinearSystemDemo type={currentAlgo} />;
      case AlgorithmType.LAGRANGE:
      case AlgorithmType.NEWTON_DIVIDED_DIFFERENCE:
      case AlgorithmType.LINEAR_SPLINE:
      case AlgorithmType.QUADRATIC_SPLINE:
      case AlgorithmType.CUBIC_SPLINE:
      case AlgorithmType.NEWTON_FORWARD_DIFFERENCE:
      case AlgorithmType.NEWTON_BACKWARD_DIFFERENCE:
      case AlgorithmType.GAUSS_FORWARD_INTERPOLATION:
      case AlgorithmType.GAUSS_BACKWARD_INTERPOLATION:
        return <InterpolationDemo type={currentAlgo} />;
      case AlgorithmType.SIMPSON:
      case AlgorithmType.TRAPEZOIDAL:
        return <IntegrationDemo type={currentAlgo} />;
      case AlgorithmType.FORWARD_DIFFERENCE:
      case AlgorithmType.BACKWARD_DIFFERENCE:
      case AlgorithmType.CENTRAL_DIFFERENCE:
      case AlgorithmType.SECOND_DERIVATIVE_CENTRAL:
        return <DifferentiationDemo type={currentAlgo} />;
      case AlgorithmType.EULER:
      case AlgorithmType.RK4:
        return <ODEDemo type={currentAlgo} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400 bg-white rounded-xl border border-slate-200 shadow-sm">
            <Info className="w-12 h-12 mb-4 opacity-30 text-slate-400" />
            <p>Interactive demo for {currentAlgo} is under construction.</p>
          </div>
        );
    }
  };

  const TabButton = ({ id, label, icon: Icon }: { id: typeof activeTab, label: string, icon: any }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`
        flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
        ${activeTab === id 
          ? 'bg-white text-emerald-700 shadow-sm ring-1 ring-slate-200' 
          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'}
      `}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden">
      <Sidebar 
        currentAlgorithm={currentAlgo} 
        onSelect={setCurrentAlgo} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <main className="flex-1 flex flex-col min-0 relative">
        {/* Navigation Header - Sticky */}
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm transition-all duration-200">
          <header className="h-16 flex items-center justify-between px-4 md:px-8">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden p-2 -ml-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors shrink-0"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="overflow-hidden min-w-0">
                <h2 className="text-lg md:text-xl font-bold text-slate-800 truncate leading-tight">{currentAlgo}</h2>
                <p className="text-slate-500 text-[10px] md:text-xs hidden sm:block truncate">Numerical Analysis Algorithm Explorer</p>
              </div>
            </div>
            
            {/* Desktop Tabs */}
            <div className="hidden md:flex bg-slate-100 rounded-lg p-1 border border-slate-200 shrink-0 gap-1">
               <button 
                 onClick={() => setActiveTab('demo')}
                 className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                   activeTab === 'demo' ? 'bg-white text-emerald-700 shadow-sm ring-1 ring-black/5' : 'text-slate-500 hover:text-slate-700'
                 }`}
               >
                 <Layers className="w-4 h-4" />
                 Demo
               </button>
               <button 
                 onClick={() => setActiveTab('theory')}
                 className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                   activeTab === 'theory' ? 'bg-white text-emerald-700 shadow-sm ring-1 ring-black/5' : 'text-slate-500 hover:text-slate-700'
                 }`}
               >
                 <BookOpen className="w-4 h-4" />
                 Theory
               </button>
               <button 
                 onClick={() => setActiveTab('code')}
                 className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                   activeTab === 'code' ? 'bg-white text-emerald-700 shadow-sm ring-1 ring-black/5' : 'text-slate-500 hover:text-slate-700'
                 }`}
               >
                 <Code className="w-4 h-4" />
                 Code
               </button>
            </div>
          </header>

          {/* Mobile Tabs - Separated Row */}
          <div className="md:hidden px-4 pb-3 animate-in slide-in-from-top-2 duration-200">
             <div className="flex bg-slate-100/80 p-1 rounded-lg border border-slate-200">
               <TabButton id="demo" label="Demo" icon={Layers} />
               <TabButton id="theory" label="Theory" icon={BookOpen} />
               <TabButton id="code" label="Code" icon={Code} />
             </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar bg-slate-50/50">
          <div className="max-w-6xl mx-auto pb-24 md:pb-8">
             <div className={`transition-all duration-300 ${activeTab === 'theory' ? '' : 'bg-white/50 backdrop-blur-sm border border-white/50 shadow-sm rounded-2xl p-0'}`}>
               {renderContent()}
             </div>
          </div>
        </div>
      </main>

      <ChatBot currentAlgo={currentAlgo} />
    </div>
  );
};

export default App;
