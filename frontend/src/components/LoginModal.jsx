import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, LogIn, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginModal = () => {
    const { isLoginOpen, closeLogin, login } = useAuth();
    const [isRegister, setIsRegister] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: ''
    });

    if (!isLoginOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate login
        login({
            email: formData.email,
            name: isRegister ? formData.name : formData.email.split('@')[0],
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.email}`
        });
    };

    return (
        <AnimatePresence>
            <div className="modal-overlay flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="card w-full"
                    style={{ maxWidth: '440px', padding: '2.5rem' }}
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-black tracking-tight">
                            {isRegister ? 'Create Account' : 'Welcome Back'}
                        </h2>
                        <button
                            onClick={closeLogin}
                            className="p-2 rounded-xl hover:bg-[var(--bg-page)] transition-colors border-none cursor-pointer text-[var(--text-muted)] hover:text-red-500"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {isRegister && (
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    required
                                    className="input-field"
                                    style={{ paddingLeft: '3rem' }}
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        )}
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
                            <input
                                type="email"
                                placeholder="Email Address"
                                required
                                className="input-field"
                                style={{ paddingLeft: '3rem' }}
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
                            <input
                                type="password"
                                placeholder="Password"
                                required
                                className="input-field"
                                style={{ paddingLeft: '3rem' }}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>

                        <button type="submit" className="btn-primary w-full h-14 justify-center mt-6">
                            <LogIn size={20} />
                            {isRegister ? 'Sign Up' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-[var(--border-color)] text-center">
                        <p className="text-[var(--text-secondary)] text-sm font-medium">
                            {isRegister ? 'Already have an account?' : "Don't have an account?"}
                            <button
                                onClick={() => setIsRegister(!isRegister)}
                                className="ml-2 text-[var(--primary-color)] font-bold border-none bg-transparent cursor-pointer hover:underline"
                            >
                                {isRegister ? 'Sign In' : 'Create One'}
                            </button>
                        </p>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default LoginModal;
