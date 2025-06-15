import api from '../utils/api';
import { User, LoginData, RegisterData } from '../types';

export const authService = {
  // Connexion
  login: async (data: LoginData) => {
    try {
      const response = await api.post<{ success: boolean; token: string; user: User }>('/auth/login', {
        email: data.email,
        password: data.password
      });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }

      if (error.message === 'Network Error') {
        throw new Error('Impossible de se connecter au serveur. Veuillez vérifier votre connexion internet.');
      }

      if (error.message.includes('CORS')) {
        throw new Error('Erreur de configuration CORS. Veuillez contacter l\'administrateur.');
      }

      throw new Error('Une erreur est survenue lors de la connexion');
    }
  },

  // Inscription
  register: async (data: RegisterData) => {
    try {
      const registerData = {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        role: 'user'
      };

      const response = await api.post<{ success: boolean; token: string; user: User }>('/auth/register', registerData);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }

      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors)
          .filter(Boolean)
          .join('\n');
        throw new Error(errorMessages || 'Erreurs de validation');
      }

      if (error.response?.data?.error?.name === 'ValidationError') {
        const validationErrors = Object.values(error.response.data.error.errors)
          .map((err: any) => err.message)
          .join('\n');
        throw new Error(validationErrors || 'Erreurs de validation');
      }

      throw new Error('Une erreur est survenue lors de l\'inscription');
    }
  },

  // Récupérer le profil utilisateur
  getProfile: async () => {
    try {
      const response = await api.get<{ success: boolean; data: User }>('/auth/me');
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  // Mettre à jour le profil
  updateProfile: async (data: Partial<User>) => {
    try {
      const response = await api.put<{ success: boolean; data: User }>('/auth/profile', data);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  // Récupérer tous les utilisateurs (admin)
  getUsers: async () => {
    try {
      const response = await api.get<{ success: boolean; data: User[] }>('/auth/users');
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  // Déconnexion
  logout: () => {
    localStorage.removeItem('token');
  },

  // Changer le mot de passe
  changePassword: async (currentPassword: string, newPassword: string) => {
    try {
      const response = await api.put('/auth/change-password', { currentPassword, newPassword });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }
}; 