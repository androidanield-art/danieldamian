import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { About } from './components/About';
import { RequestForm } from './components/RequestForm';
import { AdminLogin } from './components/AdminLogin';
import { AdminPanel } from './components/AdminPanel';
import { ServiceCategory } from './types';

// Simple Router implementation for SPA feeling
type View = 'home' | 'services' | 'about' | 'contact' | 'admin';

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [selectedService, setSelectedService] = useState<ServiceCategory | undefined>(undefined);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Check existing session (simple simulation)
  useEffect(() => {
    const session = sessionStorage.getItem('dnldm_auth');
    if (session === 'true') {
      setIsAdminAuthenticated(true);
    }
  }, []);

  const handleNavigate = (newView: string) => {
    setView(newView as View);
    // Reset selection when navigating away
    if (newView !== 'contact') {
      setSelectedService(undefined);
    }
    window.scrollTo(0, 0);
  };

  const handleServiceRequest = (service?: ServiceCategory) => {
    setSelectedService(service);
    setView('contact');
    window.scrollTo(0, 0);
  };

  const handleLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    sessionStorage.setItem('dnldm_auth', 'true');
  };

  const handleLogout = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('dnldm_auth');
    setView('home');
  };

  return (
    <div className="bg-brand-black min-h-screen text-white font-sans selection:bg-white selection:text-black">
      {view !== 'admin' && (
        <Navbar onNavigate={handleNavigate} currentView={view} />
      )}

      {view === 'admin' ? (
        isAdminAuthenticated ? (
          <AdminPanel onLogout={handleLogout} />
        ) : (
          <div className="min-h-screen flex items-center justify-center relative">
             <button 
                onClick={() => handleNavigate('home')}
                className="absolute top-8 left-8 text-gray-500 hover:text-white transition-colors"
             >
               &larr; Voltar ao site
             </button>
            <AdminLogin onLoginSuccess={handleLoginSuccess} />
          </div>
        )
      ) : (
        <main>
          {view === 'home' && (
            <>
              <Hero onCtaClick={() => handleNavigate('contact')} />
              <Services onRequestClick={handleServiceRequest} />
              <About />
            </>
          )}

          {view === 'services' && (
             <div className="pt-20">
               <Services onRequestClick={handleServiceRequest} />
             </div>
          )}

          {view === 'about' && (
            <div className="pt-20">
               <About />
            </div>
          )}

          {view === 'contact' && (
            <div className="pt-32 pb-20 px-4 min-h-screen bg-brand-black">
              <RequestForm initialService={selectedService} />
            </div>
          )}
        </main>
      )}

      {view !== 'admin' && (
        <footer className="bg-black border-t border-white/10 py-12 px-4">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
               <h2 className="text-xl font-bold">DANIEL<span className="text-gray-600">DAMIAN</span></h2>
               <p className="text-xs text-gray-500 mt-2">&copy; {new Date().getFullYear()} All rights reserved.</p>
            </div>
            <div className="flex gap-6">
               <a href="https://behance.net/danieldamian" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors">Behance</a>
               <a href="#" className="text-gray-400 hover:text-white transition-colors">Instagram</a>
               <a href="mailto:androidanield@gmail.com" className="text-gray-400 hover:text-white transition-colors">Email</a>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;