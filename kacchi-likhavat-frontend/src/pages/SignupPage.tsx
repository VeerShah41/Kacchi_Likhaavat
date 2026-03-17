import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SignupPage: React.FC = () => {
    const [email, setEmail]                   = useState('');
    const [password, setPassword]             = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError]                   = useState('');
    const [loading, setLoading]               = useState(false);

    const { signup, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => { if (user) navigate('/dashboard', { replace: true }); }, [user, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); setError('');
        if (password !== confirmPassword) { setError('Passwords do not match'); return; }
        if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
        setLoading(true);
        try { await signup(email, password); navigate('/dashboard'); }
        catch (err: any) { setError(err.message || 'Failed to create account. Please try again.'); }
        finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
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
                        Create your space
                    </h1>
                    <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>
                        Your creative journey starts here 🌱
                    </p>
                </div>

                {/* Card */}
                <div className="glass rounded-3xl p-8 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="px-4 py-3 rounded-xl text-sm font-medium"
                                style={{ background: 'var(--error-bg)', border: '1px solid var(--error-border)', color: 'var(--error-text)' }}>
                                {error}
                            </div>
                        )}

                        {[
                            { label: 'Email Address', type: 'email', value: email, set: setEmail, placeholder: 'you@example.com', Icon: Mail },
                            { label: 'Password', type: 'password', value: password, set: setPassword, placeholder: '••••••••', Icon: Lock },
                            { label: 'Confirm Password', type: 'password', value: confirmPassword, set: setConfirmPassword, placeholder: '••••••••', Icon: Lock },
                        ].map(({ label, type, value, set, placeholder, Icon }) => (
                            <div key={label}>
                                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>{label}</label>
                                <div className="relative">
                                    <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                                    <input type={type} value={value} onChange={e => set(e.target.value)}
                                        className="input pl-12" placeholder={placeholder}
                                        required minLength={type === 'password' ? 6 : undefined} />
                                </div>
                            </div>
                        ))}

                        <button type="submit" disabled={loading}
                            className="btn-primary w-full text-lg justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                            {loading ? 'Creating Account…' : 'Sign Up'}
                        </button>

                        <p className="text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
                            Already have an account?{' '}
                            <Link to="/login" className="font-semibold hover:underline" style={{ color: 'var(--text-link)' }}>
                                Login
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

export default SignupPage;
