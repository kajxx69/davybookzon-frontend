import React from 'react';
import { X, MessageCircle, Phone, CreditCard, AlertCircle } from 'lucide-react';
import { Book } from '../../types';
import { useAuth } from '../../context/AuthContext';
import waveMoneyIcon from '../../assets/wave-money.png';
import moovMoneyIcon from '../../assets/moov-money.png';
import orangeMoneyIcon from '../../assets/orange-money.png';

interface PurchaseModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({ book, isOpen, onClose }) => {
  const { user } = useAuth();

  if (!isOpen || !book) return null;

  const handleTelegramClick = () => {
    const message = `Bonjour, je souhaite acheter le livre "${book.title}" pour ${book.price}FCFA.`;
    const telegramUrl = `https://t.me/${book.telegramContact?.replace('@', '')}?text=${encodeURIComponent(message)}`;
    window.open(telegramUrl, '_blank');
  };

  const handleWhatsAppClick = () => {
    const message = `Bonjour, je souhaite acheter le livre "${book.title}" pour ${book.price}FCFA.`;
    const whatsappUrl = `https://wa.me/${book.whatsappContact?.replace('+', '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Acheter ce livre</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex space-x-4 mb-6">
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-20 h-28 object-cover rounded-lg shadow-md"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-900 mb-1">{book.title}</h3>
              <p className="text-gray-600 text-sm mb-2">Par {book.author}</p>
              <p className="text-2xl font-bold text-blue-600">{book.price.toFixed(2)} FCFA</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Méthodes de paiement */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Méthodes de paiement acceptées</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded-lg flex items-center space-x-2">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  <span className="text-sm">Carte bancaire</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg flex items-center space-x-2">
                  <img src={waveMoneyIcon} alt="Wave Money" className="h-5 w-5 object-contain" />
                  <span className="text-sm">Wave Money</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg flex items-center space-x-2">
                  <img src={moovMoneyIcon} alt="Moov Money" className="h-5 w-5 object-contain" />
                  <span className="text-sm">Moov Money</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg flex items-center space-x-2">
                  <img src={orangeMoneyIcon} alt="Orange Money" className="h-5 w-5 object-contain" />
                  <span className="text-sm">Orange Money</span>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Comment procéder à l'achat ?</h4>
              <p className="text-blue-800 text-sm">
                Pour acheter ce livre, veuillez nous contacter via Telegram ou WhatsApp.
                Nous vous guiderons dans le processus de paiement et vous enverrons le livre
                une fois le paiement confirmé.
              </p>
            </div>

            {/* Boutons de contact */}
            <div className="space-y-3">
              <button
                onClick={handleTelegramClick}
                className="w-full bg-[#0088cc] hover:bg-[#0077b3] text-white px-4 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Contacter via Telegram</span>
              </button>

              <button
                onClick={handleWhatsAppClick}
                className="w-full bg-[#25D366] hover:bg-[#22c55e] text-white px-4 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors"
              >
                <Phone className="h-5 w-5" />
                <span>Contacter via WhatsApp</span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseModal;