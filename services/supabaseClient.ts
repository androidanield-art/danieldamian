import { createClient } from '@supabase/supabase-js';

// --- CONFIGURAÇÃO AUTOMÁTICA ---
// As chaves são definidas via variáveis de ambiente ou fallback direto no código.

const env = (import.meta as any).env || {};

// Credenciais fixas para conexão automática
const PROJECT_URL = 'https://hakvrpgmieqhnvduppnh.supabase.co'; 
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhha3ZycGdtaWVxaG52ZHVwcG5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwMDgxNjksImV4cCI6MjA4MjU4NDE2OX0.YMdU8Vw8Cb25ms_XQLwLEb-lmIC6_lFj9WuEnNxGUuE';

const SUPABASE_URL = env.VITE_SUPABASE_URL || PROJECT_URL;
const SUPABASE_KEY = env.VITE_SUPABASE_ANON_KEY || ANON_KEY;

// Inicializa o cliente Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Retorna sempre true pois agora a configuração é automática
export const isSupabaseConfigured = () => {
  return true; 
};

// Função de diagnóstico de conexão
export const testConnection = async () => {
  try {
    // Tenta uma query leve apenas para validar acesso e existência da tabela
    const { error } = await supabase
      .from('service_requests')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error("Supabase Error:", error);
      // Erro 42P01 indica que conectou no banco, mas a tabela não existe
      if (error.code === '42P01' || error.message.includes('does not exist')) {
         return { 
           success: false, 
           code: 'TABLE_MISSING', 
           message: 'Banco conectado, mas a tabela "service_requests" ainda não foi criada.' 
         };
      }
      return { 
        success: false, 
        code: 'CONNECTION_ERROR', 
        message: `Erro de acesso ao banco: ${error.message}` 
      };
    }
    
    return { success: true, code: 'OK', message: 'Sistema Online e Conectado.' };
  } catch (err: any) {
    return { success: false, code: 'CRITICAL', message: `Erro crítico de conexão: ${err.message}` };
  }
};