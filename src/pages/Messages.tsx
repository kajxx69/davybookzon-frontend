import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, Trash2, Clock, User } from 'lucide-react';
import { messageService } from '../services/messageService';
import { Message } from '../types';

const Messages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    subject: '',
    content: '',
  });

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await messageService.getUserMessages();
      if (response.success) {
        setMessages(response.data);
      } else {
        setError(response.message || 'Une erreur est survenue lors du chargement des messages');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Une erreur est survenue lors du chargement des messages');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await messageService.sendMessage(formData);
      if (response.success) {
        setFormData({ subject: '', content: '' });
        await loadMessages();
      } else {
        setError(response.message || 'Une erreur est survenue lors de l\'envoi du message');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Une erreur est survenue lors de l\'envoi du message');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-white bg-opacity-20 p-4 rounded-full">
                  <MessageCircle className="h-12 w-12 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Messages</h1>
                  <p className="text-blue-100">Gérez vos messages et communiquez avec notre équipe</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Message Form */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Envoyer un message</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Sujet
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Sujet de votre message"
                    />
                  </div>

                  <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      id="content"
                      name="content"
                      required
                      value={formData.content}
                      onChange={handleChange}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Votre message..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg font-medium transition-colors duration-200 transform hover:scale-105 disabled:transform-none flex items-center justify-center space-x-2"
                  >
                    <Send className="h-5 w-5" />
                    <span>{isLoading ? 'Envoi en cours...' : 'Envoyer le message'}</span>
                  </button>
                </form>
              </div>

              {/* Messages List */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Vos messages</h2>
                
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Chargement des messages...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle className="h-12 w-12 text-gray-400 mx-auto" />
                    <p className="mt-4 text-gray-600">Vous n'avez pas encore de messages</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{message.subject}</h3>
                            <p className="text-gray-600 mt-1">{message.content}</p>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>
                                  {new Date(message.createdAt).toLocaleDateString('fr-FR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <User className="h-4 w-4" />
                                <span>{message.sender.firstName} {message.sender.lastName}</span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => {/* TODO: Implement delete message */}}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages; 