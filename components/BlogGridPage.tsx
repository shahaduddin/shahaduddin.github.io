
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Clock, Tag } from 'lucide-react';

const blogPosts = [
    {
        slug: "mastering-numerical-methods",
        title: "Mastering Numerical Methods: A Developer's Guide",
        author: "Shahad Uddin",
        date: "2024-07-01",
        readingTime: 12,
        tags: ["Numerical Analysis", "Python", "Software Development"],
        imageUrl: "./images/gallery/math-fiesta.jpg",
        category: "Math & Code",
        color: "bg-blue-500",
    },
    {
        slug: "the-art-of-problem-solving",
        title: "The Art of Problem Solving with Competitive Programming",
        author: "Shahad Uddin",
        date: "2024-06-15",
        readingTime: 15,
        tags: ["Algorithms", "Data Structures", "Competitive Programming"],
        imageUrl: "./images/gallery/olympiad-team.jpg",
        category: "Algorithms",
        color: "bg-green-500",
    },
    {
        slug: "building-pynum-studio",
        title: "Building PyNum Studio: A Journey into AI-Powered Education",
        author: "Shahad Uddin",
        date: "2024-05-20",
        readingTime: 20,
        tags: ["AI", "React", "TypeScript", "Project Management"],
        imageUrl: "./images/gallery/olympiad-stage2.jpg",
        category: "Projects",
        color: "bg-purple-500",
    },
    {
        slug: "lessons-from-math-olympiads",
        title: "Lessons Learned from Competing in Math Olympiads",
        author: "Shahad Uddin",
        date: "2024-04-10",
        readingTime: 8,
        tags: ["Mathematics", "Problem Solving", "Personal Growth"],
        imageUrl: "./images/gallery/award-plaque2.jpg",
        category: "Experiences",
        color: "bg-yellow-500",
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
                                <img src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-500" />
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
