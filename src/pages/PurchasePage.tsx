import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { purchaseService } from '../services/purchaseService';
import { CustomerInfo } from '../types/purchase';
import { bookService } from '../services/bookService';
import { Book } from '../types';
import { useAuth } from '../context/AuthContext';

const PurchasePage: React.FC = () => {
    const { bookId } = useParams<{ bookId: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<CustomerInfo>({
        name: '',
        surname: '',
        phone_number: '',
        email: '',
        address: '',
        city: '',
        country: 'CI',
        state: 'AB',
        zip_code: '00000'
    });

    // Liste des pays CinetPay (exemple, à compléter si besoin)
    const CINETPAY_COUNTRIES = [
        { code: 'CI', name: "Côte d\'Ivoire" },
        { code: 'TG', name: 'Togo' },
        { code: 'SN', name: 'Sénégal' },
        { code: 'CM', name: 'Cameroun' },
        { code: 'ML', name: 'Mali' },
        { code: 'BF', name: 'Burkina Faso' },
        { code: 'NE', name: 'Niger' },
        { code: 'BJ', name: 'Bénin' },
        { code: 'GN', name: 'Guinée' },
        { code: 'GA', name: 'Gabon' },
        { code: 'CD', name: 'RD Congo' },
        { code: 'GW', name: 'Guinée-Bissau' },
        { code: 'CF', name: 'Centrafrique' },
        { code: 'TD', name: 'Tchad' },
    ];

    // Liste des régions/états ISO par pays (extrait, à compléter si besoin)
    const REGIONS_BY_COUNTRY: Record<string, { code: string; name: string }[]> = {
        CI: [
            { code: 'AB', name: 'Abidjan' },
            { code: 'BS', name: 'Bas-Sassandra' },
            { code: 'CM', name: 'Comoé' },
            { code: 'DN', name: 'Denguélé' },
            { code: 'GB', name: 'Gôh-Bassam' },
            { code: 'LC', name: 'Lacs' },
            { code: 'LG', name: 'Lagunes' },
            { code: 'SM', name: 'Sassandra-Marahoué' },
            { code: 'SV', name: 'Savanes' },
            { code: 'WR', name: 'Woroba' },
            { code: 'YM', name: 'Yamoussoukro' },
            // ...
        ],
        SN: [
            { code: 'DK', name: 'Dakar' },
            { code: 'DB', name: 'Diourbel' },
            { code: 'FK', name: 'Fatick' },
            { code: 'KL', name: 'Kaolack' },
            { code: 'KD', name: 'Kolda' },
            { code: 'LG', name: 'Louga' },
            { code: 'MT', name: 'Matam' },
            { code: 'SL', name: 'Saint-Louis' },
            { code: 'TC', name: 'Tambacounda' },
            { code: 'TH', name: 'Thiès' },
            { code: 'ZG', name: 'Ziguinchor' },
            // ...
        ],
        TG: [
            { code: 'C', name: 'Centrale' },
            { code: 'K', name: 'Kara' },
            { code: 'M', name: 'Maritime' },
            { code: 'P', name: 'Plateaux' },
            { code: 'S', name: 'Savanes' },
        ],
        BF: [
            { code: '01', name: 'Boucle du Mouhoun' },
            { code: '02', name: 'Cascades' },
            { code: '03', name: 'Centre' },
            { code: '04', name: 'Centre-Est' },
            { code: '05', name: 'Centre-Nord' },
            { code: '06', name: 'Centre-Ouest' },
            { code: '07', name: 'Centre-Sud' },
            { code: '08', name: 'Est' },
            { code: '09', name: 'Hauts-Bassins' },
            { code: '10', name: 'Nord' },
            { code: '11', name: 'Plateau-Central' },
            { code: '12', name: 'Sahel' },
            { code: '13', name: 'Sud-Ouest' },
        ],
        // Ajoute d'autres pays/régions si besoin
    };

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        // Pré-remplir les champs avec les infos du user connecté
        setFormData((prev) => ({
            ...prev,
            name: user.firstName || '',
            surname: user.lastName || '',
            email: user.email || '',
        }));
        const fetchBook = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await bookService.getBook(bookId!);
                if (response.success) {
                    setBook(response.data);
                } else {
                    setError('Erreur lors du chargement du livre');
                }
            } catch (err: any) {
                setError(err.response?.data?.message || 'Erreur lors du chargement du livre');
            } finally {
                setLoading(false);
            }
        };

        if (bookId) {
            fetchBook();
        }
    }, [bookId, user, navigate]);

    if (!user) {
        return null; // On ne montre rien, la redirection s'effectue
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev: CustomerInfo) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }
        if (!bookId) return;

        try {
            setIsSubmitting(true);
            setError(null);

            // Vérifier que tous les champs requis sont remplis
            const requiredFields = ['name', 'surname', 'phone_number', 'email', 'address', 'city'];
            const missingFields = requiredFields.filter(field => !formData[field as keyof CustomerInfo]);
            
            if (missingFields.length > 0) {
                setError(`Veuillez remplir tous les champs obligatoires : ${missingFields.join(', ')}`);
                return;
            }

            const response = await purchaseService.initiatePurchase(bookId, formData);
            
            if (response.success && response.data?.payment_url) {
                // Rediriger vers la page de paiement CinetPay
                window.location.href = response.data.payment_url;
            } else {
                setError('Erreur lors de l\'initiation du paiement');
            }
        } catch (err: any) {
            setError(err.message || 'Erreur lors de l\'initiation du paiement');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Chargement du livre...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !book) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-600">{error || 'Livre non trouvé'}</p>
                        <button
                            onClick={() => navigate(-1)}
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Retour
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6">
                        <div className="flex items-center space-x-4 mb-6">
                            <img
                                src={typeof book.coverImage === 'string' ? book.coverImage : book.coverImage?.url || ''}
                                alt={book.title}
                                className="w-20 h-28 object-cover rounded-lg shadow-md"
                            />
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{book.title}</h1>
                                <p className="text-gray-600">Par {book.author}</p>
                                <p className="text-xl font-bold text-blue-600 mt-2">{book.price.toFixed(2)} FCFA</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                        Prénom *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="surname" className="block text-sm font-medium text-gray-700">
                                        Nom *
                                    </label>
                                    <input
                                        type="text"
                                        id="surname"
                                        name="surname"
                                        value={formData.surname}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
                                        Numéro de téléphone *
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone_number"
                                        name="phone_number"
                                        value={formData.phone_number}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                        Adresse *
                                    </label>
                                    <input
                                        type="text"
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                                        Ville *
                                    </label>
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                                        Pays *
                                    </label>
                                    <select
                                        id="country"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    >
                                        {CINETPAY_COUNTRIES.map((country) => (
                                            <option key={country.code} value={country.code}>{country.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                                        Région / État *
                                    </label>
                                    {REGIONS_BY_COUNTRY[formData.country] ? (
                                        <select
                                            id="state"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        >
                                            <option value="">Sélectionner une région</option>
                                            {REGIONS_BY_COUNTRY[formData.country].map((region) => (
                                                <option key={region.code} value={region.code}>{region.name}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            type="text"
                                            id="state"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        />
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="zip_code" className="block text-sm font-medium text-gray-700">
                                        Code postal
                                    </label>
                                    <input
                                        type="text"
                                        id="zip_code"
                                        name="zip_code"
                                        value={formData.zip_code}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <p className="text-red-600 text-sm">{error}</p>
                                </div>
                            )}

                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Traitement...' : 'Procéder au paiement'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PurchasePage; 