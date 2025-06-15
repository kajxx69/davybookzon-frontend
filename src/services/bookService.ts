import api from '../utils/api';
import { Book } from '../types';

// Fonction utilitaire pour transformer les données de l'API
const transformBookData = (book: any): Book => {
  return {
    ...book,
    id: book._id, // Transformer _id en id
    coverImage: book.coverImage?.url || book.coverImage, // Gérer le cas où coverImage est un objet
    pdfFile: book.pdfFile?.url || book.pdfFile, // Gérer le cas où pdfFile est un objet
  };
};

export const bookService = {
  // Récupérer tous les livres
  getBooks: async () => {
    try {
      const response = await api.get<{ success: boolean; data: any[] }>('/books');
      
      // Transformer les données
      const transformedData = {
        ...response.data,
        data: response.data.data.map(transformBookData)
      };
      
      return transformedData;
    } catch (error: any) {
      throw error;
    }
  },

  // Récupérer un livre par son ID
  getBook: async (id: string) => {
    try {
      const response = await api.get<{ success: boolean; data: any }>(`/books/${id}`);
      return {
        ...response.data,
        data: transformBookData(response.data.data)
      };
    } catch (error: any) {
      throw error;
    }
  },

  // Récupérer les catégories
  getCategories: async () => {
    try {
      const response = await api.get<{ success: boolean; data: string[] }>('/books/categories');
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  // Incrémenter le compteur d'achats
  incrementPurchaseCount: async (id: string) => {
    try {
      const response = await api.post<{ success: boolean; data: Book }>(`/books/${id}/purchase`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  // Ajouter un nouveau livre
  addBook: async (book: Partial<Book>) => {
    try {
      const response = await api.post<{ success: boolean; data: Book }>('/books', book);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  // Mettre à jour un livre
  updateBook: async (id: string, book: Partial<Book>) => {
    try {
      const response = await api.put<{ success: boolean; data: Book }>(`/books/${id}`, book);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  // Supprimer un livre
  deleteBook: async (id: string) => {
    try {
      const response = await api.delete<{ success: boolean; data: Book }>(`/books/${id}`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  // Acheter un livre
  purchaseBook: async (id: string) => {
    try {
      const response = await api.post<{ success: boolean; message?: string; data: { downloadUrl: string } }>(`/books/${id}/purchase`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  // Télécharger un livre
  downloadBook: async (id: string) => {
    try {
      const response = await api.get<{ success: boolean; data: { downloadUrl: string } }>(`/books/${id}/download`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }
}; 