import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Book, Users, Star, ArrowRight, BookOpen, Shield, Zap } from 'lucide-react';
import BookCard from '../components/UI/BookCard';
import { Book as BookType } from '../types';
import { bookService } from '../services/bookService';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
  const [featuredBooks, setFeaturedBooks] = useState<BookType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeaturedBooks = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await bookService.getBooks();
        if (response.success) {
          // Filtrer les livres actifs et prendre les 3 premiers
          const activeBooks = response.data.filter(book => book.isActive).slice(0, 3);
          setFeaturedBooks(activeBooks);
        } else {
          setError('Erreur lors du chargement des livres');
        }
      } catch (err) {
        setError('Impossible de charger les livres. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedBooks();
  }, []);

  const handlePurchase = (book: BookType) => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/purchase/${book._id}`);
  };

  const stats = [
    {
      icon: Book,
      value: '1000+',
      label: 'Livres disponibles'
    },
    {
      icon: Users,
      value: '5000+',
      label: 'Lecteurs satisfaits'
    },
    {
      icon: Star,
      value: '4.8/5',
      label: 'Note moyenne'
    }
  ];

  const features = [
    {
      icon: BookOpen,
      title: 'Livres de qualité',
      description: 'Une sélection rigoureuse de livres pour tous les goûts et tous les niveaux.'
    },
    {
      icon: Shield,
      title: 'Paiement sécurisé',
      description: 'Transactions sécurisées avec CinetPay pour une expérience d\'achat en toute confiance.'
    },
    {
      icon: Zap,
      title: 'Accès immédiat',
      description: 'Recevez votre livre instantanément après l\'achat.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50">
      {/* Hero Section */}
      <section className="relative bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 drop-shadow-lg">
              {user ? (
                <>Bienvenue, <span className="block text-blue-200 animate-pulse">{user.firstName} !</span></>
              ) : (
                <>Découvrez votre prochaine<span className="block text-blue-200 animate-pulse">lecture numérique</span></>
              )}
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Découvrez notre collection de livres numériques et enrichissez votre bibliothèque personnelle.
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-4">
              <Link
                to="/books"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-semibold rounded-md text-blue-600 bg-white hover:bg-gray-50 transition-colors shadow-md"
              >
                Explorer le catalogue
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              {!user && (
                <Link
                  to="/register"
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center justify-center shadow-md"
                >
                  Créer un compte
                </Link>
              )}
            </div>
          </div>
        </div>
        <div className="relative">
          <svg className="w-full h-12 text-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor"></path>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-blue-100 p-4 rounded-full shadow-md">
                    <stat.icon className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">{stat.value}</div>
                <div className="text-gray-600 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">
              Livres en vedette
            </h2>
            <p className="text-xl text-gray-600">
              Découvrez nos meilleures ventes et nouveautés
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Chargement des livres...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredBooks.map((book) => (
                <div key={book._id} className="transition-transform transform hover:-translate-y-2 hover:shadow-xl duration-200">
                  <BookCard book={book} />
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/books"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md"
            >
              Voir tous les livres
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">
              Pourquoi nous choisir ?
            </h2>
            <p className="text-xl text-gray-600">
              Une expérience de lecture unique à portée de clic
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200">
                <div className="flex justify-center mb-4">
                  <div className="bg-blue-100 p-4 rounded-full animate-bounce-slow">
                    <feature.icon className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-base">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;