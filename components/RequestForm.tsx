import React, { useState } from 'react';
import { ServiceCategory, ServiceRequest, RequestStatus } from '../types';
import { saveRequest } from '../services/dataService';
import { Button } from './Button';
import { Upload, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

interface RequestFormProps {
  initialService?: ServiceCategory;
}

export const RequestForm: React.FC<RequestFormProps> = ({ initialService }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: initialService || ServiceCategory.CUSTOM_WEAR,
    description: '',
    file: null as File | null
  });
  
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      // Pequeno delay para feedback visual
      await new Promise(resolve => setTimeout(resolve, 500));

      const newRequest: ServiceRequest = {
        id: crypto.randomUUID(),
        clientName: formData.name,
        clientEmail: formData.email,
        serviceType: formData.service,
        description: formData.description,
        status: RequestStatus.PENDING,
        createdAt: Date.now(),
        referenceFileName: formData.file?.name
      };

      await saveRequest(newRequest);
      
      console.info(`Enviando notificação para androidanield@gmail.com`);
      
      setStatus('success');
      setFormData({
        name: '',
        email: '',
        service: ServiceCategory.CUSTOM_WEAR,
        description: '',
        file: null
      });

    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, file: e.target.files![0] }));
    }
  };

  if (status === 'success') {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-brand-dark border border-white/10 text-center animate-in fade-in zoom-in duration-300">
        <CheckCircle className="w-16 h-16 text-white mx-auto mb-6" />
        <h3 className="text-2xl font-bold text-white mb-4">Solicitação Enviada</h3>
        <p className="text-gray-400 mb-8 font-light">
          Seu projeto foi cadastrado. Em breve entrarei em contato através do e-mail:
          <br/>
          <span className="text-white font-medium border-b border-white/20 pb-0.5"> {formData.email}</span>.
        </p>
        <Button onClick={() => setStatus('idle')} variant="outline">
          Nova Solicitação
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-10 text-center md:text-left">
        <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight uppercase">
          Solicitar Orçamento
        </h2>
        <p className="text-gray-400 text-lg font-light max-w-xl">
          Preencha os detalhes abaixo para iniciarmos o processo de criação do seu projeto exclusivo.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-brand-dark/50 p-6 md:p-10 border border-white/5 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Nome Completo</label>
            <input
              required
              type="text"
              className="w-full bg-black border border-white/10 p-4 text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all placeholder-gray-700"
              placeholder="Digite seu nome"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">E-mail Corporativo ou Pessoal</label>
            <input
              required
              type="email"
              className="w-full bg-black border border-white/10 p-4 text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all placeholder-gray-700"
              placeholder="nome@exemplo.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Tipo de Serviço</label>
          <div className="relative">
            <select
              className="w-full bg-black border border-white/10 p-4 text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all appearance-none cursor-pointer"
              value={formData.service}
              onChange={(e) => setFormData({...formData, service: e.target.value as ServiceCategory})}
            >
              {Object.values(ServiceCategory).map((service) => (
                <option key={service} value={service} className="bg-black text-white py-2">
                  {service}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
              <ArrowDownIcon />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Detalhes do Projeto</label>
          <textarea
            required
            rows={5}
            className="w-full bg-black border border-white/10 p-4 text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all placeholder-gray-700 resize-none"
            placeholder="Descreva sua ideia, público-alvo e prazos desejados..."
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Arquivos de Referência (Opcional)</label>
          <div className="relative group">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileChange}
            />
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full h-32 border border-dashed border-white/20 hover:border-white hover:bg-white/5 cursor-pointer bg-black transition-all duration-300"
            >
              <div className="text-center space-y-2">
                {formData.file ? (
                  <>
                     <CheckCircle className="w-6 h-6 text-green-500 mx-auto" />
                     <span className="text-sm text-white font-medium block">{formData.file.name}</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-gray-500 mx-auto group-hover:text-white transition-colors" />
                    <span className="text-sm text-gray-500 group-hover:text-white transition-colors">
                      Clique para adicionar referências visuais
                    </span>
                  </>
                )}
              </div>
            </label>
          </div>
        </div>

        {status === 'error' && (
          <div className="flex items-center gap-2 text-red-400 bg-red-900/20 p-4 border border-red-900/30 text-sm">
            <AlertCircle size={16} />
            <span>Ocorreu um erro ao enviar. Verifique sua conexão.</span>
          </div>
        )}

        <Button type="submit" fullWidth disabled={status === 'submitting'} className="h-14 text-lg font-bold tracking-wider uppercase">
          {status === 'submitting' ? 'Processando...' : 'Confirmar Solicitação'} <ArrowRight size={20} className="ml-2" />
        </Button>
      </form>
    </div>
  );
};

const ArrowDownIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);