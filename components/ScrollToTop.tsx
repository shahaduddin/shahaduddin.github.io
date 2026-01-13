import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const ScrollToTop: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);

        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className={`
                fixed bottom-8 right-8 z-50 p-4 rounded-full 
                bg-indigo-600/80 text-white shadow-xl backdrop-blur-sm 
                border border-indigo-400/30
                transition-all duration-500 ease-out transform
                hover:bg-indigo-500 hover:scale-110 hover:shadow-indigo-500/40 hover:-translate-y-1
                focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-900
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12 pointer-events-none'}
            `}
        >
            <ArrowUp size={24} strokeWidth={3} />
        </button>
    );
};

export default ScrollToTop;