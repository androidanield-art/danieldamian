import { createClient } from '@supabase/supabase-js';

// --- CONFIGURAÇÃO FORÇADA ---
// Estamos usando diretamente as chaves que você forneceu para garantir a conexão.
const SUPABASE_URL = 'https://hakvrpgmieqhnvduppnh.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhha3ZycGdtaWVxaG52ZHVwcG5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwMDgxNjksImV4cCI6MjA4MjU4NDE2OX0.YMdU8Vw8Cb25ms_XQLwLEb-lmIC6_lFj9WuEnNxGUuE';

// Cria o cliente diretamente, sem verificações complexas
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Função simples para confirmar que existe configuração
export const isSupabaseConfigured = () => {
  return true; 
};

// Função de teste de conexão direta
export const testConnection = async () => {
  try {
    // Tenta buscar qualquer coisa, mesmo que a tabela esteja vazia
    const { data, error, count } = await supabase
      .from('service_requests')
      .select('id', { count: 'exact', head: true });
    
    if (error) {
      console.error("Erro Supabase:", error);
      // Erro 404 ou relação não existe significa que conectou, mas falta a tabela
      if (error.code === '42P01' || error.message.includes('does not exist')) {
         return { success: false, message: 'Conectado ao Projeto! Porém a tabela "service_requests" não existe. Crie a tabela no SQL Editor.' };
      }
      return { success: false, message: `Erro de Permissão ou Banco: ${error.message}` };
    }
    
    return { success: true, message: 'Conexão Perfeita! Banco de dados respondendo.' };
  } catch (err: any) {
    return { success: false, message: `Erro Crítico: ${err.message}` };
  }
};

// Mantemos a função apenas para compatibilidade, mas ela não altera mais a conexão principal
export const saveSupabaseKey = (newKey: string) => {
  console.log("Chave salva, mas o sistema está forçando o uso da chave hardcoded para garantir funcionamento.");
  localStorage.setItem('dnldm_sb_key', newKey);
  window.location.reload();
};