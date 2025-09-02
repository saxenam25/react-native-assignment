import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AuthenticationService from '../services/authentication.service';

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    login: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkAuthenticationStatus();
    }, []);

    const checkAuthenticationStatus = async () => {
        try {
            const hasToken = await AuthenticationService.hasValidToken();
            setIsAuthenticated(hasToken);
        } catch (error) {
            console.error('Error checking authentication:', error);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    };

    const login = () => {
        setIsAuthenticated(true);
    };

    const logout = async () => {
        try {
            await AuthenticationService.logout();
            setIsAuthenticated(false);
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
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

//? Write here whats happening in this file and how to use the AuthContext and useAuth hook in other components.
// This file defines an authentication context for a React Native application using React's Context API.
// It provides a way to manage and access authentication state (whether a user is logged in or not) across the app.
// The AuthProvider component wraps around parts of the app that need access to authentication state.
// The useAuth hook allows components to easily access the authentication state and actions (login, logout).
