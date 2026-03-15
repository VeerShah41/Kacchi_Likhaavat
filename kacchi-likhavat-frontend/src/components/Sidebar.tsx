import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    BookOpen,
    LayoutDashboard,
    FileText,
    BookOpenCheck,
    Receipt,
    Brain,
    Settings,
    LogOut,
    Sun,
    Moon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Sidebar: React.FC = () => {
    const location = useLocation();
    const { logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: FileText,        label: 'Notes',     path: '/notes' },
        { icon: BookOpenCheck,   label: 'Stories',   path: '/stories' },
        { icon: Receipt,         label: 'Expenses',  path: '/expenses' },
        { icon: Brain,           label: 'Memory',    path: '/memory' },
        { icon: Settings,        label: 'Settings',  path: '/settings' },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <aside className="sidebar">
            {/* Logo */}
            <div className="p-6" style={{ borderBottom: '1px solid var(--border-default)' }}>
                <Link to="/" className="flex items-center gap-3 group">
                    <BookOpen className="w-8 h-8 transition-transform group-hover:scale-110"
                        style={{ color: 'var(--text-link)' }} />
                    <span className="text-xl font-display font-bold gradient-text">
                        Kacchi Likhavat
                    </span>
                </Link>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 py-6 overflow-y-auto scrollbar-hide">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`sidebar-item ${isActive(item.path) ? 'sidebar-item-active' : ''}`}
                        >
                            <Icon className="w-5 h-5" />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom actions */}
            <div className="p-4 space-y-2" style={{ borderTop: '1px solid var(--border-default)' }}>
                {/* Theme toggle */}
                <button
                    onClick={toggleTheme}
                    className="sidebar-item w-full"
                    style={{ color: 'var(--text-muted)' }}
                >
                    {isDark
                        ? <><Sun className="w-5 h-5" /><span>Light Mode</span></>
                        : <><Moon className="w-5 h-5" /><span>Dark Mode</span></>
                    }
                </button>

                {/* Logout */}
                <button
                    onClick={logout}
                    className="sidebar-item w-full"
                    style={{ color: '#f87171' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(248,113,113,0.12)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
