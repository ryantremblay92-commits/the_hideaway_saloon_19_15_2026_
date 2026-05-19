'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Share2, Gem, Bot, Maximize2 } from 'lucide-react';
import Image from 'next/image';

interface LightboxProps {
    image: {
        src: string;
        title?: string;
        alt?: string;
        description?: string;
        category?: string;
    };
    onClose: () => void;
    onNext?: () => void;
    onPrev?: () => void;
}

export default function Lightbox({ image, onClose, onNext, onPrev }: LightboxProps) {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight' && onNext) onNext();
            if (e.key === 'ArrowLeft' && onPrev) onPrev();
        };
        document.addEventListener('keydown', handleEscape);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [onClose, onNext, onPrev]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-xl flex items-center justify-center p-4 lg:p-12 overflow-hidden"
            onClick={onClose}
        >
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-gold/5 blur-[150px] rounded-full animate-pulse" />
            </div>

            {/* Elite Controls Header */}
            <div className="absolute top-0 left-0 right-0 p-8 flex items-center justify-between z-[110]">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl">
                        <Gem className="w-3.5 h-3.5 text-primary-gold" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Elite Archive</span>
                    </div>
                    {image.category && (
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-gold/40">
                            {image.category}
                        </span>
                    )}
                </div>
                
                <div className="flex items-center gap-4">
                    <button className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all duration-500 group">
                        <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </button>
                    <button
                        onClick={onClose}
                        className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/30 transition-all duration-500 group"
                    >
                        <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
                    </button>
                </div>
            </div>

            {/* Navigation Controls */}
            <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 flex justify-between items-center z-[110] pointer-events-none">
                {onPrev && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onPrev(); }}
                        className="pointer-events-auto w-16 h-16 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-primary-gold hover:text-primary-charcoal hover:border-primary-gold transition-all duration-700 group shadow-2xl backdrop-blur-md"
                    >
                        <ChevronLeft className="w-8 h-8 group-hover:-translate-x-1 transition-transform" />
                    </button>
                )}
                <div />
                {onNext && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onNext(); }}
                        className="pointer-events-auto w-16 h-16 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-primary-gold hover:text-primary-charcoal hover:border-primary-gold transition-all duration-700 group shadow-2xl backdrop-blur-md"
                    >
                        <ChevronRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
                    </button>
                )}
            </div>

            {/* Main Stage */}
            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                className="relative z-10 w-full max-w-7xl flex flex-col items-center gap-12"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative w-full aspect-[4/3] md:aspect-[16/9] lg:aspect-[21/9] max-h-[70vh] rounded-[3rem] overflow-hidden group/stage shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
                    <Image
                        src={image.src}
                        alt={image.alt || image.title || "Gallery image"}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover/stage:scale-105"
                        priority
                    />
                    
                    {/* Telemetry Overlays */}
                    <div className="absolute bottom-8 left-8 flex items-center gap-3">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/60 border border-white/10 backdrop-blur-xl">
                            <Bot className="w-3.5 h-3.5 text-primary-gold" />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/80">AI Enhanced Profile</span>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-black/60 border border-white/10 backdrop-blur-xl flex items-center justify-center text-white/40">
                            <Maximize2 className="w-4 h-4" />
                        </div>
                    </div>
                </div>

                <div className="text-center space-y-4 max-w-3xl">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <h3 className="font-fraunces text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                            {image.title || image.alt}
                        </h3>
                        <div className="flex items-center justify-center gap-4 mt-4">
                            <span className="w-12 h-[1px] bg-white/10" />
                            <p className="text-white/40 text-lg font-light italic leading-relaxed">
                                {image.description || "A showcase of bespoke artistic transformation."}
                            </p>
                            <span className="w-12 h-[1px] bg-white/10" />
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </motion.div>
    );
}
