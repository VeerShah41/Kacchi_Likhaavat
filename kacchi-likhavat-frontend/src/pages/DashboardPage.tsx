import React, { useEffect, useState } from 'react';
import { FileText, BookOpenCheck, Receipt, Brain, TrendingUp, Sparkles } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { dashboardAPI, type DashboardData } from '../utils/api';
import { useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchDashboard(); }, []);

    const fetchDashboard = async () => {
        try {
            const response = await dashboardAPI.get();
            if (response.success) setDashboardData(response.data);
        } catch (error) {
            console.error('Failed to fetch dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const stats = [
        { icon: FileText,        label: 'Total Notes',       value: dashboardData?.stats.notesCount.toString()   || '0', change: `${dashboardData?.stats.notesCount || 0} notes created`,          gradient: 'from-sky-400 to-blue-600' },
        { icon: BookOpenCheck,   label: 'Stories Created',   value: dashboardData?.stats.storiesCount.toString() || '0', change: `${dashboardData?.stats.memoriesCount || 0} memories`,             gradient: 'from-violet-400 to-indigo-600' },
        { icon: Receipt,         label: 'Total Expenses',    value: dashboardData?.stats.expensesCount.toString()|| '0', change: 'Track spending',                                                    gradient: 'from-emerald-400 to-teal-600' },
        { icon: Brain,           label: 'Total Rooms',       value: dashboardData?.stats.roomsCount.toString()   || '0', change: 'All content spaces',                                               gradient: 'from-rose-400 to-pink-600' },
    ];

    const getIconForType = (type: string) => {
        switch (type) {
            case 'note': return FileText; case 'story': return BookOpenCheck;
            case 'expense': return Receipt; default: return Brain;
        }
    };

    const getColorForType = (type: string) => {
        switch (type) {
            case 'note':    return { bg: 'rgba(56,189,248,0.15)',  icon: '#38bdf8' };
            case 'story':   return { bg: 'rgba(167,139,250,0.15)', icon: '#a78bfa' };
            case 'expense': return { bg: 'rgba(52,211,153,0.15)',  icon: '#34d399' };
            default:        return { bg: 'rgba(251,113,133,0.15)', icon: '#fb7185' };
        }
    };

    const formatTimeAgo = (date: string) => {
        const now = new Date(), past = new Date(date);
        if (isNaN(past.getTime())) return 'Just now';
        const diffMins  = Math.max(0, Math.floor((now.getTime() - past.getTime()) / 60000));
        const diffHours = Math.max(0, Math.floor(diffMins / 60));
        const diffDays  = Math.max(0, Math.floor(diffHours / 24));
        if (diffMins < 1)  return 'Just now';
        if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
        if (diffDays === 1) return 'Yesterday';
        return `${diffDays} days ago`;
    };

    const firstName = user?.email?.split('@')[0] || 'there';

    return (
        <div className="flex min-h-screen">
            <Sidebar />

            <main className="flex-1 ml-64 p-8">
                {/* ── Welcome Banner ── */}
                <div className="mb-8">
                    <div className="rounded-3xl p-8 relative overflow-hidden"
                        style={{ background: 'linear-gradient(135deg, var(--bg-body-from) 0%, var(--bg-body-mid) 50%, var(--accent-b) 100%)' }}>
                        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-25 pointer-events-none"
                            style={{ background: 'radial-gradient(circle, var(--orb-a) 0%, transparent 70%)' }} />
                        <div className="relative">
                            <div className="flex items-center gap-2 mb-1">
                                <Sparkles className="w-5 h-5" style={{ color: 'var(--text-link)' }} />
                                <span className="text-sm font-medium" style={{ color: 'var(--text-link)' }}>Your creative space</span>
                            </div>
                            <h1 className="text-4xl font-display font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                                Hey, {firstName} 👋
                            </h1>
                            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                                Good to have you back. Here's a peek at everything you've been building.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── Stats ── */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div key={index} className="stat-card">
                                <div>
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-3 shadow-md`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>{stat.label}</p>
                                    <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{stat.value}</p>
                                    <div className="flex items-center gap-1 mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                                        <TrendingUp className="w-4 h-4" />
                                        <span>{stat.change}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* ── Recent Activity ── */}
                <div className="card">
                    <h2 className="text-2xl font-display font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>Recent Activity</h2>

                    {loading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
                                style={{ borderColor: 'var(--text-muted)' }} />
                            <p style={{ color: 'var(--text-secondary)' }}>Loading your activity…</p>
                        </div>
                    ) : dashboardData && dashboardData.recentActivity.length > 0 ? (
                        <div className="space-y-2">
                            {dashboardData.recentActivity.map((activity) => {
                                const Icon   = getIconForType(activity.type);
                                const colors = getColorForType(activity.type);
                                return (
                                    <div
                                        key={activity._id}
                                        onClick={() => {
                                            if (activity.type === 'note') navigate('/notes');
                                            else if (activity.type === 'story') navigate('/stories');
                                            else if (activity.type === 'expense') navigate('/expenses');
                                            else navigate('/memory');
                                        }}
                                        className="flex items-center gap-4 p-4 rounded-xl cursor-pointer group transition-all duration-200"
                                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--accent-glow)')}
                                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                    >
                                        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                                            style={{ background: colors.bg }}>
                                            <Icon className="w-6 h-6" style={{ color: colors.icon }} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                                                {activity.title || `Untitled ${activity.type}`}
                                            </h3>
                                            <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
                                                {formatTimeAgo(activity.date)}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Brain className="w-16 h-16 mx-auto mb-4 opacity-30" style={{ color: 'var(--text-muted)' }} />
                            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Nothing here yet</h3>
                            <p style={{ color: 'var(--text-secondary)' }}>
                                Start creating — your first note, story, or memory is just a click away.
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;
