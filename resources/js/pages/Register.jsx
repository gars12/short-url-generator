import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const { isDark, toggleTheme } = useTheme();
    const { register: registerUser, user } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    
    // Auto-redirect jika user sudah login
    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    // Cek kekuatan password saat password berubah
    useEffect(() => {
        const checkPasswordStrength = (password) => {
            let strength = 0;
            
            // Password kosong mendapat skor 0
            if (password.length === 0) {
                setPasswordStrength(0);
                return;
            }
            
            // Kriteria kekuatan password
            if (password.length >= 8) strength += 1;            // Minimal 8 karakter
            if (/[A-Z]/.test(password)) strength += 1;          // Mengandung huruf besar
            if (/[a-z]/.test(password)) strength += 1;          // Mengandung huruf kecil
            if (/[0-9]/.test(password)) strength += 1;          // Mengandung angka
            if (/[^A-Za-z0-9]/.test(password)) strength += 1;   // Mengandung karakter khusus
            
            setPasswordStrength(strength);
        };
        
        checkPasswordStrength(password);
    }, [password]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Mendapatkan CSRF cookie dari sanctum terlebih dahulu
            await axios.get('/sanctum/csrf-cookie');
            
            // Gunakan register function dari AuthContext
            const result = await registerUser(name, email, password, passwordConfirmation);
            
            if (result.success) {
                navigate('/dashboard');
            } else {
                setError(result.message);
            }
        } catch (error) {
            console.error('Registration error:', error);
            setError('Terjadi kesalahan saat registrasi');
        } finally {
            setLoading(false);
        }
    };
    
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    
    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };
    
    const getPasswordStrengthLabel = () => {
        switch (passwordStrength) {
            case 0: return 'Sangat Lemah';
            case 1: return 'Lemah';
            case 2: return 'Cukup';
            case 3: return 'Kuat';
            case 4: return 'Sangat Kuat';
            case 5: return 'Luar Biasa';
            default: return '';
        }
    };
    
    const getPasswordStrengthColor = () => {
        switch (passwordStrength) {
            case 0: return isDark ? 'bg-red-900' : 'bg-red-500';
            case 1: return isDark ? 'bg-red-700' : 'bg-red-400';
            case 2: return isDark ? 'bg-yellow-600' : 'bg-yellow-400';
            case 3: return isDark ? 'bg-blue-600' : 'bg-blue-400';
            case 4: return isDark ? 'bg-green-700' : 'bg-green-500';
            case 5: return isDark ? 'bg-green-600' : 'bg-green-400';
            default: return '';
        }
    };

    return (
        <div className={`min-h-screen flex flex-col ${isDark ? 'bg-dark-bg-primary text-dark-text-primary' : 'bg-gray-50'}`}>
            {/* Navbar */}
            <nav className={`${isDark ? 'bg-dark-bg-secondary border-dark-border' : 'bg-white'} shadow-lg border-b`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link to="/" className={`text-xl font-bold ${isDark ? 'text-dark-text-primary' : 'text-gray-800'}`}>
                                URL Shortener
                            </Link>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={toggleTheme}
                                className={`p-2 rounded-md ${isDark ? 'text-yellow-400 hover:bg-dark-bg-primary' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                {isDark ? '🌞' : '🌙'}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className={`max-w-md w-full space-y-8 ${isDark ? 'bg-dark-bg-secondary' : 'bg-white'} p-8 rounded-xl shadow-lg`}>
                    <div>
                        <h2 className={`mt-6 text-center text-3xl font-extrabold ${isDark ? 'text-dark-text-primary' : 'text-gray-900'}`}>
                            Daftar Akun Baru
                        </h2>
                        <p className={`mt-2 text-center text-sm ${isDark ? 'text-dark-text-secondary' : 'text-gray-600'}`}>
                            Atau{' '}
                            <Link to="/login" className={`font-medium ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}`}>
                                masuk ke akun yang sudah ada
                            </Link>
                        </p>
                    </div>

                    {error && (
                        <div className={`rounded-md p-4 ${isDark ? 'bg-red-900/50' : 'bg-red-50'}`}>
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className={`h-5 w-5 ${isDark ? 'text-red-400' : 'text-red-400'}`} viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className={`text-sm ${isDark ? 'text-red-200' : 'text-red-700'}`}>{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="name" className="sr-only">Nama</label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                                        isDark 
                                            ? 'border-dark-border bg-dark-bg-primary text-dark-text-primary placeholder-dark-text-secondary' 
                                            : 'border-gray-300 placeholder-gray-500 text-gray-900'
                                    } rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                                    placeholder="Nama"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="sr-only">Email</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                                        isDark 
                                            ? 'border-dark-border bg-dark-bg-primary text-dark-text-primary placeholder-dark-text-secondary' 
                                            : 'border-gray-300 placeholder-gray-500 text-gray-900'
                                    } focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                                    placeholder="Email"
                                />
                            </div>
                            <div className="relative">
                                <label htmlFor="password" className="sr-only">Password</label>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                                        isDark 
                                            ? 'border-dark-border bg-dark-bg-primary text-dark-text-primary placeholder-dark-text-secondary' 
                                            : 'border-gray-300 placeholder-gray-500 text-gray-900'
                                    } focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                                    placeholder="Password"
                                />
                                <button
                                    type="button"
                                    className={`absolute inset-y-0 right-0 flex items-center pr-3 ${
                                        isDark ? 'text-dark-text-secondary hover:text-dark-text-primary' : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                    onClick={togglePasswordVisibility}
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {password && (
                                <div className="mt-1 mb-2">
                                    <div className="flex items-center justify-between">
                                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                            <div className={`h-2.5 rounded-full ${getPasswordStrengthColor()}`} style={{ width: `${(passwordStrength / 5) * 100}%` }}></div>
                                        </div>
                                        <span className={`ml-2 text-xs ${isDark ? 'text-dark-text-secondary' : 'text-gray-500'}`}>
                                            {getPasswordStrengthLabel()}
                                        </span>
                                    </div>
                                    <div className={`mt-1 text-xs ${isDark ? 'text-dark-text-secondary' : 'text-gray-500'}`}>
                                        Password harus memiliki minimal 8 karakter dengan kombinasi huruf besar, huruf kecil, angka, dan karakter khusus.
                                    </div>
                                </div>
                            )}
                            <div className="relative">
                                <label htmlFor="password_confirmation" className="sr-only">Konfirmasi Password</label>
                                <input
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    type={showConfirmPassword ? "text" : "password"}
                                    required
                                    value={passwordConfirmation}
                                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                                    className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                                        isDark 
                                            ? 'border-dark-border bg-dark-bg-primary text-dark-text-primary placeholder-dark-text-secondary' 
                                            : 'border-gray-300 placeholder-gray-500 text-gray-900'
                                    } rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                                    placeholder="Konfirmasi Password"
                                />
                                <button
                                    type="button"
                                    className={`absolute inset-y-0 right-0 flex items-center pr-3 ${
                                        isDark ? 'text-dark-text-secondary hover:text-dark-text-primary' : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                    onClick={toggleConfirmPasswordVisibility}
                                >
                                    {showConfirmPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                                    loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                            >
                                {loading ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Memproses...
                                    </span>
                                ) : (
                                    'Daftar'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Footer */}
            <footer className={`${isDark ? 'bg-dark-bg-secondary border-dark-border' : 'bg-white'} border-t`}>
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <p className={`text-sm ${isDark ? 'text-dark-text-secondary' : 'text-gray-500'}`}>
                            © 2024 URL Shortener. All rights reserved.
                        </p>
                        <div className="flex space-x-6">
                            <a href="#" className={`text-sm ${isDark ? 'text-dark-text-secondary hover:text-dark-text-primary' : 'text-gray-500 hover:text-gray-900'}`}>
                                Privacy Policy
                            </a>
                            <a href="#" className={`text-sm ${isDark ? 'text-dark-text-secondary hover:text-dark-text-primary' : 'text-gray-500 hover:text-gray-900'}`}>
                                Terms of Service
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Register; 