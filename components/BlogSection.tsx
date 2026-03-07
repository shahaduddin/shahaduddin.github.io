
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, PenTool } from 'lucide-react';

const blogPosts = [
    {
        slug: "mastering-numerical-methods",
        title: "Mastering Numerical Methods: A Developer's Guide",
        category: "Math & Code",
        color: "bg-blue-500",
        svgComponent: (
            <div className="w-full h-40 object-cover bg-slate-800/25 p-4 overflow-hidden">
                <svg width="100%" height="100%" viewBox="0 0 200 100" preserveAspectRatio="xMidYMid meet">
                    <path
                        fill="none"
                        stroke="rgb(59 130 246 / 0.5)"
                        strokeWidth="2"
                        d="M 0 50 C 50 10, 50 90, 100 50 C 150 10, 150 90, 200 50"
                    >
                        <animate attributeName="d" values="M 0 50 C 50 10, 50 90, 100 50 C 150 10, 150 90, 200 50; M 0 50 C 50 90, 50 10, 100 50 C 150 90, 150 10, 200 50; M 0 50 C 50 10, 50 90, 100 50 C 150 10, 150 90, 200 50" dur="5s" repeatCount="indefinite" />
                    </path>
                </svg>
            </div>
        )
    },
    {
        slug: "the-art-of-problem-solving",
        title: "The Art of Problem Solving with Competitive Programming",
        category: "Algorithms",
        color: "bg-green-500",
        svgComponent: (
            <div className="w-full h-40 object-cover bg-slate-800/25 p-4 overflow-hidden">
                 <svg width="100%" height="100%" viewBox="0 0 100 100">
                    <defs>
                        <path id="path-1" d="M 20 20 H 80 V 80 H 20 Z" />
                    </defs>
                    <g fill="none" stroke="rgb(34 197 94 / 0.5)" strokeWidth="1.5">
                        <use xlinkHref="#path-1" />
                        <path d="M 20 20 L 80 80 M 80 20 L 20 80 M 50 20 V 80 M 20 50 H 80">
                            <animateTransform
                                attributeName="transform"
                                type="rotate"
                                from="0 50 50"
                                to="90 50 50"
                                dur="8s"
                                repeatCount="indefinite"
                            />
                        </path>
                    </g>
                </svg>
            </div>
        )
    },
    {
        slug: "building-pynum-studio",
        title: "Building PyNum Studio: A Journey into AI-Powered Education",
        category: "Projects",
        color: "bg-purple-500",
        svgComponent: (
             <div className="w-full h-40 object-cover bg-slate-800/25 p-4 overflow-hidden">
                <svg width="100%" height="100%" viewBox="-50 -50 100 100">
                    <g fill="none" strokeWidth="3">
                        <ellipse stroke="rgb(168 85 247 / 0.6)" rx="40" ry="15">
                             <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="10s" repeatCount="indefinite"/>
                        </ellipse>
                        <ellipse stroke="rgb(168 85 247 / 0.6)" rx="40" ry="15" transform="rotate(60)">
                             <animateTransform attributeName="transform" type="rotate" from="60" to="420" dur="10s" repeatCount="indefinite"/>
                        </ellipse>
                        <ellipse stroke="rgb(168 85 247 / 0.6)" rx="40" ry="15" transform="rotate(120)">
                             <animateTransform attributeName="transform" type="rotate" from="120" to="480" dur="10s" repeatCount="indefinite"/>
                        </ellipse>
                        <circle stroke="rgb(168 85 247 / 1)" r="5" />
                    </g>
                </svg>
            </div>
        )
    },
    {
        slug: "lessons-from-math-olympiads",
        title: "Lessons Learned from Competing in Math Olympiads",
        category: "Experiences",
        color: "bg-yellow-500",
        svgComponent: (
            <div className="w-full h-40 object-cover bg-slate-800/25 p-4 overflow-hidden flex items-center justify-center">
                 <svg width="60%" height="60%" viewBox="0 0 100 100">
                    <g fill="rgb(234 179 8 / 0.8)">
                        <path d="M 20 10 H 80 V 20 H 20 Z" />
                        <path d="M 30 20 H 70 V 70 Q 50 95, 30 70 Z" />
                        <path d="M 40 70 H 60 V 90 H 40 Z" />
                         <animateTransform 
                            attributeName="transform"
                            type="translate"
                            values="0 0; 0 -5; 0 0"
                            dur="1.5s"
                            repeatCount="indefinite"
                        />
                    </g>
                    <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" fontSize="20" fill="white" fontWeight="bold">1</text>
                </svg>
            </div>
        )
    }
];

const BlogSection: React.FC = () => {
  return (
    <section id="blog" className="py-24 px-4 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-soft-light"></div>
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-yellow-600/10 rounded-full blur-[128px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col items-center text-center mb-16 space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-xs font-mono uppercase tracking-widest">
                    <PenTool size={14} className="text-purple-500" />
                    <span>From my Desk</span>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                    Thoughts on <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-yellow-400">Code & Creativity</span>
                </h2>
                
                <p className="text-slate-400 max-w-2xl mx-auto text-lg font-light">
                    A collection of articles on numerical methods, competitive programming, and the lessons I've learned on my journey as a developer and mathematician.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                {blogPosts.map((post) => (
                    <Link to={`/blog/${post.slug}`} key={post.slug} className="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl group flex flex-col">
                        <div className="relative overflow-hidden">
                            {post.svgComponent}
                             <div className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold text-white ${post.color}`}>
                                {post.category}
                            </div>
                        </div>
                        <div className="p-6 flex flex-col flex-grow">
                            <h3 className="text-lg font-bold text-white leading-tight flex-grow">{post.title}</h3>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="text-center">
                <Link to="/blog" className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-purple-600 text-white hover:bg-purple-500 transition-all duration-300 font-semibold text-lg shadow-lg shadow-purple-500/30 transform hover:scale-105">
                    View All Posts
                    <ArrowRight size={20} />
                </Link>
            </div>
        </div>
    </section>
  );
};

export default BlogSection;
