import { User, Mail, Shield, Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function AdminSettings() {
    const { user } = useAuth();

    return (
        <div className="p-6 lg:p-8 space-y-8">
            {/* Page header */}
            <div className="pb-6 border-b border-gray-200 dark:border-gray-800">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Manage your account and admin preferences.
                </p>
            </div>

            {/* Account info */}
            <section className="space-y-4">
                <h2 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Account
                </h2>
                <div className="rounded-xl border border-gray-200 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800 overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4">
                        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                            <User className="w-4 h-4 shrink-0" />
                            <span>Name</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {user?.name || '—'}
                        </span>
                    </div>
                    <div className="flex items-center justify-between px-5 py-4">
                        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                            <Mail className="w-4 h-4 shrink-0" />
                            <span>Email</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {user?.email || '—'}
                        </span>
                    </div>
                    <div className="flex items-center justify-between px-5 py-4">
                        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                            <Shield className="w-4 h-4 shrink-0" />
                            <span>Role</span>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-400 uppercase tracking-wide">
                            Admin
                        </span>
                    </div>
                </div>
            </section>

            {/* Info notice */}
            <section>
                <div className="flex gap-3 rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-900/10 px-5 py-4">
                    <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-700 dark:text-blue-300">
                        <p className="font-semibold mb-0.5">Manage your account in Appwrite</p>
                        <p className="text-blue-600 dark:text-blue-400">
                            To update your password, name, or email, please use the{' '}
                            <a
                                href="https://cloud.appwrite.io"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
                            >
                                Appwrite Console
                            </a>
                            .
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
