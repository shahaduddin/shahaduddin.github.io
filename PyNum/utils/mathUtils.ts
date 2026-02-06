/**
 * mathUtils.ts
 * 
 * A comprehensive utility for parsing mathematical expressions and validating inputs.
 * Combines native JavaScript function compilation with robust string preprocessing
 * (LaTeX support, implicit multiplication) and UI validation helpers.
 */

/**
 * Validates if a string is a valid partial or complete numeric input.
 * Allows "-", ".", and empty string for better UX during typing.
 * Useful for React input `onChange` handlers.
 */
export const isValidPartialNumeric = (val: string): boolean => {
  if (val === "" || val === "-" || val === "." || val === "-.") return true;
  // Regex allows optional negative sign, digits, optional decimal, digits
  return /^-?\d*\.?\d*$/.test(val);
};

/**
 * Checks if a string is a complete, valid number for calculation.
 * stricter than isValidPartialNumeric (rejects "-", ".", "").
 */
export const isCompleteNumber = (val: string): boolean => {
  if (val === "" || val === "-" || val === "." || val === "-.") return false;
  const num = Number(val);
  return !isNaN(num) && isFinite(num);
};

/**
 * Compiles a mathematical expression string into a high-performance JavaScript function.
 * 
 * Features:
 * - Standard JS syntax (Math.sin(x))
 * - Common math syntax (sin(x), x^2, ln(x))
 * - Basic LaTeX syntax (\sin(x), \frac{1}{x}, \pi)
 * - Implicit multiplication heuristics (2x, 2(x+1))
 * 
 * @param expression The string math expression (e.g., "x^2 - 4")
 * @param args The arguments the generated function accepts (default: ['x'])
 * @returns A generic Function object that can be called like fn(x)
 */
export const compileMathFunction = (expression: string, args: string[] = ['x']): Function => {
  if (!expression || !expression.trim()) throw new Error("Empty expression");

  // Normalize input
  let expr = expression.toLowerCase().trim();

  // 1. Handle Fractions: \frac{a}{b} -> (a)/(b)
  // We loop to handle nested fractions if necessary (though simple loop handles depth 1)
  let prev;
  do {
    prev = expr;
    expr = expr.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)');
  } while (expr !== prev);

  // 2. LaTeX & Symbol Replacements
  const replacements: Record<string, string> = {
    // Trig & Log
    '\\sin': 'sin', '\\cos': 'cos', '\\tan': 'tan',
    '\\csc': '1/sin', '\\sec': '1/cos', '\\cot': '1/tan',
    '\\ln': 'ln', '\\log': 'log',
    // algebraic
    '\\sqrt': 'sqrt', '\\exp': 'exp',
    '\\pi': 'pi',
    // Operators
    '\\cdot': '*', '\\times': '*',
    '\\left': '', '\\right': '', // Remove LaTeX sizing wrappers
    '{': '(', '}': ')', 
    '^': '**' // JS power operator
  };

  Object.entries(replacements).forEach(([key, val]) => {
     // Escape special regex characters in the key
     const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
     expr = expr.replace(new RegExp(escapedKey, 'g'), val);
  });
  
  // Cleanup remaining backslashes
  expr = expr.replace(/\\/g, '');

  // 3. Implicit Multiplication heuristics
  // e.g., "2x" -> "2*x", "2(x)" -> "2*(x)", ")(" -> ")*("
  expr = expr.replace(/(\d)\s*\(/g, '$1*(');
  expr = expr.replace(/\)\s*\(/g, ')*(');
  expr = expr.replace(/(\d)\s*([xy])/g, '$1*$2');

  // 4. Map Standard Math Functions to the JS Math Object
  const mathFuncs = [
    'sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'atan2',
    'sqrt', 'log', 'exp', 'abs', 'floor', 'ceil', 'round', 'pow'
  ];
  
  // Replace standalone function names with Math.fn
  mathFuncs.forEach(fn => {
    // \b ensures we don't replace "atan" inside "atan2" wrongly if order didn't matter,
    // or variables named "cosmic".
    expr = expr.replace(new RegExp(`\\b${fn}\\b`, 'g'), `Math.${fn}`);
  });

  // Specific mappings
  expr = expr.replace(/\bln\b/g, 'Math.log'); 
  expr = expr.replace(/\bpi\b/g, 'Math.PI');
  expr = expr.replace(/\be\b/g, 'Math.E');

  // 5. Create and Return the Function
  try {
    // Note: Using 'new Function' is safe here assuming this runs on the client-side
    // and input is numeric math only. For a public server-side app, this needs sanitization.
    return new Function(...args, `return ${expr};`);
  } catch (err) {
    throw new Error(`Syntax Error in generated code: ${expr}`);
  }
};