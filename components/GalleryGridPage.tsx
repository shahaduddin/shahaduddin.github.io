
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Camera, Trophy, Tent, Utensils, 
  Calendar, MapPin, Filter, ArrowLeft
} from 'lucide-react';

type Category = 'All' | 'Events' | 'Travel' | 'Awards' | 'Social';

interface Photo {
  id: string;
  src: string;
  category: Category;
  title: string;
  description: string;
  date: string;
  location?: string;
  color?: string;
}

const galleryData: Photo[] = [
  {
    id: "olympiad-stage-15th-numo",
    src: "./images/gallery/olympiad-stage-15th-numo.jpg",
    category: "Events",
    title: "15th National Math Olympiad",
    description: "Hosting the Sylhet Regional round. A gathering of the brightest young mathematical minds in the region.",
    date: "2024",
    location: "SUST",
    color: "bg-indigo-500"
  },
  {
    id: "olympiad-stage-16th-numo",
    src: "./images/gallery/olympiad-stage-16th-numo.jpg",
    category: "Events",
    title: "16th National Math Olympiad",
    description: "Hosting the Sylhet Regional round. A gathering of the brightest young mathematical minds in the region.",
    date: "Nov 2025",
    location: "Leading University",
    color: "bg-indigo-500"
  },
   {
    id: "olympiad-stage-16th-numo-2",
    src: "./images/gallery/olympiad-stage-16th-numo-2.jpg",
    category: "Events",
    title: "16th National Math Olympiad",
    description: "Hosting the Sylhet Regional round. A gathering of the brightest young mathematical minds in the region.",
    date: "Nov 2025",
    location: "Leading University",
    color: "bg-indigo-500"
  },
  {
    id: "bbq-night",
    src: "./images/gallery/bbq-night.jpg",
    category: "Social",
    title: "Grill & Chill 2025",
    description: "Departmental BBQ night under the fairy lights. Good food, warm atmosphere, and great company.",
    date: "Winter 2025",
    location: "Campus Grounds",
    color: "bg-orange-500"
  },
  {
    id: "tour-shimul",
    src: "./images/gallery/tour-shimul.jpg",
    category: "Travel",
    title: "Shimul Bagan Expedition",
    description: "Witnessing the vibrant red silk cotton trees in bloom. A colorful day out with the batch.",
    date: "Spring 2025",
    location: "Tahirpur, Sunamgonj",
    color: "bg-rose-500"
  },
  {
    id: "jadu-khata-river",
    src: "./images/gallery/jadu-khata-river.jpg",
    category: "Travel",
    title: "Jadukata Riverside Memories",
    description: "Group photo with professor and batchmates on the Jadukata river bank near Shimul Bagan, Sunamgonj.",
    date: "Spring 2025",
    location: "Jadukata River, Sunamgonj",
    color: "bg-emerald-500"
  },
  {
    id: "shahad-portfolio",
    src: "/shahad-uddin-math-programmer-sust.png",
    category: "Personal",
    title: "Shahad Uddin",
    description: "Mathematics programmer and tech enthusiast. Passionate about coding, problem-solving, and capturing moments.",
    date: "2026",
    location: "Sylhet, Bangladesh",
    color: "bg-indigo-500"
  },
  {
    id: "award-plaque-15th-numo",
    src: "./images/gallery/15th-numo-sylhet-regional-2nd-position.jpg",
    category: "Awards",
    title: "Excellent Performance",
    description: "Awarded for excellence in the 15th National Undergraduate Mathematics Olympiad (Sylhet Region).",
    date: "Dec 2024",
    location: "Sylhet",
    color: "bg-blue-500"
  },
  {
    id: "award-plaque-16th-numo",
    src: "./images/gallery/16th-numo-sylhet-regional-6th-position.jpg",
    category: "Awards",
    title: "Excellent Performance",
    description: "Awarded for excellence in the 16th National Undergraduate Mathematics Olympiad (Sylhet Region).",
    date: "Dec 2025",
    location: "Sylhet",
    color: "bg-blue-500"
  },
  {
    id: "iftar-circle",
    src: "./images/gallery/iftar-circle.jpg",
    category: "Social",
    title: "Community Feast",
    description: "Breaking bread together on the open field. A moment of simplicity and brotherhood.",
    date: "Ramadan 2025",
    location: "SUST Field",
    color: "bg-emerald-500"
  },
  {
    id: "math-fiesta",
    src: "./images/gallery/math-fiesta.jpg",
    category: "Events",
    title: "Math Fiesta Cultural Night",
    description: "Performing on stage during the 'Chill Fiesta'. Celebrating the artistic side of mathematicians.",
    date: "2024",
    location: "Academic Bldg C, SUST",
    color: "bg-amber-500"
  },
  {
    id: "tour-boat",
    src: "./images/gallery/tour-boat.png",
    category: "Travel",
    title: "River Expedition",
    description: "Navigating the serene waters of Sada Pathor/Bholagonj. Peace amidst nature.",
    date: "2026",
    location: "Sylhet",
    color: "bg-cyan-500"
  },
  {
    id: "olympiad-team",
    src: "./images/gallery/olympiad-team.jpg",
    category: "Events",
    title: "Team Achievement",
    description: "Celebrating our team's success outside the Dr. Jamilur Reza Choudhury Building.",
    date: "Jan 2026",
    location: "Civil Eng. Building, BUET",
    color: "bg-violet-500"
  },
  {
    id: "tour-stream",
    src: "./images/gallery/tour-stream.jpg",
    category: "Travel",
    title: "Nature's Flow",
    description: "Cooling off in the crystal clear streams of Dhalai River.",
    date: "2026",
    location: "Sada Pathor",
    color: "bg-teal-500"
  }
];

const GalleryGridPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');

  const filteredPhotos = selectedCategory === 'All' 
    ? galleryData 
    : galleryData.filter(photo => photo.category === selectedCategory);

  const categories: { label: Category; icon: React.ReactNode }[] = [
    { label: 'All', icon: <Filter size={14} /> },
    { label: 'Events', icon: <Calendar size={14} /> },
    { label: 'Travel', icon: <Tent size={14} /> },
    { label: 'Awards', icon: <Trophy size={14} /> },
    { label: 'Social', icon: <Utensils size={14} /> },
  ];

  return (
    <section id="gallery" className="py-6 px-4 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-soft-light"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[128px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[128px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
            <div className="mb-8">
                <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft size={18} />
                    Back to Home
                </Link>
            </div>

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
            </div>

            <div className="flex flex-wrap justify-center gap-2 mb-12">
                {categories.map((cat) => (
                    <button
                        key={cat.label}
                        onClick={() => setSelectedCategory(cat.label)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                            selectedCategory === cat.label
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 scale-105'
                            : 'bg-slate-900/50 text-slate-400 border border-slate-800 hover:border-slate-600 hover:text-white'
                        }`}
                    >
                        {cat.icon}
                        {cat.label}
                    </button>
                ))}
            </div>

            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                {filteredPhotos.map((photo) => (
                    <Link 
                        to={`/gallery/${photo.id}`}
                        key={photo.id}
                        className="break-inside-avoid relative group rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl block"
                    >
                        <div className="relative overflow-hidden aspect-[4/3] bg-slate-800">
                             <img 
                                src={photo.src} 
                                alt={photo.title}
                                className="w-full h-full object-cover transition-transform duration-700"
                                loading="lazy"
                                onError={(e) => {
                                  e.currentTarget.src = `https://placehold.co/600x400/1e293b/475569?text=${encodeURIComponent(photo.title)}`;
                                }}
                             />
                        </div>

                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`w-2 h-2 rounded-full ${photo.color}`}></span>
                                    <span className="text-xs font-mono text-indigo-300 uppercase tracking-wider">{photo.category}</span>
                                </div>
                                <h3 className="text-lg font-bold text-white leading-tight mb-1">{photo.title}</h3>
                                <div className="flex items-center gap-4 text-xs text-slate-400 font-mono mt-2">
                                    <span className="flex items-center gap-1"><Calendar size={10} /> {photo.date}</span>
                                    {photo.location && <span className="flex items-center gap-1"><MapPin size={10} /> {photo.location}</span>}
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    </section>
  );
};

export default GalleryGridPage;
