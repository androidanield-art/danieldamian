import { createClient } from '@supabase/supabase-js';

// Configurações do Projeto
const PROJECT_URL = 'https://gckevbrutmpgeukrkdic.supabase.co';
const DEFAULT_ANON_KEY = 'sb_publishable_-fAOYhzuUlfoPLP2-SsXWQ_gkY1TzJz';

// Função para buscar a chave (prioriza localStorage se houver override, senão usa a padrão)
const getActiveKey = () => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('dnldm_sb_key');
    if (stored) return stored;
  }
  return DEFAULT_ANON_KEY;
};

// Inicializa o cliente Supabase
// A chave 'anon' pública é segura para uso no lado do cliente com RLS ativado
export const supabase = createClient(PROJECT_URL, getActiveKey());

// Função auxiliar para salvar a chave via UI (override manual)
export const saveSupabaseKey = (newKey: string) => {
  localStorage.setItem('dnldm_sb_key', newKey);
  window.location.reload();
};

// Como temos uma chave padrão hardcoded, o cliente está sempre configurado
export const isSupabaseConfigured = () => true;