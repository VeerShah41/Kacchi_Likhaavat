import React, { useState, useEffect } from 'react';
import { Plus, Search, Clock, Edit, Trash2, Tag, Pin } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { notesAPI, roomAPI, type Note } from '../utils/api';

const NotesPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState<'all' | 'pinned' | 'archived'>('all');
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');
    const [editTags, setEditTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const response = await notesAPI.getAll();
            if (response.success) {
                setNotes(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch notes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNote = async () => {
        try {
            // First create a room for the note
            const roomResponse = await roomAPI.create('note', 'Untitled Note');
            if (roomResponse.success) {
                // Then create the note
                const noteResponse = await notesAPI.create({
                    roomId: roomResponse.data._id,
                    title: 'Untitled Note',
                    content: '',
                    tags: []
                });

                if (noteResponse.success) {
                    setNotes([noteResponse.data, ...notes]);
                    setSelectedNote(noteResponse.data);
                    setEditTitle(noteResponse.data.title);
                    setEditContent(noteResponse.data.content);
                    setEditTags(noteResponse.data.tags);
                    setIsEditing(true);
                }
            }
        } catch (error) {
            console.error('Failed to create note:', error);
        }
    };

    const handleUpdateNote = async () => {
        if (!selectedNote) return;

        try {
            const response = await notesAPI.update(selectedNote._id, {
                title: editTitle,
                content: editContent,
                tags: editTags
            });

            if (response.success) {
                // Update local state
                setNotes(notes.map(n => n._id === selectedNote._id ? response.data : n));
                setSelectedNote(response.data);
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Failed to update note:', error);
        }
    };

    const handleDeleteNote = async (id: string) => {
        if (!confirm('Are you sure you want to delete this note?')) return;

        try {
            await notesAPI.delete(id);
            setNotes(notes.filter(n => n._id !== id));
            if (selectedNote?._id === id) {
                setSelectedNote(null);
            }
        } catch (error) {
            console.error('Failed to delete note:', error);
        }
    };

    const handleTogglePin = async (note: Note) => {
        try {
            const response = await notesAPI.update(note._id, {
                isPinned: !note.isPinned
            });
            if (response.success) {
                setNotes(notes.map(n => n._id === note._id ? response.data : n));
                if (selectedNote?._id === note._id) {
                    setSelectedNote(response.data);
                }
            }
        } catch (error) {
            console.error('Failed to toggle pin:', error);
        }
    };

    const handleToggleArchive = async (note: Note) => {
        try {
            const response = await notesAPI.update(note._id, {
                isArchived: !note.isArchived
            });
            if (response.success) {
                setNotes(notes.map(n => n._id === note._id ? response.data : n));
                if (selectedNote?._id === note._id) {
                    setSelectedNote(response.data);
                }
            }
        } catch (error) {
            console.error('Failed to toggle archive:', error);
        }
    };

    const handleSelectNote = (note: Note) => {
        setSelectedNote(note);
        setEditTitle(note.title);
        setEditContent(note.content);
        setEditTags(note.tags);
        setIsEditing(false);
    };

    const handleAddTag = () => {
        if (tagInput.trim() && !editTags.includes(tagInput.trim())) {
            setEditTags([...editTags, tagInput.trim()]);
            setTagInput('');
        }
    };

    const handleRemoveTag = (tag: string) => {
        setEditTags(editTags.filter(t => t !== tag));
    };


    const filteredNotes = notes.filter(note => {
        const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.content.toLowerCase().includes(searchQuery.toLowerCase());

        // Apply filter
        if (filter === 'pinned') return matchesSearch && note.isPinned;
        if (filter === 'archived') return matchesSearch && note.isArchived;
        return matchesSearch && !note.isArchived; // Default: show all non-archived
    });

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar />

            <main className="flex-1 ml-64 p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-display font-bold mb-2">Notes</h1>
                        <p className="text-gray-600">Capture your thoughts and ideas</p>
                    </div>
                    <button
                        onClick={handleCreateNote}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Create Note
                    </button>
                </div>

                {/* Search and Filter */}
                <div className="card mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search Bar */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="input pl-12"
                                placeholder="Search notes..."
                            />
                        </div>

                        {/* Filters */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilter('all')}
                                className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-ghost'}`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setFilter('pinned')}
                                className={`btn ${filter === 'pinned' ? 'btn-primary' : 'btn-ghost'} flex items-center gap-2`}
                            >
                                <Pin className="w-4 h-4" />
                                Pinned
                            </button>
                            <button
                                onClick={() => setFilter('archived')}
                                className={`btn ${filter === 'archived' ? 'btn-primary' : 'btn-ghost'} flex items-center gap-2`}
                            >
                                <Clock className="w-4 h-4" />
                                Archived
                            </button>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-16">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                        <p className="text-gray-600 mt-4">Loading your notes...</p>
                    </div>
                ) : selectedNote ? (
                    /* Note Editor View */
                    <div className="card">
                        <div className="flex items-center justify-between mb-6">
                            <button
                                onClick={() => setSelectedNote(null)}
                                className="text-gray-600 hover:text-gray-900"
                            >
                                ← Back to Notes
                            </button>
                            <div className="flex gap-2">
                                {isEditing ? (
                                    <>
                                        <button
                                            onClick={() => {
                                                setEditTitle(selectedNote.title);
                                                setEditContent(selectedNote.content);
                                                setEditTags(selectedNote.tags);
                                                setIsEditing(false);
                                            }}
                                            className="btn-ghost"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleUpdateNote}
                                            className="btn-primary"
                                        >
                                            Save
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => handleTogglePin(selectedNote)}
                                            className={`btn-ghost ${selectedNote.isPinned ? 'text-primary-600' : ''}`}
                                            title={selectedNote.isPinned ? 'Unpin' : 'Pin'}
                                        >
                                            <Pin className={`w-4 h-4 ${selectedNote.isPinned ? 'fill-current' : ''}`} />
                                        </button>
                                        <button
                                            onClick={() => handleToggleArchive(selectedNote)}
                                            className="btn-ghost"
                                            title={selectedNote.isArchived ? 'Unarchive' : 'Archive'}
                                        >
                                            {selectedNote.isArchived ? 'Unarchive' : 'Archive'}
                                        </button>
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="btn-secondary flex items-center gap-2"
                                        >
                                            <Edit className="w-4 h-4" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteNote(selectedNote._id)}
                                            className="btn-ghost text-red-600 hover:bg-red-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {isEditing ? (
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    className="input text-2xl font-bold"
                                    placeholder="Note title..."
                                />
                                <textarea
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    className="input min-h-[400px] font-serif"
                                    placeholder="Start writing..."
                                />

                                {/* Tags Input */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                                    <div className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                                            className="input flex-1"
                                            placeholder="Add a tag..."
                                        />
                                        <button
                                            onClick={handleAddTag}
                                            className="btn-secondary"
                                            type="button"
                                        >
                                            <Tag className="w-4 h-4" />
                                        </button>
                                    </div>
                                    {editTags.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {editTags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                                                >
                                                    {tag}
                                                    <button
                                                        onClick={() => handleRemoveTag(tag)}
                                                        className="hover:text-primary-900"
                                                        type="button"
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div>
                                <h2 className="text-3xl font-bold mb-4">{selectedNote.title || 'Untitled'}</h2>
                                <p className="text-sm text-gray-500 mb-4">
                                    Last updated: {formatDate(selectedNote.updatedAt)}
                                </p>

                                {/* Tags Display */}
                                {selectedNote.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {selectedNote.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div className="prose max-w-none">
                                    <p className="whitespace-pre-wrap font-serif text-lg">
                                        {selectedNote.content || 'No content yet...'}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        {/* Notes Grid */}
                        {filteredNotes.length > 0 ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredNotes.map((note) => (
                                    <div
                                        key={note._id}
                                        onClick={() => handleSelectNote(note)}
                                        className="note-card group cursor-pointer"
                                    >
                                        <div className="relative z-10">
                                            {/* Header */}
                                            <div className="flex items-start justify-between mb-4">
                                                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                                                    {note.title || 'Untitled Note'}
                                                </h3>
                                            </div>

                                            {/* Content Preview */}
                                            <p className="text-gray-600 mb-4 line-clamp-3">
                                                {note.content || 'No content yet...'}
                                            </p>

                                            {/* Footer */}
                                            <div className="flex items-center justify-between text-sm text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    <span>{formatDate(note.updatedAt)}</span>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteNote(note._id);
                                                    }}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-50 rounded-lg"
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-600" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            /* Empty State */
                            <div className="text-center py-16">
                                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search className="w-12 h-12 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">No notes found</h3>
                                <p className="text-gray-600 mb-6">
                                    {searchQuery ? 'Try a different search term' : 'Create your first note to get started'}
                                </p>
                                {!searchQuery && (
                                    <button
                                        onClick={handleCreateNote}
                                        className="btn-primary"
                                    >
                                        <Plus className="w-5 h-5 inline-block mr-2" />
                                        Create Note
                                    </button>
                                )}
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

export default NotesPage;
