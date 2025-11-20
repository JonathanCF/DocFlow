export enum UserRole {
  ADMIN = 'ADMIN',
  SUPPLIER = 'SUPPLIER'
}

export enum DocumentStatus {
  PENDING = 'PENDING', // Aguardando
  APPROVED = 'APPROVED', // Aprovado
  REJECTED = 'REJECTED' // Reprovado
}

export interface Company {
  id: string;
  cnpj: string;
  fantasyName: string;
  socialReason: string;
  zipCode: string;
  address: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  phone: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId?: string; // Only for suppliers
}

export interface Document {
  id: string;
  userId: string; // The supplier who uploaded it
  companyId: string; // To link to company
  name: string;
  fileType: 'pdf' | 'jpg' | 'png';
  fileUrl: string; // Mock URL
  uploadedAt: string; // ISO Date
  status: DocumentStatus;
  rejectionReason?: string;
}

// Mock Data Interface
export interface AppState {
  users: User[];
  companies: Company[];
  documents: Document[];
  currentUser: User | null;
}