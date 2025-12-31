import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useWeather } from '../context/WeatherContext';
import { motion } from 'framer-motion';
import {
    Moon, Sun, Trash2, Github, Settings as SettingsIcon,
    Shield, Globe, Bell, ChevronRight, Activity, Sparkles
} from 'lucide-react';

const SettingCard = ({ icon: Icon, title, subtitle, action, danger }) => (
    <motion.div
        whileHover={{ x: 4 }}
        className="flex items-center justify-between p-5 rounded-[24px] bg-[var(--bg-page)]/50 border border-[var(--border-color)] hover:border-[var(--primary-color)] transition-all cursor-pointer group"
    >
        <div className="flex items-center gap-5">
            <div className={`p-4 rounded-2xl ${danger ? 'bg-red-500/10 text-red-500' : 'bg-[var(--bg-card)] text-[var(--primary-color)] shadow-sm group-hover:bg-[var(--primary-color)] group-hover:text-white transition-all duration-300'}`}>
                <Icon size={24} />
            </div>
            <div>
                <p className="font-bold text-lg text-[var(--text-primary)] leading-tight">{title}</p>
                <p className="text-sm text-[var(--text-muted)] font-medium mt-1">{subtitle}</p>
            </div>
        </div>
        <div>
            {action || <ChevronRight size={20} className="text-[var(--text-muted)] group-hover:text-[var(--primary-color)] transition-colors" />}
        </div>
    </motion.div>
);

const Settings = () => {
    const { theme, toggleTheme } = useTheme();
    const { setCity } = useWeather();

    const handleClearData = () => {
        if (window.confirm('Are you sure you want to clear all saved atmospheric data and location preferences? This action cannot be undone.')) {
            localStorage.removeItem('weather-city');
            setCity(null);
            window.location.reload();
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="px-4 space-y-12"
            style={{ maxWidth: '800px', margin: '0 auto' }}
        >
            {/* Header Section */}
            <motion.div variants={itemVariants} className="flex flex-col md-flex items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <div className="p-4 rounded-3xl text-white shadow-2xl" style={{ background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))' }}>
                        <SettingsIcon size={36} />
                    </div>
                    <div>
                        <h1 className="heading-lg tracking-tight">System Controls</h1>
                        <p className="text-[var(--text-secondary)] font-medium flex items-center gap-2">
                            Manage your workspace <Activity size={14} className="text-[var(--primary-color)]" />
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Main Configuration Grid */}
            <div className="grid gap-10">
                {/* Visual Style */}
                <motion.section variants={itemVariants} className="space-y-5">
                    <div className="flex items-center gap-3 px-2">
                        <Sparkles size={16} style={{ color: '#f59e0b' }} />
                        <h3 className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">Visual Environment</h3>
                    </div>
                    <div className="card grid gap-4 p-6">
                        <SettingCard
                            icon={theme === 'dark' ? Moon : Sun}
                            title="Interactive Theme"
                            subtitle={`Currently optimized for ${theme} environments`}
                            action={
                                <div
                                    onClick={toggleTheme}
                                    className={`w-14 h-7 rounded-full flex items-center px-1 transition-all cursor-pointer ${theme === 'dark' ? 'bg-indigo-600' : 'bg-orange-400'}`}
                                    style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)' }}
                                >
                                    <motion.div
                                        animate={{ x: theme === 'dark' ? 28 : 0 }}
                                        className="w-5 h-5 bg-white rounded-full shadow-lg flex items-center justify-center"
                                    >
                                        {theme === 'dark' ? <Moon size={10} style={{ color: '#4f46e5' }} /> : <Sun size={10} style={{ color: '#fb923c' }} />}
                                    </motion.div>
                                </div>
                            }
                        />
                        <SettingCard
                            icon={Globe}
                            title="Atmospheric Units"
                            subtitle="Metric systems (Celsius, km/h)"
                            action={<span className="text-sm font-black text-[var(--primary-color)]">Celsius</span>}
                        />
                    </div>
                </motion.section>

                {/* Data & Security */}
                <motion.section variants={itemVariants} className="space-y-5">
                    <div className="flex items-center gap-3 px-2">
                        <Shield size={16} style={{ color: '#22c55e' }} />
                        <h3 className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">Security & Data</h3>
                    </div>
                    <div className="card grid gap-4 p-6">
                        <SettingCard
                            icon={Trash2}
                            title="Purge Local Cache"
                            subtitle="Reset all persistent location data"
                            danger
                            action={
                                <button
                                    onClick={handleClearData}
                                    className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
                                    style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', cursor: 'pointer' }}
                                >
                                    Purge Data
                                </button>
                            }
                        />
                        <SettingCard
                            icon={Bell}
                            title="Smart Alerts"
                            subtitle="Real-time extreme weather notifications"
                            action={<span className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full" style={{ color: '#22c55e', backgroundColor: 'rgba(34, 197, 94, 0.1)' }}>Active</span>}
                        />
                    </div>
                </motion.section>

                {/* System Info */}
                <motion.section variants={itemVariants} className="card text-white border-0 shadow-2xl relative" style={{ background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))', overflow: 'hidden' }}>
                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-2xl" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
                                <Activity size={24} />
                            </div>
                            <div>
                                <h4 className="text-xl font-black">SkyCast Engine v2.4</h4>
                                <p className="text-white text-sm font-medium" style={{ opacity: 0.8 }}>Advanced Atmospheric Analytics Interface</p>
                            </div>
                        </div>
                        <p className="text-white leading-relaxed font-medium" style={{ opacity: 0.9 }}>
                            Our proprietary engine processes hyper-local meteorological data in real-time, providing you with high-fidelity insights and AI-driven recommendations.
                        </p>
                        <a
                            href="#"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-2xl font-black text-sm transition-all shadow-xl"
                            style={{ textDecoration: 'none', color: 'var(--primary-color)' }}
                        >
                            <Github size={20} />
                            Explore Architecture
                        </a>
                    </div>
                </motion.section>
            </div>

            {/* Footer Credits */}
            <motion.div
                variants={itemVariants}
                className="pt-12 flex flex-col md-flex items-center justify-between text-[var(--text-muted)] font-bold text-xs uppercase tracking-widest gap-4"
                style={{ borderTop: '1px solid var(--border-color)' }}
            >
                <div>Deployment Build: FX-992-DELTA</div>
                <div style={{ textAlign: 'center' }}>© 2025 SkyCast Core Systems. All Rights Reserved.</div>
            </motion.div>
        </motion.div>
    );
};

export default Settings;

