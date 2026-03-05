import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, Eye, EyeOff, LogIn, UserPlus, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultTab?: 'login' | 'register';
}

export function AuthModal({ isOpen, onClose, defaultTab = 'login' }: AuthModalProps) {
    const [tab, setTab] = useState<'login' | 'register'>(defaultTab);
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Login form
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    // Register form
    const [regName, setRegName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');

    const { login, register } = useAuth();

    const resetForms = () => {
        setLoginEmail(''); setLoginPassword('');
        setRegName(''); setRegEmail(''); setRegPassword('');
        setError(null); setShowPassword(false);
    };

    const handleClose = () => { resetForms(); onClose(); };

    const switchTab = (t: 'login' | 'register') => { setTab(t); setError(null); };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true); setError(null);
        try {
            await login(loginEmail, loginPassword);
            handleClose();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Login failed. Check your credentials.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (regPassword.length < 8) { setError('Password must be at least 8 characters.'); return; }
        setIsSubmitting(true); setError(null);
        try {
            await register(regName, regEmail, regPassword);
            handleClose();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClass = 'w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all text-sm';

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="fixed z-[70] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md px-4"
                    >
                        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">

                            {/* Header */}
                            <div className="flex items-center justify-between px-6 pt-6 pb-4">
                                <div>
                                    <h2 className="text-xl font-bold text-black dark:text-white">
                                        {tab === 'login' ? 'Welcome back' : 'Create account'}
                                    </h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                        {tab === 'login' ? 'Sign in to your account' : 'Join the community'}
                                    </p>
                                </div>
                                <button
                                    onClick={handleClose}
                                    className="p-2 rounded-lg text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Tab switcher */}
                            <div className="px-6 mb-6">
                                <div className="flex gap-1 p-1 rounded-lg bg-gray-100 dark:bg-gray-800">
                                    {(['login', 'register'] as const).map((t) => (
                                        <button
                                            key={t}
                                            onClick={() => switchTab(t)}
                                            className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${tab === t
                                                    ? 'bg-white dark:bg-gray-900 text-black dark:text-white shadow-sm'
                                                    : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
                                                }`}
                                        >
                                            {t === 'login' ? 'Login' : 'Register'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="px-6 pb-6">
                                {/* Error message */}
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-start gap-2.5 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-sm mb-4"
                                    >
                                        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                        <span>{error}</span>
                                    </motion.div>
                                )}

                                {/* ── LOGIN FORM ── */}
                                {tab === 'login' && (
                                    <form onSubmit={handleLogin} className="space-y-4">
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="email" required placeholder="Email address"
                                                value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
                                                className={inputClass}
                                            />
                                        </div>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type={showPassword ? 'text' : 'password'} required placeholder="Password"
                                                value={loginPassword} onChange={e => setLoginPassword(e.target.value)}
                                                className={`${inputClass} pr-10`}
                                            />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                        <button
                                            type="submit" disabled={isSubmitting}
                                            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-black dark:bg-white text-white dark:text-black font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? (
                                                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                </svg>
                                            ) : (
                                                <><LogIn className="w-4 h-4" /> Sign In</>
                                            )}
                                        </button>
                                        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                                            Don't have an account?{' '}
                                            <button type="button" onClick={() => switchTab('register')}
                                                className="text-black dark:text-white font-medium hover:underline">
                                                Register
                                            </button>
                                        </p>
                                    </form>
                                )}

                                {/* ── REGISTER FORM ── */}
                                {tab === 'register' && (
                                    <form onSubmit={handleRegister} className="space-y-4">
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="text" required placeholder="Full name"
                                                value={regName} onChange={e => setRegName(e.target.value)}
                                                className={inputClass}
                                            />
                                        </div>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="email" required placeholder="Email address"
                                                value={regEmail} onChange={e => setRegEmail(e.target.value)}
                                                className={inputClass}
                                            />
                                        </div>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type={showPassword ? 'text' : 'password'} required placeholder="Password (min. 8 chars)"
                                                value={regPassword} onChange={e => setRegPassword(e.target.value)}
                                                className={`${inputClass} pr-10`}
                                            />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                        <button
                                            type="submit" disabled={isSubmitting}
                                            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-black dark:bg-white text-white dark:text-black font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? (
                                                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                </svg>
                                            ) : (
                                                <><UserPlus className="w-4 h-4" /> Create Account</>
                                            )}
                                        </button>
                                        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                                            Already have an account?{' '}
                                            <button type="button" onClick={() => switchTab('login')}
                                                className="text-black dark:text-white font-medium hover:underline">
                                                Sign in
                                            </button>
                                        </p>
                                    </form>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
