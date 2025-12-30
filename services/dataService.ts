import { ServiceRequest, RequestStatus } from '../types';
import { supabase } from './supabaseClient';

const STORAGE_KEY = 'dnldm_requests';
const TABLE_NAME = 'service_requests';

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
  clientAccessCode: item.client_access_code // Mapeamento do novo campo
});

const mapToDb = (req: ServiceRequest) => ({
  id: req.id,
  created_at: req.createdAt,
  client_name: req.clientName,
  client_email: req.clientEmail,
  service_type: req.serviceType,
  description: req.description,
  status: req.status,
  tags: req.tags,
  budget: req.budget,
  reference_file_name: req.referenceFileName,
  client_access_code: req.clientAccessCode // Mapeamento do novo campo
});

// --- Funções de Dados ---

export const getRequests = async (): Promise<ServiceRequest[]> => {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("ERRO AO BUSCAR NO SUPABASE:", error.message);
      if (error.code === '42P01') return [];
    } else if (data) {
      return data.map(mapFromDb);
    }
  } catch (err) {
    console.error("ERRO DE CONEXÃO CRÍTICO:", err);
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const getRequestsByAccessCode = async (code: string): Promise<ServiceRequest[]> => {
  if (!code) return [];
  
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('client_access_code', code)
      .order('created_at', { ascending: false });
      
    if (data) return data.map(mapFromDb);
  } catch (err) {
    console.error(err);
  }
  
  // Fallback Local Storage
  const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  return stored.filter((req: ServiceRequest) => req.clientAccessCode === code);
};

export const saveRequest = async (request: ServiceRequest): Promise<void> => {
  const { error } = await supabase
    .from(TABLE_NAME)
    .insert([mapToDb(request)]);
    
  if (error) console.error("ERRO AO SALVAR NO SUPABASE:", error.message);
  
  const requests = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const newRequests = [request, ...requests];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newRequests));
};

export const updateRequestStatus = async (id: string, newStatus: RequestStatus): Promise<void> => {
  const { error } = await supabase.from(TABLE_NAME).update({ status: newStatus }).eq('id', id);
  if (error) console.error("ERRO AO ATUALIZAR STATUS:", error.message);

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

  const requests = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const updatedRequests = requests.filter((req: ServiceRequest) => req.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRequests));
};