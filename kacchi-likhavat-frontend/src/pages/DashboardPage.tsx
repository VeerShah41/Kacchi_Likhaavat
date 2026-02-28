import React, { useEffect, useState } from 'react';
import { FileText, BookOpenCheck, Receipt, Brain, TrendingUp } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { dashboardAPI, type DashboardData } from '../utils/api';
import { useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const response = await dashboardAPI.get();
            if (response.success) {
                setDashboardData(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate stats from dashboard data
    const stats = [
        {
            icon: FileText,
            label: 'Total Notes',
            value: dashboardData?.stats.notesCount.toString() || '0',
            change: `${dashboardData?.stats.notesCount || 0} notes created`,
            color: 'from-blue-500 to-cyan-500'
        },
        {
            icon: BookOpenCheck,
            label: 'Stories Created',
            value: dashboardData?.stats.storiesCount.toString() || '0',
            change: `${dashboardData?.stats.memoriesCount || 0} memories`,
            color: 'from-purple-500 to-pink-500'
        },
        {
            icon: Receipt,
            label: 'Total Expenses',
            value: dashboardData?.stats.expensesCount.toString() || '0',
            change: 'Track spending',
            color: 'from-green-500 to-emerald-500'
        },
        {
            icon: Brain,
            label: 'Total Rooms',
            value: dashboardData?.stats.roomsCount.toString() || '0',
            change: 'All content spaces',
            color: 'from-orange-500 to-red-500'
        }
    ];

    const getIconForType = (type: string) => {
        switch (type) {
            case 'note': return FileText;
            case 'story': return BookOpenCheck;
            case 'memory': return Receipt;
            default: return Brain;
        }
    };

    const getColorForType = (type: string) => {
        switch (type) {
            case 'note': return 'text-blue-500 bg-blue-50';
            case 'story': return 'text-purple-500 bg-purple-50';
            case 'memory': return 'text-green-500 bg-green-50';
            default: return 'text-orange-500 bg-orange-50';
        }
    };

    const formatTimeAgo = (date: string) => {
        const now = new Date();
        const past = new Date(date);

        // Check if date is valid
        if (isNaN(past.getTime())) {
            return 'Just now';
        }

        const diffMs = now.getTime() - past.getTime();
        const diffMins = Math.max(0, Math.floor(diffMs / 60000));
        const diffHours = Math.max(0, Math.floor(diffMs / 3600000));
        const diffDays = Math.max(0, Math.floor(diffMs / 86400000));

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        return `${diffDays} days ago`;
    };



    return (
        <div className="flex min-h-screen">
            <Sidebar />

            <main className="flex-1 ml-64 p-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <div className="glass rounded-3xl p-8 bg-gradient-to-br from-primary-500 to-accent-500 text-white">
                        <h1 className="text-4xl font-display font-bold mb-2">
                            Hi {user?.email?.split('@')[0] || 'There'} 👋
                        </h1>
                        <p className="text-primary-100 text-lg">
                            Welcome back! Here's what's happening with your creative space.
                        </p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div key={index} className="stat-card">
                                <div>
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                                    <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
                                        <TrendingUp className="w-4 h-4" />
                                        <span>{stat.change}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Recent Activity */}
                <div className="card">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-display font-semibold">Recent Activity</h2>
                    </div>

                    {loading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                            <p className="text-gray-600 mt-4">Loading your activity...</p>
                        </div>
                    ) : dashboardData && dashboardData.recentActivity.length > 0 ? (
                        <div className="space-y-4">
                            {dashboardData.recentActivity.map((activity) => {
                                const Icon = getIconForType(activity.type);
                                return (
                                    <div
                                        key={activity._id}
                                        onClick={() => {
                                            if (activity.type === 'note') navigate('/notes');
                                            else if (activity.type === 'story') navigate('/stories');
                                            else if (activity.type === 'expense') navigate('/expenses');
                                            else if (activity.type === 'memory') navigate('/memory');
                                        }}
                                        className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
                                    >
                                        <div className={`w-12 h-12 rounded-xl ${getColorForType(activity.type)} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                                                {activity.title || `Untitled ${activity.type}`}
                                            </h3>
                                            <p className="text-sm text-gray-500">{formatTimeAgo(activity.date)}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No rooms yet</h3>
                            <p className="text-gray-600">Create your first room to get started!</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;
