
import React, { useMemo } from 'react';

const symbols = ['+', '-', '×', '÷', '=', '∫', '∂', '∑', '√', '∞', 'π', 'θ', 'α', 'β', 'γ', 'λ', 'μ', 'Σ', 'Δ', 'Ω', '{', '}', '[', ']', '<', '>', '/', ';', ':', '(', ')', '||', '&&'];

const MathSymbolsBackground: React.FC = () => {
    const symbolElements = useMemo(() => {
        return Array.from({ length: 50 }).map((_, i) => {
            const style: React.CSSProperties = {
                left: `${Math.random() * 100}vw`,
                top: `${Math.random() * 100}vh`,
                fontSize: `${Math.random() * 1.5 + 0.5}rem`,
                animationDuration: `${Math.random() * 20 + 15}s`,
                animationDelay: `${Math.random() * -35}s`,
            };
            const symbol = symbols[Math.floor(Math.random() * symbols.length)];

            return (
                <div key={i} style={style} className="symbol">
                    {symbol}
                </div>
            );
        });
    }, []);

    return <div className="math-symbols-background">{symbolElements}</div>;
};

export default MathSymbolsBackground;
