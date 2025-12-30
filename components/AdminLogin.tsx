import React, { useState } from 'react';
import { Button } from './Button';
import { Lock, Settings, X, Database, CheckCircle, AlertCircle, Loader2, Copy, FileCode } from 'lucide-react';
import { saveSupabaseConfig, isSupabaseConfigured, testConnection } from '../services/supabaseClient';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showConfig, setShowConfig] = useState(false);
  
  const [configUrl, setConfigUrl] = useState('');
  const [configKey, setConfigKey] = useState('');
  
  // Estados para o teste
  const [testStatus, setTestStatus] = useState<{success: boolean; message: string} | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'dnldm' && password === '2705') {
      setError('');
      onLoginSuccess();
    } else {
      setError('Credenciais inválidas.');
    }
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (configUrl.trim() && configKey.trim()) {
      saveSupabaseConfig(configUrl.trim(), configKey.trim());
    }
  };

  const runConnectionTest = async () => {
    setIsTesting(true);
    setTestStatus(null);
    const result = await testConnection();
    setTestStatus(result);
    setIsTesting(false);
  };

  const copySQL = () => {
    const sql = `
-- SOLUÇÃO DE ERROS DE TABELA EXISTENTE

-- OPÇÃO A: Limpeza Total (Recomendado se tiver problemas de colunas)
-- Apaga a tabela antiga e cria do zero. REMOVE TODOS OS DADOS.
-- Descomente a linha abaixo para usar:
-- drop table if exists service_requests cascade;

-- OPÇÃO B: Criação Segura (Mantém dados se a tabela existir)
create table if not exists service_requests (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  client_name text not null,
  client_email text,
  service_type text,
  description text,
  status text default 'Pendente',
  tags text[] default '{}',
  budget text,
  reference_file_name text,
  client_access_code text
);

-- Configura permissões (RLS)
alter table service_requests enable row level security;

-- Remove políticas antigas para evitar o erro "policy already exists"
drop policy if exists "Permitir acesso total publico" on service_requests;
drop policy if exists "Public Access" on service_requests;
drop policy if exists "Acesso Publico Total" on service_requests;

-- Cria a nova política
create policy "Permitir acesso total publico"
on service_requests
for all
to anon
using (true)
with check (true);
    `;
    navigator.clipboard.writeText(sql);
    alert("Código SQL Atualizado copiado! Cole no SQL Editor do Supabase.");
  };

  return (
    <>
      <div className="w-full max-w-md p-8 bg-brand-dark border border-white/5 shadow-2xl relative">
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-white/5 rounded-full mb-4">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Acesso Restrito</h2>
          <p className="text-gray-500 text-sm mt-2">Painel Administrativo Daniel Damian</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Usuário</label>
            <input
              type="text"
              className="w-full bg-black/50 border border-white/10 rounded-none px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Senha</label>
            <input
              type="password"
              className="w-full bg-black/50 border border-white/10 rounded-none px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <Button type="submit" fullWidth>
            Entrar
          </Button>
        </form>

        <div className="mt-6 pt-4 border-t border-white/5 flex justify-center">
           <button 
             onClick={() => setShowConfig(true)}
             className={`flex items-center gap-2 text-xs hover:text-white transition-colors ${isSupabaseConfigured() ? 'text-green-500' : 'text-gray-600'}`}
           >
             <Settings size={12} />
             {isSupabaseConfigured() ? 'Banco de Dados Conectado' : 'Configurar Banco de Dados'}
           </button>
        </div>
      </div>

      {showConfig && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="bg-brand-dark border border-white/10 w-full max-w-md rounded-lg shadow-2xl p-6">
            <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold text-white flex items-center gap-2">
                 <Database size={16} className="text-blue-500" />
                 Conexão Supabase
               </h3>
               <button onClick={() => setShowConfig(false)} className="text-gray-400 hover:text-white">
                 <X size={20} />
               </button>
            </div>

            <p className="text-xs text-gray-400 mb-4 leading-relaxed">
              Vá em <strong>Project Settings &gt; API</strong> no Supabase para pegar as chaves.
            </p>

            <form onSubmit={handleSaveConfig} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Project URL</label>
                <input
                  type="text"
                  placeholder="https://sua-id.supabase.co"
                  className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white text-sm focus:border-blue-500 outline-none"
                  value={configUrl}
                  onChange={e => setConfigUrl(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Anon Public Key</label>
                <input
                  type="password"
                  placeholder="eyJh..."
                  className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white text-sm focus:border-blue-500 outline-none"
                  value={configKey}
                  onChange={e => setConfigKey(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                {isSupabaseConfigured() && (
                   <Button 
                    type="button" 
                    variant="outline" 
                    className="flex-1 h-10 text-xs"
                    onClick={runConnectionTest}
                    disabled={isTesting}
                  >
                    {isTesting ? <Loader2 className="animate-spin w-4 h-4" /> : 'Testar Conexão'}
                  </Button>
                )}
                <Button type="submit" fullWidth className="flex-1 h-10 text-sm">
                  Salvar Configuração
                </Button>
              </div>
            </form>

            {testStatus && (
              <div className={`mt-4 p-3 rounded border text-xs flex items-start gap-2 ${testStatus.success ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                {testStatus.success ? <CheckCircle size={14} className="mt-0.5 shrink-0" /> : <AlertCircle size={14} className="mt-0.5 shrink-0" />}
                <span>{testStatus.message}</span>
              </div>
            )}
            
            <div className="mt-6 pt-4 border-t border-white/10">
               <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-2">
                 <FileCode size={14} className="text-yellow-500"/> 
                 Configuração da Tabela
               </h4>
               
               <p className="text-[10px] text-gray-500 mb-3">
                 Se o teste de conexão diz que a tabela já existe (Erro 42P07), use o botão abaixo para copiar o SQL corrigido que resolve isso.
               </p>

               <button 
                  onClick={copySQL}
                  className="w-full flex items-center justify-center gap-2 p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors group"
                >
                  <Copy className="w-4 h-4 text-gray-400 group-hover:text-white" />
                  <span className="text-xs text-gray-300 font-medium">Copiar SQL Corrigido</span>
                </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};