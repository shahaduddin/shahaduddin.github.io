import { AlgorithmType, TheoryData } from './types';

export const PYTHON_SNIPPETS: Record<AlgorithmType, string> = {
  [AlgorithmType.INCREMENTAL_SEARCH]: `import math

def incremental_search(f, a, b, step=0.1):
    """
    Detailed Incremental Search for Transcendental Equations.
    Scans [a, b] to find sub-intervals where the function changes sign.
    """
    brackets = []
    x1 = a
    f1 = f(a)
    
    while x1 < b:
        x2 = min(x1 + step, b)
        f2 = f(x2)
        
        # Check for root or sign change
        if f1 * f2 <= 0:
            brackets.append((x1, x2))
            
        x1 = x2
        f1 = f2
        
    return brackets

# Example: Solve e^x - 3x = 0
f = lambda x: math.exp(x) - 3*x
print(f"Brackets: {incremental_search(f, 0, 5, 0.2)}")`,

  [AlgorithmType.BISECTION]: `def bisection(f, a, b, tol=1e-6, max_iter=100):
    """
    Standard Bisection Method for root finding.
    Guaranteed convergence for continuous functions.
    """
    if f(a) * f(b) >= 0:
        raise ValueError("f(a) and f(b) must have opposite signs")
    
    for i in range(max_iter):
        c = (a + b) / 2
        if abs(f(c)) < tol or (b - a) / 2 < tol:
            return c
        
        if f(c) * f(a) < 0:
            b = c
        else:
            a = c
            
    return (a + b) / 2

# Example Usage
import math
func = lambda x: x**3 - x - 2 # Transcendental or Algebraic
root = bisection(func, 1, 2)
print(f"Root: {root}")`,

  [AlgorithmType.FALSE_POSITION]: `def false_position(f, a, b, tol=1e-6, max_iter=100):
    """
    False Position (Regula Falsi) Method.
    Uses linear interpolation to find roots faster than Bisection.
    """
    if f(a) * f(b) >= 0:
        raise ValueError("Root not bracketed")
        
    for i in range(max_iter):
        # Linear interpolation formula
        c = (a * f(b) - b * f(a)) / (f(b) - f(a))
        
        if abs(f(c)) < tol:
            return c
            
        if f(c) * f(a) < 0:
            b = c
        else:
            a = c
            
    return c

# Example Usage
func = lambda x: x**3 - x - 2
root = false_position(func, 1, 2)
print(f"Root: {root}")`,

  [AlgorithmType.NEWTON_RAPHSON]: `def newton_raphson(f, df, x0, tol=1e-6, max_iter=100):
    """
    Newton-Raphson Method.
    Quadratic convergence for smooth functions.
    """
    x = x0
    for i in range(max_iter):
        fx = f(x)
        dfx = df(x)
        if dfx == 0:
            raise ValueError("Derivative is zero. No solution found.")
            
        x_new = x - fx / dfx
        
        if abs(x_new - x) < tol:
            return x_new
        
        x = x_new
        
    return x

# Example Usage
f = lambda x: x**2 - 4
df = lambda x: 2*x
root = newton_raphson(f, df, 10)
print(f"Root: {root}")`,

  [AlgorithmType.SECANT]: `def secant_method(f, x0, x1, tol=1e-6, max_iter=100):
    """
    Secant Method for transcendental equations.
    Requires two initial points, no derivative needed.
    """
    for i in range(max_iter):
        fx0 = f(x0)
        fx1 = f(x1)
        
        if fx1 - fx0 == 0:
            raise ValueError("Division by zero")
            
        x2 = x1 - fx1 * (x1 - x0) / (fx1 - fx0)
        
        if abs(x2 - x1) < tol:
            return x2
            
        x0, x1 = x1, x2
        
    return x1

# Example Usage
f = lambda x: x**3 - x - 2
root = secant_method(f, 1, 2)
print(f"Root: {root}")`,

  [AlgorithmType.FIXED_POINT_ITERATION]: `def fixed_point_iteration(g, x0, tol=1e-6, max_iter=100):
    """
    Solves x = g(x) given an initial guess x0.
    Find roots by rearranging f(x)=0 into x = g(x).
    """
    x = x0
    for i in range(max_iter):
        x_new = g(x)
        
        if abs(x_new - x) < tol:
            return x_new
            
        x = x_new
        
    print("Warning: Max iterations reached")
    return x

# Example: Root of x^2 - x - 1 = 0 -> x = 1 + 1/x
g = lambda x: 1 + 1/x
root = fixed_point_iteration(g, 1.5)
print(f"Root: {root}")`,

  [AlgorithmType.MULLER]: `import cmath

def muller_method(f, x0, x1, x2, tol=1e-6, max_iter=100):
    """
    Muller's Method: Uses a parabolic arc to find roots.
    Supports complex roots automatically.
    """
    for i in range(max_iter):
        h1 = x1 - x0
        h2 = x2 - x1
        d1 = (f(x1) - f(x0)) / h1
        d2 = (f(x2) - f(x1)) / h2
        a = (d2 - d1) / (h2 + h1)
        b = a * h2 + d2
        c = f(x2)
        
        # Quadratic formula to find root of parabola
        disc = cmath.sqrt(b**2 - 4*a*c)
        den = b + disc if abs(b + disc) > abs(b - disc) else b - disc
        dx = -2 * c / den
        x3 = x2 + dx
        
        if abs(dx) < tol:
            return x3
        
        x0, x1, x2 = x1, x2, x3
        
    return x2

# Example
f = lambda x: x**3 + 1
root = muller_method(f, -1.5, -0.5, 0.5)
print(f"Root: {root}")`,

  [AlgorithmType.GAUSSIAN]: `import numpy as np

def gaussian_elimination(A, b):
    n = len(b)
    # Augment matrix
    M = np.hstack([A, b.reshape(-1, 1)])
    
    # Forward Elimination
    for i in range(n):
        # Pivot
        if M[i][i] == 0: raise ValueError("Zero pivot detected")
        
        for j in range(i+1, n):
            ratio = M[j][i] / M[i][i]
            M[j] = M[j] - ratio * M[i]
            
    # Back Substitution
    x = np.zeros(n)
    for i in range(n-1, -1, -1):
        x[i] = (M[i][-1] - np.sum(M[i][i+1:n] * x[i+1:n])) / M[i][i]
        
    return x`,

  [AlgorithmType.GAUSS_JORDAN]: `import numpy as np

def gauss_jordan(A, b):
    n = len(b)
    M = np.hstack([A, b.reshape(-1, 1)]) # Augmented Matrix

    for i in range(n):
        # Normalize Pivot Row
        M[i] = M[i] / M[i][i]
        
        # Eliminate other rows
        for j in range(n):
            if i != j:
                M[j] = M[j] - M[j][i] * M[i]
                
    return M[:, -1] # Last column is the solution`,

  [AlgorithmType.LU_DECOMPOSITION]: `import numpy as np

def lu_decomposition(A):
    n = len(A)
    L = np.eye(n)
    U = np.zeros((n, n))
    
    for i in range(n):
        # Upper Triangular
        for k in range(i, n):
            sum_val = sum(L[i][j] * U[j][k] for j in range(i))
            U[i][k] = A[i][k] - sum_val
            
        # Lower Triangular
        for k in range(i+1, n):
            sum_val = sum(L[k][j] * U[j][i] for j in range(i))
            L[k][i] = (A[k][i] - sum_val) / U[i][i]
            
    return L, U`,

  [AlgorithmType.CHOLESKY_DECOMPOSITION]: `import numpy as np

def cholesky(A):
    n = len(A)
    L = np.zeros((n, n))
    for i in range(n):
        for k in range(i + 1):
            tmp_sum = sum(L[i][j] * L[k][j] for j in range(k))
            if i == k:
                L[i][k] = np.sqrt(A[i][i] - tmp_sum)
            else:
                L[i][k] = (1.0 / L[k][k] * (A[i][k] - tmp_sum))
    return L`,

  [AlgorithmType.QR_DECOMPOSITION]: `import numpy as np

def qr_decomposition(A):
    m, n = A.shape
    Q = np.zeros((m, n))
    R = np.zeros((n, n))
    
    for j in range(n):
        v = A[:, j]
        for i in range(j):
            R[i, j] = np.dot(Q[:, i], A[:, j])
            v = v - R[i, j] * Q[:, i]
        R[j, j] = np.linalg.norm(v)
        Q[:, j] = v / R[j, j]
    return Q, R`,

  [AlgorithmType.JACOBI]: `import numpy as np

def jacobi_iteration(A, b, x0=None, tol=1e-5, max_iter=100):
    n = len(b)
    if x0 is None: x0 = np.zeros(n)
    x = x0.copy()
    
    for k in range(max_iter):
        x_new = np.zeros(n)
        for i in range(n):
            s = sum(A[i][j] * x[j] for j in range(n) if i != j)
            x_new[i] = (b[i] - s) / A[i][i]
            
        if np.linalg.norm(x_new - x) < tol:
            return x_new
        x = x_new
        
    return x`,

  [AlgorithmType.GAUSS_SEIDEL]: `import numpy as np

def gauss_seidel(A, b, x0=None, tol=1e-5, max_iter=100):
    n = len(b)
    if x0 is None: x0 = np.zeros(n)
    x = x0.copy()
    
    for k in range(max_iter):
        x_old = x.copy()
        for i in range(n):
            s = sum(A[i][j] * x[j] for j in range(n) if i != j)
            x[i] = (b[i] - s) / A[i][i]
            
        if np.linalg.norm(x - x_old) < tol:
            return x
            
    return x`,

  [AlgorithmType.MATRIX_INVERSE]: `import numpy as np

def invert_matrix(A):
    """
    Computes the inverse of matrix A using Gauss-Jordan elimination.
    Matrix A must be square and non-singular.
    """
    n = len(A)
    # Create augmented matrix [A | I]
    M = np.hstack([A, np.eye(n)])
    
    for i in range(n):
        # Pivoting
        pivot = M[i][i]
        if abs(pivot) < 1e-15:
            raise ValueError("Matrix is singular and cannot be inverted")
            
        M[i] = M[i] / pivot
        for j in range(n):
            if i != j:
                M[j] -= M[j][i] * M[i]
                
    return M[:, n:]

# Usage with NumPy: result = np.linalg.inv(A)`,

  [AlgorithmType.MATRIX_DETERMINANT]: `import numpy as np

def matrix_determinant(A):
    """
    Computes the determinant of matrix A using Gaussian elimination.
    Complexity: O(n^3)
    """
    n = len(A)
    M = A.copy().astype(float)
    det = 1.0
    
    for i in range(n):
        # Pivot selection
        pivot_idx = i + np.argmax(np.abs(M[i:, i]))
        if abs(M[pivot_idx, i]) < 1e-15:
            return 0.0
            
        if pivot_idx != i:
            M[[i, pivot_idx]] = M[[pivot_idx, i]]
            det *= -1  # Swap changes determinant sign
            
        det *= M[i, i]
        for j in range(i + 1, n):
            M[j, i:] -= M[j, i] / M[i, i] * M[i, i:]
            
    return det

# Usage with NumPy: result = np.linalg.det(A)`,

  [AlgorithmType.MATRIX_ADDITION]: `import numpy as np

def matrix_addition(A, B):
    """
    Performs element-wise addition of two matrices.
    Matrices must have the same dimensions.
    """
    A_np = np.array(A)
    B_np = np.array(B)
    if A_np.shape != B_np.shape:
        raise ValueError("Matrices must have the same dimensions")
    
    # Manual implementation for demonstration
    rows, cols = A_np.shape
    C = [[0.0 for _ in range(cols)] for _ in range(rows)]
    for i in range(rows):
        for j in range(cols):
            C[i][j] = A_np[i, j] + B_np[i, j]
    return C`,

  [AlgorithmType.MATRIX_SUBTRACTION]: `import numpy as np

def matrix_subtraction(A, B):
    """
    Performs element-wise subtraction of two matrices.
    Matrices must have the same dimensions.
    """
    A_np = np.array(A)
    B_np = np.array(B)
    if A_np.shape != B_np.shape:
        raise ValueError("Matrices must have the same dimensions")
    
    # Manual implementation for demonstration
    rows, cols = A_np.shape
    C = [[0.0 for _ in range(cols)] for _ in range(rows)]
    for i in range(rows):
        for j in range(cols):
            C[i][j] = A_np[i, j] - B_np[i, j]
    return C`,

  [AlgorithmType.MATRIX_MULTIPLICATION]: `import numpy as np

def matrix_multiply(A, B):
    """
    Matrix Multiplication implementation (O(n^3)).
    Multiplies Matrix A (m x n) by Matrix B (n x p).
    """
    A_np = np.array(A)
    B_np = np.array(B)
    m, n = A_np.shape
    nb, p = B_np.shape
    
    if n != nb:
        raise ValueError("Number of columns in A match rows in B")
        
    # Manual loop multiplication
    C = [[0.0 for _ in range(p)] for _ in range(m)]
    for i in range(m):
        for j in range(p):
            for k in range(n):
                C[i][j] += A_np[i, k] * B_np[k, j]
    return C

# Usage with NumPy: result = A @ B`,

  [AlgorithmType.MATRIX_TRANSPOSE]: `import numpy as np

def matrix_transpose(A):
    """
    Computes the transpose of a matrix by swapping rows and columns.
    """
    A_np = np.array(A)
    rows, cols = A_np.shape
    
    T = [[0.0 for _ in range(rows)] for _ in range(cols)]
    for i in range(rows):
        for j in range(cols):
            T[j][i] = A_np[i, j]
    return T

# Usage with NumPy: result = A.T`,

  [AlgorithmType.LAGRANGE]: `def lagrange_interpolation(x_nodes, y_values, xi):
    """
    Lagrange Polynomial Interpolation.
    Computes the y-value at xi based on given data points.
    """
    n = len(x_nodes)
    result = 0.0
    
    for i in range(n):
        term = y_values[i]
        for j in range(n):
            if i != j:
                # Basis polynomial L_i(x)
                term = term * (xi - x_nodes[j]) / (x_nodes[i] - x_nodes[j])
        result += term
        
    return result

# Example Usage
x = [0, 1, 2, 3]
y = [1, 2, 4, 8]
target = 1.5
print(f"Interpolated value at {target}: {lagrange_interpolation(x, y, target)}")`,

  [AlgorithmType.NEWTON_DIVIDED_DIFFERENCE]: `def newton_divided_difference(x_nodes, y_values, xi):
    """
    Newton's Divided Difference Interpolation.
    Calculates the coefficients of the Newton form of the interpolating polynomial.
    """
    n = len(x_nodes)
    # Create a table for divided differences
    table = [[0.0] * n for _ in range(n)]
    
    # First column is y values
    for i in range(n):
        table[i][0] = y_values[i]
        
    # Fill the table
    for j in range(1, n):
        for i in range(n - j):
            table[i][j] = (table[i+1][j-1] - table[i][j-1]) / (x_nodes[i+j] - x_nodes[i])
    
    # The coefficients are the diagonal of the table
    coef = [table[0][i] for i in range(n)]
    
    # Evaluate the polynomial at xi using Horner-like scheme
    result = coef[0]
    product = 1.0
    for i in range(1, n):
        product *= (xi - x_nodes[i-1])
        result += coef[i] * product
        
    return result

# Example Usage
x = [0, 1, 2, 4]
y = [1, 1, 2, 5]
target = 1.5
print(f"P({target}) = {newton_divided_difference(x, y, target)}")`,

  [AlgorithmType.LINEAR_SPLINE]: `def linear_spline(x, y, xi):
    """
    Linear Spline Interpolation.
    Finds the interval [x[i], x[i+1]] containing xi and uses linear interpolation.
    """
    n = len(x)
    for i in range(n - 1):
        # Check if xi falls within the current interval
        if x[i] <= xi <= x[i+1]:
            # Linear formula: y = y0 + (y1 - y0)/(x1 - x0) * (x - x0)
            slope = (y[i+1] - y[i]) / (x[i+1] - x[i])
            return y[i] + slope * (xi - x[i])
    return None

# Example Usage
x_pts = [0, 1, 2, 5]
y_pts = [1, 3, 2, 4]
target = 1.5
val = linear_spline(x_pts, y_pts, target)
print(f"Interpolated value at {target}: {val}")`,

  [AlgorithmType.QUADRATIC_SPLINE]: `import numpy as np

def quadratic_spline(x, y, xi):
    """
    Quadratic Spline Interpolation.
    Computes coefficients a, b, c for each interval such that:
    S_i(x) = a_i(x-x_i)^2 + b_i(x-x_i) + c_i
    """
    x = np.array(x, dtype=float)
    y = np.array(y, dtype=float)
    n = len(x) - 1
    
    a = np.zeros(n)
    b = np.zeros(n)
    c = y[:-1] # c_i is simply y_i
    
    # Initial condition: assume the first segment is linear (a[0] = 0)
    a[0] = 0
    h0 = x[1] - x[0]
    b[0] = (y[1] - y[0]) / h0
    
    for i in range(1, n):
        hi_prev = x[i] - x[i-1]
        hi = x[i+1] - x[i]
        
        # Derivative continuity: 2*a[i-1]*hi_prev + b[i-1] = b[i]
        b[i] = 2 * a[i-1] * hi_prev + b[i-1]
        
        # Function value at endpoint: a[i]*hi^2 + b[i]*hi + c[i] = y[i+1]
        a[i] = (y[i+1] - y[i] - b[i] * hi) / (hi**2)
        
    # Find active interval and evaluate
    for i in range(n):
        if x[i] <= xi <= x[i+1]:
            dx = xi - x[i]
            return a[i] * dx**2 + b[i] * dx + c[i]
    return None

# Example
x_pts = [0, 1, 2, 3]
y_pts = [0, 1, 0, 1]
print(f"P(1.5) = {quadratic_spline(x_pts, y_pts, 1.5)}")`,

  [AlgorithmType.CUBIC_SPLINE]: `import numpy as np

def cubic_spline(x, y, xi):
    """
    Natural Cubic Spline Interpolation.
    Constructs piece-wise cubic polynomials with continuous 1st and 2nd derivatives.
    Returns the interpolated value at xi.
    """
    x = np.array(x, dtype=float)
    y = np.array(y, dtype=float)
    n = len(x)
    h = np.diff(x)
    
    # System for natural cubic spline (second derivatives M)
    # A * M = B
    A = np.zeros((n, n))
    B = np.zeros(n)
    
    # Natural boundary conditions: M[0] = M[n-1] = 0
    A[0, 0] = 1
    A[n-1, n-1] = 1
    
    for i in range(1, n-1):
        A[i, i-1] = h[i-1] / 6
        A[i, i] = (h[i-1] + h[i]) / 3
        A[i, i+1] = h[i] / 6
        B[i] = (y[i+1] - y[i]) / h[i] - (y[i] - y[i-1]) / h[i-1]
        
    # Solve for second derivatives M
    M = np.linalg.solve(A, B)
    
    # Find interval for xi
    for i in range(n - 1):
        if x[i] <= xi <= x[i+1]:
            dx_prev = xi - x[i]
            dx_next = x[i+1] - xi
            hi = h[i]
            
            # Cubic polynomial evaluation
            val = (M[i] * dx_next**3 + M[i+1] * dx_prev**3) / (6 * hi) + \
                  (y[i] / hi - M[i] * hi / 6) * dx_next + \
                  (y[i+1] / hi - M[i+1] * hi / 6) * dx_prev
            return val
    return None

# Example
x_nodes = [0, 1, 2, 3]
y_nodes = [1, 2, 0, 1]
print(f"Cubic Spline at 1.5: {cubic_spline(x_nodes, y_nodes, 1.5)}")`,

  [AlgorithmType.NEWTON_FORWARD_DIFFERENCE]: `import numpy as np

def newton_forward_interpolation(x, y, xi):
    """
    Newton Forward Difference Interpolation for evenly spaced data.
    """
    n = len(x)
    h = x[1] - x[0]
    
    # Difference table
    diff = np.zeros((n, n))
    diff[:, 0] = y
    
    for j in range(1, n):
        for i in range(n - j):
            diff[i][j] = diff[i+1][j-1] - diff[i][j-1]
            
    # Formula evaluation
    u = (xi - x[0]) / h
    result = diff[0][0]
    u_term = 1.0
    fact = 1.0
    
    for i in range(1, n):
        u_term *= (u - (i - 1))
        fact *= i
        result += (u_term * diff[0][i]) / fact
        
    return result

# Example
x_pts = [10, 20, 30, 40]
y_pts = [1.1, 2.1, 3.5, 5.2]
target = 15
print(f"Interpolated value at {target}: {newton_forward_interpolation(x_pts, y_pts, target)}")`,

  [AlgorithmType.NEWTON_BACKWARD_DIFFERENCE]: `import numpy as np

def newton_backward_interpolation(x, y, xi):
    """
    Newton Backward Difference Interpolation for evenly spaced data.
    Best for estimating values near the end of the table.
    """
    n = len(x)
    h = x[1] - x[0]
    
    # Difference table
    diff = np.zeros((n, n))
    diff[:, 0] = y
    
    for j in range(1, n):
        for i in range(n-1, j-1, -1):
            diff[i][j] = diff[i][j-1] - diff[i-1][j-1]
            
    # Formula evaluation
    u = (xi - x[n-1]) / h
    result = diff[n-1][0]
    u_term = 1.0
    fact = 1.0
    
    for i in range(1, n):
        u_term *= (u + (i - 1))
        fact *= i
        result += (u_term * diff[n - 1][i]) / fact
        
    return result

# Example
x_pts = [10, 20, 30, 40]
y_pts = [1.1, 2.1, 3.5, 5.2]
target = 35
print(f"Interpolated value at {target}: {newton_backward_interpolation(x_pts, y_pts, target)}")`,

  [AlgorithmType.GAUSS_FORWARD_INTERPOLATION]: `import numpy as np

def gauss_forward(x, y, xi):
    n = len(x)
    h = x[1] - x[0]
    mid = n // 2
    diff = np.zeros((n, n))
    diff[:,0] = y
    for j in range(1, n):
        for i in range(n - j):
            diff[i][j] = diff[i+1][j-1] - diff[i][j-1]
    u = (xi - x[mid]) / h
    result = diff[mid][0]
    u_term = 1; fact = 1
    for i in range(1, n):
        if i % 2 == 0: u_term *= (u - i//2)
        else: u_term *= (u + i//2)
        fact *= i
        idx = mid - (i // 2)
        if 0 <= idx < n - i:
            result += (u_term * diff[idx][i]) / fact
    return result`,

  [AlgorithmType.GAUSS_BACKWARD_INTERPOLATION]: `import numpy as np

def gauss_backward(x, y, xi):
    n = len(x)
    h = x[1] - x[0]
    mid = n // 2
    diff = np.zeros((n, n))
    diff[:,0] = y
    for j in range(1, n):
        for i in range(n - j):
            diff[i][j] = diff[i+1][j-1] - diff[i][j-1]
    u = (xi - x[mid]) / h
    result = diff[mid][0]
    u_term = 1; fact = 1
    for i in range(1, n):
        if i % 2 == 0: u_term *= (u + i//2)
        else: u_term *= (u - i//2)
        fact *= i
        idx = mid - ((i + 1) // 2)
        if 0 <= idx < n - i:
            result += (u_term * diff[idx][i]) / fact
    return result`,

  [AlgorithmType.SIMPSON]: `import math

def simpsons_13_rule(f, a, b, n):
    """
    Simpson's 1/3 Rule for numerical integration.
    n must be an even integer for parabolic approximation.
    """
    if n % 2 != 0:
        raise ValueError("Number of intervals (n) must be even for Simpson's 1/3 Rule.")

    h = (b - a) / n
    integral = f(a) + f(b)

    for i in range(1, n):
        x = a + i * h
        # Apply weighting: 4 for odd, 2 for even nodes
        if i % 2 == 0:
            integral += 2 * f(x)
        else:
            integral += 4 * f(x)

    return (h / 3) * integral

# Example: Integrate sin(x) from 0 to pi
f = math.sin
result = simpsons_13_rule(f, 0, math.pi, 100)
print(f"Integral result: {result}")`,

  [AlgorithmType.TRAPEZOIDAL]: `import math

def trapezoidal_rule(f, a, b, n):
    """
    Trapezoidal Rule for numerical integration.
    Approximates the area under f(x) using trapezoids.
    """
    h = (b - a) / n
    integral = 0.5 * (f(a) + f(b))

    for i in range(1, n):
        integral += f(a + i * h)

    return h * integral

# Example: Integrate x^2 from 0 to 1
f = lambda x: x**2
result = trapezoidal_rule(f, 0, 1, 100)
print(f"Integral result: {result}")`,

  [AlgorithmType.FORWARD_DIFFERENCE]: `def forward_difference(f, x, h=1e-5):
    """
    Computes the first derivative using Forward Difference Method.
    The approximation is based on the limit definition of a derivative.
    Error: O(h)
    """
    return (f(x + h) - f(x)) / h

# Example: Derivative of sin(x) at x=0
import math
f = math.sin
x = 0
h = 1e-5
df = forward_difference(f, x, h)
print(f"f'({x}) ≈ {df}") # Should be close to cos(0) = 1.0`,

  [AlgorithmType.BACKWARD_DIFFERENCE]: `import math

def backward_difference(f, x, h=1e-5):
    """
    Computes the first derivative using Backward Difference Method.
    Uses the current and immediate previous point for estimation.
    Error: O(h)
    """
    return (f(x) - f(x - h)) / h

# Example: Derivative of exp(x) at x=1
f = math.exp
x = 1.0
h = 1e-5
df = backward_difference(f, x, h)
print(f"f'({x}) ≈ {df}") 
print(f"Exact: {math.exp(1.0)}")`,

  [AlgorithmType.CENTRAL_DIFFERENCE]: `import math

def central_difference(f, x, h=1e-5):
    """
    Computes the first derivative using Central Difference Method.
    Uses points surrounding the target for higher accuracy.
    Error: O(h^2)
    """
    return (f(x + h) - f(x - h)) / (2 * h)

# Example: Derivative of sin(x) at x=pi/4
f = math.sin
x = math.pi / 4
h = 1e-5
df = central_difference(f, x, h)
print(f"f'({x}) ≈ {df}")
print(f"Exact: {math.cos(math.pi/4)}")`,

  [AlgorithmType.SECOND_DERIVATIVE_CENTRAL]: `def second_derivative_central(f, x, h=1e-5):
    """
    Computes the second derivative using the Central Difference Method.
    Formula: f''(x) ≈ [f(x+h) - 2f(x) + f(x-h)] / h²
    Error: O(h²)
    """
    return (f(x + h) - 2*f(x) + f(x - h)) / (h**2)

# Example: f(x) = x^3, f''(x) = 6x. At x=2, f''(2)=12
f = lambda x: x**3
x = 2.0
h = 0.001
d2f = second_derivative_central(f, x, h)
print(f"f''({x}) ≈ {d2f:.6f}")`,

  [AlgorithmType.EULER]: `def euler_method(f, x0, y0, h, steps):
    """
    Euler's Method for solving Ordinary Differential Equations (ODEs).
    Solves dy/dx = f(x, y) starting from (x0, y0).
    """
    results = [(x0, y0)]
    xn, yn = x0, y0
    for _ in range(steps):
        # Update rule: y_{n+1} = y_n + h * f(x_n, y_n)
        yn = yn + h * f(xn, yn)
        xn = xn + h
        results.append((xn, yn))
    return results

# Example: solve dy/dx = x + y, with y(0) = 1
f = lambda x, y: x + y
x0, y0, h, steps = 0, 1, 0.1, 10
solution = euler_method(f, x0, y0, h, steps)
print("Euler Results (x, y):")
for res in solution:
    print(f"({res[0]:.1f}, {res[1]:.4f})")`,

  [AlgorithmType.RK4]: `def rk4_method(f, x0, y0, h, steps):
    """
    Runge-Kutta 4th Order Method for solving ODEs.
    Provides higher accuracy than Euler's method by sampling slopes at multiple points.
    """
    results = [(x0, y0)]
    xn, yn = x0, y0
    for _ in range(steps):
        k1 = h * f(xn, yn)
        k2 = h * f(xn + h/2, yn + k1/2)
        k3 = h * f(xn + h/2, yn + k2/2)
        k4 = h * f(xn + h, yn + k3)
        
        # Weighted average of slopes
        yn = yn + (k1 + 2*k2 + 2*k3 + k4) / 6
        xn = xn + h
        results.append((xn, yn))
    return results

# Example: solve dy/dx = x + y, with y(0) = 1
f = lambda x, y: x + y
x0, y0, h, steps = 0, 1, 0.1, 10
solution = rk4_method(f, x0, y0, h, steps)
print("RK4 Results (x, y):")
for res in solution:
    print(f"({res[0]:.1f}, {res[1]:.4f})")`,
};

