
import React, { useState, useEffect } from 'react';
import { 
  Camera, Trophy, Tent, Utensils, X, ZoomIn, 
  Calendar, MapPin, Image as ImageIcon, Filter,
  ChevronLeft, ChevronRight
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
    id: "olympiad-stage",
    src: "./images/gallery/olympiad-stage.jpg",
    category: "Events",
    title: "16th National Math Olympiad",
    description: "Hosting the Sylhet Regional round. A gathering of the brightest young mathematical minds in the region.",
    date: "Nov 2025",
    location: "Leading University",
    color: "bg-indigo-500"
  },
   {
    id: "olympiad-stage2",
    src: "./images/gallery/olympiad-stage2.jpg",
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
    title: "Grill & Chill 2024",
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
    id: "tour-shimul2",
    src: "./images/gallery/tour-shimul2.jpg",
    category: "Travel",
    title: "Shimul Bagan Expedition",
    description: "Witnessing the vibrant red silk cotton trees in bloom. A colorful day out with the batch.",
    date: "Spring 2025",
    location: "Tahirpur, Sunamgonj",
    color: "bg-rose-500"
  },
  {
    id: "award-plaque",
    src: "./images/gallery/15th-numo-sylhet-regional-2nd-position.jpg",
    category: "Awards",
    title: "Excellent Performance",
    description: "Awarded for excellence in the 15th National Undergraduate Mathematics Olympiad (Sylhet Region).",
    date: "Dec 2024",
    location: "Sylhet",
    color: "bg-blue-500"
  },
  {
    id: "award-plaque2",
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
    location: "Academic Bldg C",
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
    location: "Civil Eng. Building",
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

const GallerySection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedPhoto) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigatePhoto('prev', e);
      if (e.key === 'ArrowRight') navigatePhoto('next', e);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhoto]);

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

  const openLightbox = (photo: Photo) => {
    setSelectedPhoto(photo);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
    document.body.style.overflow = 'auto';
  };

  const navigatePhoto = (direction: 'prev' | 'next', e: React.MouseEvent | KeyboardEvent) => {
    e.stopPropagation();
    if (!selectedPhoto) return;
    
    const currentIndex = filteredPhotos.findIndex(p => p.id === selectedPhoto.id);
    if (currentIndex === -1) return;

    let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    
    if (newIndex >= filteredPhotos.length) newIndex = 0;
    if (newIndex < 0) newIndex = filteredPhotos.length - 1;

    setSelectedPhoto(filteredPhotos[newIndex]);
  };

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
                    <div 
                        key={photo.id}
                        className="break-inside-avoid relative group cursor-pointer rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl"
                        onClick={() => openLightbox(photo)}
                    >
                        <div className="relative overflow-hidden aspect-[4/3] group-hover:opacity-90 transition-opacity bg-slate-800">
                             <img 
                                src={photo.src} 
                                alt={photo.title}
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
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

                        <div className="absolute top-4 right-4 p-2 bg-slate-950/50 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-white/10">
                            <ZoomIn size={16} />
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* --- Redesigned Fullscreen Lightbox --- */}
        {selectedPhoto && (
            <div 
                className="fixed inset-0 z-50 flex flex-col bg-black/95 animate-in fade-in duration-300"
                onClick={closeLightbox}
            >
                {/* Main content area */}
                <div className="relative flex-1 flex flex-col lg:flex-row items-center overflow-hidden" onClick={(e) => e.stopPropagation()}>
                    
                    {/* Image display area */}
                    <div className="relative flex-1 flex items-center justify-center w-full h-full p-4 lg:p-12">
                        <img 
                            src={selectedPhoto.src} 
                            alt={selectedPhoto.title}
                            className="block max-w-full max-h-full object-contain select-none shadow-2xl shadow-black"
                            onError={(e) => {
                                e.currentTarget.src = `https://placehold.co/1200x800/0f172a/94a3b8?text=Image+Not+Found`;
                            }}
                        />
                    </div>

                    {/* Details Panel */}
                    <div className="w-full lg:w-[380px] lg:h-full flex-shrink-0 flex flex-col bg-slate-900/80 backdrop-blur-lg border-t lg:border-t-0 lg:border-l border-slate-700/80">
                        <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
                            <div className="flex items-center gap-3 mb-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-white ${selectedPhoto.color?.replace('bg-', 'bg-').replace('500', '600') || 'bg-gray-600'}`}>
                                    {selectedPhoto.category}
                                </span>
                            </div>
                            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3 leading-tight">{selectedPhoto.title}</h2>
                            <p className="text-slate-300 text-sm lg:text-base leading-relaxed">
                                {selectedPhoto.description}
                            </p>
                        </div>

                        <div className="flex-shrink-0 px-6 lg:px-8 py-6 border-t border-slate-700/80 space-y-5 bg-black/20">
                            <div className="flex items-start gap-4 text-slate-300">
                                <Calendar size={18} className="text-indigo-400 flex-shrink-0 mt-0.5" />
                                <span className="text-sm font-mono">{selectedPhoto.date}</span>
                            </div>
                            {selectedPhoto.location && (
                                <div className="flex items-start gap-4 text-slate-300">
                                    <MapPin size={18} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm font-mono">{selectedPhoto.location}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="absolute inset-0 pointer-events-none">
                    {/* Close Button */}
                    <button 
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-white/20 transition-all pointer-events-auto"
                    >
                        <X size={24} />
                    </button>

                    {/* Prev/Next Buttons */}
                    <button 
                        onClick={(e) => navigatePhoto('prev', e)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-white/20 transition-all pointer-events-auto hidden md:block"
                    >
                        <ChevronLeft size={32} />
                    </button>
                    <button 
                        onClick={(e) => navigatePhoto('next', e)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-white/20 transition-all pointer-events-auto hidden md:block"
                    >
                        <ChevronRight size={32} />
                    </button>
                </div>
            </div>
        )}
    </section>
  );
};

export default GallerySection;
