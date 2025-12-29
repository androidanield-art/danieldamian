import React, { useState } from 'react';
import { ServiceCategory, ServiceRequest, RequestStatus } from '../types';
import { saveRequest } from '../services/dataService';
import { Button } from './Button';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';

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
      <div className="max-w-2xl mx-auto p-8 bg-brand-dark border border-white/10 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
        <h3 className="text-2xl font-bold text-white mb-4">Solicitação Recebida!</h3>
        <p className="text-gray-400 mb-6">
          Seu projeto foi cadastrado com sucesso. Em breve entrarei em contato através do e-mail 
          <span className="text-white font-medium"> {formData.email}</span>.
        </p>
        <Button onClick={() => setStatus('idle')} variant="outline">
          Nova Solicitação
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-brand-dark border border-white/5 p-6 md:p-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Vamos Criar Algo Único?</h2>
        <p className="text-gray-400">Preencha o formulário abaixo para iniciar seu projeto.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Seu Nome</label>
            <input
              required
              type="text"
              className="w-full bg-black/50 border border-white/10 rounded-none px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
              placeholder="Como devo te chamar?"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Seu E-mail</label>
            <input
              required
              type="email"
              className="w-full bg-black/50 border border-white/10 rounded-none px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Serviço Desejado</label>
          <select
            className="w-full bg-black/50 border border-white/10 rounded-none px-4 py-3 text-white focus:outline-none focus:border-white transition-colors appearance-none"
            value={formData.service}
            onChange={(e) => setFormData({...formData, service: e.target.value as ServiceCategory})}
          >
            {Object.values(ServiceCategory).map((service) => (
              <option key={service} value={service} className="bg-brand-dark text-white">
                {service}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Descrição do Projeto</label>
          <textarea
            required
            rows={5}
            className="w-full bg-black/50 border border-white/10 rounded-none px-4 py-3 text-white focus:outline-none focus:border-white transition-colors resize-none"
            placeholder="Conte um pouco sobre sua ideia, objetivos e prazos..."
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Referências (Opcional)</label>
          <div className="relative group">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileChange}
            />
            <label
              htmlFor="file-upload"
              className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-white/10 hover:border-white/30 cursor-pointer bg-black/20 transition-all"
            >
              <div className="text-center">
                <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2 group-hover:text-white transition-colors" />
                <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
                  {formData.file ? formData.file.name : "Clique para fazer upload de referências"}
                </span>
              </div>
            </label>
          </div>
        </div>

        {status === 'error' && (
          <div className="flex items-center gap-2 text-red-500 bg-red-500/10 p-4 border border-red-500/20">
            <AlertCircle size={20} />
            <span>Ocorreu um erro ao enviar. Tente novamente.</span>
          </div>
        )}

        <Button type="submit" fullWidth disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Enviando...' : 'Enviar Solicitação'}
        </Button>
      </form>
    </div>
  );
};