import api from '../utils/api';
import { User, Book, Message } from '../types';

export const adminService = {
  // Statistiques
  getDashboardStats: async () => {
    try {
      const response = await api.get('/admin/stats');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return { success: false, error };
    }
  },

  // Utilisateurs
  getUsers: async (params = { limit: 1000 }) => {
    try {
      const response = await api.get('/admin/users', { params });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching users:', error);
      return { success: false, error };
    }
  },

  createUser: async (userData: any) => {
    try {
      const response = await api.post('/auth/register', userData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error creating user:', error);
      return { success: false, error };
    }
  },

  updateUser: async (userId: string, userData: Partial<User>) => {
    try {
      const response = await api.put(`/admin/users/${userId}`, userData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error updating user:', error);
      return { success: false, error };
    }
  },

  deleteUser: async (userId: string) => {
    try {
      const response = await api.delete(`/admin/users/${userId}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error deleting user:', error);
      return { success: false, error };
    }
  },

  // Livres
  getBooks: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    isActive?: boolean;
  }) => {
    try {
      const response = await api.get('/admin/books', { params });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching books:', error);
      return { success: false, error };
    }
  },

  async createBook(bookData: FormData): Promise<Book> {
    try {
      const response = await api.post('/books', bookData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating book:', error);
      throw error;
    }
  },

  updateBook: async (bookId: string, bookData: FormData) => {
    try {
      const response = await api.put(`/admin/books/${bookId}`, bookData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error updating book:', error);
      return { success: false, error };
    }
  },

  toggleBookStatus: async (bookId: string) => {
    try {
      const response = await api.put(`/admin/books/${bookId}/toggle-status`);
      return { 
        success: true, 
        data: response.data.data // Accéder à la donnée dans la réponse
      };
    } catch (error: any) {
      console.error('Error toggling book status:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Erreur lors du changement de statut'
      };
    }
  },

  // Messages
  getMessages: async () => {
    try {
      const response = await api.get('/admin/messages');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching messages:', error);
      return { success: false, error };
    }
  },

  markMessageAsRead: async (messageId: string) => {
    try {
      const response = await api.put(`/admin/messages/${messageId}/read`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error marking message as read:', error);
      return { success: false, error };
    }
  },

  replyToMessage: async (messageId: string, content: string) => {
    try {
      const response = await api.post(`/admin/messages/${messageId}/reply`, { content });
      return { success: true, data: response.data.data };
    } catch (error: any) {
      console.error('Error replying to message:', error);
      return { success: false, error: error.response?.data?.message || 'Erreur lors de l\'envoi de la réponse' };
    }
  },

  toggleMessageReadStatus: async (messageId: string) => {
    try {
      const response = await api.put(`/admin/messages/${messageId}/toggle-read`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error toggling message read status:', error);
      return { success: false, error };
    }
  },

  // Paramètres
  getSettings: async () => {
    try {
      const response = await api.get('/admin/settings');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching settings:', error);
      return { success: false, error };
    }
  },

  updateSettings: async (settings: any) => {
    try {
      const response = await api.put('/admin/settings', settings);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error updating settings:', error);
      return { success: false, error };
    }
  },

  // Gestion des utilisateurs
  toggleUserStatus: async (userId: string) => {
    try {
      const response = await api.put(`/admin/users/${userId}/toggle-status`);
      return { 
        success: true, 
        data: response.data.data // Accéder à la donnée dans la réponse
      };
    } catch (error: any) {
      console.error('Error toggling user status:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Erreur lors du changement de statut'
      };
    }
  },

  // Achats
  getPurchases: async () => {
    try {
      const response = await api.get('/admin/purchases');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching purchases:', error);
      return { success: false, error };
    }
  }
}; 