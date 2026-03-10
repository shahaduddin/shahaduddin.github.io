
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Calendar, MapPin, ArrowLeft, Tag
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
    src: "../images/gallery/olympiad-stage-15th-numo.jpg",
    category: "Events",
    title: "15th National Math Olympiad",
    description: "Hosting the Sylhet Regional round. A gathering of the brightest young mathematical minds in the region.",
    date: "2024",
    location: "SUST",
    color: "bg-indigo-500"
  },
  {
    id: "olympiad-stage-16th-numo",
    src: "../images/gallery/olympiad-stage-16th-numo.jpg",
    category: "Events",
    title: "16th National Math Olympiad",
    description: "Hosting the Sylhet Regional round. A gathering of the brightest young mathematical minds in the region.",
    date: "Nov 2025",
    location: "Leading University",
    color: "bg-indigo-500"
  },
   {
    id: "olympiad-stage-16th-numo-2",
    src: "../images/gallery/olympiad-stage-16th-numo-2.jpg",
    category: "Events",
    title: "16th National Math Olympiad",
    description: "Hosting the Sylhet Regional round. A gathering of the brightest young mathematical minds in the region.",
    date: "Nov 2025",
    location: "Leading University",
    color: "bg-indigo-500"
  },
  {
    id: "bbq-night",
    src: "../images/gallery/bbq-night.jpg",
    category: "Social",
    title: "Grill & Chill 2025",
    description: "Departmental BBQ night under the fairy lights. Good food, warm atmosphere, and great company.",
    date: "Winter 2025",
    location: "Campus Grounds",
    color: "bg-orange-500"
  },
  {
    id: "tour-shimul",
    src: "../images/gallery/tour-shimul.jpg",
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
    title: "Jadukata Riverside Memories",
    description: "Group photo with professor and batchmates on the Jadukata river bank near Shimul Bagan, Sunamgonj.",
    date: "Spring 2025",
    location: "Jadukata River, Sunamgonj",
    color: "bg-emerald-500"
  },
  {
    id: "shahad-portfolio",
    src: "/shahad-math-programmer-sust.png",
    category: "Personal",
    title: "Shahad Uddin",
    description: "Mathematics programmer and tech enthusiast. Passionate about coding, problem-solving, and capturing moments.",
    date: "2026",
    location: "Sylhet, Bangladesh",
    color: "bg-indigo-500"
  },
  {
    id: "award-plaque",
    src: "../images/gallery/15th-numo-sylhet-regional-2nd-position.jpg",
    category: "Awards",
    title: "Excellent Performance",
    description: "Awarded for excellence in the 15th National Undergraduate Mathematics Olympiad (Sylhet Region).",
    date: "Dec 2024",
    location: "Sylhet",
    color: "bg-blue-500"
  },
  {
    id: "award-plaque2",
    src: "../images/gallery/16th-numo-sylhet-regional-6th-position.jpg",
    category: "Awards",
    title: "Excellent Performance",
    description: "Awarded for excellence in the 16th National Undergraduate Mathematics Olympiad (Sylhet Region).",
    date: "Dec 2025",
    location: "Sylhet",
    color: "bg-blue-500"
  },
  {
    id: "iftar-circle",
    src: "../images/gallery/iftar-circle.jpg",
    category: "Social",
    title: "Community Feast",
    description: "Breaking bread together on the open field. A moment of simplicity and brotherhood.",
    date: "Ramadan 2025",
    location: "SUST Field",
    color: "bg-emerald-500"
  },
  {
    id: "math-fiesta",
    src: "../images/gallery/math-fiesta.jpg",
    category: "Events",
    title: "Math Fiesta Cultural Night",
    description: "Performing on stage during the 'Chill Fiesta'. Celebrating the artistic side of mathematicians.",
    date: "2024",
    location: "Academic Bldg C, SUST",
    color: "bg-amber-500"
  },
  {
    id: "tour-boat",
    src: "../images/gallery/tour-boat.png",
    category: "Travel",
    title: "River Expedition",
    description: "Navigating the serene waters of Sada Pathor/Bholagonj. Peace amidst nature.",
    date: "2026",
    location: "Sylhet",
    color: "bg-cyan-500"
  },
  {
    id: "olympiad-team",
    src: "../images/gallery/olympiad-team.jpg",
    category: "Events",
    title: "Team Achievement",
    description: "Celebrating our team's success outside the Dr. Jamilur Reza Choudhury Building.",
    date: "Jan 2026",
    location: "Civil Eng. Building, BUET",
    color: "bg-violet-500"
  },
  {
    id: "tour-stream",
    src: "../images/gallery/tour-stream.jpg",
    category: "Travel",
    title: "Nature's Flow",
    description: "Cooling off in the crystal clear streams of Dhalai River.",
    date: "2026",
    location: "Sada Pathor",
    color: "bg-teal-500"
  }
];

const GalleryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const photo = galleryData.find(p => p.id === id);

  if (!photo) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">Photo not found</h2>
          <p className="text-slate-400 mb-8">The photo you are looking for does not exist.</p>
          <Link to="/gallery" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
            <ArrowLeft size={18} />
            Back to Gallery
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link to="/gallery" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
              <ArrowLeft size={18} />
              Back to Gallery
            </Link>
          </div>
          <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl md:flex">
            <div className="md:flex-shrink-0">
              <img className="h-auto w-full object-cover md:w-96" src={photo.src} alt={photo.title} />
            </div>
            <div className="p-8 flex flex-col justify-between">
              <div>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold mb-4 ${photo.color?.replace('bg-', 'bg-').replace('500', '600') || 'bg-gray-600'} text-white`}>
                  <Tag size={14} />
                  <span>{photo.category}</span>
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-3">{photo.title}</h1>
                <p className="text-slate-300 text-lg leading-relaxed">
                  {photo.description}
                </p>
              </div>
              <div className="mt-6 space-y-4">
                <div className="flex items-center text-slate-400">
                  <Calendar className="h-5 w-5 mr-3 text-indigo-400" />
                  <span className="font-mono">{photo.date}</span>
                </div>
                {photo.location && (
                  <div className="flex items-center text-slate-400">
                    <MapPin className="h-5 w-5 mr-3 text-cyan-400" />
                    <span className="font-mono">{photo.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;
