import { createClient } from '@supabase/supabase-js';

// 1. Tenta pegar das variáveis de ambiente (Vercel/Vite)
const ENV_URL = (import.meta as any).env?.VITE_SUPABASE_URL;
const ENV_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

// 2. Função para buscar a chave ativa
const getActiveKey = () => {
  if (typeof window !== 'undefined') {
    const storedKey = localStorage.getItem('dnldm_sb_key');
    if (storedKey) return storedKey;
  }
  return ENV_KEY || '';
};

const getActiveUrl = () => {
  return ENV_URL || 'https://gckevbrutmpgeukrkdic.supabase.co'; // Sua URL do projeto
};

// 3. Inicializa o cliente APENAS se tivermos uma chave válida
const projectUrl = getActiveUrl();
const projectKey = getActiveKey();

export const supabase = (projectUrl && projectKey) 
  ? createClient(projectUrl, projectKey) 
  : null;

// Helper para salvar chave manualmente
export const saveSupabaseKey = (newKey: string) => {
  localStorage.setItem('dnldm_sb_key', newKey);
  window.location.reload();
};

export const isSupabaseConfigured = () => {
  return !!supabase && !!projectKey && projectKey.length > 20;
};

// Nova função de teste
export const testConnection = async () => {
  if (!supabase) return { success: false, message: 'Cliente não inicializado. Salve a chave primeiro.' };
  
  try {
    const { error } = await supabase.from('service_requests').select('id').limit(1);
    
    if (error) {
      if (error.code === 'PGRST301' || error.message.includes('not found')) {
         return { success: false, message: 'Conectado, mas a tabela "service_requests" não existe.' };
      }
      return { success: false, message: `Erro do Supabase: ${error.message}` };
    }
    
    return { success: true, message: 'Sucesso! Banco de dados conectado e tabela encontrada.' };
  } catch (err: any) {
    return { success: false, message: `Erro de Rede/Config: ${err.message}` };
  }
};