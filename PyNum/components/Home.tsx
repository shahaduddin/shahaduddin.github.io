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
// 2. WEB LANDING PAGE (Full Code)
// ==========================================
const WebLanding: React.FC = () => {
  const algorithms = Object.values(AlgorithmType);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors selection:bg-emerald-500/30">
      
      {/* Animation Styles */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>

      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <Terminal className="w-5 h-5" />
            </div>
            <span className="text-xl font-black tracking-tighter">PyNum<span className="text-emerald-500">Studio</span></span>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-6">
                <a href="#features" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-emerald-600 transition-colors">Features</a>
                <a href="#docs" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-emerald-600 transition-colors">Docs</a>
                <a href="/APK/PyNum-app-release.apk" 
              download="PyNum-app-release.apk" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-emerald-600 transition-colors">Mobile</a>
            </div>

            <Link 
              to="/tools/calculator"
              className="group bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center gap-2"
            >
              Launch App
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-28 px-6 overflow-hidden">
        <div className="absolute inset-0 -z-10 w-full h-full overflow-hidden">
            <div className="absolute top-[-10%] left-[10%] w-[500px] h-[500px] bg-emerald-400/20 dark:bg-emerald-600/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px] opacity-70 animate-blob"></div>
            <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-blue-400/20 dark:bg-blue-600/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px] opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')] opacity-[0.03] dark:opacity-[0.07] pointer-events-none"></div>
        </div>
        
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center relative z-10">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/50 border border-emerald-100/50 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 backdrop-blur-md shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            Empowering the next generation of engineers
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-[-0.04em] text-slate-900 dark:text-white leading-[0.9] mb-8 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
            Precision <br className="hidden md:block" /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 via-emerald-600 to-blue-600">Calculations</span> 
            <br className="hidden md:block" /> at scale.
          </h1>
          
          <p className="text-lg md:text-2xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed font-medium mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            A world-class suite of numerical analysis tools. Visualize complex math, 
            benchmarked algorithms, and production-ready Python implementations in one immersive studio.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
            <Link 
              to="/tools/calculator"
              className="w-full sm:w-auto h-16 px-10 rounded-[1.5rem] bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-4 shadow-2xl shadow-emerald-600/30 transition-all hover:-translate-y-1 hover:shadow-emerald-600/50 active:scale-95"
            >
              <Play className="w-5 h-5 fill-current" />
              Launch Web Studio
            </Link>
            <a 
              href="/APK/PyNum-app-release.apk" 
              download="PyNum-app-release.apk"
              className="w-full sm:w-auto h-16 px-10 rounded-[1.5rem] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-100 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-xl active:scale-95"
            >
              <Smartphone className="w-5 h-5" />
              Download APK
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-32 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard icon={Zap} title="Roots of Equations" desc="Bisection, Newton-Raphson, and Muller's Method." color="emerald" />
            <FeatureCard icon={Grid3X3} title="Linear Algebra" desc="Gaussian, LU/QR/Cholesky Decompositions." color="blue" />
            <FeatureCard icon={Cpu} title="Interpolation" desc="Lagrange, Newton Divided Difference, Splines." color="purple" />
            <FeatureCard icon={Command} title="Calculus Suite" desc="Numerical integration and ODE solvers." color="amber" />
            <FeatureCard icon={Terminal} title="Multi-Lang Code" desc="Python, C++, and Fortran implementations." color="slate" />
            <FeatureCard icon={Globe} title="Web & Mobile Sync" desc="Access your calculations anywhere." color="indigo" />
          </div>
        </div>
      </section>

      {/* Docs */}
      <section id="docs" className="py-32 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
           <div className="flex flex-col lg:flex-row gap-20 items-start">
              <div className="lg:w-1/2 space-y-8">
                <h2 className="text-4xl font-black tracking-tight">Theory Repository.</h2>
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
                  <SyntaxItem label="Exponents" example="x^2" desc="Natural power notation" />
                  <SyntaxItem label="Trigonometry" example="sin(x)" desc="Full constant support" />
                </div>
              </div>
              <div className="lg:w-1/2 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {algorithms.slice(0, 6).map((algo, i) => (
                    <div key={i} className="flex items-center p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
                       <FileText className="w-5 h-5 mr-3 text-slate-400" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 truncate">{algo}</span>
                    </div>
                  ))}
              </div>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative pt-24 pb-12 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-6 text-center">
             <div className="flex items-center justify-center gap-3 mb-6">
                <Terminal className="w-6 h-6 text-emerald-600" />
                <span className="text-lg font-black tracking-tighter uppercase">PyNum Studio</span>
             </div>
             <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">© 2026 Shahad Uddin. All rights reserved.</p>
          </div>
      </footer>
    </div>
  );
};

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