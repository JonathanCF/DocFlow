import React from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { FileText, ShieldCheck, Briefcase } from 'lucide-react';

export const Login: React.FC<{ setView: (v: 'login' | 'register') => void }> = ({ setView }) => {
  const { login } = useApp();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
            <FileText size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Bem-vindo ao DocFlow</h1>
          <p className="text-gray-500 mt-2 text-center">Gerenciamento inteligente de documentos</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => login('joao@tech.com', UserRole.SUPPLIER)}
            className="w-full flex items-center p-4 border-2 border-gray-100 hover:border-primary-500 hover:bg-primary-50 rounded-xl transition-all group text-left"
          >
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg mr-4 group-hover:bg-primary-200 group-hover:text-primary-700">
              <Briefcase size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Entrar como Fornecedor</h3>
              <p className="text-sm text-gray-500">Gerencie seus documentos e empresa</p>
            </div>
          </button>

          <button
            onClick={() => login('admin@docflow.com', UserRole.ADMIN)}
            className="w-full flex items-center p-4 border-2 border-gray-100 hover:border-purple-500 hover:bg-purple-50 rounded-xl transition-all group text-left"
          >
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg mr-4 group-hover:bg-purple-200 group-hover:text-purple-700">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Entrar como Admin</h3>
              <p className="text-sm text-gray-500">Moderação e gestão de acesso</p>
            </div>
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500">Ainda não tem cadastro?</p>
          <button 
            onClick={() => setView('register')}
            className="mt-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors"
          >
            Cadastrar minha empresa
          </button>
        </div>
      </div>
    </div>
  );
};