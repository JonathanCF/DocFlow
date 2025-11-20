import { User, Company, Document, UserRole, DocumentStatus, CompanyStatus, CreateCompanyDTO, CreateUserDTO } from '../types';

/**
 * MOCK BACKEND SERVICE
 * 
 * In a real Next.js app, this would be replaced by `fetch` calls to `/api/...`
 * accessing the Prisma Client.
 * 
 * Currently uses LocalStorage to simulate a real database so the app is functional
 * without a running Node.js server in the browser preview.
 */

const DELAY_MS = 600; // Simulate network latency

// Keys for LocalStorage
const DB_KEYS = {
  USERS: 'docflow_users',
  COMPANIES: 'docflow_companies',
  DOCUMENTS: 'docflow_documents'
};

// Helper to simulate async DB calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Initialize DB if empty (Seed Admin)
const initializeDB = () => {
  if (!localStorage.getItem(DB_KEYS.USERS)) {
    const admin: User = {
      id: 'admin-uuid',
      name: 'Admin Master',
      email: 'admin@docflow.com',
      role: UserRole.ADMIN
    };
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify([admin]));
    localStorage.setItem(DB_KEYS.COMPANIES, JSON.stringify([]));
    localStorage.setItem(DB_KEYS.DOCUMENTS, JSON.stringify([]));
  }
};

initializeDB();

// --- API METHODS ---

export const api = {
  
  auth: {
    // Returns object with user if successful, or error message string if failed
    login: async (email: string, role: UserRole): Promise<{ user: User | null, error?: string }> => {
      await delay(DELAY_MS);
      const users: User[] = JSON.parse(localStorage.getItem(DB_KEYS.USERS) || '[]');
      
      // 1. Find User
      const user = users.find(u => u.email === email && u.role === role);
      
      if (!user) {
        return { user: null, error: 'Usuário não encontrado.' };
      }

      // 2. If Admin, bypass company check
      if (user.role === UserRole.ADMIN) {
        return { user };
      }

      // 3. If Supplier, check Company Status
      if (user.companyId) {
        const companies: Company[] = JSON.parse(localStorage.getItem(DB_KEYS.COMPANIES) || '[]');
        const company = companies.find(c => c.id === user.companyId);
        
        if (company) {
          if (company.status === CompanyStatus.PENDING) {
            return { user: null, error: 'Seu cadastro está em análise. Aguarde a liberação do administrador.' };
          }
          if (company.status === CompanyStatus.REJECTED) {
            return { user: null, error: 'Seu cadastro foi recusado. Entre em contato com o suporte.' };
          }
        }
      }

      return { user };
    },

    registerSupplier: async (companyData: CreateCompanyDTO, userData: CreateUserDTO): Promise<User> => {
      await delay(DELAY_MS);
      
      const companies: Company[] = JSON.parse(localStorage.getItem(DB_KEYS.COMPANIES) || '[]');
      const users: User[] = JSON.parse(localStorage.getItem(DB_KEYS.USERS) || '[]');

      // 1. Create Company (Simulating Prisma.company.create)
      const newCompany: Company = {
        ...companyData,
        id: crypto.randomUUID(),
        status: CompanyStatus.PENDING, // Default to PENDING
        createdAt: new Date().toISOString()
      };

      // 2. Create User (Simulating Prisma.user.create)
      const newUser: User = {
        ...userData,
        id: crypto.randomUUID(),
        role: UserRole.SUPPLIER,
        companyId: newCompany.id
      };

      // Save to "DB"
      companies.push(newCompany);
      users.push(newUser);
      
      localStorage.setItem(DB_KEYS.COMPANIES, JSON.stringify(companies));
      localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));

      return newUser;
    }
  },

  document: {
    upload: async (file: File, name: string, user: User): Promise<Document> => {
      await delay(DELAY_MS);
      if (!user.companyId) throw new Error("User has no company");

      const docs: Document[] = JSON.parse(localStorage.getItem(DB_KEYS.DOCUMENTS) || '[]');

      const newDoc: Document = {
        id: crypto.randomUUID(),
        userId: user.id,
        companyId: user.companyId,
        name: name,
        fileType: file.name.split('.').pop()?.toLowerCase() as any || 'pdf',
        fileUrl: URL.createObjectURL(file), // In a real app, this would be an S3/Blob URL
        uploadedAt: new Date().toISOString(),
        status: DocumentStatus.PENDING
      };

      docs.push(newDoc);
      localStorage.setItem(DB_KEYS.DOCUMENTS, JSON.stringify(docs));
      
      return newDoc;
    },

    listByCompany: async (companyId: string): Promise<Document[]> => {
      await delay(DELAY_MS / 2); // Faster read
      const docs: Document[] = JSON.parse(localStorage.getItem(DB_KEYS.DOCUMENTS) || '[]');
      return docs.filter(d => d.companyId === companyId).sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
    },

    listAll: async (): Promise<Document[]> => {
      await delay(DELAY_MS / 2);
      const docs: Document[] = JSON.parse(localStorage.getItem(DB_KEYS.DOCUMENTS) || '[]');
      return docs.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
    },

    updateStatus: async (docId: string, status: DocumentStatus, reason?: string): Promise<Document> => {
      await delay(DELAY_MS);
      const docs: Document[] = JSON.parse(localStorage.getItem(DB_KEYS.DOCUMENTS) || '[]');
      const index = docs.findIndex(d => d.id === docId);
      
      if (index === -1) throw new Error("Document not found");

      docs[index] = { ...docs[index], status, rejectionReason: reason };
      localStorage.setItem(DB_KEYS.DOCUMENTS, JSON.stringify(docs));
      
      return docs[index];
    }
  },

  company: {
    getById: async (id: string): Promise<Company | undefined> => {
      const companies: Company[] = JSON.parse(localStorage.getItem(DB_KEYS.COMPANIES) || '[]');
      return companies.find(c => c.id === id);
    },
    
    listAll: async (): Promise<{ company: Company, responsible: User }[]> => {
      await delay(DELAY_MS);
      const companies: Company[] = JSON.parse(localStorage.getItem(DB_KEYS.COMPANIES) || '[]');
      const users: User[] = JSON.parse(localStorage.getItem(DB_KEYS.USERS) || '[]');

      return companies.map(comp => {
        const responsible = users.find(u => u.companyId === comp.id) || users[0]; // Fallback
        return { company: comp, responsible };
      });
    },

    updateStatus: async (companyId: string, status: CompanyStatus): Promise<void> => {
      await delay(DELAY_MS);
      const companies: Company[] = JSON.parse(localStorage.getItem(DB_KEYS.COMPANIES) || '[]');
      const index = companies.findIndex(c => c.id === companyId);
      
      if (index !== -1) {
        companies[index].status = status;
        localStorage.setItem(DB_KEYS.COMPANIES, JSON.stringify(companies));
      }
    }
  }
};