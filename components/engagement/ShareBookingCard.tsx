'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Share2, Instagram, MessageCircle, Download, Sparkles, Scissors, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface ShareBookingCardProps {
    booking: {
        service_name: string;
        date: string;
        time: string;
    };
    referralCode?: string;
}

export function ShareBookingCard({ booking, referralCode }: ShareBookingCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);

    const shareUrl = `https://thehideaway.ae/book?ref=${referralCode || ''}`;
    const shareText = `Just booked my ritual at The Hideaway! Sparkle with me using code ${referralCode || ''} for a special discount. ✨`;

    const handleShareWhatsApp = () => {
        const url = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
        window.open(url, '_blank');
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied! Ready to share. 🔗");
    };

    const formattedDate = new Date(booking.date).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
    });

    return (
        <div className="mt-8 pt-8 border-t border-white/10">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-pink-500/10 flex items-center justify-center">
                    <Share2 className="w-4 h-4 text-pink-400" />
                </div>
                <h4 className="font-bold text-white uppercase tracking-widest text-xs">Share the Vibe</h4>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative group cursor-default"
            >
                {/* The "Shareable" Card Preview */}
                <div
                    ref={cardRef}
                    className="relative w-full aspect-[4/5] max-w-[320px] mx-auto rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/50 border border-white/20"
                    style={{ background: 'linear-gradient(165deg, #1a1a1a 0%, #0d0d0d 100%)' }}
                >
                    {/* Background Accents */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                    <div className="absolute -top-20 -left-20 w-60 h-60 bg-pink-500/20 rounded-full blur-[80px]" />
                    <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-yellow-500/10 rounded-full blur-[80px]" />

                    <div className="relative z-10 p-8 h-full flex flex-col items-center justify-between text-center">
                        <div className="flex flex-col items-center">
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 5, repeat: Infinity }}
                                className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#D4AF37] to-[#AA8015] flex items-center justify-center text-black mb-6 shadow-xl"
                            >
                                <Sparkles className="w-8 h-8" />
                            </motion.div>
                            <h5 className="font-fraunces text-2xl font-bold text-white leading-tight mb-2">My Next Ritual</h5>
                            <div className="w-12 h-1 bg-[#D4AF37] rounded-full mb-8" />
                        </div>

                        <div className="space-y-4 w-full">
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
                                <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1">Service</p>
                                <p className="font-bold text-white text-lg">{booking.service_name}</p>
                            </div>

                            <div className="flex gap-3">
                                <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1">Date</p>
                                    <p className="font-bold text-white">{formattedDate}</p>
                                </div>
                                <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1">Time</p>
                                    <p className="font-bold text-white">{booking.time}</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6">
                            <p className="text-[9px] uppercase tracking-[0.4em] font-black text-[#D4AF37] mb-1">THE HIDEAWAY SALON</p>
                            <p className="text-[8px] text-white/30 tracking-widest">www.thehideaway.ae</p>
                        </div>
                    </div>

                    {/* Overlay for "Sharing" feel */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                        <p className="text-white text-xs font-black uppercase tracking-[0.3em] flex items-center gap-2">
                            Ready to share <Sparkles className="w-4 h-4" />
                        </p>
                    </div>
                </div>

                {/* Share Actions */}
                <div className="flex flex-wrap justify-center gap-3 mt-8">
                    <button
                        onClick={handleShareWhatsApp}
                        className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-[#25D366] text-white font-black text-[10px] uppercase tracking-widest hover:brightness-110 shadow-lg shadow-[#25D366]/20 transition-all"
                    >
                        <MessageCircle className="w-4 h-4" /> WhatsApp
                    </button>
                    <button
                        onClick={() => toast.info("Screenshot this card to share on Instagram Stories! 📸")}
                        className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white font-black text-[10px] uppercase tracking-widest hover:brightness-110 shadow-lg shadow-pink-500/20 transition-all"
                    >
                        <Instagram className="w-4 h-4" /> Instagram
                    </button>
                    <button
                        onClick={handleCopyLink}
                        className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all"
                    >
                        <Download className="w-4 h-4" /> Copy Link
                    </button>
                </div>

                {referralCode && (
                    <p className="text-center mt-6 text-[10px] text-white/30 uppercase tracking-[0.3em]">
                        Your referral link includes your reward code
                    </p>
                )}
            </motion.div>
        </div>
    );
}
