import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, LayoutDashboard, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const { isDark, toggleTheme } = useTheme();

    return (
        <nav className="navbar">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
                <BookOpen className="w-8 h-8 transition-transform group-hover:scale-110"
                    style={{ color: 'var(--text-link)' }} />
                <span className="text-2xl font-display font-bold gradient-text">
                    Kacchi Likhavat
                </span>
            </Link>

            {/* Nav links + actions */}
            <div className="hidden md:flex items-center gap-6">
                <a href="#features" className="font-medium transition-colors duration-200"
                    style={{ color: 'var(--text-secondary)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}>
                    Features
                </a>
                <a href="#roadmap" className="font-medium transition-colors duration-200"
                    style={{ color: 'var(--text-secondary)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}>
                    Roadmap
                </a>

                {/* Theme toggle */}
                <button onClick={toggleTheme} className="theme-toggle" title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
                    {isDark
                        ? <Sun className="w-5 h-5" />
                        : <Moon className="w-5 h-5" />}
                </button>

                {isAuthenticated ? (
                    <Link to="/dashboard" className="btn-primary text-sm">
                        <LayoutDashboard className="w-4 h-4" />
                        Go to Dashboard
                    </Link>
                ) : (
                    <Link to="/signup" className="btn-primary text-sm">
                        Join Free
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
