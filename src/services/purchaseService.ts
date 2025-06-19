import api from '../utils/api';
import { CustomerInfo, PurchaseResponse, PurchaseDetails } from '../types/purchase';

export const purchaseService = {
    // Initier un achat
    async initiatePurchase(bookId: string, customerInfo: CustomerInfo): Promise<PurchaseResponse> {
        try {
            const response = await api.post(`/purchases/${bookId}`, customerInfo);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Erreur lors de l\'initiation de l\'achat');
        }
    },

    // Vérifier le statut d'un achat
    async verifyPurchase(transactionId: string): Promise<PurchaseResponse> {
        try {
            const response = await api.post(`/purchases/verify/${transactionId}`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Erreur lors de la vérification de l\'achat');
        }
    },

    // Obtenir les détails d'un achat
    async getPurchaseDetails(transactionId: string): Promise<PurchaseDetails> {
        try {
            const response = await api.get(`/purchases/${transactionId}`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des détails de l\'achat');
        }
    },

    // Obtenir l'historique des achats d'un utilisateur
    async getPurchaseHistory(): Promise<PurchaseDetails[]> {
        try {
            const response = await api.get('/purchases/history');
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Erreur lors de la récupération de l\'historique des achats');
        }
    }
}; 