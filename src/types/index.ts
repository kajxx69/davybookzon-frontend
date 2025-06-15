export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'admin';
  isActive: boolean;
  createdAt: string;
}

export interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  isActive: boolean;
}

export interface Book {
  _id: string;
  title: string;
  description: string;
  shortDescription: string;
  author: string;
  category: string;
  price: number;
  coverImage: {
    public_id: string;
    url: string;
  };
  pdfFile: {
    public_id: string;
    url: string;
    originalName: string;
    size: number;
  };
  isActive: boolean;
  purchaseCount: number;
  viewCount: number;
  createdAt: string;
  telegramContact: string;
  whatsappContact: string;
  addedBy: string;
}

export interface Message {
  _id: string;
  from: string;
  email: string;
  subject: string;
  content: string;
  isRead: boolean;
  response?: string;
  createdAt: string;
}

export interface AppSettings {
  sections: {
    booksSection: boolean;
    contactSection: boolean;
    heroSection: boolean;
  };
  contacts: {
    telegram: string;
    whatsapp: string;
    email: string;
  };
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthContextType {
  user: User | null;
  login: (data: LoginData) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
}

export interface BookFormData {
  title: string;
  description: string;
  shortDescription: string;
  author: string;
  category: string;
  price: number;
  coverImage: string | File;
  pdfFile: File | null;
  isActive: boolean;
  telegramContact: string;
  whatsappContact: string;
}