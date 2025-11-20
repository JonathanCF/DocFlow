/**
 * Application Types
 * Aligned with Prisma Schema definitions
 */

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
  createdAt?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId?: string;
}

export interface Document {
  id: string;
  userId: string;
  companyId: string;
  name: string;
  fileType: 'pdf' | 'jpg' | 'png';
  fileUrl: string;
  uploadedAt: string; // ISO string sent from backend
  status: DocumentStatus;
  rejectionReason?: string;
}

// DTOs (Data Transfer Objects) for creation
export interface CreateCompanyDTO extends Omit<Company, 'id' | 'createdAt'> {}
export interface CreateUserDTO extends Omit<User, 'id' | 'companyId' | 'role'> {}

export interface AppState {
  currentUser: User | null;
  isLoading: boolean;
}
