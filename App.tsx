
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
import ContactPage from './components/ContactPage';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import NotFoundPage from './components/NotFoundPage';
import AcademicsPage from './components/AcademicsPage';

const mainSections = [
  { id: 'home', Component: Hero },
  { id: 'about', Component: AboutSection },
  { id: 'academics', Component: AcademicSection },
  { id: 'skills', Component: SkillsSection },
  { id: 'projects', Component: SlideshowSection },
  { id: 'gallery', Component: GallerySection },
  { id: 'blog', Component: BlogSection },
  { id: 'resume', Component: ResumeSection },
  { id: 'contact', Component: ContactSection },
];

const MainPage: React.FC = () => (
  <>
    <Header />
    <main className="container mx-auto px-6 py-4 grid grid-cols-1 gap-12">
      {mainSections.map(({ id, Component }) => (
        <ScrollReveal key={id}>
          <div id={id}>
            <Component />
          </div>
        </ScrollReveal>
      ))}
      <ScrollReveal>
        <Footer />
      </ScrollReveal>
    </main>
    <ScrollToTop />
  </>
);

const appRoutes = [
    { path: '/', element: <MainPage /> },
    { path: '/gallery', element: <GalleryGridPage /> },
    { path: '/gallery/:id', element: <GalleryPage /> },
    { path: '/blog', element: <BlogGridPage /> },
    { path: '/blog/:id', element: <BlogPostPage /> },
    { path: '/projects', element: <ProjectGridPage /> },
    { path: '/contact', element: <ContactPage /> },
    { path: '/privacy', element: <PrivacyPolicy /> },
    { path: '/terms', element: <TermsOfService /> },
    { path: '/academics', element: <AcademicsPage /> },
    { path: '*', element: <NotFoundPage /> },
];

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative">
        <Routes>
          {appRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
