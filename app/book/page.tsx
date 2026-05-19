'use client';

import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Sparkles, Loader2 } from 'lucide-react';
import BookingForm from '@/components/booking/BookingForm';

export default function BookPage() {
    return (
        <div className="flex flex-col w-full min-h-screen bg-primary-ivory">
            {/* Background Decor */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] aspect-square rounded-full bg-primary-gold/5 blur-[120px]" />
                <div className="absolute bottom-[-5%] left-[-5%] w-[40%] aspect-square rounded-full bg-secondary-rose/5 blur-[100px]" />
            </div>

            {/* Header */}
            <section className="relative z-10 pt-36 pb-12 px-6">
                <div className="max-w-4xl mx-auto text-center space-y-5">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-4"
                    >
                        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-primary-gold/10 text-primary-gold border border-primary-gold/20">
                            <Calendar className="w-4 h-4" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Secure Your Ritual</span>
                        </div>
                        <h1 className="font-fraunces text-5xl md:text-7xl font-bold text-primary-charcoal leading-tight">
                            Ready for your <br />
                            <span className="text-primary-gold font-normal italic">Transformation?</span>
                        </h1>
                        <p className="text-secondary-slate text-lg max-w-xl mx-auto leading-relaxed">
                            Choose your service, pick your stylist, and lock in a time — all in under 2 minutes.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Booking Form */}
            <section className="relative z-10 pb-24 px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="max-w-4xl mx-auto"
                >
                    <Suspense fallback={
                        <div className="flex flex-col items-center justify-center py-40 space-y-4">
                            <Loader2 className="w-10 h-10 text-primary-gold animate-spin" />
                            <p className="text-xs font-bold uppercase tracking-widest text-secondary-label">Loading your experience...</p>
                        </div>
                    }>
                        <BookingForm />
                    </Suspense>
                </motion.div>
            </section>
        </div>
    );
}
