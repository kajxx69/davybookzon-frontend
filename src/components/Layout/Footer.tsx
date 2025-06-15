import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MessageCircle, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-4">À propos</h3>
            <p className="text-gray-400">
              DavyBookZone est votre plateforme de livres numériques. Découvrez notre sélection
              de livres et enrichissez votre bibliothèque virtuelle.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/books"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Catalogue
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Connexion
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Inscription
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-gray-400" />
                <a
                  href="mailto:davybookzone@gmail.com"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  davybookzone@gmail.com
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5 text-gray-400" />
                <a
                  href="https://t.me/davybookzone"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  @davybookzone
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-gray-400" />
                <a
                  href="https://wa.me/2250150585768"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  +225 01 50 58 57 68
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} DavyBookZone. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;