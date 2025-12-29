import { createClient } from '@supabase/supabase-js';

// Tenta pegar das variáveis de ambiente (Vercel/Vite) primeiro
// Se não existir, usa o fallback hardcoded (para funcionamento local rápido)
const PROJECT_URL = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://gckevbrutmpgeukrkdic.supabase.co';
const DEFAULT_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'sb_publishable_-fAOYhzuUlfoPLP2-SsXWQ_gkY1TzJz';

// Função para buscar a chave (prioriza localStorage se houver override, senão usa a env/padrão)
const getActiveKey = () => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('dnldm_sb_key');
    if (stored) return stored;
  }
  return DEFAULT_ANON_KEY;
};

// Inicializa o cliente Supabase
export const supabase = createClient(PROJECT_URL, getActiveKey());

// Função auxiliar para salvar a chave via UI (override manual)
export const saveSupabaseKey = (newKey: string) => {
  localStorage.setItem('dnldm_sb_key', newKey);
  window.location.reload();
};

export const isSupabaseConfigured = () => {
  return !!PROJECT_URL && !!getActiveKey();
};