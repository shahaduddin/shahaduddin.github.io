import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { TopicCategory, AlgorithmType } from '../types';
import { Beaker, BookOpen, GitGraph, TrendingUp, Calculator, Activity, Terminal, X, Grid3X3, Scissors, ChevronRight } from 'lucide-react';
import { slugify, ALGO_TO_CATEGORY } from '../App';

interface SidebarProps {
  currentAlgorithm: AlgorithmType;
  isOpen: boolean;
  onClose: () => void;
}

type CategoryItem = AlgorithmType | { title: string; items: AlgorithmType[] };

interface CategoryDef {
  name: TopicCategory;
  icon: any;
  items: CategoryItem[];
}

const CATEGORIES: CategoryDef[] = [
  {
    name: TopicCategory.ROOTS,
    icon: Beaker,
    items: [
      {
        title: "Root Location",
        items: [AlgorithmType.INCREMENTAL_SEARCH]
      },
      {
        title: "Bracketing Methods",
        items: [AlgorithmType.BISECTION, AlgorithmType.FALSE_POSITION]
      },
      {
        title: "Open Methods",
        items: [AlgorithmType.NEWTON_RAPHSON, AlgorithmType.SECANT, AlgorithmType.FIXED_POINT_ITERATION, AlgorithmType.MULLER]
      }
    ]
  },
  {
    name: TopicCategory.LINEAR,
    icon: GitGraph,
    items: [
      {
        title: "Matrix Decompositions",
        items: [AlgorithmType.LU_DECOMPOSITION, AlgorithmType.CHOLESKY_DECOMPOSITION, AlgorithmType.QR_DECOMPOSITION]
      },
      {
        title: "Direct Solvers",
        items: [AlgorithmType.GAUSSIAN, AlgorithmType.GAUSS_JORDAN]
      },
      {
        title: "Iterative Solvers",
        items: [AlgorithmType.JACOBI, AlgorithmType.GAUSS_SEIDEL]
      }
    ]
  },
  {
    name: TopicCategory.MATRIX_OPS,
    icon: Grid3X3,
    items: [
      AlgorithmType.MATRIX_ADDITION,
      AlgorithmType.MATRIX_SUBTRACTION,
      AlgorithmType.MATRIX_MULTIPLICATION,
      AlgorithmType.MATRIX_TRANSPOSE,
      AlgorithmType.MATRIX_INVERSE,
      AlgorithmType.MATRIX_DETERMINANT
    ]
  },
  {
    name: TopicCategory.INTERPOLATION,
    icon: TrendingUp,
    items: [
      {
        title: "Polynomial",
        items: [AlgorithmType.LAGRANGE, AlgorithmType.NEWTON_DIVIDED_DIFFERENCE]
      },
      {
        title: "Splines",
        items: [AlgorithmType.LINEAR_SPLINE, AlgorithmType.QUADRATIC_SPLINE, AlgorithmType.CUBIC_SPLINE]
      },
      {
        title: "Evenly Spaced",
        items: [AlgorithmType.NEWTON_FORWARD_DIFFERENCE, AlgorithmType.NEWTON_BACKWARD_DIFFERENCE]
      }
    ]
  },
  {
    name: TopicCategory.DIFFERENTIATION,
    icon: Scissors,
    items: [
      AlgorithmType.FORWARD_DIFFERENCE,
      AlgorithmType.BACKWARD_DIFFERENCE,
      AlgorithmType.CENTRAL_DIFFERENCE,
      AlgorithmType.SECOND_DERIVATIVE_CENTRAL
    ]
  },
  {
    name: TopicCategory.INTEGRATION,
    icon: Calculator,
    items: [AlgorithmType.TRAPEZOIDAL, AlgorithmType.SIMPSON]
  },
  {
    name: TopicCategory.ODE,
    icon: Activity,
    items: [AlgorithmType.EULER, AlgorithmType.RK4]
  }
];

export const Sidebar: React.FC<SidebarProps> = ({ currentAlgorithm, isOpen, onClose }) => {
  const location = useLocation();
  const currentTab = location.pathname.split('/')[3] || 'demo';

  const renderItem = (item: CategoryItem) => {
    if (typeof item === 'object') {
       return (
         <div key={item.title} className="mb-4">
            <div className="px-4 py-1.5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <ChevronRight className="w-2.5 h-2.5 text-slate-300 dark:text-slate-700" />
              {item.title}
            </div>
            <div className="mt-1 space-y-1">
              {item.items.map(algo => {
                const category = ALGO_TO_CATEGORY[algo];
                return (
                  <Link
                    key={algo}
                    to={`/${slugify(category)}/${slugify(algo)}/${currentTab}`}
                    onClick={onClose}
                    className={`block w-full text-left px-8 py-2 text-[13px] font-semibold transition-all border-l-2 ${
                      currentAlgorithm === algo
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-500'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 border-transparent hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    {algo}
                  </Link>
                );
              })}
            </div>
         </div>
       );
    }
    
    const category = ALGO_TO_CATEGORY[item];
    return (
      <Link
        key={item}
        to={`/${slugify(category)}/${slugify(item)}/${currentTab}`}
        onClick={onClose}
        className={`block w-full text-left px-4 py-2 text-[13px] font-semibold transition-all border-l-2 ${
          currentAlgorithm === item
            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-500'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 border-transparent hover:text-slate-900 dark:hover:text-slate-200'
        }`}
      >
        {item}
      </Link>
    );
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800
        transform transition-transform duration-300 ease-in-out flex flex-col h-full
        md:relative md:translate-x-0
        ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 shrink-0">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 rounded-lg flex items-center justify-center border border-emerald-100 dark:border-slate-700 shadow-sm transition-colors">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight leading-none">PyNum</h1>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest leading-none">Studio</span>
            </div>
          </Link>
          <button onClick={onClose} className="md:hidden p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-8 space-y-10 custom-scrollbar">
          {CATEGORIES.map((cat) => (
            <div key={cat.name} className="px-2">
              <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 text-[11px] font-black uppercase tracking-wider mb-4 px-4">
                <cat.icon className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
                {cat.name}
              </div>
              <div className="space-y-1">
                {cat.items.map(item => renderItem(item))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 shrink-0">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-[10px] text-slate-500 dark:text-slate-400 flex justify-between items-center shadow-sm">
            <span className="font-mono font-bold">RELEASE v2.1</span>
            <span className="flex items-center gap-1.5 font-black text-emerald-700 dark:text-emerald-400 uppercase">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> 
               Stable
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};