import { ServiceRequest, RequestStatus } from '../types';

const STORAGE_KEY = 'dnldm_requests';

export const getRequests = (): ServiceRequest[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveRequest = (request: ServiceRequest): void => {
  const requests = getRequests();
  const newRequests = [request, ...requests];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newRequests));
  
  // Simulate sending email
  console.log(`[SIMULATION] Sending email to androidanield@gmail.com`);
  console.log(`New Request from: ${request.clientEmail} for ${request.serviceType}`);
};

export const updateRequestStatus = (id: string, newStatus: RequestStatus): ServiceRequest[] => {
  const requests = getRequests();
  const updatedRequests = requests.map(req => 
    req.id === id ? { ...req, status: newStatus } : req
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRequests));
  return updatedRequests;
};

export const updateRequest = (updatedRequest: ServiceRequest): void => {
  const requests = getRequests();
  const index = requests.findIndex(req => req.id === updatedRequest.id);
  if (index !== -1) {
    requests[index] = updatedRequest;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  }
};

export const deleteRequest = (id: string): ServiceRequest[] => {
  const requests = getRequests();
  const updatedRequests = requests.filter(req => req.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRequests));
  return updatedRequests;
};