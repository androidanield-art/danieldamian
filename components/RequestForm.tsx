import React, { useState } from 'react';
import { ServiceCategory, ServiceRequest, RequestStatus } from '../types';
import { saveRequest } from '../services/dataService';
import { Button } from './Button';
import { Upload, CheckCircle, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';

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
      await new Promise(resolve => setTimeout(resolve, 800)); // Smooth UX delay

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
      <div className="max-w-2xl mx-auto p-12 glass rounded-2xl text-center animate-fade-in">
        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h3 className="text-3xl font-bold text-white mb-4">Solicitação Recebida</h3>
        <p className="text-gray-400 mb-8 font-light text-lg">
          Seu projeto está em nossa fila de análise. <br />
          Entraremos em contato via <span className="text-white font-medium">{formData.email}</span> em breve.
        </p>
        <Button onClick={() => setStatus('idle')} variant="outline" className="min-w-[200px]">
          Voltar
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-12 text-center">
        <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">
          INICIAR PROJETO
        </h2>
        <p className="text-gray-400 text-lg font-light max-w-xl mx-auto">
          Nos conte sobre sua ideia. Transformamos conceitos em realidade visual de alto impacto.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 glass p-8 md:p-12 rounded-2xl shadow-2xl backdrop-blur-xl bg-brand-dark/30">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Seu Nome</label>
            <input
              required
              type="text"
              className="w-full bg-brand-black/50 border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-all placeholder-gray-700"
              placeholder="Como prefere ser chamado?"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">E-mail de Contato</label>
            <input
              required
              type="email"
              className="w-full bg-brand-black/50 border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-all placeholder-gray-700"
              placeholder="exemplo@empresa.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">O que você precisa?</label>
          <div className="relative">
            <select
              className="w-full bg-brand-black/50 border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-all appearance-none cursor-pointer"
              value={formData.service}
              onChange={(e) => setFormData({...formData, service: e.target.value as ServiceCategory})}
            >
              {Object.values(ServiceCategory).map((service) => (
                <option key={service} value={service} className="bg-brand-dark text-white py-2">
                  {service}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
              <ArrowDownIcon />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Detalhes do Briefing</label>
          <textarea
            required
            rows={5}
            className="w-full bg-brand-black/50 border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-all placeholder-gray-700 resize-none leading-relaxed"
            placeholder="Descreva o projeto, objetivos, prazos e referências visuais..."
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <div className="space-y-3">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Anexo (Opcional)</label>
          <div className="relative group">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileChange}
            />
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full h-32 border border-dashed border-white/10 rounded-lg hover:border-white/30 hover:bg-white/5 cursor-pointer bg-brand-black/30 transition-all duration-300"
            >
              <div className="text-center space-y-2">
                {formData.file ? (
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full">
                     <CheckCircle className="w-5 h-5 text-green-500" />
                     <span className="text-sm text-white font-medium">{formData.file.name}</span>
                  </div>
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-gray-500 group-hover:text-white transition-colors mx-auto" />
                    <span className="text-sm text-gray-500 group-hover:text-white transition-colors">
                      Arraste ou clique para enviar referências
                    </span>
                  </>
                )}
              </div>
            </label>
          </div>
        </div>

        {status === 'error' && (
          <div className="flex items-center gap-2 text-red-400 bg-red-900/10 p-4 border border-red-900/20 rounded-lg text-sm">
            <AlertCircle size={16} />
            <span>Erro ao conectar com o servidor. Tente novamente.</span>
          </div>
        )}

        <Button 
          type="submit" 
          fullWidth 
          disabled={status === 'submitting'} 
          className="h-16 text-lg font-bold tracking-wider uppercase rounded-lg hover:scale-[1.01] active:scale-[0.99]"
        >
          {status === 'submitting' ? (
            <span className="flex items-center gap-2">
              <Loader2 className="animate-spin" /> Processando...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Enviar Solicitação <ArrowRight size={20} />
            </span>
          )}
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