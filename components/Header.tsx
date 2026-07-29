import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/#about', label: 'About' },
    { to: '/#academics', label: 'Academics' },
    { to: '/#skills', label: 'Skills' },
    { to: '/#projects', label: 'Projects' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/blog', label: 'Blog' },
    { to: '/#resume', label: 'Resume' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-[60] w-full border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-xl">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="text-2xl font-bold text-white">
          <Link to="/">Shahad Uddin</Link>
        </div>
        <div className="hidden items-center space-x-6 md:flex">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} className="text-gray-300 transition-colors hover:text-white">
              {link.label}
            </Link>
          ))}
        </div>
        <div className="md:hidden">
          <button type="button" onClick={() => setIsMenuOpen(!isMenuOpen)} className="rounded-lg p-2 text-white transition-colors hover:bg-slate-800/70">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
            </svg>
          </button>
        </div>
      </nav>
      {isMenuOpen && (
        <div className="absolute left-0 right-0 top-full z-[70] border-t border-slate-800/80 bg-slate-900/95 shadow-2xl backdrop-blur-xl md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col space-y-1 px-4 py-3 sm:px-6 lg:px-8">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className="rounded-md px-3 py-2 text-base font-medium text-gray-300 transition-colors hover:bg-slate-800/80 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
