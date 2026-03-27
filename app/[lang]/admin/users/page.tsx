'use client';

import React, { useState, useEffect, use } from 'react';
import { Plus, Trash2, Search, User as UserIcon, Shield, Briefcase, Mail, Loader2, Save, X } from 'lucide-react';
import api from '@/services/api';

interface User {
    _id: string;
    username: string;
    email: string;
    role: string;
    jobTitle?: string;
    bio?: string;
    avatar?: string;
    createdAt: string;
}

export default function UsersPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = use(params);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'editor',
        jobTitle: '',
        bio: ''
    });
    const [submitLoading, setSubmitLoading] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            // If 403, might not be admin
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        try {
            await api.delete(`/users/${id}`);
            setUsers(users.filter(u => u._id !== id));
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user');
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitLoading(true);
        try {
            const res = await api.post('/users', formData);
            setUsers([...users, res.data.user]);
            setIsModalOpen(false);
            setFormData({
                username: '',
                email: '',
                password: '',
                role: 'editor',
                jobTitle: '',
                bio: ''
            });
        } catch (error: any) {
            console.error('Error creating user:', error);
            alert(error.response?.data?.message || 'Failed to create user');
        } finally {
            setSubmitLoading(false);
        }
    };

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                    <p className="text-gray-500">Manage admins, editors, and authors.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[#C04000] hover:bg-[#A03000] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium shadow-sm"
                >
                    <Plus size={20} /> Add User
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#C04000] focus:ring-1 focus:ring-[#C04000]"
                    />
                </div>
            </div>

            {/* Users Grid */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="animate-spin text-[#C04000]" size={40} />
                </div>
            ) : filteredUsers.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <UserIcon className="text-gray-400" size={32} />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No users found</h3>
                    <p className="text-gray-500 mt-1">Try adjusting your search or add a new user.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredUsers.map(user => (
                        <div key={user._id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                                        {user.avatar ? (
                                            <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-xl font-bold text-gray-400">{user.username.charAt(0).toUpperCase()}</span>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{user.username}</h3>
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium uppercase
                                            ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}
                                        `}>
                                            <Shield size={10} /> {user.role}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(user._id)}
                                    className="text-gray-400 hover:text-red-500 p-1 rounded transition-colors"
                                    title="Delete User"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <div className="space-y-2 text-sm text-gray-600 mb-4">
                                <div className="flex items-center gap-2">
                                    <Mail size={16} className="text-gray-400" />
                                    {user.email}
                                </div>
                                {user.jobTitle && (
                                    <div className="flex items-center gap-2">
                                        <Briefcase size={16} className="text-gray-400" />
                                        {user.jobTitle}
                                    </div>
                                )}
                            </div>

                            {user.bio && (
                                <p className="text-sm text-gray-500 line-clamp-2 border-t pt-3 mt-2 border-gray-100 italic">
                                    "{user.bio}"
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Create User Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-900">Add New User</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#C04000] focus:ring-1 focus:ring-[#C04000] outline-none"
                                    value={formData.username}
                                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    required
                                    type="email"
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#C04000] focus:ring-1 focus:ring-[#C04000] outline-none"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input
                                    required
                                    type="password"
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#C04000] focus:ring-1 focus:ring-[#C04000] outline-none"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                    <select
                                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#C04000] focus:ring-1 focus:ring-[#C04000] outline-none"
                                        value={formData.role}
                                        onChange={e => setFormData({ ...formData, role: e.target.value })}
                                    >
                                        <option value="editor">Editor</option>
                                        <option value="admin">Admin</option>
                                        <option value="user">User</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#C04000] focus:ring-1 focus:ring-[#C04000] outline-none"
                                        placeholder="e.g. Writer"
                                        value={formData.jobTitle}
                                        onChange={e => setFormData({ ...formData, jobTitle: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                                <textarea
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#C04000] focus:ring-1 focus:ring-[#C04000] outline-none h-20 resize-none"
                                    placeholder="Short bio for author profile..."
                                    value={formData.bio}
                                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitLoading}
                                    className="flex-1 px-4 py-2 bg-[#C04000] text-white rounded-lg hover:bg-[#A03000] font-bold flex items-center justify-center gap-2 disabled:opacity-70"
                                >
                                    {submitLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                    Create User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
