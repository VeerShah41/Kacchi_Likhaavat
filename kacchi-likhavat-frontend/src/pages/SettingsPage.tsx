import React from 'react';
import { User, LogOut, Info } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SettingsPage: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar />

            <main className="flex-1 ml-64 p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-display font-bold mb-2">Settings</h1>
                    <p className="text-gray-600">Manage your account information</p>
                </div>

                {/* Settings Sections */}
                <div className="max-w-4xl space-y-6">
                    {/* Profile Information */}
                    <div className="card">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                                <User className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-2xl font-display font-semibold">Profile Information</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={user?.email || ''}
                                    className="input bg-gray-50"
                                    disabled
                                />
                                <p className="text-sm text-gray-500 mt-1">Your registered email address</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">User ID</label>
                                <input
                                    type="text"
                                    value={user?.id || ''}
                                    className="input bg-gray-50 font-mono text-sm"
                                    disabled
                                />
                                <p className="text-sm text-gray-500 mt-1">Your unique user identifier</p>
                            </div>
                        </div>
                    </div>

                    {/* Account Actions */}
                    <div className="card">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
                                <LogOut className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-2xl font-display font-semibold">Account Actions</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 bg-red-50 border-2 border-red-100 rounded-xl">
                                <h3 className="font-semibold text-red-900 mb-2">Logout from Account</h3>
                                <p className="text-sm text-red-700 mb-4">
                                    You will be logged out from your current session. You can log back in anytime.
                                </p>
                                <button
                                    onClick={handleLogout}
                                    className="btn bg-red-600 hover:bg-red-700 text-white"
                                >
                                    <LogOut className="w-4 h-4 inline-block mr-2" />
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* App Information */}
                    <div className="card">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                                <Info className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-2xl font-display font-semibold">Application Info</h2>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="text-sm font-medium text-gray-700">Version</span>
                                <span className="text-sm text-gray-900 font-mono">1.0.0</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="text-sm font-medium text-gray-700">Application</span>
                                <span className="text-sm text-gray-900">Kacchi Likhavat</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="text-sm font-medium text-gray-700">Environment</span>
                                <span className="text-sm text-gray-900">Development</span>
                            </div>
                        </div>
                    </div>

                    {/* Feature Notice */}
                    <div className="card bg-gradient-to-br from-primary-50 to-accent-50 border-2 border-primary-100">
                        <div className="flex items-start gap-3">
                            <Info className="w-5 h-5 text-primary-600 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-primary-900 mb-1">Additional Features Coming Soon</h3>
                                <p className="text-sm text-primary-700">
                                    Features like password change, theme customization, and notification preferences
                                    will be available in future updates.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SettingsPage;
