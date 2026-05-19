"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function WhatsAppButton() {
    const [isVisible, setIsVisible] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 2000);
        return () => clearTimeout(timer);
    }, []);

    const whatsappNumber = "+971500000000"; // Placeholder for The Hideaway
    const message = "Hi! I'd like to book a ritual at The Hideaway. Can you help me?";

    return (
        <div className="fixed bottom-10 right-10 z-[100] flex flex-col items-end gap-4">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="bg-white rounded-[2rem] shadow-2xl p-8 w-80 border border-secondary-pearl overflow-hidden relative"
                    >
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-primary-gold" />
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 text-primary-charcoal/20 hover:text-primary-charcoal transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-full bg-primary-ivory flex items-center justify-center relative">
                                <MessageCircle className="w-6 h-6 text-primary-charcoal" />
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                            </div>
                            <div>
                                <p className="font-fraunces text-lg text-primary-charcoal">The Hideaway</p>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-primary-gold">Online Now</p>
                            </div>
                        </div>

                        <div className="bg-primary-ivory rounded-2xl p-4 mb-6 text-sm text-primary-charcoal/70 leading-relaxed">
                            Hello! How can our artisans assist you with your aesthetic journey today?
                        </div>

                        <a 
                            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-3 w-full h-14 bg-primary-charcoal text-white rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-primary-gold transition-all group shadow-lg"
                        >
                            Start Conversation <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                        </a>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isVisible && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        onClick={() => setIsOpen(!isOpen)}
                        className={cn(
                            "w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 relative group",
                            isOpen ? "bg-primary-gold text-white" : "bg-primary-charcoal text-white hover:bg-primary-gold"
                        )}
                    >
                        {isOpen ? <X className="w-8 h-8" /> : <MessageCircle className="w-8 h-8 group-hover:scale-110 transition-transform" />}
                        {!isOpen && (
                            <span className="absolute right-full mr-6 py-2 px-4 bg-white rounded-full text-[10px] font-black uppercase tracking-widest text-primary-charcoal shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all">
                                Chat with an Artisan
                            </span>
                        )}
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}

function ArrowRight(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </svg>
    )
}
