import React, { useState, useEffect } from 'react';
import { Plus, Heart, Smile, Meh, Frown, Calendar, X, Angry, Zap, Wind } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { memoriesAPI, roomAPI, type Memory } from '../utils/api';

const MemoryPage: React.FC = () => {
    const [memories, setMemories] = useState<Memory[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [moodFilter, setMoodFilter] = useState<Memory['mood'] | 'all'>('all');

    // Form state
    const [newMemory, setNewMemory] = useState({
        text: '',
        mood: 'happy' as Memory['mood'],
        date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        fetchMemories();
    }, [moodFilter]);

    const fetchMemories = async () => {
        try {
            const params = moodFilter !== 'all' ? { mood: moodFilter } : undefined;
            const response = await memoriesAPI.getAll(params);
            if (response.success) {
                setMemories(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch memories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddMemory = async () => {
        if (!newMemory.text.trim()) {
            alert('Please enter your memory');
            return;
        }

        try {
            // First create a room for the memory
            const roomResponse = await roomAPI.create('journal', 'Memory Entry');
            if (roomResponse.success) {
                const response = await memoriesAPI.create({
                    roomId: roomResponse.data._id,
                    text: newMemory.text,
                    mood: newMemory.mood,
                    date: newMemory.date
                });

                if (response.success) {
                    setMemories([response.data, ...memories]);
                    setShowAddModal(false);
                    setNewMemory({
                        text: '',
                        mood: 'happy',
                        date: new Date().toISOString().split('T')[0]
                    });
                }
            }
        } catch (error) {
            console.error('Failed to add memory:', error);
            alert('Failed to add memory');
        }
    };

    const handleDeleteMemory = async (id: string) => {
        if (!confirm('Are you sure you want to delete this memory?')) return;

        try {
            await memoriesAPI.delete(id);
            setMemories(memories.filter(m => m._id !== id));
        } catch (error) {
            console.error('Failed to delete memory:', error);
        }
    };

    const getMoodIcon = (mood: Memory['mood']) => {
        switch (mood) {
            case 'happy':
                return <Smile className="w-6 h-6" />;
            case 'calm':
                return <Wind className="w-6 h-6" />;
            case 'sad':
                return <Frown className="w-6 h-6" />;
            case 'excited':
                return <Zap className="w-6 h-6" />;
            case 'anxious':
                return <Meh className="w-6 h-6" />;
            case 'angry':
                return <Angry className="w-6 h-6" />;
            case 'neutral':
                return <Meh className="w-6 h-6" />;
        }
    };

    const getMoodColor = (mood: Memory['mood']) => {
        switch (mood) {
            case 'happy':
                return 'from-yellow-400 to-orange-400';
            case 'calm':
                return 'from-blue-400 to-cyan-400';
            case 'sad':
                return 'from-gray-400 to-slate-400';
            case 'excited':
                return 'from-pink-400 to-red-400';
            case 'anxious':
                return 'from-purple-400 to-indigo-400';
            case 'angry':
                return 'from-red-500 to-orange-500';
            case 'neutral':
                return 'from-gray-300 to-gray-400';
        }
    };

    const getMoodBg = (mood: Memory['mood']) => {
        switch (mood) {
            case 'happy':
                return 'bg-yellow-50 border-yellow-200';
            case 'calm':
                return 'bg-blue-50 border-blue-200';
            case 'sad':
                return 'bg-gray-50 border-gray-200';
            case 'excited':
                return 'bg-pink-50 border-pink-200';
            case 'anxious':
                return 'bg-purple-50 border-purple-200';
            case 'angry':
                return 'bg-red-50 border-red-200';
            case 'neutral':
                return 'bg-gray-50 border-gray-200';
        }
    };

    // Calculate mood stats
    const moodCounts = memories.reduce((acc, memory) => {
        acc[memory.mood] = (acc[memory.mood] || 0) + 1;
        return acc;
    }, {} as Record<Memory['mood'], number>);

    const moods: Memory['mood'][] = ['happy', 'sad', 'excited', 'anxious', 'calm', 'angry', 'neutral'];

    return (
        <div className="flex min-h-screen">
            <Sidebar />

            <main className="flex-1 ml-64 p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-display font-bold mb-2">Memory Journal</h1>
                        <p className="text-gray-600">Preserve your precious moments and feelings</p>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Add Memory
                    </button>
                </div>

                {/* Mood Filter */}
                <div className="card mb-8">
                    <div className="flex items-center gap-3 flex-wrap">
                        <button
                            onClick={() => setMoodFilter('all')}
                            className={`btn ${moodFilter === 'all' ? 'btn-primary' : 'btn-ghost'}`}
                        >
                            All
                        </button>
                        {moods.map((mood) => (
                            <button
                                key={mood}
                                onClick={() => setMoodFilter(mood)}
                                className={`btn ${moodFilter === mood ? 'btn-primary' : 'btn-ghost'} flex items-center gap-2`}
                            >
                                {getMoodIcon(mood)}
                                <span className="capitalize">{mood}</span>
                                {moodCounts[mood] && <span className="text-xs">({moodCounts[mood]})</span>}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Stats */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    <div className="card bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-100">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center">
                                <Smile className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{moodCounts.happy || 0}</p>
                                <p className="text-sm text-gray-600">Happy</p>
                            </div>
                        </div>
                    </div>

                    <div className="card bg-gradient-to-br from-pink-50 to-red-50 border-2 border-pink-100">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-400 to-red-400 flex items-center justify-center">
                                <Zap className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{moodCounts.excited || 0}</p>
                                <p className="text-sm text-gray-600">Excited</p>
                            </div>
                        </div>
                    </div>

                    <div className="card bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-100">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center">
                                <Wind className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{moodCounts.calm || 0}</p>
                                <p className="text-sm text-gray-600">Calm</p>
                            </div>
                        </div>
                    </div>

                    <div className="card bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-100">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-indigo-400 flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{memories.length}</p>
                                <p className="text-sm text-gray-600">Total</p>
                            </div>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-16">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                        <p className="text-gray-600 mt-4">Loading memories...</p>
                    </div>
                ) : (
                    /* Timeline */
                    <div className="max-w-4xl mx-auto">
                        {memories.length > 0 ? (
                            <div className="relative">
                                {/* Timeline line */}
                                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-200 via-accent-200 to-transparent"></div>

                                {/* Memory entries */}
                                <div className="space-y-8">
                                    {memories.map((memory, index) => (
                                        <div key={memory._id} className="relative pl-20 group" style={{ animationDelay: `${index * 0.1}s` }}>
                                            {/* Mood indicator on timeline */}
                                            <div className={`absolute left-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${getMoodColor(memory.mood)} flex items-center justify-center text-white shadow-lg`}>
                                                {getMoodIcon(memory.mood)}
                                            </div>

                                            {/* Memory card */}
                                            <div className={`card ${getMoodBg(memory.mood)} border-2 relative`}>
                                                <button
                                                    onClick={() => handleDeleteMemory(memory._id)}
                                                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:bg-red-100 p-2 rounded-lg"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>

                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex-1">
                                                        <p className="text-sm text-gray-500 flex items-center gap-1 mb-2">
                                                            <Calendar className="w-4 h-4" />
                                                            {new Date(memory.date).toLocaleDateString('en-US', {
                                                                weekday: 'long',
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>

                                                <p className="text-gray-700 leading-relaxed mb-4 whitespace-pre-wrap">
                                                    {memory.text}
                                                </p>

                                                {/* Mood badge */}
                                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 backdrop-blur-sm">
                                                    {getMoodIcon(memory.mood)}
                                                    <span className="text-sm font-medium capitalize">{memory.mood}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* End of timeline */}
                                <div className="text-center mt-12 mb-8">
                                    <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium shadow-lg">
                                        <Calendar className="w-5 h-5" />
                                        Your journey continues...
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <Heart className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-2xl font-semibold text-gray-900 mb-2">No memories yet</h3>
                                <p className="text-gray-600 mb-6">Start capturing your precious moments</p>
                                <button
                                    onClick={() => setShowAddModal(true)}
                                    className="btn-primary"
                                >
                                    <Plus className="w-5 h-5 inline-block mr-2" />
                                    Add Your First Memory
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Add Memory Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold">Add Memory</h2>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Memory</label>
                                    <textarea
                                        value={newMemory.text}
                                        onChange={(e) => setNewMemory({ ...newMemory, text: e.target.value })}
                                        className="input w-full"
                                        rows={8}
                                        placeholder="Write about your day, thoughts, or anything you want to remember..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Mood</label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {moods.map((mood) => (
                                            <button
                                                key={mood}
                                                onClick={() => setNewMemory({ ...newMemory, mood })}
                                                className={`p-3 rounded-xl border-2 transition-all ${newMemory.mood === mood
                                                    ? 'border-primary-500 bg-primary-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <div className="flex flex-col items-center gap-1">
                                                    {getMoodIcon(mood)}
                                                    <span className="text-xs capitalize">{mood}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                                    <input
                                        type="date"
                                        value={newMemory.date}
                                        onChange={(e) => setNewMemory({ ...newMemory, date: e.target.value })}
                                        className="input w-full"
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={() => setShowAddModal(false)}
                                        className="btn-ghost flex-1"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleAddMemory}
                                        className="btn-primary flex-1"
                                    >
                                        Save Memory
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

export default MemoryPage;
