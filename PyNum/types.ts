import React from 'react';

export enum TopicCategory {
  ROOTS = 'Roots of Equations',
  LINEAR = 'Linear Systems',
  INTERPOLATION = 'Interpolation',
  INTEGRATION = 'Integration',
  DIFFERENTIATION = 'Differentiation',
  ODE = 'Differential Equations (ODE)',
}

export enum AlgorithmType {
  BISECTION = 'Bisection Method',
  FALSE_POSITION = 'False Position (Regula Falsi)',
  NEWTON_RAPHSON = 'Newton-Raphson',
  SECANT = 'Secant Method',
  FIXED_POINT_ITERATION = 'Fixed Point Iteration',
  
  // Linear Systems
  GAUSSIAN = 'Gaussian Elimination',
  GAUSS_JORDAN = 'Gauss-Jordan Elimination',
  JACOBI = 'Jacobi Iteration',
  GAUSS_SEIDEL = 'Gauss-Seidel Iteration',
  
  // Matrix Decompositions
  LU_DECOMPOSITION = 'LU Decomposition',
  CHOLESKY_DECOMPOSITION = 'Cholesky Decomposition',
  QR_DECOMPOSITION = 'QR Decomposition',
  
  // Matrix Operations
  MATRIX_INVERSE = 'Matrix Inverse',
  MATRIX_DETERMINANT = 'Matrix Determinant',
  MATRIX_TRANSPOSE = 'Matrix Transpose',
  MATRIX_ADDITION = 'Matrix Addition',
  MATRIX_SUBTRACTION = 'Matrix Subtraction',
  MATRIX_MULTIPLICATION = 'Matrix Multiplication',
  
  // Unevenly Spaced
  LAGRANGE = 'Lagrange Interpolation',
  NEWTON_DIVIDED_DIFFERENCE = 'Newton Divided Difference',
  LINEAR_SPLINE = 'Linear Spline',
  QUADRATIC_SPLINE = 'Quadratic Spline',
  CUBIC_SPLINE = 'Cubic Spline',
  
  // Evenly Spaced
  NEWTON_FORWARD_DIFFERENCE = 'Newton Forward Difference',
  NEWTON_BACKWARD_DIFFERENCE = 'Newton Backward Difference',
  GAUSS_FORWARD_INTERPOLATION = 'Gauss Forward Interpolation',
  GAUSS_BACKWARD_INTERPOLATION = 'Gauss Backward Interpolation',

  SIMPSON = "Simpson's 1/3 Rule",
  TRAPEZOIDAL = 'Trapezoidal Rule',
  EULER = "Euler's Method",
  RK4 = 'Runge-Kutta 4th Order',
}

export interface TheoryData {
  title: string;
  concept: string;
  formula: string;
  convergence: string;
  steps: string[];
}

export interface NumericalTopic {
  id: string;
  category: TopicCategory;
  name: AlgorithmType;
  description: string;
  pythonCode: string;
  demoComponent?: React.FC;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}