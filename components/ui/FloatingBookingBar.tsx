"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function FloatingBookingBar() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
                >
                    <div className="luxury-glass shadow-luxury rounded-full p-2 pr-2 flex items-center justify-between gap-4 overflow-hidden group">
                        <div className="flex items-center gap-4 pl-4">
                            <div className="w-10 h-10 bg-primary-gold/10 rounded-full flex items-center justify-center border border-primary-gold/20">
                                <Sparkles className="w-4 h-4 text-primary-gold animate-pulse" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase tracking-[0.2em] text-primary-gold font-bold">The Hideaway</span>
                                <span className="text-[11px] text-white/60 font-light tracking-wide italic">Bespoke Rituals</span>
                            </div>
                        </div>

                        <Link
                            href="/book"
                            className="bg-primary-gold px-8 py-3 rounded-full text-[11px] uppercase tracking-[0.2em] font-bold text-primary-charcoal hover:scale-105 transition-all active:scale-95 shadow-lg shadow-primary-gold/20 gold-shimmer"
                        >
                            Book Now
                        </Link>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
