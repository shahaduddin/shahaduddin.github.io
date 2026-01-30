import React from 'react';
import { TopicCategory, AlgorithmType } from '../types';
import { Beaker, BookOpen, GitGraph, TrendingUp, Calculator, Activity, Terminal, X } from 'lucide-react';

interface SidebarProps {
  currentAlgorithm: AlgorithmType;
  onSelect: (algo: AlgorithmType) => void;
  isOpen: boolean;
  onClose: () => void;
}

// Helper type for nested structure
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
        title: "Bracketing Methods",
        items: [
          AlgorithmType.BISECTION,
          AlgorithmType.FALSE_POSITION
        ]
      },
      {
        title: "Open Methods",
        items: [
          AlgorithmType.NEWTON_RAPHSON,
          AlgorithmType.SECANT,
          AlgorithmType.FIXED_POINT_ITERATION
        ]
      }
    ]
  },
  {
    name: TopicCategory.LINEAR,
    icon: GitGraph,
    items: [
      {
        title: "Matrix Decompositions",
        items: [
          AlgorithmType.LU_DECOMPOSITION,
          AlgorithmType.CHOLESKY_DECOMPOSITION,
          AlgorithmType.QR_DECOMPOSITION
        ]
      },
      {
        title: "Direct Solvers",
        items: [
          AlgorithmType.GAUSSIAN,
          AlgorithmType.GAUSS_JORDAN
        ]
      },
      {
        title: "Iterative Solvers",
        items: [
          AlgorithmType.JACOBI,
          AlgorithmType.GAUSS_SEIDEL
        ]
      },
      {
        title: "Matrix Operations",
        items: [
          AlgorithmType.MATRIX_ADDITION,
          AlgorithmType.MATRIX_SUBTRACTION,
          AlgorithmType.MATRIX_MULTIPLICATION,
          AlgorithmType.MATRIX_TRANSPOSE,
          AlgorithmType.MATRIX_INVERSE,
          AlgorithmType.MATRIX_DETERMINANT
        ]
      }
    ]
  },
  {
    name: TopicCategory.INTERPOLATION,
    icon: TrendingUp,
    items: [
      {
        title: "Polynomial Interpolation",
        items: [
          AlgorithmType.LAGRANGE,
          AlgorithmType.NEWTON_DIVIDED_DIFFERENCE
        ]
      },
      {
        title: "Spline Interpolation",
        items: [
          AlgorithmType.LINEAR_SPLINE,
          AlgorithmType.QUADRATIC_SPLINE,
          AlgorithmType.CUBIC_SPLINE
        ]
      },
      {
        title: "Evenly Spaced",
        items: [
          AlgorithmType.NEWTON_FORWARD_DIFFERENCE,
          AlgorithmType.NEWTON_BACKWARD_DIFFERENCE,
          AlgorithmType.GAUSS_FORWARD_INTERPOLATION,
          AlgorithmType.GAUSS_BACKWARD_INTERPOLATION
        ]
      }
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

export const Sidebar: React.FC<SidebarProps> = ({ currentAlgorithm, onSelect, isOpen, onClose }) => {
  const handleSelect = (algo: AlgorithmType) => {
    onSelect(algo);
    onClose(); // Close sidebar on mobile when item selected
  };

  const renderItem = (item: CategoryItem) => {
    // If it's a subsection
    if (typeof item === 'object') {
       return (
         <div key={item.title} className="mb-3">
            <div className="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              {item.title}
            </div>
            <div className="pl-2 space-y-1">
              {item.items.map(algo => (
                <button
                  key={algo}
                  onClick={() => handleSelect(algo)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    currentAlgorithm === algo
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {algo}
                </button>
              ))}
            </div>
         </div>
       );
    }
    
    // Standard Item
    return (
      <button
        key={item}
        onClick={() => handleSelect(item)}
        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${
          currentAlgorithm === item
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        }`}
      >
        {item}
      </button>
    );
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-80 bg-white/95 backdrop-blur-xl border-r border-slate-200 
        transform transition-transform duration-300 ease-in-out flex flex-col h-full shadow-2xl md:shadow-none
        md:relative md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
          <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                 <Terminal className="w-5 h-5" />
              </div>
              PyNum
            </h1>
            <p className="text-slate-500 text-xs mt-1 ml-11">Interactive Studio</p>
          </div>
          <button 
            onClick={onClose}
            className="md:hidden p-2 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 space-y-8 custom-scrollbar">
          {CATEGORIES.map((cat) => (
            <div key={cat.name} className="px-5">
              <div className="flex items-center gap-2 text-slate-800 text-sm font-bold uppercase tracking-wider mb-4 px-2 border-b border-slate-100 pb-2">
                <cat.icon className="w-4 h-4 text-emerald-600" />
                {cat.name}
              </div>
              <div className="space-y-1">
                {cat.items.map(item => renderItem(item))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="bg-white border border-slate-200 rounded-lg p-3 text-xs text-slate-500 flex justify-between items-center shadow-sm">
            <span className="font-mono">v1.5.0</span>
            <span className="flex items-center gap-1.5 font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> 
               Online
            </span>
          </div>
        </div>
      </div>
    </>
  );
};