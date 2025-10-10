import * as React from 'react';
import { apiFetch } from './api';

interface User {
    id: string;
    email: string;
}

export interface IAuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: User | null;
    checkSession: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = React.createContext<IAuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = React.useState<User | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);

    const checkSession = React.useCallback(async () => {
        setIsLoading(true);
        try {
            // The browser automatically sends the HttpOnly cookie
            const userData = await apiFetch('/auth/me');
            setUser(userData);
        } catch (error) {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    React.useEffect(() => {
        checkSession();
    }, [checkSession]);

    const logout = async () => {
        // this will tell the browser to remove the cookie
        await apiFetch('/auth/logout', { method: 'POST' });
        setUser(null); 
    };

    const value = {
        isAuthenticated: !!user,
        user,
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