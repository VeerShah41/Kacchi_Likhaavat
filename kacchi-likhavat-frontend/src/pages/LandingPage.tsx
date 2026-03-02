import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    FileText,
    BookOpenCheck,
    Receipt,
    Brain,
    LayoutDashboard,
    ArrowRight,
    CheckCircle2,
    Sparkles
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const LandingPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Redirect to dashboard if already logged in
    useEffect(() => {
        if (user) {
            navigate('/dashboard', { replace: true });
        }
    }, [user, navigate]);
    const features = [
        {
            icon: FileText,
            title: 'Smart Notes',
            description: 'Capture your thoughts with rich text formatting and smart organization',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            icon: BookOpenCheck,
            title: 'Stories with Chapters',
            description: 'Write and organize your stories with multiple chapters and auto-save',
            color: 'from-purple-500 to-pink-500'
        },
        {
            icon: Receipt,
            title: 'Expense Tracker',
            description: 'Track your expenses with beautiful charts and detailed insights',
            color: 'from-green-500 to-emerald-500'
        },
        {
            icon: Brain,
            title: 'Memory Journal',
            description: 'Preserve your memories in a beautiful timeline with mood tracking',
            color: 'from-orange-500 to-red-500'
        },
        {
            icon: LayoutDashboard,
            title: 'Personal Dashboard',
            description: 'Get a bird\'s eye view of all your content in one place',
            color: 'from-indigo-500 to-violet-500'
        }
    ];

    const roadmap = [
        {
            version: 'V1',
            status: 'In Progress',
            title: 'Core Features',
            items: ['Notes', 'Stories', 'Expenses', 'Memory Journal', 'Dashboard']
        },
        {
            version: 'V2',
            status: 'Planned',
            title: 'Sharing + Chat',
            items: ['Share notes & stories', 'Real-time chat', 'Collaboration tools']
        },
        {
            version: 'V3',
            status: 'Future',
            title: 'Real-time Collaboration',
            items: ['Live editing', 'Comments', 'Team workspaces']
        }
    ];

    return (
        <div className="min-h-screen">
            <Navbar />

            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 px-8">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-100/50 via-accent-100/30 to-transparent"></div>

                <div className="relative max-w-6xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-2 rounded-full shadow-lg mb-8 animate-fade-in">
                        <Sparkles className="w-4 h-4 text-accent-600" />
                        <span className="text-sm font-medium text-gray-700">Your Personal Creative Space</span>
                    </div>

                    <h1 className="text-6xl md:text-7xl font-display font-bold mb-6 animate-slide-up">
                        Write <span className="gradient-text">Freely</span>.
                        <br />
                        Organize <span className="gradient-text">Smartly</span>.
                        <br />
                        Remember <span className="gradient-text">Everything</span>.
                    </h1>

                    <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto animate-fade-in">
                        Kacchi Likhavat is your all-in-one platform for notes, stories, expenses, and memories.
                        Built for creators who think, write, and organize beautifully.
                    </p>

                    <div className="flex gap-4 justify-center animate-slide-up">
                        <Link to="/signup" className="btn-primary text-lg group">
                            Get Started
                            <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <a href="#features" className="btn-secondary text-lg">
                            View Features
                        </a>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 px-8 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
                            Everything You Need in <span className="gradient-text">One Place</span>
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Powerful features designed to help you create, organize, and remember
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div key={index} className="feature-card group" style={{ animationDelay: `${index * 0.1}s` }}>
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform`}>
                                        <Icon className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="text-xl font-display font-semibold mb-3">{feature.title}</h3>
                                    <p className="text-gray-600">{feature.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Roadmap Section */}
            <section id="roadmap" className="py-20 px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
                            Our <span className="gradient-text">Roadmap</span>
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Building the future of personal organization, one version at a time
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {roadmap.map((phase, index) => (
                            <div key={index} className="card card-hover">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-3xl font-display font-bold gradient-text">{phase.version}</span>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${phase.status === 'In Progress' ? 'bg-green-100 text-green-700' :
                                        phase.status === 'Planned' ? 'bg-blue-100 text-blue-700' :
                                            'bg-gray-100 text-gray-700'
                                        }`}>
                                        {phase.status}
                                    </span>
                                </div>
                                <h3 className="text-xl font-semibold mb-4">{phase.title}</h3>
                                <ul className="space-y-2">
                                    {phase.items.map((item, i) => (
                                        <li key={i} className="flex items-start gap-2 text-gray-600">
                                            <CheckCircle2 className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-8 bg-gradient-to-br from-primary-600 to-accent-600 text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
                        Ready to Get Started?
                    </h2>
                    <p className="text-xl text-primary-100 mb-10">
                        Join Kacchi Likhavat today and transform the way you write, organize, and remember.
                    </p>
                    <Link to="/signup" className="btn bg-white text-primary-600 hover:bg-gray-100 text-lg shadow-2xl">
                        Create Your Account
                        <ArrowRight className="inline-block ml-2 w-5 h-5" />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-8 bg-white border-t border-gray-100">
                <div className="max-w-6xl mx-auto text-center text-gray-600">
                    <p>© 2026 Kacchi Likhavat. Made with ❤️ for creators.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
