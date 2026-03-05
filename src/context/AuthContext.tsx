import React, { createContext, useContext, useEffect, useState } from 'react';
import { Models } from 'appwrite';
import { account, ID } from '../lib/appwrite';

// ─── Types ────────────────────────────────────────────────────────────────────
type User = Models.User<Models.Preferences>;

interface AuthContextValue {
    user: User | null;
    loading: boolean;
    isLoggedIn: boolean;
    isAdmin: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Restore session on mount
    useEffect(() => {
        account.get()
            .then(setUser)
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    const login = async (email: string, password: string) => {
        await account.createEmailPasswordSession(email, password);
        const me = await account.get();
        setUser(me);
    };

    const register = async (name: string, email: string, password: string) => {
        await account.create(ID.unique(), email, password, name);
        await account.createEmailPasswordSession(email, password);
        const me = await account.get();
        setUser(me);
    };

    const logout = async () => {
        await account.deleteSession('current');
        setUser(null);
    };

    // Derived role helpers
    const isLoggedIn = !!user;
    const isAdmin = user?.labels?.includes('admin') ?? false;

    return (
        <AuthContext.Provider value={{ user, loading, isLoggedIn, isAdmin, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
