import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://davybookzone-api.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Erreur de requête:', error);
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Le serveur a répondu avec un code d'état d'erreur
      console.error('Erreur de réponse:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });

      if (error.response.status === 401) {
        // Rediriger vers la page de connexion si le token est invalide
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } else if (error.request) {
      // La requête a été faite mais aucune réponse n'a été reçue
      console.error('Erreur de requête:', error.request);
    } else {
      // Une erreur s'est produite lors de la configuration de la requête
      console.error('Erreur:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api; 