import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Smartphone, Monitor, ChevronRight, Download, Terminal, 
  Cpu, Grid3X3, Activity, Command, Apple, Play, ShieldCheck, FileText, Book,
  Code, Sparkles, Zap, BrainCircuit, Globe, ArrowRight, Calculator,
  TrendingUp, Clock, Settings, Search, LayoutGrid
} from 'lucide-react';
import { slugify } from '../App';
import { TopicCategory, AlgorithmType } from '../types';

// ==========================================
// MAIN WRAPPER (Detects Web vs App)
// ==========================================
export const Home: React.FC = () => {
  const [isAppMode, setIsAppMode] = useState(false);

  useEffect(() => {
    // Detect if running as PWA (standalone) or inside a TWA/Webview
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
                      || (window.navigator as any).standalone 
                      || document.referrer.includes('android-app://');
    
    setIsAppMode(isStandalone);
  }, []);

  return isAppMode ? <AppDashboard /> : <WebLanding />;
};

// ==========================================
// 1. APP DASHBOARD (For Installed Users)
// ==========================================
const AppDashboard: React.FC = () => {
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-20">
      {/* App Header */}
      <header className="px-6 pt-8 pb-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
              <Terminal className="w-4 h-4" />
            </div>
            <span className="font-black text-lg tracking-tighter">PyNum</span>
          </div>
          <div className="flex items-center gap-3">
             <span className="text-xs font-mono font-bold text-slate-400">{time}</span>
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          </div>
        </div>
        
        <div className="space-y-1">
          <h1 className="text-2xl font-black tracking-tight">System Ready.</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Select a module to begin analysis.</p>
        </div>
      </header>

      <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Primary Tools Grid */}
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

        {/* Categories / Modules */}
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

        {/* Documentation / Help */}
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


