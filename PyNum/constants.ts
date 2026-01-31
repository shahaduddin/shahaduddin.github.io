import { AlgorithmType, TheoryData } from './types';

export const PYTHON_SNIPPETS: Record<AlgorithmType, string> = {
  [AlgorithmType.BISECTION]: `def bisection(f, a, b, tol=1e-6, max_iter=100):
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
func = lambda x: x**3 - x - 2
root = bisection(func, 1, 2)
print(f"Root: {root}")`,

  [AlgorithmType.FALSE_POSITION]: `def false_position(f, a, b, tol=1e-6, max_iter=100):
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
    Rearrange f(x)=0 into x = g(x).
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
        
    return x

# Example
A = np.array([[2, 1], [5, 7]], dtype=float)
b = np.array([11, 13], dtype=float)
print(gaussian_elimination(A, b))`,

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
                
    return M[:, -1] # Last column is the solution

A = np.array([[2, 1], [5, 7]], dtype=float)
b = np.array([11, 13], dtype=float)
print(gauss_jordan(A, b))`,

  [AlgorithmType.LU_DECOMPOSITION]: `import scipy.linalg as la
import numpy as np

# Using SciPy (Standard)
A = np.array([[4, 1, 1], [1, 5, 2], [1, 2, 4]])
b = np.array([6, 8, 7])
P, L, U = la.lu(A)
print("L:", L)
print("U:", U)
x = la.solve(A, b)
print("x:", x)

# Manual Doolittle Algorithm
def lu_decomposition(A):
    n = len(A)
    L = np.zeros((n, n))
    U = np.zeros((n, n))
    
    for i in range(n):
        # Upper Triangular
        for k in range(i, n):
            sum_val = sum(L[i][j] * U[j][k] for j in range(i))
            U[i][k] = A[i][k] - sum_val
            
        # Lower Triangular
        for k in range(i, n):
            if i == k:
                L[i][i] = 1
            else:
                sum_val = sum(L[k][j] * U[j][i] for j in range(i))
                L[k][i] = (A[k][i] - sum_val) / U[i][i]
    return L, U`,

  [AlgorithmType.CHOLESKY_DECOMPOSITION]: `import numpy as np

# Using NumPy
A = np.array([[4, 12, -16], [12, 37, -43], [-16, -43, 98]])
L = np.linalg.cholesky(A)
print("L:", L)
print("Recostructed A:", np.dot(L, L.T))

# Manual Implementation
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

# Using NumPy
A = np.array([[12, -51, 4], [6, 167, -68], [-4, 24, -41]])
Q, R = np.linalg.qr(A)
print("Q:", Q)
print("R:", R)

# Manual (Gram-Schmidt)
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
    
    # Check diagonal dominance (optional but recommended)
    
    for k in range(max_iter):
        x_new = np.zeros(n)
        for i in range(n):
            s = sum(A[i][j] * x[j] for j in range(n) if i != j)
            x_new[i] = (b[i] - s) / A[i][i]
            
        if np.linalg.norm(x_new - x) < tol:
            return x_new
        x = x_new
        
    return x

A = np.array([[4, 1], [1, 3]], dtype=float)
b = np.array([6, 4], dtype=float)
print(jacobi_iteration(A, b))`,

  [AlgorithmType.GAUSS_SEIDEL]: `import numpy as np

def gauss_seidel(A, b, x0=None, tol=1e-5, max_iter=100):
    n = len(b)
    if x0 is None: x0 = np.zeros(n)
    x = x0.copy()
    
    for k in range(max_iter):
        x_old = x.copy()
        for i in range(n):
            # Use updated x values immediately
            s = sum(A[i][j] * x[j] for j in range(n) if i != j)
            x[i] = (b[i] - s) / A[i][i]
            
        if np.linalg.norm(x - x_old) < tol:
            return x
            
    return x

A = np.array([[4, 1], [1, 3]], dtype=float)
b = np.array([6, 4], dtype=float)
print(gauss_seidel(A, b))`,

  [AlgorithmType.MATRIX_INVERSE]: `import numpy as np

# Using NumPy (Recommended)
A = np.array([[4, 1, 1], [1, 5, 2], [1, 2, 4]])
inv_A = np.linalg.inv(A)
print(inv_A)

# Manual Gauss-Jordan for Inverse
def invert_matrix(A):
    n = len(A)
    # Augment with Identity
    M = np.hstack([A, np.eye(n)])
    
    for i in range(n):
        # Normalize pivot
        M[i] = M[i] / M[i][i]
        # Eliminate column
        for j in range(n):
            if i != j:
                M[j] -= M[j][i] * M[i]
                
    return M[:, n:] # Right half`,

  [AlgorithmType.MATRIX_DETERMINANT]: `import numpy as np

# Using NumPy
A = np.array([[4, 1, 1], [1, 5, 2], [1, 2, 4]])
det = np.linalg.det(A)
print(det)

# Manual (via decomposition or elimination)
# Determinant is product of diagonals of Upper Triangular matrix
# multiplied by (-1)^swaps
`,

  [AlgorithmType.MATRIX_ADDITION]: `import numpy as np

A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])

# Using NumPy
C = A + B
print(C)

# Manual Implementation
def matrix_add(A, B):
    rows = len(A)
    cols = len(A[0])
    return [[A[i][j] + B[i][j] for j in range(cols)] for i in range(rows)]`,

  [AlgorithmType.MATRIX_SUBTRACTION]: `import numpy as np

A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])

# Using NumPy
C = A - B
print(C)

# Manual Implementation
def matrix_sub(A, B):
    rows = len(A)
    cols = len(A[0])
    return [[A[i][j] - B[i][j] for j in range(cols)] for i in range(rows)]`,

  [AlgorithmType.MATRIX_MULTIPLICATION]: `import numpy as np

A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])

# Using NumPy
C = np.dot(A, B) # or A @ B
print(C)

# Manual Implementation
def matrix_mul(A, B):
    n = len(A)
    C = [[0]*n for _ in range(n)]
    for i in range(n):
        for j in range(n):
            for k in range(n):
                C[i][j] += A[i][k] * B[k][j]
    return C`,

  [AlgorithmType.MATRIX_TRANSPOSE]: `import numpy as np

A = np.array([[1, 2], [3, 4]])

# Using NumPy
print(A.T)

# Manual Implementation
def matrix_transpose(A):
    rows = len(A)
    cols = len(A[0])
    return [[A[j][i] for j in range(rows)] for i in range(cols)]`,

  [AlgorithmType.LAGRANGE]: `def lagrange_interpolation(x, y, xi):
    n = len(x)
    result = 0.0
    
    for i in range(n):
        term = y[i]
        for j in range(n):
            if i != j:
                term = term * (xi - x[j]) / (x[i] - x[j])
        result += term
        
    return result

# Example
x_points = [0, 1, 2, 5]
y_points = [2, 3, 12, 147]
print(lagrange_interpolation(x_points, y_points, 3))`,

  [AlgorithmType.NEWTON_DIVIDED_DIFFERENCE]: `def newton_divided_difference(x, y, xi):
    n = len(x)
    coef = list(y) # Make a copy
    
    # Calculate divided differences
    for j in range(1, n):
        for i in range(n-1, j-1, -1):
            coef[i] = (coef[i] - coef[i-1]) / (x[i] - x[i-j])
            
    # Evaluate polynomial
    result = coef[n-1]
    for i in range(n-2, -1, -1):
        result = result * (xi - x[i]) + coef[i]
        
    return result

# Example
x = [0, 1, 2, 5]
y = [2, 3, 12, 147]
print(newton_divided_difference(x, y, 3))`,

  [AlgorithmType.LINEAR_SPLINE]: `def linear_spline(x, y, xi):
    # Assume x is sorted
    n = len(x)
    for i in range(n-1):
        if x[i] <= xi <= x[i+1]:
            m = (y[i+1] - y[i]) / (x[i+1] - x[i])
            return y[i] + m * (xi - x[i])
    return None

# Example
x = [1, 2, 3, 4]
y = [1, 4, 9, 16]
print(linear_spline(x, y, 2.5))`,

  [AlgorithmType.QUADRATIC_SPLINE]: `import numpy as np

def quadratic_spline(x, y, xi):
    """
    Computes quadratic spline assuming a0 = 0 (linear first segment).
    """
    n = len(x) - 1
    # Arrays to store coefficients a_i, b_i, c_i for each interval
    a = np.zeros(n)
    b = np.zeros(n)
    c = np.zeros(n)
    
    # First interval (assume a[0] = 0)
    a[0] = 0
    b[0] = (y[1] - y[0]) / (x[1] - x[0])
    c[0] = y[0]
    
    # Solve for remaining coefficients
    for i in range(1, n):
        h_prev = x[i] - x[i-1]
        h_curr = x[i+1] - x[i]
        
        # Continuity of 1st derivative: 2*a_{i-1}*h_{i-1} + b_{i-1} = b_i
        b[i] = 2 * a[i-1] * h_prev + b[i-1]
        c[i] = y[i]
        
        # Continuity of function: a_i*h_curr^2 + b_i*h_curr + c_i = y_{i+1}
        # Solve for a_i
        a[i] = (y[i+1] - y[i] - b[i]*h_curr) / (h_curr**2)
        
    # Evaluate
    for i in range(n):
        if x[i] <= xi <= x[i+1]:
            dx = xi - x[i]
            return a[i]*dx**2 + b[i]*dx + c[i]
            
    return None`,

  [AlgorithmType.CUBIC_SPLINE]: `from scipy.interpolate import CubicSpline

# Using SciPy (Standard approach in Python)
x = [0, 1, 2, 5]
y = [2, 3, 12, 147]
cs = CubicSpline(x, y, bc_type='natural')
print(cs(3))

# Manual Implementation (Natural Spline)
def natural_cubic_spline(x, y, xi):
    n = len(x) - 1
    h = [x[i+1] - x[i] for i in range(n)]
    
    # Tridiagonal system setup for moments (M)
    # ... (System solving code omitted for brevity)
    # See Theory tab for full algorithm
    pass`,

  [AlgorithmType.NEWTON_FORWARD_DIFFERENCE]: `import numpy as np

def newton_forward(x, y, xi):
    # Check if evenly spaced
    h = x[1] - x[0]
    if not np.allclose(np.diff(x), h):
        raise ValueError("Data must be evenly spaced")
        
    n = len(x)
    # Forward Difference Table
    diff = np.zeros((n, n))
    diff[:,0] = y
    
    for j in range(1, n):
        for i in range(n - j):
            diff[i][j] = diff[i+1][j-1] - diff[i][j-1]
            
    # Calculate u
    u = (xi - x[0]) / h
    
    # Evaluate
    result = diff[0][0]
    u_term = 1
    fact = 1
    
    for i in range(1, n):
        u_term = u_term * (u - (i-1))
        fact = fact * i
        result += (u_term * diff[0][i]) / fact
        
    return result

# Example
x = [0, 1, 2, 3]
y = [1, 2, 9, 28]
print(newton_forward(x, y, 1.5))`,

  [AlgorithmType.NEWTON_BACKWARD_DIFFERENCE]: `import numpy as np

def newton_backward(x, y, xi):
    # Check if evenly spaced
    h = x[1] - x[0]
    if not np.allclose(np.diff(x), h):
        raise ValueError("Data must be evenly spaced")
        
    n = len(x)
    # Backward Difference Table
    diff = np.zeros((n, n))
    diff[:,0] = y
    
    for j in range(1, n):
        for i in range(n - 1, j - 1, -1):
            diff[i][j] = diff[i][j-1] - diff[i-1][j-1]
            
    # Calculate u
    u = (xi - x[n-1]) / h
    
    # Evaluate
    result = diff[n-1][0]
    u_term = 1
    fact = 1
    
    for i in range(1, n):
        u_term = u_term * (u + (i-1))
        fact = fact * i
        result += (u_term * diff[n-1][i]) / fact
        
    return result

# Example
x = [0, 1, 2, 3]
y = [1, 2, 9, 28]
print(newton_backward(x, y, 2.5))`,

  [AlgorithmType.GAUSS_FORWARD_INTERPOLATION]: `import numpy as np

def gauss_forward(x, y, xi):
    n = len(x)
    h = x[1] - x[0]
    mid = n // 2  # Central index
    
    # Construct Standard Difference Table
    diff = np.zeros((n, n))
    diff[:,0] = y
    for j in range(1, n):
        for i in range(n - j):
            diff[i][j] = diff[i+1][j-1] - diff[i][j-1]
            
    u = (xi - x[mid]) / h
    result = diff[mid][0]
    u_term = 1
    fact = 1
    
    # Gauss Forward Formula
    # Path: y0 -> dy0 -> d2y-1 -> d3y-1 -> d4y-2 ...
    for i in range(1, n):
        if i == 1: u_term *= u
        elif i % 2 == 0: u_term *= (u - i//2)
        else: u_term *= (u + i//2)
        
        fact *= i
        
        # Calculate row index in table based on pattern
        idx = mid - (i // 2)
        if 0 <= idx < n - i:
            result += (u_term * diff[idx][i]) / fact
            
    return result

# Example
x = [21, 25, 29, 33, 37]
y = [18.47, 17.81, 17.10, 16.34, 15.51]
print(gauss_forward(x, y, 30))`,

  [AlgorithmType.GAUSS_BACKWARD_INTERPOLATION]: `import numpy as np

def gauss_backward(x, y, xi):
    n = len(x)
    h = x[1] - x[0]
    mid = n // 2 # Central index
    
    # Standard Difference Table
    diff = np.zeros((n, n))
    diff[:,0] = y
    for j in range(1, n):
        for i in range(n - j):
            diff[i][j] = diff[i+1][j-1] - diff[i][j-1]
            
    u = (xi - x[mid]) / h
    result = diff[mid][0]
    u_term = 1
    fact = 1
    
    # Gauss Backward Formula
    # Path: y0 -> dy-1 -> d2y-1 -> d3y-2 -> d4y-2 ...
    for i in range(1, n):
        if i == 1: u_term *= u
        elif i % 2 == 0: u_term *= (u + i//2)
        else: u_term *= (u - i//2)
        
        fact *= i
        
        # Calculate row index
        idx = mid - ((i + 1) // 2)
        if 0 <= idx < n - i:
            result += (u_term * diff[idx][i]) / fact
            
    return result`,

  [AlgorithmType.SIMPSON]: `def simpsons_rule(f, a, b, n):
    if n % 2 != 0:
        raise ValueError("n must be even")
    
    h = (b - a) / n
    integration = f(a) + f(b)
    
    for i in range(1, n):
        k = a + i * h
        if i % 2 == 0:
            integration += 2 * f(k)
        else:
            integration += 4 * f(k)
            
    return integration * h / 3

# Example
f = lambda x: x**2
print(simpsons_rule(f, 0, 1, 10))`,

  [AlgorithmType.TRAPEZOIDAL]: `def trapezoidal_rule(f, a, b, n):
    h = (b - a) / n
    integration = f(a) + f(b)
    
    for i in range(1, n):
        k = a + i * h
        integration += 2 * f(k)
        
    return integration * h / 2

# Example
print(trapezoidal_rule(lambda x: x**3, 0, 1, 10))`,

  [AlgorithmType.FORWARD_DIFFERENCE]: `def forward_difference(f, x, h=1e-5):
    """
    Computes first derivative using Forward Difference.
    f'(x) ≈ (f(x+h) - f(x)) / h
    """
    return (f(x + h) - f(x)) / h

# Example
f = lambda x: x**2
print(f"f'(2) ≈ {forward_difference(f, 2)}")`,

  [AlgorithmType.BACKWARD_DIFFERENCE]: `def backward_difference(f, x, h=1e-5):
    """
    Computes first derivative using Backward Difference.
    f'(x) ≈ (f(x) - f(x-h)) / h
    """
    return (f(x) - f(x - h)) / h

# Example
f = lambda x: x**2
print(f"f'(2) ≈ {backward_difference(f, 2)}")`,

  [AlgorithmType.CENTRAL_DIFFERENCE]: `def central_difference(f, x, h=1e-5):
    """
    Computes first derivative using Central Difference.
    f'(x) ≈ (f(x+h) - f(x-h)) / (2*h)
    """
    return (f(x + h) - f(x - h)) / (2 * h)

# Example
f = lambda x: x**2
print(f"f'(2) ≈ {central_difference(f, 2)}")`,

  [AlgorithmType.SECOND_DERIVATIVE_CENTRAL]: `def second_derivative_central(f, x, h=1e-5):
    """
    Computes second derivative using Central Difference.
    f''(x) ≈ (f(x+h) - 2*f(x) + f(x-h)) / h^2
    """
    return (f(x + h) - 2*f(x) + f(x - h)) / (h**2)

# Example
f = lambda x: x**3
print(f"f''(2) ≈ {second_derivative_central(f, 2)}")`,

  [AlgorithmType.EULER]: `import numpy as np

def euler_method(f, x0, y0, h, x_end):
    steps = int((x_end - x0) / h)
    x = np.linspace(x0, x_end, steps + 1)
    y = np.zeros(steps + 1)
    y[0] = y0
    
    for i in range(steps):
        y[i+1] = y[i] + h * f(x[i], y[i])
        
    return x, y

# Example dy/dx = x + y
f = lambda x, y: x + y
x, y = euler_method(f, 0, 1, 0.1, 1)
print(list(zip(x, y)))`,

  [AlgorithmType.RK4]: `def rk4_method(f, x0, y0, h, x_end):
    steps = int((x_end - x0) / h)
    x = [x0]
    y = [y0]
    
    xn = x0
    yn = y0
    
    for i in range(steps):
        k1 = h * f(xn, yn)
        k2 = h * f(xn + h/2, yn + k1/2)
        k3 = h * f(xn + h/2, yn + k2/2)
        k4 = h * f(xn + h, yn + k3)
        
        yn = yn + (k1 + 2*k2 + 2*k3 + k4) / 6
        xn = xn + h
        
        x.append(xn)
        y.append(yn)
        
    return x, y

# Example
f = lambda x, y: x - y
x, y = rk4_method(f, 0, 1, 0.1, 2)
print(y[-1])`,
};

