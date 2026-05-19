'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Calendar, X, Check } from 'lucide-react';
import { updateDateOfBirth } from '@/lib/actions/loyalty';
import { toast } from 'sonner';

export function BirthdayPrompt({ userId, onUpdate }: { userId: string, onUpdate: () => void }) {
    const [dob, setDob] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!dob) return;

        setIsSubmitting(true);
        const result = await updateDateOfBirth(userId, dob);

        if (result.success) {
            toast.success("Profile updated! Get ready for a birthday surprise. 🎂");
            onUpdate();
            setIsVisible(false);
        } else {
            toast.error(result.error || "Failed to update birthday.");
        }
        setIsSubmitting(false);
    };

    if (!isVisible) return null;

    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 overflow-hidden"
        >
            <div className="relative rounded-3xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-6 md:p-8">
                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute top-4 right-4 text-white/20 hover:text-white/40 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center shrink-0">
                        <Gift className="w-8 h-8 text-[#D4AF37]" />
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <h4 className="font-fraunces text-xl font-bold text-white mb-1">When is your special day?</h4>
                        <p className="text-white/40 text-sm">Add your birthday to unlock a special 20% discount ritual every year.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-48">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                            <input
                                type="date"
                                required
                                value={dob}
                                onChange={(e) => setDob(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/40 [color-scheme:dark]"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={!dob || isSubmitting}
                            className="px-6 py-3 bg-[#D4AF37] hover:bg-white text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "..." : "Save"}
                        </button>
                    </form>
                </div>
            </div>
        </motion.div>
    );
}
