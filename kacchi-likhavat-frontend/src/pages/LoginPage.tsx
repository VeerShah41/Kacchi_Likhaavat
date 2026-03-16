import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
    const [email, setEmail]       = useState('');
    const [password, setPassword] = useState('');
    const [error, setError]       = useState('');
    const [loading, setLoading]   = useState(false);

    const { login, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => { if (user) navigate('/dashboard', { replace: true }); }, [user, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); setError(''); setLoading(true);
        try { await login(email, password); navigate('/dashboard'); }
        catch (err: any) { setError(err.message || 'Invalid email or password'); }
        finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
            <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, var(--orb-a) 0%, transparent 70%)' }} />
            <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, var(--orb-b) 0%, transparent 70%)' }} />

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
                        <BookOpen className="w-10 h-10 transition-transform group-hover:scale-110"
                            style={{ color: 'var(--text-link)' }} />
                        <span className="text-3xl font-display font-bold gradient-text">Kacchi Likhavat</span>
                    </Link>
                    <h1 className="text-2xl font-display font-semibold" style={{ color: 'var(--text-primary)' }}>
                        Welcome back
                    </h1>
                    <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>
                        Pick up right where you left off ✍️
                    </p>
                </div>

                {/* Card */}
                <div className="glass rounded-3xl p-8 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="px-4 py-3 rounded-xl text-sm font-medium"
                                style={{ background: 'var(--error-bg)', border: '1px solid var(--error-border)', color: 'var(--error-text)' }}>
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                                    className="input pl-12" placeholder="you@example.com" required />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                                    className="input pl-12" placeholder="••••••••" required />
                            </div>
                        </div>

                        <button type="submit" disabled={loading}
                            className="btn-primary w-full text-lg justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                            {loading ? 'Logging in…' : 'Login'}
                        </button>

                        <p className="text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
                            New here?{' '}
                            <Link to="/signup" className="font-semibold hover:underline" style={{ color: 'var(--text-link)' }}>
                                Create an account
                            </Link>
                        </p>
                    </form>
                </div>

                <div className="text-center mt-6">
                    <Link to="/" className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
