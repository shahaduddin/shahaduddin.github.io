import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Smartphone, ChevronRight, Download, Terminal, 
  Cpu, Grid3X3, Activity, Command, Play, ShieldCheck, 
  Book, Sparkles, Zap, ArrowRight, Calculator,
  LayoutGrid, Globe, Code2, Database, Laptop,
  X, Check, AlertCircle
} from 'lucide-react';
import { slugify } from '../App';
import { TopicCategory, AlgorithmType } from '../types';

// ==========================================
// MAIN WRAPPER (Detects Web vs App)
// ==========================================
export const Home: React.FC = () => {
  const [isAppMode, setIsAppMode] = useState<boolean>(false);
  const [detectionMethod, setDetectionMethod] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showInstallPrompt, setShowInstallPrompt] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Check for PWA/App installation
    const checkAppMode = () => {
      if (typeof window === 'undefined') return false;
      
      // Multiple methods to detect PWA/installed app
      const detectionMethods = {
        displayMode: window.matchMedia('(display-mode: standalone)').matches,
        navigatorStandalone: (window.navigator as any).standalone === true,
        referrerCheck: document.referrer.includes('android-app://') || 
                       document.referrer.includes('ios-app://'),
        // Check if launched from home screen
        isStandalone: window.matchMedia('(display-mode: standalone)').matches ||
                     (window.navigator as any).standalone ||
                     window.location.search.includes('source=pwa'),
        // Check for service worker registration
        hasServiceWorker: 'serviceWorker' in navigator && 
                         navigator.serviceWorker.controller !== null,
        // Check viewport for PWA
        isInApp: window.innerHeight === window.screen.height || 
                (window.navigator as any).userAgentData?.mobile
      };

      // Log detection for debugging
      console.log('App Detection Methods:', detectionMethods);

      // Determine if app is installed
      const isInstalled = 
        detectionMethods.displayMode ||
        detectionMethods.navigatorStandalone ||
        detectionMethods.referrerCheck ||
        detectionMethods.isStandalone;

      setIsAppMode(isInstalled);
      
      // Set detection method for debugging/UI
      if (detectionMethods.displayMode) setDetectionMethod('display-mode: standalone');
      else if (detectionMethods.navigatorStandalone) setDetectionMethod('navigator.standalone');
      else if (detectionMethods.referrerCheck) setDetectionMethod('referrer check');
      else if (detectionMethods.isStandalone) setDetectionMethod('standalone mode');
      else setDetectionMethod('browser mode');

      setIsLoading(false);
    };

    // Handle beforeinstallprompt event for PWA installation
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show install prompt if not in app mode
      if (!isAppMode) {
        setShowInstallPrompt(true);
      }
    };

    // Add event listener for PWA installation
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check app mode on mount and on visibility change
    checkAppMode();
    document.addEventListener('visibilitychange', checkAppMode);
    window.addEventListener('resize', checkAppMode);

    // Check URL parameters for PWA launch
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('pwa') === 'true') {
      setIsAppMode(true);
      setDetectionMethod('url parameter');
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      document.removeEventListener('visibilitychange', checkAppMode);
      window.removeEventListener('resize', checkAppMode);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
        setShowInstallPrompt(false);
        // Refresh to show app mode
        setTimeout(() => window.location.reload(), 1000);
      } else {
        console.log('User dismissed the install prompt');
      }
      
      setDeferredPrompt(null);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            Detecting application mode...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {showInstallPrompt && !isAppMode && (
        <InstallPrompt 
          onInstall={handleInstallClick}
          onDismiss={() => setShowInstallPrompt(false)}
        />
      )}
      
      {isAppMode ? <AppDashboard detectionMethod={detectionMethod} /> : <WebLanding />}
      
      {/* Debug Panel - Remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <DebugPanel isAppMode={isAppMode} detectionMethod={detectionMethod} />
      )}
    </>
  );
};

// ==========================================
// INSTALL PROMPT COMPONENT - UPDATED POSITIONING
// ==========================================
const InstallPrompt: React.FC<{ 
  onInstall: () => void; 
  onDismiss: () => void;
}> = ({ onInstall, onDismiss }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onDismiss}
      />
      
      {/* Prompt Card - Positioned 20% from bottom (or centered on mobile) */}
      <div className="relative w-full max-w-md animate-in slide-in-up duration-300 sm:slide-in-bottom">
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl shadow-2xl p-6 text-white transform sm:translate-y-[20%]">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Install PyNum Studio</h3>
                <p className="text-sm text-emerald-100 opacity-90">
                  Get the full app experience with offline access
                </p>
              </div>
            </div>
            <button 
              onClick={onDismiss}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4 text-emerald-200" />
              <span>Full offline functionality</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4 text-emerald-200" />
              <span>Home screen access</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4 text-emerald-200" />
              <span>Native app experience</span>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onInstall}
              className="flex-1 bg-white text-emerald-700 font-bold py-3 rounded-xl hover:bg-emerald-50 transition-colors shadow-lg active:scale-95"
            >
              Install App
            </button>
            <button
              onClick={onDismiss}
              className="px-6 py-3 border border-white/30 rounded-xl hover:bg-white/10 transition-colors font-medium active:scale-95"
            >
              Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// DEBUG PANEL (Development Only)
