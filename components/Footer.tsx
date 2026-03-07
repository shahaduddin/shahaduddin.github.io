
import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter, Mail, ArrowUpCircle, MapPin, GraduationCap } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: 'GitHub', url: 'https://github.com/shahaduddin', icon: <Github size={20} /> },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/shahaduddin/', icon: <Linkedin size={20} /> },
    { name: 'Twitter', url: 'https://x.com/theshahaduddin', icon: <Twitter size={20} /> },
    { name: 'Email', url: 'mailto:hello@shahaduddin.com', icon: <Mail size={20} /> },
  ];

  const mainLinks = [
    { name: 'Home', href: '/#home' },
    { name: 'About', href: '/#about' },
    { name: 'Skills', href: '/#skills' },
    { name: 'Projects', href: '/#projects' },
  ];

  const resourceLinks = [
    { name: 'Blog', href: '/#blog' },
    { name: 'Contact', href: '/#contact' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950/50 text-slate-400 font-sans border-t border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-16">
          
          {/* Column 1: Brand & Info */}
          <div className="space-y-4 md:col-span-2 lg:col-span-1">
            <Link to="/" className="text-2xl font-bold text-white tracking-tighter">
              Shahad<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Uddin</span>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm">
              A passionate developer bridging the gap between numerical analysis and modern web technologies.
            </p>
            <div className="flex flex-col space-y-2 text-sm pt-2">
              <div className="flex items-center gap-3">
                <GraduationCap className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span>Shahjalal University of Science & Technology</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span>Sylhet, Bangladesh</span>
              </div>
            </div>
          </div>

          {/* Column 2: Main Navigation */}
          <div className="lg:mx-auto">
            <h3 className="text-white font-semibold tracking-wider mb-5">Menu</h3>
            <ul className="space-y-3 text-sm">
              {mainLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="hover:text-indigo-400 transition-colors duration-200">{link.name}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="lg:mx-auto">
            <h3 className="text-white font-semibold tracking-wider mb-5">Resources</h3>
            <ul className="space-y-3 text-sm">
              {resourceLinks.map((link) => (
                <li key={link.name}>
                  {link.href.startsWith('/') && !link.href.startsWith('/#') ? (
                    <Link to={link.href} className="hover:text-indigo-400 transition-colors duration-200">{link.name}</Link>
                  ) : (
                    <a href={link.href} className="hover:text-indigo-400 transition-colors duration-200">{link.name}</a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Connect */}
          <div className="lg:text-right lg:items-end flex flex-col">
            <h3 className="text-white font-semibold tracking-wider mb-5">Connect With Me</h3>
            <div className="flex lg:justify-end gap-3 mb-6">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.name}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800/80 text-white hover:bg-indigo-600 hover:scale-110 transition-all duration-300"
                >
                  {item.icon}
                </a>
              ))}
            </div>
             <p className="text-sm italic">Building innovative solutions, one line of code at a time.</p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-slate-800/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500 text-center sm:text-left">
            &copy; {currentYear} Shahad Uddin. All rights reserved. Designed & Coded with care.
          </p>
          <button 
            onClick={scrollToTop} 
            aria-label="Back to top"
            className="group flex items-center gap-2 text-xs text-slate-500 hover:text-white transition-colors duration-300"
          >
            Back to top 
            <ArrowUpCircle className="w-5 h-5 group-hover:text-indigo-400 group-hover:scale-110 transition-all" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