export const FORTRAN_SNIPPETS: Record<AlgorithmType, string> = {
  [AlgorithmType.BISECTION]: `program bisection
    implicit none
    real :: a, b, c, fa, fb, fc, tol
    integer :: i
    a = 1.0; b = 2.0; tol = 1e-6
    if (f(a) * f(b) >= 0) stop "Root not bracketed"
    do i = 1, 100
        c = (a + b) / 2.0
        fc = f(c)
        if (abs(fc) < tol .or. (b - a)/2.0 < tol) exit
        if (fc * f(a) < 0) then; b = c; else; a = c; end if
    end do
    print *, "Root: ", c
contains
    real function f(x)
        real, intent(in) :: x
        f = x**3 - x - 2.0
    end function f
end program`,
  [AlgorithmType.NEWTON_RAPHSON]: `program newton_raphson
    implicit none
    real :: x, x_new, tol
    x = 10.0; tol = 1e-6
    do i = 1, 100
        if (df(x) == 0) stop "Derivative zero"
        x_new = x - f(x) / df(x)
        if (abs(x_new - x) < tol) exit
        x = x_new
    end do
    print *, "Root: ", x_new
contains
    real function f(v); real, intent(in) :: v; f = v**2 - 4.0; end function
    real function df(v); real, intent(in) :: v; df = 2.0 * v; end function
end program`,
  [AlgorithmType.INCREMENTAL_SEARCH]: `program incremental_search
    implicit none
    real :: a, b, h, x1, x2, f1, f2
    
    ! Range and Step Size
    a = 0.0
    b = 5.0
    h = 0.2
    
    x1 = a
    f1 = f(x1)
    
    print *, "Searching for root brackets in [", a, ",", b, "]..."
    
    do while (x1 < b)
        x2 = min(x1 + h, b)
        f2 = f(x2)
        
        ! Intermediate Value Theorem check
        if (f1 * f2 <= 0.0) then
            print *, "Root bracket found: [", x1, ",", x2, "]"
        end if
        
        x1 = x2
        f1 = f2
    end do

contains
    real function f(x)
        real, intent(in) :: x
        ! Transcendental: e^x - 3x
        f = exp(x) - 3.0 * x
    end function f
end program`,
  [AlgorithmType.FALSE_POSITION]: `program false_position
    implicit none
    real :: a, b, c, fa, fb, fc, tol
    integer :: i
    
    ! Initial bracket
    a = 1.0; b = 2.0; tol = 1e-6
    
    if (f(a) * f(b) >= 0) then
        print *, "Error: Root not bracketed."
        stop
    end if
    
    do i = 1, 100
        ! Interpolation: c = (a*f(b) - b*f(a)) / (f(b) - f(a))
        c = (a * f(b) - b * f(a)) / (f(b) - f(a))
        fc = f(c)
        
        if (abs(fc) < tol) exit
        
        if (fc * f(a) < 0) then
            b = c
        else
            a = c
        end if
    end do
    
    print *, "Root found: ", c
contains
    real function f(x)
        real, intent(in) :: x
        f = x**3 - x - 2.0
    end function f
end program`,
  [AlgorithmType.SECANT]: `program secant_method
    implicit none
    real :: x0, x1, x2, tol, fx0, fx1
    integer :: i, max_iter
    
    ! Parameters
    x0 = 1.0; x1 = 2.0
    tol = 1e-6; max_iter = 100
    
    print *, "Solving x^3 - x - 2 = 0 via Secant Method..."
    
    do i = 1, max_iter
        fx0 = f(x0)
        fx1 = f(x1)
        
        if (abs(fx1 - fx0) < 1e-12) then
            print *, "Error: Vertical slope encountered."
            stop
        end if
        
        ! Secant Formula
        x2 = x1 - fx1 * (x1 - x0) / (fx1 - fx0)
        
        if (abs(x2 - x1) < tol) exit
        
        x0 = x1
        x1 = x2
    end do
    
    print *, "Root found: ", x2
contains
    real function f(x)
        real, intent(in) :: x
        f = x**3 - x - 2.0
    end function f
end program`,
  [AlgorithmType.FIXED_POINT_ITERATION]: `program fixed_point
    implicit none
    real :: x, x_next, tol
    integer :: i, max_iter
    
    ! Parameters
    x = 1.0
    tol = 1e-6; max_iter = 100
    
    print *, "Solving x = g(x) via Fixed Point Iteration..."
    
    do i = 1, max_iter
        x_next = g(x)
        
        ! Convergence check
        if (abs(x_next - x) < tol) exit
        
        x = x_next
        
        if (i == max_iter) print *, "Warning: Maximum iterations reached."
    end do
    
    print *, "Root found: ", x_next

contains
    real function g(x)
        real, intent(in) :: x
        ! Example: Solving x^2 - x - 1 = 0 => x = sqrt(x + 1)
        ! This converges to the Golden Ratio (approx 1.618034)
        g = sqrt(x + 1.0)
    end function g
end program`,
  [AlgorithmType.MULLER]: `program muller_method
    implicit none
    complex :: x0, x1, x2, x3, h1, h2, d1, d2, a, b, c, disc, den, dx
    real :: tol = 1e-6
    integer :: i

    ! Muller's method requires 3 starting points
    x0 = (-1.5, 0.0); x1 = (-0.5, 0.0); x2 = (0.5, 0.0)

    do i = 1, 100
        h1 = x1 - x0; h2 = x2 - x1
        d1 = (f(x1) - f(x0)) / h1; d2 = (f(x2) - f(x1)) / h2
        
        a = (d2 - d1) / (h2 + h1)
        b = a * h2 + d2
        c = f(x2)
        
        ! Parabolic discriminant
        disc = sqrt(b**2 - 4.0 * a * c)
        
        ! Choose denominator sign for stability
        if (abs(b + disc) > abs(b - disc)) then
            den = b + disc
        else
            den = b - disc
        end if
        
        dx = -2.0 * c / den
        x3 = x2 + dx
        
        if (abs(dx) < tol) exit
        
        x0 = x1; x1 = x2; x2 = x3
    end do
    
    print *, "Root: ", x3

contains
    complex function f(x)
        complex, intent(in) :: x
        ! Example: x^3 + 1 = 0 (Has roots at -1, and 0.5 +/- i*0.866)
        f = x**3 + 1.0
    end function f
end program`,

  [AlgorithmType.GAUSSIAN]: `program gaussian_elimination
    implicit none
    integer, parameter :: n = 2
    real :: A(n, n), b(n), x(n), factor
    A = reshape([2.0, 5.0, 1.0, 7.0], [2, 2])
    b = [11.0, 13.0]
    do k = 1, n-1
        do i = k+1, n
            factor = A(i,k) / A(k,k)
            A(i,k:n) = A(i,k:n) - factor * A(k,k:n)
            b(i) = b(i) - factor * b(k)
        end do
    end do
    x(n) = b(n) / A(n,n)
    do i = n-1, 1, -1
        x(i) = (b(i) - sum(A(i,i+1:n) * x(i+1:n))) / A(i,i)
    end do
    print *, "Solution: ", x
end program`,

  [AlgorithmType.GAUSS_JORDAN]: `program gauss_jordan
    implicit none
    integer, parameter :: n = 2
    real :: M(n, n+1)
    M(1,:) = [2.0, 1.0, 11.0]; M(2,:) = [5.0, 7.0, 13.0]
    do k = 1, n
        M(k,:) = M(k,:) / M(k,k)
        do i = 1, n
            if (i /= k) M(i,:) = M(i,:) - M(i,k) * M(k,:)
        end do
    end do
    print *, "Solution: ", M(:,n+1)
end program`,

  [AlgorithmType.LU_DECOMPOSITION]: `program lu_decomposition
    implicit none
    integer, parameter :: n = 3
    real(8) :: A(n, n), L(n, n), U(n, n)
    integer :: i, j, k
    real(8) :: s

    ! Example matrix A
    A(1,:) = [4.0, 1.0, 1.0]
    A(2,:) = [1.0, 5.0, 2.0]
    A(3,:) = [1.0, 2.0, 4.0]

    L = 0.0; U = 0.0

    ! Doolittle's Algorithm for LU Decomposition
    do i = 1, n
        ! Upper Triangular
        do k = i, n
            s = 0.0
            do j = 1, i - 1
                s = s + (L(i, j) * U(j, k))
            end do
            U(i, k) = A(i, k) - s
        end do

        ! Lower Triangular
        do k = i, n
            if (i == k) then
                L(i, i) = 1.0
            else
                s = 0.0
                do j = 1, i - 1
                    s = s + (L(k, j) * U(j, i))
                end do
                L(k, i) = (A(k, i) - s) / U(i, i)
            end if
        end do
    end do

    print *, "LU Decomposition Successful."
end program`,

  [AlgorithmType.CHOLESKY_DECOMPOSITION]: `program cholesky_decomposition
    implicit none
    integer, parameter :: n = 3
    real(8) :: A(n, n), L(n, n), s
    integer :: i, j, k

    ! Symmetric positive-definite matrix A
    A(1,:) = [4.0, 12.0, -16.0]
    A(2,:) = [12.0, 37.0, -43.0]
    A(3,:) = [-16.0, -43.0, 98.0]

    L = 0.0

    do i = 1, n
        do j = 1, i
            s = 0.0
            do k = 1, j - 1
                s = s + L(i, k) * L(j, k)
            end do

            if (i == j) then
                L(i, i) = sqrt(A(i, i) - s)
            else
                L(i, j) = (A(i, j) - s) / L(j, j)
            end if
        end do
    end do

    print *, "Cholesky Factor L (Lower Triangular):"
    do i = 1, n
        print '(3F10.4)', L(i, :)
    end do
end program cholesky_decomposition`,

  [AlgorithmType.QR_DECOMPOSITION]: `program qr_decomposition
    implicit none
    integer, parameter :: m = 3, n = 3
    real(8) :: A(m, n), Q(m, n), R(n, n), v(m)
    integer :: i, j, k

    ! Example matrix A (3x3)
    A(1,:) = [12.0, -51.0, 4.0]
    A(2,:) = [6.0, 167.0, -68.0]
    A(3,:) = [-4.0, 24.0, -41.0]

    Q = 0.0; R = 0.0

    ! Gram-Schmidt Process
    do j = 1, n
        v = A(:, j)
        do i = 1, j - 1
            R(i, j) = dot_product(Q(:, i), A(:, j))
            v = v - R(i, j) * Q(:, i)
        end do
        R(j, j) = norm2(v)
        if (abs(R(j, j)) > 1d-12) then
            Q(:, j) = v / R(j, j)
        else
            Q(:, j) = 0.0
        end if
    end do

    print *, "Q Matrix (Orthonormal):"
    do i = 1, m
        print '(3F10.4)', Q(i, :)
    end do
    print *, "R Matrix (Upper Triangular):"
    do i = 1, n
        print '(3F10.4)', R(i, :)
    end do
end program qr_decomposition`,

  [AlgorithmType.JACOBI]: `program jacobi_method
    implicit none
    integer, parameter :: n = 3
    real(8) :: A(n, n), b(n), x(n), x_new(n), diff, tol
    integer :: i, j, k, max_iter

    ! Example: Ax = b
    A(1,:) = [4.0, 1.0, 2.0]
    A(2,:) = [1.0, 5.0, 1.0]
    A(3,:) = [2.0, 1.0, 6.0]
    b = [16.0, 15.0, 25.0]
    x = 0.0; tol = 1e-6; max_iter = 100

    do k = 1, max_iter
        do i = 1, n
            ! Formula: x_i = (b_i - sum(a_ij * x_j_old)) / a_ii
            x_new(i) = (b(i) - (sum(A(i,:)*x) - A(i,i)*x(i))) / A(i,i)
        end do
        
        diff = maxval(abs(x_new - x))
        x = x_new
        
        if (diff < tol) exit
    end do
    print *, "Jacobi solution: ", x
end program`,

  [AlgorithmType.GAUSS_SEIDEL]: `program gauss_seidel_method
    implicit none
    integer, parameter :: n = 3
    real(8) :: A(n, n), b(n), x(n), x_old, max_diff, tol
    integer :: i, j, k, max_iter

    ! Example data
    A(1,:) = [4.0, 1.0, 2.0]
    A(2,:) = [1.0, 5.0, 1.0]
    A(3,:) = [2.0, 1.0, 6.0]
    b = [16.0, 15.0, 25.0]
    x = 0.0; tol = 1e-6; max_iter = 100

    do k = 1, max_iter
        max_diff = 0.0
        do i = 1, n
            x_old = x(i)
            ! Formula uses updated values as soon as available
            x(i) = (b(i) - (sum(A(i,:)*x) - A(i,i)*x(i))) / A(i,i)
            max_diff = max(max_diff, abs(x(i) - x_old))
        end do
        
        if (max_diff < tol) exit
    end do
    print *, "Gauss-Seidel solution: ", x
end program`,

  [AlgorithmType.MATRIX_INVERSE]: `program matrix_inverse
    implicit none
    integer, parameter :: n = 3
    real(8) :: A(n, 2*n), factor
    integer :: i, j, k

    ! Initialize 3x3 matrix A and augment with identity matrix
    A(1, 1:6) = [2.0d0, 1.0d0, 1.0d0, 1.0d0, 0.0d0, 0.0d0]
    A(2, 1:6) = [1.0d0, 2.0d0, 1.0d0, 0.0d0, 1.0d0, 0.0d0]
    A(3, 1:6) = [1.0d0, 1.0d0, 2.0d0, 0.0d0, 0.0d0, 1.0d0]

    ! Gauss-Jordan Elimination
    do i = 1, n
        ! Normalize pivot row
        factor = A(i, i)
        A(i, :) = A(i, :) / factor
        
        ! Eliminate other rows
        do j = 1, n
            if (i /= j) then
                factor = A(j, i)
                A(j, :) = A(j, :) - factor * A(i, :)
            end if
        end do
    end do

    print *, "Inverse Matrix (Right half of augmented):"
    do i = 1, n
        print *, A(i, n+1:2*n)
    end do
end program matrix_inverse`,

  [AlgorithmType.MATRIX_DETERMINANT]: `program determinant
    implicit none
    integer, parameter :: n = 3
    real(8) :: A(n, n), factor, det
    integer :: i, j, k

    A(1, :) = [4.0d0, 1.0d0, 2.0d0]
    A(2, :) = [1.0d0, 5.0d0, 1.0d0]
    A(3, :) = [2.0d0, 1.0d0, 6.0d0]
    
    det = 1.0d0
    
    ! Gaussian Elimination to Upper Triangular Form
    do i = 1, n
        ! Check for zero pivot (simplified, no full pivoting here)
        if (abs(A(i, i)) < 1d-12) then
            det = 0.0d0
            exit
        end if
        
        det = det * A(i, i)
        
        do j = i + 1, n
            factor = A(j, i) / A(i, i)
            A(j, i:n) = A(j, i:n) - factor * A(i, i:n)
        end do
    end do

    print *, "The Determinant is: ", det
end program determinant`,

  [AlgorithmType.MATRIX_ADDITION]: `program matrix_addition
    implicit none
    integer, parameter :: m = 3, n = 3
    real, dimension(m, n) :: A, B, C
    integer :: i, j

    ! Initialize A and B
    A = reshape([1, 2, 3, 4, 5, 6, 7, 8, 9], [m, n])
    B = reshape([9, 8, 7, 6, 5, 4, 3, 2, 1], [m, n])

    ! Fortran supports intrinsic whole-array operations
    C = A + B

    ! Manual loop implementation for demonstration
    do i = 1, m
        do j = 1, n
            C(i, j) = A(i, j) + B(i, j)
        end do
    end do

    print *, "Addition result (element (1,1)): ", C(1, 1)
end program matrix_addition`,

  [AlgorithmType.MATRIX_SUBTRACTION]: `program matrix_subtraction
    implicit none
    integer, parameter :: m = 3, n = 3
    real, dimension(m, n) :: A, B, C
    integer :: i, j

    A = 10.0; B = 5.0

    ! Intrinsic operation
    C = A - B

    ! Manual loop implementation
    do i = 1, m
        do j = 1, n
            C(i, j) = A(i, j) - B(i, j)
        end do
    end do

    print *, "Subtraction result: ", C(1, 1)
end program matrix_subtraction`,

  [AlgorithmType.MATRIX_MULTIPLICATION]: `program matrix_multiplication
    implicit none
    integer, parameter :: m = 3, n = 2, p = 3
    real :: A(m, n), B(n, p), C(m, p)
    integer :: i, j, k

    ! Fortran intrinsic: C = matmul(A, B)
    
    ! Manual implementation
    C = 0.0
    do j = 1, p
        do i = 1, m
            do k = 1, n
                C(i, j) = C(i, j) + A(i, k) * B(k, j)
            end do
        end do
    end do
    print *, "Multiplication Successful."
end program matrix_multiplication`,

  [AlgorithmType.MATRIX_TRANSPOSE]: `program matrix_transpose_op
    implicit none
    integer, parameter :: m = 3, n = 2
    real :: A(m, n), T(n, m)
    integer :: i, j

    ! Fortran intrinsic: T = transpose(A)
    
    ! Manual implementation
    do i = 1, m
        do j = 1, n
            T(j, i) = A(i, j)
        end do
    end do
    print *, "Transpose Successful."
end program matrix_transpose_op`,

  [AlgorithmType.LAGRANGE]: `program lagrange_interpolation
    implicit none
    integer, parameter :: n = 4
    real(8) :: x(n), y(n), xi, result, term
    integer :: i, j

    ! Data points
    x = [0.0d0, 1.0d0, 2.0d0, 3.0d0]
    y = [1.0d0, 2.0d0, 4.0d0, 8.0d0]
    xi = 1.5d0

    result = 0.0d0
    do i = 1, n
        term = y(i)
        do j = 1, n
            if (i /= j) then
                term = term * (xi - x(j)) / (x(i) - x(j))
            end if
        end do
        result = result + term
    end do

    print *, "Interpolated value at ", xi, " is ", result
end program lagrange_interpolation`,

  [AlgorithmType.NEWTON_DIVIDED_DIFFERENCE]: `program newton_dd
    implicit none
    integer, parameter :: n = 4
    real(8) :: x(n), y(n), table(n, n), xi, res, term
    integer :: i, j

    ! Data points
    x = [0.0d0, 1.0d0, 2.0d0, 4.0d0]
    y = [1.0d0, 1.0d0, 2.0d0, 5.0d0]
    xi = 1.5d0

    table = 0.0d0
    table(:, 1) = y

    ! Build Divided Difference Table
    do j = 2, n
        do i = 1, n - j + 1
            table(i, j) = (table(i+1, j-1) - table(i, j-1)) / (x(i+j-1) - x(i))
        end do
    end do

    ! Evaluate Newton Polynomial
    res = table(1, 1)
    term = 1.0d0
    do i = 2, n
        term = term * (xi - x(i-1))
        res = res + table(1, i) * term
    end do

    print *, "Interpolated Result P(1.5): ", res
end program newton_dd`,

  [AlgorithmType.LINEAR_SPLINE]: `program linear_spline_demo
    implicit none
    integer, parameter :: n = 4
    real(8) :: x(n), y(n), xi, result
    integer :: i
    
    ! Data points
    x = [0.0d0, 1.0d0, 2.0d0, 5.0d0]
    y = [1.0d0, 3.0d0, 2.0d0, 4.0d0]
    xi = 1.5d0
    
    result = -999.0d0 ! Error sentinel
    
    ! Search for interval [x(i), x(i+1)] containing xi
    do i = 1, n - 1
        if (xi >= x(i) .and. xi <= x(i+1)) then
            ! Linear interpolation formula
            result = y(i) + (y(i+1) - y(i)) / (x(i+1) - x(i)) * (xi - x(i))
            exit
        end if
    end do
    
    if (result /= -999.0d0) then
        print *, "Interpolated value at ", xi, " is ", result
    else
        print *, "Error: Value outside defined range"
    end if
end program linear_spline_demo`,

  [AlgorithmType.QUADRATIC_SPLINE]: `program quadratic_spline_demo
    implicit none
    integer, parameter :: n = 4
    real(8) :: x(n), y(n), a(n-1), b(n-1), c(n-1), xi, res, h, h_prev
    integer :: i

    ! Data points
    x = [0.0d0, 1.0d0, 2.0d0, 3.0d0]
    y = [0.0d0, 1.0d0, 0.0d0, 1.0d0]
    xi = 1.5d0

    ! Initial segment assumption: linear
    a(1) = 0.0d0
    c(1) = y(1)
    b(1) = (y(2) - y(1)) / (x(2) - x(1))

    ! Recursive calculation for segments 2 to n-1
    do i = 2, n - 1
        h_prev = x(i) - x(i-1)
        h = x(i+1) - x(i)
        
        ! c_i = y_i
        c(i) = y(i)
        
        ! b_i = 2 * a_{i-1} * h_{prev} + b_{i-1}
        b(i) = 2.0d0 * a(i-1) * h_prev + b(i-1)
        
        ! a_i = (y_{i+1} - y_i - b_i * h) / h^2
        a(i) = (y(i+1) - y(i) - b(i) * h) / (h**2)
    end do

    ! Evaluation
    res = -999.0d0
    do i = 1, n - 1
        if (xi >= x(i) .and. xi <= x(i+1)) then
            res = a(i)*(xi - x(i))**2 + b(i)*(xi - x(i)) + c(i)
            exit
        end if
    end do

    print *, "Interpolated result at ", xi, ": ", res
end program`,

  [AlgorithmType.CUBIC_SPLINE]: `program cubic_spline
    implicit none
    integer, parameter :: n = 4
    real(8) :: x(n), y(n), h(n-1), b(n), d(n), a(n), c(n), xi, result
    integer :: i
    
    ! Data points
    x = [0.0d0, 1.0d0, 2.0d0, 3.0d0]
    y = [1.0d0, 2.0d0, 0.0d0, 1.0d0]
    xi = 1.5d0
    
    ! Natural boundary conditions require solving a tridiagonal system for moments
    print *, "Solving Tridiagonal System for Spline Moments..."
    ! (Simplification: In full code, implement Thomas Algorithm here)
end program`,

  [AlgorithmType.NEWTON_FORWARD_DIFFERENCE]: `program newton_forward_demo
    implicit none
    integer, parameter :: n = 4
    real(8) :: x(n), y(n), diff(n, n), xi, res, u, u_term, fact
    integer :: i, j

    ! Evenly spaced points
    x = [10.0d0, 20.0d0, 30.0d0, 40.0d0]
    y = [1.1d0, 2.1d0, 3.5d0, 5.2d0]
    xi = 15.0d0

    ! Initialize difference table
    diff = 0.0d0
    diff(:, 1) = y

    ! Construct Forward Difference Table
    do j = 2, n
        do i = 1, n - j + 1
            diff(i, j) = diff(i+1, j-1) - diff(i, j-1)
        end do
    end do

    ! Formula parameters
    u = (xi - x(1)) / (x(2) - x(1))
    res = diff(1, 1)
    u_term = 1.0d0
    fact = 1.0d0

    do i = 2, n
        u_term = u_term * (u - (i - 2))
        fact = fact * (i - 1)
        res = res + (u_term * diff(1, i)) / fact
    end do

    print *, "Interpolated Result at ", xi, ": ", res
end program newton_forward_demo`,

  [AlgorithmType.NEWTON_BACKWARD_DIFFERENCE]: `program newton_backward_demo
    implicit none
    integer, parameter :: n = 4
    real(8) :: x(n), y(n), diff(n, n), xi, res, u, u_term, fact
    integer :: i, j

    ! Evenly spaced points
    x = [10.0d0, 20.0d0, 30.0d0, 40.0d0]
    y = [1.1d0, 2.1d0, 3.5d0, 5.2d0]
    xi = 35.0d0

    ! Initialize table
    diff = 0.0d0
    diff(:, 1) = y

    ! Backward Difference Table
    do j = 2, n
        do i = n, j, -1
            diff(i, j) = diff(i, j-1) - diff(i-1, j-1)
        end do
    end do

    u = (xi - x(n)) / (x(2) - x(1))
    res = diff(n, 1)
    u_term = 1.0d0
    fact = 1.0d0

    do i = 2, n
        u_term = u_term * (u + (i - 2))
        fact = fact * (i - 1)
        res = res + (u_term * diff(n, i)) / fact
    end do

    print *, "Interpolated Result at ", xi, ": ", res
end program newton_backward_demo`,

  [AlgorithmType.GAUSS_FORWARD_INTERPOLATION]: `program gauss_forward
    print *, "Zig-zag table traversal: y0 -> dy0 -> d2y-1 -> d3y-1"
end program`,

  [AlgorithmType.GAUSS_BACKWARD_INTERPOLATION]: `program gauss_backward
    print *, "Zig-zag table traversal: y0 -> dy-1 -> d2y-1 -> d3y-2"
end program`,

  [AlgorithmType.SIMPSON]: `program simpson_demo
    implicit none
    real(8) :: a, b, result
    integer :: n
    
    a = 0.0d0
    b = 3.141592653589793d0
    n = 100 ! Must be even
    
    result = simpson(a, b, n)
    print *, "Integral of sin(x) from 0 to pi: ", result

contains
    real(8) function f(x)
        real(8), intent(in) :: x
        f = sin(x)
    end function f

    real(8) function simpson(a, b, n)
        real(8), intent(in) :: a, b
        integer, intent(in) :: n
        real(8) :: h, s
        integer :: i
        
        h = (b - a) / n
        s = f(a) + f(b)
        
        do i = 1, n - 1
            if (mod(i, 2) == 0) then
                s = s + 2.0d0 * f(a + i * h)
            else
                s = s + 4.0d0 * f(a + i * h)
            end if
        end do
        
        simpson = (h / 3.0d0) * s
    end function simpson
end program simpson_demo`,

  [AlgorithmType.TRAPEZOIDAL]: `program trapezoidal_demo
    implicit none
    real(8) :: a, b, result
    integer :: n
    
    a = 0.0d0
    b = 1.0d0
    n = 100
    
    result = trapezoid(a, b, n)
    print *, "Integral of x^2 from 0 to 1: ", result

contains
    real(8) function f(x)
        real(8), intent(in) :: x
        f = x**2
    end function f

    real(8) function trapezoid(a, b, n)
        real(8), intent(in) :: a, b
        integer, intent(in) :: n
        real(8) :: h, s
        integer :: i
        
        h = (b - a) / n
        s = 0.5d0 * (f(a) + f(b))
        
        do i = 1, n - 1
            s = s + f(a + i * h)
        end do
        
        trapezoid = h * s
    end function trapezoid
end program trapezoidal_demo`,

  [AlgorithmType.FORWARD_DIFFERENCE]: `program forward_diff_demo
    implicit none
    real(8) :: x, h, df
    
    x = 2.0d0
    h = 1.0d-5
    
    ! Forward Difference Formula: [f(x+h) - f(x)] / h
    df = (f(x + h) - f(x)) / h
    
    print *, "Point x: ", x
    print *, "Step h:  ", h
    print *, "f'(x) approx: ", df

contains
    real(8) function f(v)
        real(8), intent(in) :: v
        ! Example: f(x) = x^2
        f = v**2
    end function f
end program forward_diff_demo`,

  [AlgorithmType.BACKWARD_DIFFERENCE]: `program backward_diff_demo
    implicit none
    real(8) :: x, h, df
    
    x = 2.0d0
    h = 1.0d-5
    
    ! Backward Difference Formula: [f(x) - f(x-h)] / h
    df = (f(x) - f(x - h)) / h
    
    print *, "Point x: ", x
    print *, "Step h:  ", h
    print *, "f'(x) approx (Backward): ", df

contains
    real(8) function f(v)
        real(8), intent(in) :: v
        f = v**2
    end function f
end program backward_diff_demo`,

  [AlgorithmType.CENTRAL_DIFFERENCE]: `program central_diff_demo
    implicit none
    real(8) :: x, h, df
    
    x = 1.0d0
    h = 1.0d-5
    
    ! Central Difference Formula: [f(x+h) - f(x-h)] / (2*h)
    df = (f(x + h) - f(x - h)) / (2.0d0 * h)
    
    print *, "Point x: ", x
    print *, "f'(x) approx (Central): ", df

contains
    real(8) function f(v)
        real(8), intent(in) :: v
        f = exp(v)
    end function f
end program central_diff_demo`,

  [AlgorithmType.SECOND_DERIVATIVE_CENTRAL]: `program second_diff_demo
    implicit none
    real(8) :: x, h, d2f
    
    x = 2.0d0
    h = 0.001d0
    
    ! Second Derivative Central Formula: [f(x+h) - 2f(x) + f(x-h)] / h^2
    d2f = (f(x + h) - 2.0d0 * f(x) + f(x - h)) / (h**2)
    
    print *, "Point x: ", x
    print *, "Step h:  ", h
    print *, "f''(x) approx: ", d2f

contains
    real(8) function f(v)
        real(8), intent(in) :: v
        ! Example: f(x) = x^3
        f = v**3
    end function f
end program second_diff_demo`,

  [AlgorithmType.EULER]: `program euler_demo
    implicit none
    real(8) :: x0, y0, h, x, y
    integer :: i, n
    
    ! Initial values and parameters
    x0 = 0.0d0; y0 = 1.0d0; h = 0.1d0; n = 10
    x = x0; y = y0
    
    print *, "Euler's Method Results (dy/dx = x + y):"
    do i = 0, n
        print '(A, F5.2, A, F8.4)', "x: ", x, " y: ", y
        ! Update rule: y_{n+1} = y_n + h * f(x_n, y_n)
        y = y + h * f(x, y)
        x = x + h
    end do

contains
    real(8) function f(x, y)
        real(8), intent(in) :: x, y
        f = x + y
    end function f
end program euler_demo`,

  [AlgorithmType.RK4]: `program rk4_demo
    implicit none
    real(8) :: x, y, h, k1, k2, k3, k4
    integer :: i, n
    
    ! Initial values and parameters
    x = 0.0d0; y = 1.0d0; h = 0.1d0; n = 10
    
    print *, "RK4 Method Results (dy/dx = x + y):"
    do i = 0, n
        print '(A, F5.2, A, F8.4)', "x: ", x, " y: ", y
        
        ! RK4 intermediate slopes
        k1 = h * f(x, y)
        k2 = h * f(x + h/2.0d0, y + k1/2.0d0)
        k3 = h * f(x + h/2.0d0, y + k2/2.0d0)
        k4 = h * f(x + h, y + k3)
        
        ! Final update with weighted average
        y = y + (k1 + 2.0d0*k2 + 2.0d0*k3 + k4) / 6.0d0
        x = x + h
    end do

contains
    real(8) function f(x, y)
        real(8), intent(in) :: x, y
        f = x + y
    end function f
end program rk4_demo`,
};

