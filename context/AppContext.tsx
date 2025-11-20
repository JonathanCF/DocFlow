import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Company, Document, UserRole, DocumentStatus, AppState } from '../types';

interface AppContextType extends AppState {
  login: (email: string, role: UserRole) => void;
  logout: () => void;
  registerCompany: (company: Omit<Company, 'id'>, user: Omit<User, 'id' | 'companyId' | 'role'>) => void;
  uploadDocument: (file: File, name: string) => void;
  updateDocumentStatus: (docId: string, status: DocumentStatus, reason?: string) => void;
  getSupplierCompany: (userId: string) => Company | undefined;
  getSupplierName: (userId: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock Initial Data
const INITIAL_COMPANIES: Company[] = [
  {
    id: 'c1',
    cnpj: '12.345.678/0001-99',
    fantasyName: 'Tech Supplies Ltda',
    socialReason: 'Tech Supplies Comércio de Eletrônicos',
    zipCode: '01001-000',
    address: 'Av. Paulista',
    number: '1000',
    neighborhood: 'Bela Vista',
    city: 'São Paulo',
    state: 'SP',
    phone: '(11) 99999-9999'
  }
];

const INITIAL_USERS: User[] = [
  { id: 'u1', name: 'Admin Master', email: 'admin@docflow.com', role: UserRole.ADMIN },
  { id: 'u2', name: 'João Fornecedor', email: 'joao@tech.com', role: UserRole.SUPPLIER, companyId: 'c1' }
];

const INITIAL_DOCS: Document[] = [
  {
    id: 'd1',
    userId: 'u2',
    companyId: 'c1',
    name: 'Contrato Social',
    fileType: 'pdf',
    fileUrl: '#',
    uploadedAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    status: DocumentStatus.APPROVED
  },
  {
    id: 'd2',
    userId: 'u2',
    companyId: 'c1',
    name: 'Certidão Negativa',
    fileType: 'pdf',
    fileUrl: '#',
    uploadedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    status: DocumentStatus.PENDING
  }
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    users: INITIAL_USERS,
    companies: INITIAL_COMPANIES,
    documents: INITIAL_DOCS,
    currentUser: null,
  });

  const login = (email: string, role: UserRole) => {
    // Mock login logic - simpler for demo: finds first user with role
    const user = state.users.find(u => u.role === role); 
    if (user) {
      setState(prev => ({ ...prev, currentUser: user }));
    }
  };

  const logout = () => {
    setState(prev => ({ ...prev, currentUser: null }));
  };

  const registerCompany = (companyData: Omit<Company, 'id'>, userData: Omit<User, 'id' | 'companyId' | 'role'>) => {
    const newCompanyId = `c${Date.now()}`;
    const newUserId = `u${Date.now()}`;

    const newCompany: Company = { ...companyData, id: newCompanyId };
    const newUser: User = { ...userData, id: newUserId, role: UserRole.SUPPLIER, companyId: newCompanyId };

    setState(prev => ({
      ...prev,
      companies: [...prev.companies, newCompany],
      users: [...prev.users, newUser],
      currentUser: newUser
    }));
  };

  const uploadDocument = (file: File, name: string) => {
    if (!state.currentUser || state.currentUser.role !== UserRole.SUPPLIER) return;

    const newDoc: Document = {
      id: `d${Date.now()}`,
      userId: state.currentUser.id,
      companyId: state.currentUser.companyId!,
      name: name,
      fileType: file.name.split('.').pop()?.toLowerCase() as 'pdf' | 'jpg' | 'png' || 'pdf',
      fileUrl: URL.createObjectURL(file),
      uploadedAt: new Date().toISOString(),
      status: DocumentStatus.PENDING
    };

    setState(prev => ({
      ...prev,
      documents: [newDoc, ...prev.documents]
    }));
  };

  const updateDocumentStatus = (docId: string, status: DocumentStatus, reason?: string) => {
    setState(prev => ({
      ...prev,
      documents: prev.documents.map(doc => 
        doc.id === docId ? { ...doc, status, rejectionReason: reason } : doc
      )
    }));
  };

  const getSupplierCompany = (userId: string) => {
    const user = state.users.find(u => u.id === userId);
    if (!user?.companyId) return undefined;
    return state.companies.find(c => c.id === user.companyId);
  };

  const getSupplierName = (userId: string) => {
    return state.users.find(u => u.id === userId)?.name || 'Desconhecido';
  };

  return (
    <AppContext.Provider value={{ 
      ...state, 
      login, 
      logout, 
      registerCompany, 
      uploadDocument, 
      updateDocumentStatus,
      getSupplierCompany,
      getSupplierName
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};