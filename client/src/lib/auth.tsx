import * as React from 'react';
import { apiFetch } from './api';

export interface IAuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    checkSession: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = React.createContext<IAuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);

    const checkSession = React.useCallback(async () => {
        setIsLoading(true);
        try {
            // The browser automatically sends the HttpOnly cookie
            await apiFetch('auth/me');
            setIsAuthenticated(true);
        } catch (error) {
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    }, []);

    React.useEffect(() => {
        checkSession();
    }, [checkSession]);

    const logout = async () => {
        // this will tell the browser to remove the cookie
        await apiFetch('auth/logout', { method: 'POST' });
        setIsAuthenticated(false);
    };

    const value = {
        isAuthenticated,
        isLoading,
        checkSession,
        logout,
    };

    return <AuthContext.Provider value={value}> {children} </AuthContext.Provider>;
}

export function useAuth() {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}