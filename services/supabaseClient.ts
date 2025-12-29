import { createClient } from '@supabase/supabase-js';

// URL extraída do seu projeto
const PROJECT_URL = 'https://gckevbrutmpgeukrkdic.supabase.co';

// Função para buscar a chave do armazenamento local de forma segura
const getStoredKey = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('dnldm_sb_key');
  }
  return null;
};

const key = getStoredKey();

// Inicializa o cliente apenas se houver uma chave salva
export const supabase = (PROJECT_URL && key) 
  ? createClient(PROJECT_URL, key) 
  : null;

// Função auxiliar para salvar a chave via UI
export const saveSupabaseKey = (newKey: string) => {
  localStorage.setItem('dnldm_sb_key', newKey);
  window.location.reload();
};

// Função auxiliar para verificar se está conectado
export const isSupabaseConfigured = () => !!supabase;