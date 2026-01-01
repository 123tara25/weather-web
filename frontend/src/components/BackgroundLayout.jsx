import React from 'react';
import { motion } from 'framer-motion';
import { useWeather } from '../context/WeatherContext';

const BackgroundLayout = ({ children }) => {
    const { weather } = useWeather();

    // Determine colors based on weather condition
    const getThemeColors = () => {
        if (!weather) return { primary: '#6366f1', secondary: '#a855f7' }; // Default Indigo/Purple

        const id = weather.weather[0].id;

        // Thunderstorm (2xx) - Deep Purple & Dark Blue
        if (id >= 200 && id < 300) return { primary: '#4c1d95', secondary: '#1e3a8a' };

        // Drizzle (3xx) & Rain (5xx) - Blue & Cyan
        if (id >= 300 && id < 600) return { primary: '#2563eb', secondary: '#0891b2' };

        // Snow (6xx) - Light Blue & White
        if (id >= 600 && id < 700) return { primary: '#0ea5e9', secondary: '#e0f2fe' };

        // Atmosphere (7xx) - Gray & Slate
        if (id >= 700 && id < 800) return { primary: '#64748b', secondary: '#94a3b8' };

        // Clear (800) - Orange (Sun) & Sky Blue
        if (id === 800) return { primary: '#f59e0b', secondary: '#38bdf8' };

        // Clouds (80x) - Grayish Blue & Cool Gray
        if (id > 800) return { primary: '#6b7280', secondary: '#9ca3af' };

        return { primary: '#6366f1', secondary: '#a855f7' };
    };

    const colors = getThemeColors();

    return (
        <div
            className="relative min-h-screen w-full transition-colors duration-1000 overflow-x-hidden"
            style={{
                background: `linear-gradient(to bottom right, ${colors.primary}20, ${colors.secondary}20, var(--bg-page))`
            }}
        >
            {/* Ambient Background Layers */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                {/* Dynamic Blob 1 */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 45, 0],
                        backgroundColor: colors.primary,
                        opacity: [0.4, 0.6, 0.4]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-[10%] -left-[5%] w-[70%] h-[70%] rounded-full blur-[100px]"
                />

                {/* Dynamic Blob 2 */}
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        rotate: [45, 0, 45],
                        backgroundColor: colors.secondary,
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -bottom-[10%] -right-[5%] w-[60%] h-[60%] rounded-full blur-[120px]"
                />
            </div>

            {/* Content Layer */}
            <div className="relative z-10 min-h-screen flex flex-col">
                {children}
            </div>
        </div>
    );
};

export default BackgroundLayout;

