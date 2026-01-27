
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
    date: "Winter 2024",
    location: "Campus Grounds",
    color: "bg-orange-500"
  },
  {
    id: "tour-shimul",
    src: "./images/gallery/tour-shimul.jpg",
    category: "Travel",
    title: "Shimul Bagan Expedition",
    description: "Witnessing the vibrant red silk cotton trees in bloom. A colorful day out with the batch.",
    date: "Spring",
    location: "Tahirpur, Sunamgonj",
    color: "bg-rose-500"
  },
    {
    id: "tour-shimul2",
    src: "./images/gallery/tour-shimul2.jpg",
    category: "Travel",
    title: "Shimul Bagan Expedition",
    description: "Witnessing the vibrant red silk cotton trees in bloom. A colorful day out with the batch.",
    date: "Spring",
    location: "Tahirpur, Sunamgonj",
    color: "bg-rose-500"
  },
  {
    id: "award-plaque",
    src: "./images/gallery/award-plaque.jpeg",
    category: "Awards",
    title: "Excellent Performance",
    description: "Awarded for excellence in the 15th National Undergraduate Mathematics Olympiad (Sylhet Region).",
    date: "Dec 2024",
    location: "Sylhet",
    color: "bg-blue-500"
  },
  {
    id: "award-plaque2",
    src: "./images/gallery/award-plaque2.jpg",
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
    date: "Ramadan",
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
    description: "Navigating the serene waters of Ratargul/Bichnakandi. Peace amidst nature.",
    date: "2023",
    location: "Sylhet",
    color: "bg-cyan-500"
  },
  {
    id: "olympiad-team",
    src: "./images/gallery/olympiad-team.jpg",
    category: "Events",
    title: "Team Achievement",
    description: "Celebrating our team's success outside the Dr. Jamilur Reza Choudhury Building.",
    date: "Jan 2025",
    location: "Civil Eng. Building",
    color: "bg-violet-500"
  },
  {
    id: "tour-stream",
    src: "./images/gallery/tour-stream.jpg",
    category: "Travel",
    title: "Nature's Flow",
    description: "Cooling off in the crystal clear streams of Jaflong.",
    date: "2023",
    location: "Shadapator",
    color: "bg-teal-500"
  }
];

const GallerySection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

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
    document.body.style.overflow = 'unset';
  };

  const navigatePhoto = (direction: 'prev' | 'next', e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedPhoto) return;
    
    const currentIndex = filteredPhotos.findIndex(p => p.id === selectedPhoto.id);
    if (currentIndex === -1) return;

    let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    
    // Loop around
    if (newIndex >= filteredPhotos.length) newIndex = 0;
    if (newIndex < 0) newIndex = filteredPhotos.length - 1;

    setSelectedPhoto(filteredPhotos[newIndex]);
  };

  return (
    <section id="gallery" className="py-24 px-4 bg-slate-950 relative overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-soft-light"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[128px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[128px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
            {/* Header */}
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

            {/* Filter Tabs */}
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

            {/* Gallery Grid */}
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                {filteredPhotos.map((photo) => (
                    <div 
                        key={photo.id}
                        className="break-inside-avoid relative group cursor-pointer rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl"
                        onClick={() => openLightbox(photo)}
                    >
                        {/* Image */}
                        <div className="relative overflow-hidden aspect-[4/3] group-hover:opacity-90 transition-opacity bg-slate-800">
                             <img 
                                src={photo.src} 
                                alt={photo.title}
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                loading="lazy"
                                onError={(e) => {
                                  // Fallback placeholder if image is missing
                                  e.currentTarget.src = `https://placehold.co/600x400/1e293b/475569?text=${encodeURIComponent(photo.title)}`;
                                }}
                             />
                        </div>

                        {/* Hover Overlay */}
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

                        {/* Top Right Icon */}
                        <div className="absolute top-4 right-4 p-2 bg-slate-950/50 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-white/10">
                            <ZoomIn size={16} />
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Lightbox Modal */}
        {selectedPhoto && (
            <div 
                className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200"
                onClick={closeLightbox}
            >
                {/* Close Button */}
                <button 
                    onClick={closeLightbox}
                    className="absolute top-6 right-6 p-3 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors z-[110]"
                >
                    <X size={24} />
                </button>

                <div 
                    className="relative max-w-5xl w-full max-h-[90vh] flex flex-col md:flex-row gap-0 md:gap-8 bg-slate-900/50 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Main Image */}
                    <div className="flex-1 relative bg-black flex items-center justify-center min-h-[40vh] md:min-h-[60vh]">
                        <img 
                            src={selectedPhoto.src} 
                            alt={selectedPhoto.title}
                            className="max-w-full max-h-[85vh] object-contain"
                            onError={(e) => {
                                e.currentTarget.src = `https://placehold.co/800x600/1e293b/475569?text=${encodeURIComponent(selectedPhoto.title)}`;
                            }}
                        />
                        
                        {/* Nav Buttons */}
                        <button 
                            onClick={(e) => navigatePhoto('prev', e)}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-indigo-600 transition-colors border border-white/10"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button 
                            onClick={(e) => navigatePhoto('next', e)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-indigo-600 transition-colors border border-white/10"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>

                    {/* Sidebar Details (on Desktop) or Bottom Sheet (on Mobile) */}
                    <div className="w-full md:w-80 flex flex-col p-6 md:p-8 bg-slate-950/80 backdrop-blur-md md:border-l border-t md:border-t-0 border-slate-800 overflow-y-auto max-h-[30vh] md:max-h-auto">
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-3">
                                <span className={`px-2 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider text-white ${selectedPhoto.color.replace('bg-', 'bg-').replace('500', '600')}`}>
                                    {selectedPhoto.category}
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4 leading-tight">{selectedPhoto.title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed mb-6">
                                {selectedPhoto.description}
                            </p>
                        </div>

                        <div className="mt-auto space-y-4 pt-6 border-t border-slate-800">
                            <div className="flex items-center gap-3 text-sm text-slate-400 font-mono">
                                <Calendar size={16} className="text-indigo-500" />
                                <span>{selectedPhoto.date}</span>
                            </div>
                            {selectedPhoto.location && (
                                <div className="flex items-center gap-3 text-sm text-slate-400 font-mono">
                                    <MapPin size={16} className="text-cyan-500" />
                                    <span>{selectedPhoto.location}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-3 text-sm text-slate-400 font-mono">
                                <ImageIcon size={16} className="text-emerald-500" />
                                <span>High Res Available</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </section>
  );
};

export default GallerySection;
