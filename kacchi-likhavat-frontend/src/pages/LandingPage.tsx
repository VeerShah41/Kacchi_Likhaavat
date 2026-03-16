import React from 'react';
import { Link } from 'react-router-dom';
import {
    FileText, BookOpenCheck, Receipt, Brain,
    LayoutDashboard, ArrowRight, CheckCircle2,
    Sparkles, Heart, PenLine, Star
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const LandingPage: React.FC = () => {
    const { isAuthenticated, user } = useAuth();
    const firstName = user?.email?.split('@')[0] || null;

    const features = [
        { icon: FileText, title: 'Smart Notes', description: 'Jot down ideas, thoughts, or anything on your mind — beautifully organized and always within reach.', color: 'from-sky-400 to-blue-600' },
        { icon: BookOpenCheck, title: 'Stories with Chapters', description: 'Pen your stories chapter by chapter with auto-save, so you never lose a single sentence.', color: 'from-amber-400 to-orange-500' },
        { icon: Receipt, title: 'Expense Tracker', description: 'Keep tabs on your spending — no spreadsheets, just clean visuals and honest numbers.', color: 'from-emerald-400 to-teal-600' },
        { icon: Brain, title: 'Memory Journal', description: 'Your memories deserve more than a photo dump. Build a timeline of moments that matter.', color: 'from-rose-400 to-pink-600' },
        { icon: LayoutDashboard, title: 'Personal Dashboard', description: 'Everything you create, in one thoughtful view. Your personal corner of the internet.', color: 'from-violet-400 to-indigo-600' }
    ];

    const roadmap = [
        { version: 'V1', status: 'In Progress', title: 'Core Features', items: ['Notes', 'Stories', 'Expenses', 'Memory Journal', 'Dashboard'] },
        { version: 'V2', status: 'Planned', title: 'Sharing + Chat', items: ['Share notes & stories', 'Real-time chat', 'Collaboration tools'] },
        { version: 'V3', status: 'Future', title: 'Real-time Collaboration', items: ['Live editing', 'Comments', 'Team workspaces'] }
    ];

    return (
        <div className="min-h-screen">
            <Navbar />

            {/* ── Hero ─────────────────────────────────────── */}
            <section className="relative overflow-hidden py-28 px-6 md:px-12">
                <div className="absolute -top-40 -right-40 w-[480px] h-[480px] rounded-full pointer-events-none"
                    style={{ background: `radial-gradient(circle, var(--orb-a) 0%, transparent 70%)` }} />
                <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full pointer-events-none"
                    style={{ background: `radial-gradient(circle, var(--orb-b) 0%, transparent 70%)` }} />

                <div className="relative max-w-5xl mx-auto text-center">
                    {/* Pill */}
                    <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full mb-8 animate-fade-in"
                        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)' }}>
                        {isAuthenticated
                            ? <><Heart className="w-4 h-4" style={{ color: 'var(--text-link)' }} />
                                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Welcome back{firstName ? `, ${firstName}` : ''}! ✨</span></>
                            : <><Star className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                                <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Your personal creative space</span></>
                        }
                    </div>

                    <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 animate-slide-up leading-tight"
                        style={{ color: 'var(--text-primary)' }}>
                        Write <span className="gradient-text">freely</span>.<br />
                        Organise <span className="gradient-text">gently</span>.<br />
                        Remember <span className="gradient-text">everything</span>.
                    </h1>

                    <p className="text-xl mb-10 max-w-2xl mx-auto animate-fade-in leading-relaxed"
                        style={{ color: 'var(--text-secondary)' }}>
                        {isAuthenticated
                            ? 'You have your own little creative corner here. Jump back in and keep creating.'
                            : 'Kacchi Likhavat is a quiet, personal space for your notes, stories, expenses, and memories — no clutter, no noise, just you.'}
                    </p>

                    <div className="flex flex-wrap gap-4 justify-center animate-slide-up">
                        {isAuthenticated ? (
                            <>
                                <Link to="/dashboard" className="btn-primary text-lg">
                                    <LayoutDashboard className="w-5 h-5" /> Go to My Dashboard
                                </Link>
                                <a href="#features" className="btn-secondary text-lg">Explore Features</a>
                            </>
                        ) : (
                            <>
                                <Link to="/signup" className="btn-primary text-lg">
                                    Start Writing <ArrowRight className="w-5 h-5" />
                                </Link>
                                <Link to="/login" className="btn-secondary text-lg">Already have an account</Link>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* ── Features ─────────────────────────────────── */}
            <section id="features" className="py-20 px-6 md:px-12" style={{ background: 'var(--bg-surface)', backdropFilter: 'blur(4px)' }}>
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 mb-4">
                            <PenLine className="w-5 h-5" style={{ color: 'var(--text-link)' }} />
                            <span className="text-sm font-semibold uppercase tracking-widest" style={{ color: 'var(--text-link)' }}>What you get</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-display font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                            Everything in <span className="gradient-text">one warm place</span>
                        </h2>
                        <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                            Designed to feel personal, not corporate. Simple tools for people who love to create.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div key={index} className="feature-card group" style={{ animationDelay: `${index * 0.1}s` }}>
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform shadow-lg`}>
                                        <Icon className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="text-xl font-display font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>{feature.title}</h3>
                                    <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{feature.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── Roadmap ──────────────────────────────────── */}
            <section id="roadmap" className="py-20 px-6 md:px-12">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 mb-4">
                            <Sparkles className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                            <span className="text-sm font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Where we're headed</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-display font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                            Our <span className="gradient-text">Roadmap</span>
                        </h2>
                        <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                            We're building this thoughtfully, one version at a time — no rush, just care.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {roadmap.map((phase, index) => (
                            <div key={index} className="card card-hover">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-3xl font-display font-bold gradient-text">{phase.version}</span>
                                    <span className="px-3 py-1 rounded-full text-sm font-medium"
                                        style={{
                                            background: phase.status === 'In Progress' ? 'rgba(52,211,153,0.15)'
                                                : phase.status === 'Planned' ? 'rgba(96,165,250,0.15)'
                                                : 'var(--accent-glow)',
                                            color: phase.status === 'In Progress' ? '#34d399'
                                                : phase.status === 'Planned' ? '#60a5fa'
                                                : 'var(--text-muted)',
                                            border: `1px solid ${phase.status === 'In Progress' ? 'rgba(52,211,153,0.30)'
                                                : phase.status === 'Planned' ? 'rgba(96,165,250,0.30)'
                                                : 'var(--border-default)'}`
                                        }}>
                                        {phase.status}
                                    </span>
                                </div>
                                <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>{phase.title}</h3>
                                <ul className="space-y-2">
                                    {phase.items.map((item, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--text-muted)' }} />
                                            <span style={{ color: 'var(--text-secondary)' }}>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Footer ───────────────────────────────────── */}
            <footer className="py-8 px-8" style={{ background: 'var(--bg-navbar)', borderTop: '1px solid var(--border-default)' }}>
                <div className="max-w-6xl mx-auto text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <BookOpenCheck className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                        <span className="font-display font-semibold gradient-text text-sm">Kacchi Likhavat</span>
                    </div>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                        © 2026 Kacchi Likhavat. Made with ❤️ for every kind of creator.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
