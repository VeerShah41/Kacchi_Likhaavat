import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if available
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle response errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid - clear auth data
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// =====================
// Type Definitions
// =====================

export interface Room {
    _id: string;
    userId: string;
    type: 'note' | 'journal' | 'story' | 'free';
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}

export interface Note {
    _id: string;
    userId: string;
    roomId: string;
    title: string;
    content: string;
    tags: string[];
    isPinned: boolean;
    isArchived: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Story {
    _id: string;
    userId: string;
    roomId: string;
    title: string;
    description: string;
    coverImage?: string;
    status: 'draft' | 'in-progress' | 'completed';
    createdAt: string;
    updatedAt: string;
}

export interface Chapter {
    _id: string;
    userId: string;
    storyId: string;
    title: string;
    content: string;
    order: number;
    createdAt: string;
    updatedAt: string;
}

export interface Expense {
    _id: string;
    userId: string;
    roomId: string;
    title: string;
    amount: number;
    category: 'Food' | 'Transport' | 'Shopping' | 'Bills' | 'Entertainment' | 'Health' | 'Education' | 'Other';
    date: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Memory {
    _id: string;
    userId: string;
    roomId: string;
    text: string;
    date: string;
    mood: 'happy' | 'sad' | 'excited' | 'anxious' | 'calm' | 'angry' | 'neutral';
    mediaUrls?: string[];
    createdAt: string;
    updatedAt: string;
}

export interface UserProfile {
    _id: string;
    userId: string;
    displayName: string;
    bio: string;
    avatar?: string;
    preferences: {
        theme: 'light' | 'dark' | 'auto';
        editorFont: string;
        editorFontSize: number;
        editorLineHeight: number;
    };
    stats: {
        totalRooms: number;
        totalNotes: number;
        totalStories: number;
        totalExpenses: number;
        totalMemories: number;
    };
    createdAt: string;
    updatedAt: string;
}

export interface DashboardData {
    stats: {
        roomsCount: number;
        notesCount: number;
        storiesCount: number;
        expensesCount: number;
        memoriesCount: number;
    };
    recentActivity: Array<{
        type: 'room' | 'note' | 'story' | 'expense' | 'memory';
        title: string;
        date: string;
        _id: string;
    }>;
    recentRooms: Room[];
    recentNotes: Note[];
    recentStories: Story[];
    recentExpenses: Expense[];
    recentMemories: Memory[];
}

// =====================
// Auth API
// =====================

export const authAPI = {
    register: async (email: string, password: string) => {
        const response = await api.post('/auth/register', { email, password });
        return response.data;
    },

    login: async (email: string, password: string) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },
};

// =====================
// User Profile API
// =====================

export const userProfileAPI = {
    get: async (userId: string) => {
        const response = await api.get<{ success: boolean; message: string; data: UserProfile }>(`/users/${userId}`);
        return response.data;
    },

    update: async (userId: string, data: Partial<UserProfile>) => {
        const response = await api.put<{ success: boolean; message: string; data: UserProfile }>(`/users/${userId}`, data);
        return response.data;
    },
};

// =====================
// Dashboard API
// =====================

export const dashboardAPI = {
    get: async () => {
        const response = await api.get<{ success: boolean; message: string; data: DashboardData }>('/dashboard');
        return response.data;
    },
};

// =====================
// Room API
// =====================

export const roomAPI = {
    create: async (type: Room['type'], title?: string) => {
        const response = await api.post<{ success: boolean; message: string; data: Room }>('/rooms', {
            type,
            title: title || ''
        });
        return response.data;
    },

    getAll: async () => {
        const response = await api.get<{ success: boolean; message: string; data: Room[]; count: number }>('/rooms');
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get<{ success: boolean; message: string; data: Room }>(`/rooms/${id}`);
        return response.data;
    },

    update: async (id: string, data: { title?: string; content?: string }) => {
        const response = await api.put<{ success: boolean; message: string; data: Room }>(`/rooms/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete<{ success: boolean; message: string }>(`/rooms/${id}`);
        return response.data;
    },

    getNotesByRoom: async (roomId: string) => {
        const response = await api.get<{ success: boolean; message: string; data: Note[]; count: number }>(`/rooms/${roomId}/notes`);
        return response.data;
    },
};

// =====================
// Notes API
// =====================

export const notesAPI = {
    create: async (data: { roomId: string; title: string; content?: string; tags?: string[] }) => {
        const response = await api.post<{ success: boolean; message: string; data: Note }>('/notes', data);
        return response.data;
    },

    getAll: async () => {
        const response = await api.get<{ success: boolean; message: string; data: Note[]; count: number }>('/notes');
        return response.data;
    },

    update: async (id: string, data: { title?: string; content?: string; tags?: string[]; isPinned?: boolean; isArchived?: boolean }) => {
        const response = await api.put<{ success: boolean; message: string; data: Note }>(`/notes/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete<{ success: boolean; message: string }>(`/notes/${id}`);
        return response.data;
    },
};

// =====================
// Stories API
// =====================

export const storiesAPI = {
    create: async (data: { roomId: string; title: string; description?: string; coverImage?: string; status?: Story['status'] }) => {
        const response = await api.post<{ success: boolean; message: string; data: Story }>('/stories', data);
        return response.data;
    },

    getAll: async () => {
        const response = await api.get<{ success: boolean; message: string; data: Story[]; count: number }>('/stories');
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get<{ success: boolean; message: string; data: { story: Story; chapters: Chapter[] } }>(`/stories/${id}`);
        return response.data;
    },

    update: async (id: string, data: { title?: string; description?: string; coverImage?: string; status?: Story['status'] }) => {
        const response = await api.put<{ success: boolean; message: string; data: Story }>(`/stories/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete<{ success: boolean; message: string }>(`/stories/${id}`);
        return response.data;
    },
};

// =====================
// Chapters API
// =====================

export const chaptersAPI = {
    create: async (data: { storyId: string; title: string; content?: string; order?: number }) => {
        const response = await api.post<{ success: boolean; message: string; data: Chapter }>('/stories/chapters', data);
        return response.data;
    },

    update: async (id: string, data: { title?: string; content?: string; order?: number }) => {
        const response = await api.put<{ success: boolean; message: string; data: Chapter }>(`/stories/chapters/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete<{ success: boolean; message: string }>(`/stories/chapters/${id}`);
        return response.data;
    },
};

// =====================
// Expenses API
// =====================

export const expensesAPI = {
    create: async (data: { roomId: string; title: string; amount: number; category: Expense['category']; date?: string; description?: string }) => {
        const response = await api.post<{ success: boolean; message: string; data: Expense }>('/expenses', data);
        return response.data;
    },

    getAll: async (params?: { from?: string; to?: string; category?: string }) => {
        const response = await api.get<{ success: boolean; message: string; data: Expense[]; count: number }>('/expenses', { params });
        return response.data;
    },

    getSummary: async (params?: { from?: string; to?: string }) => {
        const response = await api.get<{
            success: boolean;
            message: string;
            data: {
                total: number;
                byCategory: Record<string, number>;
                count: number
            }
        }>('/expenses/summary', { params });
        return response.data;
    },

    update: async (id: string, data: { title?: string; amount?: number; category?: Expense['category']; date?: string; description?: string }) => {
        const response = await api.put<{ success: boolean; message: string; data: Expense }>(`/expenses/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete<{ success: boolean; message: string }>(`/expenses/${id}`);
        return response.data;
    },
};

// =====================
// Memories API
// =====================

export const memoriesAPI = {
    create: async (data: { roomId: string; text: string; date?: string; mood: Memory['mood']; mediaUrls?: string[] }) => {
        const response = await api.post<{ success: boolean; message: string; data: Memory }>('/memories', data);
        return response.data;
    },

    getAll: async (params?: { from?: string; to?: string; mood?: string }) => {
        const response = await api.get<{ success: boolean; message: string; data: Memory[]; count: number }>('/memories', { params });
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get<{ success: boolean; message: string; data: Memory }>(`/memories/${id}`);
        return response.data;
    },

    update: async (id: string, data: { title?: string; content?: string; date?: string; mood?: Memory['mood']; tags?: string[]; mediaUrl?: string }) => {
        const response = await api.put<{ success: boolean; message: string; data: Memory }>(`/memories/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete<{ success: boolean; message: string }>(`/memories/${id}`);
        return response.data;
    },
};

// =====================
// Search API
// =====================

export const searchAPI = {
    search: async (params: { q: string; type?: string; tag?: string }) => {
        const response = await api.get<{
            success: boolean;
            message: string;
            data: {
                notes: Note[];
                stories: Story[];
                chapters: Chapter[];
                expenses: Expense[];
                memories: Memory[];
            };
            totalResults: number;
        }>('/search', { params });
        return response.data;
    },
};

export default api;
