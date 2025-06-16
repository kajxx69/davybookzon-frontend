import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Book, Users, Star, ArrowRight, BookOpen, Shield, Zap } from 'lucide-react';
import BookCard from '../components/UI/BookCard';
import PurchaseModal from '../components/UI/PurchaseModal';
import { Book as BookType } from '../types';
import { bookService } from '../services/bookService';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
  const [selectedBook, setSelectedBook] = useState<BookType | null>(null);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [featuredBooks, setFeaturedBooks] = useState<BookType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

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
    setSelectedBook(book);
    setIsPurchaseModalOpen(true);
  };

  const features = [
    {
      icon: BookOpen,
      title: 'Livres de Qualité',
      description: 'Une sélection rigoureuse de livres PDF d\'auteurs indépendants talentueux.',
    },
    {
      icon: Zap,
      title: 'Accès Immédiat',
      description: 'Téléchargez vos livres instantanément après l\'achat, où que vous soyez.',
    },
    {
      icon: Shield,
      title: 'Achat Sécurisé',
      description: 'Processus d\'achat simple et sécurisé via Telegram ou WhatsApp.',
    },
  ];

  const stats = [
    { icon: Book, value: '100+', label: 'Livres disponibles' },
    { icon: Users, value: '1000+', label: 'Lecteurs satisfaits' },
    { icon: Star, value: '4.9/5', label: 'Note moyenne' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <Book className="h-16 w-16 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              {user ? (
                  <>Bienvenue, <span className="block text-blue-200">{user.firstName} !</span></>
                ) : (
                  <>Découvrez votre prochaine<span className="block text-blue-200">lecture numérique</span></>
              )}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              DavyBookZone vous propose une sélection exclusive de livres PDF d'auteurs indépendants. 
              Des ouvrages de qualité, accessibles instantanément.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/books"
                className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center justify-center space-x-2"
              >
                <span>Parcourir les livres</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              {!user && (
                <Link
                  to="/register"
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center justify-center"
                >
                  Créer un compte
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Wave separator */}
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
                  <div className="bg-blue-100 p-4 rounded-full">
                    <stat.icon className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pourquoi choisir DavyBookZone ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Notre plateforme vous offre une expérience de lecture numérique unique et personnalisée.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="flex justify-center mb-6">
                  <div className="bg-blue-50 group-hover:bg-blue-100 p-6 rounded-full transition-colors">
                    <feature.icon className="h-12 w-12 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="py-20 bg-gray-50">
  <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-10">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        Vous souhaitez vendre votre livre ?
      </h2>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
        Contactez-nous directement sur WhatsApp ou Telegram pour proposer votre livre à la vente.<br />
        Merci de nous envoyer les informations suivantes :
      </p>
      <ul className="text-left text-gray-700 mb-6 list-disc list-inside">
        <li><b>Titre du livre</b></li>
        <li><b>Auteur</b></li>
        <li><b>Catégorie</b></li>
        <li><b>Prix souhaité</b></li>
        <li><b>Description courte</b></li>
        <li><b>Description longue</b></li>
        <li><b>Image de couverture</b> (fichier image)</li>
        <li><b>Fichier PDF du livre</b></li>
        <li><b>Votre contact WhatsApp</b></li>
        <li><b>Votre contact Telegram</b></li>
      </ul>
      <div className="flex flex-col items-center space-y-2">
        <a
          href="https://wa.me/2250150585768"
          className="inline-block bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          target="_blank" rel="noopener noreferrer"
        >
          Contacter sur WhatsApp
        </a>
        <a
          href="https://t.me/@davybookzone"
          className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          target="_blank" rel="noopener noreferrer"
        >
          Contacter sur Telegram
        </a>
      </div>
    </div>
  </div>
</section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prêt à commencer votre aventure littéraire ?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Rejoignez notre communauté de lecteurs passionnés et découvrez des pépites littéraires.
          </p>
          {!user && (
                <Link
                  to="/register"
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center justify-center"
                >
                  Créer un compte
                </Link>
              )}
        </div>
      </section>

      <PurchaseModal
        book={selectedBook}
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
      />
    </div>
  );
};

export default Home;