export const CPP_SNIPPETS: Record<AlgorithmType, string> = {
  [AlgorithmType.BISECTION]: `#include <iostream>
#include <cmath>

double bisection(double (*f)(double), double a, double b, double tol = 1e-6) {
    if (f(a) * f(b) >= 0) return 0; // Error
    double c;
    while ((b - a) / 2.0 > tol) {
        c = (a + b) / 2.0;
        if (std::abs(f(c)) < 1e-12) break;
        if (f(a) * f(c) < 0) b = c;
        else a = c;
    }
    return c;
}

int main() {
    auto f = [](double x) { return std::pow(x, 3) - x - 2; };
    std::cout << "Root: " << bisection(f, 1, 2) << std::endl;
    return 0;
}`,
  [AlgorithmType.NEWTON_RAPHSON]: `#include <iostream>
#include <cmath>

double newton(double (*f)(double), double (*df)(double), double x0, double tol = 1e-6) {
    double x = x0;
    for(int i = 0; i < 100; ++i) {
        double fx = f(x), dfx = df(x);
        if(std::abs(dfx) < 1e-12) break;
        double x_new = x - fx / dfx;
        if(std::abs(x_new - x) < tol) return x_new;
        x = x_new;
    }
    return x;
}`,
  [AlgorithmType.INCREMENTAL_SEARCH]: `#include <iostream>
#include <vector>
#include <cmath>
#include <functional>

/**
 * Incremental Search for root location.
 * Finds intervals [x1, x2] where a sign change occurs.
 */
std::vector<std::pair<double, double>> incremental_search(
    std::function<double(double)> f, 
    double a, 
    double b, 
    double step = 0.1) 
{
    std::vector<std::pair<double, double>> brackets;
    double x1 = a;
    double f1 = f(x1);
    
    while (x1 < b) {
        double x2 = std::min(x1 + step, b);
        double f2 = f(x2);
        
        // Intermediate Value Theorem: If f(x1)*f(x2) <= 0, 
        // there is at least one root in [x1, x2]
        if (f1 * f2 <= 0) {
            brackets.push_back({x1, x2});
        }
        
        x1 = x2;
        f1 = f2;
    }
    
    return brackets;
}

int main() {
    // Transcendental function: e^x - 3x
    auto f = [](double x) { return std::exp(x) - 3.0 * x; };
    
    auto results = incremental_search(f, 0.0, 5.0, 0.2);
    
    std::cout << "Found " << results.size() << " brackets:" << std::endl;
    for (const auto& b : results) {
        std::cout << "[" << b.first << ", " << b.second << "]" << std::endl;
    }
    
    return 0;
}`,
  [AlgorithmType.FALSE_POSITION]: `#include <iostream>
#include <cmath>
#include <iomanip>
#include <functional>

/**
 * False Position Method (Regula Falsi) implementation.
 * Finds roots of f(x) = 0 within a bracket [a, b].
 */
double false_position(std::function<double(double)> f, double a, double b, double tol = 1e-6) {
    if (f(a) * f(b) >= 0) {
        std::cerr << "Error: Function must change sign in the interval." << std::endl;
        return NAN;
    }

    double c;
    for (int i = 0; i < 100; ++i) {
        // Linear interpolation formula
        c = (a * f(b) - b * f(a)) / (f(b) - f(a));
        
        if (std::abs(f(c)) < tol) return c;
        
        if (f(c) * f(a) < 0) b = c;
        else a = c;
    }
    return c;
}

int main() {
    auto f = [](double x) { return std::pow(x, 3) - x - 2; };
    double root = false_position(f, 1.0, 2.0);
    
    std::cout << std::fixed << std::setprecision(6);
    std::cout << "Root: " << root << std::endl;
    
    return 0;
}`,
  [AlgorithmType.SECANT]: `#include <iostream>
#include <cmath>
#include <functional>
#include <iomanip>

/**
 * Secant Method for root finding.
 * Approximates the derivative using a secant line through two points.
 */
double secant_method(std::function<double(double)> f, double x0, double x1, double tol = 1e-6, int max_iter = 100) {
    double x2;
    for (int i = 0; i < max_iter; ++i) {
        double fx0 = f(x0);
        double fx1 = f(x1);
        
        if (std::abs(fx1 - fx0) < 1e-15) {
            std::cerr << "Error: Secant slope is zero (vertical line)." << std::endl;
            return NAN;
        }
        
        // Secant Formula: x_{i+1} = x_i - f(x_i) * (x_i - x_{i-1}) / (f(x_i) - f(x_{i-1}))
        x2 = x1 - fx1 * (x1 - x0) / (fx1 - fx0);
        
        if (std::abs(x2 - x1) < tol) return x2;
        
        x0 = x1;
        x1 = x2;
    }
    return x2;
}

int main() {
    auto f = [](double x) { return std::pow(x, 3) - x - 2; };
    double root = secant_method(f, 1.0, 2.0);
    
    std::cout << std::fixed << std::setprecision(6);
    if (!std::isnan(root)) {
        std::cout << "Root found: " << root << std::endl;
    }
    
    return 0;
}`,
  [AlgorithmType.FIXED_POINT_ITERATION]: `#include <iostream>
#include <cmath>
#include <iomanip>
#include <functional>

/**
 * Fixed Point Iteration method for solving x = g(x).
 * Converges if |g'(x)| < 1 in the neighborhood of the root.
 */
double fixed_point_iteration(std::function<double(double)> g, double x0, double tol = 1e-6, int max_iter = 100) {
    double x = x0;
    for (int i = 0; i < max_iter; ++i) {
        double x_next = g(x);
        
        // Stop if the difference is within tolerance
        if (std::abs(x_next - x) < tol) {
            return x_next;
        }
        
        x = x_next;
    }
    std::cout << "Warning: Maximum iterations reached without full convergence." << std::endl;
    return x;
}

int main() {
    // Example: Solving x^2 - x - 1 = 0 => x = sqrt(x + 1)
    // The fixed point of this g(x) is the Golden Ratio.
    auto g = [](double x) { return std::sqrt(x + 1.0); };
    
    double root = fixed_point_iteration(g, 1.0);
    
    std::cout << std::fixed << std::setprecision(6);
    std::cout << "Fixed Point Root: " << root << std::endl;
    
    return 0;
}`,
  [AlgorithmType.MULLER]: `#include <iostream>
#include <complex>
#include <cmath>
#include <iomanip>
#include <functional>

/**
 * Muller's Method for root finding.
 * Uses a quadratic parabola through three points.
 * Capable of finding complex roots even for real coefficients.
 */
std::complex<double> muller_method(
    std::function<std::complex<double>(std::complex<double>)> f,
    std::complex<double> x0, 
    std::complex<double> x1, 
    std::complex<double> x2,
    double tol = 1e-6, 
    int max_iter = 100) 
{
    for (int i = 0; i < max_iter; ++i) {
        std::complex<double> h1 = x1 - x0;
        std::complex<double> h2 = x2 - x1;
        std::complex<double> d1 = (f(x1) - f(x0)) / h1;
        std::complex<double> d2 = (f(x2) - f(x1)) / h2;
        
        std::complex<double> a = (d2 - d1) / (h2 + h1);
        std::complex<double> b = a * h2 + d2;
        std::complex<double> c = f(x2);
        
        // Quadratic discriminant
        std::complex<double> disc = std::sqrt(b * b - 4.0 * a * c);
        
        // Choose denominator with larger magnitude for stability
        std::complex<double> den1 = b + disc;
        std::complex<double> den2 = b - disc;
        std::complex<double> den = (std::abs(den1) > std::abs(den2)) ? den1 : den2;
        
        std::complex<double> dx = -2.0 * c / den;
        std::complex<double> x3 = x2 + dx;
        
        if (std::abs(dx) < tol) return x3;
        
        x0 = x1; x1 = x2; x2 = x3;
    }
    return x2;
}

int main() {
    // Example: Find roots of x^3 + 1 = 0
    auto f = [](std::complex<double> x) { return std::pow(x, 3) + 1.0; };
    
    std::complex<double> root = muller_method(f, -1.5, -0.5, 0.5);
    
    std::cout << std::fixed << std::setprecision(6);
    std::cout << "Muller Root: " << root.real() << " + " << root.imag() << "i" << std::endl;
    
    return 0;
}`,
  [AlgorithmType.GAUSSIAN]: `#include <iostream>
#include <vector>
#include <cmath>
#include <iomanip>

/**
 * Gaussian Elimination with Partial Pivoting.
 * Solves the linear system Ax = b.
 */
std::vector<double> gaussianElimination(std::vector<std::vector<double>> A, std::vector<double> b) {
    int n = b.size();

    for (int i = 0; i < n; i++) {
        // Partial Pivoting for numerical stability
        int max_row = i;
        for (int k = i + 1; k < n; k++) {
            if (std::abs(A[k][i]) > std::abs(A[max_row][i])) max_row = k;
        }
        std::swap(A[i], A[max_row]);
        std::swap(b[i], b[max_row]);

        if (std::abs(A[i][i]) < 1e-15) {
            std::cerr << "Error: Matrix is singular or near-singular." << std::endl;
            return {};
        }

        // Elimination
        for (int k = i + 1; k < n; k++) {
            double factor = A[k][i] / A[i][i];
            b[k] -= factor * b[i];
            for (int j = i; j < n; j++) {
                A[k][j] -= factor * A[i][j];
            }
        }
    }

    // Back Substitution
    std::vector<double> x(n);
    for (int i = n - 1; i >= 0; i--) {
        double sum = 0;
        for (int j = i + 1; j < n; j++) {
            sum += A[i][j] * x[j];
        }
        x[i] = (b[i] - sum) / A[i][i];
    }
    return x;
}

int main() {
    std::vector<std::vector<double>> A = {{3, 2, -4}, {2, 3, 3}, {5, -3, 1}};
    std::vector<double> b = {3, 15, 14};
    
    std::vector<double> x = gaussianElimination(A, b);

    if (!x.empty()) {
        std::cout << "Solution: ";
        for (double val : x) std::cout << val << " ";
        std::cout << std::endl;
    }
    return 0;
}`,
  [AlgorithmType.GAUSS_JORDAN]: `#include <iostream>
#include <vector>
#include <cmath>
#include <iomanip>

/**
 * Gauss-Jordan Elimination with Partial Pivoting.
 * Reduces matrix A to Reduced Row Echelon Form (RREF).
 */
std::vector<double> gaussJordan(std::vector<std::vector<double>> A, std::vector<double> b) {
    int n = b.size();

    for (int i = 0; i < n; i++) {
        // Partial Pivoting
        int max_row = i;
        for (int k = i + 1; k < n; k++) {
            if (std::abs(A[k][i]) > std::abs(A[max_row][i])) max_row = k;
        }
        std::swap(A[i], A[max_row]);
        std::swap(b[i], b[max_row]);

        double pivot = A[i][i];
        if (std::abs(pivot) < 1e-15) {
            std::cerr << "Error: Matrix is singular." << std::endl;
            return {};
        }

        // Normalize the pivot row
        for (int j = i; j < n; j++) A[i][j] /= pivot;
        b[i] /= pivot;

        // Eliminate all other rows
        for (int k = 0; k < n; k++) {
            if (k != i) {
                double factor = A[k][i];
                for (int j = i; j < n; j++) {
                    A[k][j] -= factor * A[i][j];
                }
                b[k] -= factor * b[i];
            }
        }
    }
    return b;
}

int main() {
    std::vector<std::vector<double>> A = {{2, 1, -1}, {-3, -1, 2}, {-2, 1, 2}};
    std::vector<double> b = {8, -11, -3};
    
    std::vector<double> x = gaussJordan(A, b);

    if (!x.empty()) {
        std::cout << "Solution: ";
        for (double val : x) std::cout << val << " ";
        std::cout << std::endl;
    }
    return 0;
}`,
  [AlgorithmType.JACOBI]: `#include <iostream>
#include <vector>
#include <cmath>
#include <iomanip>

/**
 * Jacobi Iteration method for solving Ax = b.
 */
std::vector<double> jacobiIteration(const std::vector<std::vector<double>>& A, 
                                    const std::vector<double>& b, 
                                    double tol = 1e-6, 
                                    int max_iter = 100) {
    int n = b.size();
    std::vector<double> x(n, 0.0);
    std::vector<double> x_new(n, 0.0);

    for (int k = 0; k < max_iter; k++) {
        for (int i = 0; i < n; i++) {
            double sum = 0;
            for (int j = 0; j < n; j++) {
                if (i != j) sum += A[i][j] * x[j];
            }
            if (std::abs(A[i][i]) < 1e-15) return {}; // Zero diagonal
            x_new[i] = (b[i] - sum) / A[i][i];
        }

        double max_diff = 0;
        for (int i = 0; i < n; i++) {
            max_diff = std::max(max_diff, std::abs(x_new[i] - x[i]));
        }
        
        x = x_new;
        if (max_diff < tol) break;
    }
    return x;
}

int main() {
    std::vector<std::vector<double>> A = {{4, 1, 2}, {1, 5, 1}, {2, 1, 6}};
    std::vector<double> b = {16, 15, 25};
    
    std::vector<double> x = jacobiIteration(A, b);
    
    std::cout << "Jacobi Solution: ";
    for (double v : x) std::cout << v << " ";
    std::cout << std::endl;
    return 0;
}`,
  [AlgorithmType.GAUSS_SEIDEL]: `#include <iostream>
#include <vector>
#include <cmath>
#include <iomanip>

/**
 * Gauss-Seidel Iteration method for solving Ax = b.
 * Converges faster than Jacobi for most systems.
 */
std::vector<double> gaussSeidelIteration(const std::vector<std::vector<double>>& A, 
                                         const std::vector<double>& b, 
                                         double tol = 1e-6, 
                                         int max_iter = 100) {
    int n = b.size();
    std::vector<double> x(n, 0.0);

    for (int k = 0; k < max_iter; k++) {
        double max_diff = 0;
        for (int i = 0; i < n; i++) {
            double sum = 0;
            for (int j = 0; j < n; j++) {
                if (i != j) sum += A[i][j] * x[j];
            }
            
            double x_old = x[i];
            x[i] = (b[i] - sum) / A[i][i];
            max_diff = std::max(max_diff, std::abs(x[i] - x_old));
        }
        
        if (max_diff < tol) break;
    }
    return x;
}

int main() {
    std::vector<std::vector<double>> A = {{4, 1, 2}, {1, 5, 1}, {2, 1, 6}};
    std::vector<double> b = {16, 15, 25};
    
    std::vector<double> x = gaussSeidelIteration(A, b);
    
    std::cout << "Gauss-Seidel Solution: ";
    for (double v : x) std::cout << v << " ";
    std::cout << std::endl;
    return 0;
}`,
  [AlgorithmType.LU_DECOMPOSITION]: `#include <iostream>
#include <vector>
#include <iomanip>

/**
 * LU Decomposition using Doolittle's Algorithm.
 * A = L * U
 */
void luDecomposition(const std::vector<std::vector<double>>& A, 
                     std::vector<std::vector<double>>& L, 
                     std::vector<std::vector<double>>& U) {
    int n = A.size();
    for (int i = 0; i < n; i++) {
        // Upper Triangular matrix U
        for (int k = i; k < n; k++) {
            double sum = 0;
            for (int j = 0; j < i; j++)
                sum += (L[i][j] * U[j][k]);
            U[i][k] = A[i][k] - sum;
        }

        // Lower Triangular matrix L
        for (int k = i; k < n; k++) {
            if (i == k)
                L[i][i] = 1; // Diagonal as 1
            else {
                double sum = 0;
                for (int j = 0; j < i; j++)
                    sum += (L[k][j] * U[j][i]);
                L[k][i] = (A[k][i] - sum) / U[i][i];
            }
        }
    }
}

int main() {
    std::vector<std::vector<double>> A = {{4, 1, 1}, {1, 5, 2}, {1, 2, 4}};
    int n = A.size();
    std::vector<std::vector<double>> L(n, std::vector<double>(n, 0));
    std::vector<std::vector<double>> U(n, std::vector<double>(n, 0));

    luDecomposition(A, L, U);

    std::cout << std::fixed << std::setprecision(2);
    std::cout << "L Matrix:" << std::endl;
    for(auto& row : L) { 
        for(double val : row) std::cout << val << " "; 
        std::cout << std::endl; 
    }
    return 0;
}`,
  [AlgorithmType.CHOLESKY_DECOMPOSITION]: `#include <iostream>
#include <vector>
#include <cmath>
#include <iomanip>

/**
 * Cholesky Decomposition
 * Factors a symmetric positive-definite matrix A into L * L^T
 */
bool choleskyDecomposition(const std::vector<std::vector<double>>& A, 
                           std::vector<std::vector<double>>& L) {
    int n = A.size();
    for (int i = 0; i < n; i++) {
        for (int j = 0; j <= i; j++) {
            double sum = 0;
            for (int k = 0; k < j; k++)
                sum += L[i][k] * L[j][k];

            if (i == j) {
                double val = A[i][i] - sum;
                if (val <= 0) return false; // Not positive definite
                L[i][j] = std::sqrt(val);
            } else {
                L[i][j] = (1.0 / L[j][j] * (A[i][j] - sum));
            }
        }
    }
    return true;
}

int main() {
    // Symmetric positive-definite matrix
    std::vector<std::vector<double>> A = {{4, 12, -16}, {12, 37, -43}, {-16, -43, 98}};
    int n = A.size();
    std::vector<std::vector<double>> L(n, std::vector<double>(n, 0));

    if (choleskyDecomposition(A, L)) {
        std::cout << "L Matrix (Lower Triangular):" << std::endl;
        for(auto& row : L) {
            for(double val : row) std::cout << std::setw(8) << val << " ";
            std::cout << std::endl;
        }
    } else {
        std::cout << "Matrix is not positive definite." << std::endl;
    }
    return 0;
}`,
  [AlgorithmType.QR_DECOMPOSITION]: `#include <iostream>
#include <vector>
#include <cmath>
#include <iomanip>

/**
 * QR Decomposition using Gram-Schmidt Process.
 * A = Q * R
 */
void qrDecomposition(const std::vector<std::vector<double>>& A, 
                     std::vector<std::vector<double>>& Q, 
                     std::vector<std::vector<double>>& R) {
    int m = A.size();
    int n = A[0].size();

    for (int j = 0; j < n; j++) {
        std::vector<double> v(m);
        for (int i = 0; i < m; i++) v[i] = A[i][j];

        for (int i = 0; i < j; i++) {
            double dot = 0;
            for (int k = 0; k < m; k++) dot += Q[k][i] * A[k][j];
            R[i][j] = dot;
            for (int k = 0; k < m; k++) v[k] -= R[i][j] * Q[k][i];
        }

        double norm = 0;
        for (int k = 0; k < m; k++) norm += v[k] * v[k];
        norm = std::sqrt(norm);
        R[j][j] = norm;

        for (int k = 0; k < m; k++) {
            if (norm > 1e-12) Q[k][j] = v[k] / norm;
            else Q[k][j] = 0;
        }
    }
}

int main() {
    std::vector<std::vector<double>> A = {{12, -51, 4}, {6, 167, -68}, {-4, 24, -41}};
    int m = A.size();
    int n = A[0].size();
    std::vector<std::vector<double>> Q(m, std::vector<double>(n, 0));
    std::vector<std::vector<double>> R(n, std::vector<double>(n, 0));

    qrDecomposition(A, Q, R);

    std::cout << std::fixed << std::setprecision(2);
    std::cout << "Q Matrix:" << std::endl;
    for(auto& row : Q) { 
        for(double val : row) std::cout << std::setw(8) << val << " "; 
        std::cout << std::endl; 
    }
    return 0;
}`,
  [AlgorithmType.MATRIX_INVERSE]: `#include <iostream>
#include <vector>
#include <cmath>

/**
 * Matrix Inverse using Gauss-Jordan Elimination with partial pivoting.
 */
std::vector<std::vector<double>> invertMatrix(std::vector<std::vector<double>> A) {
    int n = A.size();
    std::vector<std::vector<double>> res(n, std::vector<double>(n, 0.0));
    for (int i = 0; i < n; i++) res[i][i] = 1.0; // Identity matrix

    for (int i = 0; i < n; i++) {
        // Pivoting
        int max = i;
        for (int k = i + 1; k < n; k++)
            if (std::abs(A[k][i]) > std::abs(A[max][i])) max = k;
        std::swap(A[i], A[max]);
        std::swap(res[i], res[max]);

        double div = A[i][i];
        if (std::abs(div) < 1e-15) return {}; // Singular matrix

        for (int j = 0; j < n; j++) {
            A[i][j] /= div;
            res[i][j] /= div;
        }

        for (int k = 0; k < n; k++) {
            if (k != i) {
                double factor = A[k][i];
                for (int j = n-1; j >= 0; j--) {
                    A[k][j] -= factor * A[i][j];
                    res[k][j] -= factor * res[i][j];
                }
            }
        }
    }
    return res;
}

int main() {
    std::vector<std::vector<double>> A = {{2, 1}, {1, 2}};
    auto inv = invertMatrix(A);
    std::cout << "Inverse matrix calculated." << std::endl;
    return 0;
}`,
  [AlgorithmType.MATRIX_DETERMINANT]: `#include <iostream>
#include <vector>
#include <cmath>

/**
 * Matrix Determinant using Gaussian Elimination.
 */
double determinant(std::vector<std::vector<double>> A) {
    int n = A.size();
    double det = 1.0;

    for (int i = 0; i < n; i++) {
        int max = i;
        for (int k = i + 1; k < n; k++)
            if (std::abs(A[k][i]) > std::abs(A[max][i])) max = k;

        if (max != i) {
            std::swap(A[i], A[max]);
            det *= -1.0;
        }

        if (std::abs(A[i][i]) < 1e-15) return 0.0;

        det *= A[i][i];

        for (int k = i + 1; k < n; k++) {
            double factor = A[k][i] / A[i][i];
            for (int j = i + 1; j < n; j++) {
                A[k][j] -= factor * A[i][j];
            }
        }
    }
    return det;
}

int main() {
    std::vector<std::vector<double>> A = {{4, 3, 2, 1}, {3, 2, 1, 0}, {2, 1, 0, 1}, {1, 0, 1, 2}};
    std::cout << "Determinant: " << determinant(A) << std::endl;
    return 0;
}`,
  [AlgorithmType.MATRIX_TRANSPOSE]: `#include <iostream>
#include <vector>

/**
 * Matrix Transpose
 * Swaps rows and columns of matrix A.
 */
std::vector<std::vector<double>> matrixTranspose(const std::vector<std::vector<double>>& A) {
    if (A.empty()) return {};
    int rows = A.size();
    int cols = A[0].size();
    std::vector<std::vector<double>> T(cols, std::vector<double>(rows));
    for (int i = 0; i < rows; ++i) {
        for (int j = 0; j < cols; ++j) {
            T[j][i] = A[i][j];
        }
    }
    return T;
}

int main() {
    std::vector<std::vector<double>> A = {{1, 2, 3}, {4, 5, 6}};
    auto T = matrixTranspose(A);
    std::cout << "Transpose of A:" << std::endl;
    for (const auto& row : T) {
        for (double val : row) std::cout << val << " ";
        std::cout << std::endl;
    }
    return 0;
}`,
  [AlgorithmType.MATRIX_ADDITION]: `#include <iostream>
#include <vector>
#include <stdexcept>

typedef std::vector<std::vector<double>> Matrix;

/**
 * Matrix Addition
 * Performs C = A + B element-wise.
 */
Matrix matrixAdd(const Matrix& A, const Matrix& B) {
    int rows = A.size();
    if (rows == 0) return {};
    int cols = A[0].size();

    if (rows != (int)B.size() || cols != (int)B[0].size()) {
        throw std::invalid_argument("Matrix dimensions must match for addition.");
    }
    
    Matrix C(rows, std::vector<double>(cols));
    for (int i = 0; i < rows; ++i) {
        for (int j = 0; j < cols; ++j) {
            C[i][j] = A[i][j] + B[i][j];
        }
    }
    return C;
}

int main() {
    Matrix A = {{1, 2}, {3, 4}};
    Matrix B = {{5, 6}, {7, 8}};
    
    try {
        Matrix C = matrixAdd(A, B);
        std::cout << "Result of A + B:" << std::endl;
        for(const auto& row : C) {
            for(double val : row) std::cout << val << " ";
            std::cout << std::endl;
        }
    } catch (const std::exception& e) {
        std::cerr << e.what() << std::endl;
    }
    return 0;
}`,
  [AlgorithmType.MATRIX_SUBTRACTION]: `#include <iostream>
#include <vector>
#include <stdexcept>

typedef std::vector<std::vector<double>> Matrix;

/**
 * Matrix Subtraction
 * Performs C = A - B element-wise.
 */
Matrix matrixSub(const Matrix& A, const Matrix& B) {
    int rows = A.size();
    if (rows == 0) return {};
    int cols = A[0].size();

    if (rows != (int)B.size() || cols != (int)B[0].size()) {
        throw std::invalid_argument("Matrix dimensions must match for subtraction.");
    }
    
    Matrix C(rows, std::vector<double>(cols));
    for (int i = 0; i < rows; ++i) {
        for (int j = 0; j < cols; ++j) {
            C[i][j] = A[i][j] - B[i][j];
        }
    }
    return C;
}

int main() {
    Matrix A = {{10, 20}, {30, 40}};
    Matrix B = {{5, 5}, {5, 5}};
    
    try {
        Matrix C = matrixSub(A, B);
        std::cout << "Result of A - B:" << std::endl;
        for(const auto& row : C) {
            for(double val : row) std::cout << val << " ";
            std::cout << std::endl;
        }
    } catch (const std::exception& e) {
        std::cerr << e.what() << std::endl;
    }
    return 0;
}`,
  [AlgorithmType.MATRIX_MULTIPLICATION]: `#include <iostream>
#include <vector>
#include <stdexcept>

/**
 * Matrix Multiplication
 * Multiplies Matrix A (m x n) and Matrix B (n x p).
 */
std::vector<std::vector<double>> matrixMultiply(const std::vector<std::vector<double>>& A, 
                                               const std::vector<std::vector<double>>& B) {
    if (A.empty() || B.empty()) return {};
    int m = A.size();
    int n = A[0].size();
    int nb = B.size();
    int p = B[0].size();

    if (n != nb) {
        throw std::invalid_argument("Matrix dimensions mismatch for multiplication.");
    }

    std::vector<std::vector<double>> C(m, std::vector<double>(p, 0.0));
    for (int i = 0; i < m; ++i) {
        for (int j = 0; j < p; ++j) {
            for (int k = 0; k < n; ++k) {
                C[i][j] += A[i][k] * B[k][j];
            }
        }
    }
    return C;
}

int main() {
    std::vector<std::vector<double>> A = {{1, 2}, {3, 4}, {5, 6}};
    std::vector<std::vector<double>> B = {{1, 0, 1}, {0, 1, 0}};
    try {
        auto C = matrixMultiply(A, B);
        std::cout << "Multiplication Result:" << std::endl;
        for (const auto& row : C) {
            for (double val : row) std::cout << val << " ";
            std::cout << std::endl;
        }
    } catch (const std::exception& e) {
        std::cerr << e.what() << std::endl;
    }
    return 0;
}`,
  [AlgorithmType.LAGRANGE]: `#include <iostream>
#include <vector>

/**
 * Lagrange Interpolation
 * Computes the interpolated value at target xi based on a set of data points.
 */
double lagrangeInterpolation(const std::vector<double>& x, const std::vector<double>& y, double xi) {
    int n = x.size();
    double result = 0.0;
    
    for (int i = 0; i < n; ++i) {
        double term = y[i];
        for (int j = 0; j < n; ++j) {
            if (i != j) {
                // Basis polynomial L_i(x) = product((x - x_j) / (x_i - x_j))
                term *= (xi - x[j]) / (x[i] - x[j]);
            }
        }
        result += term;
    }
    
    return result;
}

int main() {
    std::vector<double> x_nodes = {0, 1, 2, 3};
    std::vector<double> y_values = {1, 2, 4, 8};
    double xi = 1.5;

    double result = lagrangeInterpolation(x_nodes, y_values, xi);
    std::cout << "Interpolated value at " << xi << " is " << result << std::endl;

    return 0;
}`,
  [AlgorithmType.NEWTON_DIVIDED_DIFFERENCE]: `#include <iostream>
#include <vector>

/**
 * Newton's Divided Difference Interpolation
 */
double newtonDD(const std::vector<double>& x, const std::vector<double>& y, double xi) {
    int n = x.size();
    std::vector<std::vector<double>> table(n, std::vector<double>(n));

    // Fill first column with y values
    for (int i = 0; i < n i++) table[i][0] = y[i];

    // Compute divided differences
    for (int j = 1; j < n; j++) {
        for (int i = 0; i < n - j; i++) {
            table[i][j] = (table[i + 1][j - 1] - table[i][j - 1]) / (x[i + j] - x[i]);
        }
    }

    // Evaluate Newton Polynomial using the coefficients table[0][i]
    double result = table[0][0];
    double product = 1.0;
    for (int i = 1; i < n; i++) {
        product *= (xi - x[i - 1]);
        result += table[0][i] * product;
    }
    return result;
}

int main() {
    std::vector<double> x = {0, 1, 2, 4};
    std::vector<double> y = {1, 1, 2, 5};
    double xi = 1.5;
    std::cout << "P(" << xi << ") = " << newtonDD(x, y, xi) << std::endl;
    return 0;
}`,
  [AlgorithmType.LINEAR_SPLINE]: `#include <iostream>
#include <vector>
#include <stdexcept>

/**
 * Linear Spline Interpolation
 */
double linearSpline(const std::vector<double>& x, const std::vector<double>& y, double xi) {
    int n = x.size();
    if (n < 2) throw std::invalid_argument("Linear Spline requires at least 2 points.");

    for (int i = 0; i < n - 1; ++i) {
        // Search for interval containing xi
        if (xi >= x[i] && xi <= x[i+1]) {
            // Linear interpolation: y = y0 + (y1-y0)/(x1-x0) * (x-x0)
            double slope = (y[i+1] - y[i]) / (x[i+1] - x[i]);
            return y[i] + slope * (xi - x[i]);
        }
    }
    throw std::out_of_range("Target value xi is outside interpolation range.");
}

int main() {
    std::vector<double> x = {0, 1, 2, 5};
    std::vector<double> y = {1, 3, 2, 4};
    double xi = 1.5;

    try {
        double result = linearSpline(x, y, xi);
        std::cout << "Interpolated value at " << xi << ": " << result << std::endl;
    } catch (const std::exception& e) {
        std::cerr << "Error: " << e.what() << std::endl;
    }
    return 0;
}`,
  [AlgorithmType.QUADRATIC_SPLINE]: `#include <iostream>
#include <vector>
#include <cmath>

struct QuadraticSegment {
    double a, b, c, x0;
};

/**
 * Quadratic Spline Interpolation
 * Computes segments S_i(x) = a_i(x-x_i)^2 + b_i(x-x_i) + c_i
 */
std::vector<QuadraticSegment> quadraticSpline(const std::vector<double>& x, const std::vector<double>& y) {
    int n = x.size() - 1;
    std::vector<QuadraticSegment> segments(n);
    
    // Initial segment assumption: linear (a_0 = 0)
    segments[0].a = 0.0;
    segments[0].c = y[0];
    segments[0].x0 = x[0];
    segments[0].b = (y[1] - y[0]) / (x[1] - x[0]);
    
    for (int i = 1; i < n; ++i) {
        double h_prev = x[i] - x[i-1];
        double h = x[i+1] - x[i];
        
        segments[i].x0 = x[i];
        segments[i].c = y[i];
        
        // Continuity of first derivative
        segments[i].b = 2.0 * segments[i-1].a * h_prev + segments[i-1].b;
        
        // Value at end of interval
        segments[i].a = (y[i+1] - y[i] - segments[i].b * h) / (h * h);
    }
    
    return segments;
}

int main() {
    std::vector<double> x = {0, 1, 2, 3};
    std::vector<double> y = {0, 1, 0, 1};
    
    auto segments = quadraticSpline(x, y);
    double targetX = 1.5;
    
    for (const auto& seg : segments) {
        if (targetX >= seg.x0 && targetX <= (seg.x0 + 1.0)) { // Simplified range check for example
             double dx = targetX - seg.x0;
             double res = seg.a * dx * dx + seg.b * dx + seg.c;
             std::cout << "Interpolated value at " << targetX << ": " << res << std::endl;
             break;
        }
    }
    return 0;
}`,
  [AlgorithmType.CUBIC_SPLINE]: `#include <iostream>
#include <vector>
#include <cmath>

/**
 * Natural Cubic Spline Interpolation.
 * Solves for spline coefficients by setting up a tridiagonal system.
 */
struct CubicCoefficients {
    double a, b, c, d, x;
};

std::vector<CubicCoefficients> computeSpline(const std::vector<double>& x, const std::vector<double>& y) {
    int n = x.size() - 1;
    std::vector<double> h(n);
    for (int i = 0; i < n; i++) h[i] = x[i+1] - x[i];

    std::vector<double> alpha(n);
    for (int i = 1; i < n; i++)
        alpha[i] = (3.0/h[i])*(y[i+1]-y[i]) - (3.0/h[i-1])*(y[i]-y[i-1]);

    std::vector<double> l(n+1), mu(n+1), z(n+1);
    l[0] = 1; mu[0] = 0; z[0] = 0;

    for (int i = 1; i < n; i++) {
        l[i] = 2*(x[i+1]-x[i-1]) - h[i-1]*mu[i-1];
        mu[i] = h[i]/l[i];
        z[i] = (alpha[i] - h[i-1]*z[i-1])/l[i];
    }

    l[n] = 1; z[n] = 0;
    std::vector<double> b(n), c(n+1), d(n);
    c[n] = 0;

    for (int j = n-1; j >= 0; j--) {
        c[j] = z[j] - mu[j]*c[j+1];
        b[j] = (y[j+1]-y[j])/h[j] - h[j]*(c[j+1] + 2*c[j])/3.0;
        d[j] = (c[j+1]-c[j])/(3.0*h[j]);
    }

    std::vector<CubicCoefficients> coeffs(n);
    for (int i = 0; i < n; i++) {
        coeffs[i] = {y[i], b[i], c[i], d[i], x[i]};
    }
    return coeffs;
}

int main() {
    std::vector<double> x = {0, 1, 2, 3};
    std::vector<double> y = {1, 2, 0, 1};
    auto spline = computeSpline(x, y);
    std::cout << "Spline coefficients computed for " << spline.size() << " intervals." << std::endl;
    return 0;
}`,
  [AlgorithmType.NEWTON_FORWARD_DIFFERENCE]: `#include <iostream>
#include <vector>
#include <iomanip>

/**
 * Newton Forward Difference Interpolation
 */
double newtonForward(const std::vector<double>& x, const std::vector<double>& y, double xi) {
    int n = x.size();
    std::vector<std::vector<double>> diff(n, std::vector<double>(n));

    // First column is y values
    for (int i = 0; i < n; i++) diff[i][0] = y[i];

    // Compute difference table
    for (int j = 1; j < n; j++) {
        for (int i = 0; i < n - j; i++) {
            diff[i][j] = diff[i + 1][j - 1] - diff[i][j - 1];
        }
    }

    double h = x[1] - x[0];
    double u = (xi - x[0]) / h;
    double result = diff[0][0];
    double u_term = 1.0;
    double fact = 1.0;

    for (int i = 1; i < n; i++) {
        u_term *= (u - (i - 1));
        fact *= i;
        result += (u_term * diff[0][i]) / fact;
    }

    return result;
}

int main() {
    std::vector<double> x = {10, 20, 30, 40};
    std::vector<double> y = {1.1, 2.1, 3.5, 5.2};
    double xi = 15;

    std::cout << std::fixed << std::setprecision(4);
    std::cout << "Interpolated value at " << xi << ": " << newtonForward(x, y, xi) << std::endl;

    return 0;
}`,
  [AlgorithmType.NEWTON_BACKWARD_DIFFERENCE]: `#include <iostream>
#include <vector>
#include <iomanip>

/**
 * Newton Backward Difference Interpolation
 */
double newtonBackward(const std::vector<double>& x, const std::vector<double>& y, double xi) {
    int n = x.size();
    std::vector<std::vector<double>> diff(n, std::vector<double>(n));

    // First column is y values
    for (int i = 0; i < n; i++) diff[i][0] = y[i];

    // Compute difference table
    for (int j = 1; j < n; j++) {
        for (int i = n - 1; i >= j; i--) {
            diff[i][j] = diff[i][j - 1] - diff[i - 1][j - 1];
        }
    }

    double h = x[1] - x[0];
    double u = (xi - x[n - 1]) / h;
    double result = diff[n - 1][0];
    double u_term = 1.0;
    double fact = 1.0;

    for (int i = 1; i < n; i++) {
        u_term *= (u + (i - 1));
        fact *= i;
        result += (u_term * diff[n - 1][i]) / fact;
    }

    return result;
}

int main() {
    std::vector<double> x = {10, 20, 30, 40};
    std::vector<double> y = {1.1, 2.1, 3.5, 5.2};
    double xi = 35;

    std::cout << std::fixed << std::setprecision(4);
    std::cout << "Interpolated value at " << xi << ": " << newtonBackward(x, y, xi) << std::endl;

    return 0;
}`,
  [AlgorithmType.GAUSS_FORWARD_INTERPOLATION]: `// C++ implementation for Gauss Forward...`,
  [AlgorithmType.GAUSS_BACKWARD_INTERPOLATION]: `// C++ implementation for Gauss Backward...`,
  [AlgorithmType.SIMPSON]: `#include <iostream>
#include <cmath>
#include <functional>

/**
 * Simpson's 1/3 Rule for numerical integration.
 * Intervals (n) must be an even number.
 */
double simpsons_13(std::function<double(double)> f, double a, double b, int n) {
    if (n % 2 != 0) return -1.0; 
    
    double h = (b - a) / n;
    double s = f(a) + f(b);
    
    for (int i = 1; i < n; ++i) {
        double x = a + i * h;
        // Weighting factors: 4 for odd indices, 2 for even
        if (i % 2 == 0) s += 2 * f(x);
        else s += 4 * f(x);
    }
    
    return (h / 3.0) * s;
}

int main() {
    auto f = [](double x) { return std::sin(x); };
    double res = simpsons_13(f, 0, M_PI, 100);
    std::cout << "Integral result (sin(x) from 0 to PI): " << res << std::endl;
    return 0;
}`,
  [AlgorithmType.TRAPEZOIDAL]: `#include <iostream>
#include <cmath>
#include <functional>

/**
 * Trapezoidal Rule for numerical integration.
 */
double trapezoidal_rule(std::function<double(double)> f, double a, double b, int n) {
    double h = (b - a) / n;
    double s = 0.5 * (f(a) + f(b));
    
    for (int i = 1; i < n; ++i) {
        s += f(a + i * h);
    }
    
    return h * s;
}

int main() {
    auto f = [](double x) { return std::pow(x, 2); };
    double res = trapezoidal_rule(f, 0, 1, 100);
    std::cout << "Integral result (x^2 from 0 to 1): " << res << std::endl;
    return 0;
}`,
  [AlgorithmType.FORWARD_DIFFERENCE]: `#include <iostream>
#include <cmath>
#include <functional>

/**
 * Computes the first derivative using Forward Difference Method.
 * Error: O(h)
 */
double forward_difference(std::function<double(double)> f, double x, double h = 1e-5) {
    return (f(x + h) - f(x)) / h;
}

int main() {
    // Example: f(x) = x^2
    auto f = [](double x) { return std::pow(x, 2); };
    double x = 2.0;
    double h = 1e-5;
    
    std::cout << "f'(2) approx: " << forward_difference(f, x, h) << std::endl;
    return 0;
}`,
  [AlgorithmType.BACKWARD_DIFFERENCE]: `#include <iostream>
#include <cmath>
#include <functional>

/**
 * Computes the first derivative using Backward Difference Method.
 * Error: O(h)
 */
double backward_difference(std::function<double(double)> f, double x, double h = 1e-5) {
    return (f(x) - f(x - h)) / h;
}

int main() {
    // Example: f(x) = exp(x)
    auto f = [](double x) { return std::exp(x); };
    double x = 1.0;
    double h = 1e-5;
    
    std::cout << "f'(1) approx (Backward): " << backward_difference(f, x, h) << std::endl;
    std::cout << "Exact: " << std::exp(1.0) << std::endl;
    return 0;
}`,
  [AlgorithmType.CENTRAL_DIFFERENCE]: `#include <iostream>
#include <cmath>
#include <functional>

/**
 * Computes the first derivative using Central Difference Method.
 * Error: O(h^2)
 */
double central_difference(std::function<double(double)> f, double x, double h = 1e-5) {
    return (f(x + h) - f(x - h)) / (2.0 * h);
}

int main() {
    // Example: f(x) = sin(x)
    auto f = [](double x) { return std::sin(x); };
    double x = 0.785398; // pi/4
    double h = 1e-5;
    
    std::cout << "f'(pi/4) approx (Central): " << central_difference(f, x, h) << std::endl;
    std::cout << "Exact: " << std::cos(x) << std::endl;
    return 0;
}`,
  [AlgorithmType.SECOND_DERIVATIVE_CENTRAL]: `#include <iostream>
#include <cmath>
#include <functional>
#include <iomanip>

/**
 * Computes the second derivative using Central Difference Method.
 * Formula: f''(x) ≈ [f(x+h) - 2f(x) + f(x-h)] / h^2
 * Error: O(h^2)
 */
double second_derivative_central(std::function<double(double)> f, double x, double h = 1e-4) {
    return (f(x + h) - 2.0 * f(x) + f(x - h)) / (h * h);
}

int main() {
    // Example: f(x) = sin(x), f''(x) = -sin(x)
    auto f = [](double x) { return std::sin(x); };
    double x = 1.0; // radians
    double h = 1e-4;
    
    std::cout << std::fixed << std::setprecision(6);
    std::cout << "f''(1) approx: " << second_derivative_central(f, x, h) << std::endl;
    std::cout << "Exact (-sin(1)): " << -std::sin(x) << std::endl;
    
    return 0;
}`,
  [AlgorithmType.EULER]: `#include <iostream>
#include <functional>
#include <vector>
#include <iomanip>

/**
 * Euler's Method for solving dy/dx = f(x, y)
 */
void euler_method(std::function<double(double, double)> f, double x0, double y0, double h, int steps) {
    double x = x0;
    double y = y0;
    
    std::cout << std::fixed << std::setprecision(4);
    std::cout << "Euler's Method Results (dy/dx = x + y):\n";
    for(int i = 0; i <= steps; ++i) {
        std::cout << "x: " << x << ", y: " << y << "\n";
        // Update rule: y_{n+1} = y_n + h * f(x_n, y_n)
        y = y + h * f(x, y);
        x = x + h;
    }
}

int main() {
    auto f = [](double x, double y) { return x + y; };
    euler_method(f, 0.0, 1.0, 0.1, 10);
    return 0;
}`,
  [AlgorithmType.RK4]: `#include <iostream>
#include <functional>
#include <iomanip>

/**
 * Runge-Kutta 4th Order Method for solving dy/dx = f(x, y)
 */
void rk4_method(std::function<double(double, double)> f, double x0, double y0, double h, int steps) {
    double x = x0;
    double y = y0;
    
    std::cout << std::fixed << std::setprecision(4);
    std::cout << "RK4 Method Results (dy/dx = x + y):\n";
    for(int i = 0; i <= steps; ++i) {
        std::cout << "x: " << x << ", y: " << y << "\n";
        
        double k1 = h * f(x, y);
        double k2 = h * f(x + h/2.0, y + k1/2.0);
        double k3 = h * f(x + h/2.0, y + k2/2.0);
        double k4 = h * f(x + h, y + k3);
        
        // Final update with weighted average
        y = y + (k1 + 2.0*k2 + 2.0*k3 + k4) / 6.0;
        x = x + h;
    }
}

int main() {
    auto f = [](double x, double y) { return x + y; };
    rk4_method(f, 0.0, 1.0, 0.1, 10);
    return 0;
}`,
};

