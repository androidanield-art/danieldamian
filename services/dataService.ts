import { ServiceRequest, RequestStatus } from '../types';
import { supabase } from './supabaseClient';

const STORAGE_KEY = 'dnldm_requests';
const TABLE_NAME = 'service_requests';

// --- Helpers de UUID ---
export const generateId = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback para navegadores antigos
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// --- Helpers de Mapeamento (App <-> Banco de Dados) ---

const parseDate = (dateVal: any): number => {
  if (!dateVal) return Date.now();
  if (!isNaN(Number(dateVal))) return Number(dateVal);
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
  referenceFileName: item.reference_file_name,
  clientAccessCode: item.client_access_code
});

const mapToDb = (req: ServiceRequest) => ({
  id: req.id,
  created_at: new Date(req.createdAt).toISOString(), // FIX: Converte timestamp numérico para ISO String
  client_name: req.clientName,
  client_email: req.clientEmail,
  service_type: req.serviceType,
  description: req.description,
  status: req.status,
  tags: req.tags,
  budget: req.budget,
  reference_file_name: req.referenceFileName,
  client_access_code: req.clientAccessCode
});

// --- Sistema de Notificação Local ---
const notifyDataChange = () => {
  window.dispatchEvent(new Event('dnldm_data_updated'));
};

// --- Funções de Dados ---

export const getRequests = async (): Promise<ServiceRequest[]> => {
  let serverData: ServiceRequest[] = [];
  let serverError = null;

  // 1. Tenta buscar do Supabase
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      if (error.code !== '42P01') console.error("ERRO SUPABASE:", error.message);
      serverError = error;
    } else if (data) {
      serverData = data.map(mapFromDb);
    }
  } catch (err) {
    console.error("ERRO CONEXÃO:", err);
    serverError = err;
  }

  // 2. Busca do Local Storage (Backup)
  const localData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

  // 3. Estratégia de Merge: Prioriza o Servidor, mas mantém itens locais que não existem no servidor
  // (Isso resolve o problema de criar um projeto e ele não aparecer porque o INSERT falhou no servidor)
  
  if (serverError && localData.length > 0) {
    return localData; // Se o servidor falhou totalmente, retorna local
  }

  const mergedMap = new Map<string, ServiceRequest>();

  // Adiciona dados do servidor primeiro (Fonte da Verdade)
  serverData.forEach(item => mergedMap.set(item.id, item));

  // Adiciona dados locais APENAS se o ID não existir no mapa (Itens não sincronizados)
  localData.forEach((item: ServiceRequest) => {
    if (!mergedMap.has(item.id)) {
      mergedMap.set(item.id, item);
    }
  });

  // Retorna lista ordenada
  return Array.from(mergedMap.values()).sort((a, b) => b.createdAt - a.createdAt);
};

export const getRequestsByAccessCode = async (code: string): Promise<ServiceRequest[]> => {
  if (!code) return [];
  
  // Tenta servidor primeiro
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('client_access_code', code)
      .order('created_at', { ascending: false });
      
    if (data && data.length > 0) return data.map(mapFromDb);
  } catch (err) {
    console.error(err);
  }
  
  // Fallback Local Storage
  const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  return stored.filter((req: ServiceRequest) => req.clientAccessCode === code);
};

export const saveRequest = async (request: ServiceRequest): Promise<void> => {
  // Garante que o status seja PENDENTE ao criar
  const requestToSave = { ...request, status: RequestStatus.PENDING };

  // 1. Salva Localmente Primeiro (Garante UI responsiva)
  const requests = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const newRequests = [requestToSave, ...requests];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newRequests));
  notifyDataChange();

  // 2. Tenta salvar no Supabase
  const { error } = await supabase
    .from(TABLE_NAME)
    .insert([mapToDb(requestToSave)]);
    
  if (error) {
    console.error("ERRO AO SALVAR NO SUPABASE (MODO OFFLINE ATIVO):", error.message);
    // Não lançamos erro para o usuário não travar, o dado fica salvo localmente
  }
};

export const updateRequestStatus = async (id: string, newStatus: RequestStatus): Promise<void> => {
  // Update Local
  const requests = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const updatedRequests = requests.map((req: ServiceRequest) => 
    req.id === id ? { ...req, status: newStatus } : req
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRequests));
  notifyDataChange();

  // Update Server
  const { error } = await supabase.from(TABLE_NAME).update({ status: newStatus }).eq('id', id);
  if (error) console.error("FALHA AO ATUALIZAR STATUS REMOTO:", error.message);
};

export const updateRequest = async (updatedRequest: ServiceRequest): Promise<void> => {
  // Update Local
  const requests = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const index = requests.findIndex((req: ServiceRequest) => req.id === updatedRequest.id);
  if (index !== -1) {
    requests[index] = updatedRequest;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  }
  notifyDataChange();

  // Update Server
  const { error } = await supabase
    .from(TABLE_NAME)
    .update(mapToDb(updatedRequest))
    .eq('id', updatedRequest.id);
    
  if (error) console.error("FALHA AO ATUALIZAR DADOS REMOTOS:", error.message);
};

export const deleteRequest = async (id: string): Promise<void> => {
  // Delete Local
  const requests = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const updatedRequests = requests.filter((req: ServiceRequest) => req.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRequests));
  notifyDataChange();

  // Delete Server
  const { error } = await supabase.from(TABLE_NAME).delete().eq('id', id);
  if (error) console.error("FALHA AO DELETAR REMOTO:", error.message);
};