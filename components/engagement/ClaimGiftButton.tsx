"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Gift, ArrowRight, Scissors, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ClaimGiftProps {
    referralCode: string;
    serviceSlug: string;
}

export function ClaimGiftButton({ referralCode, serviceSlug }: ClaimGiftProps) {
    const [isClaimed, setIsClaimed] = useState(false);
    const router = useRouter();

    const handleClaim = () => {
        // Set the referral cookie via client-side for simplicity in this interaction
        // In a real app, we'd probably use a server action to be more secure
        document.cookie = `referral_code=${referralCode}; path=/; max-age=${30 * 24 * 60 * 60}`;
        setIsClaimed(true);

        toast.success("🎁 ₹500 Welcome Gift unlocked!", {
            description: "Applied to your next booking.",
            duration: 5000,
        });

        // Delay redirect to show success state
        setTimeout(() => {
            router.push(`/book?service=${serviceSlug}&ref=${referralCode}`);
        }, 1500);
    };

    return (
        <Button
            onClick={handleClaim}
            disabled={isClaimed}
            size="lg"
            className={`w-full h-16 rounded-2xl group relative overflow-hidden transition-all duration-500 ${isClaimed ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-primary-gold text-primary-charcoal hover:bg-white'
                }`}
        >
            <AnimatePresence mode="wait">
                {isClaimed ? (
                    <motion.div
                        key="success"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="flex items-center gap-3"
                    >
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="font-black uppercase tracking-[0.2em] text-[11px]">Gift Unlocked! Redirecting…</span>
                    </motion.div>
                ) : (
                    <motion.div
                        key="cta"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="flex items-center gap-3"
                    >
                        <Gift className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        <span className="font-black uppercase tracking-[0.2em] text-[11px]">Claim My ₹500 Welcome Gift</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </motion.div>
                )}
            </AnimatePresence>

            {!isClaimed && (
                <motion.div
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-white/30 skew-x-[30deg] pointer-events-none"
                />
            )}
        </Button>
    );
}
