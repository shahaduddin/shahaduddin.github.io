
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Clock, Tag } from 'lucide-react';

const blogPosts = [
    {
        slug: "mastering-numerical-methods",
        title: "Mastering Numerical Methods: A Developer's Guide",
        author: "Shahad Uddin",
        date: "2025-07-01",
        readingTime: 12,
        tags: ["Numerical Analysis", "Python", "Software Development"],
        category: "Math & Code",
        color: "bg-blue-500",
        svgComponent: (
            <div className="w-full h-48 object-cover bg-slate-800/25 p-4 overflow-hidden">
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
        author: "Shahad Uddin",
        date: "2025-06-15",
        readingTime: 15,
        tags: ["Algorithms", "Data Structures", "Competitive Programming"],
        category: "Algorithms",
        color: "bg-green-500",
        svgComponent: (
            <div className="w-full h-48 object-cover bg-slate-800/25 p-4 overflow-hidden">
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
        author: "Shahad Uddin",
        date: "2025-05-20",
        readingTime: 20,
        tags: ["AI", "React", "TypeScript", "Project Management"],
        category: "Projects",
        color: "bg-purple-500",
        svgComponent: (
             <div className="w-full h-48 object-cover bg-slate-800/25 p-4 overflow-hidden">
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
        author: "Shahad Uddin",
        date: "2025-04-10",
        readingTime: 8,
        tags: ["Mathematics", "Problem Solving", "Personal Growth"],
        category: "Experiences",
        color: "bg-yellow-500",
        svgComponent: (
            <div className="w-full h-48 object-cover bg-slate-800/25 p-4 overflow-hidden flex items-center justify-center">
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

const BlogGridPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                        <ArrowLeft size={18} />
                        Back to Home
                    </Link>
                </div>
                
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                        From the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Desk of Shahad</span>
                    </h1>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg font-light mt-4">
                        Exploring the intersection of mathematics, code, and creativity.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogPosts.map((post) => (
                        <Link to={`/blog/${post.slug}`} key={post.slug} className="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl group flex flex-col">
                            <div className="relative overflow-hidden">
                                {post.svgComponent}
                                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold text-white ${post.color}`}>
                                    {post.category}
                                </div>
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                <h2 className="text-xl font-bold text-white mb-3 flex-grow">{post.title}</h2>
                                <div className="text-slate-400 text-sm font-mono space-y-2 mt-4">
                                    <div className="flex items-center gap-2">
                                        <User size={14} />
                                        <span>{post.author}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} />
                                        <span>{post.date}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock size={14} />
                                        <span>{post.readingTime} min read</span>
                                    </div>
                                </div>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {post.tags.map(tag => (
                                        <span key={tag} className="bg-slate-800 text-slate-300 px-2 py-1 rounded-md text-xs font-mono">{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BlogGridPage;
