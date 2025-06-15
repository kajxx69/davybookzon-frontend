import React, { useState } from 'react';
import { User, Mail, Calendar, Edit2, Save, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
  });
  const [showPwdForm, setShowPwdForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwdError, setPwdError] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await updateProfile(formData);
      if (response.success) {
        setIsEditing(false);
      } else {
        setError(response.message || 'Une erreur est survenue lors de la mise à jour du profil');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Une erreur est survenue lors de la mise à jour du profil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
    });
    setIsEditing(false);
    setError('');
  };

  const handleChangePassword = async () => {
    setPwdError('');
    setPwdSuccess('');
    try {
      const res = await authService.changePassword(currentPassword, newPassword);
      if (res.success) {
        setPwdSuccess('Mot de passe changé avec succès');
        setShowPwdForm(false);
        setCurrentPassword('');
        setNewPassword('');
      } else {
        setPwdError(res.message || 'Erreur');
      }
    } catch (err: any) {
      setPwdError(err.response?.data?.message || 'Erreur');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Accès non autorisé</h2>
          <p className="text-gray-600">Vous devez être connecté pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-white bg-opacity-20 p-4 rounded-full">
                  <User className="h-12 w-12 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {user.firstName} {user.lastName}
                  </h1>
                  <p className="text-blue-100">{user.email}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'admin' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                    </span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Edit2 className="h-4 w-4" />
                <span>{isEditing ? 'Annuler' : 'Modifier'}</span>
              </button>
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
              {/* Personal Information */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Informations personnelles</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prénom
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">{user.firstName}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">{user.lastName}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">{user.email}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date d'inscription
                    </label>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">
                        {new Date(user.createdAt).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex space-x-4">
                      <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                      >
                        <Save className="h-4 w-4" />
                        <span>{isLoading ? 'Sauvegarde...' : 'Sauvegarder'}</span>
                      </button>
                      <button
                        onClick={handleCancel}
                        disabled={isLoading}
                        className="bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                      >
                        <X className="h-4 w-4" />
                        <span>Annuler</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Account Status */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Statut du compte</h2>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Statut</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Type de compte</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'admin' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={() => setShowPwdForm(v => !v)}
                className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg mb-2"
              >
                {showPwdForm ? 'Annuler' : 'Changer le mot de passe'}
              </button>
              {showPwdForm && (
                <div className="space-y-4 bg-gray-50 p-4 rounded-lg border mt-2">
                  <input
                    type="password"
                    placeholder="Ancien mot de passe"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="password"
                    placeholder="Nouveau mot de passe"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <button
                    onClick={handleChangePassword}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                  >
                    Valider
                  </button>
                  {pwdError && <div className="text-red-600 text-sm">{pwdError}</div>}
                  {pwdSuccess && <div className="text-green-600 text-sm">{pwdSuccess}</div>}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;