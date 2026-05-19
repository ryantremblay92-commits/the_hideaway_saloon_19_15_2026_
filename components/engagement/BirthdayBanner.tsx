'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, Copy, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface BirthdayOffer {
    offer_code: string;
    discount_percent: number;
    valid_until: string;
    is_used: boolean;
}

interface BirthdayBannerProps {
    offer: BirthdayOffer;
    name: string;
}

export function BirthdayBanner({ offer, name }: BirthdayBannerProps) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        if (offer.is_used) return;

        navigator.clipboard.writeText(offer.offer_code);
        setCopied(true);
        toast.success('Birthday code copied! 🎂');
        setTimeout(() => setCopied(false), 2500);
    };

    const formattedDate = new Date(offer.valid_until).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-[2.5rem] overflow-hidden mb-8 border border-pink-500/30 group"
            style={{ background: 'linear-gradient(135deg, #1a0a1a 0%, #2d0a2d 100%)' }}
        >
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(12)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute text-yellow-400 text-sm"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            fontSize: `${Math.random() * 10 + 10}px`
                        }}
                        animate={{
                            y: [0, -20, 0],
                            opacity: [0.3, 1, 0.3],
                            scale: [1, 1.2, 1],
                            rotate: [0, 360]
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2
                        }}
                    >
                        ✨
                    </motion.div>
                ))}
            </div>

            <div className="relative z-10 p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                    <motion.div
                        animate={{
                            rotate: [-10, 10, -10],
                            scale: [1, 1.1, 1]
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-4xl shadow-xl shadow-pink-500/20"
                    >
                        🎂
                    </motion.div>
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-8 h-[2px] bg-pink-500"></span>
                            <p className="text-[11px] uppercase tracking-[0.4em] font-black text-pink-400">
                                Birthday Ritual Reward
                            </p>
                        </div>
                        <h3 className="font-fraunces text-3xl font-bold text-white mb-2 leading-tight">
                            Happy Birthday Month, <span className="text-pink-400">{name.split(' ')[0]}!</span>
                        </h3>
                        <p className="text-white/60 text-base max-w-md">
                            Celebrate with <strong className="text-pink-300">{offer.discount_percent}% OFF</strong> any service.
                            Valid until {formattedDate}.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col items-center md:items-end gap-3">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={copyToClipboard}
                        disabled={offer.is_used}
                        className={`relative flex items-center gap-4 px-8 py-5 rounded-2xl font-black text-sm transition-all shadow-xl group/btn ${offer.is_used
                                ? 'bg-white/10 text-white/40 border border-white/10'
                                : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-pink-500/30'
                            }`}
                    >
                        {copied ? (
                            <>
                                <CheckCircle2 className="w-5 h-5" />
                                <span>COPIED!</span>
                            </>
                        ) : offer.is_used ? (
                            <>
                                <CheckCircle2 className="w-5 h-5 opacity-40" />
                                <span>REDEEMED</span>
                            </>
                        ) : (
                            <>
                                <Copy className="w-5 h-5" />
                                <span className="font-mono tracking-widest">{offer.offer_code}</span>
                            </>
                        )}

                        {!offer.is_used && (
                            <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover/btn:opacity-100 transition-opacity blur-xl"></div>
                        )}
                    </motion.button>
                    {!offer.is_used && (
                        <p className="text-[10px] text-white/30 uppercase tracking-widest">
                            Click to copy code
                        </p>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
