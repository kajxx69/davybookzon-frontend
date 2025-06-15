import React, { useState, useEffect } from 'react';
import { Users, Book, MessageSquare, BarChart3, Settings, Plus, X } from 'lucide-react';
import { bookService } from '../../services/bookService';
import { authService } from '../../services/authService';
import { messageService } from '../../services/messageService';
import { adminService } from '../../services/adminService';
import { User, Book as BookType, Message, BookFormData, CreateUserData } from '../../types';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [books, setBooks] = useState<BookType[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newBook, setNewBook] = useState<BookFormData>({
    title: '',
    author: '',
    category: '',
    price: 0,
    shortDescription: '',
    description: '',
    coverImage: '',
    pdfFile: null,
    telegramContact: '',
    whatsappContact: '',
    isActive: true
  });
  const [newUser, setNewUser] = useState<CreateUserData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'user',
    isActive: true
  });
  const [settings, setSettings] = useState({
    siteName: 'DavyBookZone',
    siteDescription: 'Votre librairie en ligne',
    contactEmail: 'contact@davybookzone.com',
    supportPhone: '+1234567890',
    telegramUsername: '@davybookzone',
    whatsappNumber: '+1234567890',
    maintenanceMode: false,
    allowRegistrations: true,
    defaultUserRole: 'user',
    maxUploadSize: 10, // MB
    allowedFileTypes: ['pdf', 'epub', 'mobi'],
    currency: 'EUR',
    taxRate: 20, // %
    minPurchaseAmount: 5,
    maxPurchaseAmount: 1000
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [statsResponse, usersResponse, booksResponse, messagesResponse, settingsResponse] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getUsers(),
        adminService.getBooks(),
        adminService.getMessages(),
        adminService.getSettings()
      ]);

      if (statsResponse.success) setStats(statsResponse.data.data);
      if (usersResponse.success) setUsers(usersResponse.data.data);
      if (booksResponse.success) setBooks(booksResponse.data.data);
      if (messagesResponse.success) setMessages(messagesResponse.data.data);
      if (settingsResponse.success) setSettings(settingsResponse.data.data);
    } catch (error) {
      setError('Erreur lors du chargement des données');
      setUsers([]);
      setBooks([]);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'books', label: 'Livres', icon: Book },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats && (
          <>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Utilisateurs total</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.stats.totalUsers}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-green-600 font-medium">
                  +{stats.stats.newUsersLast30Days} ce mois
                </span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Livres actifs</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.stats.activeBooks}</p>
                </div>
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <Book className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-green-600 font-medium">
                  +{stats.stats.newBooksLast30Days} ce mois
                </span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Messages non lus</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.stats.unreadMessages}</p>
                </div>
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ventes totales</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.stats.totalPurchases}</p>
                </div>
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Utilisateurs récents</h3>
          <div className="space-y-3">
            {stats?.recentUsers?.map((user: User) => (
              <div key={user._id} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  user.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {user.isActive ? 'Actif' : 'Inactif'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Livres populaires</h3>
          <div className="space-y-3">
            {stats?.popularBooks?.map((book: BookType) => (
              <div key={book._id} className="flex items-center space-x-3">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="h-10 h-12 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 line-clamp-1">
                    {book.title}
                  </p>
                  <p className="text-xs text-gray-500">{book.author}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {book.purchaseCount} ventes
                  </p>
                  <p className="text-xs text-gray-500">{book.price.toFixed(2)} €</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userData = {
        ...newUser,
        password: 'Password123' // Mot de passe temporaire avec majuscule
      };
      const response = await adminService.createUser(userData);
      if (response.success) {
        setUsers([...users, response.data]);
        setIsAddUserModalOpen(false);
        setNewUser({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          role: 'user',
          isActive: true
        });
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.errors 
        ? `Erreurs de validation: ${JSON.stringify(err.response.data.errors)}`
        : err.response?.data?.message || 'Erreur lors de l\'ajout de l\'utilisateur';
      setError(errorMessage);
    }
  };

  const handleUpdateUser = async (userId: string, userData: Partial<User>) => {
    try {
      const response = await adminService.updateUser(userId, userData);
      if (response.success) {
        setUsers(users.map(user => 
          user._id === userId ? response.data : user
        ));
      }
    } catch (err) {
      setError('Erreur lors de la mise à jour de l\'utilisateur');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await adminService.deleteUser(userId);
      if (response.success) {
        setUsers(users.filter(user => user._id !== userId));
      }
    } catch (err) {
      setError('Erreur lors de la suppression de l\'utilisateur');
    }
  };

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', newBook.title);
      formData.append('author', newBook.author);
      formData.append('category', newBook.category);
      formData.append('price', newBook.price.toString());
      formData.append('shortDescription', newBook.shortDescription);
      formData.append('description', newBook.description);
      formData.append('telegramContact', newBook.telegramContact);
      formData.append('whatsappContact', newBook.whatsappContact);
      formData.append('isActive', newBook.isActive.toString());
      
      if (newBook.coverImage instanceof File) {
        formData.append('coverImage', newBook.coverImage);
      } else if (typeof newBook.coverImage === 'string' && newBook.coverImage.startsWith('data:')) {
        const response = await fetch(newBook.coverImage);
        const blob = await response.blob();
        const file = new File([blob], 'cover.jpg', { type: 'image/jpeg' });
        formData.append('coverImage', file);
      } else {
        throw new Error('Format d\'image non valide');
      }
      
      if (newBook.pdfFile instanceof File) {
        formData.append('pdfFile', newBook.pdfFile);
      } else {
        throw new Error('Fichier PDF requis');
      }

      await adminService.createBook(formData);
      setIsAddBookModalOpen(false);
      setNewBook({
        title: '',
        author: '',
        category: '',
        price: 0,
        shortDescription: '',
        description: '',
        coverImage: '',
        pdfFile: null,
        telegramContact: '',
        whatsappContact: '',
        isActive: true
      });
      fetchData();
    } catch (error) {
      setError('Erreur lors de l\'ajout du livre');
    }
  };

  const handleUpdateBook = async (bookId: string, bookData: Partial<BookType>) => {
    try {
      const response = await bookService.updateBook(bookId, bookData);
      if (response.success) {
        setBooks(books.map(book => 
          book._id === bookId ? response.data : book
        ));
      }
    } catch (err) {
      setError('Erreur lors de la mise à jour du livre');
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    try {
      const response = await bookService.deleteBook(bookId);
      if (response.success) {
        setBooks(books.filter(book => book._id !== bookId));
      }
    } catch (err) {
      setError('Erreur lors de la suppression du livre');
    }
  };

  const handleMarkMessageAsRead = async (messageId: string) => {
    try {
      const response = await adminService.markMessageAsRead(messageId);
      if (response.success) {
        setMessages(messages.map(message => 
          message._id === messageId ? { ...message, isRead: true } : message
        ));
      }
    } catch (err) {
      setError('Erreur lors du marquage du message comme lu');
    }
  };

  const handleReplyToMessage = async (messageId: string, content: string) => {
    try {
      const response = await adminService.replyToMessage(messageId, content);
      if (response.success) {
        setMessages(messages.map(message => 
          message._id === messageId ? response.data : message
        ));
      }
    } catch (err) {
      setError('Erreur lors de l\'envoi de la réponse');
    }
  };

  const handleSettingsChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setSettings(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await adminService.updateSettings(settings);
      if (response.success) {
        alert('Paramètres mis à jour avec succès');
      }
    } catch (err) {
      setError('Erreur lors de la mise à jour des paramètres');
    }
  };

  const handleToggleUserStatus = async (userId: string) => {
    try {
      const response = await adminService.toggleUserStatus(userId);
      
      if (response.success && response.data) {
        setUsers(users.map(user => 
          user._id === userId ? response.data : user
        ));
      } else {
        setError('Erreur lors du changement de statut de l\'utilisateur');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du changement de statut de l\'utilisateur');
    }
  };

  const handleToggleBookStatus = async (bookId: string) => {
    try {
      const response = await adminService.toggleBookStatus(bookId);
      
      if (response.success && response.data) {
        setBooks(books.map(book => 
          book._id === bookId ? response.data : book
        ));
      } else {
        setError('Erreur lors du changement de statut du livre');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du changement de statut du livre');
    }
  };

  const handleToggleMessageReadStatus = async (messageId: string) => {
    try {
      const response = await adminService.toggleMessageReadStatus(messageId);
      if (response.success) {
        setMessages(messages.map(message => 
          message._id === messageId ? response.data : message
        ));
      }
    } catch (err) {
      setError('Erreur lors du changement de statut du message');
    }
  };

  const renderAddBookModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Ajouter un livre</h3>
            <button
              onClick={() => setIsAddBookModalOpen(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <form onSubmit={handleAddBook} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Titre</label>
                <input
                  type="text"
                  value={newBook.title}
                  onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Auteur</label>
                <input
                  type="text"
                  value={newBook.author}
                  onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Catégorie</label>
                <select
                  value={newBook.category}
                  onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">Sélectionner une catégorie</option>
                  <option value="Programmation">Programmation</option>
                  <option value="Business">Business</option>
                  <option value="Art & Design">Art & Design</option>
                  <option value="Cuisine">Cuisine</option>
                  <option value="Santé & Bien-être">Santé & Bien-être</option>
                  <option value="Sciences">Sciences</option>
                  <option value="Histoire">Histoire</option>
                  <option value="Fiction">Fiction</option>
                  <option value="Biographie">Biographie</option>
                  <option value="Développement personnel">Développement personnel</option>
                  <option value="Langue">Langue</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Prix (FCFA)</label>
                <input
                  type="number"
                  value={newBook.price}
                  onChange={(e) => setNewBook({ ...newBook, price: parseFloat(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  min="0"
                  max="99999999"
                  step="100"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description courte</label>
              <textarea
                value={newBook.shortDescription}
                onChange={(e) => setNewBook({ ...newBook, shortDescription: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={2}
                maxLength={300}
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                {newBook.shortDescription.length}/300 caractères
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description complète</label>
              <textarea
                value={newBook.description}
                onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={4}
                maxLength={2000}
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                {newBook.description.length}/2000 caractères
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Image de couverture</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setNewBook({ ...newBook, coverImage: reader.result as string });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="mt-1 block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
                required
              />
              {newBook.coverImage && (
                <div className="mt-2">
                  <img
                    src={newBook.coverImage instanceof File ? URL.createObjectURL(newBook.coverImage) : newBook.coverImage}
                    alt="Aperçu de la couverture"
                    className="h-32 w-auto object-cover rounded-lg"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Fichier PDF</label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setNewBook({ ...newBook, pdfFile: file });
                  }
                }}
                className="mt-1 block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact Telegram</label>
                <input
                  type="text"
                  value={newBook.telegramContact}
                  onChange={(e) => setNewBook({ ...newBook, telegramContact: e.target.value })}
                  placeholder="@username"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact WhatsApp</label>
                <input
                  type="text"
                  value={newBook.whatsappContact}
                  onChange={(e) => setNewBook({ ...newBook, whatsappContact: e.target.value })}
                  placeholder="+33123456789"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={newBook.isActive}
                onChange={(e) => setNewBook({ ...newBook, isActive: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">Livre actif</label>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Ajouter le livre
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  const renderAddUserModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Ajouter un utilisateur</h3>
            <button
              onClick={() => setIsAddUserModalOpen(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <form onSubmit={handleAddUser} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Prénom</label>
              <input
                type="text"
                value={newUser.firstName}
                onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom</label>
              <input
                type="text"
                value={newUser.lastName}
                onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Rôle</label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'user' | 'admin' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="user">Utilisateur</option>
                <option value="admin">Administrateur</option>
              </select>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={newUser.isActive}
                onChange={(e) => setNewUser({ ...newUser, isActive: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">Compte actif</label>
            </div>
            <div className="mt-6">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Ajouter l'utilisateur
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="bg-white rounded-lg shadow-md">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Gestion des utilisateurs</h3>
        <button
          onClick={() => setIsAddUserModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Ajouter un utilisateur</span>
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Utilisateur
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rôle
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Inscription
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => {
              return (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'admin' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role === 'admin' ? 'Admin' : 'Utilisateur'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : ''}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-4">
                      Modifier
                    </button>
                    <button 
                      onClick={() => handleToggleUserStatus(user._id)}
                      className={`${
                        user.isActive 
                          ? 'text-red-600 hover:text-red-900' 
                          : 'text-green-600 hover:text-green-900'
                      }`}
                    >
                      {user.isActive ? 'Désactiver' : 'Activer'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderBooks = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Gestion des livres</h3>
        <button
          onClick={() => setIsAddBookModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Ajouter un livre</span>
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Livre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catégorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prix
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ventes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {books.map((book) => (
                <tr key={book._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={book.coverImage?.url || ''}
                        alt={book.title}
                        className="h-16 w-12 object-cover rounded"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {book.title}
                        </div>
                        <div className="text-sm text-gray-500">{book.author}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {book.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {book.price.toFixed(2)} FCFA
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {book.purchaseCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      book.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {book.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-4">
                      Modifier
                    </button>
                    <button 
                      onClick={() => handleToggleBookStatus(book._id)}
                      className={`${
                        book.isActive 
                          ? 'text-red-600 hover:text-red-900' 
                          : 'text-green-600 hover:text-green-900'
                      }`}
                    >
                      {book.isActive ? 'Désactiver' : 'Activer'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderMessages = () => (
    <div className="bg-white rounded-lg shadow-md">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Messages de contact</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {messages.map((message) => (
          <div key={message._id} className={`p-6 ${!message.isRead ? 'bg-blue-50' : ''}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="text-sm font-medium text-gray-900">{message.from}</h4>
                  <span className="text-sm text-gray-500">({message.email})</span>
                  {!message.isRead && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Nouveau
                    </span>
                  )}
                </div>
                <h5 className="text-sm font-medium text-gray-900 mb-2">{message.subject}</h5>
                <p className="text-sm text-gray-600 mb-3">{message.content}</p>
                <p className="text-xs text-gray-500">
                  {new Date(message.createdAt).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => {
                    const content = prompt('Entrez votre réponse :');
                    if (content) {
                      handleReplyToMessage(message._id, content);
                    }
                  }}
                  className="text-blue-600 hover:text-blue-900 text-sm"
                >
                  Répondre
                </button>
                <button 
                  onClick={() => handleToggleMessageReadStatus(message._id)}
                  className="text-gray-600 hover:text-gray-900 text-sm"
                >
                  {message.isRead ? 'Marquer non lu' : 'Marquer lu'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <form onSubmit={handleSaveSettings} className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations générales</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom du site</label>
              <input
                type="text"
                name="siteName"
                value={settings.siteName}
                onChange={handleSettingsChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description du site</label>
              <input
                type="text"
                name="siteDescription"
                value={settings.siteDescription}
                onChange={handleSettingsChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email de contact</label>
              <input
                type="email"
                name="contactEmail"
                value={settings.contactEmail}
                onChange={handleSettingsChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Téléphone de support</label>
              <input
                type="tel"
                name="supportPhone"
                value={settings.supportPhone}
                onChange={handleSettingsChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Username Telegram</label>
              <input
                type="text"
                name="telegramUsername"
                value={settings.telegramUsername}
                onChange={handleSettingsChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Numéro WhatsApp</label>
              <input
                type="tel"
                name="whatsappNumber"
                value={settings.whatsappNumber}
                onChange={handleSettingsChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuration système</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="maintenanceMode"
                checked={settings.maintenanceMode}
                onChange={handleSettingsChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">Mode maintenance</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="allowRegistrations"
                checked={settings.allowRegistrations}
                onChange={handleSettingsChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">Autoriser les inscriptions</label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Rôle par défaut</label>
              <select
                name="defaultUserRole"
                value={settings.defaultUserRole}
                onChange={handleSettingsChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="user">Utilisateur</option>
                <option value="admin">Administrateur</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Taille max. upload (MB)</label>
              <input
                type="number"
                name="maxUploadSize"
                value={settings.maxUploadSize}
                onChange={handleSettingsChange}
                min="1"
                max="100"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuration des ventes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Devise</label>
              <select
                name="currency"
                value={settings.currency}
                onChange={handleSettingsChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Taux de TVA (%)</label>
              <input
                type="number"
                name="taxRate"
                value={settings.taxRate}
                onChange={handleSettingsChange}
                min="0"
                max="100"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Montant min. achat</label>
              <input
                type="number"
                name="minPurchaseAmount"
                value={settings.minPurchaseAmount}
                onChange={handleSettingsChange}
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Montant max. achat</label>
              <input
                type="number"
                name="maxPurchaseAmount"
                value={settings.maxPurchaseAmount}
                onChange={handleSettingsChange}
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Enregistrer les paramètres
          </button>
        </div>
      </form>
    </div>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12">
          <p className="text-red-600">{error}</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'users':
        return renderUsers();
      case 'books':
        return renderBooks();
      case 'messages':
        return renderMessages();
      case 'settings':
        return renderSettings();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord administrateur</h1>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-4 text-sm font-medium ${
                    activeTab === tab.id
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-5 w-5 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        {renderContent()}
      </div>
      {isAddBookModalOpen && renderAddBookModal()}
      {isAddUserModalOpen && renderAddUserModal()}
    </div>
  );
};

export default AdminDashboard;