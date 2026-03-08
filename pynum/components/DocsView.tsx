import React from 'react';
import { 
  BookText, Sigma, Code, Cpu, Activity, Lightbulb, 
  ChevronRight, Info, Command, AlertTriangle, 
  Target, Zap, ShieldAlert, BarChart3, HelpCircle,
  Play, MousePointer2, Settings, Download, ListChecks,
  BrainCircuit, GraduationCap, Microscope, Gauge,
  Grid3X3, Calculator, Wrench, TrendingUp
} from 'lucide-react';
import { AlgorithmType, TopicCategory } from '../types';
import { THEORY_CONTENT } from '../constants';

export const DocsView: React.FC = () => {
  const allAlgos = Object.values(AlgorithmType);

  return (
    <div className="space-y-20 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-5xl mx-auto pb-32">
      {/* Immersive Header */}
      <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-16 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden transition-colors">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 bg-emerald-600 text-white rounded-2xl shadow-xl shadow-emerald-600/20">
              <BookText className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter">Reference Manual</h1>
              <p className="text-emerald-600 dark:text-emerald-400 text-sm font-black uppercase tracking-[0.3em] mt-2">Numerical Analysis Studio v2.3</p>
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-300 text-xl leading-relaxed max-w-3xl font-medium">
            Welcome to the definitive guide for PyNum Studio. Whether you're a student solving transcendental equations or an engineer benchmarking linear systems, this manual provides the clarity you need.
          </p>
        </div>
      </section>

      {/* Quick Start Guide */}
      <section className="space-y-8">
        <div className="flex items-center gap-3">
          <Play className="w-6 h-6 text-emerald-500" />
          <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Quick Start Guide</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { icon: ListChecks, title: "Select Method", desc: "Choose an algorithm from the sidebar categorized by math topic." },
            { icon: Command, title: "Input Function", desc: "Type your equation using standard syntax (e.g., x^2 + sin(x))." },
            { icon: Settings, title: "Adjust Parameters", desc: "Set initial guesses, step sizes, and error tolerances." },
            { icon: Zap, title: "Visualize Results", desc: "Click 'Solve' to see the iteration path and convergence plot." }
          ].map((step, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-3 group hover:border-emerald-500 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <step.icon className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">{i + 1}. {step.title}</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Studio Utilities Section */}
      <section className="space-y-8">
        <div className="flex items-center gap-3">
          <Wrench className="w-6 h-6 text-emerald-500" />
          <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Studio Utilities</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Scientific Calculator Manual */}
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 group hover:border-emerald-500 transition-all">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <Calculator className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Scientific Calculator</h3>
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Precision Engine</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              A robust environment for immediate mathematical computation with high-precision output and historical tracking.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-tighter">Advanced Syntax</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Supports standard math functions, constants like <code>pi</code> and <code>e</code>, and complex nesting of operations.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-tighter">Activity Memory</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Access the sidebar log to review previous steps. Clicking any entry copies the expression back to the main input.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-tighter">Angle Logic</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Easily toggle between Degrees (DEG) and Radians (RAD) for trigonometric functions without re-writing expressions.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Function Grapher Manual */}
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 group hover:border-blue-500 transition-all">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Function Grapher</h3>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Visual Workspace</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Explore functional behaviors visually. Perfect for identifying root locations and visualizing derivatives.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-tighter">Variable Binding</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Use <code>a, b, c...</code> in your equations to automatically generate interactive value sliders in the sidebar.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-tighter">Analytical Overlays</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Toggle "Draw Grid" or "Axis Labels" in the Config menu. Use the Activity and Layers icons for derivatives and area fills.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-tighter">Data Export</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Export the coordinates of all visible functions to a CSV file for detailed analysis in external environments like Python/NumPy.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Parameter deep-dive */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Gauge className="w-5 h-5 text-blue-500" /> Understanding Parameters
          </h3>
          <div className="space-y-4">
            <div className="p-5 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl">
              <h5 className="text-[10px] font-black uppercase text-blue-600 mb-1">Tolerance (ε)</h5>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                The stopping criterion. When the relative error falls below this value, the algorithm is considered "converged." 
                <strong> Standard: 1e-6</strong>.
              </p>
            </div>
            <div className="p-5 bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-2xl">
              <h5 className="text-[10px] font-black uppercase text-amber-600 mb-1">Step Size (h)</h5>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Crucial for derivatives and ODEs. Smaller <em>h</em> reduces truncation error but increases round-off sensitivity.
              </p>
            </div>
            <div className="p-5 bg-purple-50/50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30 rounded-2xl">
              <h5 className="text-[10px] font-black uppercase text-purple-600 mb-1">Initial Guess (x₀)</h5>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Open methods (Newton-Raphson, Secant) are sensitive to <em>x₀</em>. A poor guess can lead to divergence or cycles.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Microscope className="w-5 h-5 text-emerald-500" /> Error Types
          </h3>
          <div className="bg-slate-900 rounded-[2rem] p-8 border border-slate-800 space-y-6 shadow-2xl">
            <div className="flex gap-4">
              <div className="w-1.5 h-12 bg-red-500 rounded-full shrink-0"></div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white uppercase">Truncation Error</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">The difference between the exact mathematical solution and the value computed by a numerical process (e.g., using only 5 terms of a Taylor series).</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-1.5 h-12 bg-blue-500 rounded-full shrink-0"></div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white uppercase">Round-Off Error</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">Resulting from the finite number of bits used to store numbers in memory. Cumulative in high-iteration processes.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-1.5 h-12 bg-amber-500 rounded-full shrink-0"></div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white uppercase">Ill-Conditioning</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">A property of the mathematical problem where small input changes lead to massive output changes. Common in Hilbert Matrices.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Reference Catalog */}
      <section className="space-y-8">
        <div className="flex items-center gap-3">
          <GraduationCap className="w-6 h-6 text-emerald-500" />
          <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Learning Path & Topic Breakdown</h2>
        </div>

        <div className="space-y-4">
          <details className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm open:ring-2 open:ring-emerald-500/20 transition-all" open>
            <summary className="p-6 cursor-pointer flex items-center justify-between font-black text-slate-900 dark:text-white uppercase tracking-wider list-none">
              <span className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-red-500" /> 1. Roots of Equations (Zero-finding)
              </span>
              <ChevronRight className="w-5 h-5 group-open:rotate-90 transition-transform text-slate-400" />
            </summary>
            <div className="px-6 pb-8 space-y-6 border-t border-slate-100 dark:border-slate-800 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <h6 className="text-xs font-black text-emerald-600 uppercase">Bracketing vs Open</h6>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    <strong>Bracketing Methods</strong> (Bisection, False Position) require two points that "bracket" the root. They are slow but always converge if the function is continuous.
                    <br/><br/>
                    <strong>Open Methods</strong> (Newton-Raphson, Secant) only need one point (or two close ones) and do not require a sign change. They are extremely fast but can diverge if started too far from the root.
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl space-y-4">
                  <h6 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recommended Order</h6>
                  <ul className="space-y-2">
                    {["Incremental Search (Locate it)", "Bisection (Safe start)", "Newton-Raphson (Fast finish)"].map((t, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                        <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[8px]">{i+1}</div>
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </details>

          <details className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm open:ring-2 open:ring-emerald-500/20 transition-all">
            <summary className="p-6 cursor-pointer flex items-center justify-between font-black text-slate-900 dark:text-white uppercase tracking-wider list-none">
              <span className="flex items-center gap-3">
                <Grid3X3 className="w-5 h-5 text-blue-500" /> 2. Linear Systems & Matrix Operations
              </span>
              <ChevronRight className="w-5 h-5 group-open:rotate-90 transition-transform text-slate-400" />
            </summary>
            <div className="px-6 pb-8 space-y-6 border-t border-slate-100 dark:border-slate-800 pt-6">
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
                Modern engineering relies on solving massive linear systems of the form <strong>Ax = b</strong>. PyNum provides both direct solvers (for exact solutions) and iterative solvers (for large sparse systems).
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                  <h6 className="text-[10px] font-black text-blue-600 uppercase mb-2">Direct Solvers</h6>
                  <p className="text-[11px] text-slate-500">Gaussian Elimination, LU Decomposition. Best for n &lt; 1000.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                  <h6 className="text-[10px] font-black text-amber-600 uppercase mb-2">Iterative Solvers</h6>
                  <p className="text-[11px] text-slate-500">Jacobi, Gauss-Seidel. Used when memory is low or matrices are sparse.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                  <h6 className="text-[10px] font-black text-purple-600 uppercase mb-2">Decompositions</h6>
                  <p className="text-[11px] text-slate-500">Cholesky (Symmetric PD), QR (Orthonormal). Essential for Eigenvalues.</p>
                </div>
              </div>
            </div>
          </details>

          <details className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm open:ring-2 open:ring-emerald-500/20 transition-all">
            <summary className="p-6 cursor-pointer flex items-center justify-between font-black text-slate-900 dark:text-white uppercase tracking-wider list-none">
              <span className="flex items-center gap-3">
                <Cpu className="w-5 h-5 text-purple-500" /> 3. Interpolation & Approximation
              </span>
              <ChevronRight className="w-5 h-5 group-open:rotate-90 transition-transform text-slate-400" />
            </summary>
            <div className="px-6 pb-8 space-y-6 border-t border-slate-100 dark:border-slate-800 pt-6">
              <div className="bg-purple-50/50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800/30 p-6 rounded-2xl flex gap-4">
                <AlertTriangle className="w-6 h-6 text-purple-600 shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm text-purple-900 dark:text-purple-300 font-bold">Runge's Phenomenon</p>
                  <p className="text-xs text-purple-800/70 dark:text-purple-400/70 leading-relaxed">
                    Higher-order polynomial interpolation often causes "wiggles" at the edge of datasets. 
                    <strong> Solution:</strong> Use Splines (Cubic) for smooth, piecewise-defined curves.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <h6 className="text-xs font-black uppercase text-slate-400">Lagrange vs Newton</h6>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Lagrange is mathematically elegant for small sets. Newton's Divided Difference is computationally efficient when adding new data points to an existing model.</p>
                 </div>
                 <div className="space-y-4">
                    <h6 className="text-xs font-black uppercase text-slate-400">Even Spacing</h6>
                    <p className="text-sm text-slate-600 dark:text-slate-400">If your data nodes are equally distanced, use <em>Newton Forward/Backward</em> for rapid calculation using the operator table.</p>
                 </div>
              </div>
            </div>
          </details>

          <details className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm open:ring-2 open:ring-emerald-500/20 transition-all">
            <summary className="p-6 cursor-pointer flex items-center justify-between font-black text-slate-900 dark:text-white uppercase tracking-wider list-none">
              <span className="flex items-center gap-3">
                <Calculator className="w-5 h-5 text-emerald-500" /> 4. Integration & Differentiation
              </span>
              <ChevronRight className="w-5 h-5 group-open:rotate-90 transition-transform text-slate-400" />
            </summary>
            <div className="px-6 pb-8 space-y-6 border-t border-slate-100 dark:border-slate-800 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                   <h6 className="text-xs font-black uppercase text-emerald-600">Calculus Approximations</h6>
                   <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                     When analytic integration is impossible (e.g., e^-x²), numerical methods approximate the area under the curve using simple geometric shapes (trapezoids or parabolas).
                   </p>
                   <ul className="space-y-2 text-xs text-slate-500">
                     <li>• <strong>Trapezoidal:</strong> Error O(h²) - simple, reliable.</li>
                     <li>• <strong>Simpson's 1/3:</strong> Error O(h⁴) - requires even intervals, high precision.</li>
                   </ul>
                </div>
                <div className="space-y-4">
                   <h6 className="text-xs font-black uppercase text-blue-600">Finite Differences</h6>
                   <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                     Approximating <em>df/dx</em>. Forward and Backward differences have error O(h), while Central difference achieves O(h²) by canceling out second-order error terms.
                   </p>
                </div>
              </div>
            </div>
          </details>
        </div>
      </section>

      {/* Advanced Reference Table */}
      <section className="space-y-8">
        <div className="flex items-center gap-3">
          <Target className="w-6 h-6 text-emerald-500" />
          <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Method Comparison</h2>
        </div>

        <div className="overflow-hidden border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-sm">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Method</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Convergence</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Best Use Case</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest text-red-500">Key Limitation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900/50">
              {[
                { name: "Bisection", rate: "Linear", use: "Standard safe start", limit: "Slowest method" },
                { name: "Newton-Raphson", rate: "Quadratic", use: "Real-time physics", limit: "Fails at extrema (df/dx=0)" },
                { name: "Secant", rate: "Superlinear", use: "Fast but no analytic derivative", limit: "Can oscillate" },
                { name: "Gauss-Seidel", rate: "Linear", use: "Sparse matrices", limit: "Requires Diagonal Dominance" },
                { name: "Cubic Spline", rate: "O(h⁴)", use: "CAD/Pathfinding", limit: "Piecewise complexity" },
                { name: "Runge-Kutta (RK4)", rate: "O(h⁴)", use: "Satellite trajectories", limit: "Higher cost per step" }
              ].map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-black text-slate-900 dark:text-slate-100 text-xs uppercase tracking-tighter">{row.name}</td>
                  <td className="px-6 py-4 text-emerald-600 dark:text-emerald-400 text-xs font-bold">{row.rate}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400 text-xs leading-relaxed">{row.use}</td>
                  <td className="px-6 py-4 text-red-600/80 dark:text-red-400/80 text-xs italic leading-relaxed">{row.limit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Tips & Tricks */}
      <section className="bg-slate-900 rounded-[2.5rem] p-8 md:p-16 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute bottom-0 right-0 p-8 opacity-5">
           <BrainCircuit className="w-64 h-64 text-white" />
        </div>
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="space-y-6">
            <h3 className="text-2xl font-black text-white flex items-center gap-3">
              <Zap className="w-6 h-6 text-amber-500" /> Interaction Tips
            </h3>
            <div className="space-y-8">
               <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/5 font-black text-emerald-400 text-sm">01</div>
                  <div className="space-y-1">
                    <p className="text-white text-sm font-bold">Smart Variable Binding</p>
                    <p className="text-slate-400 text-xs leading-relaxed">In the Grapher and Calculator, use variables like 'a' or 'b'. The studio will automatically create real-time sliders for these values.</p>
                  </div>
               </div>
               <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/5 font-black text-emerald-400 text-sm">02</div>
                  <div className="space-y-1">
                    <p className="text-white text-sm font-bold">Interactive Iterations</p>
                    <p className="text-slate-400 text-xs leading-relaxed">Most iteration tables are clickable. Selecting a row will highlight that specific numerical step on the accompanying chart.</p>
                  </div>
               </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-black text-white flex items-center gap-3">
              <Download className="w-6 h-6 text-blue-500" /> Export Capabilities
            </h3>
            <div className="space-y-4">
              <div className="p-5 bg-white/5 border border-white/5 rounded-2xl hover:border-emerald-500/30 transition-colors">
                <h6 className="text-[10px] font-black uppercase text-emerald-400 mb-1 tracking-widest">CSV Data</h6>
                <p className="text-[11px] text-slate-300">Export interpolation nodes or graph coordinates for external analysis in Python (NumPy) or Excel.</p>
              </div>
              <div className="p-5 bg-white/5 border border-white/5 rounded-2xl hover:border-blue-500/30 transition-colors">
                <h6 className="text-[10px] font-black uppercase text-blue-400 mb-1 tracking-widest">Multi-Lang Code</h6>
                <p className="text-[11px] text-slate-300">Toggle between Python, C++, and Fortran in the 'Code' tab to see how the mathematical logic maps to production hardware.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Support */}
      <div className="flex flex-col items-center gap-6 text-center">
         <div className="w-px h-16 bg-gradient-to-b from-transparent via-slate-300 dark:via-slate-700 to-transparent"></div>
         <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-[0.4em] flex items-center gap-3">
           <HelpCircle className="w-4 h-4" /> End of reference manual
         </p>
         <div className="flex gap-4">
            <button className="px-6 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-[10px] font-black uppercase tracking-widest hover:border-emerald-500 transition-colors">Report Discrepancy</button>
            <button className="px-6 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-[10px] font-black uppercase tracking-widest hover:border-emerald-500 transition-colors">Request Method</button>
         </div>
      </div>
    </div>
  );
};