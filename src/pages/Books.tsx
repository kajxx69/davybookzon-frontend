import React, { useState, useEffect } from 'react';
import { Search, Grid, List, Filter, ShoppingCart, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookService } from '../services/bookService';
import { Book } from '../types';
import PurchaseModal from '../components/UI/PurchaseModal';

const Books: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState<'title' | 'price' | 'date'>('title');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    setIsLoading(true);
    setError('');

    try {
      const [booksResponse, categoriesResponse] = await Promise.all([
        bookService.getBooks(),
        bookService.getCategories()
      ]);

      if (booksResponse.success && categoriesResponse.success) {
        setBooks(booksResponse.data);
        setCategories(categoriesResponse.data);
      } else {
        setError('Une erreur est survenue lors du chargement des livres');
      }
    } catch (err: any) {
      console.error('Erreur de chargement:', err);
      setError(err.response?.data?.message || 'Une erreur est survenue lors du chargement des livres');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurchase = (book: Book) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setSelectedBook(book);
    setShowPurchaseModal(true);
  };

  const handlePurchaseSuccess = async () => {
    await loadBooks(); // Recharger les livres pour mettre à jour les statistiques
  };

  const filteredBooks = books
    .filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          book.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || book.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'price':
          return a.price - b.price;
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Catalogue de livres</h1>
            <p className="mt-2 text-gray-600">
              Découvrez notre sélection de livres et enrichissez votre bibliothèque
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              {viewMode === 'grid' ? <List className="h-6 w-6" /> : <Grid className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher un livre..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Toutes les catégories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'title' | 'price' | 'date')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="title">Trier par titre</option>
                <option value="price">Trier par prix</option>
                <option value="date">Trier par date</option>
              </select>
            </div>

            {/* Clear Filters */}
            {(searchTerm || selectedCategory) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                }}
                className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <X className="h-4 w-4" />
                <span>Effacer les filtres</span>
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Books Grid/List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des livres...</p>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="text-center py-12">
            <Filter className="h-12 w-12 text-gray-400 mx-auto" />
            <p className="mt-4 text-gray-600">Aucun livre ne correspond à vos critères</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredBooks.map((book, index) => (
              <div
                key={book._id || `book-${index}`}
                className={`bg-white rounded-lg shadow-md overflow-hidden ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
              >
                <div className={`${viewMode === 'list' ? 'w-1/3' : 'w-full'}`}>
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className={`p-4 ${viewMode === 'list' ? 'w-2/3' : ''}`}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{book.title}</h3>
                  <p className="text-gray-600 mb-2">Par {book.author}</p>
                  <p className="text-sm text-gray-500 mb-4">{book.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-blue-600">{book.price} FCFA</span>
                      <span className="text-sm text-gray-500 ml-2">
                        {book.purchaseCount} achat{book.purchaseCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <button
                      onClick={() => handlePurchase(book)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span>Acheter</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Purchase Modal */}
      {showPurchaseModal && selectedBook && (
        <PurchaseModal
          book={selectedBook}
          isOpen={showPurchaseModal}
          onClose={() => {
            setShowPurchaseModal(false);
            setSelectedBook(null);
          }}
          onPurchaseSuccess={handlePurchaseSuccess}
        />
      )}
    </div>
  );
};

export default Books;