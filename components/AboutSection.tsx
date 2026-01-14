import React from 'react';
import { User, Code, Calculator, MapPin, Terminal, Globe, Cpu } from 'lucide-react';

const AboutSection: React.FC = () => {
    // Schema.org structured data for Google Knowledge Panel
    const schemaData = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Shahad Uddin",
        "url": "https://shahaduddin.com/",
        "givenName": "Shahad",
        "familyName": "Uddin",
        "image": "https://shahaduddin.com/shahad-uddin-math-programmer.jpg",
        "description": "Mathematics student and programmer passionate about algorithms, numerical analysis, and software development.",
        "disambiguatingDescription": "Mathematics undergraduate at SUST and programmer, distinct from the esports personality.",
        "jobTitle": "Mathematics Student & Programmer",
        "knowsAbout": [
            "Mathematics",
            "Computer Science",
            "Programming",
            "Scientific Computing", 
            "Algorithms", 
            "Numerical Analysis", 
            "Web Development"
        ],
        "alumniOf": {
        "@type": "CollegeOrUniversity",
        "name": "Shahjalal University of Science and Technology",
        "sameAs": "https://en.wikipedia.org/wiki/Shahjalal_University_of_Science_and_Technology"
        },
        "sameAs": [
            "https://linkedin.com/in/shahaduddin",
            "https://github.com/shahaduddin",
            "https://x.com/shahaduddin01",
            "https://facebook.com/shahaduddin01",
            "https://instagram.com/shahaduddin01",
            "https://www.threads.com/shahaduddin01",
            "https://www.youtube.com/@shahaduddin01"
        ]
    };

    return (
        <section id="about" className="py-24 px-4 bg-slate-950 relative overflow-hidden">
             {/* JSON-LD for Google Search */}
             <script type="application/ld+json">
                {JSON.stringify(schemaData)}
            </script>

            {/* Enhanced Background Elements */}
            <div className="absolute inset-0 bg-slate-950 pointer-events-none">
                {/* Subtle Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                
                {/* Radial Mask to fade grid at edges */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_50%,transparent,rgba(2,6,23,1))]"></div>
            </div>

            {/* Animated Gradient Orbs */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none translate-x-1/2 -translate-y-1/2 animate-pulse-slow"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 translate-y-1/2 animate-pulse-slow"></div>
            
            {/* Floating Abstract Symbols */}
            <div className="absolute top-20 left-4 md:left-20 text-6xl md:text-8xl font-mono font-bold text-slate-800/30 rotate-12 blur-[2px] select-none pointer-events-none z-0">01</div>
            <div className="absolute bottom-40 right-4 md:right-20 text-7xl md:text-9xl font-serif text-slate-800/20 -rotate-12 blur-[1px] select-none pointer-events-none z-0">∫</div>
            <div className="absolute top-1/3 right-10 md:right-32 text-5xl md:text-7xl font-mono text-slate-800/20 rotate-45 select-none pointer-events-none z-0">{"</>"}</div>
            <div className="absolute bottom-1/4 left-10 md:left-32 text-4xl md:text-6xl font-bold text-slate-800/20 -rotate-6 select-none pointer-events-none z-0">∑</div>

            {/* Noise Texture Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-soft-light"></div>

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="flex items-center gap-4 mb-20">
                    <span className="h-px flex-1 bg-slate-800"></span>
                    <h2 className="text-slate-500 font-mono uppercase tracking-widest text-sm">About Me</h2>
                    <span className="h-px flex-1 bg-slate-800"></span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                    {/* Profile Photo Area */}
                    <div className="lg:col-span-5 flex justify-center lg:justify-end relative">
                        {/* Photo container with decorative elements */}
                        <div className="relative w-72 h-72 md:w-80 md:h-80 group">
                            {/* Rotating borders */}
                            <div className="absolute inset-0 rounded-full border border-dashed border-slate-700 animate-spin-slow"></div>
                            <div className="absolute inset-4 rounded-full border border-slate-800"></div>
                            
                            {/* Glow */}
                            <div className="absolute inset-0 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-colors duration-500"></div>

                            {/* Image */}
                            <div className="absolute inset-6 rounded-full overflow-hidden border-2 border-indigo-500/30 bg-slate-900 shadow-2xl relative z-10">
                                <img 
                                    src="/profile.jpg" 
                                    alt="Shahad Uddin" 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    onError={(e) => {
                                        // Fallback if image not found
                                        e.currentTarget.src = "https://ui-avatars.com/api/?name=Shahad+Uddin&background=1e1b4b&color=6366f1&size=400&font-size=0.33";
                                    }}
                                />
                                {/* Overlay gradient */}
                                <div className="absolute inset-0 bg-indigo-500/10 mix-blend-overlay group-hover:bg-transparent transition-colors duration-500"></div>
                            </div>

                            {/* Floating Badges */}
                            <div className="absolute top-0 right-0 bg-slate-900 border border-slate-700 p-3 rounded-2xl text-indigo-400 shadow-lg animate-float delay-0 z-20">
                                <Terminal size={24} />
                            </div>
                            <div className="absolute bottom-4 left-4 bg-slate-900 border border-slate-700 p-3 rounded-2xl text-blue-400 shadow-lg animate-float delay-1000 z-20">
                                <Calculator size={24} />
                            </div>
                        </div>
                    </div>

                    {/* Bio Text Area */}
                    <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
                        
                        <div className="space-y-2">
                             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono mb-2">
                                <Cpu size={12} />
                                <span>Hello World</span>
                            </div>
                            <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                                    Programmer
                                </span>
                                <span className="text-slate-600 mx-3 font-light">&</span> 
                                <span className="text-slate-200">Mathematician</span>
                            </h3>
                        </div>
                        
                        {/* Glass Card for Bio */}
                        <div className="glass-card p-8 rounded-3xl border-t border-slate-700/50 relative group hover:border-indigo-500/30 transition-all duration-500 text-left">
                            {/* Decorative quote */}
                            <div className="absolute -top-3 -left-3 text-6xl text-indigo-500/10 font-serif leading-none select-none">“</div>

                            <div className="space-y-5 text-slate-400 text-lg leading-relaxed relative z-10">
                                <p>
                                    Hi, I'm <strong className="text-slate-200">Shahad Uddin</strong>. I operate at the intersection of abstract mathematics and computational logic. 
                                    Currently pursuing my B.Sc. in Mathematics at <span className="text-indigo-400 font-medium">Shahjalal University of Science and Technology</span>.
                                </p>
                                <p>
                                    My passion lies in solving complex problems through code. 
                                    Whether it's optimizing algorithms for scientific computing, building robust software systems, or exploring data structures, 
                                    I bring a rigorous, analytical approach to every project.
                                </p>
                                <p>
                                    When I'm not deriving formulas or writing clean, efficient code, 
                                    you can find me exploring new technologies, contributing to open source, or solving algorithmic puzzles.
                                </p>
                            </div>
                        </div>

                        {/* Details / Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 flex items-center gap-3 group hover:border-indigo-500/30 transition-colors text-left">
                                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500 uppercase tracking-wider font-mono">Location</div>
                                    <div className="text-sm font-medium text-slate-200">Sylhet, BD</div>
                                </div>
                            </div>

                            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 flex items-center gap-3 group hover:border-emerald-500/30 transition-colors text-left">
                                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
                                    <User size={20} />
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500 uppercase tracking-wider font-mono">Status</div>
                                    <div className="text-sm font-medium text-slate-200">Available</div>
                                </div>
                            </div>

                            <div className="hidden md:flex p-4 rounded-2xl bg-slate-900/50 border border-slate-800 items-center gap-3 group hover:border-cyan-500/30 transition-colors text-left">
                                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
                                    <Globe size={20} />
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500 uppercase tracking-wider font-mono">Interests</div>
                                    <div className="text-sm font-medium text-slate-200">Tech & Math</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