export const FORTRAN_SNIPPETS: Record<AlgorithmType, string> = {
  [AlgorithmType.BISECTION]: `program bisection
    implicit none
    real :: a, b, c, fa, fb, fc, tol
    integer :: i, max_iter
    
    a = 1.0
    b = 2.0
    tol = 1e-6
    max_iter = 100
    
    fa = f(a)
    fb = f(b)
    
    if (fa * fb >= 0) then
        print *, "Root not bracketed"
        stop
    end if
    
    do i = 1, max_iter
        c = (a + b) / 2.0
        fc = f(c)
        
        if (abs(fc) < tol .or. (b - a)/2.0 < tol) exit
        
        if (fc * fa < 0) then
            b = c
            fb = fc
        else
            a = c
            fa = fc
        end if
    end do
    
    print *, "Root: ", c

contains
    real function f(x)
        real, intent(in) :: x
        f = x**3 - x - 2.0
    end function f
end program bisection`,

  [AlgorithmType.FALSE_POSITION]: `program false_position
    implicit none
    real :: a, b, c, fa, fb, fc, tol
    integer :: i, max_iter
    
    a = 1.0
    b = 2.0
    tol = 1e-6
    max_iter = 100
    
    fa = f(a)
    fb = f(b)
    
    if (fa * fb >= 0) then
        print *, "Root not bracketed"
        stop
    end if
    
    do i = 1, max_iter
        c = (a*fb - b*fa) / (fb - fa)
        fc = f(c)
        
        if (abs(fc) < tol) exit
        
        if (fc * fa < 0) then
            b = c
            fb = fc
        else
            a = c
            fa = fc
        end if
    end do
    
    print *, "Root: ", c

contains
    real function f(x)
        real, intent(in) :: x
        f = x**3 - x - 2.0
    end function f
end program false_position`,

  [AlgorithmType.NEWTON_RAPHSON]: `program newton_raphson
    implicit none
    real :: x, x_new, fx, dfx, tol
    integer :: i, max_iter
    
    x = 10.0
    tol = 1e-6
    max_iter = 100
    
    do i = 1, max_iter
        fx = f(x)
        dfx = df(x)
        
        if (dfx == 0) then
            print *, "Derivative zero"
            stop
        end if
        
        x_new = x - fx / dfx
        
        if (abs(x_new - x) < tol) exit
        x = x_new
    end do
    
    print *, "Root: ", x_new

contains
    real function f(val)
        real, intent(in) :: val
        f = val**2 - 4.0
    end function f
    
    real function df(val)
        real, intent(in) :: val
        df = 2.0 * val
    end function df
end program newton_raphson`,

  [AlgorithmType.SECANT]: `program secant
    implicit none
    real :: x0, x1, x2, fx0, fx1, tol
    integer :: i, max_iter
    
    x0 = 1.0
    x1 = 2.0
    tol = 1e-6
    max_iter = 100
    
    do i = 1, max_iter
        fx0 = f(x0)
        fx1 = f(x1)
        
        if (fx1 - fx0 == 0) stop
        
        x2 = x1 - fx1 * (x1 - x0) / (fx1 - fx0)
        
        if (abs(x2 - x1) < tol) exit
        
        x0 = x1
        x1 = x2
    end do
    
    print *, "Root: ", x2

contains
    real function f(x)
        real, intent(in) :: x
        f = x**3 - x - 2.0
    end function f
end program secant`,

  [AlgorithmType.FIXED_POINT_ITERATION]: `program fixed_point
    implicit none
    real :: x, x_new, tol
    integer :: i, max_iter
    
    x = 1.5
    tol = 1e-6
    max_iter = 100
    
    do i = 1, max_iter
        x_new = g(x)
        
        if (abs(x_new - x) < tol) exit
        
        x = x_new
    end do
    
    print *, "Root: ", x_new

contains
    real function g(val)
        real, intent(in) :: val
        ! Solving x = 1 + 1/x (equivalent to x^2 - x - 1 = 0)
        g = 1.0 + 1.0/val
    end function g
end program fixed_point`,

  [AlgorithmType.GAUSSIAN]: `program gaussian_elimination
    implicit none
    integer, parameter :: n = 2
    real :: A(n, n), b(n), x(n), factor, pivot
    integer :: i, j, k
    
    A = reshape([2.0, 5.0, 1.0, 7.0], [2, 2]) ! Column-major
    b = [11.0, 13.0]
    
    ! Forward Elimination
    do k = 1, n-1
        pivot = A(k,k)
        do i = k+1, n
            factor = A(i,k) / pivot
            do j = k, n
                A(i,j) = A(i,j) - factor * A(k,j)
            end do
            b(i) = b(i) - factor * b(k)
        end do
    end do
    
    ! Back Substitution
    x(n) = b(n) / A(n,n)
    do i = n-1, 1, -1
        x(i) = (b(i) - sum(A(i,i+1:n) * x(i+1:n))) / A(i,i)
    end do
    
    print *, "Solution: ", x
end program gaussian_elimination`,

  [AlgorithmType.GAUSS_JORDAN]: `program gauss_jordan
    implicit none
    integer, parameter :: n = 2
    real :: M(n, n+1), pivot, factor
    integer :: i, j, k
    
    M(1,:) = [2.0, 1.0, 11.0]
    M(2,:) = [5.0, 7.0, 13.0]
    
    do k = 1, n
        ! Normalize
        pivot = M(k,k)
        M(k,:) = M(k,:) / pivot
        
        ! Eliminate
        do i = 1, n
            if (i /= k) then
                factor = M(i,k)
                M(i,:) = M(i,:) - factor * M(k,:)
            end if
        end do
    end do
    
    print *, "Solution: ", M(:,n+1)
end program gauss_jordan`,

  [AlgorithmType.LU_DECOMPOSITION]: `program lu_decomposition
    implicit none
    integer, parameter :: n = 3
    real :: A(n,n), L(n,n), U(n,n), sum_val
    integer :: i, j, k
    
    ! Initialize L as Identity, U as Zero
    L = 0.0
    U = 0.0
    do i=1,n
       L(i,i) = 1.0
    end do
    
    do i = 1, n
       ! Upper Triangular
       do k = i, n
          sum_val = 0.0
          do j = 1, i-1
             sum_val = sum_val + L(i,j)*U(j,k)
          end do
          U(i,k) = A(i,k) - sum_val
       end do
       
       ! Lower Triangular
       do k = i+1, n
          sum_val = 0.0
          do j = 1, i-1
             sum_val = sum_val + L(k,j)*U(j,i)
          end do
          L(k,i) = (A(k,i) - sum_val) / U(i,i)
       end do
    end do
end program lu_decomposition`,

  [AlgorithmType.CHOLESKY_DECOMPOSITION]: `program cholesky
    implicit none
    integer, parameter :: n = 3
    real :: A(n,n), L(n,n), sum_val
    integer :: i, j, k
    
    A = reshape([4.0, 12.0, -16.0, 12.0, 37.0, -43.0, -16.0, -43.0, 98.0], [3,3]) ! Col-major
    L = 0.0
    
    do i = 1, n
       do k = 1, i
          sum_val = 0.0
          do j = 1, k-1
             sum_val = sum_val + L(i,j)*L(k,j)
          end do
          
          if (i == k) then
             L(i,k) = sqrt(A(i,i) - sum_val)
          else
             L(i,k) = (1.0/L(k,k)) * (A(i,k) - sum_val)
          end if
       end do
    end do
end program cholesky`,

  [AlgorithmType.QR_DECOMPOSITION]: `program qr_decomp
    implicit none
    integer, parameter :: m = 3, n = 3
    real :: A(m,n), Q(m,n), R(n,n), v(m), r_val
    integer :: i, j
    
    ! (A initialization...)
    Q = 0.0
    R = 0.0
    
    ! Gram-Schmidt
    do j = 1, n
       v = A(:,j)
       do i = 1, j-1
          R(i,j) = dot_product(Q(:,i), A(:,j))
          v = v - R(i,j) * Q(:,i)
       end do
       R(j,j) = norm2(v)
       Q(:,j) = v / R(j,j)
    end do
end program qr_decomp`,

  [AlgorithmType.JACOBI]: `program jacobi
    implicit none
    integer, parameter :: n = 2
    real :: A(n,n), b(n), x(n), x_new(n), sum_val, tol
    integer :: i, j, k, max_iter
    
    A = reshape([4.0, 1.0, 1.0, 3.0], [2,2])
    b = [6.0, 4.0]
    x = 0.0
    tol = 1e-5
    max_iter = 100
    
    do k = 1, max_iter
        do i = 1, n
            sum_val = 0.0
            do j = 1, n
                if (i /= j) sum_val = sum_val + A(i,j)*x(j)
            end do
            x_new(i) = (b(i) - sum_val) / A(i,i)
        end do
        
        if (maxval(abs(x_new - x)) < tol) exit
        x = x_new
    end do
    print *, "Solution: ", x
end program jacobi`,

  [AlgorithmType.GAUSS_SEIDEL]: `program gauss_seidel
    implicit none
    integer, parameter :: n = 2
    real :: A(n,n), b(n), x(n), sum_val, tol
    integer :: i, j, k, max_iter
    
    A = reshape([4.0, 1.0, 1.0, 3.0], [2,2])
    b = [6.0, 4.0]
    x = 0.0
    tol = 1e-5
    max_iter = 100
    
    do k = 1, max_iter
        do i = 1, n
            sum_val = 0.0
            do j = 1, n
                if (i /= j) sum_val = sum_val + A(i,j)*x(j)
            end do
            ! In Gauss-Seidel, we overwrite x(i) immediately
            x(i) = (b(i) - sum_val) / A(i,i)
        end do
        ! Note: Convergence check simplified for snippet
    end do
    print *, "Solution: ", x
end program gauss_seidel`,

  [AlgorithmType.MATRIX_INVERSE]: `program matrix_inverse
    implicit none
    ! Basic implementation via Gauss-Jordan on Augmented Matrix
    ! Fortran normally uses LAPACK's SGETRF and SGETRI
    print *, "Use LAPACK SGETRI for efficient inversion"
end program matrix_inverse`,

  [AlgorithmType.MATRIX_DETERMINANT]: `program determinant
    implicit none
    ! Compute via LU factorization product of diagonal of U
    print *, "Det = Product of U(i,i) * (-1)^swaps"
end program determinant`,

  [AlgorithmType.MATRIX_ADDITION]: `program matrix_add
    implicit none
    integer, parameter :: n = 2
    real :: A(n,n), B(n,n), C(n,n)
    
    A = reshape([1.0, 3.0, 2.0, 4.0], [2,2])
    B = reshape([5.0, 7.0, 6.0, 8.0], [2,2])
    
    C = A + B ! Array operation
    print *, C
end program matrix_add`,

  [AlgorithmType.MATRIX_SUBTRACTION]: `program matrix_sub
    implicit none
    integer, parameter :: n = 2
    real :: A(n,n), B(n,n), C(n,n)
    
    A = reshape([1.0, 3.0, 2.0, 4.0], [2,2])
    B = reshape([5.0, 7.0, 6.0, 8.0], [2,2])
    
    C = A - B
    print *, C
end program matrix_sub`,

  [AlgorithmType.MATRIX_MULTIPLICATION]: `program matrix_mul
    implicit none
    integer, parameter :: n = 2
    real :: A(n,n), B(n,n), C(n,n)
    
    A = reshape([1.0, 3.0, 2.0, 4.0], [2,2])
    B = reshape([5.0, 7.0, 6.0, 8.0], [2,2])
    
    C = matmul(A, B) ! Intrinsic function
    print *, C
end program matrix_mul`,

  [AlgorithmType.MATRIX_TRANSPOSE]: `program matrix_transpose
    implicit none
    integer, parameter :: n = 2
    real :: A(n,n), T(n,n)
    
    A = reshape([1.0, 3.0, 2.0, 4.0], [2,2])
    
    T = transpose(A) ! Intrinsic function
    print *, T
end program matrix_transpose`,

  [AlgorithmType.LAGRANGE]: `program lagrange
    implicit none
    integer, parameter :: n = 4
    real :: x(n), y(n), xi, result, term
    integer :: i, j
    
    x = [0.0, 1.0, 2.0, 5.0]
    y = [2.0, 3.0, 12.0, 147.0]
    xi = 3.0
    result = 0.0
    
    do i = 1, n
        term = y(i)
        do j = 1, n
            if (i /= j) then
                term = term * (xi - x(j)) / (x(i) - x(j))
            end if
        end do
        result = result + term
    end do
    
    print *, "Interpolated value: ", result
end program lagrange`,

  [AlgorithmType.NEWTON_DIVIDED_DIFFERENCE]: `program newton_dd
    implicit none
    integer, parameter :: n = 4
    real :: x(n), y(n), coef(n), xi, result
    integer :: i, j
    
    x = [0.0, 1.0, 2.0, 5.0]
    y = [2.0, 3.0, 12.0, 147.0]
    xi = 3.0
    
    coef = y
    
    ! Divided differences
    do j = 2, n
        do i = n, j, -1
            coef(i) = (coef(i) - coef(i-1)) / (x(i) - x(i-j+1))
        end do
    end do
    
    ! Evaluate
    result = coef(n)
    do i = n-1, 1, -1
        result = result * (xi - x(i)) + coef(i)
    end do
    
    print *, "Result: ", result
end program newton_dd`,

  [AlgorithmType.LINEAR_SPLINE]: `program linear_spline
    implicit none
    integer, parameter :: n = 4
    real :: x(n), y(n), xi, slope, result
    integer :: i
    
    x = [1.0, 2.0, 3.0, 4.0]
    y = [1.0, 4.0, 9.0, 16.0]
    xi = 2.5
    
    do i = 1, n-1
        if (xi >= x(i) .and. xi <= x(i+1)) then
            slope = (y(i+1) - y(i)) / (x(i+1) - x(i))
            result = y(i) + slope * (xi - x(i))
            print *, "Result: ", result
            exit
        end if
    end do
end program linear_spline`,

  [AlgorithmType.QUADRATIC_SPLINE]: `program quadratic_spline
    ! Simplified example for fixed array size
    ! Use allocatable arrays for general case
    implicit none
    integer, parameter :: n = 3 ! Number of intervals
    real :: x(4), y(4), a(3), b(3), c(3), xi, result, dx
    integer :: i
    
    x = [0.0, 1.0, 2.0, 3.0]
    y = [0.0, 1.0, 4.0, 9.0]
    xi = 1.5
    
    ! Assume a(1) = 0
    a(1) = 0.0
    b(1) = (y(2) - y(1)) / (x(2) - x(1))
    c(1) = y(1)
    
    do i = 2, n
        ! Continuity of derivative
        b(i) = 2*a(i-1)*(x(i)-x(i-1)) + b(i-1)
        c(i) = y(i)
        ! Continuity of function
        a(i) = (y(i+1) - y(i) - b(i)*(x(i+1)-x(i))) / ((x(i+1)-x(i))**2)
    end do
    
    ! Evaluate
    do i = 1, n
        if (xi >= x(i) .and. xi <= x(i+1)) then
            dx = xi - x(i)
            result = a(i)*dx**2 + b(i)*dx + c(i)
            print *, "Result: ", result
            exit
        end if
    end do
end program quadratic_spline`,

  [AlgorithmType.CUBIC_SPLINE]: `! Fortran often uses LAPACK for solving the tridiagonal system
! required for Cubic Splines. This is a conceptual snippet.
program cubic_spline_concept
    implicit none
    ! ... Define tridiagonal matrix solver ...
    ! ... Build system Ax=b for second derivatives ...
    print *, "Requires linear algebra solver for coefficients"
end program cubic_spline_concept`,

  [AlgorithmType.NEWTON_FORWARD_DIFFERENCE]: `program newton_forward
    implicit none
    integer, parameter :: n = 4
    real :: x(n), y(n), diff(n,n), xi, h, u, u_term, fact, result
    integer :: i, j
    
    x = [0.0, 1.0, 2.0, 3.0]
    y = [1.0, 2.0, 9.0, 28.0]
    xi = 1.5
    h = x(2) - x(1)
    
    diff(:,1) = y
    
    do j = 2, n
        do i = 1, n-j+1
            diff(i,j) = diff(i+1,j-1) - diff(i,j-1)
        end do
    end do
    
    u = (xi - x(1)) / h
    result = diff(1,1)
    u_term = 1.0
    fact = 1.0
    
    do i = 2, n
        u_term = u_term * (u - (i-2))
        fact = fact * (i-1)
        result = result + (u_term * diff(1,i)) / fact
    end do
    
    print *, "Result: ", result
end program newton_forward`,

  [AlgorithmType.NEWTON_BACKWARD_DIFFERENCE]: `program newton_backward
    implicit none
    integer, parameter :: n = 4
    real :: x(n), y(n), diff(n,n), xi, h, u, u_term, fact, result
    integer :: i, j
    
    x = [0.0, 1.0, 2.0, 3.0]
    y = [1.0, 2.0, 9.0, 28.0]
    xi = 2.5
    h = x(2) - x(1)
    
    diff(:,1) = y
    
    do j = 2, n
        do i = n, j, -1
            diff(i,j) = diff(i,j-1) - diff(i-1,j-1)
        end do
    end do
    
    u = (xi - x(n)) / h
    result = diff(n,1)
    u_term = 1.0
    fact = 1.0
    
    do i = 2, n
        u_term = u_term * (u + (i-1))
        fact = fact * i
        result += (u_term * diff(n,i)) / fact
    end do
    
    print *, "Result: ", result
end program newton_backward`,

  [AlgorithmType.GAUSS_FORWARD_INTERPOLATION]: `program gauss_forward
    implicit none
    integer, parameter :: n = 5
    real :: x(n), y(n), diff(n,n), xi, h, u, u_term, fact, result
    integer :: i, j, mid, idx
    
    x = [21., 25., 29., 33., 37.]
    y = [18.47, 17.81, 17.10, 16.34, 15.51]
    xi = 30.0
    
    h = x(2) - x(1)
    mid = n / 2 + 1 ! Central index (1-based)
    
    diff(:,1) = y
    
    do j = 2, n
        do i = 1, n-j+1
            diff(i,j) = diff(i+1,j-1) - diff(i,j-1)
        end do
    end do
    
    u = (xi - x(mid)) / h
    result = diff(mid, 1)
    u_term = 1.0
    fact = 1.0
    
    do i = 2, n
        if (mod(i-1, 2) == 0) then
            u_term = u_term * (u - (i-1)/2)
        else
            u_term = u_term * (u + (i-1)/2)
        end if
        
        fact = fact * (i-1)
        idx = mid - ((i-1)/2)
        
        if (idx >= 1 .and. idx <= n-(i-1)+1) then
            result = result + (u_term * diff(idx, i)) / fact
        end if
    end do
    
    print *, "Result: ", result
end program gauss_forward`,

  [AlgorithmType.GAUSS_BACKWARD_INTERPOLATION]: `program gauss_backward
    implicit none
    integer, parameter :: n = 5
    real :: x(n), y(n), diff(n,n), xi, h, u, u_term, fact, result
    integer :: i, j, mid, idx
    
    x = [21., 25., 29., 33., 37.]
    y = [18.47, 17.81, 17.10, 16.34, 15.51]
    xi = 30.0
    
    h = x(2) - x(1)
    mid = n / 2 + 1 ! Central index
    
    diff(:,1) = y
    
    do j = 2, n
        do i = 1, n-j+1
            diff(i,j) = diff(i+1,j-1) - diff(i,j-1)
        end do
    end do
    
    u = (xi - x(mid)) / h
    result = diff(mid, 1)
    u_term = 1.0
    fact = 1.0
    
    do i = 2, n
        if (mod(i-1, 2) == 0) then
            u_term = u_term * (u + (i-1)/2)
        else
            u_term = u_term * (u - (i-1)/2)
        end if
        
        fact = fact * (i-1)
        idx = mid - (i/2)
        
        if (idx >= 1 .and. idx <= n-(i-1)+1) then
            result = result + (u_term * diff(idx, i)) / fact
        end if
    end do
    
    print *, "Result: ", result
end program gauss_backward`,

  [AlgorithmType.SIMPSON]: `program simpson
    implicit none
    real :: a, b, h, integral, k
    integer :: n, i
    
    a = 0.0
    b = 1.0
    n = 10
    h = (b - a) / n
    
    integral = f(a) + f(b)
    
    do i = 1, n-1
        k = a + i * h
        if (mod(i, 2) == 0) then
            integral = integral + 2 * f(k)
        else
            integral = integral + 4 * f(k)
        end if
    end do
    
    integral = integral * h / 3.0
    print *, "Result: ", integral

contains
    real function f(x)
        real, intent(in) :: x
        f = x**2
    end function f
end program simpson`,

  [AlgorithmType.TRAPEZOIDAL]: `program trapezoidal
    implicit none
    real :: a, b, h, integral, k
    integer :: n, i
    
    a = 0.0
    b = 1.0
    n = 10
    h = (b - a) / n
    
    integral = f(a) + f(b)
    
    do i = 1, n-1
        k = a + i * h
        integral = integral + 2 * f(k)
    end do
    
    integral = integral * h / 2.0
    print *, "Result: ", integral

contains
    real function f(x)
        real, intent(in) :: x
        f = x**3
    end function f
end program trapezoidal`,

  [AlgorithmType.FORWARD_DIFFERENCE]: `program forward_diff
    implicit none
    real :: x, h, df
    
    x = 2.0
    h = 0.0001
    
    df = (f(x+h) - f(x)) / h
    print *, "f'(x) ≈ ", df

contains
    real function f(x)
        real, intent(in) :: x
        f = x**2
    end function f
end program forward_diff`,

  [AlgorithmType.BACKWARD_DIFFERENCE]: `program backward_diff
    implicit none
    real :: x, h, df
    
    x = 2.0
    h = 0.0001
    
    df = (f(x) - f(x-h)) / h
    print *, "f'(x) ≈ ", df

contains
    real function f(x)
        real, intent(in) :: x
        f = x**2
    end function f
end program backward_diff`,

  [AlgorithmType.CENTRAL_DIFFERENCE]: `program central_diff
    implicit none
    real :: x, h, df
    
    x = 2.0
    h = 0.0001
    
    df = (f(x+h) - f(x-h)) / (2.0 * h)
    print *, "f'(x) ≈ ", df

contains
    real function f(x)
        real, intent(in) :: x
        f = x**2
    end function f
end program central_diff`,

  [AlgorithmType.SECOND_DERIVATIVE_CENTRAL]: `program second_diff_central
    implicit none
    real :: x, h, d2f
    
    x = 2.0
    h = 0.0001
    
    d2f = (f(x+h) - 2.0*f(x) + f(x-h)) / (h**2)
    print *, "f''(x) ≈ ", d2f

contains
    real function f(x)
        real, intent(in) :: x
        f = x**3
    end function f
end program second_diff_central`,

  [AlgorithmType.EULER]: `program euler
    implicit none
    real :: x, y, h, x_end
    
    x = 0.0
    y = 1.0
    h = 0.1
    x_end = 1.0
    
    print *, "x", "y"
    print *, x, y
    
    do while (x < x_end - h/100.0)
        y = y + h * (x + y)
        x = x + h
        print *, x, y
    end do
end program euler`,

  [AlgorithmType.RK4]: `program rk4
    implicit none
    real :: x, y, h, x_end, k1, k2, k3, k4
    
    x = 0.0
    y = 1.0
    h = 0.1
    x_end = 2.0
    
    print *, "x", "y"
    print *, x, y
    
    do while (x < x_end - h/100.0)
        k1 = h * f(x, y)
        k2 = h * f(x + h/2.0, y + k1/2.0)
        k3 = h * f(x + h/2.0, y + k2/2.0)
        k4 = h * f(x + h, y + k3)
        
        y = y + (k1 + 2*k2 + 2*k3 + k4) / 6.0
        x = x + h
        print *, x, y
    end do

contains
    real function f(x, y)
        real, intent(in) :: x, y
        f = x - y
    end function f
end program rk4`,
};

