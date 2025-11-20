import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { FileText, ShieldCheck, Briefcase, Loader2 } from 'lucide-react';

interface LoginProps {
  setView: (v: 'login' | 'register') => void;
}

export const Login: React.FC<LoginProps> = ({ setView }) => {
  const { login, isLoading } = useApp();
  const [error, setError] = useState('');

  const handleLogin = async (email: string, role: UserRole) => {
    setError('');
    const success = await login(email, role);
    if (!success) {
      setError('Usuário não encontrado. (Dica: Cadastre uma empresa primeiro ou use admin@docflow.com)');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
            <FileText size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">DocFlow</h1>
          <p className="text-gray-500 mt-2">Controle inteligente de documentos</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center gap-2">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Supplier Login Button */}
          <button
            onClick={() => handleLogin('joao@tech.com', UserRole.SUPPLIER)}
            disabled={isLoading}
            className="w-full flex items-center p-4 border-2 border-gray-100 hover:border-primary-500 hover:bg-primary-50 rounded-xl transition-all group text-left disabled:opacity-60"
          >
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg mr-4 group-hover:bg-primary-200 group-hover:text-primary-700">
              {isLoading ? <Loader2 className="animate-spin" /> : <Briefcase size={24} />}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Fornecedor</h3>
              <p className="text-sm text-gray-500">Gerencie envios e cadastros</p>
            </div>
          </button>

          {/* Admin Login Button */}
          <button
            onClick={() => handleLogin('admin@docflow.com', UserRole.ADMIN)}
            disabled={isLoading}
            className="w-full flex items-center p-4 border-2 border-gray-100 hover:border-purple-500 hover:bg-purple-50 rounded-xl transition-all group text-left disabled:opacity-60"
          >
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg mr-4 group-hover:bg-purple-200 group-hover:text-purple-700">
               {isLoading ? <Loader2 className="animate-spin" /> : <ShieldCheck size={24} />}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Administrador</h3>
              <p className="text-sm text-gray-500">Moderação e gestão</p>
            </div>
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500">Nova empresa?</p>
          <button 
            onClick={() => setView('register')}
            className="mt-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors"
          >
            Criar Conta de Fornecedor
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper for the error icon inside the component
const AlertCircle = ({ size }: { size: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
);
