import React from 'react';
import Header from './components/Header.tsx';
import Hero from './components/Hero.tsx';
import AboutSection from './components/AboutSection.tsx';
import AcademicSection from './components/AcademicSection.tsx';
import SkillsSection from './components/SkillsSection.tsx';
import SlideshowSection from './components/SlideshowSection.tsx';
import GallerySection from './components/GallerySection.tsx';
import BlogSection from './components/BlogSection.tsx';
import ResumeSection from './components/ResumeSection.tsx';
import ContactSection from './components/ContactSection.tsx';
import Footer from './components/Footer.tsx';
import ScrollReveal from './components/ScrollReveal.tsx';
import ScrollToTop from './components/ScrollToTop.tsx';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative">
      <Header />
      <main className="container mx-auto px-6 py-4 grid grid-cols-1 gap-12">
        <ScrollReveal>
          <div id="home">
            <Hero />
          </div>
        </ScrollReveal>
        <ScrollReveal>
          <div id="about">
            <AboutSection />
          </div>
        </ScrollReveal>
        <ScrollReveal>
          <div id="academics">
            <AcademicSection />
          </div>
        </ScrollReveal>
        <ScrollReveal>
          <div id="skills">
            <SkillsSection />
          </div>
        </ScrollReveal>
        <ScrollReveal>
          <div id="projects">
            <SlideshowSection />
          </div>
        </ScrollReveal>
        <ScrollReveal>
          <div id="gallery">
            <GallerySection />
          </div>
        </ScrollReveal>
         <ScrollReveal>
          <div id="blog">
            <BlogSection />
          </div>
        </ScrollReveal>
        <ScrollReveal>
          <div id="resume">
            <ResumeSection />
          </div>
        </ScrollReveal>
        <ScrollReveal>
          <div id="contact">
            <ContactSection />
          </div>
        </ScrollReveal>
        <ScrollReveal>
          <Footer />
        </ScrollReveal>
      </main>
      <ScrollToTop />
    </div>
  );
};

export default App;
