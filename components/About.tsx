import React from 'react';
import { ExternalLink } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <section className="py-24 bg-black border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tight">
              SOBRE O <br />
              <span className="text-gray-500">CREATOR</span>
            </h2>
            <div className="space-y-6 text-gray-400 text-lg leading-relaxed">
              <p>
                Com <strong className="text-white">6 anos de experiência</strong> no mercado criativo, 
                minha jornada é marcada pela diversidade cultural e visual, tendo prestado serviços em 
                <strong className="text-white"> 4 continentes</strong>.
              </p>
              <p>
                Minha expertise vai além do design estético; foco na construção de narrativas visuais 
                que conectam marcas a pessoas, seja através de uma peça de roupa exclusiva ou da identidade 
                completa de um evento internacional.
              </p>
            </div>
            
            <div className="mt-10">
              <a 
                href="https://behance.net/danieldamian" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-white border-b border-white pb-1 hover:text-gray-300 hover:border-gray-300 transition-colors"
              >
                Ver Portfólio no Behance <ExternalLink size={16} />
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square bg-gray-900 overflow-hidden relative grayscale hover:grayscale-0 transition-all duration-700">
               <img 
                 src="https://picsum.photos/800/800?grayscale" 
                 alt="Daniel Damian Work" 
                 className="object-cover w-full h-full opacity-80 hover:opacity-100 hover:scale-105 transition-transform duration-700"
               />
               <div className="absolute inset-0 border border-white/10 pointer-events-none"></div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 -z-10"></div>
            <div className="absolute -top-4 -left-4 w-24 h-24 border border-white/20 -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};