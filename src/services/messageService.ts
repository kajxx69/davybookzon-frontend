import api from '../utils/api';
import { Message } from '../types';

export const messageService = {
  // Envoyer un message
  sendMessage: async (data: { from: string; email: string; subject: string; content: string }) => {
    const response = await api.post<{ success: boolean; data: Message }>('/messages', data);
    return response.data;
  },

  // Récupérer les messages d'un utilisateur
  getUserMessages: async () => {
    const response = await api.get<{ success: boolean; data: Message[] }>('/messages/user');
    return response.data;
  }
}; 