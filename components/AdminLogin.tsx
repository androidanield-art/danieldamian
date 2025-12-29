import React, { useState } from 'react';
import { Button } from './Button';
import { Lock } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'dnldm' && password === '2705') {
      setError('');
      onLoginSuccess();
    } else {
      setError('Credenciais inválidas.');
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-brand-dark border border-white/5 shadow-2xl">
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
    </div>
  );
};