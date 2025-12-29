import React from 'react';
import { ArrowDown } from 'lucide-react';

interface HeroProps {
  onCtaClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onCtaClick }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-800/20 via-black to-black"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white opacity-[0.03] blur-[120px] rounded-full"></div>
      </div>

      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="mb-8 inline-block">
          <span className="text-sm font-bold tracking-[0.3em] text-gray-500 uppercase">
            Desde 2018
          </span>
        </div>
        
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-white leading-tight tracking-tighter mb-8">
          DESIGN <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-600">
            & CREATION
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
          Transformando identidades visuais em 4 continentes. Especialista em Custom Wear, Identidade de Eventos e Soluções Digitais.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            onClick={onCtaClick}
            className="px-8 py-4 bg-white text-black font-bold text-lg hover:bg-gray-200 transition-all w-full sm:w-auto"
          >
            Iniciar Projeto
          </button>
          <a 
            href="#portfolio"
            className="px-8 py-4 bg-transparent border border-white/20 text-white font-medium text-lg hover:bg-white/5 transition-all w-full sm:w-auto"
          >
            Ver Portfólio
          </a>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-gray-600">
        <ArrowDown size={24} />
      </div>
    </section>
  );
};