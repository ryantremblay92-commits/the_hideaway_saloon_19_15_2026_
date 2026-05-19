'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Calendar, ArrowRight } from 'lucide-react';

interface PointsExpiryWarningProps {
    expiryDate: string;
    points: number;
}

export function PointsExpiryWarning({ expiryDate, points }: PointsExpiryWarningProps) {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Show warning only if expiring in less than 30 days
    if (diffDays > 30 || diffDays < 0) return null;

    const formattedDate = expiry.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
    });

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8 relative rounded-3xl overflow-hidden group"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 backdrop-blur-md" />
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-orange-500 to-red-500" />

            <div className="relative p-6 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
                {/* Background Glow */}
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-orange-500/10 rounded-full blur-[60px]" />

                <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-orange-500/20 flex items-center justify-center text-orange-400">
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="font-bold text-white text-base mb-0.5">Points Expiring Soon</h4>
                        <p className="text-white/40 text-sm">
                            <strong className="text-orange-300">{points} points</strong> will expire on <span className="text-white/60">{formattedDate}</span> ({diffDays} days left).
                        </p>
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-3 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs uppercase tracking-widest hover:bg-orange-500/20 hover:border-orange-500/30 transition-all group/btn"
                >
                    Redeem Now <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </motion.button>
            </div>
        </motion.div>
    );
}
