import { ServiceRequest, RequestStatus } from '../types';
import { supabase } from './supabaseClient';

const STORAGE_KEY = 'dnldm_requests';
const TABLE_NAME = 'service_requests';

// --- Helpers de Mapeamento (App <-> Banco de Dados) ---

const parseDate = (dateVal: any): number => {
  if (!dateVal) return Date.now();
  // Se for número (timestamp epoch vindo do LocalStorage ou BigInt do banco)
  if (!isNaN(Number(dateVal))) return Number(dateVal);
  // Se for string ISO (timestamp vindo do Supabase via CSV Import)
  const timestamp = new Date(dateVal).getTime();
  return isNaN(timestamp) ? Date.now() : timestamp;
};

const mapFromDb = (item: any): ServiceRequest => ({
  id: item.id,
  createdAt: parseDate(item.created_at),
  clientName: item.client_name,
  clientEmail: item.client_email,
  serviceType: item.service_type,
  description: item.description,
  status: item.status,
  tags: item.tags || [],
  budget: item.budget,
  referenceFileName: item.reference_file_name
});

const mapToDb = (req: ServiceRequest) => ({
  id: req.id,
  created_at: req.createdAt, // Supabase aceita int8 ou timestamp ISO
  client_name: req.clientName,
  client_email: req.clientEmail,
  service_type: req.serviceType,
  description: req.description,
  status: req.status,
  tags: req.tags,
  budget: req.budget,
  reference_file_name: req.referenceFileName
});

// --- Funções de Dados ---

export const getRequests = async (): Promise<ServiceRequest[]> => {
  // TENTA PRIMEIRO O SUPABASE
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("ERRO AO BUSCAR NO SUPABASE:", error.message);
      // Se a tabela não existir, retorna array vazio em vez de crashar
      if (error.code === '42P01') return [];
    } else if (data) {
      console.log("DADOS RECEBIDOS DO SUPABASE:", data);
      return data.map(mapFromDb);
    }
  } catch (err) {
    console.error("ERRO DE CONEXÃO CRÍTICO:", err);
  }

  // Se falhar o Supabase (ou retornar vazio/erro), tenta o LocalStorage como último recurso
  console.warn("Usando fallback local storage");
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveRequest = async (request: ServiceRequest): Promise<void> => {
  // Salva no Supabase
  const { error } = await supabase
    .from(TABLE_NAME)
    .insert([mapToDb(request)]);
    
  if (error) {
    console.error("ERRO AO SALVAR NO SUPABASE:", error.message);
    alert(`Erro ao salvar no banco: ${error.message}`);
  } else {
    console.log("Salvo no Supabase com sucesso");
  }
  
  // Backup LocalStorage (para garantir experiência do usuário)
  const requests = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const newRequests = [request, ...requests];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newRequests));
};

export const updateRequestStatus = async (id: string, newStatus: RequestStatus): Promise<void> => {
  const { error } = await supabase.from(TABLE_NAME).update({ status: newStatus }).eq('id', id);
  
  if (error) console.error("ERRO AO ATUALIZAR STATUS:", error.message);

  // Atualiza localmente
  const requests = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const updatedRequests = requests.map((req: ServiceRequest) => 
    req.id === id ? { ...req, status: newStatus } : req
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRequests));
};

export const updateRequest = async (updatedRequest: ServiceRequest): Promise<void> => {
  const { error } = await supabase
    .from(TABLE_NAME)
    .update(mapToDb(updatedRequest))
    .eq('id', updatedRequest.id);
    
  if (error) console.error("ERRO AO ATUALIZAR TUDO:", error.message);

  // Atualiza localmente
  const requests = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const index = requests.findIndex((req: ServiceRequest) => req.id === updatedRequest.id);
  if (index !== -1) {
    requests[index] = updatedRequest;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  }
};

export const deleteRequest = async (id: string): Promise<void> => {
  const { error } = await supabase.from(TABLE_NAME).delete().eq('id', id);
  
  if (error) console.error("ERRO AO DELETAR:", error.message);

  // Deleta localmente
  const requests = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const updatedRequests = requests.filter((req: ServiceRequest) => req.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRequests));
};