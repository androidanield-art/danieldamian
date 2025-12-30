import React, { useState, useEffect } from 'react';
import { ServiceRequest, RequestStatus } from '../types';
import { getRequestsByAccessCode } from '../services/dataService';
import { Clock, CheckCircle, PlayCircle, Lock, Mail, FileText, DollarSign, LogOut, ArrowRight, Key } from 'lucide-react';
import { Button } from './Button';

interface ClientPortalProps {
  onBack: () => void;
}

const ClientKanbanColumn: React.FC<{
  title: string;
  requests: ServiceRequest[];
  icon: React.ReactNode;
}> = ({ title, requests, icon }) => (
  <div className="flex flex-col w-full md:w-[350px] shrink-0 bg-[#161616] border border-[#262626] rounded-xl shadow-lg h-full">
    <div className="p-4 border-b border-[#262626] flex items-center gap-3 bg-[#161616] rounded-t-xl sticky top-0 z-10">
      <div className="p-1.5 bg-[#262626] rounded-md text-white">
         {icon}
      </div>
      <h3 className="font-bold text-white text-sm">{title}</h3>
      <span className="ml-auto bg-[#262626] text-gray-400 text-xs px-2.5 py-1 rounded-full font-bold">{requests.length}</span>
    </div>
    
    <div className="p-3 space-y-3 overflow-y-auto flex-1 custom-scrollbar min-h-[200px]">
      {requests.length === 0 && (
         <div className="text-center py-10 text-gray-600 text-xs">
           Nenhum projeto nesta etapa
         </div>
      )}
      {requests.map(req => (
        <div key={req.id} className="bg-[#262626] p-4 rounded-lg shadow-sm border border-transparent hover:border-gray-600 transition-all group relative">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">
              {new Date(req.createdAt).toLocaleDateString()}
            </span>
          </div>
          
          <h4 className="font-bold text-white mb-1 leading-tight">{req.serviceType}</h4>
          
          {req.budget && (
             <div className="flex items-center gap-1.5 text-sm font-bold text-emerald-400 mb-3 bg-emerald-400/5 p-2 rounded border border-emerald-400/10">
               <DollarSign size={14} />
               <span>R$ {req.budget}</span>
             </div>
          )}

          {req.tags && req.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {req.tags.map(tag => {
                let colorClass = "bg-[#333] text-gray-400 border-[#444]";
                if (tag.includes("Pendente")) colorClass = "bg-yellow-900/20 text-yellow-500 border-yellow-900/40";
                else if (tag.includes("Enviado")) colorClass = "bg-blue-900/20 text-blue-400 border-blue-900/40";
                else if (tag.includes("Aprovado")) colorClass = "bg-green-900/20 text-green-400 border-green-900/40";
                
                return (
                  <span key={tag} className={`px-2 py-0.5 text-[10px] border rounded ${colorClass}`}>
                    {tag}
                  </span>
                );
              })}
            </div>
          )}
          
          <div className="relative">
            <p className="text-gray-400 text-xs mb-3 leading-relaxed">
              {req.description}
            </p>
          </div>

          {req.referenceFileName && (
            <div className="flex items-center gap-2 text-xs text-blue-400/80 mb-3 bg-blue-400/5 p-2 rounded border border-blue-400/10">
              <FileText size={12} />
              <span className="truncate max-w-[150px]">{req.referenceFileName}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);

export const ClientPortal: React.FC<ClientPortalProps> = ({ onBack }) => {
  const [accessCode, setAccessCode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Pequeno delay para sensação de loading
    await new Promise(r => setTimeout(r, 600));

    const data = await getRequestsByAccessCode(accessCode.trim().toUpperCase());
    
    if (data && data.length > 0) {
      setRequests(data);
      setIsAuthenticated(true);
    } else {
      setError('Código inválido ou nenhum projeto encontrado para esta chave.');
    }
    setIsLoading(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAccessCode('');
    setRequests([]);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 pt-20 relative">
        <button 
          onClick={onBack}
          className="absolute top-24 left-4 sm:left-10 text-gray-500 hover:text-white flex items-center gap-2 text-sm transition-colors"
        >
          &larr; Voltar
        </button>

        <div className="w-full max-w-md p-8 bg-brand-dark border border-white/5 shadow-2xl relative">
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-white/5 rounded-full mb-4">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Área do Cliente</h2>
            <p className="text-gray-500 text-sm mt-2">Acompanhe seus projetos em tempo real</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Chave de Acesso</label>
              <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key size={16} className="text-gray-500"/>
                 </div>
                 <input
                  type="text"
                  className="w-full bg-black/50 border border-white/10 rounded-none px-4 py-3 pl-10 text-white focus:outline-none focus:border-white transition-colors uppercase tracking-widest font-mono text-center"
                  placeholder="EX: A1B2C3"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                  maxLength={10}
                />
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center flex items-center justify-center gap-2">
                 <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> {error}
              </p>
            )}

            <Button type="submit" fullWidth disabled={isLoading}>
              {isLoading ? 'Verificando...' : 'Acessar Projetos'}
            </Button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-[10px] text-gray-600">
              Não tem um código? Entre em contato com nossa equipe.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Pegar o nome do cliente do primeiro request
  const clientName = requests.length > 0 ? requests[0].clientName : 'Cliente';

  return (
    <div className="min-h-screen bg-brand-black pt-24 pb-4 px-4 sm:px-6 lg:px-8 flex flex-col">
       <div className="max-w-[1920px] mx-auto w-full h-full flex flex-col flex-1">
          <div className="flex justify-between items-center mb-6 bg-brand-dark/50 p-4 rounded-xl border border-white/5">
             <div>
                <h2 className="text-xl md:text-3xl font-black text-white flex items-center gap-3">
                  MEUS PROJETOS
                </h2>
                <p className="text-gray-400 text-sm mt-1">Olá, <span className="text-white font-bold">{clientName}</span></p>
             </div>
             <button 
               onClick={handleLogout}
               className="flex items-center gap-2 text-sm text-red-400 hover:text-white border border-red-900/30 px-4 py-2 rounded-lg hover:bg-red-900/20 transition-colors"
             >
               <LogOut size={16} /> <span className="hidden sm:inline">Sair</span>
             </button>
          </div>

          <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
            <div className="flex flex-col md:flex-row gap-6 h-full items-start px-2">
              <ClientKanbanColumn 
                title="Pendente / Em Análise" 
                requests={requests.filter(r => r.status === RequestStatus.PENDING)}
                icon={<Clock size={16} className="text-yellow-500" />}
              />
              <ClientKanbanColumn 
                title="Em Produção" 
                requests={requests.filter(r => r.status === RequestStatus.IN_PROGRESS)}
                icon={<PlayCircle size={16} className="text-blue-500" />}
              />
              <ClientKanbanColumn 
                title="Entregue" 
                requests={requests.filter(r => r.status === RequestStatus.COMPLETED)}
                icon={<CheckCircle size={16} className="text-green-500" />}
              />
            </div>
          </div>
       </div>
    </div>
  );
};