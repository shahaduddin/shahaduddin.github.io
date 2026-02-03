/**
 * Compiles a mathematical expression string into a JavaScript function.
 * Supports:
 * - Standard JS syntax (Math.sin(x))
 * - Common math syntax (sin(x), x^2, ln(x))
 * - Basic LaTeX syntax (\sin(x), \frac{1}{x}, \pi)
 * - Implicit multiplication for simple cases (2x, 2(x+1))
 */
export const compileMathFunction = (expression: string, args: string[] = ['x']): Function => {
  if (!expression || !expression.trim()) throw new Error("Empty expression");

  // Normalize
  let expr = expression.toLowerCase().trim();

  // 1. Handle Fractions specifically first: \frac{a}{b} -> (a)/(b)
  let prev;
  do {
    prev = expr;
    expr = expr.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)');
  } while (expr !== prev);

  // 2. LaTeX & Symbol Replacements
  const replacements: Record<string, string> = {
    '\\sin': 'sin', '\\cos': 'cos', '\\tan': 'tan',
    '\\csc': '1/sin', '\\sec': '1/cos', '\\cot': '1/tan',
    '\\ln': 'ln', '\\log': 'log',
    '\\sqrt': 'sqrt', '\\exp': 'exp',
    '\\pi': 'pi',
    '\\cdot': '*', '\\times': '*',
    '\\left': '', '\\right': '',
    '{': '(', '}': ')', 
    '^': '**' 
  };

  Object.entries(replacements).forEach(([key, val]) => {
     const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
     expr = expr.replace(new RegExp(escapedKey, 'g'), val);
  });
  
  expr = expr.replace(/\\/g, '');

  // 3. Implicit Multiplication heuristics
  expr = expr.replace(/(\d)\s*\(/g, '$1*(');
  expr = expr.replace(/\)\s*\(/g, ')*(');
  expr = expr.replace(/(\d)\s*([xy])/g, '$1*$2');

  // 4. Map Standard Functions to Math Object
  // This is used for 'new Function' based execution.
  // Note: GraphTool and CalculatorTool use mathjs which does NOT need this.
  const mathFuncs = [
    'sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'atan2',
    'sqrt', 'log', 'exp', 'abs', 'floor', 'ceil', 'round', 'pow'
  ];
  
  mathFuncs.forEach(fn => {
    expr = expr.replace(new RegExp(`\\b${fn}\\b`, 'g'), `Math.${fn}`);
  });

  expr = expr.replace(/\bln\b/g, 'Math.log'); 
  expr = expr.replace(/\bpi\b/g, 'Math.PI');
  expr = expr.replace(/\be\b/g, 'Math.E');

  // 5. Create Function
  try {
    return new Function(...args, `return ${expr};`);
  } catch (err) {
    throw new Error(`Syntax Error in generated code: ${expr}`);
  }
};