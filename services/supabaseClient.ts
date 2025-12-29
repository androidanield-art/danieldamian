import { createClient } from '@supabase/supabase-js';

// Credenciais fornecidas
const PROVIDED_URL = 'https://hakvrpgmieqhnvduppnh.supabase.co';
const PROVIDED_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhha3ZycGdtaWVxaG52ZHVwcG5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwMDgxNjksImV4cCI6MjA4MjU4NDE2OX0.YMdU8Vw8Cb25ms_XQLwLEb-lmIC6_lFj9WuEnNxGUuE';

// 1. Tenta pegar das variáveis de ambiente (Vercel/Vite) ou usa as fornecidas
const ENV_URL = (import.meta as any).env?.VITE_SUPABASE_URL;
const ENV_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

// 2. Função para buscar a chave ativa
const getActiveKey = () => {
  if (typeof window !== 'undefined') {
    const storedKey = localStorage.getItem('dnldm_sb_key');
    if (storedKey) return storedKey;
  }
  return ENV_KEY || PROVIDED_ANON_KEY || '';
};

const getActiveUrl = () => {
  return ENV_URL || PROVIDED_URL;
};

// 3. Inicializa o cliente APENAS se tivermos uma chave válida
const projectUrl = getActiveUrl();
const projectKey = getActiveKey();

export const supabase = (projectUrl && projectKey) 
  ? createClient(projectUrl, projectKey) 
  : null;

// Helper para salvar chave manualmente (caso queira sobrescrever a padrão)
export const saveSupabaseKey = (newKey: string) => {
  localStorage.setItem('dnldm_sb_key', newKey);
  window.location.reload();
};

export const isSupabaseConfigured = () => {
  return !!supabase && !!projectKey && projectKey.length > 20;
};

// Nova função de teste
export const testConnection = async () => {
  if (!supabase) return { success: false, message: 'Cliente não inicializado.' };
  
  try {
    const { error } = await supabase.from('service_requests').select('id').limit(1);
    
    if (error) {
      if (error.code === 'PGRST301' || error.message.includes('not found') || error.message.includes('relation "service_requests" does not exist')) {
         return { success: false, message: 'Conectado! Mas a tabela "service_requests" ainda não existe. Rode o SQL abaixo no Supabase.' };
      }
      return { success: false, message: `Erro do Supabase: ${error.message}` };
    }
    
    return { success: true, message: 'Sucesso Total! Banco de dados conectado e tabela encontrada.' };
  } catch (err: any) {
    return { success: false, message: `Erro de Rede/Config: ${err.message}` };
  }
};