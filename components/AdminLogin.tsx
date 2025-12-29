import React, { useState } from 'react';
import { Button } from './Button';
import { Lock, Settings, X, Database, CheckCircle, AlertCircle, Loader2, Download, FileSpreadsheet } from 'lucide-react';
import { saveSupabaseKey, isSupabaseConfigured, testConnection } from '../services/supabaseClient';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showConfig, setShowConfig] = useState(false);
  const [apiKey, setApiKey] = useState('');
  
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

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      saveSupabaseKey(apiKey.trim());
    }
  };

  const runConnectionTest = async () => {
    setIsTesting(true);
    setTestStatus(null);
    const result = await testConnection();
    setTestStatus(result);
    setIsTesting(false);
  };

  const handleDownloadCsvTemplate = () => {
    // Cabeçalhos exatos que o sistema espera
    const headers = [
      'id',
      'created_at',
      'client_name',
      'client_email',
      'service_type',
      'description',
      'status',
      'tags',
      'budget',
      'reference_file_name'
    ];

    // Linha de exemplo para ajudar o Supabase a detectar os tipos de dados (texto, número, array)
    // Importante: tags está entre aspas e chaves "{}" para simular array do Postgres
    const dummyRow = [
      'exemplo_id_123',
      '1709232000000',
      'Cliente Exemplo',
      'cliente@email.com',
      'Custom Wear',
      'Descrição do projeto exemplo',
      'Pendente',
      '"{Pendente de Orçamento}"',
      '1500,00',
      'referencia.jpg'
    ];

    const csvContent = [headers.join(','), dummyRow.join(',')].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'modelo_criar_tabela_supabase.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
              <span className="text-blue-400">https://hakvrpgmieqhnvduppnh.supabase.co</span>
              <br/><br/>
              A chave pública já foi inserida no código. Você pode testar a conexão diretamente ou sobrescrever com uma nova chave abaixo.
            </p>

            <form onSubmit={handleSaveKey} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Anon Public Key (Opcional)</label>
                <input
                  type="password"
                  placeholder="Seu código já tem a chave, deixe em branco para usar a padrão"
                  className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white text-sm focus:border-blue-500 outline-none"
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
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
                  Salvar Nova Chave
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
                 <FileSpreadsheet size={14} className="text-green-500"/> 
                 Opções de Criação de Tabela
               </h4>
               
               <p className="text-[10px] text-gray-500 mb-3">
                 Escolha como deseja criar a tabela <strong>service_requests</strong> no Supabase:
               </p>

               <div className="grid grid-cols-2 gap-3 mb-4">
                  <button 
                    onClick={handleDownloadCsvTemplate}
                    className="flex flex-col items-center justify-center p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors group"
                  >
                    <Download className="w-5 h-5 text-gray-400 group-hover:text-white mb-1" />
                    <span className="text-[10px] text-gray-300 font-medium">Baixar CSV</span>
                    <span className="text-[9px] text-gray-500">Para "Import Data"</span>
                  </button>
                  <div className="flex items-center justify-center p-3 bg-black/40 border border-white/5 rounded-lg">
                    <span className="text-[10px] text-gray-500 text-center">Ou copie o SQL abaixo para o "SQL Editor"</span>
                  </div>
               </div>

               <pre className="bg-black/50 p-2 rounded text-[9px] text-gray-400 overflow-x-auto custom-scrollbar select-all border border-white/5">
{`create table if not exists service_requests (
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
);

alter table service_requests enable row level security;
create policy "Public Access" on service_requests for all using (true) with check (true);`}
               </pre>
            </div>
          </div>
        </div>
      )}
    </>
  );
};