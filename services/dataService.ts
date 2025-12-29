import { ServiceRequest, RequestStatus } from '../types';
import { supabase, isSupabaseConfigured } from './supabaseClient';

const STORAGE_KEY = 'dnldm_requests';
const TABLE_NAME = 'service_requests';

// --- Helpers de Mapeamento (App <-> Banco de Dados) ---

const mapFromDb = (item: any): ServiceRequest => ({
  id: item.id,
  createdAt: Number(item.created_at),
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
  created_at: req.createdAt,
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
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("SUPABASE ERROR (Get):", error.message, error.details);
        // Não retorna vazio imediatamente, tenta o localStorage como backup visual
      } else if (data) {
        return data.map(mapFromDb);
      }
    } catch (err) {
      console.error("SUPABASE CONNECTION ERROR:", err);
    }
  }

  // Fallback para LocalStorage
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveRequest = async (request: ServiceRequest): Promise<void> => {
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase
      .from(TABLE_NAME)
      .insert([mapToDb(request)]);
      
    if (error) console.error("SUPABASE ERROR (Insert):", error.message);
  }
  
  // Backup LocalStorage
  const requests = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const newRequests = [request, ...requests];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newRequests));
};

export const updateRequestStatus = async (id: string, newStatus: RequestStatus): Promise<void> => {
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase.from(TABLE_NAME).update({ status: newStatus }).eq('id', id);
    if (error) console.error("SUPABASE ERROR (Update Status):", error.message);
  }

  const requests = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const updatedRequests = requests.map((req: ServiceRequest) => 
    req.id === id ? { ...req, status: newStatus } : req
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRequests));
};

export const updateRequest = async (updatedRequest: ServiceRequest): Promise<void> => {
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase
      .from(TABLE_NAME)
      .update(mapToDb(updatedRequest))
      .eq('id', updatedRequest.id);
    if (error) console.error("SUPABASE ERROR (Update All):", error.message);
  }

  const requests = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const index = requests.findIndex((req: ServiceRequest) => req.id === updatedRequest.id);
  if (index !== -1) {
    requests[index] = updatedRequest;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  }
};

export const deleteRequest = async (id: string): Promise<void> => {
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase.from(TABLE_NAME).delete().eq('id', id);
    if (error) console.error("SUPABASE ERROR (Delete):", error.message);
  }

  const requests = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const updatedRequests = requests.filter((req: ServiceRequest) => req.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRequests));
};