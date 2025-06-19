import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { purchaseService } from '../services/purchaseService';

const DownloadPage: React.FC = () => {
  const { transactionId } = useParams<{ transactionId: string }>();
  const [loading, setLoading] = useState(true);
  const [purchase, setPurchase] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPurchase = async () => {
      try {
        setLoading(true);
        const data = await purchaseService.getPurchaseDetails(transactionId!);
        setPurchase(data);
      } catch (err: any) {
        setError(err.message || 'Erreur lors de la vérification du paiement');
      } finally {
        setLoading(false);
      }
    };
    if (transactionId) fetchPurchase();
  }, [transactionId]);

  if (loading) return <div className="text-center py-12">Vérification du paiement...</div>;
  if (error) return <div className="text-center text-red-600 py-12">{error}</div>;
  if (!purchase) return null;

  if (purchase.status === 'completed') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Paiement réussi !</h1>
        <p className="mb-6">Merci pour votre achat. Vous pouvez télécharger votre livre ci-dessous :</p>
        {purchase.book?.pdfFile?.url ? (
          <a
            href={purchase.book.pdfFile.url}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
            download
          >
            Télécharger le livre
          </a>
        ) : (
          <p className="text-red-500">Le lien de téléchargement n'est pas disponible.</p>
        )}
        <Link to="/books" className="mt-8 text-blue-600 underline">Retour au catalogue</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Paiement en attente</h1>
      <p className="mb-6">Votre paiement est en cours de traitement. Veuillez patienter ou réessayer plus tard.</p>
      <Link to="/books" className="mt-8 text-blue-600 underline">Retour au catalogue</Link>
    </div>
  );
};

export default DownloadPage; 