// ==========================================
const DebugPanel: React.FC<{
  isAppMode: boolean;
  detectionMethod: string;
}> = ({ isAppMode, detectionMethod }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  return (
    <>
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 z-50 w-10 h-10 bg-slate-800 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg"
        title="Debug Info"
      >
        {isAppMode ? 'A' : 'W'}
      </button>
      
      {isVisible && (
        <div className="fixed bottom-20 right-4 z-50 bg-slate-900 text-white rounded-xl p-4 text-sm max-w-xs shadow-2xl border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold">App Detection Debug</span>
            <button 
              onClick={() => setIsVisible(false)}
              className="p-1 hover:bg-slate-700 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isAppMode ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span>Mode: <strong>{isAppMode ? 'App Dashboard' : 'Web Landing'}</strong></span>
            </div>
            
            <div className="text-xs text-slate-300">
              Method: {detectionMethod}
            </div>
            
            <div className="pt-2 border-t border-slate-700">
              <button
                onClick={() => {
                  localStorage.setItem('forceAppMode', (!isAppMode).toString());
                  window.location.reload();
                }}
                className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-lg w-full"
              >
                Force {isAppMode ? 'Web' : 'App'} Mode
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// ==========================================
// 1. APP DASHBOARD (The Mobile-First View)
// ==========================================
const AppDashboard: React.FC<{ detectionMethod?: string }> = ({ detectionMethod }) => {
  // Force app mode if localStorage flag is set (for debugging)
  const [forceAppMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('forceAppMode') === 'true';
  });

  if (!forceAppMode && !detectionMethod?.includes('standalone') && !detectionMethod?.includes('referrer')) {
    // Fallback to web landing if detection might be incorrect
    return <WebLanding />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-20">
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
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest">App</span>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-8 animate-in fade-in zoom-in-95 duration-700">
        {/* Welcome Message */}
        <section className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-3xl p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Check className="w-5 h-5 text-emerald-100" />
            <span className="text-sm font-bold">App Mode Active</span>
          </div>
          <h1 className="text-2xl font-black mb-2">Welcome to PyNum Studio</h1>
          <p className="text-emerald-100 text-sm opacity-90">
            All tools available offline. Your calculations are saved locally.
          </p>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-4 opacity-70">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-widest">Quick Tools</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/tools/calculator" className="bg-emerald-600 text-white p-5 rounded-3xl shadow-lg shadow-emerald-600/20 active:scale-95 transition-transform">
               <Calculator className="w-6 h-6 mb-4 opacity-50" />
               <h3 className="font-bold text-lg leading-none">Sci-Calc</h3>
               <p className="text-emerald-100 text-[10px] mt-1">Symbolic Engine</p>
            </Link>
            <Link to="/tools/grapher" className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm active:scale-95 transition-transform">
               <Activity className="w-6 h-6 mb-4 text-emerald-500" />
               <h3 className="font-bold text-lg leading-none text-slate-900 dark:text-white">Grapher</h3>
               <p className="text-slate-400 text-[10px] mt-1">2D Plotter</p>
            </Link>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-4 opacity-70">
            <LayoutGrid className="w-4 h-4 text-blue-500" />
            <span className="text-[10px] font-black uppercase tracking-widest">Core Libraries</span>
          </div>
          <div className="space-y-3">
             <AppModuleCard to={`/${slugify(TopicCategory.ROOTS)}/${slugify(AlgorithmType.BISECTION)}/demo`} title="Root Finding" desc="Bisection, Newton, Secant" icon={Zap} color="emerald" />
             <AppModuleCard to={`/${slugify(TopicCategory.LINEAR)}/${slugify(AlgorithmType.GAUSSIAN)}/demo`} title="Linear Algebra" desc="Matrix Ops, Decompositions" icon={Grid3X3} color="blue" />
             <AppModuleCard to={`/${slugify(TopicCategory.INTERPOLATION)}/${slugify(AlgorithmType.LAGRANGE)}/demo`} title="Interpolation" desc="Splines, Lagrange, Curves" icon={Cpu} color="purple" />
             <AppModuleCard to={`/${slugify(TopicCategory.ODE)}/${slugify(AlgorithmType.RK4)}/demo`} title="Calculus & ODEs" desc="Integration, Runge-Kutta" icon={Command} color="amber" />
          </div>
        </section>

        {/* App Features */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-widest">App Features</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3">
              <div className="w-10 h-10 mx-auto mb-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                <Database className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="text-xs font-bold">Offline Storage</span>
            </div>
            <div className="text-center p-3">
              <div className="w-10 h-10 mx-auto mb-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-xs font-bold">No Internet</span>
            </div>
          </div>
        </section>

        <Link to="/docs/manual" className="flex items-center justify-between p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800/50">
           <div className="flex items-center gap-4">
              <div className="p-2 bg-white dark:bg-indigo-900 rounded-xl text-indigo-600 dark:text-indigo-300"><Book className="w-5 h-5" /></div>
              <div>
                 <h4 className="font-bold text-slate-900 dark:text-white text-sm">Reference Manual</h4>
                 <p className="text-xs text-slate-500 dark:text-slate-400">Offline Documentation</p>
              </div>
           </div>
           <ChevronRight className="w-4 h-4 text-indigo-400" />
        </Link>
      </div>
    </div>
  );
};

// ==========================================
// 2. WEB LANDING PAGE (Professional Desktop/Web View)
// ==========================================
const WebLanding: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-emerald-500/30">
      {/* Shared Nav Component */}
      <nav className="fixed w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <Terminal className="w-5 h-5" />
            </div>
            <span className="text-xl font-black tracking-tighter">PyNum<span className="text-emerald-500">Studio</span></span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-6 mr-4">
                <a href="#features" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-emerald-600 transition-colors">Features</a>
                <a href="#mobile" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-emerald-600 transition-colors">Mobile</a>
            </div>
            <Link to="/tools/calculator" className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl">
              Launch Studio
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto space-y-24">
        
        {/* HERO SECTION */}
        <section className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 border border-emerald-100 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest">
              <Sparkles className="w-3 h-3" />
              Professional Grade Numerical Suite
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] text-slate-900 dark:text-white">
              Precision <br />
              <span className="text-emerald-600">Calculations</span> <br />
              at Scale.
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 font-medium max-w-md leading-relaxed">
              Interactive simulations, production-ready Python code, and symbolic math engines designed for the next generation of engineers.
            </p>
            <div className="flex flex-wrap gap-4">
               <Link to="/tools/calculator" className="flex items-center gap-3 bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-600/20">
                  <Play className="w-4 h-4 fill-current" />
                  Start Solving
               </Link>
               <a href="/APK/PyNum-app-release.apk" download className="flex items-center gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
                  <Download className="w-4 h-4" />
                  Get APK
               </a>
            </div>
            <div className="flex items-center gap-6 pt-4 grayscale opacity-50">
               <div className="flex items-center gap-2"><Code2 className="w-4 h-4"/> <span className="text-[10px] font-bold uppercase tracking-widest">Python 3.11+</span></div>
               <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4"/> <span className="text-[10px] font-bold uppercase tracking-widest">Verified Algos</span></div>
               <div className="flex items-center gap-2"><Globe className="w-4 h-4"/> <span className="text-[10px] font-bold uppercase tracking-widest">Offline Ready</span></div>
            </div>
          </div>

          {/* DASHBOARD PREVIEW CARD */}
          <div className="relative group hidden lg:block">
            <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-500/20 to-blue-500/20 rounded-[3rem] blur-2xl group-hover:opacity-100 transition-opacity opacity-50"></div>
            <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden p-8 space-y-6">
               <div className="flex items-center justify-between">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                  </div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Studio Preview</div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="h-32 bg-emerald-600 rounded-3xl p-5 text-white flex flex-col justify-between">
                    <Calculator className="w-6 h-6 opacity-50" />
                    <span className="font-bold">Scientific<br/>Calculator</span>
                  </div>
                  <div className="h-32 bg-slate-100 dark:bg-slate-800 rounded-3xl p-5 flex flex-col justify-between">
                    <Activity className="w-6 h-6 text-emerald-500" />
                    <span className="font-bold">2D Function<br/>Grapher</span>
                  </div>
               </div>
               <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-14 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50 flex items-center px-4 gap-4">
                      <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 shadow-sm"></div>
                      <div className="h-2 w-24 bg-slate-200 dark:bg-slate-600 rounded-full"></div>
                      <div className="ml-auto w-4 h-4 rounded-full border-2 border-slate-200 dark:border-slate-600"></div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </section>

        {/* FEATURE GRID */}
        <section id="features" className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter">Engineered for Accuracy.</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto">Explore a comprehensive suite of numerical methods with real-time step-by-step visualizations and code generation.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              icon={Zap} 
              title="Root Finding" 
              desc="Master non-linear equations with Bisection, Newton-Raphson, and Secant methods."
              algorithms={["Bisection", "Newton", "Fixed-Point"]}
              color="emerald"
            />
            <FeatureCard 
              icon={Grid3X3} 
              title="Linear Algebra" 
              desc="Solve massive systems of equations using Gaussian Elimination and Matrix Decompositions."
              algorithms={["LU", "QR", "Gauss-Seidel"]}
              color="blue"
            />
            <FeatureCard 
              icon={Cpu} 
              title="Interpolation" 
              desc="Construct smooth curves through discrete points using Splines and Lagrange polynomials."
              algorithms={["Cubic Spline", "Lagrange", "Newton"]}
              color="purple"
            />
            <FeatureCard 
              icon={Command} 
              title="Calculus Suite" 
              desc="Numerical integration and ODE solvers for complex dynamical systems."
              algorithms={["Runge-Kutta", "Simpson's", "Trapezoidal"]}
              color="amber"
            />
            <FeatureCard 
              icon={Laptop} 
              title="Cross Platform" 
              desc="Access your calculations on the web or download the native app for offline use."
              algorithms={["PWA Support", "Android APK", "Web Studio"]}
              color="indigo"
            />
            <FeatureCard 
              icon={Code2} 
              title="Code Generation" 
              desc="Instantly export your algorithms to production-ready Python, C++, or Fortran code."
              algorithms={["Python 3", "C++ 17", "Fortran 90"]}
              color="rose"
            />
          </div>
        </section>

        {/* MOBILE TEASER */}
        <section id="mobile" className="bg-slate-900 dark:bg-emerald-900/20 rounded-[3rem] p-8 md:p-16 overflow-hidden relative border border-white/5">
           <Smartphone className="absolute -bottom-20 -right-20 w-80 h-80 text-white/5 -rotate-12 hidden lg:block" />
           <div className="max-w-2xl space-y-8 relative z-10">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white leading-tight">Your lab, <br/>anywhere.</h2>
              <p className="text-slate-300 text-lg font-medium leading-relaxed">
                The PyNum Studio mobile application provides a distraction-free environment for engineering math, fully functional without an internet connection.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                 <a href="/APK/PyNum-app-release.apk" className="flex items-center gap-3 bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-400 transition-all">
                    <Download className="w-5 h-5" />
                    Download APK
                 </a>
                 <div className="flex items-center gap-3 px-8 py-4 text-white/50 text-[10px] font-black uppercase tracking-widest border border-white/10 rounded-2xl">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    v2.2.4 Verified
                 </div>
              </div>
           </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="py-20 border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
             <div className="col-span-2 space-y-6">
                <div className="flex items-center gap-2">
                   <Terminal className="w-6 h-6 text-emerald-600" />
                   <span className="text-lg font-black tracking-tighter uppercase">PyNum Studio</span>
                </div>
                <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
                  The ultimate workspace for numerical analysis and engineering mathematics. Precision tools for modern learners.
                </p>
             </div>
             <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Resources</h4>
                <ul className="space-y-2 text-sm font-bold">
                   <li><Link to="/docs/manual" className="hover:text-emerald-500 transition-colors">Documentation</Link></li>
                   <li><Link to="/tools/calculator" className="hover:text-emerald-500 transition-colors">Web App</Link></li>
                   <li><a href="https://github.com/shahaduddin" className="hover:text-emerald-500 transition-colors">Developer Portal</a></li>
                </ul>
             </div>
             <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Legal</h4>
                <p className="text-xs text-slate-500 font-medium">© 2026 Shahad Uddin.<br/>Built for educational purposes.</p>
             </div>
          </div>
      </footer>
    </div>
  );
};

// ==========================================
// SHARED UI COMPONENTS
// ==========================================

const AppModuleCard = ({ to, title, desc, icon: Icon, color }: any) => {
  const colors: any = {
    emerald: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20",
    blue: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20",
    purple: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20",
    amber: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20",
  };
  return (
    <Link to={to} className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm active:scale-[0.98] transition-all">
      <div className={`p-3 rounded-xl ${colors[color]}`}><Icon className="w-5 h-5" /></div>
      <div className="flex-1">
        <h4 className="font-bold text-slate-900 dark:text-white text-sm">{title}</h4>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{desc}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-300" />
    </Link>
  );
};

const FeatureCard = ({ icon: Icon, title, desc, algorithms, color }: any) => {
  const accentColors: any = {
    emerald: "group-hover:text-emerald-500",
    blue: "group-hover:text-blue-500",
    purple: "group-hover:text-purple-500",
    amber: "group-hover:text-amber-500",
    indigo: "group-hover:text-indigo-500",
    rose: "group-hover:text-rose-500",
  };
  
  return (
    <div className="group p-8 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition-all shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div className={`p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 transition-colors ${accentColors[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <ArrowRight className="w-5 h-5 text-slate-200 dark:text-slate-700 group-hover:text-emerald-500 transition-colors" />
      </div>
      <h3 className="text-xl font-black tracking-tight mb-3 uppercase">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-6">{desc}</p>
      <div className="flex flex-wrap gap-2">
        {algorithms.map((algo: string) => (
          <span key={algo} className="text-[9px] font-black uppercase tracking-widest px-2 py-1 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-md">
            {algo}
          </span>
        ))}
      </div>
    </div>
  );
};