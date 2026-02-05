import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Smartphone, Monitor, ChevronRight, Download, Terminal, 
  Cpu, Grid3X3, Activity, Command, Apple, Play, ShieldCheck, FileText, Book,
  Code, Sparkles, Zap, BrainCircuit, Globe, ArrowRight, Calculator,
  TrendingUp, LayoutGrid
} from 'lucide-react';
import { slugify } from '../App';
import { TopicCategory, AlgorithmType } from '../types';

// ==========================================
// MAIN WRAPPER (Detects Web vs App)
// ==========================================
export const Home: React.FC = () => {
  // Initialize state synchronously to prevent flash of wrong content
  const [isAppMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    
    return window.matchMedia('(display-mode: standalone)').matches 
        || (window.navigator as any).standalone 
        || document.referrer.includes('android-app://');
  });

  return isAppMode ? <AppDashboard /> : <WebLanding />;
};

// ==========================================
// 1. APP DASHBOARD (For Installed Users)
// ==========================================
const AppDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-20">
      
      {/* App Header */}
      <header className="px-6 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-sm safe-area-top">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white shadow-emerald-500/20 shadow-lg">
              <Terminal className="w-4 h-4" />
            </div>
            <span className="font-black text-lg tracking-tighter text-slate-900 dark:text-white">
              PyNum<span className="text-emerald-500">Studio</span>
            </span>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="p-6 space-y-8 animate-in fade-in zoom-in-95 duration-700">
        
        {/* Quick Tools */}
        <section>
          <div className="flex items-center gap-2 mb-4 opacity-70">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-widest">Quick Tools</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/tools/calculator" className="col-span-1 bg-emerald-600 text-white p-5 rounded-3xl shadow-lg shadow-emerald-600/20 active:scale-95 transition-transform relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Calculator className="w-16 h-16" />
               </div>
               <div className="relative z-10 h-full flex flex-col justify-between space-y-4">
                  <div className="p-2 bg-white/20 w-fit rounded-xl backdrop-blur-md">
                    <Calculator className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-none mb-1">Sci-Calc</h3>
                    <p className="text-emerald-100 text-xs">Symbolic Engine</p>
                  </div>
               </div>
            </Link>

            <Link to="/tools/grapher" className="col-span-1 bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm active:scale-95 transition-transform relative overflow-hidden group">
               <div className="absolute -bottom-4 -right-4 text-slate-100 dark:text-slate-700">
                  <TrendingUp className="w-20 h-20 opacity-50" />
               </div>
               <div className="relative z-10 h-full flex flex-col justify-between space-y-4">
                  <div className="p-2 bg-slate-100 dark:bg-slate-700 w-fit rounded-xl text-slate-600 dark:text-slate-300">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-none mb-1 text-slate-900 dark:text-white">Grapher</h3>
                    <p className="text-slate-400 text-xs">2D Plotter</p>
                  </div>
               </div>
            </Link>
          </div>
        </section>

        {/* Core Libraries */}
        <section>
           <div className="flex items-center gap-2 mb-4 opacity-70">
            <LayoutGrid className="w-4 h-4 text-blue-500" />
            <span className="text-[10px] font-black uppercase tracking-widest">Core Libraries</span>
          </div>
          
          <div className="space-y-3">
             <AppModuleCard 
                to={`/${slugify(TopicCategory.ROOTS)}/${slugify(AlgorithmType.BISECTION)}/demo`}
                title="Root Finding"
                desc="Bisection, Newton, Secant"
                icon={Zap}
                color="emerald"
             />
             <AppModuleCard 
                to={`/${slugify(TopicCategory.LINEAR)}/${slugify(AlgorithmType.GAUSSIAN)}/demo`}
                title="Linear Algebra"
                desc="Matrix Ops, Decompositions"
                icon={Grid3X3}
                color="blue"
             />
             <AppModuleCard 
                to={`/${slugify(TopicCategory.INTERPOLATION)}/${slugify(AlgorithmType.LAGRANGE)}/demo`}
                title="Interpolation"
                desc="Splines, Lagrange, Curves"
                icon={Cpu}
                color="purple"
             />
             <AppModuleCard 
                to={`/${slugify(TopicCategory.ODE)}/${slugify(AlgorithmType.RK4)}/demo`}
                title="Calculus & ODEs"
                desc="Integration, Runge-Kutta"
                icon={Command}
                color="amber"
             />
          </div>
        </section>

        {/* Manual Link */}
        <section>
          <Link to="/docs/manual" className="flex items-center justify-between p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800/50 active:scale-95 transition-transform">
             <div className="flex items-center gap-4">
                <div className="p-2 bg-white dark:bg-indigo-900 rounded-xl text-indigo-600 dark:text-indigo-300">
                   <Book className="w-5 h-5" />
                </div>
                <div>
                   <h4 className="font-bold text-slate-900 dark:text-white text-sm">Reference Manual</h4>
                   <p className="text-xs text-slate-500 dark:text-slate-400">Offline Documentation</p>
                </div>
             </div>
             <ChevronRight className="w-4 h-4 text-indigo-400" />
          </Link>
        </section>

        <div className="text-center pt-8">
           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">v2.2.4 (Stable)</p>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. WEB LANDING PAGE (Dashboard-Matched Theme)
