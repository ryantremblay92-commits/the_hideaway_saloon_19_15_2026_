"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { createClient } from "@/lib/supabase/client";

// Refined, subtle animations for a premium feel using Golden Ratio (Phi ≈ 1.618)
const PHI = 1.618;
const staticFade = {
    initial: { opacity: 0 },
    animate: {
        opacity: 1,
        transition: {
            duration: 2.5,
            ease: "easeOut",
        },
    },
};

const subtleReveal = {
    initial: { y: 8, opacity: 0 }, // Reduced movement
    animate: {
        y: 0,
        opacity: 1,
        transition: {
            duration: PHI * 1.2,
            ease: [0.16, 1, 0.3, 1],
        },
    },
};
export default function Hero() {
    const supabase = createClient();
    const [heroImages, setHeroImages] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // Subtle Parallax - minimal movement for luxury feel
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });
    
    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
    const textY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]); // Reduced from 30%

    useEffect(() => {
        async function fetchHero() {
            const { data } = await supabase
                .from('gallery')
                .select('image_url')
                .eq('category', 'home_hero')
                .order('created_at', { ascending: false });

            const baseImages = [
                "/images/hero-premium.png",
                "/images/hideaway-salon-10.jpg",
                "/images/hideaway-salon-6.jpg",
            ];

            if (data && data.length > 0) {
                setHeroImages([...new Set([...baseImages, ...data.map(item => item.image_url)])]);
            } else {
                setHeroImages(baseImages);
            }
        }
        fetchHero();
    }, []);

    useEffect(() => {
        if (heroImages.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % heroImages.length);
        }, 12000); // Extremely slow transitions
        return () => clearInterval(timer);
    }, [heroImages]);

    return (
        <section ref={containerRef} className="relative min-h-[105vh] flex items-center justify-center bg-primary-charcoal-premium">
            {/* Immersive Media Layer */}
            <motion.div style={{ y: backgroundY }} className="absolute inset-0 z-0 overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 0.4, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 5, ease: "easeInOut" }}
                        className="absolute inset-0"
                    >
                        <Image
                            src={heroImages[currentIndex] || "/images/hero-premium.png"}
                            alt="The Hideaway Salon"
                            fill
                            className="object-cover"
                            priority
                        />
                    </motion.div>
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-b from-primary-charcoal-premium/40 via-primary-charcoal-premium/70 to-primary-charcoal-premium" />
            </motion.div>

            <div className="container mx-auto px-4 md:px-6 z-10 relative text-center max-w-6xl overflow-visible">
                <motion.div
                    style={{ y: textY }}
                    initial="initial"
                    animate="animate"
                    variants={staggerContainer}
                    className="space-y-16 overflow-visible"
                >
                    <motion.div className="space-y-8 overflow-visible">
                        {/* Unified Location Badge */}
                        <motion.div 
                            variants={staticFade}
                            className="inline-flex items-center gap-3 px-6 py-2 bg-white/[0.03] backdrop-blur-md text-primary-gold rounded-full text-[10px] font-bold tracking-[0.4em] uppercase border border-white/10"
                        >
                            <span className="w-1 h-1 rounded-full bg-primary-gold shadow-[0_0_8px_#C9A962]" />
                            Jumeirah Beach Road, Dubai
                        </motion.div>

                        <div className="space-y-6 overflow-visible">
                            <motion.h2 
                                variants={staticFade}
                                className="font-fraunces text-5xl md:text-7xl lg:text-8xl font-extralight text-white/90 leading-none tracking-tighter"
                            >
                                Effortless Chic at
                            </motion.h2>
                            
                            <motion.h1
                                style={{ fontSize: "clamp(3.5rem, 8vw, 8rem)" }}
                                className="font-fraunces italic font-medium leading-tight tracking-tighter block w-full text-center pb-4"
                            >
                                <div className="inline-block">
                                    <motion.span 
                                        variants={staticFade}
                                        className="shimmer-text"
                                    >
                                        The Hide
                                    </motion.span>
                                    <span className="text-white inline-flex relative ml-2 md:ml-4">
                                        {"away".split("").map((char, i) => (
                                            <motion.span
                                                key={i}
                                                initial={{ 
                                                    opacity: 0, 
                                                    x: -60,
                                                    filter: "blur(12px)",
                                                    scale: 0.9,
                                                }}
                                                animate={{ 
                                                    opacity: 1, 
                                                    x: 0,
                                                    filter: "blur(0px)",
                                                    scale: 1,
                                                }}
                                                transition={{ 
                                                    duration: 2, 
                                                    delay: 1.2 + (i * 0.15), 
                                                    ease: [0.16, 1, 0.3, 1]
                                                }}
                                                className="inline-block"
                                            >
                                                {char}
                                            </motion.span>
                                        ))}
                                    </span>
                                </div>
                            </motion.h1>
                        </div>

                        <motion.p 
                            variants={staticFade}
                            className="text-lg md:text-2xl text-white/50 max-w-3xl mx-auto font-fraunces italic font-light tracking-wide pt-4"
                        >
                            "A boutique hair spa sanctuary focusing on hair health and effortless colour."
                        </motion.p>
                    </motion.div>

                    <motion.div variants={staticFade} className="flex flex-col md:flex-row items-center justify-center gap-8 pt-4">
                        <Button
                            size="lg"
                            asChild
                            className="px-16 h-20 text-lg bg-primary-gold text-primary-charcoal font-bold hover:scale-105 transition-all shadow-2xl shadow-primary-gold/10 rounded-none uppercase tracking-widest"
                        >
                            <Link href="/book">
                                Book Your Ritual
                            </Link>
                        </Button>
                        <Button 
                            variant="outline" 
                            size="lg" 
                            asChild 
                            className="px-16 h-20 text-lg glass-morphism text-white border-white/10 hover:bg-white/5 transition-all rounded-none uppercase tracking-widest"
                        >
                            <Link href="/services">Rituals Menu</Link>
                        </Button>
                    </motion.div>

                    {/* Minimalist Trust Info */}
                    <motion.div variants={subtleReveal} className="pt-20">
                        <div className="flex items-center justify-center gap-16 opacity-30">
                            <div className="text-center group cursor-default">
                                <p className="text-white font-light text-2xl tracking-tighter group-hover:text-primary-gold transition-colors">Hair Spa</p>
                                <p className="text-[8px] uppercase tracking-[0.5em] mt-1">Rituals</p>
                            </div>
                            <div className="w-px h-10 bg-white/10 rotate-12" />
                            <div className="text-center group cursor-default">
                                <p className="text-white font-light text-2xl tracking-tighter group-hover:text-primary-gold transition-colors">Aesthetics</p>
                                <p className="text-[8px] uppercase tracking-[0.5em] mt-1">Care</p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Subtle Metaphorical Flow */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
                <motion.div 
                    animate={{
                        y: ["-10%", "10%"],
                        opacity: [0.1, 0.2, 0.1]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-0 right-0 w-1/2 h-full bg-gradient-radial from-primary-gold/10 to-transparent blur-3xl"
                />
            </div>
            
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3, duration: 2 }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-20"
            >
                <div className="w-px h-12 bg-gradient-to-b from-primary-gold to-transparent" />
            </motion.div>
        </section>
    );
}

