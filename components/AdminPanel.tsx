import React, { useEffect, useState } from 'react';
import { ServiceRequest, RequestStatus, ServiceCategory } from '../types';
import { getRequests, updateRequestStatus, deleteRequest, saveRequest, updateRequest } from '../services/dataService';
import { Clock, CheckCircle, PlayCircle, Trash2, Mail, FileText, Plus, X, Edit2, Tag } from 'lucide-react';

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
    tags: []
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
        tags: []
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
      referenceFileName: initialData?.referenceFileName
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
              <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
              <input
                required
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
    <div className="flex-1 min-w-[320px] bg-brand-dark/50 border border-white/5 flex flex-col h-full rounded-xl overflow-hidden shadow-sm">
      <div className="p-4 border-b border-white/5 flex items-center gap-2 bg-brand-dark sticky top-0 z-10">
        {icon}
        <h3 className="font-bold text-white uppercase tracking-wider text-sm">{title}</h3>
        <span className="ml-auto bg-white/10 text-xs px-2 py-1 rounded-full font-mono">{requests.length}</span>
      </div>
      
      <div className="p-3 space-y-3 overflow-y-auto flex-1 custom-scrollbar bg-black/20">
        {requests.map(req => (
          <div key={req.id} className="bg-brand-gray/40 border border-white/5 p-4 rounded-lg hover:border-white/20 transition-all group relative">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">
                {new Date(req.createdAt).toLocaleDateString()}
              </span>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => onEdit(req)}
                  className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
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
            
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
              <Mail size={12} />
              <span className="truncate">{req.clientEmail}</span>
            </div>
            
            {req.tags && req.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {req.tags.map(tag => {
                  let colorClass = "bg-white/5 text-gray-400 border-white/5";
                  if (tag.includes("Pendente")) colorClass = "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
                  else if (tag.includes("Enviado")) colorClass = "bg-blue-500/10 text-blue-400 border-blue-500/20";
                  else if (tag.includes("Aprovado")) colorClass = "bg-green-500/10 text-green-400 border-green-500/20";
                  
                  return (
                    <span key={tag} className={`px-2 py-0.5 text-[10px] border rounded ${colorClass}`}>
                      {tag}
                    </span>
                  );
                })}
              </div>
            )}
            
            <div className="relative">
              <p className="text-gray-500 text-xs mb-3 line-clamp-2 leading-relaxed">
                {req.description}
              </p>
            </div>

            {req.referenceFileName && (
              <div className="flex items-center gap-2 text-xs text-blue-400/80 mb-3 bg-blue-400/5 p-2 rounded border border-blue-400/10">
                <FileText size={12} />
                <span className="truncate max-w-[150px]">{req.referenceFileName}</span>
              </div>
            )}

            <div className="flex justify-between gap-2 mt-auto pt-3 border-t border-white/5">
              {status !== RequestStatus.PENDING ? (
                <button 
                  onClick={() => onStatusChange(req.id, status === RequestStatus.COMPLETED ? RequestStatus.IN_PROGRESS : RequestStatus.PENDING)}
                  className="text-[10px] px-2 py-1 border border-white/10 hover:bg-white/5 text-gray-400 rounded transition-colors"
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
  const [refresh, setRefresh] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ServiceRequest | null>(null);

  useEffect(() => {
    setRequests(getRequests());
  }, [refresh]);

  const handleStatusChange = (id: string, newStatus: RequestStatus) => {
    updateRequestStatus(id, newStatus);
    setRefresh(prev => prev + 1);
  };

  const handleDelete = (id: string) => {
    if(window.confirm("Tem certeza que deseja remover este projeto?")) {
      deleteRequest(id);
      setRefresh(prev => prev + 1);
    }
  };

  const handleSaveProject = (request: ServiceRequest) => {
    if (editingProject) {
      updateRequest(request);
    } else {
      saveRequest(request);
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
    <div className="min-h-screen bg-brand-black pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1600px] mx-auto h-[calc(100vh-8rem)] flex flex-col">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
             <h2 className="text-3xl font-black text-white flex items-center gap-3">
               ADMIN DASHBOARD
               <span className="text-xs font-normal text-gray-500 border border-gray-800 px-2 py-1 rounded-full">v2.0</span>
             </h2>
             <p className="text-gray-500 mt-1">Gerencie projetos, status e orçamentos.</p>
          </div>
          <div className="flex gap-4">
             <button
               onClick={openNewProject}
               className="flex items-center gap-2 px-4 py-2 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors"
             >
               <Plus size={18} />
               Novo Projeto
             </button>
             <button 
               onClick={onLogout} 
               className="text-sm text-red-400 hover:text-red-300 border border-red-900/50 px-4 py-2 rounded-lg hover:bg-red-900/10 transition-colors"
             >
               Sair
             </button>
          </div>
        </div>

        <div className="flex-1 overflow-x-auto overflow-y-hidden pb-2">
          <div className="flex gap-6 h-full min-w-[1000px]">
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