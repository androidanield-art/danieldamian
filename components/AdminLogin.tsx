import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Lock, X, CheckCircle, AlertCircle, Loader2, Copy, Terminal, ShieldAlert } from 'lucide-react';
import { testConnection } from '../services/supabaseClient';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // Status do Sistema
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [dbStatus, setDbStatus] = useState<{success: boolean; code?: string; message: string} | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  // Verifica conexão automaticamente ao carregar a tela
  useEffect(() => {
    checkSystem();
  }, []);

  const checkSystem = async () => {
    setIsChecking(true);
    const result = await testConnection();
    setDbStatus(result);
    // Se a tabela estiver faltando, abre o diagnóstico automaticamente para ajudar
    if (result.code === 'TABLE_MISSING') {
      setShowDiagnostics(true);
    }
    setIsChecking(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'dnldm' && password === '2705') {
      setError('');
      onLoginSuccess();
    } else {
      setError('Credenciais inválidas.');
    }
  };

  const copySQL = () => {
    const sql = `
-- CRIAÇÃO AUTOMÁTICA DA TABELA
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

-- HABILITAR SEGURANÇA
alter table service_requests enable row level security;

-- LIMPAR POLÍTICAS ANTIGAS (EVITA ERROS)
drop policy if exists "Permitir acesso total publico" on service_requests;
drop policy if exists "Public Access" on service_requests;

-- CRIAR POLÍTICA DE ACESSO
create policy "Permitir acesso total publico"
on service_requests
for all
to anon
using (true)
with check (true);
    `;
    navigator.clipboard.writeText(sql);
    alert("Código SQL copiado! Cole no SQL Editor do Supabase.");
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
           {isChecking ? (
             <span className="text-xs text-gray-500 flex items-center gap-2"><Loader2 className="animate-spin w-3 h-3"/> Verificando sistema...</span>
           ) : (
             <button 
               onClick={() => setShowDiagnostics(true)}
               className={`flex items-center gap-2 text-xs transition-colors px-3 py-2 rounded-full border ${
                 dbStatus?.success 
                   ? 'text-green-500 border-green-500/20 bg-green-500/5' 
                   : 'text-red-400 border-red-500/20 bg-red-500/5'
               }`}
             >
               {dbStatus?.success ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
               {dbStatus?.success ? 'Sistema Online' : 'Verificar Banco de Dados'}
             </button>
           )}
        </div>
      </div>

      {showDiagnostics && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="bg-brand-dark border border-white/10 w-full max-w-md rounded-lg shadow-2xl p-6">
            <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold text-white flex items-center gap-2">
                 <Terminal size={16} className="text-gray-400" />
                 Diagnóstico do Sistema
               </h3>
               <button onClick={() => setShowDiagnostics(false)} className="text-gray-400 hover:text-white">
                 <X size={20} />
               </button>
            </div>

            <div className={`p-4 rounded-lg border mb-6 ${
               dbStatus?.success 
               ? 'bg-green-500/10 border-green-500/20 text-green-400' 
               : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}>
               <div className="flex items-start gap-3">
                 {dbStatus?.success ? <CheckCircle className="shrink-0 mt-1" /> : <ShieldAlert className="shrink-0 mt-1" />}
                 <div>
                   <h4 className="font-bold text-sm mb-1">
                     {dbStatus?.success ? 'Conexão Estabelecida' : 'Atenção Necessária'}
                   </h4>
                   <p className="text-xs opacity-90 leading-relaxed">
                     {dbStatus?.message}
                   </p>
                 </div>
               </div>
            </div>

            {!dbStatus?.success && dbStatus?.code === 'TABLE_MISSING' && (
              <div className="space-y-4">
                 <p className="text-xs text-gray-400">
                   A conexão com o Supabase foi bem sucedida, mas a tabela de dados ainda não existe. 
                   Clique abaixo para copiar o código de correção.
                 </p>
                 <button 
                    onClick={copySQL}
                    className="w-full flex items-center justify-center gap-2 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm"
                  >
                    <Copy className="w-4 h-4" />
                    Copiar Código SQL de Correção
                  </button>
                  <p className="text-[10px] text-gray-600 text-center">
                    Cole este código no SQL Editor do seu painel Supabase.
                  </p>
              </div>
            )}
            
            {dbStatus?.success && (
              <div className="text-center">
                <Button variant="outline" onClick={() => setShowDiagnostics(false)} fullWidth>
                  Fechar
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};