import React from 'react';
import { 
  FaGithub, 
  FaLinkedin, 
  FaXTwitter, 
  FaFacebook, 
  FaInstagram, 
  FaYoutube, 
  FaPinterest, 
  FaThreads 
} from 'react-icons/fa6';
import { HiMapPin, HiAcademicCap } from 'react-icons/hi2';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: 'GitHub', url: 'https://github.com/shahaduddin', icon: <FaGithub /> },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/shahaduddin', icon: <FaLinkedin /> },
    { name: 'X (Twitter)', url: 'https://x.com/theshahaduddin', icon: <FaXTwitter /> },
    { name: 'Threads', url: 'https://www.threads.net/@theshahaduddin', icon: <FaThreads /> },
    { name: 'Facebook', url: 'https://www.facebook.com/theshahaduddin', icon: <FaFacebook /> },
    { name: 'Instagram', url: 'https://www.instagram.com/theshahaduddin', icon: <FaInstagram /> },
    { name: 'YouTube', url: 'https://www.youtube.com/@theshahaduddin', icon: <FaYoutube /> },
    { name: 'Pinterest', url: 'https://www.pinterest.com/theshahaduddin', icon: <FaPinterest /> },
  ];

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/#about' },
    { name: 'Projects', href: '/#projects' },
    { name: 'Blog', href: '/#blog' },
    { name: 'Contact', href: '/#contact' },
  ];

  return (
    <footer className="bg-black text-neutral-400 font-sans border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 pt-16 pb-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: Brand & Bio */}
          <div className="space-y-4 lg:col-span-2">
            <a href="/" className="text-2xl font-bold text-white tracking-tighter">
              Shahad<span className="text-indigo-500">Uddin</span>
            </a>
            <p className="text-sm leading-relaxed max-w-sm">
              Software Developer & Mathematics Researcher specializing in numerical analysis, 
              algorithms, and full-stack development. Bridging the gap between 
              abstract math and efficient code.
            </p>
            <div className="flex flex-col space-y-2 text-sm pt-2">
              <div className="flex items-center gap-2">
                <HiAcademicCap className="w-5 h-5 text-indigo-500" />
                <span>Shahjalal University of Science and Technology</span>
              </div>
              <div className="flex items-center gap-2">
                <HiMapPin className="w-5 h-5 text-indigo-500" />
                <span>Sylhet, Bangladesh</span>
              </div>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h3 className="text-white font-semibold mb-6">Explore</h3>
            <ul className="space-y-3 text-sm">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    className="hover:text-indigo-400 transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Connect */}
          <div>
            <h3 className="text-white font-semibold mb-6">Connect</h3>
            <div className="grid grid-cols-4 gap-4">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.name}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-neutral-900 text-white hover:bg-indigo-600 hover:scale-110 transition-all duration-300"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-neutral-500">
            &copy; {currentYear} Shahad Uddin. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-neutral-500">
            <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