// ==========================================
// 2. WEB LANDING PAGE (Original Marketing Page)
// ==========================================
const WebLanding: React.FC = () => {
  const algorithms = Object.values(AlgorithmType);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors selection:bg-emerald-500/30">
      
      {/* Inline Styles for Background Animation */}
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
        .animation-delay-4000 {
          animation-delay: 4s;
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
                <a href="#docs" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-emerald-600 transition-colors">Documentation</a>
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
        {/* Immersive Background */}
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

          {/* Floating UI Decorative Elements */}
          <div className="hidden xl:block absolute top-0 -left-10 animate-float">
             <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 rotate-[-10deg] backdrop-blur-xl">
                <div className="flex gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-red-400"></div>
                    <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                </div>
                <div className="space-y-1">
                    <div className="w-24 h-1 bg-emerald-500/20 rounded"></div>
                    <div className="w-20 h-1 bg-slate-200 dark:bg-slate-700 rounded"></div>
                    <div className="w-16 h-1 bg-slate-200 dark:bg-slate-700 rounded"></div>
                </div>
             </div>
          </div>

          <div className="hidden xl:block absolute bottom-10 -right-10 animate-float" style={{ animationDelay: '1s' }}>
             <div className="bg-emerald-600 p-4 rounded-3xl shadow-2xl rotate-[12deg] flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl">
                   <Activity className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                    <div className="text-[8px] font-black text-emerald-200 uppercase tracking-widest">Efficiency</div>
                    <div className="text-sm font-black text-white">99.8% Converged</div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">Built for Engineering.</h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg">A unified toolkit designed to simplify complex mathematical implementations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Zap}
              title="Roots of Equations" 
              desc="Bisection, Newton-Raphson, and Muller's Method with high-speed automated bracketing."
              color="emerald"
            />
            <FeatureCard 
              icon={Grid3X3}
              title="Linear Algebra" 
              desc="Full matrix ops: Gaussian, LU/QR/Cholesky Decompositions, and iterative Gauss-Seidel."
              color="blue"
            />
            <FeatureCard 
              icon={Cpu}
              title="Interpolation" 
              desc="High-order Lagrange, Newton Divided Difference, and smooth Cubic Spline reconstruction."
              color="purple"
            />
            <FeatureCard 
              icon={Command}
              title="Calculus Suite" 
              desc="Numerical integration (Simpson 1/3) and ODE solvers including the robust RK4 method."
              color="amber"
            />
            <FeatureCard 
              icon={Terminal}
              title="Multi-Lang Code" 
              desc="Switch instantly between optimized Python, C++, and Fortran reference implementations."
              color="slate"
            />
            <FeatureCard 
              icon={Globe}
              title="Web & Mobile Sync" 
              desc="Access your calculations anywhere. Export data as CSV or download full PDF documentation."
              color="indigo"
            />
          </div>
        </div>
      </section>

      {/* Documentation Section */}
      <section id="docs" className="py-32 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-20 items-start">
            
            {/* Left: Syntax Guide */}
              <div className="lg:w-1/2 space-y-8 lg:sticky lg:top-32">
              <div className="inline-block p-4 rounded-3xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mb-2">
                <Command className="w-8 h-8" />
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight">Smart Notation Parser.</h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed font-medium">
                PyNum uses an advanced mathematical parser. Input equations exactly as you would on a blackboard.
              </p>
              
              <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
                <SyntaxItem label="Exponents" example="x^2" desc="Natural power notation" />
                <SyntaxItem label="Trigonometry" example="sin(x), cos(π)" desc="Full constant support" />
                <SyntaxItem label="Transcendental" example="ln(x), exp(x)" desc="Natural log and Euler's" />
                <SyntaxItem label="Constants" example="π, e" desc="Physical & Math constants" />
              </div>
            </div>

            {/* Right: PDF Library */}
            <div className="lg:w-1/2 w-full space-y-10">
               <div className="space-y-4">
                  <div className="inline-block p-4 rounded-3xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                    <Book className="w-8 h-8" />
                  </div>
                  <h2 className="text-4xl font-black tracking-tight">Theory Repository.</h2>
                  <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">Comprehensive deep-dives for every algorithm.</p>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {algorithms.slice(0, 10).map((algo, i) => (
                    <a 
                      key={i} 
                      href={`/PDF/${algo.replace(/\s+/g, '_')}.pdf`}
                      download
                      className="group flex items-center p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl hover:border-emerald-500 hover:shadow-2xl transition-all"
                    >
                      <div className="mr-4 p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-500 group-hover:text-emerald-500 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20 transition-all">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="overflow-hidden flex-1">
                        <h4 className="text-[11px] font-black text-slate-900 dark:text-slate-100 truncate group-hover:text-emerald-600 transition-colors uppercase tracking-widest">{algo}</h4>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Manual PDF</span>
                      </div>
                      <Download className="w-4 h-4 ml-2 text-slate-300 group-hover:text-emerald-500 group-hover:scale-110 transition-all" />
                    </a>
                  ))}
                  <div className="sm:col-span-2 p-10 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem] bg-slate-50/50 dark:bg-slate-900/20">
                    <span className="text-sm text-slate-400 font-black uppercase tracking-widest flex items-center justify-center gap-3">
                        <ChevronRight className="w-4 h-4" />
                        And {algorithms.length - 10} more in the studio
                    </span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Download Section */}
      <section id="download" className="py-32 bg-slate-900 dark:bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-[0.9]">Mobile Analysis <br className="hidden md:block" /> Without Limits.</h2>
          <p className="text-slate-400 text-lg md:text-xl mb-14 max-w-2xl mx-auto leading-relaxed">
            Take PyNum Studio on the go. Experience zero-latency calculations, 
            offline access, and biometric security with our native application.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <a 
              href="/APK/PyNum-app-release.apk" 
              download="PyNum-app-release.apk"
              className="group flex items-center gap-5 bg-white text-slate-900 px-10 py-5 rounded-[2rem] hover:bg-emerald-50 transition-all shadow-2xl hover:scale-105 active:scale-95"
            >
              <div className="text-left">
                <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">Android Build</div>
                <div className="text-xl font-black leading-none">Download APK</div>
              </div>
              <div className="p-2 bg-emerald-100 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <Download className="w-7 h-7" />
              </div>
            </a>
            
            <button className="group flex items-center gap-5 bg-slate-800 text-white px-10 py-5 rounded-[2rem] border border-white/5 transition-all shadow-2xl opacity-60 cursor-not-allowed">
              <Apple className="w-7 h-7" />
              <div className="text-left">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Coming Soon</div>
                <div className="text-xl font-black leading-none opacity-50">App Store</div>
              </div>
            </button>
          </div>
          
          <div className="mt-16 flex flex-col items-center gap-4">
             <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-6 py-2.5 rounded-full border border-emerald-500/20">
                <ShieldCheck className="w-4 h-4" />
                Verified Stability • v2.2.4 Production
             </div>
             <p className="text-xs text-slate-500 font-mono italic">
                * Built for Android 10+. Secure build signed by PyNum Core.
             </p>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="relative pt-24 pb-12 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
        
        {/* Ambient Background Glow matching Hero */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
            
            {/* Brand Column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                  <Terminal className="w-5 h-5" />
                </div>
                <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">
                  PyNum<span className="text-emerald-500">Studio</span>
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm font-medium">
                The open-source standard for numerical analysis visualization. 
                Bridging the gap between theory and production code for engineers worldwide.
              </p>
              
              {/* Newsletter / CTA */}
              <div className="flex gap-2 max-w-sm pt-2">
                 <input 
                   type="email" 
                   placeholder="Enter email for updates" 
                   className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:border-emerald-500 transition-colors dark:text-white placeholder:text-slate-400"
                 />
                 <button className="bg-emerald-600 text-white p-3 rounded-xl hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-600/20">
                   <ArrowRight className="w-4 h-4" />
                 </button>
              </div>
            </div>

            {/* Navigation Columns */}
            <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
              
              <div className="space-y-6">
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Algorithms</h4>
                <ul className="space-y-4">
                  <FooterLink to={`/${slugify(TopicCategory.ROOTS)}/${slugify(AlgorithmType.BISECTION)}`}>Root Finding</FooterLink>
                  <FooterLink to={`/${slugify(TopicCategory.LINEAR)}/${slugify(AlgorithmType.GAUSSIAN)}`}>Linear Algebra</FooterLink>
                  <FooterLink to={`/${slugify(TopicCategory.INTERPOLATION)}/${slugify(AlgorithmType.LAGRANGE)}`}>Interpolation</FooterLink>
                  <FooterLink to={`/${slugify(TopicCategory.ODE)}/${slugify(AlgorithmType.RK4)}`}>Differential Eq</FooterLink>
                </ul>
              </div>

              <div className="space-y-6">
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Resources</h4>
                <ul className="space-y-4">
                  <FooterLink to="/docs/manual">Documentation</FooterLink>
                  <FooterLink to="/docs/api">Python API</FooterLink>
                  <a href="/APK/PyNum-app-release.apk" className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-2">
                    Android APK
                    <span className="text-[9px] bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded font-black uppercase">New</span>
                  </a>
                  <FooterLink to="/tools/grapher">Graphing Tool</FooterLink>
                </ul>
              </div>

              <div className="space-y-6">
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Company</h4>
                <ul className="space-y-4">
                  <FooterLink to="/about">About Us</FooterLink>
                  <FooterLink to="/github">GitHub Repo</FooterLink>
                  <FooterLink to="/license">MIT License</FooterLink>
                  <FooterLink to="/privacy">Privacy Policy</FooterLink>
                </ul>
              </div>

            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
              © 2026 Shahad Uddin. All rights reserved.
            </p>
            
            {/* Social Icons */}
            <div className="flex items-center gap-4">
              <SocialButton icon={Globe} href="https://shahaduddin.com" />
              <SocialButton icon={Code} href="https://github.com/shahaduddin" />
              <SocialButton icon={Command} href="#" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, desc, color }: { icon: any, title: string, desc: string, color: string }) => {
  const colors: any = {
    emerald: "group-hover:bg-emerald-500 text-emerald-600 dark:text-emerald-400",
    blue: "group-hover:bg-blue-500 text-blue-600 dark:text-blue-400",
    purple: "group-hover:bg-purple-500 text-purple-600 dark:text-purple-400",
    amber: "group-hover:bg-amber-500 text-amber-600 dark:text-amber-400",
    slate: "group-hover:bg-slate-600 text-slate-600 dark:text-slate-400",
    indigo: "group-hover:bg-indigo-500 text-indigo-600 dark:text-indigo-400",
  };
  
  return (
    <div className="group p-10 rounded-[2.5rem] bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-emerald-500/30 hover:bg-white dark:hover:bg-slate-800 hover:shadow-2xl hover:shadow-emerald-500/5 transition-all duration-500 ease-out">
      <div className={`w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-transparent group-hover:text-white transition-all duration-500 ${colors[color]}`}>
        <Icon className="w-7 h-7 transition-colors duration-500" />
      </div>
      <h3 className="font-black text-xl mb-3 text-slate-900 dark:text-slate-100 uppercase tracking-tight">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{desc}</p>
    </div>
  );
};

const SyntaxItem = ({ label, example, desc }: { label: string, example: string, desc: string }) => (
  <div className="flex items-start gap-5 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-800 group">
    <div className="mt-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 group-hover:scale-125 transition-transform shadow-[0_0_10px_rgba(16,185,129,0.4)]"></div>
    <div className="flex-1">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] font-black text-slate-900 dark:text-slate-200 uppercase tracking-widest">{label}</span>
        <code className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg text-emerald-600 dark:text-emerald-400 font-mono font-black">{example}</code>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{desc}</p>
    </div>
  </div>
);

const FooterLink = ({ to, children }: { to: string, children: React.ReactNode }) => (
  <li>
    <Link to={to} className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors block">
      {children}
    </Link>
  </li>
);

const SocialButton = ({ icon: Icon, href }: { icon: any, href: string }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer"
    className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white transition-all duration-300"
  >
    <Icon className="w-4 h-4" />
  </a>
);