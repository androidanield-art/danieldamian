import React from 'react';
import { Shirt, Flag, Image as ImageIcon, Globe, Share2, Layers } from 'lucide-react';
import { ServiceCategory } from '../types';

interface ServicesProps {
  onRequestClick: (service?: ServiceCategory) => void;
}

export const Services: React.FC<ServicesProps> = ({ onRequestClick }) => {
  const services = [
    {
      icon: <Shirt className="w-8 h-8" />,
      title: "Custom Wear",
      category: ServiceCategory.CUSTOM_WEAR,
      description: "Desenvolvimento de peças exclusivas: Oversized, T-shirts, Hoodies e Jackets com modelagem premium."
    },
    {
      icon: <Flag className="w-8 h-8" />,
      title: "Identidade de Eventos",
      category: ServiceCategory.EVENT_IDENTITY,
      description: "Branding completo para eventos esportivos, fóruns, campeonatos e campanhas publicitárias."
    },
    {
      icon: <ImageIcon className="w-8 h-8" />,
      title: "Materiais Gráficos",
      category: ServiceCategory.GRAPHIC_MATERIALS,
      description: "Flyers, outdoors, cartões de visita e todo material de apoio visual para sua marca."
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Web Design",
      category: ServiceCategory.WEB_DESIGN,
      description: "Sites modernos, responsivos e landing pages de alta conversão com foco em UX/UI."
    },
    {
      icon: <Share2 className="w-8 h-8" />,
      title: "Social Media",
      category: ServiceCategory.SOCIAL_MEDIA,
      description: "Gestão estratégica de redes sociais para aumentar sua presença digital e engajamento."
    },
    {
      icon: <Layers className="w-8 h-8" />,
      title: "Creative Packs",
      category: ServiceCategory.CREATIVE_PACKS,
      description: "Pacotes de criativos otimizados para campanhas de tráfego e conteúdo orgânico."
    }
  ];

  return (
    <section className="py-24 bg-brand-black relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-white/5 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">
            SOLUÇÕES CRIATIVAS
          </h2>
          <p className="max-w-2xl mx-auto text-gray-400 text-lg">
            Design estratégico pensado para elevar o nível da sua marca em todos os pontos de contato.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="group p-8 bg-brand-dark border border-white/5 hover:border-white/20 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="text-white mb-6 opacity-50 group-hover:opacity-100 transition-opacity">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
              <p className="text-gray-400 mb-8 leading-relaxed">
                {service.description}
              </p>
              <button 
                onClick={() => onRequestClick(service.category)}
                className="text-sm font-semibold text-white border-b border-white/20 pb-1 hover:border-white transition-colors"
              >
                Solicitar Orçamento &rarr;
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};