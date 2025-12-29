import React, { useEffect, useState } from 'react';
import { ServiceRequest, RequestStatus, ServiceCategory } from '../types';
import { getRequests, updateRequestStatus, deleteRequest, saveRequest, updateRequest } from '../services/dataService';
import { isSupabaseConfigured } from '../services/supabaseClient';
import { Clock, CheckCircle, PlayCircle, Trash2, Mail, FileText, Plus, X, Edit2, DollarSign, RefreshCw, Database, Wifi, WifiOff, Code, Monitor } from 'lucide-react';

// --- COMPONENTS ---

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (request: ServiceRequest) => void;
  initialData?: ServiceRequest | null;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Partial<ServiceRequest>>({
    clientName: '',
    clientEmail: '',
    serviceType: ServiceCategory.CUSTOM_WEAR,
    description: '',
    status: RequestStatus.PENDING,
    tags: [],
    budget: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        clientName: '',
        clientEmail: '',
        serviceType: ServiceCategory.CUSTOM_WEAR,
        description: '',
        status: RequestStatus.PENDING,
        tags: [],
        budget: ''
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const request: ServiceRequest = {
      id: initialData?.id || crypto.randomUUID(),
      createdAt: initialData?.createdAt || Date.now(),
      clientName: formData.clientName || '',
      clientEmail: formData.clientEmail || '',
      serviceType: formData.serviceType as ServiceCategory,
      description: formData.description || '',
      status: formData.status as RequestStatus,
      tags: formData.tags || [],
      referenceFileName: initialData?.referenceFileName,
      budget: formData.budget || ''
    };
    onSave(request);
    onClose();
  };

  const toggleTag = (tag: string) => {
    const currentTags = formData.tags || [];
    if (currentTags.includes(tag)) {
      setFormData({ ...formData, tags: currentTags.filter(t => t !== tag) });
    } else {
      setFormData({ ...formData, tags: [...currentTags, tag] });
    }
  };

  const predefinedTags = [
    "Pendente de Orçamento",
    "Orçamento Enviado",
    "Orçamento Aprovado"
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-brand-dark border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl">
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/20">
          <h2 className="text-xl font-bold text-white">
            {initialData ? 'Editar Projeto' : 'Novo Projeto'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Cliente</label>
              <input
                required
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white transition-colors"
                value={formData.clientName}
                onChange={e => setFormData({...formData, clientName: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Email (Opcional)</label>
              <input
                type="email"
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white transition-colors"
                value={formData.clientEmail}
                onChange={e => setFormData({...formData, clientEmail: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Serviço</label>
              <select
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white transition-colors appearance-none"
                value={formData.serviceType}
                onChange={e => setFormData({...formData, serviceType: e.target.value as ServiceCategory})}
              >
                {Object.values(ServiceCategory).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Etapa (Kanban)</label>
              <select
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white transition-colors appearance-none"
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value as RequestStatus})}
              >
                {Object.values(RequestStatus).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-400 mb-2">Valor do Orçamento</label>
             <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-sm">R$</span>
                </div>
                <input
                  type="text"
                  placeholder="0,00"
                  className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-white transition-colors"
                  value={formData.budget || ''}
                  onChange={e => setFormData({...formData, budget: e.target.value})}
                />
             </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Descrição</label>
            <textarea
              required
              rows={4}
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white transition-colors resize-none"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-400 mb-2">Tags de Status</label>
             <div className="flex flex-wrap gap-2 mb-3">
               {predefinedTags.map(tag => {
                 const isActive = formData.tags?.includes(tag);
                 let colorClass = "border-gray-600 text-gray-400";
                 if (isActive) {
                   if (tag.includes("Pendente")) colorClass = "border-yellow-500 bg-yellow-500/10 text-yellow-500";
                   else if (tag.includes("Enviado")) colorClass = "border-blue-500 bg-blue-500/10 text-blue-500";
                   else if (tag.includes("Aprovado")) colorClass = "border-green-500 bg-green-500/10 text-green-500";
                 }

                 return (
                   <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 text-xs border rounded-full transition-all ${colorClass} ${!isActive ? 'hover:border-white hover:text-white' : ''}`}
                   >
                     {tag} {isActive && '✓'}
                   </button>
                 )
               })}
             </div>
             
             <div className="flex gap-2">
               <input 
                  id="custom-tag"
                  placeholder="Adicionar tag personalizada..."
                  className="flex-1 bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-white"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const val = e.currentTarget.value.trim();
                      if (val && !formData.tags?.includes(val)) {
                        setFormData({ ...formData, tags: [...(formData.tags || []), val] });
                        e.currentTarget.value = '';
                      }
                    }
                  }}
               />
             </div>
             <div className="flex flex-wrap gap-2 mt-3">
               {formData.tags?.filter(t => !predefinedTags.includes(t)).map(tag => (
                 <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-white/10 text-gray-300 text-xs rounded-md">
                   {tag}
                   <button type="button" onClick={() => toggleTag(tag)} className="hover:text-white"><X size={12}/></button>
                 </span>
               ))}
             </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg text-white hover:bg-white/5 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-white text-black font-medium hover:bg-gray-200 transition-colors"
            >
              Salvar Projeto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface KanbanColumnProps {
  title: string;
  status: RequestStatus;
  requests: ServiceRequest[];
  onStatusChange: (id: string, status: RequestStatus) => void;
  onDelete: (id: string) => void;
  onEdit: (request: ServiceRequest) => void;
  icon: React.ReactNode;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ title, status, requests, onStatusChange, onDelete, onEdit, icon }) => {
  return (
    <div className="flex flex-col w-[350px] shrink-0 max-h-full bg-[#161616] border border-[#262626] rounded-xl shadow-lg">
      <div className="p-4 border-b border-[#262626] flex items-center gap-3 bg-[#161616] rounded-t-xl sticky top-0 z-10">
        <div className="p-1.5 bg-[#262626] rounded-md text-white">
           {icon}
        </div>
        <h3 className="font-bold text-white text-sm">{title}</h3>
        <span className="ml-auto bg-[#262626] text-gray-400 text-xs px-2.5 py-1 rounded-full font-bold">{requests.length}</span>
      </div>
      
      <div className="p-3 space-y-3 overflow-y-auto flex-1 custom-scrollbar">
        {requests.map(req => (
          <div key={req.id} className="bg-[#262626] p-4 rounded-lg shadow-sm border border-transparent hover:border-gray-600 transition-all group relative">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">
                {new Date(req.createdAt).toLocaleDateString()}
              </span>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => onEdit(req)}
                  className="p-1.5 text-gray-400 hover:text-white hover:bg-[#333] rounded transition-colors"
                  title="Editar"
                >
                  <Edit2 size={14} />
                </button>
                <button 
                  onClick={() => onDelete(req.id)}
                  className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
                  title="Excluir"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            
            <h4 className="font-bold text-white mb-1 leading-tight">{req.serviceType}</h4>
            <div className="text-sm font-medium text-gray-300 mb-2">{req.clientName}</div>
            
            {req.clientEmail && (
              <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
                <Mail size={12} />
                <span className="truncate">{req.clientEmail}</span>
              </div>
            )}
            
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
              <p className="text-gray-400 text-xs mb-3 line-clamp-2 leading-relaxed">
                {req.description}
              </p>
            </div>

            {req.referenceFileName && (
              <div className="flex items-center gap-2 text-xs text-blue-400/80 mb-3 bg-blue-400/5 p-2 rounded border border-blue-400/10">
                <FileText size={12} />
                <span className="truncate max-w-[150px]">{req.referenceFileName}</span>
              </div>
            )}

            <div className="flex justify-between gap-2 mt-auto pt-3 border-t border-[#333]">
              {status !== RequestStatus.PENDING ? (
                <button 
                  onClick={() => onStatusChange(req.id, status === RequestStatus.COMPLETED ? RequestStatus.IN_PROGRESS : RequestStatus.PENDING)}
                  className="text-[10px] px-2 py-1 border border-[#444] hover:bg-[#333] text-gray-400 rounded transition-colors"
                >
                  &larr; Voltar
                </button>
              ) : <div />}
              
              {status !== RequestStatus.COMPLETED && (
                 <button 
                 onClick={() => onStatusChange(req.id, status === RequestStatus.PENDING ? RequestStatus.IN_PROGRESS : RequestStatus.COMPLETED)}
                 className="text-[10px] px-2 py-1 bg-white text-black hover:bg-gray-200 font-bold ml-auto rounded transition-colors"
               >
                 Avançar &rarr;
               </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- MAIN PANEL ---

export const AdminPanel: React.FC<{onLogout: () => void}> = ({onLogout}) => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ServiceRequest | null>(null);
  const [showDebug, setShowDebug] = useState(false);
  const isOnline = isSupabaseConfigured();

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const data = await getRequests();
      setRequests(data);
      setIsLoading(false);
    };
    load();
  }, [refresh]);

  const handleStatusChange = async (id: string, newStatus: RequestStatus) => {
    await updateRequestStatus(id, newStatus);
    setRefresh(prev => prev + 1);
  };

  const handleDelete = async (id: string) => {
    if(window.confirm("Tem certeza que deseja remover este projeto?")) {
      await deleteRequest(id);
      setRefresh(prev => prev + 1);
    }
  };

  const handleSaveProject = async (request: ServiceRequest) => {
    if (editingProject) {
      await updateRequest(request);
    } else {
      await saveRequest(request);
    }
    setRefresh(prev => prev + 1);
    setEditingProject(null);
  };

  const openNewProject = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const openEditProject = (request: ServiceRequest) => {
    setEditingProject(request);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-brand-black pt-24 pb-4 px-4 sm:px-6 lg:px-8 flex flex-col">
      <div className="max-w-[1920px] mx-auto w-full h-full flex flex-col flex-1">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 shrink-0 bg-brand-dark/50 p-4 rounded-xl border border-white/5">
          <div className="flex items-center gap-4">
             <div>
                <h2 className="text-3xl font-black text-white flex items-center gap-3">
                  PROJETOS
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${isOnline ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}>
                    {isOnline ? <Wifi size={10} /> : <WifiOff size={10} />}
                    {isOnline ? 'CONECTADO (SUPABASE)' : 'OFFLINE (LOCAL STORAGE)'}
                  </div>
                  {!isOnline && (
                    <span className="text-xs text-gray-500 hidden sm:inline">
                      Configure a chave na tela de login para ver o banco de dados.
                    </span>
                  )}
                </div>
             </div>
          </div>
          
          <div className="flex gap-3">
             <button
               onClick={() => setShowDebug(!showDebug)}
               className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors border ${showDebug ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'}`}
               title="Ver JSON Bruto"
             >
               {showDebug ? <Monitor size={18} /> : <Code size={18} />}
               <span className="hidden sm:inline">{showDebug ? 'Voltar ao Kanban' : 'Debug JSON'}</span>
             </button>

             <button
               onClick={() => setRefresh(prev => prev + 1)}
               disabled={isLoading}
               className="flex items-center justify-center p-2 bg-white/5 text-white hover:bg-white/10 rounded-lg transition-colors border border-white/10"
               title="Atualizar Dados"
             >
               <RefreshCw size={20} className={isLoading ? "animate-spin" : ""} />
             </button>
             
             {!showDebug && (
               <button
                onClick={openNewProject}
                className="flex items-center gap-2 px-4 py-2 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors shadow-lg"
              >
                <Plus size={18} />
                <span className="hidden sm:inline">Novo Projeto</span>
              </button>
             )}
             
             <button 
               onClick={onLogout} 
               className="text-sm text-red-400 hover:text-red-300 border border-red-900/50 px-4 py-2 rounded-lg hover:bg-red-900/10 transition-colors"
             >
               Sair
             </button>
          </div>
        </div>

        {showDebug ? (
          <div className="flex-1 overflow-auto p-4">
             <div className="bg-[#0f0f0f] border border-white/10 rounded-xl p-6 shadow-2xl h-full flex flex-col">
               <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-bold flex items-center gap-2">
                    <Database size={20} className="text-blue-500"/>
                    Dados Brutos (DB Dump)
                  </h3>
                  <span className="text-xs text-gray-500">
                    Mostrando dados da tabela: <strong>service_requests</strong>
                  </span>
               </div>
               <div className="flex-1 relative">
                 <pre className="absolute inset-0 font-mono text-xs text-green-400 whitespace-pre-wrap break-all bg-black p-4 rounded-lg border border-white/5 overflow-auto custom-scrollbar">
                   {JSON.stringify(requests, null, 2)}
                 </pre>
               </div>
             </div>
          </div>
        ) : (
          <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
            <div className="flex gap-6 h-full items-start px-2">
              <KanbanColumn 
                title="Pendente / Novos" 
                status={RequestStatus.PENDING}
                requests={requests.filter(r => r.status === RequestStatus.PENDING)}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
                onEdit={openEditProject}
                icon={<Clock size={16} className="text-yellow-500" />}
              />
              <KanbanColumn 
                title="Em Produção" 
                status={RequestStatus.IN_PROGRESS}
                requests={requests.filter(r => r.status === RequestStatus.IN_PROGRESS)}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
                onEdit={openEditProject}
                icon={<PlayCircle size={16} className="text-blue-500" />}
              />
              <KanbanColumn 
                title="Finalizado" 
                status={RequestStatus.COMPLETED}
                requests={requests.filter(r => r.status === RequestStatus.COMPLETED)}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
                onEdit={openEditProject}
                icon={<CheckCircle size={16} className="text-green-500" />}
              />
            </div>
          </div>
        )}
      </div>

      <ProjectModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProject}
        initialData={editingProject}
      />
    </div>
  );
};