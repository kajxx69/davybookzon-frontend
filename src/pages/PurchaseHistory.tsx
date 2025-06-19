import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, Clock, CheckCircle, XCircle } from 'lucide-react';
import { purchaseService } from '../services/purchaseService';
import { PurchaseDetails } from '../types/purchase';
import { useAuth } from '../context/AuthContext';

const PurchaseHistory: React.FC = () => {
  const [purchases, setPurchases] = useState<PurchaseDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadPurchases();
  }, [user, navigate]);

  const loadPurchases = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await purchaseService.getPurchaseHistory();
      setPurchases(data);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement de l\'historique des achats');
      if (err.message.includes('connecté')) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5" />;
      case 'pending':
        return <Clock className="h-5 w-5" />;
      case 'failed':
        return <XCircle className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement de l'historique...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Historique des achats</h1>
          <p className="mt-2 text-gray-600">
            Consultez l'historique de vos achats et leur statut
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {purchases.length === 0 ? (
          <div className="text-center py-12">
            <Book className="h-12 w-12 text-gray-400 mx-auto" />
            <p className="mt-4 text-gray-600">Vous n'avez pas encore effectué d'achat</p>
            <button
              onClick={() => navigate('/books')}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Découvrir nos livres
            </button>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {purchases.map((purchase) => (
                <li key={purchase._id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {purchase.book_id && purchase.book_id.coverImage ? (
                          <img
                            src={purchase.book_id.coverImage.url || purchase.book_id.coverImage}
                            alt={purchase.book_id.title || 'Livre'}
                            className="h-16 w-12 object-cover rounded"
                          />
                        ) : (
                          <div className="h-16 w-12 bg-gray-200 rounded flex items-center justify-center">
                            <Book className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-900">
                            {purchase.book_id?.title || 'Livre non disponible'}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Par {purchase.book_id?.author || 'Auteur inconnu'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {purchase.price?.toFixed(2) || '0.00'} FCFA
                          </p>
                          <p className="text-sm text-gray-500">
                            {purchase.purchased_at ? formatDate(purchase.purchased_at) : 'Date inconnue'}
                          </p>
                        </div>
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(purchase.status)}`}>
                          {getStatusIcon(purchase.status)}
                          <span className="ml-1">
                            {purchase.status === 'completed' ? 'Complété' :
                             purchase.status === 'pending' ? 'En attente' :
                             purchase.status === 'failed' ? 'Échoué' : purchase.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseHistory; 