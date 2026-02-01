import React, { useState, useEffect } from 'react';
import { AlgorithmType } from '../../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle, Calculator, FileText, Grid3X3, ArrowRight, Table, Plus, Minus, Hash, Layers, FileInput, TrendingDown, RefreshCw } from 'lucide-react';

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
  const needsSquare = isLinearSystem || isInverseOrDet || type === AlgorithmType.LU_DECOMPOSITION || type === AlgorithmType.CHOLESKY_DECOMPOSITION;

  useEffect(() => {
    if (needsSquare && m !== n) setN(m);
  }, [m, needsSquare]);

  useEffect(() => {
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
        const lines = text.trim().split(/[\n;]/);
        return lines.map(line => 
            line.trim().split(/[\s,]+/).filter(v => v !== "").map(v => {
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
      if (target === 'A') { setM(data.length); setN(data[0]?.length || 0); setMatrixA(data); } 
      else {
          if (isLinearSystem) {
              const vec = data.flat();
              if (vec.length !== m) { setErrorMsg(`Vector length (${vec.length}) mismatch Matrix A rows (${m})`); return; }
              setVectorB(vec);
          } else { setMatrixB(data); if (isMult && data[0]) setP(data[0].length); }
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
            for (let i = 0; i < n; i++) for (let j = 0; j <= i; j++) {
                let sum = 0; for (let k = 0; k < j; k++) sum += L[i][k] * L[j][k];
                if (i === j) { const val = A[i][i] - sum; if (val < 0) throw new Error("Not positive definite."); L[i][j] = Math.sqrt(val); }
                else L[i][j] = (A[i][j] - sum) / L[j][j];
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
            // Fix: Explicitly type L as number[][] to avoid it being inferred as (0 | 1)[][] during initialization
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

  const renderMatrix = (mat: number[][], title: string) => {
      if (!mat || mat.length === 0) return null;
      return (
          <div className="flex flex-col items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{title}</span>
              <div className="relative p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-sm transition-colors">
                  <div className="absolute -left-2 top-0 bottom-0 w-1 bg-slate-300 dark:bg-slate-700 rounded-l"></div>
                  <div className="absolute -right-2 top-0 bottom-0 w-1 bg-slate-300 dark:bg-slate-700 rounded-r"></div>
                  <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${mat[0]?.length || 1}, minmax(0, 1fr))` }}>
                      {mat.map((r, idx) => r.map((v, jdx) => (
                          <div key={`${idx}-${jdx}`} className={`w-12 h-10 flex items-center justify-center text-[11px] font-mono border border-slate-50 dark:border-slate-800 rounded transition-all ${Math.abs(v) < 1e-8 ? 'bg-slate-50/50 dark:bg-slate-800/30 text-slate-300 dark:text-slate-700' : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'}`}>
                              {Math.abs(v) < 1e-5 ? '0' : v.toFixed(2)}
                          </div>
                      )))}
                  </div>
              </div>
          </div>
      );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm transition-colors">
         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
             <div className="flex gap-4 items-center flex-wrap">
                 <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-inner">
                    <button onClick={() => setInputMode('grid')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold uppercase transition-all ${inputMode === 'grid' ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-sm' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}><Grid3X3 className="w-3.5 h-3.5" />Grid</button>
                    <button onClick={() => setInputMode('text')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold uppercase transition-all ${inputMode === 'text' ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-sm' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}><FileText className="w-3.5 h-3.5" />Text</button>
                 </div>
                 <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>
                 <DimensionControl label="Rows (m)" value={m} onChange={v => setM(v)} />
                 <DimensionControl label="Cols (n)" value={n} onChange={v => setN(v)} />
                 {isMult && <DimensionControl label="Matrix B Cols (p)" value={p} onChange={v => setP(v)} />}
             </div>
             
             <button onClick={solve} className="w-full lg:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-8 rounded-xl shadow-lg shadow-emerald-600/20 active:scale-95 transition-all flex items-center justify-center gap-2">
                 <Calculator className="w-4 h-4" /> Calculate
             </button>
         </div>

         {inputMode === 'grid' ? (
             <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                 <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between px-1">
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Matrix A</span>
                        <div className="flex gap-1">
                            <button onClick={() => initMatrix('A', 'identity')} className="p-1 px-2 text-[9px] font-black bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded border border-slate-200 dark:border-slate-700 transition-all uppercase">Identity</button>
                            <button onClick={() => initMatrix('A', 'random')} className="p-1 px-2 text-[9px] font-black bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded border border-slate-200 dark:border-slate-700 transition-all uppercase">Random</button>
                        </div>
                    </div>
                    <div className="grid gap-2 p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
                        {matrixA.map((row, i) => row.map((val, j) => (
                            <input key={`A-${i}-${j}`} type="number" value={val} onChange={e => {
                                const newMat = [...matrixA]; newMat[i] = [...newMat[i]]; newMat[i][j] = parseFloat(e.target.value) || 0; setMatrixA(newMat); resetResults();
                            }} className="w-full h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-center text-xs font-mono outline-none focus:border-emerald-500 transition-all text-slate-900 dark:text-slate-100" />
                        )))}
                    </div>
                 </div>

                 {!isSingleMatrixOp && <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400 dark:text-slate-500"><ArrowRight className="w-5 h-5" /></div>}

                 {!isSingleMatrixOp && (
                    <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between px-1">
                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                {isLinearSystem ? `Vector b` : `Matrix B`}
                            </span>
                        </div>
                        {isLinearSystem ? (
                            <div className="grid gap-2 p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                                {vectorB.map((val, i) => (
                                    <input key={`b-${i}`} type="number" value={val} onChange={e => {
                                        const newVec = [...vectorB]; newVec[i] = parseFloat(e.target.value) || 0; setVectorB(newVec); resetResults();
                                    }} className="w-16 h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-center text-xs font-mono outline-none focus:border-emerald-500 text-slate-900 dark:text-slate-100 mx-auto" />
                                ))}
                            </div>
                        ) : (
                            <div className="grid gap-2 p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800" style={{ gridTemplateColumns: `repeat(${isMult ? p : n}, minmax(0, 1fr))` }}>
                                {matrixB.map((row, i) => row.map((val, j) => (
                                    <input key={`B-${i}-${j}`} type="number" value={val} onChange={e => {
                                        const newMat = [...matrixB]; newMat[i] = [...newMat[i]]; newMat[i][j] = parseFloat(e.target.value) || 0; setMatrixB(newMat); resetResults();
                                    }} className="w-full h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-center text-xs font-mono outline-none focus:border-emerald-500 text-slate-900 dark:text-slate-100" />
                                )))}
                            </div>
                        )}
                    </div>
                 )}
             </div>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top-2">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase px-1">Matrix A Input</label>
                    <textarea value={textA} onChange={e => setTextA(e.target.value)} className="w-full h-48 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 font-mono text-xs outline-none text-slate-900 dark:text-slate-100" placeholder="1 2 3&#10;4 5 6" />
                    <button onClick={() => handleApplyText('A')} className="w-full py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2"><FileInput className="w-3.5 h-3.5" /> Apply Matrix A</button>
                </div>
                {!isSingleMatrixOp && (
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase px-1">{isLinearSystem ? 'Vector b' : 'Matrix B'}</label>
                        <textarea value={textB} onChange={e => setTextB(e.target.value)} className="w-full h-48 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 font-mono text-xs outline-none text-slate-900 dark:text-slate-100" placeholder={isLinearSystem ? "6 8 7" : "1 0 0"} />
                        <button onClick={() => handleApplyText('B')} className="w-full py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2"><FileInput className="w-3.5 h-3.5" /> Apply Input B</button>
                    </div>
                )}
            </div>
         )}

         {errorMsg && <div className="mt-6 flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border border-red-100 dark:border-red-900/30 text-xs font-bold uppercase"><AlertTriangle className="w-4 h-4" /> {errorMsg}</div>}
      </div>

      {(resultMatrix || matrixInv || determinant !== null || resultX || matrixL || matrixQ) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 transition-colors">
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm flex flex-col items-center justify-center gap-8 min-h-[300px] relative overflow-hidden transition-colors">
                <div className="absolute top-4 left-4">
                    <h3 className="text-emerald-700 dark:text-emerald-400 font-black flex items-center gap-2 text-xs uppercase tracking-widest"><Layers className="w-4 h-4" /> Result View</h3>
                </div>

                {determinant !== null && (
                    <div className="text-center">
                        <span className="text-slate-400 dark:text-slate-500 font-bold uppercase text-[10px] tracking-widest block mb-4">Determinant (det A)</span>
                        <div className="text-6xl font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-slate-50 dark:bg-slate-950 px-8 py-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-inner">{determinant.toFixed(4)}</div>
                    </div>
                )}
                
                {resultX && (
                    <div className="w-full max-w-sm space-y-3">
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center block">Solution Vector x</span>
                        {resultX.map((v, i) => (
                            <div key={i} className="flex items-center justify-between bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors">
                                <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 font-mono">var[{i+1}]</span>
                                <span className="text-xl font-mono font-bold text-emerald-600 dark:text-emerald-400">{v.toFixed(6)}</span>
                            </div>
                        ))}
                    </div>
                )}

                {(matrixL || matrixU || matrixQ || matrixR) && (
                    <div className="flex flex-wrap justify-center gap-12">
                        {matrixL && renderMatrix(matrixL, "Matrix L")}
                        {matrixU && renderMatrix(matrixU, "Matrix U")}
                        {matrixQ && renderMatrix(matrixQ, "Matrix Q")}
                        {matrixR && renderMatrix(matrixR, "Matrix R")}
                    </div>
                )}

                {(resultMatrix || matrixInv) && (
                    <div className="flex flex-col items-center gap-4">
                        {renderMatrix((resultMatrix || matrixInv)!, isTranspose ? "Transpose (Aᵀ)" : isInverseOrDet ? "Inverse (A⁻¹)" : "Result Matrix")}
                    </div>
                )}
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6 transition-colors">
                <h3 className="text-slate-500 dark:text-slate-400 font-black flex items-center gap-2 text-xs uppercase tracking-widest"><TrendingDown className="w-4 h-4" /> Stats</h3>
                {isIterative && iterativeData.length > 0 ? (
                    <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={iterativeData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="iter" stroke="#94a3b8" tick={{fontSize: 9}} />
                                <YAxis scale="log" domain={['auto', 'auto']} stroke="#94a3b8" tick={{fontSize: 9}} />
                                <Tooltip contentStyle={{fontSize:10, backgroundColor: 'rgba(255,255,255,0.9)'}} />
                                <Line type="monotone" dataKey="error" stroke="#10b981" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic transition-colors">"Optimized direct solver executed using row-reduction techniques."</div>
                        <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg text-[10px] font-mono text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-800">History: {type} OK.</div>
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
};

const DimensionControl = ({ label, value, onChange }: { label: string, value: number, onChange: (v: number) => void }) => (
    <div className="flex flex-col gap-1 min-w-[100px]">
        <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase px-1">{label}</span>
        <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden h-8 shadow-sm transition-colors">
            <button onClick={() => value > 1 && onChange(value-1)} className="px-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 border-r border-slate-100 dark:border-slate-700 transition-colors"><Minus className="w-3 h-3" /></button>
            <div className="w-8 text-center text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">{value}</div>
            <button onClick={() => value < 8 && onChange(value+1)} className="px-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 border-l border-slate-100 dark:border-slate-700 transition-colors"><Plus className="w-3 h-3" /></button>
        </div>
    </div>
);