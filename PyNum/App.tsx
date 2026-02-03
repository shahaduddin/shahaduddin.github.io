import React, { useState, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, Navigate, useParams, useNavigate, useLocation, Link, Outlet } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { CodeBlock } from './components/CodeBlock';
import { RootsDemo } from './components/demos/RootsDemo';
import { IntegrationDemo } from './components/demos/IntegrationDemo';
import { ODEDemo } from './components/demos/ODEDemo';
import { InterpolationDemo } from './components/demos/InterpolationDemo';
import { LinearSystemDemo } from './components/demos/LinearSystemDemo';
import { DifferentiationDemo } from './components/demos/DifferentiationDemo';
import { CalculatorTool } from './components/CalculatorTool';
import { GraphTool } from './components/GraphTool';
import { TheoryView } from './components/TheoryView';
import { DocsView } from './components/DocsView';
import { ChatBot } from './components/ChatBot';
import { Home } from './components/Home';
import { AlgorithmType, CodeLanguage, TopicCategory } from './types';
import { PYTHON_SNIPPETS, FORTRAN_SNIPPETS, CPP_SNIPPETS } from './constants';
import { Info, Code, BookOpen, Menu, Layers, Terminal, Sparkles, Settings, Sun, Moon, Check, ChevronRight } from 'lucide-react';

