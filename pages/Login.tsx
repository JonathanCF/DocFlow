
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { ShieldCheck, Briefcase, Loader2, LogIn, Eye, EyeOff, Info } from 'lucide-react';
import { Logo } from '../components/ui/Logo';

interface LoginProps {
  setView: (v: 'login' | 'register') => void;
}

export const Login: React.FC<LoginProps> = ({ setView }) => {
  const { login, isLoading } = useApp();
  
  // View State
  const [activeTab, setActiveTab] = useState<'supplier' | 'admin'>('supplier');
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email || !password) {
      setError('Preencha e-mail e senha.');
      return;
    }
    setError('');
    
    const role = activeTab === 'admin' ? UserRole.ADMIN : UserRole.SUPPLIER;
    const result = await login(email, password, role);
    
    if (!result.success) {
      setError(result.error || 'Erro ao tentar login. Verifique suas credenciais.');
    }
  };

  const prefillDemo = (type: 'supplier' | 'admin') => {
    setError('');
    if (type === 'supplier') {
      setActiveTab('supplier');
      setEmail('joao@tech.com');
      setPassword('123456');
    } else {
      setActiveTab('admin');
      setEmail('admin@docflow.com');
      setPassword('123456');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        
        <div className="p-8 pb-6 flex flex-col items-center">
          <div className="scale-125 mb-2">
            <Logo size="lg" />
          </div>
          <p className="text-gray-500 mt-4 text-sm">Portal de Gestão de Documentos</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => { setActiveTab('supplier'); setError(''); }}
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'supplier' 
                ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50/30' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Briefcase size={18} />
            Sou Fornecedor
          </button>
          <button
            onClick={() => { setActiveTab('admin'); setError(''); }}
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'admin' 
                ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50/30' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <ShieldCheck size={18} />
            Administrador
          </button>
        </div>

        <div className="p-8 pt-6">
          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={16} className="shrink-0" /> <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={activeTab === 'supplier' ? "seu@email.com" : "admin@docflow.com"} 
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm transition-all pr-10"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2.5 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-md ${
                activeTab === 'supplier' 
                  ? 'bg-primary-600 hover:bg-primary-700 shadow-primary-200' 
                  : 'bg-purple-600 hover:bg-purple-700 shadow-purple-200'
              } disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : (
                 <>
                   <LogIn size={18} />
                   {activeTab === 'supplier' ? 'Entrar como Fornecedor' : 'Acessar Painel Admin'}
                 </>
              )}
            </button>
          </form>
          
          {activeTab === 'supplier' && (
            <>
              <p className="text-xs text-gray-400 mt-4 text-center flex items-center justify-center gap-1">
                <Info size={12} />
                Novos cadastros requerem aprovação do Admin.
              </p>

              <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                <p className="text-sm text-gray-500">Sua empresa ainda não tem cadastro?</p>
                <button 
                  onClick={() => setView('register')}
                  className="mt-1 text-primary-600 font-semibold hover:text-primary-700 transition-colors"
                >
                  Cadastrar Fornecedor
                </button>
              </div>
            </>
          )}

          {/* Demo Section */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-400 uppercase font-semibold text-center mb-3 tracking-wider">Credenciais de Demonstração</p>
            <div className="flex gap-3">
              <button
                 onClick={() => prefillDemo('supplier')}
                 className="flex-1 text-xs py-2 px-3 bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-blue-700 rounded border border-gray-200 transition-colors text-center"
              >
                Preencher Fornecedor
              </button>
              <button
                 onClick={() => prefillDemo('admin')}
                 className="flex-1 text-xs py-2 px-3 bg-gray-50 hover:bg-purple-50 text-gray-600 hover:text-purple-700 rounded border border-gray-200 transition-colors text-center"
              >
                Preencher Admin
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// Helper for the error icon inside the component
const AlertCircle = ({ size, className }: { size: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
);
