import React, { useState, useEffect } from 'react';
import { Plus, BookOpenCheck, Edit, Trash2, Save, FileText } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { storiesAPI, chaptersAPI, roomAPI, type Story, type Chapter } from '../utils/api';

const StoriesPage: React.FC = () => {
    const [stories, setStories] = useState<Story[]>([]);
    const [selectedStory, setSelectedStory] = useState<Story | null>(null);
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');
    const [editDescription, setEditDescription] = useState('');

    useEffect(() => {
        fetchStories();
    }, []);

    const fetchStories = async () => {
        try {
            const response = await storiesAPI.getAll();
            if (response.success) {
                setStories(response.data);
                if (response.data.length > 0 && !selectedStory) {
                    handleSelectStory(response.data[0]);
                }
            }
        } catch (error) {
            console.error('Failed to fetch stories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectStory = async (story: Story) => {
        setSelectedStory(story);
        setSelectedChapter(null); // Clear selected chapter when changing story
        setIsEditing(false);

        // Initialize edit fields with current story data
        setEditTitle(story.title);
        setEditDescription(story.description);

        // Fetch chapters for this story
        try {
            const response = await storiesAPI.getById(story._id);
            if (response.success) {
                setChapters(response.data.chapters);
                if (response.data.chapters.length > 0) {
                    setSelectedChapter(response.data.chapters[0]);
                    setEditContent(response.data.chapters[0].content);
                } else {
                    setSelectedChapter(null);
                    setEditContent('');
                }
            }
        } catch (error) {
            console.error('Failed to fetch chapters:', error);
        }
    };

    const handleCreateStory = async () => {
        try {
            // First create a room for the story
            const roomResponse = await roomAPI.create('story', 'Untitled Story');
            if (roomResponse.success) {
                // Then create the story
                const storyResponse = await storiesAPI.create({
                    roomId: roomResponse.data._id,
                    title: 'Untitled Story',
                    description: '',
                    status: 'draft'
                });

                if (storyResponse.success) {
                    setStories([storyResponse.data, ...stories]);
                    handleSelectStory(storyResponse.data);
                    setIsEditing(true);
                }
            }
        } catch (error) {
            console.error('Failed to create story:', error);
        }
    };

    const handleUpdateStory = async () => {
        if (!selectedStory) return;

        try {
            const response = await storiesAPI.update(selectedStory._id, {
                title: editTitle,
                description: editDescription
            });

            if (response.success) {
                setStories(stories.map(s => s._id === selectedStory._id ? response.data : s));
                setSelectedStory(response.data);
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Failed to update story:', error);
        }
    };

    const handleDeleteStory = async (id: string) => {
        if (!confirm('Are you sure you want to delete this story and all its chapters?')) return;

        try {
            await storiesAPI.delete(id);
            setStories(stories.filter(s => s._id !== id));
            if (selectedStory?._id === id) {
                const remaining = stories.filter(s => s._id !== id);
                if (remaining[0]) {
                    handleSelectStory(remaining[0]);
                } else {
                    setSelectedStory(null);
                    setChapters([]);
                    setSelectedChapter(null);
                }
            }
        } catch (error) {
            console.error('Failed to delete story:', error);
        }
    };

    const handleCreateChapter = async () => {
        if (!selectedStory) return;

        try {
            const response = await chaptersAPI.create({
                storyId: selectedStory._id,
                title: `Chapter ${chapters.length + 1}`,
                content: ''
            });

            if (response.success) {
                setChapters([...chapters, response.data]);
                setSelectedChapter(response.data);
                setEditContent(response.data.content);
                setIsEditing(true);
            }
        } catch (error) {
            console.error('Failed to create chapter:', error);
        }
    };

    const handleUpdateChapter = async () => {
        if (!selectedChapter) return;

        try {
            const response = await chaptersAPI.update(selectedChapter._id, {
                content: editContent
            });

            if (response.success) {
                setChapters(chapters.map(c => c._id === selectedChapter._id ? response.data : c));
                setSelectedChapter(response.data);
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Failed to update chapter:', error);
        }
    };

    const handleDeleteChapter = async (id: string) => {
        if (!confirm('Are you sure you want to delete this chapter?')) return;

        try {
            await chaptersAPI.delete(id);
            setChapters(chapters.filter(c => c._id !== id));
            if (selectedChapter?._id === id) {
                const remaining = chapters.filter(c => c._id !== id);
                setSelectedChapter(remaining[0] || null);
                setEditContent(remaining[0]?.content || '');
            }
        } catch (error) {
            console.error('Failed to delete chapter:', error);
        }
    };

    const handleSelectChapter = (chapter: Chapter) => {
        setSelectedChapter(chapter);
        setEditContent(chapter.content);
        setIsEditing(false);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const getWordCount = (text: string) => {
        return text.trim().split(/\s+/).filter(word => word.length > 0).length;
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar />

            <main className="flex-1 ml-64 p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-display font-bold mb-2 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">Stories</h1>
                        <p className="text-gray-600 text-lg">Write and organize your creative works</p>
                    </div>
                    <button
                        onClick={handleCreateStory}
                        className="btn-primary flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                        <Plus className="w-5 h-5" />
                        New Story
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-16">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                        <p className="text-gray-600 mt-4">Loading your stories...</p>
                    </div>
                ) : stories.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6">
                            <BookOpenCheck className="w-16 h-16 text-primary-500" />
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-2">No stories yet</h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">Start your creative journey by creating your first story</p>
                        <button
                            onClick={handleCreateStory}
                            className="btn-primary shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                        >
                            <Plus className="w-5 h-5 inline-block mr-2" />
                            Create Your First Story
                        </button>
                    </div>
                ) : (
                    /* Stories Layout */
                    <div className="grid lg:grid-cols-12 gap-6">
                        {/* Stories List */}
                        <div className="lg:col-span-3">
                            <div className="card sticky top-8 shadow-lg">
                                <h2 className="font-display font-semibold text-lg mb-4 text-gray-800">Your Stories</h2>
                                <div className="space-y-2">
                                    {stories.map((story) => (
                                        <div key={story._id} className="relative group">
                                            <div className="flex items-stretch gap-2">
                                                <button
                                                    onClick={() => handleSelectStory(story)}
                                                    className={`flex-1 text-left p-3 rounded-xl transition-all duration-300 ${selectedStory?._id === story._id
                                                        ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-200'
                                                        : 'hover:bg-gray-100 text-gray-700 hover:shadow-md hover:scale-[1.02]'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <BookOpenCheck className="w-5 h-5 flex-shrink-0" />
                                                        <span className="font-medium truncate">{story.title || 'Untitled Story'}</span>
                                                    </div>
                                                    <p className="text-sm mt-1 opacity-80 capitalize">
                                                        {story.status}
                                                    </p>
                                                </button>
                                                {selectedStory?._id !== story._id && (
                                                    <button
                                                        onClick={() => handleDeleteStory(story._id)}
                                                        className="opacity-0 group-hover:opacity-100 transition-all duration-300 p-2 hover:bg-red-50 hover:scale-110 rounded-lg self-center"
                                                        title="Delete story"
                                                    >
                                                        <Trash2 className="w-4 h-4 text-red-600 hover:text-red-700" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Chapters List */}
                        <div className="lg:col-span-2">
                            <div className="card sticky top-8 shadow-lg">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="font-display font-semibold text-lg text-gray-800">Chapters</h2>
                                    <button
                                        onClick={handleCreateChapter}
                                        className="btn-ghost p-1 hover:bg-primary-50 hover:text-primary-600 transition-all duration-300"
                                        title="Add Chapter"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {chapters.map((chapter) => (
                                        <div key={chapter._id} className="relative group">
                                            <button
                                                onClick={() => handleSelectChapter(chapter)}
                                                className={`w-full text-left p-2 rounded-lg transition-all duration-300 ${selectedChapter?._id === chapter._id
                                                    ? 'bg-primary-100 text-primary-700 shadow-sm'
                                                    : 'hover:bg-gray-100 text-gray-700 hover:shadow-sm hover:scale-[1.02]'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <FileText className="w-4 h-4 flex-shrink-0" />
                                                    <span className="text-sm truncate">{chapter.title}</span>
                                                </div>
                                            </button>
                                            <button
                                                onClick={() => handleDeleteChapter(chapter._id)}
                                                className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 p-1 hover:bg-red-50 hover:scale-110 rounded"
                                            >
                                                <Trash2 className="w-3 h-3 text-red-600 hover:text-red-700" />
                                            </button>
                                        </div>
                                    ))}
                                    {chapters.length === 0 && (
                                        <p className="text-sm text-gray-500 text-center py-4">No chapters yet</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Editor */}
                        <div className="lg:col-span-7">
                            <div className="card shadow-xl">
                                {selectedStory ? (
                                    <>
                                        {/* Story Header */}
                                        <div className="mb-6 pb-4 border-b-2 border-gradient-to-r from-primary-100 to-accent-100">
                                            {isEditing && !selectedChapter ? (
                                                <div className="space-y-3">
                                                    <input
                                                        type="text"
                                                        value={editTitle}
                                                        onChange={(e) => setEditTitle(e.target.value)}
                                                        className="text-2xl font-display font-semibold text-gray-900 border-0 border-b-2 border-transparent focus:border-primary-500 focus:ring-0 w-full p-2 transition-all duration-300 bg-transparent"
                                                        placeholder="Story title..."
                                                    />
                                                    <input
                                                        type="text"
                                                        value={editDescription}
                                                        onChange={(e) => setEditDescription(e.target.value)}
                                                        className="text-gray-600 border-0 border-b-2 border-transparent focus:border-primary-500 focus:ring-0 w-full p-2 transition-all duration-300 bg-transparent"
                                                        placeholder="Story description..."
                                                    />
                                                </div>
                                            ) : (
                                                <>
                                                    <h2 className="text-2xl font-display font-semibold text-gray-900">
                                                        {selectedStory.title || 'Untitled Story'}
                                                    </h2>
                                                    <p className="text-gray-600 mt-1">{selectedStory.description}</p>
                                                </>
                                            )}
                                            <div className="flex items-center justify-between mt-3">
                                                <p className="text-sm text-gray-500">
                                                    Last updated {formatDate(selectedStory.updatedAt)}
                                                </p>
                                                <div className="flex gap-2">
                                                    {isEditing && !selectedChapter ? (
                                                        <>
                                                            <button
                                                                onClick={() => {
                                                                    setEditTitle(selectedStory.title);
                                                                    setEditDescription(selectedStory.description);
                                                                    setIsEditing(false);
                                                                }}
                                                                className="btn-ghost"
                                                            >
                                                                Cancel
                                                            </button>
                                                            <button
                                                                onClick={handleUpdateStory}
                                                                className="btn-primary flex items-center gap-2"
                                                            >
                                                                <Save className="w-4 h-4" />
                                                                Save
                                                            </button>
                                                        </>
                                                    ) : !selectedChapter && (
                                                        <button
                                                            onClick={() => setIsEditing(true)}
                                                            className="btn-secondary flex items-center gap-2"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                            Edit Info
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Chapter Content */}
                                        {selectedChapter ? (
                                            <>
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="text-xl font-semibold">{selectedChapter.title}</h3>
                                                    <div className="flex gap-2">
                                                        {isEditing ? (
                                                            <>
                                                                <button
                                                                    onClick={() => {
                                                                        setEditContent(selectedChapter.content);
                                                                        setIsEditing(false);
                                                                    }}
                                                                    className="btn-ghost"
                                                                >
                                                                    Cancel
                                                                </button>
                                                                <button
                                                                    onClick={handleUpdateChapter}
                                                                    className="btn-primary flex items-center gap-2"
                                                                >
                                                                    <Save className="w-4 h-4" />
                                                                    Save
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <button
                                                                onClick={() => setIsEditing(true)}
                                                                className="btn-secondary flex items-center gap-2"
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                                Edit
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                {isEditing ? (
                                                    <textarea
                                                        className="w-full h-[600px] p-4 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none resize-none font-serif text-lg leading-relaxed transition-all duration-300 hover:border-gray-300"
                                                        value={editContent}
                                                        onChange={(e) => setEditContent(e.target.value)}
                                                        placeholder="Start writing your chapter..."
                                                    />
                                                ) : (
                                                    <div className="prose prose-lg max-w-none">
                                                        <p className="font-serif text-lg leading-relaxed text-gray-800 whitespace-pre-wrap">
                                                            {selectedChapter.content || 'No content yet. Click Edit to start writing...'}
                                                        </p>
                                                    </div>
                                                )}

                                                <div className="mt-4 text-sm text-gray-500">
                                                    {getWordCount(selectedChapter.content)} words
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-center py-16">
                                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                                                    <FileText className="w-12 h-12 text-gray-400" />
                                                </div>
                                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                    No chapter selected
                                                </h3>
                                                <p className="text-gray-600 mb-4">
                                                    Create or select a chapter to start writing
                                                </p>
                                                <button
                                                    onClick={handleCreateChapter}
                                                    className="btn-primary shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                                                >
                                                    <Plus className="w-5 h-5 inline-block mr-2" />
                                                    Create First Chapter
                                                </button>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="text-center py-16">
                                        <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                                            <BookOpenCheck className="w-12 h-12 text-primary-500" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                            No story selected
                                        </h3>
                                        <p className="text-gray-600">
                                            Select a story from the list to start writing
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default StoriesPage;
