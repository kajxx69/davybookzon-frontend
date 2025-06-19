import React from 'react';
import { ShoppingCart, User, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Book } from '../../types';

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const navigate = useNavigate();

  const handlePurchase = () => {
    navigate(`/purchase/${book._id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="aspect-w-3 aspect-h-4 overflow-hidden">
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
      </div>
      
      <div className="p-6">
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
          <Tag className="h-4 w-4" />
          <span>{book.category}</span>
        </div>
        
        <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-2">
          {book.title}
        </h3>
        
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
          <User className="h-4 w-4" />
          <span>Par {book.author}</span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {book.shortDescription}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-600">
            {book.price.toFixed(2)} FCFA
          </div>
          
          <button
            onClick={handlePurchase}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200 transform hover:scale-105"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Acheter</span>
          </button>
        </div>
        
        {book.purchaseCount > 0 && (
          <div className="mt-3 text-xs text-gray-500">
            {book.purchaseCount} personnes ont acheté ce livre
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCard;