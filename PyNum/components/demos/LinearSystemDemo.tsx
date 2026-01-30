import React, { useState, useEffect, useMemo } from 'react';
import { AlgorithmType } from '../../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { AlertTriangle, CheckCircle2, RotateCcw, Calculator, FileText, Grid3X3, ArrowRight, Table, RefreshCw, ListOrdered, Clipboard, Plus, Minus, Settings2 } from 'lucide-react';

interface LinearSystemDemoProps {
  type: AlgorithmType;
}

export const LinearSystemDemo: React.FC<LinearSystemDemoProps> = ({ type }) => {
  // Dimensions state
  const [m, setM] = useState(3);
  const [n, setN] = useState(3);
  const [p, setP] = useState(3);

  const [inputMode, setInputMode] = useState<'grid' | 'text'>('grid');
  
  // Matrix A (m x n)
  const [matrixA, setMatrixA] = useState<number[][]>([
    [4, 1, 1],
    [1, 5, 2],
    [1, 2, 4]
  ]);
  
  // Matrix B
  const [matrixB, setMatrixB] = useState<number[][]>([
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1]
  ]);

  // Vector b (m x 1)
  const [vectorB, setVectorB] = useState<number[]>([6, 8, 7]);

  // Text Mode State
  const [textA, setTextA] = useState("");
  const [textB, setTextB] = useState("");
  const [parseError, setParseError] = useState<string | null>(null);
  
  // Results State
  const [resultX, setResultX] = useState<number[] | null>(null);
  const [transformedA, setTransformedA] = useState<number[][] | null>(null);
  
  // Decomposition Matrices
  const [matrixL, setMatrixL] = useState<number[][] | null>(null); // LU, Cholesky
  const [matrixU, setMatrixU] = useState<number[][] | null>(null); // LU
  const [matrixQ, setMatrixQ] = useState<number[][] | null>(null); // QR
  const [matrixR, setMatrixR] = useState<number[][] | null>(null); // QR
  
  const [matrixInv, setMatrixInv] = useState<number[][] | null>(null);
  const [resultMatrix, setResultMatrix] = useState<number[][] | null>(null);
  const [verificationMatrix, setVerificationMatrix] = useState<number[][] | null>(null); 
  
  const [determinant, setDeterminant] = useState<number | null>(null);
  const [iterativeData, setIterativeData] = useState<{iter: number, error: number}[]>([]);
  const [algoSteps, setAlgoSteps] = useState<string[]>([]); // New state for textual steps
  
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [tolerance, setTolerance] = useState(0.0001);

  const isIterative = type === AlgorithmType.JACOBI || type === AlgorithmType.GAUSS_SEIDEL;
  
  // Operation Type Flags
  const isMult = type === AlgorithmType.MATRIX_MULTIPLICATION;
  const isAddSub = type === AlgorithmType.MATRIX_ADDITION || type === AlgorithmType.MATRIX_SUBTRACTION;
  const isTranspose = type === AlgorithmType.MATRIX_TRANSPOSE;
  const isDecomp = [
      AlgorithmType.LU_DECOMPOSITION,
      AlgorithmType.CHOLESKY_DECOMPOSITION, 
      AlgorithmType.QR_DECOMPOSITION
  ].includes(type);
  
  const isSingleMatrixOp = type === AlgorithmType.MATRIX_INVERSE || type === AlgorithmType.MATRIX_DETERMINANT || isTranspose || isDecomp;
  const isTwoMatrixOp = isMult || isAddSub;
  const isLinearSystem = !isTwoMatrixOp && !isSingleMatrixOp; // Only solvers use this now
  
  // Square Operations Requirement
  const isSquareOp = isLinearSystem || type === AlgorithmType.MATRIX_INVERSE || type === AlgorithmType.MATRIX_DETERMINANT || type === AlgorithmType.CHOLESKY_DECOMPOSITION || type === AlgorithmType.LU_DECOMPOSITION;

  // Helper to resize matrix while preserving data
  const resizeMatrix = (oldMat: number[][], newRows: number, newCols: number, defaultVal: (r:number, c:number) => number) => {
    const newMat = Array.from({ length: newRows }, (_, r) => 
      Array.from({ length: newCols }, (_, c) => {
        if (oldMat[r] !== undefined && oldMat[r][c] !== undefined) {
          return oldMat[r][c];
        }
        return defaultVal(r, c);
      })
    );
    return newMat;
  };

  // Helper for matrix multiplication (used for verification)
  const multiplyMatrices = (A: number[][], B: number[][]) => {
      const rA = A.length;
      const cA = A[0].length;
      const rB = B.length;
      const cB = B[0].length;
      if (cA !== rB) return null;
      
      const C = Array.from({length: rA}, () => new Array(cB).fill(0));
      for(let i=0; i<rA; i++) {
          for(let j=0; j<cB; j++) {
              let sum = 0;
              for(let k=0; k<cA; k++) sum += A[i][k] * B[k][j];
              C[i][j] = sum;
          }
      }
      return C;
  };

  /**
   * Applies matrix data to the state, handling resizing and validation logic.
   */
  const applyMatrixData = (data: number[][], target: 'A' | 'B') => {
      const newM = data.length;
      if (newM === 0) return;
      const newN = data[0].length;
      
      // Check for inconsistent rows
      if (data.some(r => r.length !== newN)) {
           setErrorMsg("Data has inconsistent row lengths.");
           return;
      }

      if (target === 'A') {
           if (isSquareOp && newM !== newN) {
               setErrorMsg("Matrix A must be square for this operation.");
               return;
           }
           if (newM > 10 || newN > 10) {
               if(!confirm("Matrix is large (>10). It might break the grid layout. Continue?")) return;
           }
           
           // Order matters: Update Data -> Then Dimensions
           // React batching will handle the effect trigger correctly
           setMatrixA(data);
           setM(newM);
           setN(newN);
      } else {
           // Target B
           if (isLinearSystem) {
               // Vector B: Flatten if 2D
               const vec = data.flat();
               if (vec.length !== m) {
                   setErrorMsg(`Vector length (${vec.length}) must match Matrix A rows (${m}).`);
                   return;
               }
               setVectorB(vec);
           } else {
               // Matrix B
               if (isMult) {
                   if (newM !== n) {
                       setErrorMsg(`Paste rows (${newM}) must match Matrix A cols (${n}).`);
                       return;
                   }
                   setP(newN);
                   setMatrixB(data);
               } else {
                   // Add/Sub
                   if (newM !== m || newN !== n) {
                       setErrorMsg(`Matrix B dimensions (${newM}x${newN}) must match Matrix A (${m}x${n}).`);
                       return;
                   }
                   setMatrixB(data);
               }
           }
      }
      resetResults();
      setErrorMsg(null);
  };

  const handleGlobalPaste = async (target: 'A' | 'B') => {
    try {
        const text = await navigator.clipboard.readText();
        if (!text) return;
        
        const rows = text.trim().split(/\r?\n/);
        const parsed = rows.map(r => r.trim().split(/[\t, ]+/).map(val => {
           const n = parseFloat(val);
           return isNaN(n) ? 0 : n;
        }));
        
        applyMatrixData(parsed, target);
    } catch (error) {
        console.error("Paste failed", error);
        setErrorMsg("Could not access clipboard. Please ensure permissions are granted.");
    }
  };

  const handleCellPaste = (e: React.ClipboardEvent, target: 'A' | 'B') => {
      const text = e.clipboardData.getData('text');
      if (!text) return;

      // Check if it's a multi-value paste
      if (text.includes('\t') || text.includes('\n') || text.includes(',')) {
          e.preventDefault(); // Stop default paste into input
          const rows = text.trim().split(/\r?\n/);
          const parsed = rows.map(r => r.trim().split(/[\t, ]+/).map(val => {
             const n = parseFloat(val);
             return isNaN(n) ? 0 : n;
          }));
          applyMatrixData(parsed, target);
      }
      // If single value, default behavior puts it in the cell, which is fine.
  };

  // Sync state when dimensions change via inputs (Grid Mode)
  useEffect(() => {
    if (inputMode === 'grid') {
      // Resize Matrix A (m x n)
      if (matrixA.length !== m || matrixA[0]?.length !== n) {
        setMatrixA(prev => resizeMatrix(prev, m, n, (r, c) => (isSquareOp && r === c ? 4 : 1)));
      }

      // Resize Matrix B
      if (isMult) {
        // B is n x p
        if (matrixB.length !== n || matrixB[0]?.length !== p) {
          setMatrixB(prev => resizeMatrix(prev, n, p, (r, c) => (r === c ? 1 : 0)));
        }
      } else if (isAddSub) {
        // B is m x n
        if (matrixB.length !== m || matrixB[0]?.length !== n) {
          setMatrixB(prev => resizeMatrix(prev, m, n, () => 0));
        }
      }

      // Resize Vector B (m)
      if (isLinearSystem && vectorB.length !== m) {
        const newVec = Array.from({ length: m }, (_, i) => (vectorB[i] !== undefined ? vectorB[i] : 5));
        setVectorB(newVec);
      }
      
      resetResults();
    }
  }, [m, n, p, inputMode, type, isMult, isAddSub, isSquareOp, isLinearSystem]);

  useEffect(() => {
    if (type === AlgorithmType.CHOLESKY_DECOMPOSITION) {
        const demoA = [[4, 12, -16], [12, 37, -43], [-16, -43, 98]];
        applyMatrixData(demoA, 'A');
    } else if (isSquareOp) {
       if (n !== m) setN(m); // Force square if switching to square op
    }
    resetResults();
  }, [type]);

  useEffect(() => {
    if (inputMode === 'text') {
      const txtA = matrixA.map(row => row.join(' ')).join('\n');
      let txtB = "";
      if (isTwoMatrixOp) {
          txtB = matrixB.map(row => row.join(' ')).join('\n');
      } else if (isLinearSystem) {
          txtB = vectorB.join(' ');
      }
      setTextA(txtA);
      setTextB(txtB);
      setParseError(null);
    }
  }, [inputMode, isTwoMatrixOp]);

  const resetResults = () => {
    setResultX(null);
    setTransformedA(null);
    setMatrixL(null);
    setMatrixU(null);
    setMatrixQ(null);
    setMatrixR(null);
    setMatrixInv(null);
    setResultMatrix(null);
    setVerificationMatrix(null);
    setDeterminant(null);
    setIterativeData([]);
    setAlgoSteps([]);
    setErrorMsg(null);
  };

  const handleMatrixChange = (target: 'A' | 'B', r: number, c: number, val: string) => {
    const newVal = parseFloat(val);
    if (isNaN(newVal)) return;
    
    if (target === 'A') {
        const newA = matrixA.map(row => [...row]);
        newA[r][c] = newVal;
        setMatrixA(newA);
    } else {
        const newB = matrixB.map(row => [...row]);
        newB[r][c] = newVal;
        setMatrixB(newB);
    }
    resetResults();
  };

  const handleVectorChange = (r: number, val: string) => {
    const newVal = parseFloat(val);
    if (isNaN(newVal)) return;
    const newB = [...vectorB];
    newB[r] = newVal;
    setVectorB(newB);
    resetResults();
  };

  const parseTextInputs = (valA: string, valB: string) => {
    try {
      // Parse Matrix A
      const rowsA = valA.trim().split(/\n+/);
      const parsedA = rowsA.map(r => r.trim().split(/[\s,]+/).map(n => {
        const parsed = parseFloat(n);
        return isNaN(parsed) ? 0 : parsed;
      }));

      const rA = parsedA.length;
      if (rA === 0) throw new Error("Matrix A is empty");
      const cA = parsedA[0].length;
      if (parsedA.some(r => r.length !== cA)) throw new Error("All rows in Matrix A must have the same number of columns");
      
      if (isSquareOp) {
          if (rA !== cA) throw new Error("Matrix A must be square for this operation");
          if (rA < 2 || rA > 10) throw new Error("Size must be between 2 and 10");
      }

      let parsedVectorB = vectorB;
      let parsedMatrixB = matrixB;
      let rB = 0, cB = 0;

      if (isTwoMatrixOp) {
          const rowsB = valB.trim().split(/\n+/);
          parsedMatrixB = rowsB.map(r => r.trim().split(/[\s,]+/).map(n => {
            const parsed = parseFloat(n);
            return isNaN(parsed) ? 0 : parsed;
          }));
          rB = parsedMatrixB.length;
          cB = parsedMatrixB[0]?.length || 0;
          if (parsedMatrixB.some(r => r.length !== cB)) throw new Error("All rows in Matrix B must have the same number of columns");

          if (isMult) {
              if (cA !== rB) throw new Error(`Matrix Dimensions Mismatch: Cols A (${cA}) must equal Rows B (${rB})`);
          } else if (isAddSub) {
              if (rA !== rB || cA !== cB) throw new Error(`Matrices must have same dimensions. A: ${rA}x${cA}, B: ${rB}x${cB}`);
          }
      } else if (isLinearSystem) {
          parsedVectorB = valB.trim().split(/[\s,]+/).map(n => parseFloat(n));
          if (parsedVectorB.length !== rA) throw new Error(`Vector b size (${parsedVectorB.length}) must match Matrix size (${rA})`);
          if (parsedVectorB.some(n => isNaN(n))) throw new Error("Invalid number in Vector b");
      }

      setM(rA);
      setN(cA);
      if (isMult) setP(cB);
      
      setMatrixA(parsedA);
      if (isTwoMatrixOp) setMatrixB(parsedMatrixB);
      if (isLinearSystem) setVectorB(parsedVectorB);
      
      setParseError(null);
      resetResults();
    } catch (e: any) {
      setParseError(e.message);
    }
  };

  const handleTextAChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setTextA(val);
    parseTextInputs(val, textB);
  };

  const handleTextBChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const val = e.target.value;
    setTextB(val);
    parseTextInputs(textA, val);
  };

  const checkDiagonalDominance = () => {
      if (m !== n) return false;
      if (!matrixA || matrixA.length < m) return false;

      for(let i=0; i<m; i++) {
          let sum = 0;
          if (!matrixA[i]) return false; 
          for(let j=0; j<n; j++) {
              if (i !== j) sum += Math.abs(matrixA[i][j]);
          }
          if (Math.abs(matrixA[i][i]) < sum) return false;
      }
      return true;
  };

  const solve = () => {
    if (parseError && inputMode === 'text') return;
    resetResults();
    const stepsLog: string[] = [];
    const A = matrixA.map(row => [...row]); 
    const b = [...vectorB];

    try {
        if (type === AlgorithmType.GAUSSIAN) {
            if (m !== n) throw new Error("Matrix must be square");
            for (let k = 0; k < m; k++) {
                let maxRow = k;
                for (let i = k + 1; i < m; i++) {
                    if (Math.abs(A[i][k]) > Math.abs(A[maxRow][k])) maxRow = i;
                }
                [A[k], A[maxRow]] = [A[maxRow], A[k]];
                [b[k], b[maxRow]] = [b[maxRow], b[k]];

                if (Math.abs(A[k][k]) < 1e-10) throw new Error("Singular Matrix (Zero Pivot)");

                for (let i = k + 1; i < m; i++) {
                    const factor = A[i][k] / A[k][k];
                    for (let j = k; j < m; j++) A[i][j] -= factor * A[k][j];
                    b[i] -= factor * b[k];
                }
            }
            setTransformedA(A.map(r => [...r]));
            const x = new Array(m).fill(0);
            for (let i = m - 1; i >= 0; i--) {
                let sum = 0;
                for (let j = i + 1; j < m; j++) sum += A[i][j] * x[j];
                x[i] = (b[i] - sum) / A[i][i];
            }
            setResultX(x);
        }
        else if (type === AlgorithmType.GAUSS_JORDAN) {
             if (m !== n) throw new Error("Matrix must be square");
            for (let k = 0; k < m; k++) {
                if (Math.abs(A[k][k]) < 1e-10) throw new Error("Singular Matrix");
                const pivot = A[k][k];
                for (let j = k; j < m; j++) A[k][j] /= pivot;
                b[k] /= pivot;
                for (let i = 0; i < m; i++) {
                    if (i !== k) {
                        const factor = A[i][k];
                        for (let j = k; j < m; j++) A[i][j] -= factor * A[k][j];
                        b[i] -= factor * b[k];
                    }
                }
            }
            setTransformedA(A);
            setResultX(b);
        }
        else if (type === AlgorithmType.LU_DECOMPOSITION) {
             if (m !== n) throw new Error("Matrix must be square");
             const L: number[][] = Array.from({length:m}, (_,i)=>Array.from({length:m}, (_,j)=>i===j?1:0));
             const U: number[][] = Array.from({length:m}, (_,i)=>Array.from({length:m}, ()=>0));

             stepsLog.push(`Starting Doolittle's Method for ${m}x${m} matrix.`);

             for (let i = 0; i < m; i++) {
                // Upper
                for (let k = i; k < m; k++) {
                    let sum = 0;
                    for (let j = 0; j < i; j++) sum += (L[i][j] * U[j][k]);
                    U[i][k] = A[i][k] - sum;
                }
                stepsLog.push(`Computed U row ${i+1}: [${U[i].map(x => x.toFixed(2)).join(', ')}]`);

                // Lower
                for (let k = i + 1; k < m; k++) {
                    let sum = 0;
                    for (let j = 0; j < i; j++) sum += (L[k][j] * U[j][i]);
                    if (Math.abs(U[i][i]) < 1e-10) throw new Error("Zero pivot in LU");
                    L[k][i] = (A[k][i] - sum) / U[i][i];
                    stepsLog.push(`Computed L[${k+1}][${i+1}] = ${L[k][i].toFixed(4)}`);
                }
             }

             setMatrixL(L);
             setMatrixU(U);
             setAlgoSteps(stepsLog);
             
             const verif = multiplyMatrices(L, U);
             if (verif) setVerificationMatrix(verif);

             const y = new Array(m).fill(0);
             for(let i=0; i<m; i++) {
                 let sum = 0;
                 for(let j=0; j<i; j++) sum += L[i][j]*y[j];
                 y[i] = (b[i] - sum) / L[i][i];
             }
             const x = new Array(m).fill(0);
             for(let i=m-1; i>=0; i--) {
                 let sum = 0;
                 for(let j=i+1; j<m; j++) sum += U[i][j]*x[j];
                 x[i] = (y[i] - sum) / U[i][i];
             }
        }
        else if (type === AlgorithmType.CHOLESKY_DECOMPOSITION) {
            if (m !== n) throw new Error("Matrix must be square");
            stepsLog.push("Verifying symmetry...");
            for(let i=0; i<m; i++) {
                for(let j=i+1; j<m; j++) {
                    if (Math.abs(A[i][j] - A[j][i]) > 1e-6) throw new Error("Matrix must be Symmetric");
                }
            }
            stepsLog.push("Symmetry confirmed.");

            const L = Array.from({length:m}, () => new Array(m).fill(0));
            
            for (let i = 0; i < m; i++) {
                for (let k = 0; k <= i; k++) {
                    let sum = 0;
                    for (let j = 0; j < k; j++) sum += L[i][j] * L[k][j];
                    
                    if (i === k) {
                        const val = A[i][i] - sum;
                        if (val <= 0) {
                            stepsLog.push(`Failed at L[${i+1}][${i+1}]: Argument ${val.toFixed(4)} <= 0`);
                            throw new Error("Matrix must be Positive Definite");
                        }
                        L[i][k] = Math.sqrt(val);
                        stepsLog.push(`L[${i+1}][${i+1}] = sqrt(${A[i][i]} - ${sum.toFixed(4)}) = ${L[i][k].toFixed(4)}`);
                    } else {
                        L[i][k] = (1.0 / L[k][k] * (A[i][k] - sum));
                        stepsLog.push(`L[${i+1}][${k+1}] = (${A[i][k]} - ${sum.toFixed(4)}) / ${L[k][k].toFixed(4)} = ${L[i][k].toFixed(4)}`);
                    }
                }
            }
            setMatrixL(L);
            const LT = L[0].map((_, colIndex) => L.map(row => row[colIndex]));
            setMatrixU(LT); 
            setAlgoSteps(stepsLog);
            
            const verif = multiplyMatrices(L, LT);
            if (verif) setVerificationMatrix(verif);
        }
        else if (type === AlgorithmType.QR_DECOMPOSITION) {
             const Q = Array.from({length: m}, () => new Array(n).fill(0));
            const R = Array.from({length: n}, () => new Array(n).fill(0));
            
            stepsLog.push(`Starting Gram-Schmidt Process for ${m}x${n} matrix.`);

            const aVecs = [];
            for(let j=0; j<n; j++) {
                const vec = [];
                for(let i=0; i<m; i++) vec.push(A[i][j]);
                aVecs.push(vec);
            }

            const qVecs: number[][] = []; 

            for(let j=0; j<n; j++) {
                let v = [...aVecs[j]]; 
                
                stepsLog.push(`-- Column ${j+1} --`);
                stepsLog.push(`Initialize v = a_${j+1} = [${v.map(x=>x.toFixed(2)).join(', ')}]`);

                for(let i=0; i<j; i++) {
                    const q_i = qVecs[i];
                    let dot = 0;
                    for(let k=0; k<m; k++) dot += q_i[k] * aVecs[j][k];
                    
                    R[i][j] = dot; 
                    for(let k=0; k<m; k++) v[k] -= dot * q_i[k];
                    
                    stepsLog.push(`Project onto q_${i+1}: R[${i+1}][${j+1}] = ${dot.toFixed(4)}`);
                    stepsLog.push(`v = v - ${dot.toFixed(4)} * q_${i+1}`);
                }
                
                let norm = 0;
                for(let k=0; k<m; k++) norm += v[k]*v[k];
                norm = Math.sqrt(norm);
                
                stepsLog.push(`Norm ||v|| = ${norm.toFixed(4)} (Stored in R[${j+1}][${j+1}])`);

                if (norm < 1e-10) {
                    R[j][j] = 0;
                    qVecs.push(new Array(m).fill(0));
                    stepsLog.push(`Norm is effectively zero. Linearly dependent column.`);
                } else {
                    R[j][j] = norm;
                    const q_j = v.map(val => val / norm);
                    qVecs.push(q_j);
                    for(let k=0; k<m; k++) Q[k][j] = q_j[k];
                    stepsLog.push(`q_${j+1} = v / norm = [${q_j.map(x=>x.toFixed(4)).join(', ')}]`);
                }
            }
            setMatrixQ(Q);
            setMatrixR(R);
            setAlgoSteps(stepsLog);
            
            const verif = multiplyMatrices(Q, R);
            if (verif) setVerificationMatrix(verif);
        }
        else if (type === AlgorithmType.MATRIX_DETERMINANT) {
            if (m !== n) throw new Error("Determinant only exists for square matrices");
            let det = 1;
            let swaps = 0;
            for (let k = 0; k < m; k++) {
                let maxRow = k;
                for (let i = k + 1; i < m; i++) {
                    if (Math.abs(A[i][k]) > Math.abs(A[maxRow][k])) maxRow = i;
                }
                if (k !== maxRow) {
                     [A[k], A[maxRow]] = [A[maxRow], A[k]];
                     swaps++;
                }
                if (Math.abs(A[k][k]) < 1e-10) { det = 0; break; }
                
                for (let i = k + 1; i < m; i++) {
                    const factor = A[i][k] / A[k][k];
                    for (let j = k; j < m; j++) A[i][j] -= factor * A[k][j];
                }
            }
            if (det !== 0) {
               for(let i=0; i<m; i++) det *= A[i][i];
               if (swaps % 2 !== 0) det = -det;
            }
            setDeterminant(det);
            setTransformedA(A); 
        }
        else if (type === AlgorithmType.MATRIX_INVERSE) {
            if (m !== n) throw new Error("Only square matrices can have an inverse");
            const M = A.map((row, i) => [...row, ...Array.from({length:m}, (_,j)=>i===j?1:0)]);
            for (let k = 0; k < m; k++) {
                if (Math.abs(M[k][k]) < 1e-10) throw new Error("Singular Matrix (No Inverse)");
                const pivot = M[k][k];
                for (let j = k; j < 2*m; j++) M[k][j] /= pivot;
                for (let i = 0; i < m; i++) {
                    if (i !== k) {
                        const factor = M[i][k];
                        for (let j = k; j < 2*m; j++) M[i][j] -= factor * M[k][j];
                    }
                }
            }
            setMatrixInv(M.map(row => row.slice(m, 2*m)));
        }
        else if (type === AlgorithmType.MATRIX_TRANSPOSE) {
            const T = Array.from({length:n}, (_,i)=>Array.from({length:m}, (_,j)=> A[j][i]));
            setResultMatrix(T);
        }
        else if (type === AlgorithmType.MATRIX_ADDITION) {
            if (m !== matrixB.length || n !== (matrixB[0]?.length || 0)) throw new Error("Dimensions must match");
            const C = A.map((row, i) => row.map((val, j) => val + matrixB[i][j]));
            setResultMatrix(C);
        }
        else if (type === AlgorithmType.MATRIX_SUBTRACTION) {
            if (m !== matrixB.length || n !== (matrixB[0]?.length || 0)) throw new Error("Dimensions must match");
            const C = A.map((row, i) => row.map((val, j) => val - matrixB[i][j]));
            setResultMatrix(C);
        }
        else if (type === AlgorithmType.MATRIX_MULTIPLICATION) {
            if (n !== matrixB.length) throw new Error(`Cols A (${n}) != Rows B (${matrixB.length})`);
            const pDim = matrixB[0]?.length || 0;
            
            const C = Array.from({length:m}, (_,i) => 
               Array.from({length:pDim}, (_,j) => {
                   let sum = 0;
                   for(let k=0; k<n; k++) sum += A[i][k] * matrixB[k][j];
                   return sum;
               })
            );
            setResultMatrix(C);
        }
        else if (isIterative) {
             if (m !== n) throw new Error("Iterative methods require square matrix");
             if (!checkDiagonalDominance()) {
                 // warning handled in render
             }
             let x = new Array(m).fill(0);
             const maxIter = 100;
             const history = [];

             for (let iter = 0; iter < maxIter; iter++) {
                 const x_new = [...x];
                 let maxError = 0;
                 for (let i = 0; i < m; i++) {
                     let sum = 0;
                     for (let j = 0; j < m; j++) {
                         if (i !== j) {
                             if (type === AlgorithmType.JACOBI) sum += A[i][j] * x[j];
                             else sum += A[i][j] * x_new[j];
                         }
                     }
                     if (A[i][i] === 0) throw new Error("Zero on diagonal");
                     const val = (b[i] - sum) / A[i][i];
                     if (val !== 0) {
                         const err = Math.abs((val - x[i]) / val);
                         if (err > maxError) maxError = err;
                     }
                     x_new[i] = val;
                 }
                 history.push({ iter: iter + 1, error: maxError });
                 x = x_new;
                 if (maxError < tolerance) break;
             }
             setResultX(x);
             setIterativeData(history);
        }

    } catch (e: any) {
        setErrorMsg(e.message);
    }
  };

  const isDiagDominant = useMemo(() => checkDiagonalDominance(), [matrixA, m, n]);

  const renderMatrix = (mat: number[][]) => {
    if (!mat || mat.length === 0) return null;
    const r = mat.length;
    const c = mat[0].length;
    return (
        <div className="grid gap-1 p-2 bg-slate-50 rounded-lg border border-slate-200" style={{ gridTemplateColumns: `repeat(${c}, minmax(0, 1fr))` }}>
            {mat.map((row, i) => (
                row.map((val, j) => (
                    <div key={`${i}-${j}`} className={`w-10 h-10 flex items-center justify-center text-[10px] font-mono rounded ${Math.abs(val) < 1e-10 ? 'text-slate-400' : 'text-emerald-700 bg-emerald-50 border border-emerald-100'}`}>
                        {Math.abs(val) < 1e-5 ? '0' : val.toFixed(2)}
                    </div>
                ))
            ))}
        </div>
    );
  };

  const DimensionControl = ({ label, value, onChange, min = 2, max = 10 }: { label: string, value: number, onChange: (val: number) => void, min?: number, max?: number }) => (
      <div className="flex-1 min-w-[120px] max-w-[180px]">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">{label}</label>
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
            <button 
                onClick={() => value > min && onChange(value - 1)}
                className="w-7 h-7 flex items-center justify-center rounded-md bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-emerald-600 transition-colors disabled:opacity-50"
                disabled={value <= min}
            >
                <Minus className="w-3.5 h-3.5" />
            </button>
            <input 
                type="number" 
                min={min} 
                max={max} 
                value={value} 
                onChange={(e) => {
                    let v = parseInt(e.target.value);
                    if (isNaN(v)) v = min;
                    if (v < min) v = min;
                    if (v > max) v = max;
                    onChange(v);
                }}
                className="flex-1 w-full text-center bg-transparent font-mono font-bold text-slate-800 outline-none text-sm"
            />
            <button 
                onClick={() => value < max && onChange(value + 1)}
                className="w-7 h-7 flex items-center justify-center rounded-md bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-emerald-600 transition-colors disabled:opacity-50"
                disabled={value >= max}
            >
                <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
      </div>
  );

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
         {/* Top Bar */}
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-slate-100 pb-6">
             <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                <button
                   onClick={() => setInputMode('grid')}
                   className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                     inputMode === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                   }`}
                >
                   <Grid3X3 className="w-4 h-4" />
                   Grid Input
                </button>
                <button
                   onClick={() => setInputMode('text')}
                   className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                     inputMode === 'text' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                   }`}
                >
                   <FileText className="w-4 h-4" />
                   Advanced Input
                </button>
             </div>

             <div className="flex items-center gap-4 w-full md:w-auto">
                {isIterative && (
                     <div className="flex items-center gap-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase whitespace-nowrap">Tol.</label>
                        <input 
                           type="number" step="0.00001" value={tolerance} 
                           onChange={e => setTolerance(parseFloat(e.target.value))}
                           className="bg-slate-50 border border-slate-300 rounded px-2 py-1.5 text-sm w-20 text-slate-800 focus:ring-1 focus:ring-emerald-500 outline-none"
                        />
                     </div>
                 )}
                 <button 
                    onClick={solve}
                    disabled={inputMode === 'text' && parseError !== null}
                    className="ml-auto flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 px-6 rounded-lg transition-all shadow-md shadow-emerald-600/20 active:scale-95"
                 >
                    <Calculator className="w-4 h-4" />
                    {isDecomp ? 'Decompose' : isLinearSystem ? 'Solve System' : 'Calculate'}
                 </button>
             </div>
         </div>

         {/* Configuration Section (Always Visible but styled specifically for Grid) */}
         {inputMode === 'grid' && (
             <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap gap-6 items-center">
                 <div className="flex items-center gap-3">
                     <div className="p-2 bg-white rounded-lg border border-slate-200 text-slate-400">
                         <Settings2 className="w-5 h-5" />
                     </div>
                     <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Configuration</span>
                 </div>
                 <div className="h-8 w-px bg-slate-200 hidden md:block"></div>
                 
                 {/* Matrix A Config */}
                 <div className="flex gap-4">
                     {isSquareOp ? (
                        <DimensionControl 
                           label={`Size (A)`} 
                           value={m} 
                           onChange={(v) => { setM(v); setN(v); }} 
                        />
                     ) : (
                         <>
                             <DimensionControl label={`Rows (A)`} value={m} onChange={setM} />
                             <DimensionControl label={`Cols (A)`} value={n} onChange={setN} />
                         </>
                     )}
                 </div>

                 {/* Matrix B Config */}
                 {(isMult || isAddSub) && (
                     <>
                        <div className="h-8 w-px bg-slate-200 hidden md:block"></div>
                        <div className="flex gap-4">
                            {isMult && <DimensionControl label={`Cols (B)`} value={p} onChange={setP} />}
                            {/* For Add/Sub, B dimensions are locked to A, so no controls needed */}
                        </div>
                     </>
                 )}
             </div>
         )}

         {/* Grid Mode UI */}
         {inputMode === 'grid' && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                <div className="flex items-center justify-center gap-2 md:gap-8 overflow-x-auto pb-4 custom-scrollbar">
                    {/* Matrix A */}
                    <div className="relative group">
                        <div className="flex items-center justify-between mb-3 px-1">
                            <div className="flex items-center gap-2">
                                <span className="text-slate-600 text-xs font-bold font-mono tracking-widest bg-slate-100 px-2 py-1 rounded border border-slate-200">Matrix A</span>
                                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">{m} × {n}</span>
                            </div>
                            <button 
                                onClick={() => handleGlobalPaste('A')}
                                className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-emerald-600 text-[10px] font-medium transition-all shadow-sm"
                                title="Paste Matrix A from Clipboard"
                            >
                                <Clipboard className="w-3 h-3" />
                                Paste
                            </button>
                        </div>
                        <div className="grid gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 shadow-inner" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
                            {matrixA.map((row, i) => (
                                row.map((val, j) => (
                                    <input 
                                        key={`a-${i}-${j}`}
                                        type="number"
                                        value={val}
                                        onPaste={(e) => handleCellPaste(e, 'A')}
                                        onChange={e => handleMatrixChange('A', i, j, e.target.value)}
                                        className={`w-12 md:w-14 h-10 md:h-12 bg-white border ${isSquareOp && i===j ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200'} rounded text-center text-sm font-mono focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 outline-none transition-all text-slate-800 shadow-sm`}
                                    />
                                ))
                            ))}
                        </div>
                    </div>

                    {!isSingleMatrixOp && (
                        <>
                        <div className="text-slate-300 text-2xl self-center font-bold pt-8">
                            {type === AlgorithmType.MATRIX_ADDITION ? '+' : 
                             type === AlgorithmType.MATRIX_SUBTRACTION ? '-' :
                             type === AlgorithmType.MATRIX_MULTIPLICATION ? '×' :
                             isLinearSystem ? '×' : ''}
                        </div>
                        
                        <div className="relative group">
                            <div className="flex items-center justify-between mb-3 px-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-slate-600 text-xs font-bold font-mono tracking-widest bg-slate-100 px-2 py-1 rounded border border-slate-200">
                                        {isTwoMatrixOp ? 'Matrix B' : 'Vector b'}
                                    </span>
                                    {isMult && <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">{n} × {p}</span>}
                                    {isAddSub && <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">{m} × {n}</span>}
                                </div>
                                <button 
                                    onClick={() => handleGlobalPaste('B')}
                                    className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-emerald-600 text-[10px] font-medium transition-all shadow-sm"
                                    title={`Paste ${isTwoMatrixOp ? 'Matrix B' : 'Vector b'} from Clipboard`}
                                >
                                    <Clipboard className="w-3 h-3" />
                                    Paste
                                </button>
                            </div>
                            
                            {isTwoMatrixOp ? (
                                <div className="grid gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 shadow-inner" style={{ gridTemplateColumns: `repeat(${isMult ? p : n}, minmax(0, 1fr))` }}>
                                    {matrixB.map((row, i) => (
                                        row.map((val, j) => (
                                            <input 
                                                key={`b-mat-${i}-${j}`}
                                                type="number"
                                                value={val}
                                                onPaste={(e) => handleCellPaste(e, 'B')}
                                                onChange={e => handleMatrixChange('B', i, j, e.target.value)}
                                                className={`w-12 md:w-14 h-10 md:h-12 bg-white border border-slate-200 rounded text-center text-sm font-mono focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 outline-none transition-all text-slate-800 shadow-sm`}
                                            />
                                        ))
                                    ))}
                                </div>
                            ) : (
                                <div className="grid gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 shadow-inner">
                                    {vectorB.map((val, i) => (
                                        <input 
                                            key={`b-vec-${i}`}
                                            type="number"
                                            value={val}
                                            onPaste={(e) => handleCellPaste(e, 'B')}
                                            onChange={e => handleVectorChange(i, e.target.value)}
                                            className="w-12 md:w-14 h-10 md:h-12 bg-white border border-slate-200 rounded text-center text-sm font-mono focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 outline-none text-slate-800 shadow-sm"
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                        </>
                    )}
                </div>
            </div>
         )}

         {/* Text Mode UI */}
         {inputMode === 'text' && (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-300">
                 <div className={`space-y-2 ${isSingleMatrixOp ? 'md:col-span-3' : 'md:col-span-2'}`}>
                    <div className="flex justify-between items-center">
                        <label className="text-xs font-semibold text-slate-500 uppercase">Matrix A (Rows by Lines)</label>
                        <span className="text-[10px] text-slate-400">Space or comma separated</span>
                    </div>
                    <textarea 
                        value={textA}
                        onChange={handleTextAChange}
                        className="w-full h-48 bg-slate-50 border border-slate-300 rounded-lg p-3 font-mono text-sm text-slate-800 focus:ring-1 focus:ring-emerald-500 outline-none custom-scrollbar leading-relaxed resize-none shadow-inner"
                        placeholder={`4 1 1\n1 5 2\n1 2 4`}
                    />
                 </div>
                 
                 {!isSingleMatrixOp && (
                     <div className={`space-y-2 ${isTwoMatrixOp ? 'md:col-span-2 md:col-start-2' : ''}`}>
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-semibold text-slate-500 uppercase">
                                {isTwoMatrixOp ? 'Matrix B' : 'Vector b'}
                            </label>
                        </div>
                        {isTwoMatrixOp ? (
                            <textarea 
                                value={textB}
                                onChange={handleTextBChange}
                                className="w-full h-48 bg-slate-50 border border-slate-300 rounded-lg p-3 font-mono text-sm text-slate-800 focus:ring-1 focus:ring-emerald-500 outline-none custom-scrollbar leading-relaxed resize-none shadow-inner"
                                placeholder={`1 0 0\n0 1 0\n0 0 1`}
                            />
                        ) : (
                            <input 
                                type="text"
                                value={textB}
                                onChange={handleTextBChange}
                                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 font-mono text-sm text-slate-800 focus:ring-1 focus:ring-emerald-500 outline-none shadow-inner"
                                placeholder="6 8 7"
                            />
                        )}
                     </div>
                 )}
                 <div className="md:col-span-3">
                     <div className={`p-3 rounded-lg text-xs border ${parseError ? 'bg-red-50 border-red-200 text-red-600' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}>
                        {parseError ? (
                            <div className="flex gap-2 items-start">
                                <AlertTriangle className="w-4 h-4 shrink-0" />
                                <span>{parseError}</span>
                            </div>
                        ) : (
                            <div className="flex gap-2 items-center">
                                <CheckCircle2 className="w-4 h-4 shrink-0" />
                                <span>Valid System Detected: A({m}×{n}) {isMult ? `× B(${n}×${p})` : ''}</span>
                            </div>
                        )}
                    </div>
                 </div>
             </div>
         )}
         
         {isIterative && !isDiagDominant && !parseError && (
             <div className="mt-6 flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200 text-xs md:text-sm">
                 <AlertTriangle className="w-4 h-4 shrink-0" />
                 Matrix is not Diagonally Dominant. Convergence is not guaranteed.
             </div>
         )}
         {errorMsg && (
             <div className="mt-6 flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200 text-xs md:text-sm">
                 <AlertTriangle className="w-4 h-4 shrink-0" />
                 {errorMsg}
             </div>
         )}
      </div>

      {/* Results Section */}
      {(resultX || matrixInv || resultMatrix || matrixL || matrixQ || determinant !== null) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* Primary Output */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-emerald-700 font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                      <CheckCircle2 className="w-5 h-5" />
                      {type === AlgorithmType.MATRIX_INVERSE ? 'Inverse Matrix (A⁻¹)' : 
                       type === AlgorithmType.MATRIX_DETERMINANT ? 'Determinant |A|' :
                       type === AlgorithmType.MATRIX_TRANSPOSE ? 'Transposed Matrix (Aᵀ)' :
                       type === AlgorithmType.MATRIX_ADDITION ? 'Result (A + B)' :
                       type === AlgorithmType.MATRIX_SUBTRACTION ? 'Result (A - B)' :
                       type === AlgorithmType.MATRIX_MULTIPLICATION ? 'Result (A × B)' :
                       isDecomp ? 'Decomposition Result' :
                       'Solution Vector (x)'}
                  </h3>
                  
                  {type === AlgorithmType.MATRIX_DETERMINANT && determinant !== null && (
                      <div className="text-4xl font-mono font-bold text-slate-800 text-center py-8">
                          {determinant.toFixed(6)}
                      </div>
                  )}

                  {matrixInv && (
                      <div className="flex justify-center overflow-auto custom-scrollbar">
                         {renderMatrix(matrixInv)}
                      </div>
                  )}

                  {resultMatrix && (
                      <div className="flex justify-center overflow-auto custom-scrollbar">
                         {renderMatrix(resultMatrix)}
                      </div>
                  )}

                  {/* LU Result (L and U) */}
                  {type === AlgorithmType.LU_DECOMPOSITION && matrixL && matrixU && (
                      <div className="space-y-6">
                           <div>
                               <h3 className="text-slate-500 font-bold mb-2 text-xs uppercase">Lower Triangular (L)</h3>
                               <div className="flex justify-center">{renderMatrix(matrixL)}</div>
                           </div>
                           <div>
                               <h3 className="text-slate-500 font-bold mb-2 text-xs uppercase">Upper Triangular (U)</h3>
                               <div className="flex justify-center">{renderMatrix(matrixU)}</div>
                           </div>
                           {verificationMatrix && (
                               <div className="pt-4 border-t border-slate-100">
                                   <h3 className="text-emerald-600 font-bold mb-2 text-xs uppercase flex items-center gap-2">
                                       <RefreshCw className="w-3 h-3" />
                                       Verification (L × U = A)
                                   </h3>
                                   <div className="flex justify-center">{renderMatrix(verificationMatrix)}</div>
                               </div>
                           )}
                      </div>
                  )}

                  {/* Cholesky Result (L and L^T) */}
                  {type === AlgorithmType.CHOLESKY_DECOMPOSITION && matrixL && matrixU && (
                      <div className="space-y-6">
                           <div>
                               <h3 className="text-slate-500 font-bold mb-2 text-xs uppercase">Lower Triangular (L)</h3>
                               <div className="flex justify-center">{renderMatrix(matrixL)}</div>
                           </div>
                           <div>
                               <h3 className="text-slate-500 font-bold mb-2 text-xs uppercase">Transpose (Lᵀ)</h3>
                               <div className="flex justify-center">{renderMatrix(matrixU)}</div>
                           </div>
                           {verificationMatrix && (
                               <div className="pt-4 border-t border-slate-100">
                                   <h3 className="text-emerald-600 font-bold mb-2 text-xs uppercase flex items-center gap-2">
                                       <RefreshCw className="w-3 h-3" />
                                       Verification (L × Lᵀ = A)
                                   </h3>
                                   <div className="flex justify-center">{renderMatrix(verificationMatrix)}</div>
                               </div>
                           )}
                      </div>
                  )}

                  {/* QR Result */}
                  {type === AlgorithmType.QR_DECOMPOSITION && matrixQ && matrixR && (
                      <div className="space-y-6">
                           <div>
                               <h3 className="text-slate-500 font-bold mb-2 text-xs uppercase">Orthogonal (Q)</h3>
                               <div className="flex justify-center">{renderMatrix(matrixQ)}</div>
                           </div>
                           <div>
                               <h3 className="text-slate-500 font-bold mb-2 text-xs uppercase">Upper Triangular (R)</h3>
                               <div className="flex justify-center">{renderMatrix(matrixR)}</div>
                           </div>
                           {verificationMatrix && (
                               <div className="pt-4 border-t border-slate-100">
                                   <h3 className="text-emerald-600 font-bold mb-2 text-xs uppercase flex items-center gap-2">
                                       <RefreshCw className="w-3 h-3" />
                                       Verification (Q × R = A)
                                   </h3>
                                   <div className="flex justify-center">{renderMatrix(verificationMatrix)}</div>
                               </div>
                           )}
                      </div>
                  )}

                  {isLinearSystem && resultX && (
                      <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                          {resultX.map((val, i) => (
                              <div key={i} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100 hover:border-emerald-200 transition-colors">
                                  <span className="text-slate-500 font-mono text-xs">x<sub>{i+1}</sub></span>
                                  <span className="text-slate-800 font-mono font-bold text-lg">{val.toFixed(6)}</span>
                              </div>
                          ))}
                      </div>
                  )}
              </div>

              {/* Visualization (Graph or Steps) */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 min-h-[300px] flex flex-col shadow-sm">
                  {isIterative && (
                      <>
                        <h3 className="text-slate-500 font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                             <RotateCcw className="w-5 h-5" />
                             Convergence History
                        </h3>
                        <div className="flex-1 -ml-4">
                             <ResponsiveContainer width="100%" height={250}>
                                 <LineChart data={iterativeData}>
                                     <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                     <XAxis dataKey="iter" stroke="#64748b" label={{value:'Iteration', position: 'insideBottom', fill: '#64748b', fontSize: 10}} tick={{fontSize: 10}} />
                                     <YAxis stroke="#64748b" scale="log" domain={['auto', 'auto']} tick={{fontSize: 10}} width={40} />
                                     <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px' }} itemStyle={{color: '#334155'}} />
                                     <Line type="monotone" dataKey="error" stroke="#10b981" strokeWidth={2} dot={{r: 2}} name="Relative Error" isAnimationActive={true} />
                                     <Legend wrapperStyle={{fontSize: '12px', color: '#64748b'}} />
                                 </LineChart>
                             </ResponsiveContainer>
                        </div>
                      </>
                  )}

                  {isDecomp && algoSteps.length > 0 ? (
                      <div className="flex flex-col h-full">
                          <h3 className="text-slate-500 font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                             <ListOrdered className="w-5 h-5" />
                             Algorithm Steps
                          </h3>
                          <div className="flex-1 overflow-y-auto max-h-[300px] custom-scrollbar bg-slate-50 rounded-lg border border-slate-200 p-4 space-y-1">
                              {algoSteps.map((step, idx) => (
                                  <div key={idx} className="text-xs font-mono text-slate-600 border-b border-slate-100 last:border-0 py-2 leading-relaxed">
                                      {step}
                                  </div>
                              ))}
                          </div>
                      </div>
                  ) : null}

                  {/* Fallback for other methods or before calculation */}
                  {!isIterative && (!isDecomp || algoSteps.length === 0) && (
                      <div className="flex flex-col items-center justify-center h-full text-slate-400 text-sm italic p-4 text-center">
                           {type === AlgorithmType.LU_DECOMPOSITION && "Decomposes A into Lower (L) and Upper (U) triangular matrices."}
                           {type === AlgorithmType.CHOLESKY_DECOMPOSITION && "Computes unique L such that A = LLᵀ. A must be symmetric and positive-definite."}
                           {type === AlgorithmType.QR_DECOMPOSITION && "Computes Q (Orthogonal) and R (Upper Triangular) via Gram-Schmidt process."}
                           {type === AlgorithmType.MATRIX_INVERSE && "Inversion computed via Gauss-Jordan on Augmented Matrix [A | I]"}
                           {isMult && `Computing product of ${m}×${n} and ${n}×${p} matrices.`}
                           {isTranspose && `Swapping rows and columns.`}
                           {(!isDecomp && !isMult && !isTranspose && !type.includes('Inverse')) && "Visual representation available after calculation."}
                      </div>
                  )}
              </div>
          </div>
      )}
    </div>
  );
};