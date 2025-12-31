import React, { useEffect, useState } from 'react';
import { Newspaper, Calendar, ExternalLink, X, ArrowRight, User } from 'lucide-react';

import { useWeather } from '../context/WeatherContext';
import { motion, AnimatePresence } from 'framer-motion';

const News = () => {
    const { weather } = useWeather();
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedNews, setSelectedNews] = useState(null);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                // Mock Data for stability
                const mockData = [
                    { title: "Global Weather Patterns Shift", description: "Scientists observe new trends in global weather patterns affecting coastal regions with increasing frequency.", source: { name: "Weather Daily" }, publishedAt: new Date().toISOString(), url: "#", content: "Full article content would be here exploring the impact of rising sea levels and temperature fluctuations on marine ecosystems." },
                    { title: "Local Forecast update", description: `Weather in ${weather?.name || 'your area'} is expected to remain stable for the week with pleasant evenings.`, source: { name: "Local News" }, publishedAt: new Date().toISOString(), url: "#", content: "Residents can expect clear skies and moderate temperatures, making it an ideal time for outdoor activities." },
                    { title: "Solar Technology Breakthrough", description: "New solar panels work 50% better in cloudy conditions, revolutionizing renewable energy in northern climates.", source: { name: "Tech Today" }, publishedAt: new Date().toISOString(), url: "#", content: "The new graphene-based coating allows panels to capture a wider spectrum of light, even on overcast days." },
                    { title: "Heavy Rains Predicted", description: "Meteorologists warn of upcoming heavy rains in the tropical belt, urging caution for early morning commuters.", source: { name: "Global News" }, publishedAt: new Date().toISOString(), url: "#", content: "An unusual low-pressure system is gathering strength, likely to result in flash floods in low-lying areas." },
                ];

                setNews(mockData);
                setLoading(false);

            } catch (error) {
                console.error("Error fetching news", error);
                setLoading(false);
            }
        };

        fetchNews();
    }, [weather]);

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

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 gap-4">
            <div className="w-10 h-10 border-4 border-[var(--primary-color)] border-t-transparent rounded-full animate-spin"></div>
            <p className="font-semibold text-[var(--text-secondary)]">Gathering latest updates...</p>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto px-4">
            <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="flex items-center gap-4 mb-10"
            >
                <div className="p-3 bg-gradient-to-br from-[var(--primary-color)] to-[var(--secondary-color)] rounded-2xl text-white shadow-lg">
                    <Newspaper size={32} />
                </div>
                <div>
                    <h1 className="heading-lg tracking-tight">Weather Insights</h1>
                    <p className="text-[var(--text-secondary)] font-medium">The latest stories from around the atmosphere</p>
                </div>
            </motion.div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-2"
            >
                {news.map((item, index) => (
                    <motion.div
                        key={index}
                        variants={itemVariants}
                        whileHover={{ y: -8, scale: 1.01 }}
                        className="card cursor-pointer group flex flex-col h-full"
                        onClick={() => setSelectedNews(item)}
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <span className="px-3 py-1 bg-[var(--primary-glow)] text-[var(--primary-color)] rounded-full text-[10px] font-black uppercase tracking-widest leading-none">
                                {item.source.name}
                            </span>
                            <span className="text-[var(--text-muted)] text-[10px] font-bold">
                                {new Date(item.publishedAt).toLocaleDateString()}
                            </span>
                        </div>

                        <h3 className="text-xl font-bold mb-3 group-hover:text-[var(--primary-color)] transition-colors line-clamp-2">
                            {item.title}
                        </h3>
                        <p className="text-[var(--text-secondary)] text-sm line-clamp-3 mb-6 font-medium leading-relaxed">
                            {item.description}
                        </p>

                        <div className="mt-auto pt-4 border-t border-[var(--border-color)] flex items-center justify-between text-[var(--primary-color)] font-bold text-sm">
                            <span>Read More</span>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Modal */}
            <AnimatePresence>
                {selectedNews && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-8 bg-slate-900/40 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-[var(--bg-card)] w-full max-w-3xl rounded-[32px] shadow-2xl border border-[var(--border-color)] flex flex-col max-h-[90vh] overflow-hidden"
                        >
                            <div className="p-6 md:p-8 border-b border-[var(--border-color)] flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-3 mb-3">
                                        <Calendar size={14} className="text-[var(--primary-color)]" />
                                        <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">{new Date(selectedNews.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                    </div>
                                    <h2 className="heading-lg leading-tight">{selectedNews.title}</h2>
                                </div>
                                <button
                                    onClick={() => setSelectedNews(null)}
                                    className="p-2 rounded-2xl bg-[var(--bg-page)] hover:bg-red-500 hover:text-white transition-all text-[var(--text-secondary)]"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-8 md:p-10 overflow-y-auto space-y-6">
                                <p className="text-lg text-[var(--text-primary)] leading-relaxed font-medium">
                                    {selectedNews.content}
                                </p>
                                <p className="text-[var(--text-secondary)] leading-relaxed">
                                    Detailed meteorological analysis suggests that these patterns are not isolated incidents but part of a broader shift in atmospheric circulation. Experts recommend staying updated with local alerts.
                                </p>

                                <div className="pt-6 flex flex-wrap gap-4 items-center justify-between border-t border-[var(--border-color)]">
                                    <div className="flex items-center gap-3">
                                        {/* Author section removed as requested */}
                                    </div>


                                    <a
                                        href={selectedNews.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-primary"
                                    >
                                        Visit Source <ExternalLink size={18} />
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default News;