export const SAMPLE_FUNCTIONS = [
  { label: 'x² - 4', value: 'x^2 - 4', root: [-2, 2] },
  { label: 'x³ - x - 2', value: 'x^3 - x - 2', root: [1.521] },
  { label: 'sin(x)', value: 'sin(x)', root: [0, 3.14159] },
  { label: 'e^x - 3x', value: 'e^x - 3x', root: [0.619, 1.512] },
];

export const SAMPLE_FUNCTIONS_DIFF = [
  { label: 'x²', value: 'x^2', derivative: '2x' },
  { label: 'sin(x)', value: 'sin(x)', derivative: 'cos(x)' },
  { label: 'e^x', value: 'exp(x)', derivative: 'exp(x)' },
  { label: 'ln(x)', value: 'log(x)', derivative: '1/x' },
];

export const THEORY_CONTENT: Record<AlgorithmType, TheoryData> = {
  [AlgorithmType.BISECTION]: {
    title: "Bisection Method",
    concept: "Reliable, bracketing method based on the Intermediate Value Theorem.",
    formula: "c = (a + b) / 2",
    convergence: "Linear convergence. Error halves each iteration.",
    steps: ["Choose [a,b] with f(a)*f(b)<0", "Calculate midpoint c", "Replace a or b with c"],
    difficulty: 'Beginner',
    prerequisites: ["Calculus I"],
    applications: ["Initial root estimation"]
  },
  [AlgorithmType.INCREMENTAL_SEARCH]: {
    title: "Incremental Search",
    concept: "Locates intervals where sign changes occur.",
    formula: "f(x) * f(x+h) < 0",
    convergence: "N/A",
    steps: ["Start at x_min", "Step forward by h", "If sign change, return interval"],
    difficulty: 'Beginner',
    prerequisites: ["Intermediate Value Theorem"],
    applications: ["Automated root location"]
  },
  [AlgorithmType.FALSE_POSITION]: {
    title: "False Position Method",
    concept: "Uses a secant line between bounds to interpolate the root.",
    formula: "c = (a*f(b) - b*f(a)) / (f(b) - f(a))",
    convergence: "Linear, usually faster than Bisection.",
    steps: ["Bracket root", "Interpolate c", "Update bounds"],
    difficulty: 'Intermediate',
    prerequisites: ["Linear interpolation"],
    applications: ["Financial modelling"]
  },
  [AlgorithmType.NEWTON_RAPHSON]: {
    title: "Newton-Raphson Method",
    concept: "Open method using the local tangent to find roots.",
    formula: "x_{n+1} = x_n - f(x_n)/f'(x_n)",
    convergence: "Quadratic convergence near the root.",
    steps: ["Start with x0", "Calculate derivative", "Iterate formula"],
    difficulty: 'Intermediate',
    prerequisites: ["Derivatives"],
    applications: ["Real-time simulation"]
  },
  [AlgorithmType.SECANT]: {
    title: "Secant Method",
    concept: "Derivative-free version of Newton-Raphson using two points.",
    formula: "x_{n+1} = x_n - f(x_n)*(x_n-x_{n-1})/(f(x_n)-f(x_{n-1}))",
    convergence: "Superlinear (φ ≈ 1.618).",
    steps: ["Pick x0, x1", "Calculate slope", "Iterate"],
    difficulty: 'Intermediate',
    prerequisites: ["Algebra"],
    applications: ["Complex equations"]
  },
  [AlgorithmType.FIXED_POINT_ITERATION]: {
    title: "Fixed Point Iteration",
    concept: "Rearranges f(x)=0 into x=g(x).",
    formula: "x_{i+1} = g(x_i)",
    convergence: "Linear if |g'(x)| < 1.",
    steps: ["Transform to x=g(x)", "Iterate guess", "Check stability"],
    difficulty: 'Advanced',
    prerequisites: ["Convergence Theory"],
    applications: ["Computational physics"]
  },
  [AlgorithmType.MULLER]: {
    title: "Muller's Method",
    concept: "Uses parabolic interpolation through three points.",
    formula: "x3 = x2 + dx (Quadratic formula based)",
    convergence: "Superlinear (Order ≈ 1.84).",
    steps: ["Pick 3 points", "Fit parabola", "Solve quadratic for x_next"],
    difficulty: 'Advanced',
    prerequisites: ["Complex numbers"],
    applications: ["Polynomial roots"]
  },
  [AlgorithmType.GAUSSIAN]: {
    title: "Gaussian Elimination",
    concept: "Direct solver for linear systems Ax=b.",
    formula: "R_i = R_i - (A_{i,k}/A_{k,k}) * R_k",
    convergence: "Exact calculation.",
    steps: ["Augment [A|b]", "Forward elimination", "Back substitution"],
    difficulty: 'Intermediate',
    prerequisites: ["Linear Algebra"],
    applications: ["Structural engineering"]
  },
  [AlgorithmType.GAUSS_JORDAN]: {
    title: "Gauss-Jordan",
    concept: "Reduces matrix to reduced row echelon form.",
    formula: "R_k = R_k / A_{k,k}",
    convergence: "Exact calculation.",
    steps: ["Normalize pivot", "Eliminate other entries"],
    difficulty: 'Intermediate',
    prerequisites: ["Gaussian Elimination"],
    applications: ["Matrix inversion"]
  },
  [AlgorithmType.LU_DECOMPOSITION]: {
    title: "LU Decomposition",
    concept: "Factors A into lower and upper triangular matrices.",
    formula: "A = LU",
    convergence: "Exact calculation.",
    steps: ["Factorize A", "Solve Ly=b", "Solve Ux=y"],
    difficulty: 'Advanced',
    prerequisites: ["Matrix multiplication"],
    applications: ["Efficient linear solving"]
  },
  [AlgorithmType.CHOLESKY_DECOMPOSITION]: {
    title: "Cholesky Decomposition",
    concept: "Special factorization for symmetric positive-definite matrices.",
    formula: "A = LL^T",
    convergence: "Exact calculation.",
    steps: ["Iterate rows", "Calculate L entries", "Verify PDness"],
    difficulty: 'Advanced',
    prerequisites: ["Positive-definite matrices"],
    applications: ["Monte Carlo", "Filtering"]
  },
  [AlgorithmType.QR_DECOMPOSITION]: {
    title: "QR Decomposition",
    concept: "Orthonormal factorization for robust solving.",
    formula: "A = QR",
    convergence: "Exact calculation.",
    steps: ["Gram-Schmidt process", "Form Q and R"],
    difficulty: 'Advanced',
    prerequisites: ["Orthonormality"],
    applications: ["Least squares", "Eigenvalues"]
  },
  [AlgorithmType.JACOBI]: {
    title: "Jacobi Iteration",
    concept: "Iterative solver for diagonally dominant matrices.",
    formula: "x_i^{(k+1)} = (b_i - Σ_{j≠i} a_{ij} x_j^{(k)}) / a_{ii}",
    convergence: "Linear convergence.",
    steps: ["Initialize x", "Calculate next x based on previous", "Iterate"],
    difficulty: 'Intermediate',
    prerequisites: ["Diagonal dominance"],
    applications: ["Large sparse systems"]
  },
  [AlgorithmType.GAUSS_SEIDEL]: {
    title: "Gauss-Seidel",
    concept: "Faster version of Jacobi using new values immediately.",
    formula: "x_i^{(k+1)} = (b_i - Σ_{j<i} a_{ij} x_j^{(k+1)} - Σ_{j>i} a_{ij} x_j^{(k)}) / a_{ii}",
    convergence: "Linear, usually 2x faster than Jacobi.",
    steps: ["Update x_i sequentially", "Repeat"],
    difficulty: 'Intermediate',
    prerequisites: ["Jacobi Iteration"],
    applications: ["Physics simulations"]
  },
  [AlgorithmType.MATRIX_INVERSE]: {
    title: "Matrix Inverse",
    concept: "Calculates A⁻¹ such that A * A⁻¹ = I.",
    formula: "A * A⁻¹ = I",
    convergence: "Exact calculation.",
    steps: ["Augment [A|I]", "Gauss-Jordan elimination"],
    difficulty: 'Intermediate',
    prerequisites: ["Gauss-Jordan"],
    applications: ["Linear systems"]
  },
  [AlgorithmType.MATRIX_DETERMINANT]: {
    title: "Matrix Determinant",
    concept: "Characterizes matrix properties and volume scaling.",
    formula: "det(A)",
    convergence: "Exact calculation.",
    steps: ["Upper triangulation", "Product of diagonal"],
    difficulty: 'Intermediate',
    prerequisites: ["Elimination"],
    applications: ["Solvability checks"]
  },
  [AlgorithmType.MATRIX_ADDITION]: {
    title: "Matrix Addition",
    concept: "Element-wise summation of two matrices of equal size.",
    formula: "C_{ij} = A_{ij} + B_{ij}",
    convergence: "Direct Operation (O(n²)).",
    steps: ["Verify matrices have same dimensions", "Sum corresponding elements", "Store in result matrix"],
    difficulty: 'Beginner',
    prerequisites: ["Basic Arithmetic"],
    applications: ["Data aggregation", "Linear combinations"]
  },
  [AlgorithmType.MATRIX_SUBTRACTION]: {
    title: "Matrix Subtraction",
    concept: "Element-wise difference between two matrices of equal size.",
    formula: "C_{ij} = A_{ij} - B_{ij}",
    convergence: "Direct Operation (O(n²)).",
    steps: ["Verify matrices have same dimensions", "Subtract B_{ij} from A_{ij}", "Store in result matrix"],
    difficulty: 'Beginner',
    prerequisites: ["Basic Arithmetic"],
    applications: ["Error calculation", "State differences"]
  },
  [AlgorithmType.MATRIX_MULTIPLICATION]: {
    title: "Matrix Multiplication",
    concept: "Dot products of rows and columns.",
    formula: "C_{ij} = Σ A_{ik} B_{kj}",
    convergence: "Direct Operation (O(n³)).",
    steps: ["Compute dot products for each cell"],
    difficulty: 'Intermediate',
    prerequisites: ["Summation"],
    applications: ["Transformations"]
  },
  [AlgorithmType.MATRIX_TRANSPOSE]: {
    title: "Matrix Transpose",
    concept: "Flips matrix over diagonal.",
    formula: "B_{ij} = A_{ji}",
    convergence: "Direct Operation (O(n²)).",
    steps: ["Swap indices"],
    difficulty: 'Beginner',
    prerequisites: ["Indices"],
    applications: ["Solving normals"]
  },
  [AlgorithmType.LAGRANGE]: {
    title: "Lagrange Interpolation",
    concept: "Single polynomial passing through all points.",
    formula: "P(x) = Σ y_i L_i(x)",
    convergence: "Exact for data points.",
    steps: ["Calculate basis polynomials", "Weighted sum"],
    difficulty: 'Intermediate',
    prerequisites: ["Polynomials"],
    applications: ["Small data sets"]
  },
  [AlgorithmType.NEWTON_DIVIDED_DIFFERENCE]: {
    title: "Newton Divided Difference",
    concept: "Builds polynomial using difference table.",
    formula: "f[x0...xk]",
    convergence: "Exact for data points.",
    steps: ["Form table", "Construct P(x)"],
    difficulty: 'Advanced',
    prerequisites: ["Differences"],
    applications: ["Incremental data"]
  },
  [AlgorithmType.LINEAR_SPLINE]: {
    title: "Linear Spline",
    concept: "Connects data with straight segments.",
    formula: "S(x) = y_i + m(x - x_i)",
    convergence: "O(h²) error.",
    steps: ["Find interval", "Interpolate linearly"],
    difficulty: 'Beginner',
    prerequisites: ["Slopes"],
    applications: ["Rough plotting"]
  },
  [AlgorithmType.QUADRATIC_SPLINE]: {
    title: "Quadratic Spline",
    concept: "Smooth parabolic segments.",
    formula: "a_i x² + b_i x + c_i",
    convergence: "O(h³) error.",
    steps: ["Continuity equations", "Solve coefficients"],
    difficulty: 'Advanced',
    prerequisites: ["Splines"],
    applications: ["Robotics"]
  },
  [AlgorithmType.CUBIC_SPLINE]: {
    title: "Cubic Spline",
    concept: "Twice-differentiable smooth curve.",
    formula: "a_i x³ + b_i x² + c_i x + d_i",
    convergence: "O(h⁴) error.",
    steps: ["Set up tridiagonal system", "Solve moments"],
    difficulty: 'Advanced',
    prerequisites: ["Calculus II"],
    applications: ["CAD/CAM"]
  },
  [AlgorithmType.NEWTON_FORWARD_DIFFERENCE]: {
    title: "Newton Forward Difference",
    concept: "Interpolation for evenly spaced data.",
    formula: "P(x) = y0 + uΔy0 + ...",
    convergence: "Exact for polynomials.",
    steps: ["Check spacing", "Forward table", "Apply formula"],
    difficulty: 'Intermediate',
    prerequisites: ["Operators"],
    applications: ["Table interpolation"]
  },
  [AlgorithmType.NEWTON_BACKWARD_DIFFERENCE]: {
    title: "Newton Backward Difference",
    concept: "Best for points near the end of a dataset.",
    formula: "P(x) = yn + u∇yn + ...",
    convergence: "Exact for polynomials.",
    steps: ["Backward table", "Apply formula"],
    difficulty: 'Intermediate',
    prerequisites: ["Operators"],
    applications: ["Forecasting"]
  },
  [AlgorithmType.GAUSS_FORWARD_INTERPOLATION]: {
    title: "Gauss Forward Interpolation",
    concept: "Central difference interpolation.",
    formula: "Zig-zag table path",
    convergence: "High accuracy near center.",
    steps: ["Identify mid-point", "Zig-zag through table"],
    difficulty: 'Advanced',
    prerequisites: ["Central differences"],
    applications: ["Physics tables"]
  },
  [AlgorithmType.GAUSS_BACKWARD_INTERPOLATION]: {
    title: "Gauss Backward Interpolation",
    concept: "Central difference interpolation from below.",
    formula: "Zig-zag upward path",
    convergence: "High accuracy near center.",
    steps: ["Identify mid-point", "Upward zig-zag"],
    difficulty: 'Advanced',
    prerequisites: ["Central differences"],
    applications: ["Physics tables"]
  },
  [AlgorithmType.SIMPSON]: {
    title: "Simpson's 1/3 Rule",
    concept: "Parabolic approximation for integration.",
    formula: "h/3 * (f0 + 4Σf_odd + 2Σf_even + fn)",
    convergence: "O(h⁴) error.",
    steps: ["Divide into even segments", "Weighted sum"],
    difficulty: 'Intermediate',
    prerequisites: ["Quadratic approx"],
    applications: ["Area/Volume"]
  },
  [AlgorithmType.TRAPEZOIDAL]: {
    title: "Trapezoidal Rule",
    concept: "Linear approximation for integration.",
    formula: "h/2 * (f0 + 2Σfi + fn)",
    convergence: "O(h²) error.",
    steps: ["Divide segments", "Sum trapezoids"],
    difficulty: 'Beginner',
    prerequisites: ["Integration"],
    applications: ["Fast area estimation"]
  },
  [AlgorithmType.FORWARD_DIFFERENCE]: {
    title: "Forward Difference",
    concept: "Simple derivative approximation.",
    formula: "(f(x+h) - f(x)) / h",
    convergence: "O(h) error.",
    steps: ["Sample x and x+h"],
    difficulty: 'Beginner',
    prerequisites: ["Limits"],
    applications: ["Real-time data"]
  },
  [AlgorithmType.BACKWARD_DIFFERENCE]: {
    title: "Backward Difference",
    concept: "Uses past data for derivative.",
    formula: "(f(x) - f(x-h)) / h",
    convergence: "O(h) error.",
    steps: ["Sample x and x-h"],
    difficulty: 'Beginner',
    prerequisites: ["Limits"],
    applications: ["Real-time data"]
  },
  [AlgorithmType.CENTRAL_DIFFERENCE]: {
    title: "Central Difference",
    concept: "Average of forward and backward.",
    formula: "(f(x+h) - f(x-h)) / 2h",
    convergence: "O(h²) error.",
    steps: ["Sample x±h"],
    difficulty: 'Intermediate',
    prerequisites: ["Taylor series"],
    applications: ["High precision"]
  },
  [AlgorithmType.SECOND_DERIVATIVE_CENTRAL]: {
    title: "Second Derivative",
    concept: "Curvature approximation.",
    formula: "(f(x+h) - 2f(x) + f(x-h)) / h²",
    convergence: "O(h²) error.",
    steps: ["Sample 3 points"],
    difficulty: 'Intermediate',
    prerequisites: ["Calculus"],
    applications: ["Acceleration"]
  },
  [AlgorithmType.EULER]: {
    title: "Euler's Method",
    concept: "First-order ODE solver.",
    formula: "y_{n+1} = y_n + h*f(x,y)",
    convergence: "O(h) error.",
    steps: ["Initial values", "Extrapolate slope"],
    difficulty: 'Beginner',
    prerequisites: ["ODE"],
    applications: ["Games/Sim"]
  },
  [AlgorithmType.RK4]: {
    title: "Runge-Kutta 4th Order",
    concept: "High accuracy ODE solver.",
    formula: "y_{n+1} = y_n + (1/6)(k1 + 2k2 + 2k3 + k4)",
    convergence: "O(h⁴) error.",
    steps: ["Calculate 4 slopes", "Weighted update"],
    difficulty: 'Advanced',
    prerequisites: ["Stability theory"],
    applications: ["Aerospace"]
  },
};