export const SAMPLE_FUNCTIONS = [
  { label: 'x² - 4', value: 'x^2 - 4', root: [-2, 2] },
  { label: 'x³ - x - 2', value: 'x^3 - x - 2', root: [1.521] },
  { label: 'sin(x)', value: 'sin(x)', root: [0, 3.14159] },
  { label: 'e^x - 3x', value: 'e^x - 3x', root: [0.619, 1.512] },
];

export const THEORY_CONTENT: Record<AlgorithmType, TheoryData> = {
  [AlgorithmType.BISECTION]: {
    title: "Bisection Method",
    concept: "The Bisection Method is a robust, bracketing method for finding a root of a continuous function f(x). It works by repeatedly dividing an interval [a, b] in half and selecting the subinterval in which the function changes sign. This guarantees convergence to a root if f(a) and f(b) have opposite signs.",
    formula: "c = (a + b) / 2",
    convergence: "Linear convergence. It is relatively slow but very reliable. The error halves at each step (1 bit of precision gained per iteration).",
    steps: [
      "Choose initial interval [a, b] such that f(a) * f(b) < 0.",
      "Calculate midpoint c = (a + b) / 2.",
      "Calculate f(c).",
      "If f(c) is close to 0, stop.",
      "If f(a) * f(c) < 0, the root lies in [a, c]. Set b = c.",
      "Otherwise, the root lies in [c, b]. Set a = c.",
      "Repeat until convergence."
    ]
  },
  [AlgorithmType.FALSE_POSITION]: {
    title: "False Position Method (Regula Falsi)",
    concept: "Similar to Bisection, False Position is a bracketing method. However, instead of using the midpoint, it uses the root of the secant line connecting (a, f(a)) and (b, f(b)) as the next approximation. This usually results in faster convergence than bisection because it takes the magnitude of f(x) into account.",
    formula: "c = (a * f(b) - b * f(a)) / (f(b) - f(a))",
    convergence: "Generally linear, but often faster than bisection. In some cases (convex/concave functions), one endpoint can get stuck, slowing it down to linear.",
    steps: [
      "Choose [a, b] such that f(a) * f(b) < 0.",
      "Calculate the intersection of the secant line with the x-axis: c = (a*f(b) - b*f(a)) / (f(b) - f(a)).",
      "Evaluate f(c).",
      "If f(c) ≈ 0, stop.",
      "Replace the bracket limit that has the same sign as f(c) with c.",
      "Repeat."
    ]
  },
  [AlgorithmType.NEWTON_RAPHSON]: {
    title: "Newton-Raphson Method",
    concept: "An open method that uses the tangent line of the function at the current guess to estimate the root. It requires the derivative f'(x) to be known.",
    formula: "x_{n+1} = x_n - f(x_n) / f'(x_n)",
    convergence: "Quadratic convergence near the root (number of correct digits doubles every iteration). However, it may diverge if the initial guess is poor or if f'(x) ≈ 0.",
    steps: [
      "Choose initial guess x0.",
      "Calculate f(x0) and f'(x0).",
      "Compute next approximation: x1 = x0 - f(x0)/f'(x0).",
      "Check relative error |x1 - x0|.",
      "Repeat until error is within tolerance."
    ]
  },
  [AlgorithmType.SECANT]: {
    title: "Secant Method",
    concept: "The Secant Method is an open method similar to Newton-Raphson but does not require the analytical derivative. It approximates the derivative using a finite difference based on two previous points.",
    formula: "x_{n+1} = x_n - f(x_n) * (x_n - x_{n-1}) / (f(x_n) - f(x_{n-1}))",
    convergence: "Superlinear convergence (Golden Ratio φ ≈ 1.618). Faster than Bisection/False Position but slower than Newton-Raphson.",
    steps: [
      "Choose two initial points x0 and x1.",
      "Calculate f(x0) and f(x1).",
      "Apply the secant formula to find x2.",
      "Update points: x0 = x1, x1 = x2.",
      "Repeat until |x1 - x0| is within tolerance."
    ]
  },
  [AlgorithmType.FIXED_POINT_ITERATION]: {
    title: "Fixed Point Iteration",
    concept: "Also known as Method of Successive Approximations. It rearranges the equation f(x) = 0 into the form x = g(x). Finding the root corresponds to finding the intersection of y = x and y = g(x). Convergence is guaranteed if |g'(x)| < 1 near the root.",
    formula: "x_{i+1} = g(x_i)",
    convergence: "Linear convergence. The rate depends on the magnitude of g'(x). If |g'(x)| is close to 0, it is fast; if close to 1, it is slow.",
    steps: [
      "Rearrange f(x) = 0 into x = g(x).",
      "Choose initial guess x0.",
      "Compute x1 = g(x0).",
      "Calculate relative error |(x1 - x0)/x1|.",
      "Set x0 = x1 and repeat until error is within tolerance."
    ]
  },
  [AlgorithmType.GAUSSIAN]: {
    title: "Gaussian Elimination",
    concept: "A direct method for solving systems of linear equations of the form Ax = b. It employs row operations to transform the matrix A into an upper triangular matrix (forward elimination), and then solves for variables via back substitution.",
    formula: "Row Operations: R_i = R_i - (A_{i,k}/A_{k,k}) * R_k",
    convergence: "Exact solution (ignoring round-off errors) in finite steps.",
    steps: [
      "Form the augmented matrix [A|b].",
      "Forward Elimination: Convert to upper triangular form (Row Echelon Form) using pivots.",
      "Back Substitution: Solve for variables starting from the last equation (x_n) up to the first (x_1)."
    ]
  },
  [AlgorithmType.GAUSS_JORDAN]: {
    title: "Gauss-Jordan Elimination",
    concept: "An extension of Gaussian Elimination that reduces the matrix to Reduced Row Echelon Form (diagonal matrix). This eliminates the need for back substitution, as each variable is solved directly.",
    formula: "Normalize R_k, then eliminate all other R_i using pivot R_k",
    convergence: "Exact solution in finite steps.",
    steps: [
      "Form the augmented matrix [A|b].",
      "For each column k, normalize the pivot row so A[k][k] = 1.",
      "Eliminate all other entries in column k (both above and below) to make them 0.",
      "The final column of the augmented matrix contains the solution vector x."
    ]
  },
  [AlgorithmType.LU_DECOMPOSITION]: {
    title: "LU Decomposition",
    concept: "A method that factors a matrix A into the product of a lower triangular matrix L and an upper triangular matrix U (A = LU). It is highly efficient for solving multiple systems with the same coefficient matrix A but different vectors b.",
    formula: "A = LU, then solve Ly = b and Ux = y",
    convergence: "Exact solution in finite steps.",
    steps: [
      "Decompose A into L (Lower Triangular) and U (Upper Triangular) using Doolittle or Crout algorithm.",
      "Forward Substitution: Solve Ly = b for y.",
      "Backward Substitution: Solve Ux = y for x."
    ]
  },
  [AlgorithmType.CHOLESKY_DECOMPOSITION]: {
    title: "Cholesky Decomposition",
    concept: "A decomposition of a symmetric, positive-definite matrix A into the product of a lower triangular matrix L and its transpose (A = LL^T). It is roughly twice as efficient as LU decomposition for solving systems involving symmetric positive-definite matrices.",
    formula: "L_{ii} = sqrt(A_{ii} - Σ L_{ik}^2), L_{ji} = (1/L_{ii}) * (A_{ji} - Σ L_{jk}L_{ik})",
    convergence: "Exact solution. Fails if matrix is not positive definite (sqrt of negative number).",
    steps: [
      "Iterate through rows i and columns j.",
      "For diagonal elements, subtract sum of squared previous elements in row from A[i][i] and take square root.",
      "For off-diagonal elements, subtract dot product of previous row elements, then divide by diagonal element.",
      "Result is Lower Triangular L. A = L * L^T."
    ]
  },
  [AlgorithmType.QR_DECOMPOSITION]: {
    title: "QR Decomposition",
    concept: "Factors a matrix A into an orthogonal matrix Q and an upper triangular matrix R (A = QR). It is numerically stable and widely used for solving least squares problems and computing eigenvalues.",
    formula: "Using Gram-Schmidt: u_k = a_k - Σ proj_{u_j} a_k, e_k = u_k / ||u_k||",
    convergence: "Exact solution.",
    steps: [
      "For each column of A, subtract components in directions of previous orthonormal vectors (Gram-Schmidt process).",
      "Normalize the resulting vector to get column of Q.",
      "R elements are dot products of Q columns and A columns.",
      "Result: A = Q * R."
    ]
  },
  [AlgorithmType.JACOBI]: {
    title: "Jacobi Iteration",
    concept: "An iterative algorithm for determining the solutions of a diagonally dominant system of linear equations. Each diagonal element is solved for, and an approximate value is plugged in. The Jacobian method uses values from the previous iteration.",
    formula: "x_i^{(k+1)} = (1/a_{ii}) * (b_i - Σ_{j≠i} a_{ij} x_j^{(k)})",
    convergence: "Converges if the matrix is strictly diagonally dominant. Linear convergence rate.",
    steps: [
      "Guess an initial solution x (usually 0).",
      "For each variable x_i, solve the i-th equation using values from the previous iteration.",
      "Update x and repeat until the relative error is within tolerance."
    ]
  },
  [AlgorithmType.GAUSS_SEIDEL]: {
    title: "Gauss-Seidel Iteration",
    concept: "An iterative method similar to Jacobi, but it uses the most recently computed values for x_i within the same iteration step. This typically results in faster convergence.",
    formula: "x_i^{(k+1)} = (1/a_{ii}) * (b_i - Σ_{j<i} a_{ij} x_j^{(k+1)} - Σ_{j>i} a_{ij} x_j^{(k)})",
    convergence: "Converges for symmetric positive-definite or strictly diagonally dominant matrices. Usually 2x faster than Jacobi.",
    steps: [
      "Guess an initial solution x.",
      "For each variable x_i, solve using the most up-to-date values of other variables.",
      "Repeat until convergence."
    ]
  },
  [AlgorithmType.MATRIX_INVERSE]: {
    title: "Matrix Inversion",
    concept: "Finding the inverse of a square matrix A, denoted A⁻¹, such that A * A⁻¹ = I (Identity Matrix). Commonly computed using Gauss-Jordan elimination on the augmented matrix [A|I].",
    formula: "A * A⁻¹ = I",
    convergence: "Exact solution. Requires A to be non-singular (determinant ≠ 0).",
    steps: [
      "Form the augmented matrix [A | I], where I is the identity matrix.",
      "Apply Gauss-Jordan elimination to transform the left side A into I.",
      "The right side, which started as I, transforms into A⁻¹."
    ]
  },
  [AlgorithmType.MATRIX_DETERMINANT]: {
    title: "Matrix Determinant",
    concept: "A scalar value that is a function of the entries of a square matrix. It characterizes some properties of the matrix and the linear map represented by the matrix. Geometrically, it represents the scaling factor of the volume/area.",
    formula: "det(A) = Σ (-1)^σ * Π A_{i,σ_i}",
    convergence: "Exact calculation.",
    steps: [
      "Use Gaussian Elimination to convert matrix A into an Upper Triangular Matrix U.",
      "Keep track of row swaps (each swap multiplies determinant by -1).",
      "The determinant is the product of the diagonal elements of U, adjusted for swaps."
    ]
  },
  [AlgorithmType.MATRIX_ADDITION]: {
    title: "Matrix Addition",
    concept: "Adds two matrices of the same dimensions by adding corresponding elements together.",
    formula: "C_{ij} = A_{ij} + B_{ij}",
    convergence: "Exact calculation.",
    steps: [
      "Check if Matrix A and Matrix B have the same dimensions.",
      "Iterate through each element (i, j).",
      "Sum A[i][j] and B[i][j] to get C[i][j]."
    ]
  },
  [AlgorithmType.MATRIX_SUBTRACTION]: {
    title: "Matrix Subtraction",
    concept: "Subtracts Matrix B from Matrix A (both of the same dimensions) by subtracting corresponding elements.",
    formula: "C_{ij} = A_{ij} - B_{ij}",
    convergence: "Exact calculation.",
    steps: [
      "Check if Matrix A and Matrix B have the same dimensions.",
      "Iterate through each element (i, j).",
      "Subtract B[i][j] from A[i][j] to get C[i][j]."
    ]
  },
  [AlgorithmType.MATRIX_MULTIPLICATION]: {
    title: "Matrix Multiplication",
    concept: "Multiplies two matrices A and B. The number of columns in A must equal the number of rows in B. The element at row i and column j of the product is the dot product of the ith row of A and the jth column of B.",
    formula: "C_{ij} = Σ_k A_{ik} * B_{kj}",
    convergence: "Exact calculation.",
    steps: [
      "Check if columns(A) == rows(B).",
      "Initialize result matrix C with dimensions rows(A) x cols(B).",
      "For each element C[i][j], compute the sum of products A[i][k] * B[k][j]."
    ]
  },
  [AlgorithmType.MATRIX_TRANSPOSE]: {
    title: "Matrix Transpose",
    concept: "Flips a matrix over its diagonal. The row and column indices of each element are switched.",
    formula: "B_{ij} = A_{ji}",
    convergence: "Exact calculation.",
    steps: [
      "Create a new matrix B with dimensions cols(A) x rows(A).",
      "For each element at A[i][j], place it at B[j][i]."
    ]
  },
  [AlgorithmType.LAGRANGE]: {
    title: "Lagrange Interpolation",
    concept: "A polynomial interpolation method that constructs a polynomial of degree n-1 passing exactly through n data points. It is useful for theoretical analysis but can be computationally expensive to add new points.",
    formula: "P(x) = Σ (y_i * L_i(x)), where L_i(x) = Π ((x - x_j)/(x_i - x_j)) for j ≠ i",
    convergence: "Exact for the given points. Accuracy depends on the spacing of nodes (Runge's phenomenon can occur with equidistant points).",
    steps: [
      "For each point i, construct the basis polynomial L_i(x).",
      "L_i(x) is 1 at x_i and 0 at all other x_j.",
      "Multiply each L_i(x) by the corresponding y_i.",
      "Sum all terms to get the final polynomial P(x)."
    ]
  },
  [AlgorithmType.NEWTON_DIVIDED_DIFFERENCE]: {
    title: "Newton's Divided Difference Interpolation",
    concept: "An interpolation method that builds the polynomial using divided differences. It produces the same polynomial as Lagrange but in a form that is easier to update when new points are added.",
    formula: "P(x) = f[x0] + Σ f[x0,...,xk] * Π(x - xi) from i=0 to k-1",
    convergence: "Exact for the given points. Offers better numerical stability than solving the Vandermonde matrix directly.",
    steps: [
      "Construct the Divided Difference Table using recursive relations.",
      "The coefficients of the polynomial are the diagonal entries of the table.",
      "Construct polynomial using these coefficients and the basis (x-x0)(x-x1)..."
    ]
  },
  [AlgorithmType.LINEAR_SPLINE]: {
    title: "Linear Spline Interpolation",
    concept: "A method of interpolation where the interpolant is a piece-wise linear function. It connects adjacent data points with straight lines.",
    formula: "S(x) = y_i + (y_{i+1} - y_i)/(x_{i+1} - x_i) * (x - x_i) for x in [x_i, x_{i+1}]",
    convergence: "Error O(h^2). The curve is continuous but the derivative is discontinuous at the knots (data points).",
    steps: [
      "Sort data points by x.",
      "Find the interval [x_i, x_{i+1}] containing the query point x.",
      "Calculate the equation of the line connecting (x_i, y_i) and (x_{i+1}, y_{i+1}).",
      "Evaluate the line equation at x."
    ]
  },
  [AlgorithmType.QUADRATIC_SPLINE]: {
    title: "Quadratic Spline Interpolation",
    concept: "A spline interpolation where each subinterval is approximated by a quadratic polynomial (parabola). It ensures continuity of the function and its first derivative at the knots.",
    formula: "S_i(x) = a_i(x-x_i)^2 + b_i(x-x_i) + c_i",
    convergence: "Error O(h^3). Provides a smooth curve, but typically requires one extra boundary condition (e.g., assuming first segment is linear or minimum curvature).",
    steps: [
      "For n+1 points, we have n intervals and 3n unknowns.",
      "2n equations from matching function values at interval ends.",
      "n-1 equations from matching first derivatives at interior knots.",
      "Assume a_0 = 0 (first segment is linear) to close the system.",
      "Solve recursively for coefficients."
    ]
  },
  [AlgorithmType.CUBIC_SPLINE]: {
    title: "Cubic Spline Interpolation",
    concept: "The most common spline method. It uses cubic polynomials for each interval, ensuring continuity of the function, first derivative, and second derivative at interior knots. 'Natural' cubic spline assumes zero second derivative at endpoints.",
    formula: "S_i(x) = a_i(x-x_i)^3 + b_i(x-x_i)^2 + c_i(x-x_i) + d_i",
    convergence: "Error O(h^4). Very smooth and minimizes oscillation compared to high-degree polynomial interpolation.",
    steps: [
      "Set up a tridiagonal linear system based on the continuity of second derivatives.",
      "Solve the system (often using Thomas Algorithm) to find the second derivative values (moments) at each knot.",
      "Compute coefficients a_i, b_i, c_i, d_i from these moments.",
      "Evaluate the cubic polynomial for the corresponding interval."
    ]
  },
  [AlgorithmType.NEWTON_FORWARD_DIFFERENCE]: {
    title: "Newton's Forward Difference",
    concept: "An interpolation method specifically designed for equally spaced data points. It uses forward difference operators (Δ) and is most accurate for interpolating values near the beginning of the data set.",
    formula: "P(x) = y_0 + uΔy_0 + u(u-1)/2! Δ²y_0 + ... where u = (x - x_0) / h",
    convergence: "Exact for polynomial data. For other functions, error depends on step size h and higher order derivatives.",
    steps: [
      "Ensure x points are equally spaced by h.",
      "Construct a forward difference table where Δy_i = y_{i+1} - y_i.",
      "Calculate u = (x - x_0) / h.",
      "Compute the polynomial value using the formula involving binomial coefficients."
    ]
  },
  [AlgorithmType.NEWTON_BACKWARD_DIFFERENCE]: {
    title: "Newton's Backward Difference",
    concept: "Similar to Forward Difference but designed for interpolating values near the end of an equally spaced data set. It uses backward difference operators (∇).",
    formula: "P(x) = y_n + u∇y_n + u(u+1)/2! ∇²y_n + ... where u = (x - x_n) / h",
    convergence: "Same as Forward Difference. Best used when the target x is near the end of the tabulated values.",
    steps: [
      "Ensure x points are equally spaced by h.",
      "Construct a backward difference table where ∇y_i = y_i - y_{i-1}.",
      "Calculate u = (x - x_n) / h.",
      "Compute the polynomial using the backward formula."
    ]
  },
  [AlgorithmType.GAUSS_FORWARD_INTERPOLATION]: {
    title: "Gauss Forward Interpolation",
    concept: "A central difference interpolation method for equally spaced data. It uses the central difference table but follows a 'zig-zag' path starting from the central value y0 and going downwards then upwards (y0 -> Δy0 -> Δ²y-1 -> Δ³y-1...). It is best used for interpolating near the center of the table, specifically when 0 ≤ u ≤ 0.5.",
    formula: "y_p = y_0 + uΔy_0 + u(u-1)/2! Δ²y_{-1} + (u+1)u(u-1)/3! Δ³y_{-1} + ...",
    convergence: "Higher accuracy near the central values compared to Newton Forward/Backward.",
    steps: [
      "Identify the central value x0 (midpoint of data).",
      "Calculate u = (x - x0) / h.",
      "Form the central difference table.",
      "Sum the terms using the specific zig-zag pattern of coefficients from the table."
    ]
  },
  [AlgorithmType.GAUSS_BACKWARD_INTERPOLATION]: {
    title: "Gauss Backward Interpolation",
    concept: "Similar to Gauss Forward but starts the path going upwards. The path is y0 -> Δy-1 -> Δ²y-1 -> Δ³y-2... It is best used for interpolating values slightly to the left of the center, specifically when -0.5 ≤ u ≤ 0.",
    formula: "y_p = y_0 + uΔy_{-1} + (u+1)u/2! Δ²y_{-1} + (u+1)u(u-1)/3! Δ³y_{-2} + ...",
    convergence: "Ideally suited for u between -0.5 and 0.",
    steps: [
      "Identify the central value x0.",
      "Calculate u = (x - x0) / h.",
      "Form the difference table.",
      "Sum the terms using the upward zig-zag pattern."
    ]
  },
  [AlgorithmType.SIMPSON]: {
    title: "Simpson's 1/3 Rule",
    concept: "A numerical integration technique that approximates the function using quadratic polynomials (parabolas) over subintervals. It requires an even number of segments.",
    formula: "I ≈ (h/3) * [f(x_0) + 4Σf(x_odd) + 2Σf(x_even) + f(x_n)]",
    convergence: "Order 4 accuracy (Error O(h^4)). Significantly more accurate than Trapezoidal rule for smooth functions.",
    steps: [
      "Divide interval [a, b] into n even segments with width h = (b-a)/n.",
      "Sum endpoints: f(a) + f(b).",
      "Add 4 * sum of function values at odd indices.",
      "Add 2 * sum of function values at even indices.",
      "Multiply total by h/3."
    ]
  },
  [AlgorithmType.TRAPEZOIDAL]: {
    title: "Trapezoidal Rule",
    concept: "A numerical integration method that approximates the area under a curve by dividing it into trapezoids connecting the function values at subinterval endpoints.",
    formula: "I ≈ (h/2) * [f(x_0) + 2Σf(x_i) + f(x_n)]",
    convergence: "Order 2 accuracy (Error O(h^2)). Simple but less accurate than Simpson's rule.",
    steps: [
      "Divide interval [a, b] into n segments with width h = (b-a)/n.",
      "Sum endpoints: f(a) + f(b).",
      "Sum all intermediate points f(x_i) and multiply by 2.",
      "Add these values and multiply entire sum by h/2."
    ]
  },
  [AlgorithmType.FORWARD_DIFFERENCE]: {
    title: "Forward Difference",
    concept: "A simple numerical differentiation technique that approximates the derivative of a function using the slope of the line passing through x and x + h.",
    formula: "f'(x) ≈ (f(x + h) - f(x)) / h",
    convergence: "O(h) accuracy (First order). Accuracy increases as h decreases, but rounding errors limit the precision for extremely small h.",
    steps: [
      "Choose a point x and a small step size h.",
      "Evaluate function at x and x + h.",
      "Apply the difference formula to calculate the approximate slope."
    ]
  },
  [AlgorithmType.BACKWARD_DIFFERENCE]: {
    title: "Backward Difference",
    concept: "Approximates the derivative at x using information from the point x and a point behind it, x - h.",
    formula: "f'(x) ≈ (f(x) - f(x - h)) / h",
    convergence: "O(h) accuracy (First order). Used when information about the function is only available for points prior to x.",
    steps: [
      "Evaluate function at x and x - h.",
      "Divide the difference by h."
    ]
  },
  [AlgorithmType.CENTRAL_DIFFERENCE]: {
    title: "Central Difference",
    concept: "A more accurate first-order derivative approximation that uses points both ahead of and behind x (x+h and x-h).",
    formula: "f'(x) ≈ (f(x + h) - f(x - h)) / (2h)",
    convergence: "O(h²) accuracy (Second order). Generally significantly more accurate than forward or backward differences for the same h.",
    steps: [
      "Evaluate function at x + h and x - h.",
      "Divide the difference by 2 * h."
    ]
  },
  [AlgorithmType.SECOND_DERIVATIVE_CENTRAL]: {
    title: "Second Derivative (Central)",
    concept: "A central difference approximation for the second derivative of a function at a point x.",
    formula: "f''(x) ≈ (f(x + h) - 2f(x) + f(x - h)) / h²",
    convergence: "O(h²) accuracy. Provides information about the curvature of the function.",
    steps: [
      "Evaluate function at x - h, x, and x + h.",
      "Combine the values in the numerator using weights [1, -2, 1].",
      "Divide the result by the square of the step size h."
    ]
  },
  [AlgorithmType.EULER]: {
    title: "Euler's Method",
    concept: "The simplest method for solving initial value problems of ordinary differential equations (ODEs). It uses the derivative at the current point to linearly extrapolate to the next point.",
    formula: "y_{n+1} = y_n + h * f(x_n, y_n)",
    convergence: "Global error is O(h) (First order). Requires very small step sizes for decent accuracy.",
    steps: [
      "Start with initial condition (x0, y0) and step size h.",
      "Calculate slope k = f(x0, y0).",
      "Update y: y1 = y0 + h * k.",
      "Update x: x1 = x0 + h.",
      "Repeat for desired number of steps."
    ]
  },
  [AlgorithmType.RK4]: {
    title: "Runge-Kutta 4th Order (RK4)",
    concept: "A widely used, highly accurate method for solving ODEs. It estimates the slope using a weighted average of four slopes calculated at different points within the step interval.",
    formula: "y_{n+1} = y_n + (h/6)(k_1 + 2k_2 + 2k_3 + k_4)",
    convergence: "Global error is O(h^4) (Fourth order). excellent balance between computational cost and accuracy.",
    steps: [
      "Calculate k1 = f(x_n, y_n) (Slope at start).",
      "Calculate k2 = f(x_n + h/2, y_n + h*k1/2) (Slope at midpoint using k1).",
      "Calculate k3 = f(x_n + h/2, y_n + h*k2/2) (Slope at midpoint using k2).",
      "Calculate k4 = f(x_n + h, y_n + h*k3) (Slope at end).",
      "Combine: y_{n+1} = y_n + (h/6)*(k1 + 2k2 + 2k3 + k4)."
    ]
  }
};

export const SAMPLE_FUNCTIONS_DIFF = [
  { label: 'x²', value: 'x^2', derivative: '2x' },
  { label: 'sin(x)', value: 'sin(x)', derivative: 'cos(x)' },
  { label: 'e^x', value: 'exp(x)', derivative: 'exp(x)' },
  { label: 'ln(x)', value: 'log(x)', derivative: '1/x' },
];