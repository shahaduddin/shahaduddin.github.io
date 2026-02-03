import React, { useState, useEffect } from 'react';
import { AlgorithmType } from '../../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  AlertTriangle, Calculator, FileText, Grid3X3, ArrowRight, 
  Plus, Minus, Layers, FileInput, TrendingDown, 
  Maximize2, Box, ArrowRightLeft, Square, Columns
} from 'lucide-react';

interface LinearSystemDemoProps {
  type: AlgorithmType;
}

export const LinearSystemDemo: React.FC<LinearSystemDemoProps> = ({ type }) => {
  const [m, setM] = useState(3);
  const [n, setN] = useState(3);
  const [p, setP] = useState(3);
  
  const [maxIter, setMaxIter] = useState(50);
  const [tolerance, setTolerance] = useState(0.0001);
  const [inputMode, setInputMode] = useState<'grid' | 'text'>('grid');
  
  const [matrixA, setMatrixA] = useState<number[][]>([[4, 1, 1], [1, 5, 2], [1, 2, 4]]);
  const [matrixB, setMatrixB] = useState<number[][]>([[1, 0, 0], [0, 1, 0], [0, 0, 1]]);
  const [vectorB, setVectorB] = useState<number[]>([6, 8, 7]);

  const [textA, setTextA] = useState("");
  const [textB, setTextB] = useState("");
  
  const [resultX, setResultX] = useState<number[] | null>(null);
  const [matrixL, setMatrixL] = useState<number[][] | null>(null);
  const [matrixU, setMatrixU] = useState<number[][] | null>(null);
  const [matrixQ, setMatrixQ] = useState<number[][] | null>(null);
  const [matrixR, setMatrixR] = useState<number[][] | null>(null);
  const [matrixInv, setMatrixInv] = useState<number[][] | null>(null);
  const [resultMatrix, setResultMatrix] = useState<number[][] | null>(null);
  const [determinant, setDeterminant] = useState<number | null>(null);
  const [iterativeData, setIterativeData] = useState<{iter: number, error: number}[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isIterative = type === AlgorithmType.JACOBI || type === AlgorithmType.GAUSS_SEIDEL;
  const isMult = type === AlgorithmType.MATRIX_MULTIPLICATION;
  const isAddSub = type === AlgorithmType.MATRIX_ADDITION || type === AlgorithmType.MATRIX_SUBTRACTION;
  const isTranspose = type === AlgorithmType.MATRIX_TRANSPOSE;
  const isDecomp = [AlgorithmType.LU_DECOMPOSITION, AlgorithmType.CHOLESKY_DECOMPOSITION, AlgorithmType.QR_DECOMPOSITION].includes(type);
  const isInverseOrDet = type === AlgorithmType.MATRIX_INVERSE || type === AlgorithmType.MATRIX_DETERMINANT;
  
  const isSingleMatrixOp = isInverseOrDet || isTranspose || isDecomp;
  const isTwoMatrixOp = isMult || isAddSub;
  const isLinearSystem = !isTwoMatrixOp && !isSingleMatrixOp;

  // Strict check for algorithms that MUST be square
  const strictlySquare = isInverseOrDet || 
                        type === AlgorithmType.LU_DECOMPOSITION || 
                        type === AlgorithmType.CHOLESKY_DECOMPOSITION || 
                        isIterative || 
                        type === AlgorithmType.GAUSSIAN || 
                        type === AlgorithmType.GAUSS_JORDAN;

  useEffect(() => {
    if (strictlySquare && m !== n) {
      setN(m);
    }
  }, [m, n, strictlySquare]);

  useEffect(() => {
    // Ensure Matrix A dimension consistency
    const newA = Array.from({ length: m }, (_, i) => 
      Array.from({ length: n }, (_, j) => (matrixA[i] && matrixA[i][j] !== undefined) ? matrixA[i][j] : 0)
    );
    setMatrixA(newA);
    
    if (isLinearSystem) {
      const newVec = Array.from({ length: m }, (_, i) => vectorB[i] !== undefined ? vectorB[i] : 0);
      setVectorB(newVec);
    } else if (isTwoMatrixOp) {
      const rowsB = isMult ? n : m;
      const colsB = isMult ? p : n;
      const newB = Array.from({ length: rowsB }, (_, i) => 
        Array.from({ length: colsB }, (_, j) => (matrixB[i] && matrixB[i][j] !== undefined) ? matrixB[i][j] : 0)
      );
      setMatrixB(newB);
    }
    resetResults();
  }, [m, n, p, type]);

  const parseTextMatrix = (text: string) => {
    try {
        const val = text || '';
        const lines = val.trim().split(/[\n;]/);
        return lines.map(line => 
            (line || '').trim().split(/[\s,]+/).filter(v => v !== "").map(v => {
                const num = parseFloat(v);
                if (isNaN(num)) throw new Error("Invalid number");
                return num;
            })
        ).filter(row => row.length > 0);
    } catch (e) { return null; }
  };

  const handleApplyText = (target: 'A' | 'B') => {
      const data = parseTextMatrix(target === 'A' ? textA : textB);
      if (!data || data.length === 0) { setErrorMsg(`Failed to parse ${target} input.`); return; }
      if (target === 'A') { 
          setM(data.length); 
          setN(data[0]?.length || 0); 
          setMatrixA(data); 
      } 
      else {
          if (isLinearSystem) {
              const vec = data.flat();
              if (vec.length !== m) { setErrorMsg(`Vector length (${vec.length}) mismatch Matrix A rows (${m})`); return; }
              setVectorB(vec);
          } else { 
              setMatrixB(data); 
              if (isMult && data[0]) setP(data[0].length); 
          }
      }
      setErrorMsg(null); resetResults();
  };

  const resetResults = () => {
    setResultX(null); setMatrixL(null); setMatrixU(null); setMatrixQ(null); setMatrixR(null);
    setMatrixInv(null); setResultMatrix(null); setDeterminant(null); setIterativeData([]);
    setErrorMsg(null);
  };

  const initMatrix = (target: 'A' | 'B', mode: 'identity' | 'random') => {
    const rows = target === 'A' ? m : (isMult ? n : m);
    const cols = target === 'A' ? n : (isMult ? p : n);
    const newMat = Array.from({ length: rows }, (_, i) =>
        Array.from({ length: cols }, (_, j) => {
          if (mode === 'identity') return i === j ? 1 : 0;
          if (mode === 'random') return Math.floor(Math.random() * 10) - 5;
          return 0;
        })
    );
    if (target === 'A') setMatrixA(newMat); else setMatrixB(newMat);
    resetResults();
  };

  const solve = () => {
    resetResults();
    const A = matrixA.map(row => [...row]);
    const b = [...vectorB];
    try {
        if (isIterative) {
            let x = new Array(n).fill(0);
            const iterResults = [];
            for (let k = 1; k <= maxIter; k++) {
                const xNew = [...x];
                let maxDiff = 0;
                for (let i = 0; i < n; i++) {
                    let sum = 0;
                    for (let j = 0; j < n; j++) if (i !== j) sum += A[i][j] * (type === AlgorithmType.JACOBI ? x[j] : xNew[j]);
                    if (Math.abs(A[i][i]) < 1e-12) throw new Error("Zero diagonal element.");
                    xNew[i] = (b[i] - sum) / A[i][i];
                    maxDiff = Math.max(maxDiff, Math.abs(xNew[i] - x[i]));
                }
                iterResults.push({ iter: k, error: maxDiff });
                x = xNew;
                if (maxDiff < tolerance) break;
            }
            setResultX(x); setIterativeData(iterResults);
        } else if (type === AlgorithmType.GAUSSIAN || type === AlgorithmType.GAUSS_JORDAN) {
            for (let k = 0; k < m; k++) {
                let max = k; for (let i = k + 1; i < m; i++) if (Math.abs(A[i][k]) > Math.abs(A[max][k])) max = i;
                [A[k], A[max]] = [A[max], A[k]]; [b[k], b[max]] = [b[max], b[k]];
                if (Math.abs(A[k][k]) < 1e-12) throw new Error("Singular matrix detected.");
                if (type === AlgorithmType.GAUSS_JORDAN) {
                    const pivot = A[k][k]; for (let j = k; j < m; j++) A[k][j] /= pivot; b[k] /= pivot;
                    for (let i = 0; i < m; i++) if (i !== k) { const f = A[i][k]; for (let j = k; j < m; j++) A[i][j] -= f * A[k][j]; b[i] -= f * b[k]; }
                } else { for (let i = k + 1; i < m; i++) { const f = A[i][k] / A[k][k]; for (let j = k; j < m; j++) A[i][j] -= f * A[k][j]; b[i] -= f * b[k]; } }
            }
            if (type === AlgorithmType.GAUSS_JORDAN) setResultX(b);
            else { const x = new Array(m).fill(0); for (let i = m - 1; i >= 0; i--) { let s = 0; for (let j = i + 1; j < m; j++) s += A[i][j] * x[j]; x[i] = (b[i] - s) / A[i][i]; } setResultX(x); }
        } else if (type === AlgorithmType.CHOLESKY_DECOMPOSITION) {
            const L = Array.from({length:n}, () => new Array(n).fill(0));
            // Enhanced Cholesky Logic with Symmetry Check
            for (let i = 0; i < n; i++) {
                for (let j = 0; j < i; j++) {
                    if (Math.abs(A[i][j] - A[j][i]) > 1e-10) {
                        throw new Error("Cholesky decomposition requires a symmetric matrix. A[i][j] must equal A[j][i].");
                    }
                }
            }
            for (let i = 0; i < n; i++) {
                for (let j = 0; j <= i; j++) {
                    let sum = 0;
                    for (let k = 0; k < j; k++) {
                        sum += L[i][k] * L[j][k];
                    }
                    if (i === j) {
                        const val = A[i][i] - sum;
                        if (val <= 0) throw new Error("Matrix is not positive definite. Encountered non-positive diagonal during decomposition.");
                        L[i][j] = Math.sqrt(val);
                    } else {
                        if (Math.abs(L[j][j]) < 1e-15) throw new Error("Numerical instability: zero diagonal pivot in Cholesky.");
                        L[i][j] = (A[i][j] - sum) / L[j][j];
                    }
                }
            }
            setMatrixL(L);
        } else if (type === AlgorithmType.QR_DECOMPOSITION) {
            const Q = Array.from({length:m}, () => new Array(n).fill(0)), R = Array.from({length:n}, () => new Array(n).fill(0));
            for (let j = 0; j < n; j++) {
                let v = A.map(row => row[j]);
                for (let i = 0; i < j; i++) { R[i][j] = Q.reduce((acc, row, idx) => acc + row[i] * A[idx][j], 0); v = v.map((val, idx) => val - R[i][j] * Q[idx][i]); }
                R[j][j] = Math.sqrt(v.reduce((acc, val) => acc + val*val, 0)); v.forEach((val, idx) => Q[idx][j] = val / R[j][j]);
            }
            setMatrixQ(Q); setMatrixR(R);
        } else if (type === AlgorithmType.LU_DECOMPOSITION) {
            const L: number[][] = Array.from({length:m}, (_,i)=>Array.from({length:m}, (_,j)=>i===j?1:0)), U = Array.from({length:m}, () => new Array(m).fill(0));
            for(let i=0; i<m; i++) {
                for(let k=i; k<m; k++) { let s=0; for(let j=0; j<i; j++) s+=L[i][j]*U[j][k]; U[i][k]=A[i][k]-s; }
                for(let k=i+1; k<m; k++) { let s=0; for(let j=0; j<i; j++) s+=L[k][j]*U[j][i]; L[k][i]=(A[k][i]-s)/U[i][i]; }
            }
            setMatrixL(L); setMatrixU(U);
        } else if (type === AlgorithmType.MATRIX_INVERSE) {
            const M = A.map((row, i) => [...row, ...Array.from({length:m}, (_,j)=>i===j?1:0)]);
            for (let k = 0; k < m; k++) {
                if (Math.abs(M[k][k]) < 1e-12) throw new Error("Singular Matrix.");
                const pivot = M[k][k]; for (let j = k; j < 2*m; j++) M[k][j] /= pivot;
                for (let i = 0; i < m; i++) if (i !== k) { const f = M[i][k]; for (let j = k; j < 2*m; j++) M[i][j] -= f * M[k][j]; }
            }
            setMatrixInv(M.map(row => row.slice(m, 2*m)));
        } else if (isMult) {
            setResultMatrix(Array.from({length:m}, (_,i) => Array.from({length:p}, (_,j) => matrixA[i].reduce((s, a_ik, k) => s + a_ik * matrixB[k][j], 0))));
        } else if (isAddSub) {
            const sign = type === AlgorithmType.MATRIX_ADDITION ? 1 : -1;
            setResultMatrix(A.map((r, i) => r.map((v, j) => v + sign * matrixB[i][j])));
        } else if (isTranspose) { setResultMatrix(Array.from({length:n}, (_,i) => Array.from({length:m}, (_,j) => A[j][i]))); }
        else if (type === AlgorithmType.MATRIX_DETERMINANT) {
            let det = 1, swaps = 0; const tempA = A.map(r => [...r]);
            for (let k = 0; k < m; k++) {
                let max = k; for (let i = k + 1; i < m; i++) if (Math.abs(tempA[i][k]) > Math.abs(tempA[max][k])) max = i;
                if (k !== max) { [tempA[k], tempA[max]] = [tempA[max], tempA[k]]; swaps++; }
                if (Math.abs(tempA[k][k]) < 1e-12) { det = 0; break; }
                for (let i = k + 1; i < m; i++) { const f = tempA[i][k] / tempA[k][k]; for (let j = k; j < m; j++) tempA[i][j] -= f * tempA[k][j]; }
            }
            if (det !== 0) { for(let i=0; i<m; i++) det *= tempA[i][i]; if (swaps % 2 !== 0) det = -det; }
            setDeterminant(det);
        }
    } catch (e: any) { setErrorMsg(e.message); }
  };

  const renderMatrixDisplay = (mat: number[][], title: string) => {
      if (!mat || mat.length === 0) return null;
      return (
          <div className="flex flex-col items-center gap-3">
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">{title}</span>
              <div className="relative group">
                  <div className="absolute -left-3 top-0 bottom-0 w-1.5 bg-slate-200 dark:bg-slate-700 rounded-l-full"></div>
                  <div className="absolute -right-3 top-0 bottom-0 w-1.5 bg-slate-200 dark:bg-slate-700 rounded-r-full"></div>
                  <div className="grid gap-2 p-1" style={{ gridTemplateColumns: `repeat(${mat[0]?.length || 1}, minmax(0, 1fr))` }}>
                      {mat.map((r, idx) => r.map((v, jdx) => (
                          <div key={`${idx}-${jdx}`} className={`min-w-[56px] h-11 flex items-center justify-center text-[12px] font-mono font-bold rounded-xl transition-all shadow-sm ${Math.abs(v) < 1e-8 ? 'bg-slate-50 dark:bg-slate-800/30 text-slate-300 dark:text-slate-700' : 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 border border-slate-100 dark:border-slate-700'}`}>
                              {Math.abs(v) < 1e-5 ? '0' : (v % 1 === 0 ? v : v.toFixed(3))}
                          </div>
                      )))}
                  </div>
              </div>
          </div>
      );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Redesigned Input Panel */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm transition-colors">
         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-10 pb-8 border-b border-slate-100 dark:border-slate-800">
             
             {/* Mode & Dimension Selectors */}
             <div className="flex flex-wrap items-center gap-6">
                 <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner">
                    <button onClick={() => setInputMode('grid')} className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${inputMode === 'grid' ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-100 dark:border-slate-700' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'}`}><Grid3X3 className="w-4 h-4" /> Interactive Grid</button>
                    <button onClick={() => setInputMode('text')} className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${inputMode === 'text' ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-100 dark:border-slate-700' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'}`}><FileText className="w-4 h-4" /> Bulk Text</button>
                 </div>
                 
                 <div className="h-10 w-px bg-slate-200 dark:bg-slate-800 hidden md:block"></div>
                 
                 <div className="flex items-center gap-4">
                    {strictlySquare ? (
                        <DimensionControl 
                          label="Dimension (n x n)" 
                          value={m} 
                          onChange={v => {setM(v); setN(v);}} 
                          icon={Square}
                        />
                    ) : (
                        <>
                           <DimensionControl label="Rows (m)" value={m} onChange={v => setM(v)} icon={Maximize2} />
                           <DimensionControl label="Cols (n)" value={n} onChange={v => setN(v)} icon={Columns} />
                           {isMult && <DimensionControl label="B Cols (p)" value={p} onChange={v => setP(v)} icon={ArrowRightLeft} />}
                        </>
                    )}
                 </div>
             </div>
             
             <button onClick={solve} className="w-full lg:w-auto h-14 px-10 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl shadow-xl shadow-emerald-600/20 active:scale-95 transition-all flex items-center justify-center gap-3 text-[11px] uppercase tracking-widest">
                 <Calculator className="w-5 h-5" /> Execute Logic
             </button>
         </div>

         {inputMode === 'grid' ? (
             <div className="flex flex-col xl:flex-row items-center justify-center gap-12 py-4">
                 <div className="flex-1 w-full space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2"><Box className="w-3.5 h-3.5" /> Source Matrix (A)</span>
                        <div className="flex gap-2">
                            <button onClick={() => initMatrix('A', 'identity')} className="px-3 py-1 text-[9px] font-black bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-lg border border-slate-200 dark:border-slate-700 hover:text-emerald-500 transition-all uppercase">Identity</button>
                            <button onClick={() => initMatrix('A', 'random')} className="px-3 py-1 text-[9px] font-black bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-lg border border-slate-200 dark:border-slate-700 hover:text-emerald-500 transition-all uppercase">Random</button>
                        </div>
                    </div>
                    <div className="grid gap-3 p-6 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-inner overflow-auto" style={{ gridTemplateColumns: `repeat(${n}, minmax(64px, 1fr))` }}>
                        {matrixA.map((row, i) => row.map((val, j) => (
                            <input key={`A-${i}-${j}`} type="number" value={val} onChange={e => {
                                const newMat = [...matrixA]; newMat[i] = [...newMat[i]]; newMat[i][j] = parseFloat(e.target.value) || 0; setMatrixA(newMat); resetResults();
                            }} className="w-full h-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-center text-sm font-mono font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-slate-900 dark:text-slate-100" />
                        )))}
                    </div>
                 </div>

                 {!isSingleMatrixOp && <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-full text-emerald-600 hidden xl:block shadow-sm"><ArrowRight className="w-6 h-6" /></div>}

                 {!isSingleMatrixOp && (
                    <div className="flex-1 w-full space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                {isLinearSystem ? <Layers className="w-3.5 h-3.5" /> : <Box className="w-3.5 h-3.5" />}
                                {isLinearSystem ? `Target Vector (b)` : `Modifier Matrix (B)`}
                            </span>
                        </div>
                        {isLinearSystem ? (
                            <div className="flex flex-col gap-3 p-6 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-inner w-fit mx-auto min-w-[120px]">
                                {vectorB.map((val, i) => (
                                    <input key={`b-${i}`} type="number" value={val} onChange={e => {
                                        const newVec = [...vectorB]; newVec[i] = parseFloat(e.target.value) || 0; setVectorB(newVec); resetResults();
                                    }} className="w-20 h-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-center text-sm font-mono font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-slate-900 dark:text-slate-100" />
                                ))}
                            </div>
                        ) : (
                            <div className="grid gap-3 p-6 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-inner overflow-auto" style={{ gridTemplateColumns: `repeat(${isMult ? p : n}, minmax(64px, 1fr))` }}>
                                {matrixB.map((row, i) => row.map((val, j) => (
                                    <input key={`B-${i}-${j}`} type="number" value={val} onChange={e => {
                                        const newMat = [...matrixB]; newMat[i] = [...newMat[i]]; newMat[i][j] = parseFloat(e.target.value) || 0; setMatrixB(newMat); resetResults();
                                    }} className="w-full h-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-center text-sm font-mono font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-slate-900 dark:text-slate-100" />
                                )))}
                            </div>
                        )}
                    </div>
                 )}
             </div>
         ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-4 animate-in slide-in-from-top-4 duration-500">
                <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase px-1 tracking-widest">Matrix A Notation</label>
                    <textarea value={textA} onChange={e => setTextA(e.target.value)} className="w-full h-56 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 font-mono text-sm outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all text-slate-900 dark:text-slate-100 shadow-inner" placeholder="1 2 3&#10;4 5 6" />
                    <button onClick={() => handleApplyText('A')} className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-[0.98]"><FileInput className="w-4 h-4" /> Sync Matrix A</button>
                </div>
                {!isSingleMatrixOp && (
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase px-1 tracking-widest">{isLinearSystem ? 'Vector b' : 'Matrix B'}</label>
                        <textarea value={textB} onChange={e => setTextB(e.target.value)} className="w-full h-56 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 font-mono text-sm outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all text-slate-900 dark:text-slate-100 shadow-inner" placeholder={isLinearSystem ? "6 8 7" : "1 0 0"} />
                        <button onClick={() => handleApplyText('B')} className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-[0.98]"><FileInput className="w-4 h-4" /> Sync Input B</button>
                    </div>
                )}
            </div>
         )}

         {errorMsg && (
            <div className="mt-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-5 py-4 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2 shadow-sm">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                <span className="text-[11px] font-black uppercase tracking-tight">{errorMsg}</span>
            </div>
         )}
      </div>

      {/* Results and Stats Panel */}
      {(resultMatrix || matrixInv || determinant !== null || resultX || matrixL || matrixU || matrixQ || matrixR) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-700">
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-10 shadow-sm flex flex-col items-center justify-center gap-12 min-h-[400px] relative overflow-hidden transition-colors">
                <div className="absolute top-6 left-8">
                    <h3 className="text-emerald-700 dark:text-emerald-400 font-black flex items-center gap-2 text-[10px] uppercase tracking-[0.3em]"><Layers className="w-4 h-4" /> Resolved States</h3>
                </div>

                {determinant !== null && (
                    <div className="text-center animate-in zoom-in-95">
                        <span className="text-slate-400 dark:text-slate-500 font-black uppercase text-[10px] tracking-[0.3em] block mb-6">Characteristic Determinant</span>
                        <div className="text-7xl font-mono font-black text-slate-900 dark:text-emerald-400 tracking-tighter drop-shadow-sm">{determinant.toFixed(4)}</div>
                    </div>
                )}
                
                {resultX && (
                    <div className="w-full max-w-sm space-y-4 animate-in fade-in">
                        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] text-center block">Calculated Result Vector (x)</span>
                        <div className="space-y-3">
                            {resultX.map((v, i) => (
                                <div key={i} className="flex items-center justify-between bg-slate-50 dark:bg-slate-950 px-6 py-4 rounded-2xl border border-slate-100 dark:border-slate-800 transition-colors group hover:border-emerald-500">
                                    <span className="text-[11px] font-black text-slate-400 dark:text-slate-500 font-mono uppercase tracking-widest">x[{i+1}]</span>
                                    <span className="text-2xl font-mono font-black text-emerald-600 dark:text-emerald-400 tracking-tight">{v.toFixed(6)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {(matrixL || matrixU || matrixQ || matrixR) && (
                    <div className="flex flex-wrap justify-center gap-16 animate-in slide-in-from-top-2">
                        {matrixL && renderMatrixDisplay(matrixL, type === AlgorithmType.CHOLESKY_DECOMPOSITION ? "Cholesky Factor (L)" : "Lower Triangular (L)")}
                        {matrixU && renderMatrixDisplay(matrixU, "Upper Triangular (U)")}
                        {matrixQ && renderMatrixDisplay(matrixQ, "Orthonormal (Q)")}
                        {matrixR && renderMatrixDisplay(matrixR, "Upper Triangular (R)")}
                    </div>
                )}

                {(resultMatrix || matrixInv) && (
                    <div className="flex flex-col items-center gap-4 animate-in slide-in-from-top-2">
                        {renderMatrixDisplay((resultMatrix || matrixInv)!, isTranspose ? "Transposed Matrix" : isInverseOrDet ? "Calculated Inverse" : "Resultant Matrix")}
                    </div>
                )}
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm space-y-8 transition-colors flex flex-col h-full relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity"><TrendingDown className="w-32 h-32 text-emerald-500 rotate-12" /></div>
                
                <h3 className="text-slate-500 dark:text-slate-400 font-black flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] relative z-10"><Calculator className="w-4 h-4" /> Efficiency Profile</h3>
                
                {isIterative && iterativeData.length > 0 ? (
                    <div className="flex-1 flex flex-col relative z-10">
                        <div className="h-56">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={iterativeData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} vertical={false} />
                                    <XAxis dataKey="iter" stroke="#94a3b8" tick={{fontSize: 9, fill: '#94a3b8', fontWeight: 700}} />
                                    <YAxis scale="log" domain={['auto', 'auto']} stroke="#94a3b8" tick={{fontSize: 9, fill: '#94a3b8', fontWeight: 700}} />
                                    <Tooltip contentStyle={{fontSize:10, borderRadius: '12px', border: '1px solid #f1f5f9'}} />
                                    <Line type="monotone" dataKey="error" stroke="#10b981" strokeWidth={3} dot={false} isAnimationActive={true} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-8 p-5 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-800">
                           <span className="text-[9px] font-black uppercase text-emerald-700 dark:text-emerald-500 tracking-widest block mb-2 leading-none">Iteration Path</span>
                           <p className="text-xs text-emerald-800/80 dark:text-emerald-400 font-medium leading-relaxed italic">System stabilized in {iterativeData.length} steps within specified tolerance.</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 space-y-6 relative z-10">
                        <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic font-medium transition-colors">
                            "Calculated using a direct solver architecture (Gaussian/LU/Cholesky). This ensures exact precision O(n³) without the overhead of iterative convergence checks."
                        </div>
                        <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                           <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest block mb-2">Complexity</span>
                           <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase">Arithmetic Ops</span>
                              <span className="text-xs font-mono font-black text-emerald-600">~{Math.pow(m, 3).toLocaleString()}</span>
                           </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
};

const DimensionControl = ({ label, value, onChange, icon: Icon }: { label: string, value: number, onChange: (v: number) => void, icon: any }) => (
    <div className="flex flex-col gap-2 min-w-[120px] group">
        <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase px-1 tracking-widest flex items-center gap-1.5 leading-none transition-colors group-hover:text-emerald-600">
            <Icon className="w-3 h-3" /> {label}
        </span>
        <div className="flex items-center bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden h-10 shadow-sm transition-all group-focus-within:border-emerald-500 group-focus-within:ring-4 group-focus-within:ring-emerald-500/5">
            <button onClick={() => value > 1 && onChange(value-1)} className="px-3 h-full hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-slate-400 dark:text-slate-600 hover:text-emerald-600 transition-all border-r border-slate-100 dark:border-slate-800"><Minus className="w-3.5 h-3.5" /></button>
            <div className="flex-1 text-center text-xs font-black text-slate-700 dark:text-slate-200 font-mono tracking-widest">{value}</div>
            <button onClick={() => value < 8 && onChange(value+1)} className="px-3 h-full hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-slate-400 dark:text-slate-600 hover:text-emerald-600 transition-all border-l border-slate-100 dark:border-slate-800"><Plus className="w-3.5 h-3.5" /></button>
        </div>
    </div>
);
