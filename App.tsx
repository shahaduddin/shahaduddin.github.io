
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import AcademicSection from './components/AcademicSection';
import SkillsSection from './components/SkillsSection';
import SlideshowSection from './components/SlideshowSection';
import GallerySection from './components/GallerySection';
import BlogSection from './components/BlogSection';
import ResumeSection from './components/ResumeSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import ScrollReveal from './components/ScrollReveal';
import ScrollToTop from './components/ScrollToTop';
import GalleryGridPage from './components/GalleryGridPage';
import GalleryPage from './components/GalleryPage';
import BlogGridPage from './components/BlogGridPage';
import BlogPostPage from './components/BlogPostPage';
import ProjectGridPage from './components/ProjectGridPage';

const MainPage: React.FC = () => (
  <>
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
  </>
);

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/gallery" element={<GalleryGridPage />} />
          <Route path="/gallery/:id" element={<GalleryPage />} />
          <Route path="/blog" element={<BlogGridPage />} />
          <Route path="/blog/:id" element={<BlogPostPage />} />
          <Route path="/projects" element={<ProjectGridPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
