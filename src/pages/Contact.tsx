import React, { useState } from 'react';
import { Mail, MessageCircle, Phone, Send, User, MessageSquare } from 'lucide-react';
import { messageService } from '../services/messageService';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await messageService.sendMessage({
        from: formData.name,
        email: formData.email,
        subject: formData.subject,
        content: `Message de ${formData.name} (${formData.email}):\n\n${formData.message}`
      });

      if (response.success) {
        setIsSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setError(response.message || 'Une erreur est survenue lors de l\'envoi du message');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Une erreur est survenue lors de l\'envoi du message');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contactez-nous</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Une question ? Un problème ? Notre équipe est là pour vous aider. 
            N'hésitez pas à nous contacter par le moyen qui vous convient le mieux.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Nos coordonnées</h2>
            
            <div className="space-y-6">
              {/* Email */}
              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
                    <p className="text-gray-600 mb-3">
                      Pour toute question générale ou support technique
                    </p>
                    <a
                      href="mailto:davybookzone@gmail.com"
                      className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                      davybookzone@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Telegram */}
              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <MessageCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Telegram</h3>
                    <p className="text-gray-600 mb-3">
                      Réponse rapide pour vos achats et questions urgentes
                    </p>
                    <a
                      href="https://t.me/davybookzone"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                      @davybookzone
                    </a>
                  </div>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">WhatsApp</h3>
                    <p className="text-gray-600 mb-3">
                      Discussion directe pour finaliser vos achats
                    </p>
                    <a
                      href="https://wa.me/2250150585768"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-700 font-medium transition-colors"
                    >
                      +225 01 50 58 57 68
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="mt-12">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Questions fréquentes</h3>
              <div className="space-y-4">
                <details className="bg-white rounded-lg p-4 shadow-md">
                  <summary className="font-medium text-gray-900 cursor-pointer">
                    Comment puis-je acheter un livre ?
                  </summary>
                  <p className="mt-3 text-gray-600">
                    Parcourez notre catalogue, cliquez sur "Acheter" et contactez-nous via Telegram ou WhatsApp pour finaliser l'achat.
                  </p>
                </details>
                
                <details className="bg-white rounded-lg p-4 shadow-md">
                  <summary className="font-medium text-gray-900 cursor-pointer">
                    Quels sont les moyens de paiement acceptés ?
                  </summary>
                  <p className="mt-3 text-gray-600">
                    Nous acceptons les virements bancaires, PayPal et les cartes de crédit. Les détails vous seront communiqués lors du contact.
                  </p>
                </details>
                
                <details className="bg-white rounded-lg p-4 shadow-md">
                  <summary className="font-medium text-gray-900 cursor-pointer">
                    Puis-je télécharger mes livres plusieurs fois ?
                  </summary>
                  <p className="mt-3 text-gray-600">
                    Oui, une fois votre achat confirmé, vous recevrez un lien de téléchargement valable 30 jours avec 5 téléchargements possibles.
                  </p>
                </details>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Envoyez-nous un message</h2>

              {isSubmitted && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="bg-green-100 p-1 rounded-full">
                      <Send className="h-4 w-4 text-green-600" />
                    </div>
                    <p className="text-green-800 font-medium">
                      Message envoyé avec succès !
                    </p>
                  </div>
                  <p className="text-green-700 text-sm mt-2">
                    Nous vous répondrons dans les plus brefs délais.
                  </p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nom complet
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Votre nom complet"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Sujet
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Sujet de votre message"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Votre message..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg font-medium transition-colors duration-200 transform hover:scale-105 disabled:transform-none"
                >
                  {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;