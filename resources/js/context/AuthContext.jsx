import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Setup axios interceptor
axios.interceptors.response.use(
    response => response,
    error => {
        console.log('Axios interceptor error:', error.response?.status);
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            delete axios.defaults.headers.common['Authorization'];
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const isMounted = useRef(true);

    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        console.log('Checking auth, token exists:', !!token);
        
        if (!token) {
            console.log('No token found');
            if (isMounted.current) {
                setLoading(false);
            }
            return;
        }

        try {
            // Set default header untuk axios
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            console.log('Authorization header set');
            
            // Cek token dengan endpoint /api/me
            console.log('Calling /api/me endpoint');
            const response = await axios.get('/api/me');
            
            if (response.data && response.data.status === 'success' && response.data.user) {
                const userData = response.data.user;
                
                // Update localStorage dengan data terbaru
                localStorage.setItem('user', JSON.stringify(userData));
                
                // Update state jika komponen masih termount
                if (isMounted.current) {
                    setUser(userData);
                }
            } else {
                throw new Error('Response tidak mengandung data user');
            }
        } catch (error) {
            console.error('Auth check error:', error);
            
            // Jika token tidak valid, hapus dari localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            delete axios.defaults.headers.common['Authorization'];
            
            if (isMounted.current) {
                setUser(null);
            }
        } finally {
            if (isMounted.current) {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        console.log('AuthProvider mounted');
        // Inisialisasi state
        checkAuth();

        // Cleanup function
        return () => {
            isMounted.current = false;
        };
    }, []);

    const login = async (email, password) => {
        try {
            console.log('Attempting login for:', email);
            const response = await axios.post('/api/login', {
                email,
                password
            });

            console.log('Login response:', response.data);

            // Periksa apakah response memiliki token dan user
            if (response.data && response.data.token && response.data.user) {
                const { token, user } = response.data;
                console.log('Login successful, setting token and user');
                
                // Simpan token dan user
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                
                // Set header untuk request selanjutnya
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                
                // Update state
                if (isMounted.current) {
                    setUser(user);
                }
                return { success: true };
            } else {
                console.error('Invalid login response format:', response.data);
                return {
                    success: false,
                    message: 'Format response login tidak valid'
                };
            }
        } catch (error) {
            console.error('Login error:', error.response?.data);
            return {
                success: false,
                message: error.response?.data?.message || 'Terjadi kesalahan saat login',
                errors: error.response?.data?.errors || {}
            };
        }
    };

    const register = async (name, email, password, password_confirmation) => {
        try {
            console.log('Attempting registration for:', email);
            const response = await axios.post('/api/register', {
                name,
                email,
                password,
                password_confirmation
            });

            console.log('Register response:', response.data);

            if (response.data && response.data.token && response.data.user) {
                const { token, user } = response.data;
                console.log('Registration successful, setting token and user');
                
                // Simpan token dan user
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                
                // Set header untuk request selanjutnya
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                
                // Update state
                if (isMounted.current) {
                    setUser(user);
                }
                return { success: true };
            } else {
                console.error('Invalid register response format:', response.data);
                return {
                    success: false,
                    message: 'Format response registrasi tidak valid'
                };
            }
        } catch (error) {
            console.error('Registration error:', error.response?.data);
            return {
                success: false,
                message: error.response?.data?.message || 'Terjadi kesalahan saat registrasi',
                errors: error.response?.data?.errors || {}
            };
        }
    };

    const logout = async () => {
        try {
            console.log('Attempting logout');
            // Dapatkan token untuk request logout
            const token = localStorage.getItem('token');
            
            if (token) {
                // Pastikan header Authorization diset dengan benar
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                
                // Kirim request logout ke server - tunggu respons sebelum menghapus data
                await axios.post('/api/logout');
                console.log('Logout successful from server');
            }
            
            // Clear data authentication
            console.log('Clearing auth data');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            delete axios.defaults.headers.common['Authorization'];
            
            if (isMounted.current) {
                setUser(null);
            }
            
            return { success: true };
        } catch (error) {
            console.error('Logout error:', error);
            
            // Jika ada error, tetap hapus data lokal
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            delete axios.defaults.headers.common['Authorization'];
            
            if (isMounted.current) {
                setUser(null);
            }
            
            throw error;
        }
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}; 