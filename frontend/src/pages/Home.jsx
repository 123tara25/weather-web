import React, { useState } from 'react';
import { useWeather } from '../context/WeatherContext';
import { motion } from 'framer-motion';
import {
    MapPin, Wind, Droplets, Eye, Search, Sun, Cloud,
    CloudRain, CloudSnow, CloudLightning, Thermometer,
    Sunrise, Sunset, Navigation
} from 'lucide-react';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100
        }
    }
};

const Home = () => {
    const { weather, forecast, loading, error, fetchWeather, fetchCurrentUserLocation } = useWeather();
    const [searchInput, setSearchInput] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchInput.trim()) {
            fetchWeather(searchInput);
            setSearchInput('');
        }
    };

    const getWeatherIcon = (id, size = 24, className = "") => {
        if (id >= 200 && id < 300) return <CloudLightning size={size} className={`text-purple-500 animate-pulse ${className}`} />;
        if (id >= 300 && id < 600) return <CloudRain size={size} className={`text-blue-500 ${className}`} />;
        if (id >= 600 && id < 700) return <CloudSnow size={size} className={`text-cyan-400 ${className}`} />;
        if (id >= 700 && id < 800) return <Cloud size={size} className={`text-gray-400 ${className}`} />;
        if (id === 800) return <Sun size={size} className={`text-yellow-400 animate-spin-slow ${className}`} />;
        return <Cloud size={size} className={`text-gray-400 ${className}`} />;
    };

    if (loading && !weather) {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-lg font-medium text-[var(--text-secondary)]">Fetching latest weather...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-center">
                <div className="p-4 bg-red-500/10 rounded-2xl border border-red-500/20 text-red-500">
                    <p className="text-lg font-semibold">{error}</p>
                </div>
                <button
                    onClick={() => fetchWeather('New York')} // Fallback
                    className="btn-primary"
                >
                    Try New York
                </button>
            </div>
        );
    }

    if (!weather) return null;

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-12 pb-40"
        >
            {/* Search & Header Section */}
            <motion.div variants={itemVariants} className="flex flex-col lg-flex-row lg-items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <MapPin size={24} className="text-[var(--primary-color)]" />
                        <h1 className="text-3xl font-black tracking-tight">
                            {weather.name}, <span className="text-[var(--text-muted)]">{weather.sys.country}</span>
                        </h1>
                    </div>
                    <p className="text-[var(--text-secondary)] font-medium text-lg">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </p>
                </div>

                <form onSubmit={handleSearch} className="flex items-center gap-2 p-1.5 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[20px] focus-within:border-[var(--primary-color)] transition-all shadow-sm w-full" style={{ maxWidth: '420px' }}>
                    <div className="flex items-center gap-2 px-3 w-full">
                        <Search className="text-[var(--text-muted)]" size={20} />
                        <input
                            type="text"
                            placeholder="Search another city..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="bg-transparent border-none text-[var(--text-primary)] font-medium w-full"
                            style={{ outline: 'none', height: '2.5rem', fontSize: '1rem' }}
                        />
                    </div>
                    <button type="submit" className="btn-primary h-12 px-6 rounded-2xl">
                        Search
                    </button>
                </form>

            </motion.div>

            {/* Weather Top Row */}
            <div className="grid lg-grid-cols-3 gap-8">
                {/* Main Temperature Card */}
                <motion.div variants={itemVariants} className="card lg-col-span-2 flex flex-col md-flex items-center justify-between gap-8 py-10 px-8">
                    <div className="flex flex-col items-center md-flex" style={{ alignItems: 'flex-start' }}>
                        <div className="flex items-center gap-4 mb-2">
                            {getWeatherIcon(weather.weather[0].id, 80)}
                            <div className="text-7xl font-black">{Math.round(weather.main.temp)}°</div>
                        </div>
                        <div className="text-2xl font-semibold capitalize mt-2 mb-4">
                            {weather.weather[0].description}
                        </div>
                        <div className="flex items-center gap-4 text-[var(--text-secondary)] font-medium px-4 py-2 rounded-full border border-[var(--border-color)]">
                            <span className="flex items-center gap-1"><Thermometer size={16} style={{ color: '#fb923c' }} /> Feels like: <b>{Math.round(weather.main.feels_like)}°</b></span>
                            <span style={{ width: '1px', height: '1rem', backgroundColor: 'var(--border-color)' }}></span>
                            <span className="flex items-center gap-1">H: <b>{Math.round(weather.main.temp_max)}°</b> L: <b>{Math.round(weather.main.temp_min)}°</b></span>
                        </div>
                    </div>

                    <div className="grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                        <div className="p-4 rounded-2xl border border-[var(--border-color)] flex flex-col items-center gap-1">
                            <Navigation size={20} className="text-[var(--primary-color)]" style={{ transform: 'rotate(45deg)' }} />
                            <span className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-widest">Wind</span>
                            <span className="text-lg font-bold">{weather.wind.speed} km/h</span>
                        </div>
                        <div className="p-4 rounded-2xl border border-[var(--border-color)] flex flex-col items-center gap-1">
                            <Droplets size={20} style={{ color: '#60a5fa' }} />
                            <span className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-widest">Humidity</span>
                            <span className="text-lg font-bold">{weather.main.humidity}%</span>
                        </div>
                    </div>
                </motion.div>

                {/* Sun/Details Card */}
                <motion.div variants={itemVariants} className="card flex flex-col justify-between p-8">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between pb-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(249, 115, 22, 0.1)' }}><Sunrise size={20} style={{ color: '#f97316' }} /></div>
                                <div>
                                    <p className="text-xs text-[var(--text-muted)] font-bold uppercase">Sunrise</p>
                                    <p className="font-bold">{new Date(weather.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3" style={{ textAlign: 'right' }}>
                                <div>
                                    <p className="text-xs text-[var(--text-muted)] font-bold uppercase">Sunset</p>
                                    <p className="font-bold">{new Date(weather.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                                <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(168, 85, 247, 0.1)' }}><Sunset size={20} style={{ color: '#a855f7' }} /></div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}><Eye size={20} style={{ color: '#3b82f6' }} /></div>
                                <div>
                                    <p className="text-xs text-[var(--text-muted)] font-bold uppercase">Visibility</p>
                                    <p className="font-bold">{(weather.visibility / 1000).toFixed(1)} km</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3" style={{ textAlign: 'right' }}>
                                <div>
                                    <p className="text-xs text-[var(--text-muted)] font-bold uppercase">Pressure</p>
                                    <p className="font-bold">{weather.main.pressure} hPa</p>
                                </div>
                                <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}><Wind size={20} style={{ color: '#22c55e' }} /></div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 pt-6" style={{ borderTop: '1px solid var(--border-color)' }}>
                        <div className="text-[var(--text-secondary)] text-sm italic text-center leading-relaxed">
                            "Perfect weather for a walk in the park today!"
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Forecast Section */}
            <motion.div variants={itemVariants} className="space-y-6 pt-12">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">Hourly Forecast</h2>
                </div>
                <div className="grid sm-grid-cols-4 lg-grid-cols-8 gap-6">
                    {forecast?.list?.slice(0, 8).map((item, idx) => (
                        <motion.div
                            key={idx}
                            whileHover={{ y: -8, scale: 1.05 }}
                            className="card flex flex-col items-center justify-center p-5 gap-4 shadow-sm"
                        >
                            <span className="text-sm font-bold text-[var(--text-muted)] tracking-wider">
                                {new Date(item.dt * 1000).getHours()}:00
                            </span>
                            {getWeatherIcon(item.weather[0].id, 32)}
                            <span className="text-xl font-black">{Math.round(item.main.temp)}°</span>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </motion.div>

    );
};

export default Home;

