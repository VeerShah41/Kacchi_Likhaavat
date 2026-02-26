import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authAPI } from '../utils/api';

interface User {
    id: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in from localStorage
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
            try {
                setUser(JSON.parse(storedUser));
                setIsAuthenticated(true);
            } catch (error) {
                console.error('Failed to parse stored user:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await authAPI.login(email, password);

            if (response.success && response.data) {
                const { token, user: userData } = response.data;

                // Store token and user data
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(userData));

                setUser(userData);
                setIsAuthenticated(true);
            } else {
                throw new Error(response.message || 'Login failed');
            }
        } catch (error: any) {
            console.error('Login failed:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Login failed. Please try again.';
            throw new Error(errorMessage);
        }
    };

    const signup = async (email: string, password: string) => {
        try {
            const response = await authAPI.register(email, password);

            if (response.success && response.data) {
                const { token, user: userData } = response.data;

                // Store token and user data
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(userData));

                setUser(userData);
                setIsAuthenticated(true);
            } else {
                throw new Error(response.message || 'Signup failed');
            }
        } catch (error: any) {
            console.error('Signup failed:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Signup failed. Please try again.';
            throw new Error(errorMessage);
        }
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
