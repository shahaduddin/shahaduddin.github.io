
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, PenTool } from 'lucide-react';

const blogPosts = [
    {
        slug: "mastering-numerical-methods",
        title: "Mastering Numerical Methods: A Developer's Guide",
        category: "Math & Code",
        color: "bg-blue-500",
        imageUrl: "./images/gallery/math-fiesta.jpg",
    },
    {
        slug: "the-art-of-problem-solving",
        title: "The Art of Problem Solving with Competitive Programming",
        category: "Algorithms",
        color: "bg-green-500",
        imageUrl: "./images/gallery/olympiad-team.jpg",
    },
    {
        slug: "building-pynum-studio",
        title: "Building PyNum Studio: A Journey into AI-Powered Education",
        category: "Projects",
        color: "bg-purple-500",
        imageUrl: "./images/gallery/olympiad-stage2.jpg",
    },
    {
        slug: "lessons-from-math-olympiads",
        title: "Lessons Learned from Competing in Math Olympiads",
        category: "Experiences",
        color: "bg-yellow-500",
        imageUrl: "./images/gallery/award-plaque2.jpg",
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
                            <img src={post.imageUrl} alt={post.title} className="w-full h-40 object-cover transform group-hover:scale-110 transition-transform duration-500" />
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