// ==========================================
const WebLanding: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-emerald-500/30">
      
      {/* Navigation - Matches App Header style */}
      <nav className="fixed w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <Terminal className="w-5 h-5" />
            </div>
            <span className="text-xl font-black tracking-tighter">
              PyNum<span className="text-emerald-500">Studio</span>
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-6 mr-4">
                <a href="#features" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-emerald-600 transition-colors">Modules</a>
                <a href="#mobile" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-emerald-600 transition-colors">Mobile APK</a>
            </div>
            <Link 
              to="/tools/calculator"
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
            >
              Open Studio
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-20 px-6 max-w-7xl mx-auto space-y-16">
        
        {/* Hero Section: Dashboard Preview Style */}
        <section className="relative">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 border border-emerald-100 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                <Sparkles className="w-3 h-3" />
                V2.2.4 Stable Release
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] text-slate-900 dark:text-white">
                Numerical Analysis <br />
                <span className="text-emerald-600">Redefined.</span>
              </h1>
              <p className="text-lg text-slate-500 dark:text-slate-400 font-medium max-w-md">
                A high-performance studio for engineering mathematics. Real-time visualizations, symbolic engines, and production-ready code.
              </p>
              <div className="flex flex-wrap gap-4">
                 <Link to="/tools/calculator" className="flex items-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-transform">
                    <Play className="w-4 h-4 fill-current" />
                    Launch Web App
                 </Link>
                 <a href="/APK/PyNum-app-release.apk" download className="flex items-center gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                    <Download className="w-4 h-4" />
                    Get APK
                 </a>
              </div>
            </div>

            {/* Visual Feature Grid (Mimics the Dashboard) */}
            <div className="lg:col-span-7 grid grid-cols-2 gap-4">
               <div className="space-y-4 pt-8">
                  <div className="bg-emerald-600 p-6 rounded-[2rem] text-white shadow-xl shadow-emerald-600/20">
                    <Calculator className="w-8 h-8 mb-4 opacity-50" />
                    <h3 className="font-bold text-xl mb-1">Sci-Calc</h3>
                    <p className="text-emerald-100 text-xs font-medium">Symbolic math engine for complex evaluations.</p>
                  </div>
                  <AppModuleCard 
                    to={`/${slugify(TopicCategory.ROOTS)}/${slugify(AlgorithmType.BISECTION)}/demo`}
                    title="Root Finding" desc="Bisection & Newton" icon={Zap} color="emerald"
                  />
               </div>
               <div className="space-y-4">
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-sm">
                    <Activity className="w-8 h-8 mb-4 text-blue-500" />
                    <h3 className="font-bold text-xl mb-1">Grapher</h3>
                    <p className="text-slate-400 text-xs font-medium">Interactive 2D function plotter with zoom.</p>
                  </div>
                  <AppModuleCard 
                    to={`/${slugify(TopicCategory.LINEAR)}/${slugify(AlgorithmType.GAUSSIAN)}/demo`}
                    title="Linear Systems" desc="Matrix Decompositions" icon={Grid3X3} color="blue"
                  />
                  <AppModuleCard 
                    to={`/${slugify(TopicCategory.ODE)}/${slugify(AlgorithmType.RK4)}/demo`}
                    title="Calculus" desc="ODEs & Integration" icon={Command} color="amber"
                  />
               </div>
            </div>
          </div>
        </section>

        {/* Modular Features Section */}
        <section id="features" className="space-y-8">
          <div className="flex items-center gap-2 opacity-70">
            <LayoutGrid className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-widest">All Core Libraries</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             <FeatureDetailCard 
                title="Iterative Solvers" 
                desc="High-precision root finding using Bisection, Regula-Falsi, and Newton-Raphson methods."
                icon={Zap}
                algorithms={["Bisection", "Newton-Raphson", "Secant"]}
             />
             <FeatureDetailCard 
                title="Matrix Studio" 
                desc="Full suite for linear algebra: LU, QR, Cholesky decompositions and Gaussian elimination."
                icon={Grid3X3}
                algorithms={["Gaussian", "LU/QR", "Jacobi/Seidel"]}
             />
             <FeatureDetailCard 
                title="Interpolation" 
                desc="Map discrete data to continuous functions using Splines and Lagrange polynomials."
                icon={Cpu}
                algorithms={["Cubic Spline", "Lagrange", "Newton"]}
             />
          </div>
        </section>

        {/* Documentation/Mobile Section */}
        <section id="mobile" className="grid md:grid-cols-2 gap-6">
           <div className="p-8 bg-indigo-600 rounded-[2.5rem] text-white flex flex-col justify-between overflow-hidden relative">
              <Smartphone className="absolute -bottom-10 -right-10 w-64 h-64 text-white/10 rotate-12" />
              <div className="relative z-10">
                <h3 className="text-3xl font-black tracking-tight mb-4">Take the studio <br />with you.</h3>
                <p className="text-indigo-100 text-sm font-medium max-w-xs mb-8">
                  Install the PWA or download the native Android APK for a full offline experience.
                </p>
                <a href="/APK/PyNum-app-release.apk" download className="inline-flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest">
                  Download APK
                </a>
              </div>
           </div>

           <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] flex flex-col justify-between">
              <div>
                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 w-fit rounded-xl text-emerald-600 mb-6">
                  <Book className="w-6 h-6" />
                </div>
                <h3 className="text-3xl font-black tracking-tight mb-4">Theoretical <br />Reference.</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium max-w-xs">
                  In-depth documentation for every algorithm with step-by-step mathematical proofs.
                </p>
              </div>
              <Link to="/docs/manual" className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest mt-8">
                View Documentation <ArrowRight className="w-4 h-4" />
              </Link>
           </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
             <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-emerald-600" />
                <span className="font-black text-sm tracking-tighter uppercase">PyNum Studio</span>
             </div>
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">© 2026 Shahad Uddin. Built for Engineers.</p>
          </div>
      </footer>
    </div>
  );
};

