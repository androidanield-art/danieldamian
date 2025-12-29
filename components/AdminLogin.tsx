import React, { useState } from 'react';
import { Button } from './Button';
import { Lock, Settings, X, Database } from 'lucide-react';
import { saveSupabaseKey, isSupabaseConfigured } from '../services/supabaseClient';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showConfig, setShowConfig] = useState(false);
  const [apiKey, setApiKey] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'dnldm' && password === '2705') {
      setError('');
      onLoginSuccess();
    } else {
      setError('Credenciais inválidas.');
    }
  };

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      saveSupabaseKey(apiKey.trim());
    }
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
              O projeto foi configurado com a URL: <br/>
              <span className="text-blue-400">https://gckevbrutmpgeukrkdic.supabase.co</span>
              <br/><br/>
              Insira abaixo sua chave pública (ANON KEY) encontrada nas configurações de API do Supabase para habilitar a conexão.
            </p>

            <form onSubmit={handleSaveKey} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Anon Public Key</label>
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white text-sm focus:border-blue-500 outline-none"
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                />
              </div>
              
              <Button type="submit" fullWidth className="h-10 text-sm">
                Salvar e Conectar
              </Button>
            </form>
            
            <div className="mt-4 pt-4 border-t border-white/10">
               <p className="text-[10px] text-gray-500">
                 Dica: Execute este SQL no Supabase para garantir que a tabela existe:
               </p>
               <pre className="mt-2 bg-black/50 p-2 rounded text-[10px] text-gray-400 overflow-x-auto">
{`create table service_requests (
  id text primary key,
  created_at bigint,
  client_name text,
  client_email text,
  service_type text,
  description text,
  status text,
  tags text[],
  budget text,
  reference_file_name text
);`}
               </pre>
            </div>
          </div>
        </div>
      )}
    </>
  );
};