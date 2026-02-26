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
    LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar: React.FC = () => {
    const location = useLocation();
    const { logout } = useAuth();

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: FileText, label: 'Notes', path: '/notes' },
        { icon: BookOpenCheck, label: 'Stories', path: '/stories' },
        { icon: Receipt, label: 'Expenses', path: '/expenses' },
        { icon: Brain, label: 'Memory', path: '/memory' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <aside className="sidebar">
            {/* Logo */}
            <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <BookOpen className="w-8 h-8 text-primary-600" />
                    <span className="text-xl font-display font-bold gradient-text">
                        Kacchi Likhavat
                    </span>
                </div>
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
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-gray-100">
                <button
                    onClick={logout}
                    className="sidebar-item w-full text-red-600 hover:bg-red-50"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
