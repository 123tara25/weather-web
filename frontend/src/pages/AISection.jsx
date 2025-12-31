import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Command } from 'lucide-react';

import { useWeather } from '../context/WeatherContext';
import { motion, AnimatePresence } from 'framer-motion';

const generateAIResponse = (input, weather) => {
    const lowerInput = input.toLowerCase();
    const temp = Math.round(weather?.main?.temp || 0);
    const cond = weather?.weather?.[0]?.description || 'unknown';

    if (lowerInput.includes('weather') || lowerInput.includes('temperature')) {
        return `Currently, it is ${temp}°C and ${cond} in ${weather?.name}. The atmospheric pressure is ${weather?.main?.pressure} hPa, making it a stable day.`;
    }
    if (lowerInput.includes('wear') || lowerInput.includes('clothes')) {
        if (temp < 15) return "It's quite chilly! I'd recommend a warm jacket or coat, and perhaps a scarf if you're heading out late.";
        if (temp < 25) return "The weather is pleasant. A t-shirt and light layering should keep you comfortable all day.";
        return "It's quite warm! I'd suggest light linen or cotton clothing to stay cool.";
    }
    if (lowerInput.includes('recommend') || lowerInput.includes('suggestion')) {
        if (cond.includes('rain')) return "Since it's raining, it's a perfect day for indoor activities like reading, visiting a gallery, or enjoying a cozy café.";
        if (cond.includes('clear')) return "With clear skies, it's a fantastic day for a hike, a picnic, or some outdoor photography.";
        return "It's a decent day for a mix of activities. Maybe a short walk and then a nice lunch indoors?";
    }
    return `As your AI assistant, I'm analyzing the real-time data for ${weather?.name}. You can ask me about clothing recommendations, activity suggestions, or detailed atmospheric stats!`;
};

const AISection = () => {
    const { weather } = useWeather();
    const [messages, setMessages] = useState([
        { id: 1, sender: 'ai', text: `Hello! I'm SkyCast AI. I've analyzed the conditions in ${weather?.name || 'your location'}. How can I assist your day?` }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), sender: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        setTimeout(() => {
            const aiResponse = generateAIResponse(userMsg.text, weather);
            setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: aiResponse }]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div className="h-[calc(100vh-160px)] flex flex-col max-w-5xl mx-auto px-4">
            {/* Header */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="card p-4 mb-6 flex items-center justify-between border-b-2 border-b-[var(--primary-color)]"
            >
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[var(--primary-color)] to-[var(--secondary-color)] rounded-2xl flex items-center justify-center text-white shadow-xl">
                        <Bot size={28} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
                            SkyCast AI <Sparkles size={16} className="text-amber-400" />
                        </h2>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="text-[10px] uppercase font-heavy tracking-widest text-[var(--text-muted)]">Active • Analyzing {weather?.name}</span>
                        </div>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-[var(--bg-page)] rounded-full border border-[var(--border-color)]">
                    <Command size={14} className="text-[var(--text-muted)]" />
                    <span className="text-[10px] font-bold text-[var(--text-secondary)]">AI Powered Insights</span>
                </div>
            </motion.div>

            {/* Chat Container */}
            <div className="flex-1 card p-0 flex flex-col overflow-hidden relative border-t-0 rounded-t-none">
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <AnimatePresence>
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className={`flex gap-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {msg.sender === 'ai' && (
                                    <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 border border-[var(--border-color)] flex items-center justify-center text-[var(--primary-color)] shadow-sm self-end">
                                        <Bot size={20} />
                                    </div>
                                )}

                                <div className={`max-w-[75%] px-6 py-4 rounded-[24px] font-medium leading-relaxed ${msg.sender === 'user'
                                    ? 'bg-gradient-to-br from-[var(--primary-color)] to-[var(--secondary-color)] text-white rounded-br-none shadow-lg'
                                    : 'bg-[var(--bg-page)] border border-[var(--border-color)] rounded-bl-none shadow-sm dark:bg-slate-900/40 text-[var(--text-primary)]'
                                    }`}>
                                    <p className="text-sm md:text-base">{msg.text}</p>
                                </div>

                                {msg.sender === 'user' && (
                                    <div className="w-10 h-10 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] shadow-sm self-end">
                                        <User size={20} />
                                    </div>
                                )}

                            </motion.div>
                        ))}
                        {isTyping && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                                <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 border border-[var(--border-color)] flex items-center justify-center">
                                    <Bot size={20} className="text-[var(--primary-color)]" />
                                </div>
                                <div className="bg-[var(--bg-page)] px-6 py-4 rounded-[24px] rounded-bl-none border border-[var(--border-color)] flex gap-1">
                                    <span className="w-2 h-2 bg-[var(--text-muted)] rounded-full animate-bounce"></span>
                                    <span className="w-2 h-2 bg-[var(--text-muted)] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                    <span className="w-2 h-2 bg-[var(--text-muted)] rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-6 bg-[var(--bg-card)] border-t border-[var(--border-color)]">
                    <form onSubmit={handleSend} className="flex items-center w-full h-14 rounded-full bg-[var(--bg-page)] border-2 border-[var(--border-color)] focus-within:border-[var(--primary-color)] transition-all px-2 relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type message here..."
                            className="bg-transparent border-none outline-none text-[var(--text-primary)] placeholder:text-[var(--text-muted)] h-full pl-4 pr-2 w-full flex-grow text-base"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim()}
                            className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[var(--primary-color)] to-[var(--secondary-color)] text-white rounded-full hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center shadow-md p-0"
                        >
                            <Send size={18} className="translate-x-0.5 translate-y-0.5" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AISection;

