import React from 'react';
import Hero from './components/Hero.tsx';
import AcademicSection from './components/AcademicSection.tsx';
import SkillsSection from './components/SkillsSection.tsx';
import SlideshowSection from './components/SlideshowSection.tsx';
import ResumeSection from './components/ResumeSection.tsx';
import ContactSection from './components/ContactSection.tsx';
import Footer from './components/Footer.tsx';
import ScrollReveal from './components/ScrollReveal.tsx';
import ScrollToTop from './components/ScrollToTop.tsx';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative">
      <ScrollReveal>
        <Hero />
      </ScrollReveal>
      <ScrollReveal>
        <AboutSection />
      </ScrollReveal>
      <ScrollReveal>
        <AcademicSection />
      </ScrollReveal>
      <ScrollReveal>
        <SkillsSection />
      </ScrollReveal>
      <ScrollReveal>
        <SlideshowSection />
      </ScrollReveal>
      <ScrollReveal>
        <ResumeSection />
      </ScrollReveal>
      <ScrollReveal>
        <ContactSection />
      </ScrollReveal>
      <ScrollReveal>
        <Footer />
      </ScrollReveal>
      
      <ScrollToTop />
    </div>
  );
};

export default App;
