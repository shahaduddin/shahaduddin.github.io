
import React from 'react';

export enum TopicCategory {
  ROOTS = 'Roots of Equations',
  LINEAR = 'Linear Systems',
  MATRIX_OPS = 'Matrix Operations',
  INTERPOLATION = 'Interpolation',
  DIFFERENTIATION = 'Differentiation',
  INTEGRATION = 'Integration',
  ODE = 'Differential Equations',
}

export enum AlgorithmType {
  INCREMENTAL_SEARCH = 'Incremental Search',
  BISECTION = 'Bisection Method',
  FALSE_POSITION = 'False Position',
  NEWTON_RAPHSON = 'Newton-Raphson',
  SECANT = 'Secant Method',
  FIXED_POINT_ITERATION = 'Fixed Point Iteration',
  MULLER = "Müller's Method",
  GAUSSIAN = 'Gaussian Elimination',
  GAUSS_JORDAN = 'Gauss-Jordan Elimination',
  JACOBI = 'Jacobi Iteration',
  GAUSS_SEIDEL = 'Gauss-Seidel Iteration',
  LU_DECOMPOSITION = 'LU Decomposition',
  CHOLESKY_DECOMPOSITION = 'Cholesky Decomposition',
  QR_DECOMPOSITION = 'QR Decomposition',
  MATRIX_INVERSE = 'Matrix Inverse',
  MATRIX_DETERMINANT = 'Matrix Determinant',
  MATRIX_TRANSPOSE = 'Matrix Transpose',
  MATRIX_ADDITION = 'Matrix Addition',
  MATRIX_SUBTRACTION = 'Matrix Subtraction',
  MATRIX_MULTIPLICATION = 'Matrix Multiplication',
  LAGRANGE = 'Lagrange Interpolation',
  NEWTON_DIVIDED_DIFFERENCE = 'Newton Divided Difference',
  LINEAR_SPLINE = 'Linear Spline',
  QUADRATIC_SPLINE = 'Quadratic Spline',
  CUBIC_SPLINE = 'Cubic Spline',
  NEWTON_FORWARD_DIFFERENCE = 'Newton Forward Difference',
  NEWTON_BACKWARD_DIFFERENCE = 'Newton Backward Difference',
  GAUSS_FORWARD_INTERPOLATION = 'Gauss Forward Interpolation',
  GAUSS_BACKWARD_INTERPOLATION = 'Gauss Backward InterpolATION',
  SIMPSON = "Simpson's 1/3 Rule",
  TRAPEZOIDAL = 'Trapezoidal Rule',
  FORWARD_DIFFERENCE = 'Forward Difference',
  BACKWARD_DIFFERENCE = 'Backward Difference',
  CENTRAL_DIFFERENCE = 'Central Difference',
  SECOND_DERIVATIVE_CENTRAL = 'Second Derivative (Central)',
  EULER = "Euler's Method",
  RK4 = 'Runge-Kutta 4th Order',
}

export interface TheoryData {
  title: string;
  concept: string;
  formula: string;
  convergence: string;
  steps: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  prerequisites: string[];
  applications: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export type CodeLanguage = 'python' | 'fortran' | 'cpp';
