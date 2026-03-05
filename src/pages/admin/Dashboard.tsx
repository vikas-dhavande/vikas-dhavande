import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { databases, PROJECTS_COLLECTION_ID, BLOGS_COLLECTION_ID } from '../../lib/appwrite';
import { FileText, FolderGit2, Users, Eye, TrendingUp, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { Models } from 'appwrite';

export function Dashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        blogs: 0,
        projects: 0,
        views: 1250, // Mocked for now
    });
    const [recentActivity, setRecentActivity] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                // Fetch total counts
                const [blogsList, projectsList] = await Promise.all([
                    databases.listDocuments(import.meta.env.VITE_APPWRITE_DATABASE_ID, BLOGS_COLLECTION_ID),
                    databases.listDocuments(import.meta.env.VITE_APPWRITE_DATABASE_ID, PROJECTS_COLLECTION_ID)
                ]);

                setStats({
                    blogs: blogsList.total,
                    projects: projectsList.total,
                    views: 1250 + Math.floor(Math.random() * 500) // Mock
                });

                // Mock recent activity based on the actual lists
                const activity = [
                    ...blogsList.documents.map(d => ({ type: 'blog', title: d.title, date: new Date(d.$createdAt).toLocaleDateString() })),
                    ...projectsList.documents.map(d => ({ type: 'project', title: d.name, date: new Date(d.$createdAt).toLocaleDateString() }))
                ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

                setRecentActivity(activity);
            } catch (error) {
                console.error("Error fetching admin stats:", error);
            } finally {
                setIsLoading(false);
            }
        }

        if (user) fetchStats();
    }, [user]);

    const statCards = [
        { label: 'Total Blogs', value: stats.blogs, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
        { label: 'Active Projects', value: stats.projects, icon: FolderGit2, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-500/10' },
        { label: 'Total Views', value: stats.views.toLocaleString(), icon: Eye, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10' },
        { label: 'Subscribers', value: '42', icon: Users, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-500/10' },
    ];

    return (
        <div className="p-6 lg:p-10 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b border-gray-200 dark:border-gray-800 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
                        Dashboard Overview
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Welcome back, {user?.name}. Here's what's happening today.
                    </p>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800/50 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700">
                    <Clock className="w-4 h-4" />
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </div>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-32 rounded-2xl bg-gray-100 dark:bg-gray-800/50 animate-pulse border border-gray-200 dark:border-gray-700/50" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {statCards.map((stat, i) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            key={stat.label}
                            className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800/60 shadow-sm hover:shadow-md transition-shadow group flex items-start justify-between"
                        >
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                    {stat.label}
                                </p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-black dark:group-hover:text-white transition-colors">
                                    {stat.value}
                                </p>
                                <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3" />
                                    +12% from last month
                                </p>
                            </div>
                            <div className={`p-4 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Recent Activity */}
                <div className="col-span-1 lg:col-span-2 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 py-6">
                    <div className="px-6 border-b border-gray-100 dark:border-gray-800 pb-4 mb-4 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Activity</h2>
                    </div>

                    <div className="px-6">
                        {isLoading ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map(i => <div key={i} className="h-16 rounded-xl bg-gray-100 dark:bg-gray-800/50 animate-pulse border border-gray-200 dark:border-gray-700/50" />)}
                            </div>
                        ) : recentActivity.length === 0 ? (
                            <div className="text-center py-10 text-gray-500">
                                No recent activity to show.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentActivity.map((activity, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50/50 dark:bg-gray-800/20 border border-gray-100 dark:border-gray-800 hover:bg-gray-50 hover:dark:bg-gray-800/50 transition-colors">
                                        <div className={`p-3 rounded-lg flex-shrink-0 ${activity.type === 'blog' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' : 'bg-green-100 text-green-600 dark:bg-green-900/30'}`}>
                                            {activity.type === 'blog' ? <FileText className="w-5 h-5" /> : <FolderGit2 className="w-5 h-5" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                                {activity.title}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {activity.type === 'blog' ? 'Blog Post' : 'Project'} • {activity.date}
                                            </p>
                                        </div>
                                        <button className="px-3 py-1.5 text-xs font-semibold rounded-md border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white transition-colors">
                                            Edit
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions / System Status */}
                <div className="col-span-1 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <div className="px-6 py-6 border-b border-gray-100 dark:border-gray-800">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Quick Actions</h2>
                    </div>

                    <div className="p-4 bg-gray-50/50 dark:bg-gray-800/30 grid grid-cols-2 gap-4 h-full">
                        <button className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-black dark:hover:border-white hover:shadow-sm transition-all text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white group">
                            <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors">
                                <FileText className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-medium">New Blog</span>
                        </button>

                        <button className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-black dark:hover:border-white hover:shadow-sm transition-all text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white group">
                            <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors">
                                <FolderGit2 className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-medium">New Project</span>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
