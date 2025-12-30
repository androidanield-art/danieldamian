import { createClient } from '@supabase/supabase-js';

// --- CONFIGURAÇÃO DE AMBIENTE ---
// O sistema busca as chaves nesta ordem:
// 1. Variáveis de ambiente (Vercel/Build)
// 2. LocalStorage (Configurado via Painel Admin)
// 3. Fallback (Strings fixas no código)

const env = (import.meta as any).env || {};
const localKey = localStorage.getItem('dnldm_sb_key');
const localUrl = localStorage.getItem('dnldm_sb_url');

// Configuração fixa fornecida pelo usuário
const FALLBACK_URL = 'https://hakvrpgmieqhnvduppnh.supabase.co'; 
const FALLBACK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhha3ZycGdtaWVxaG52ZHVwcG5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwMDgxNjksImV4cCI6MjA4MjU4NDE2OX0.YMdU8Vw8Cb25ms_XQLwLEb-lmIC6_lFj9WuEnNxGUuE';

const SUPABASE_URL = env.VITE_SUPABASE_URL || localUrl || FALLBACK_URL;
const SUPABASE_KEY = env.VITE_SUPABASE_ANON_KEY || localKey || FALLBACK_KEY;

// Cria o cliente apenas se houver configuração, senão cria um objeto dummy para não quebrar o app
export const supabase = (SUPABASE_URL && SUPABASE_KEY) 
  ? createClient(SUPABASE_URL, SUPABASE_KEY)
  : createClient('https://placeholder.supabase.co', 'placeholder');

// Função simples para confirmar que existe configuração válida
export const isSupabaseConfigured = () => {
  return !!SUPABASE_URL && !!SUPABASE_KEY && SUPABASE_URL !== 'https://placeholder.supabase.co'; 
};

// Salva URL e Key no navegador (para configuração via UI)
export const saveSupabaseConfig = (url: string, key: string) => {
  if(url) localStorage.setItem('dnldm_sb_url', url);
  if(key) localStorage.setItem('dnldm_sb_key', key);
  window.location.reload();
};

// Função de teste de conexão direta
export const testConnection = async () => {
  if (!isSupabaseConfigured()) {
    return { success: false, message: 'Supabase não configurado. Insira a URL e a Chave.' };
  }

  try {
    // Tenta buscar qualquer coisa
    const { count, error } = await supabase
      .from('service_requests')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error("Erro Supabase:", error);
      // Erro 404 ou 42P01 significa que conectou, mas a tabela não existe
      if (error.code === '42P01' || error.message.includes('does not exist')) {
         return { success: false, message: 'Conectado! Porém a tabela "service_requests" não existe. Use o comando SQL disponível no botão abaixo.' };
      }
      return { success: false, message: `Erro de Permissão ou Conexão: ${error.message}` };
    }
    
    return { success: true, message: 'Conexão Perfeita! Banco de dados respondendo.' };
  } catch (err: any) {
    return { success: false, message: `Erro Crítico: ${err.message}` };
  }
};