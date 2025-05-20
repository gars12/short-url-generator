import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import id from 'date-fns/locale/id';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

// Daftarkan locale Indonesia
registerLocale('id', id);

// Style untuk memaksa format 24 jam pada input datetime-local
const dateTimeStyle = `
    input[type="datetime-local"]::-webkit-calendar-picker-indicator {
        filter: invert(0.5);
    }
    input[type="datetime-local"]::-webkit-datetime-edit {
        padding: 0;
    }
    input[type="datetime-local"]::-webkit-datetime-edit-fields-wrapper {
        padding: 0;
    }
    input[type="datetime-local"]::-webkit-datetime-edit-text {
        padding: 0 2px;
    }
    input[type="datetime-local"]::-webkit-datetime-edit-hour-field,
    input[type="datetime-local"]::-webkit-datetime-edit-minute-field,
    input[type="datetime-local"]::-webkit-datetime-edit-second-field {
        padding: 0 2px;
    }
`;

const Dashboard = () => {
    const { isDark, toggleTheme } = useTheme();
    const { logout } = useAuth();
    const [urls, setUrls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [newUrl, setNewUrl] = useState('');
    const [copied, setCopied] = useState(null);
    const [expiryDate, setExpiryDate] = useState(null);
    const [editingUrl, setEditingUrl] = useState(null);
    const [editUrl, setEditUrl] = useState('');
    const [editExpiryDate, setEditExpiryDate] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [urlToDelete, setUrlToDelete] = useState(null);

    const navigate = useNavigate();

    // Gunakan useRef untuk melacak apakah component sudah di-mount
    const isMounted = useRef(false);

    useEffect(() => {
        // Pastikan fetchUrls hanya dipanggil sekali saat mount
        if (!isMounted.current) {
            fetchUrls();
            isMounted.current = true;
        }
    }, []);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const getCurrentDateTime = () => {
        const now = new Date();
        now.setHours(now.getHours() + 7);
        return now.toISOString().slice(0, 16);
    };

    const getMinDateTime = () => {
        const now = new Date();
        now.setHours(now.getHours() + 1);
        return now;
    };

    const fetchUrls = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await axios.get('/api/short-urls', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            // Cek struktur response
            if (response.data && Array.isArray(response.data)) {
                setUrls(response.data);
            } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
                setUrls(response.data.data);
            } else {
                setUrls([]);
                console.log('Response structure:', response.data);
            }
        } catch (error) {
            console.error('Error fetching URLs:', error);
            if (error.response?.status === 401) {
                navigate('/login');
            } else {
                setError(error.response?.data?.message || 'Gagal mengambil data URL');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await axios.post('/api/short-urls', {
                url: newUrl,
                expired_at: expiryDate ? expiryDate.toISOString() : null
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setUrls([...urls, response.data]);
            setNewUrl('');
            setExpiryDate(null);
            setSuccessMessage('URL berhasil dipersingkat!');
        } catch (error) {
            if (error.response?.status === 401) {
                navigate('/login');
            } else {
                setError(error.response?.data?.message || 'Gagal mempersingkat URL');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = async (shortUrl) => {
        try {
            await navigator.clipboard.writeText(shortUrl);
            setCopied(shortUrl);
            
            // Tambahkan toast notification
            const toast = document.createElement('div');
            toast.className = `fixed bottom-4 right-4 px-4 py-2 rounded-md text-white bg-green-500 shadow-lg transform transition-all duration-300 ease-in-out ${
                isDark ? 'bg-green-600' : 'bg-green-500'
            }`;
            toast.textContent = 'URL berhasil disalin!';
            document.body.appendChild(toast);

            // Animasi muncul
            setTimeout(() => {
                toast.style.transform = 'translateY(0)';
                toast.style.opacity = '1';
            }, 100);

            // Hapus toast setelah 2 detik
            setTimeout(() => {
                toast.style.transform = 'translateY(20px)';
                toast.style.opacity = '0';
                setTimeout(() => {
                    document.body.removeChild(toast);
                }, 300);
            }, 2000);

            // Reset status copied setelah 2 detik
            setTimeout(() => {
                setCopied(null);
            }, 2000);
        } catch (err) {
            console.error('Gagal menyalin URL:', err);
            // Tampilkan pesan error jika gagal
            const toast = document.createElement('div');
            toast.className = `fixed bottom-4 right-4 px-4 py-2 rounded-md text-white bg-red-500 shadow-lg transform transition-all duration-300 ease-in-out ${
                isDark ? 'bg-red-600' : 'bg-red-500'
            }`;
            toast.textContent = 'Gagal menyalin URL';
            document.body.appendChild(toast);

            setTimeout(() => {
                toast.style.transform = 'translateY(0)';
                toast.style.opacity = '1';
            }, 100);

            setTimeout(() => {
                toast.style.transform = 'translateY(20px)';
                toast.style.opacity = '0';
                setTimeout(() => {
                    document.body.removeChild(toast);
                }, 300);
            }, 2000);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Tidak ada';
        const date = new Date(dateString);
        date.setHours(date.getHours() + 7);
        return date.toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    const isExpired = (dateString) => {
        if (!dateString) return false;
        const now = new Date();
        now.setHours(now.getHours() + 7);
        return new Date(dateString) < now;
    };

    const handleDelete = async (id) => {
        setUrlToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            await axios.delete(`/api/short-urls/${urlToDelete}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setUrls(urls.filter(url => url.id !== urlToDelete));
            setSuccess('URL berhasil dihapus!');
            setShowDeleteModal(false);
            setUrlToDelete(null);
        } catch (error) {
            if (error.response?.status === 401) {
                navigate('/login');
            } else {
                setError(error.response?.data?.message || 'Gagal menghapus URL');
            }
        }
    };
    

    const handleEdit = (url) => {
        setEditingUrl(url);
        setEditUrl(url.long_url);
        setEditExpiryDate(url.expired_at ? new Date(url.expired_at) : null);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await axios.put(`/api/short-urls/${editingUrl.id}`, {
                url: editUrl,
                expired_at: editExpiryDate ? editExpiryDate.toISOString() : null
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setUrls(urls.map(url => 
                url.id === editingUrl.id ? response.data : url
            ));
            setEditingUrl(null);
            setEditUrl('');
            setEditExpiryDate(null);
            setSuccess('URL berhasil diperbarui!');
        } catch (error) {
            if (error.response?.status === 401) {
                navigate('/login');
            } else {
                setError(error.response?.data?.message || 'Gagal memperbarui URL');
            }
        }
    };

    const cancelEdit = () => {
        setEditingUrl(null);
        setEditUrl('');
        setEditExpiryDate(null);
    };

    if (loading && urls.length === 0) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Memuat data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${isDark ? 'bg-dark-bg-primary text-dark-text-primary' : 'bg-gray-100'}`}>
            <style>{dateTimeStyle}</style>
            <nav className={`${isDark ? 'bg-dark-bg-secondary border-dark-border' : 'bg-white'} shadow-lg border-b`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className={`text-xl font-bold ${isDark ? 'text-dark-text-primary' : 'text-gray-800'}`}>
                                Dashboard
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={toggleTheme}
                                className={`p-2 rounded-md ${isDark ? 'text-yellow-400 hover:bg-dark-bg-primary' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                {isDark ? '🌞' : '🌙'}
                            </button>
                            <button
                                onClick={handleLogout}
                                className="ml-4 bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
                            >
                                Keluar
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className={`${isDark ? 'bg-dark-bg-secondary border-dark-border' : 'bg-white'} rounded-lg shadow p-6 border`}>
                        <h2 className={`text-lg font-medium ${isDark ? 'text-dark-text-primary' : 'text-gray-900'} mb-4`}>
                            Persingkat URL Baru
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="url" className={`block text-sm font-medium ${isDark ? 'text-dark-text-secondary' : 'text-gray-700'}`}>
                                    URL Asli
                                </label>
                                <input
                                    type="url"
                                    id="url"
                                    value={newUrl}
                                    onChange={(e) => setNewUrl(e.target.value)}
                                    className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                                        isDark 
                                            ? 'bg-dark-bg-primary border-dark-border text-dark-text-primary' 
                                            : 'border-gray-300'
                                    }`}
                                    placeholder="https://example.com"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="expiryDate" className={`block text-sm font-medium ${isDark ? 'text-dark-text-secondary' : 'text-gray-700'}`}>
                                    Tanggal Kedaluwarsa (Waktu Indonesia)
                                </label>
                                <DatePicker
                                    selected={expiryDate}
                                    onChange={(date) => setExpiryDate(date)}
                                    minDate={getMinDateTime()}
                                    showTimeSelect
                                    dateFormat="dd/MM/yyyy HH:mm"
                                    timeFormat="HH:mm"
                                    timeIntervals={15}
                                    locale="id"
                                    placeholderText="Pilih tanggal dan waktu"
                                    className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                                        isDark 
                                            ? 'bg-dark-bg-primary border-dark-border text-dark-text-primary' 
                                            : 'border-gray-300'
                                    }`}
                                    isClearable
                                />
                                <p className={`mt-1 text-sm ${isDark ? 'text-dark-text-secondary' : 'text-gray-500'}`}>
                                    Minimal 1 jam dari sekarang. Kosongkan jika tidak ingin mengatur kadaluarsa.
                                </p>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                                {loading ? 'Memproses...' : 'Persingkat URL'}
                            </button>
                        </form>

                        {error && (
                            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                                {error}
                            </div>
                        )}

                        {successMessage && (
                            <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                                {successMessage}
                            </div>
                        )}
                    </div>

                    <div className={`mt-8 ${isDark ? 'bg-dark-bg-secondary border-dark-border' : 'bg-white'} rounded-lg shadow border`}>
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className={`text-lg font-medium ${isDark ? 'text-dark-text-primary' : 'text-gray-900'} mb-4`}>
                                URL Anda
                            </h3>
                            {urls.length === 0 ? (
                                <p className={isDark ? 'text-dark-text-secondary' : 'text-gray-500'}>
                                    Belum ada URL yang dipersingkat
                                </p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className={isDark ? 'bg-dark-bg-primary' : 'bg-gray-50'}>
                                            <tr>
                                                <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-dark-text-secondary' : 'text-gray-500'} uppercase tracking-wider`}>
                                                    URL Asli
                                                </th>
                                                <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-dark-text-secondary' : 'text-gray-500'} uppercase tracking-wider`}>
                                                    URL Pendek
                                                </th>
                                                <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-dark-text-secondary' : 'text-gray-500'} uppercase tracking-wider`}>
                                                    Klik
                                                </th>
                                                <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-dark-text-secondary' : 'text-gray-500'} uppercase tracking-wider`}>
                                                    Kedaluwarsa
                                                </th>
                                                <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-dark-text-secondary' : 'text-gray-500'} uppercase tracking-wider`}>
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className={`${isDark ? 'bg-dark-bg-secondary divide-dark-border' : 'bg-white divide-gray-200'} divide-y`}>
                                            {urls.map((url) => (
                                                <tr key={url.id}>
                                                    {editingUrl?.id === url.id ? (
                                                        <>
                                                            <td className="px-6 py-4" colSpan="5">
                                                                <form onSubmit={handleUpdate} className="space-y-4">
                                                                    <div>
                                                                        <label className={`block text-sm font-medium ${isDark ? 'text-dark-text-secondary' : 'text-gray-700'}`}>
                                                                            URL Asli
                                                                        </label>
                                                                        <input
                                                                            type="url"
                                                                            value={editUrl}
                                                                            onChange={(e) => setEditUrl(e.target.value)}
                                                                            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                                                                                isDark 
                                                                                    ? 'bg-dark-bg-primary border-dark-border text-dark-text-primary' 
                                                                                    : 'border-gray-300'
                                                                            }`}
                                                                            required
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <label className={`block text-sm font-medium ${isDark ? 'text-dark-text-secondary' : 'text-gray-700'}`}>
                                                                            Tanggal Kedaluwarsa
                                                                        </label>
                                                                        <DatePicker
                                                                            selected={editExpiryDate}
                                                                            onChange={(date) => setEditExpiryDate(date)}
                                                                            minDate={new Date()}
                                                                            showTimeSelect
                                                                            dateFormat="dd/MM/yyyy HH:mm"
                                                                            timeFormat="HH:mm"
                                                                            timeIntervals={15}
                                                                            locale="id"
                                                                            placeholderText="Pilih tanggal dan waktu"
                                                                            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                                                                                isDark 
                                                                                    ? 'bg-dark-bg-primary border-dark-border text-dark-text-primary' 
                                                                                    : 'border-gray-300'
                                                                            }`}
                                                                            isClearable
                                                                        />
                                                                    </div>
                                                                    <div className="flex space-x-2">
                                                                        <button
                                                                            type="submit"
                                                                            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                                                                        >
                                                                            Simpan
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            onClick={cancelEdit}
                                                                            className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                                                                        >
                                                                            Batal
                                                                        </button>
                                                                    </div>
                                                                </form>
                                                            </td>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-dark-text-primary' : 'text-gray-900'}`}>
                                                                <a href={url.long_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600">
                                                                    {url.long_url}
                                                                </a>
                                                            </td>
                                                            <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-dark-text-primary' : 'text-gray-900'}`}>
                                                                <div className="flex items-center space-x-2">
                                                                    <a href={url.short_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600">
                                                                        {url.short_url}
                                                                    </a>
                                                                    <button
                                                                        onClick={() => handleCopy(url.short_url)}
                                                                        className={`p-1 rounded-md transition-colors duration-200 ${
                                                                            copied === url.short_url 
                                                                                ? 'text-green-500 bg-green-100 dark:bg-green-900' 
                                                                                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                                                                        }`}
                                                                        title="Salin URL"
                                                                    >
                                                                        {copied === url.short_url ? (
                                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                                            </svg>
                                                                        ) : (
                                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                                                            </svg>
                                                                        )}
                                                                    </button>
                                                                </div>
                                                            </td>
                                                            <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-dark-text-primary' : 'text-gray-900'}`}>
                                                                {url.clicks || 0}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                                    isExpired(url.expired_at) 
                                                                        ? 'bg-red-100 text-red-800' 
                                                                        : 'bg-green-100 text-green-800'
                                                                }`}>
                                                                    {formatDate(url.expired_at)}
                                                                </span>
                                                            </td>
                                                            <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-dark-text-primary' : 'text-gray-900'}`}>
                                                                <div className="flex space-x-2">
                                                                    <button
                                                                        onClick={() => handleEdit(url)}
                                                                        className="text-blue-400 hover:text-blue-600"
                                                                    >
                                                                        Edit
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDelete(url.id)}
                                                                        className="text-red-600 hover:text-red-800"
                                                                    >
                                                                        Hapus
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </>
                                                    )}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className={`absolute inset-0 ${isDark ? 'bg-gray-900' : 'bg-gray-500'} opacity-75`}></div>
                        </div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className={`inline-block align-bottom ${isDark ? 'bg-dark-bg-secondary' : 'bg-white'} rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full`}>
                            <div className={`${isDark ? 'bg-dark-bg-secondary' : 'bg-white'} px-4 pt-5 pb-4 sm:p-6 sm:pb-4`}>
                                <div className="sm:flex sm:items-start">
                                    <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${isDark ? 'bg-red-900' : 'bg-red-100'} sm:mx-0 sm:h-10 sm:w-10`}>
                                        <svg className={`h-6 w-6 ${isDark ? 'text-red-200' : 'text-red-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className={`text-lg leading-6 font-medium ${isDark ? 'text-dark-text-primary' : 'text-gray-900'}`}>
                                            Konfirmasi Hapus
                                        </h3>
                                        <div className="mt-2">
                                            <p className={`text-sm ${isDark ? 'text-dark-text-secondary' : 'text-gray-500'}`}>
                                                Apakah Anda yakin ingin menghapus URL ini? Tindakan ini tidak dapat dibatalkan.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={`${isDark ? 'bg-dark-bg-primary' : 'bg-gray-50'} px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse`}>
                                <button
                                    type="button"
                                    onClick={confirmDelete}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Hapus
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setUrlToDelete(null);
                                    }}
                                    className={`mt-3 w-full inline-flex justify-center rounded-md border ${
                                        isDark 
                                            ? 'border-dark-border text-gray-600 hover:bg-dark-bg-secondary hover:text-white' 
                                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                    } shadow-sm px-4 py-2 bg-white text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm`}
                                >
                                    Batal
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;