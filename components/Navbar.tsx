import React from 'react';
import { Menu, X, Shield, User } from 'lucide-react';

interface NavbarProps {
  onNavigate: (view: string) => void;
  currentView: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentView }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const navItems = [
    { id: 'home', label: 'Início' },
    { id: 'services', label: 'Serviços' },
    { id: 'about', label: 'Sobre' },
    { id: 'contact', label: 'Solicitar Orçamento' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-black/90 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div 
            className="flex-shrink-0 cursor-pointer" 
            onClick={() => onNavigate('home')}
          >
            <h1 className="text-2xl font-black tracking-tighter text-white">
              DANIEL<span className="text-gray-500">DAMIAN</span>
            </h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    currentView === item.id 
                      ? 'text-white border-b border-white pb-1' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              
              <div className="h-6 w-px bg-white/10 mx-2"></div>

              <button
                onClick={() => onNavigate('client-portal')}
                className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-white/5 hover:bg-white text-white hover:text-black rounded-lg transition-all border border-white/10"
              >
                <User size={14} />
                Área do Cliente
              </button>

              <button
                onClick={() => onNavigate('admin')}
                className="text-gray-600 hover:text-white transition-colors p-2"
                aria-label="Acesso Admin"
              >
                <Shield size={16} />
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-white focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-brand-dark border-b border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsOpen(false);
                }}
                className={`block w-full text-left px-3 py-3 rounded-md text-base font-medium ${
                  currentView === item.id 
                    ? 'bg-white/10 text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
             <button
                onClick={() => {
                  onNavigate('client-portal');
                  setIsOpen(false);
                }}
                className="block w-full text-left px-3 py-3 rounded-md text-base font-bold bg-white text-black mt-4 mb-2"
              >
                Área do Cliente
              </button>
             <button
                onClick={() => {
                  onNavigate('admin');
                  setIsOpen(false);
                }}
                className="block w-full text-left px-3 py-3 rounded-md text-base font-medium text-gray-500 hover:text-white"
              >
                Área Administrativa
              </button>
          </div>
        </div>
      )}
    </nav>
  );
};