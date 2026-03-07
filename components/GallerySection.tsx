
import React from 'react';
import { Link } from 'react-router-dom';
import { Camera } from 'lucide-react';

const GallerySection: React.FC = () => {
  return (
    <section id="gallery" className="py-24 px-4 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-soft-light"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[128px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[128px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col items-center text-center mb-16 space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-xs font-mono uppercase tracking-widest">
                    <Camera size={14} className="text-indigo-500" />
                    <span>Visual Memoirs</span>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                    Campus <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Chronicles</span>
                </h2>
                
                <p className="text-slate-400 max-w-2xl mx-auto text-lg font-light">
                    Beyond the equations and code. Capturing the vibrant moments of university life, from tours and tournaments to celebrations and achievements.
                </p>

                <Link to="/gallery" className="inline-block px-8 py-3 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
                    View Gallery
                </Link>
            </div>
        </div>
    </section>
  );
};

export default GallerySection;
