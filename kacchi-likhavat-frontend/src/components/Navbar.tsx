import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const Navbar: React.FC = () => {
    return (
        <nav className="navbar">
            <div className="flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-primary-600" />
                <span className="text-2xl font-display font-bold gradient-text">
                    Kacchi Likhavat
                </span>
            </div>

            <div className="hidden md:flex items-center gap-8">
                <a href="#features" className="text-gray-700 hover:text-primary-600 font-medium">
                    Features
                </a>
                <a href="#roadmap" className="text-gray-700 hover:text-primary-600 font-medium">
                    Roadmap
                </a>
                <Link to="/login" className="text-gray-700 hover:text-primary-600 font-medium">
                    Login
                </Link>
                <Link to="/signup" className="btn-primary">
                    Get Started
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
