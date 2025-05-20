import './bootstrap';
import '../css/app.css';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './context/ThemeContext';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Welcome from './pages/Welcome';
import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';

function PrivateRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    return user ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    return !user ? children : <Navigate to="/dashboard" />;
}

const App = () => {
    return (
        <AuthProvider>
            <ThemeProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<Welcome />} />
                        <Route 
                            path="/login" 
                            element={
                                <PublicRoute>
                                    <Login />
                                </PublicRoute>
                            } 
                        />
                        <Route 
                            path="/register" 
                            element={
                                <PublicRoute>
                                    <Register />
                                </PublicRoute>
                            } 
                        />
                        <Route 
                            path="/dashboard" 
                            element={
                                <PrivateRoute>
                                    <Dashboard />
                                </PrivateRoute>
                            } 
                        />
                    </Routes>
                </Router>
            </ThemeProvider>
        </AuthProvider>
    );
};

const root = createRoot(document.getElementById('app'));
root.render(<App />); 