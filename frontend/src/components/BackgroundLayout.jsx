import React from 'react';
import { motion } from 'framer-motion';

const BackgroundLayout = ({ children }) => {
    return (
        <div className="relative min-h-screen w-full transition-colors duration-500 overflow-x-hidden">
            {/* Ambient Background Layers */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                {/* Orbital Glow 1 */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 45, 0],
                        opacity: [0.15, 0.25, 0.15]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-[10%] -left-[5%] w-[70%] h-[70%] rounded-full bg-[var(--primary-color)] blur-[100px]"
                />
                {/* Orbital Glow 2 */}
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        rotate: [45, 0, 45],
                        opacity: [0.1, 0.2, 0.1]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -bottom-[10%] -right-[5%] w-[60%] h-[60%] rounded-full bg-[var(--secondary-color)] blur-[120px]"
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