// ==========================================
// NEW SHARED COMPONENT
// ==========================================

const FeatureDetailCard = ({ icon: Icon, title, desc, algorithms }: any) => (
  <div className="p-8 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 group hover:border-emerald-500/50 transition-all shadow-sm">
    <div className="flex items-center justify-between mb-6">
       <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-600 dark:text-slate-300 group-hover:bg-emerald-600 group-hover:text-white transition-all">
          <Icon className="w-6 h-6" />
       </div>
       <ChevronRight className="w-4 h-4 text-slate-300" />
    </div>
    <h3 className="font-black text-xl mb-3 uppercase tracking-tight">{title}</h3>
    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-6">{desc}</p>
    <div className="flex flex-wrap gap-2">
      {algorithms.map((algo: string) => (
        <span key={algo} className="text-[9px] font-black uppercase tracking-widest px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-md">
          {algo}
        </span>
      ))}
    </div>
  </div>
);

// ==========================================
// SHARED COMPONENTS
// ==========================================

const FeatureCard = ({ icon: Icon, title, desc, color }: any) => {
  const colors: any = {
    emerald: "text-emerald-600 dark:text-emerald-400",
    blue: "text-blue-600 dark:text-blue-400",
    purple: "text-purple-600 dark:text-purple-400",
    amber: "text-amber-600 dark:text-amber-400",
    slate: "text-slate-600 dark:text-slate-400",
    indigo: "text-indigo-600 dark:text-indigo-400",
  };
  return (
    <div className="p-10 rounded-[2.5rem] bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 transition-all">
      <div className={`w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center mb-6 ${colors[color]}`}>
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="font-black text-xl mb-3 text-slate-900 dark:text-slate-100 uppercase tracking-tight">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{desc}</p>
    </div>
  );
};

const SyntaxItem = ({ label, example, desc }: any) => (
  <div className="flex items-start gap-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
    <div className="mt-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></div>
    <div>
      <div className="flex items-center gap-3 mb-1">
        <span className="text-[11px] font-black text-slate-900 dark:text-slate-200 uppercase tracking-widest">{label}</span>
        <code className="text-[10px] bg-white dark:bg-slate-900 px-2 py-1 rounded-lg text-emerald-600 dark:text-emerald-400 font-mono font-black">{example}</code>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{desc}</p>
    </div>
  </div>
);

const AppModuleCard = ({ to, title, desc, icon: Icon, color }: any) => {
  const colors: any = {
    emerald: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20",
    blue: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20",
    purple: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20",
    amber: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20",
  };
  return (
    <Link to={to} className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm active:scale-[0.98] transition-all">
      <div className={`p-3 rounded-xl ${colors[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-slate-900 dark:text-white text-sm">{title}</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{desc}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-300" />
    </Link>
  );
};

const FooterLink = ({ to, children }: any) => (
  <li><Link to={to} className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-emerald-600 transition-colors block">{children}</Link></li>
);

const SocialButton = ({ icon: Icon, href }: any) => (
  <a href={href} className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-emerald-600 hover:text-white transition-all"><Icon className="w-4 h-4" /></a>
);