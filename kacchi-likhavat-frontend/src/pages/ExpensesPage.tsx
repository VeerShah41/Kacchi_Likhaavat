import React, { useState, useEffect } from 'react';
import { Plus, Calendar, DollarSign, TrendingDown, TrendingUp, X } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import Sidebar from '../components/Sidebar';
import { expensesAPI, roomAPI, type Expense } from '../utils/api';

const ExpensesPage: React.FC = () => {
    const [filter, setFilter] = useState<'today' | 'week' | 'month' | 'custom'>('month');
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
    const [summary, setSummary] = useState<{ total: number; byCategory: Record<string, number>; count: number } | null>(null);

    // Form state
    const [newExpense, setNewExpense] = useState({
        title: '',
        amount: '',
        category: 'Food' as Expense['category'],
        description: '',
        date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        fetchExpenses();
        fetchSummary();
    }, [filter]);

    const fetchExpenses = async () => {
        try {
            const params = getDateParams();
            const response = await expensesAPI.getAll(params);
            if (response.success) {
                setExpenses(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch expenses:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSummary = async () => {
        try {
            const params = getDateParams();
            const response = await expensesAPI.getSummary(params);
            if (response.success) {
                setSummary(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch summary:', error);
        }
    };

    const getDateParams = () => {
        const now = new Date();
        let from: string | undefined;
        let to: string | undefined;

        switch (filter) {
            case 'today':
                from = to = now.toISOString().split('T')[0];
                break;
            case 'week':
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                from = weekAgo.toISOString().split('T')[0];
                to = now.toISOString().split('T')[0];
                break;
            case 'month':
                const monthAgo = new Date(now.getFullYear(), now.getMonth(), 1);
                from = monthAgo.toISOString().split('T')[0];
                to = now.toISOString().split('T')[0];
                break;
        }

        return from && to ? { from, to } : undefined;
    };

    const handleAddExpense = async () => {
        if (!newExpense.title || !newExpense.amount) {
            alert('Please fill in title and amount');
            return;
        }

        try {
            // First create a room for the expense
            const roomResponse = await roomAPI.create('free', 'Expense Room');
            if (roomResponse.success) {
                const response = await expensesAPI.create({
                    roomId: roomResponse.data._id,
                    title: newExpense.title,
                    amount: parseFloat(newExpense.amount),
                    category: newExpense.category,
                    description: newExpense.description,
                    date: newExpense.date
                });

                if (response.success) {
                    setExpenses([response.data, ...expenses]);
                    setShowAddModal(false);
                    setNewExpense({
                        title: '',
                        amount: '',
                        category: 'Food',
                        description: '',
                        date: new Date().toISOString().split('T')[0]
                    });
                    fetchSummary();
                }
            }
        } catch (error) {
            console.error('Failed to add expense:', error);
            alert('Failed to add expense');
        }
    };

    const handleDeleteExpense = async (id: string) => {
        if (!confirm('Are you sure you want to delete this expense?')) return;

        try {
            await expensesAPI.delete(id);
            setExpenses(expenses.filter(e => e._id !== id));
            fetchSummary();
        } catch (error) {
            console.error('Failed to delete expense:', error);
        }
    };

    const handleEditExpense = (expense: Expense) => {
        setEditingExpense(expense);
        setNewExpense({
            title: expense.title,
            amount: expense.amount.toString(),
            category: expense.category,
            description: expense.description || '',
            date: new Date(expense.date).toISOString().split('T')[0]
        });
        setShowAddModal(true);
    };

    const handleUpdateExpense = async () => {
        if (!editingExpense || !newExpense.title || !newExpense.amount) {
            alert('Please fill in title and amount');
            return;
        }

        try {
            const response = await expensesAPI.update(editingExpense._id, {
                title: newExpense.title,
                amount: parseFloat(newExpense.amount),
                category: newExpense.category,
                description: newExpense.description,
                date: newExpense.date
            });

            if (response.success) {
                setExpenses(expenses.map(e => e._id === editingExpense._id ? response.data : e));
                setShowAddModal(false);
                setEditingExpense(null);
                setNewExpense({
                    title: '',
                    amount: '',
                    category: 'Food',
                    description: '',
                    date: new Date().toISOString().split('T')[0]
                });
                fetchSummary();
            }
        } catch (error) {
            console.error('Failed to update expense:', error);
            alert('Failed to update expense');
        }
    };

    const handleCloseModal = () => {
        setShowAddModal(false);
        setEditingExpense(null);
        setNewExpense({
            title: '',
            amount: '',
            category: 'Food',
            description: '',
            date: new Date().toISOString().split('T')[0]
        });
    };

    // Calculate category data for pie chart
    const categoryData = Object.entries(summary?.byCategory || {}).map(([name, value]) => ({
        name,
        value
    }));

    const COLORS = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#f97316'];

    const totalExpenses = summary?.total || 0;
    const avgExpense = expenses.length > 0 ? totalExpenses / expenses.length : 0;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const categories: Expense['category'][] = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Education', 'Other'];

    return (
        <div className="flex min-h-screen">
            <Sidebar />

            <main className="flex-1 ml-64 p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-display font-bold mb-2">Expenses</h1>
                        <p className="text-gray-600">Track and manage your spending</p>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Add Expense
                    </button>
                </div>

                {/* Filters */}
                <div className="card mb-8">
                    <div className="flex items-center gap-4">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <div className="flex gap-2">
                            {(['today', 'week', 'month', 'custom'] as const).map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`btn ${filter === f ? 'btn-primary' : 'btn-ghost'}`}
                                >
                                    {f.charAt(0).toUpperCase() + f.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-16">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                        <p className="text-gray-600 mt-4">Loading expenses...</p>
                    </div>
                ) : (
                    <>
                        {/* Summary Cards */}
                        <div className="grid md:grid-cols-3 gap-6 mb-8">
                            <div className="stat-card bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-100">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <DollarSign className="w-5 h-5 text-blue-600" />
                                        <p className="text-sm text-gray-600">Total Expenses</p>
                                    </div>
                                    <p className="text-3xl font-bold text-gray-900">₹{totalExpenses.toLocaleString()}</p>
                                    <div className="flex items-center gap-1 mt-2 text-sm text-blue-600">
                                        <TrendingDown className="w-4 h-4" />
                                        <span>{filter.charAt(0).toUpperCase() + filter.slice(1)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="stat-card bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-100">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <TrendingUp className="w-5 h-5 text-green-600" />
                                        <p className="text-sm text-gray-600">Average Expense</p>
                                    </div>
                                    <p className="text-3xl font-bold text-gray-900">₹{Math.round(avgExpense).toLocaleString()}</p>
                                    <p className="text-sm text-gray-600 mt-2">Per transaction</p>
                                </div>
                            </div>

                            <div className="stat-card bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-100">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Calendar className="w-5 h-5 text-purple-600" />
                                        <p className="text-sm text-gray-600">Transactions</p>
                                    </div>
                                    <p className="text-3xl font-bold text-gray-900">{expenses.length}</p>
                                    <p className="text-sm text-gray-600 mt-2">This period</p>
                                </div>
                            </div>
                        </div>

                        {/* Charts */}
                        {categoryData.length > 0 && (
                            <div className="grid lg:grid-cols-1 gap-8 mb-8">
                                {/* Category Pie Chart */}
                                <div className="card">
                                    <h2 className="text-xl font-display font-semibold mb-6">Category Breakdown</h2>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={categoryData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ name, percent }: { name?: string; percent?: number }) => `${name || ''} ${((percent || 0) * 100).toFixed(0)}%`}
                                                outerRadius={100}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {categoryData.map((_, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, 'Amount']}
                                                contentStyle={{ borderRadius: '12px', border: '2px solid #e5e7eb' }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        )}

                        {/* Transactions List */}
                        <div className="card">
                            <h2 className="text-xl font-display font-semibold mb-6">Recent Transactions</h2>
                            {expenses.length > 0 ? (
                                <div className="space-y-3">
                                    {expenses.map((expense) => (
                                        <div
                                            key={expense._id}
                                            className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${expense.category === 'Food' ? 'bg-blue-100' :
                                                    expense.category === 'Transport' ? 'bg-green-100' :
                                                        expense.category === 'Entertainment' ? 'bg-purple-100' :
                                                            expense.category === 'Bills' ? 'bg-orange-100' :
                                                                expense.category === 'Shopping' ? 'bg-pink-100' :
                                                                    expense.category === 'Health' ? 'bg-red-100' :
                                                                        expense.category === 'Education' ? 'bg-cyan-100' :
                                                                            'bg-gray-100'
                                                    }`}>
                                                    <DollarSign className="w-6 h-6 text-gray-700" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">{expense.title}</h3>
                                                    <p className="text-sm text-gray-500">{expense.category} • {formatDate(expense.date)}</p>
                                                    {expense.description && (
                                                        <p className="text-sm text-gray-400 mt-1">{expense.description}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <p className="text-xl font-bold text-gray-900">₹{expense.amount.toLocaleString()}</p>
                                                <button
                                                    onClick={() => handleEditExpense(expense)}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 hover:bg-blue-50 p-2 rounded-lg"
                                                    title="Edit expense"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteExpense(expense._id)}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:bg-red-50 p-2 rounded-lg"
                                                    title="Delete expense"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <DollarSign className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                                    <p>No expenses found for this period</p>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* Add Expense Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold">{editingExpense ? 'Edit Expense' : 'Add Expense'}</h2>
                                <button
                                    onClick={handleCloseModal}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                                    <input
                                        type="text"
                                        value={newExpense.title}
                                        onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                                        className="input w-full"
                                        placeholder="e.g., Grocery shopping"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹)</label>
                                    <input
                                        type="number"
                                        value={newExpense.amount}
                                        onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                                        className="input w-full"
                                        placeholder="0.00"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                    <select
                                        value={newExpense.category}
                                        onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value as Expense['category'] })}
                                        className="input w-full"
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                                    <input
                                        type="date"
                                        value={newExpense.date}
                                        onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                                        className="input w-full"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                                    <textarea
                                        value={newExpense.description}
                                        onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                                        className="input w-full"
                                        rows={3}
                                        placeholder="Additional notes..."
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={handleCloseModal}
                                        className="btn-ghost flex-1"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={editingExpense ? handleUpdateExpense : handleAddExpense}
                                        className="btn-primary flex-1"
                                    >
                                        {editingExpense ? 'Update Expense' : 'Add Expense'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ExpensesPage;
