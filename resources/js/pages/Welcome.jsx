import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Welcome = () => {
    const { isDark, toggleTheme } = useTheme();

    return (
        <div className={`min-h-screen flex flex-col ${isDark ? 'bg-dark-bg-primary text-dark-text-primary' : 'bg-gray-50'}`}>
            {/* Navbar */}
            <nav className={`${isDark ? 'bg-dark-bg-primary border-dark-border' : 'bg-white'} shadow-lg border-b fixed w-full z-50`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <span className={`text-xl font-bold ${isDark ? 'text-dark-text-primary' : 'text-gray-800'}`}>
                                URL Shortener
                            </span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={toggleTheme}
                                className={`p-2 rounded-md ${isDark ? 'text-yellow-400 hover:bg-dark-bg-secondary' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                {isDark ? '🌞' : '🌙'}
                            </button>
                            <Link
                                to="/login"
                                className={`px-4 py-2 rounded-md text-sm font-medium ${
                                    isDark 
                                        ? 'text-dark-text-primary hover:bg-dark-bg-secondary' 
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                Masuk
                            </Link>
                            <Link
                                to="/register"
                                className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                            >
                                Daftar
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className={`flex-grow pt-16 ${isDark ? 'bg-dark-bg-primary' : 'bg-gray-100'}`}>
                <div className="relative overflow-hidden">
                    <div className="max-w-7xl mx-auto">
                        <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                                <div className="sm:text-center lg:text-left">
                                    <h1 className={`text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl ${
                                        isDark ? 'text-dark-text-primary' : 'text-gray-900'
                                    }`}>
                                        <span className="block">Persingkat URL Anda</span>
                                        <span className={`block text-blue-600 ${isDark ? 'text-blue-400' : ''}`}>
                                            Dengan Mudah dan Cepat
                                        </span>
                                    </h1>
                                    <p className={`mt-3 text-base sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0 ${
                                        isDark ? 'text-dark-text-secondary' : 'text-gray-500'
                                    }`}>
                                        Buat URL pendek yang mudah diingat dan dibagikan. Pantau statistik klik dan kelola URL Anda dengan mudah.
                                    </p>
                                    <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                        <div className="rounded-md shadow">
                                            <Link
                                                to="/register"
                                                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                                            >
                                                Mulai Sekarang
                                            </Link>
                                        </div>
                                        <div className="mt-3 sm:mt-0 sm:ml-3">
                                            <Link
                                                to="/login"
                                                className={`w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md ${
                                                    isDark 
                                                        ? 'text-dark-text-primary bg-dark-bg-secondary hover:bg-dark-bg-primary' 
                                                        : 'text-blue-600 bg-white hover:bg-gray-50'
                                                } md:py-4 md:text-lg md:px-10`}
                                            >
                                                Masuk
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </main>
                        </div>
                    </div>
                    <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
                        <div className={`h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full ${
                            isDark ? 'bg-dark-bg-primary' : 'bg-gray-100'
                        }`}>
                            <div className="flex items-center justify-center h-full">
                                <svg className={`w-64 h-64 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className={`py-12 ${isDark ? 'bg-dark-bg-primary' : 'bg-white'}`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="lg:text-center">
                            <h2 className={`text-base text-blue-600 font-semibold tracking-wide uppercase ${isDark ? 'text-blue-400' : ''}`}>
                                Fitur
                            </h2>
                            <p className={`mt-2 text-3xl leading-8 font-extrabold tracking-tight sm:text-4xl ${
                                isDark ? 'text-dark-text-primary' : 'text-gray-900'
                            }`}>
                                Semua yang Anda Butuhkan
                            </p>
                        </div>

                        <div className="mt-10">
                            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                                {/* Feature 1 */}
                                <div className="relative">
                                    <div className={`absolute flex items-center justify-center h-12 w-12 rounded-md ${
                                        isDark ? 'bg-blue-500' : 'bg-blue-500'
                                    } text-white`}>
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <div className="ml-16">
                                        <h3 className={`text-lg leading-6 font-medium ${
                                            isDark ? 'text-dark-text-primary' : 'text-gray-900'
                                        }`}>
                                            URL Pendek
                                        </h3>
                                        <p className={`mt-2 text-base ${
                                            isDark ? 'text-dark-text-secondary' : 'text-gray-500'
                                        }`}>
                                            Ubah URL panjang menjadi pendek dan mudah diingat dengan satu klik.
                                        </p>
                                    </div>
                                </div>

                                {/* Feature 2 */}
                                <div className="relative">
                                    <div className={`absolute flex items-center justify-center h-12 w-12 rounded-md ${
                                        isDark ? 'bg-blue-500' : 'bg-blue-500'
                                    } text-white`}>
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                    <div className="ml-16">
                                        <h3 className={`text-lg leading-6 font-medium ${
                                            isDark ? 'text-dark-text-primary' : 'text-gray-900'
                                        }`}>
                                            Statistik Klik
                                        </h3>
                                        <p className={`mt-2 text-base ${
                                            isDark ? 'text-dark-text-secondary' : 'text-gray-500'
                                        }`}>
                                            Pantau jumlah klik dan statistik penggunaan URL Anda.
                                        </p>
                                    </div>
                                </div>

                                {/* Feature 3 */}
                                <div className="relative">
                                    <div className={`absolute flex items-center justify-center h-12 w-12 rounded-md ${
                                        isDark ? 'bg-blue-500' : 'bg-blue-500'
                                    } text-white`}>
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <div className="ml-16">
                                        <h3 className={`text-lg leading-6 font-medium ${
                                            isDark ? 'text-dark-text-primary' : 'text-gray-900'
                                        }`}>
                                            Keamanan
                                        </h3>
                                        <p className={`mt-2 text-base ${
                                            isDark ? 'text-dark-text-secondary' : 'text-gray-500'
                                        }`}>
                                            URL Anda aman dan terlindungi dengan sistem keamanan terbaik.
                                        </p>
                                    </div>
                                </div>

                                {/* Feature 4 */}
                                <div className="relative">
                                    <div className={`absolute flex items-center justify-center h-12 w-12 rounded-md ${
                                        isDark ? 'bg-blue-500' : 'bg-blue-500'
                                    } text-white`}>
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-16">
                                        <h3 className={`text-lg leading-6 font-medium ${
                                            isDark ? 'text-dark-text-primary' : 'text-gray-900'
                                        }`}>
                                            Kedaluwarsa
                                        </h3>
                                        <p className={`mt-2 text-base ${
                                            isDark ? 'text-dark-text-secondary' : 'text-gray-500'
                                        }`}>
                                            Atur waktu kedaluwarsa untuk URL Anda sesuai kebutuhan.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className={`${isDark ? 'bg-dark-bg-primary border-dark-border' : 'bg-white'} border-t`}>
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

export default Welcome; 