// Helper to slugify algorithm names for URLs with safety guard
export const slugify = (text: string) => {
  if (!text) return '';
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

// Reverse mapping for navigation logic
export const ALGO_TO_CATEGORY: Record<AlgorithmType, TopicCategory> = {
  [AlgorithmType.INCREMENTAL_SEARCH]: TopicCategory.ROOTS,
  [AlgorithmType.BISECTION]: TopicCategory.ROOTS,
  [AlgorithmType.FALSE_POSITION]: TopicCategory.ROOTS,
  [AlgorithmType.NEWTON_RAPHSON]: TopicCategory.ROOTS,
  [AlgorithmType.SECANT]: TopicCategory.ROOTS,
  [AlgorithmType.FIXED_POINT_ITERATION]: TopicCategory.ROOTS,
  [AlgorithmType.MULLER]: TopicCategory.ROOTS,
  [AlgorithmType.GAUSSIAN]: TopicCategory.LINEAR,
  [AlgorithmType.GAUSS_JORDAN]: TopicCategory.LINEAR,
  [AlgorithmType.JACOBI]: TopicCategory.LINEAR,
  [AlgorithmType.GAUSS_SEIDEL]: TopicCategory.LINEAR,
  [AlgorithmType.LU_DECOMPOSITION]: TopicCategory.LINEAR,
  [AlgorithmType.CHOLESKY_DECOMPOSITION]: TopicCategory.LINEAR,
  [AlgorithmType.QR_DECOMPOSITION]: TopicCategory.LINEAR,
  [AlgorithmType.MATRIX_INVERSE]: TopicCategory.MATRIX_OPS,
  [AlgorithmType.MATRIX_DETERMINANT]: TopicCategory.MATRIX_OPS,
  [AlgorithmType.MATRIX_TRANSPOSE]: TopicCategory.MATRIX_OPS,
  [AlgorithmType.MATRIX_ADDITION]: TopicCategory.MATRIX_OPS,
  [AlgorithmType.MATRIX_SUBTRACTION]: TopicCategory.MATRIX_OPS,
  [AlgorithmType.MATRIX_MULTIPLICATION]: TopicCategory.MATRIX_OPS,
  [AlgorithmType.LAGRANGE]: TopicCategory.INTERPOLATION,
  [AlgorithmType.NEWTON_DIVIDED_DIFFERENCE]: TopicCategory.INTERPOLATION,
  [AlgorithmType.LINEAR_SPLINE]: TopicCategory.INTERPOLATION,
  [AlgorithmType.QUADRATIC_SPLINE]: TopicCategory.INTERPOLATION,
  [AlgorithmType.CUBIC_SPLINE]: TopicCategory.INTERPOLATION,
  [AlgorithmType.NEWTON_FORWARD_DIFFERENCE]: TopicCategory.INTERPOLATION,
  [AlgorithmType.NEWTON_BACKWARD_DIFFERENCE]: TopicCategory.INTERPOLATION,
  [AlgorithmType.GAUSS_FORWARD_INTERPOLATION]: TopicCategory.INTERPOLATION,
  [AlgorithmType.GAUSS_BACKWARD_INTERPOLATION]: TopicCategory.INTERPOLATION,
  [AlgorithmType.FORWARD_DIFFERENCE]: TopicCategory.DIFFERENTIATION,
  [AlgorithmType.BACKWARD_DIFFERENCE]: TopicCategory.DIFFERENTIATION,
  [AlgorithmType.CENTRAL_DIFFERENCE]: TopicCategory.DIFFERENTIATION,
  [AlgorithmType.SECOND_DERIVATIVE_CENTRAL]: TopicCategory.DIFFERENTIATION,
  [AlgorithmType.TRAPEZOIDAL]: TopicCategory.INTEGRATION,
  [AlgorithmType.SIMPSON]: TopicCategory.INTEGRATION,
  [AlgorithmType.EULER]: TopicCategory.ODE,
  [AlgorithmType.RK4]: TopicCategory.ODE,
};

// Map slug back to AlgorithmType
const getAlgoFromSlug = (slug: string): AlgorithmType | undefined => {
  if (!slug) return undefined;
  return Object.values(AlgorithmType).find(algo => slugify(algo) === slug);
};

const AlgorithmLayout: React.FC = () => {
  const { categorySlug, algoSlug, tabSlug } = useParams();
  const navigate = useNavigate();
  const currentAlgo = getAlgoFromSlug(algoSlug || '') || AlgorithmType.BISECTION;
  const activeTab = (tabSlug as 'demo' | 'code' | 'theory') || 'demo';
  const [codeLang, setCodeLang] = useState<CodeLanguage>('python');

  const changeTab = (tab: string) => {
    navigate(`/${categorySlug}/${algoSlug}/${tab}`);
  };

  const renderContent = () => {
    if (activeTab === 'theory') {
      return <TheoryView algorithm={currentAlgo} />;
    }

    if (activeTab === 'code') {
      const getSnippet = () => {
        if (codeLang === 'python') return PYTHON_SNIPPETS[currentAlgo];
        if (codeLang === 'fortran') return FORTRAN_SNIPPETS[currentAlgo];
        return CPP_SNIPPETS[currentAlgo];
      };

      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-5xl mx-auto">
           <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-1.5 p-1 bg-slate-200/50 dark:bg-slate-800/50 rounded-xl w-fit border border-slate-200 dark:border-slate-700 shadow-inner">
                {(['python', 'fortran', 'cpp'] as CodeLanguage[]).map(lang => (
                  <button 
                    key={lang}
                    onClick={() => setCodeLang(lang)}
                    className={`px-3 md:px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                      codeLang === lang 
                      ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-sm border border-slate-200 dark:border-slate-600' 
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
              <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
                <Terminal className="w-3.5 h-3.5" /> 
                <span className="hidden sm:inline">Reference Implementation</span>
              </div>
           </div>
           
           <CodeBlock 
              code={getSnippet()} 
              language={codeLang}
              algorithmName={currentAlgo}
           />
         </div>
      );
    }

    switch (currentAlgo) {
      case AlgorithmType.INCREMENTAL_SEARCH:
      case AlgorithmType.BISECTION:
      case AlgorithmType.FALSE_POSITION:
      case AlgorithmType.NEWTON_RAPHSON:
      case AlgorithmType.SECANT:
      case AlgorithmType.FIXED_POINT_ITERATION:
      case AlgorithmType.MULLER:
        return <RootsDemo type={currentAlgo} />;
      case AlgorithmType.SIMPSON:
      case AlgorithmType.TRAPEZOIDAL:
        return <IntegrationDemo type={currentAlgo} />;
      case AlgorithmType.EULER:
      case AlgorithmType.RK4:
        return <ODEDemo type={currentAlgo} />;
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
      case AlgorithmType.FORWARD_DIFFERENCE:
      case AlgorithmType.BACKWARD_DIFFERENCE:
      case AlgorithmType.CENTRAL_DIFFERENCE:
      case AlgorithmType.SECOND_DERIVATIVE_CENTRAL:
        return <DifferentiationDemo type={currentAlgo} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400 dark:text-slate-600 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
            <Info className="w-12 h-12 mb-4 opacity-10" />
            <p className="text-sm font-medium uppercase tracking-widest text-slate-300 dark:text-slate-700">Module in Development</p>
          </div>
        );
    }
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto custom-scrollbar relative bg-slate-50/50 dark:bg-slate-950/50 transition-colors">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
          <div className="pb-36">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Central Mode Switcher */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 w-full px-4 max-w-sm pointer-events-none transition-all">
        <div className="flex bg-white/80 dark:bg-slate-900/95 backdrop-blur-2xl p-1.5 rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 pointer-events-auto ring-1 ring-black/5 w-full transition-colors">
          <ModeButton 
            active={activeTab === 'demo'} 
            onClick={() => changeTab('demo')} 
            icon={Layers} 
            label="Sim" 
          />
          <ModeButton 
            active={activeTab === 'theory'} 
            onClick={() => changeTab('theory')} 
            icon={BookOpen} 
            label="Theory" 
          />
          <ModeButton 
            active={activeTab === 'code'} 
            onClick={() => changeTab('code')} 
            icon={Code} 
            label="Code" 
          />
        </div>
      </div>
    </>
  );
};

const MainLayout: React.FC = () => {
  const location = useLocation();
  const isCalculator = location.pathname.includes('/tools/calculator');
  const isGrapher = location.pathname.includes('/tools/grapher');
  const isDocs = location.pathname.includes('/docs');
  const isUtility = isCalculator || isGrapher || isDocs;
  
  // Extract slugs from the URL path with safety guard
  const pathParts = (location.pathname || '').split('/').filter(Boolean);
  const activeCategorySlug = pathParts[0];
  const activeAlgoSlug = pathParts[1];
  
  const currentAlgo = getAlgoFromSlug(activeAlgoSlug || '') || AlgorithmType.BISECTION;
  const currentCategory = ALGO_TO_CATEGORY[currentAlgo];
  
  useEffect(() => {
    if (isCalculator) document.title = 'Scientific Calculator';
    else if (isGrapher) document.title = 'Function Grapher';
    else if (isDocs) document.title = 'Studio Documentation';
    else document.title = `${currentAlgo} - PyNumAnalysis Studio`;
  }, [currentAlgo, isCalculator, isGrapher, isDocs]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  });
  
  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden relative selection:bg-emerald-100 selection:text-emerald-900 dark:selection:bg-emerald-900 dark:selection:text-emerald-100">
      <Sidebar 
        currentAlgorithm={currentAlgo} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <main className="flex-1 flex flex-col min-w-0 h-full relative">
        <header className="h-14 px-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between z-30 shrink-0 transition-colors shadow-sm">
          <div className="flex items-center gap-3 min-w-0">
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="md:hidden p-1.5 text-slate-500 dark:text-slate-400 hover:text-emerald-600 bg-slate-50 dark:bg-slate-800 rounded-lg transition-all border border-transparent hover:border-emerald-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 min-w-0">
              <div className="hidden sm:flex w-8 h-8 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg items-center justify-center font-black border border-emerald-100 dark:border-emerald-800">Σ</div>
              <div className="flex items-center gap-1.5 overflow-hidden">
                {isCalculator ? (
                   <h2 className="text-sm md:text-base font-black text-slate-900 dark:text-slate-100 tracking-tight">Scientific Calculator</h2>
                ) : isGrapher ? (
                   <h2 className="text-sm md:text-base font-black text-slate-900 dark:text-slate-100 tracking-tight">Function Grapher</h2>
                ) : isDocs ? (
                   <h2 className="text-sm md:text-base font-black text-slate-900 dark:text-slate-100 tracking-tight">Studio Documentation</h2>
                ) : (
                  <>
                    {currentCategory && (
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[10px] font-black text-slate-400 uppercase hidden sm:inline tracking-tighter">
                          {currentCategory}
                        </span>
                        <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-700 hidden sm:inline" />
                      </div>
                    )}
                    <h2 className="text-sm md:text-base font-black text-slate-900 dark:text-slate-100 tracking-tight truncate">
                      {currentAlgo}
                    </h2>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
             {/* Desktop-only Docs link in header */}
             <Link 
              to="/docs/manual"
              className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${isDocs ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'}`}
             >
                <BookOpen className="w-4 h-4" />
                <span>Manual</span>
             </Link>
             
             <div className="relative" ref={settingsRef}>
               <button 
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className={`p-1.5 rounded-lg transition-all ${isSettingsOpen ? 'bg-slate-100 dark:bg-slate-800 text-emerald-600' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
               >
                 <Settings className="w-4 h-4" />
               </button>
               
               {isSettingsOpen && (
                 <>
                   {/* Backdrop for settings */}
                   <div className="fixed inset-0 z-[90]" onClick={() => setIsSettingsOpen(false)} />
                   <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl z-[100] py-2 animate-in zoom-in-95 origin-top-right overflow-hidden transition-colors">
                      <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Settings</span>
                      </div>
                      
                      <div className="px-2 space-y-1">
                         <button 
                          onClick={() => setTheme('light')}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-all ${theme === 'light' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                         >
                           <div className="flex items-center gap-3">
                             <Sun className="w-3.5 h-3.5" /> Light Mode
                           </div>
                           {theme === 'light' && <Check className="w-3.5 h-3.5" />}
                         </button>
                         
                         <button 
                          onClick={() => setTheme('dark')}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-all ${theme === 'dark' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                         >
                           <div className="flex items-center gap-3">
                             <Moon className="w-3.5 h-3.5" /> Dark Mode
                           </div>
                           {theme === 'dark' && <Check className="w-3.5 h-3.5" />}
                         </button>
                      </div>
                   </div>
                 </>
               )}
             </div>
          </div>
        </header>

        <Outlet />

        {/* Floating AI Tutor Button */}
        {!isUtility && (
          <div className="fixed bottom-24 right-6 md:bottom-6 md:right-6 z-40 pointer-events-none">
            <button 
              onClick={() => setIsChatOpen(true)}
              title="Ask AI Tutor"
              className="pointer-events-auto flex items-center justify-center w-14 h-14 bg-emerald-600 text-white rounded-full shadow-2xl shadow-emerald-600/40 hover:bg-emerald-500 hover:-translate-y-1 transition-all group border border-emerald-500/50 active:scale-90"
            >
              <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            </button>
          </div>
        )}
      </main>

      <ChatBot 
        currentAlgo={currentAlgo} 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<MainLayout />}>
          <Route path="/tools/calculator" element={<CalculatorTool />} />
          <Route path="/tools/grapher" element={<GraphTool />} />
          <Route path="/docs/manual" element={<DocsWrapper />} />
          <Route path="/:categorySlug/:algoSlug" element={<Navigate to="demo" replace />} />
          <Route path="/:categorySlug/:algoSlug/:tabSlug" element={<AlgorithmLayout />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

// Wrapper to ensure layout consistency for docs
const DocsWrapper: React.FC = () => (
  <div className="flex-1 overflow-y-auto custom-scrollbar relative bg-slate-50/50 dark:bg-slate-950/50 transition-colors">
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <DocsView />
    </div>
  </div>
);

interface ModeButtonProps {
  active: boolean;
  onClick: () => void;
  icon: any;
  label: string;
}

const ModeButton: React.FC<ModeButtonProps> = ({ active, onClick, icon: Icon, label }) => (
  <button 
    onClick={onClick} 
    className={`
      flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all duration-300
      ${active 
        ? 'bg-emerald-500 text-white shadow-lg' 
        : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-emerald-50 dark:hover:bg-white/5'
      }
    `}
  >
    <Icon className="w-4 h-4" />
    <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

export default App;