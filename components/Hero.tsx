import React from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';

interface HeroProps {
  onCtaClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onCtaClick }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-brand-black">
      {/* Abstract Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1a1a1a] via-brand-black to-brand-black opacity-60"></div>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-white opacity-[0.02] blur-[100px] rounded-full pointer-events-none"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        <div className="animate-fade-in space-y-8 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs font-medium tracking-wide text-gray-400 uppercase">Disponível para novos projetos</span>
          </div>
          
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter">
            ELEVE SUA <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">
              IDENTIDADE VISUAL
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
            Soluções de design premium para marcas que ousam ser diferentes. 
            Especialista em Custom Wear, Identidade de Eventos e Experiências Digitais.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <button 
              onClick={onCtaClick}
              className="group relative px-8 py-4 bg-white text-black font-bold text-lg hover:bg-gray-100 transition-all w-full sm:w-auto overflow-hidden rounded-lg"
            >
              <span className="relative z-10 flex items-center gap-2">
                Iniciar Projeto <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
              </span>
            </button>
            <a 
              href="#portfolio"
              className="px-8 py-4 bg-transparent border border-white/10 text-white font-medium text-lg hover:bg-white/5 transition-all w-full sm:w-auto rounded-lg"
            >
              Ver Portfólio
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce text-gray-700">
        <ArrowDown size={20} />
      </div>
    </section>
  );
};