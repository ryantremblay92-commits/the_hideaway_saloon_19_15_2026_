'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { Sparkles, Zap, ArrowRight, Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { services } from '@/lib/data/services';
import { Button } from '@/components/ui/Button';

// Deterministic particle config — avoids hydration mismatch from Math.random()
const PARTICLES = [
    { id: 0,  x: 8,  size: 3, duration: 5.2, delay: 0.0,  driftX: 12  },
    { id: 1,  x: 17, size: 5, duration: 6.8, delay: 0.7,  driftX: -8  },
    { id: 2,  x: 26, size: 3, duration: 4.5, delay: 1.4,  driftX: 15  },
    { id: 3,  x: 35, size: 6, duration: 7.1, delay: 0.3,  driftX: -10 },
    { id: 4,  x: 44, size: 4, duration: 5.6, delay: 1.9,  driftX: 8   },
    { id: 5,  x: 53, size: 3, duration: 6.3, delay: 0.9,  driftX: -14 },
    { id: 6,  x: 62, size: 5, duration: 4.9, delay: 2.2,  driftX: 11  },
    { id: 7,  x: 71, size: 4, duration: 7.4, delay: 0.5,  driftX: -7  },
    { id: 8,  x: 80, size: 3, duration: 5.8, delay: 1.6,  driftX: 13  },
    { id: 9,  x: 89, size: 6, duration: 6.1, delay: 0.2,  driftX: -9  },
    { id: 10, x: 12, size: 4, duration: 4.7, delay: 2.8,  driftX: 16  },
    { id: 11, x: 21, size: 3, duration: 6.5, delay: 1.1,  driftX: -12 },
    { id: 12, x: 39, size: 5, duration: 5.3, delay: 3.1,  driftX: 9   },
    { id: 13, x: 57, size: 3, duration: 7.0, delay: 0.6,  driftX: -11 },
    { id: 14, x: 68, size: 4, duration: 4.4, delay: 2.4,  driftX: 14  },
    { id: 15, x: 76, size: 6, duration: 6.7, delay: 1.8,  driftX: -6  },
    { id: 16, x: 85, size: 3, duration: 5.1, delay: 3.5,  driftX: 10  },
    { id: 17, x: 93, size: 4, duration: 6.9, delay: 0.4,  driftX: -13 },
];

function MoistureParticle({
    x, size, duration, delay, driftX, hovered,
}: {
    x: number; size: number; duration: number; delay: number; driftX: number; hovered: boolean;
}) {
    return (
        <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
                width: size,
                height: size,
                left: `${x}%`,
                bottom: -size,
                background: 'radial-gradient(circle, rgba(255,215,0,0.7) 0%, rgba(212,175,55,0.3) 60%, transparent 100%)',
                filter: 'blur(0.5px)',
            }}
            animate={{
                y: [0, -(280 + size * 20)],
                x: [0, driftX, driftX * 0.5],
                opacity: [0, 0.85, 0.5, 0],
                scale: [0.4, 1, 0.7, 0.2],
            }}
            transition={{
                duration: hovered ? duration * 0.7 : duration,
                delay,
                repeat: Infinity,
                ease: 'easeOut',
                repeatDelay: 0.2,
            }}
        />
    );
}

export default function StylistsChoice() {
    const featured = services.find(s => s.isStylistsChoice) || services[0];

    const sectionRef = useRef<HTMLElement>(null);
    const imageWrapRef = useRef<HTMLDivElement>(null);
    const [hovered, setHovered] = React.useState(false);

    // Scroll-driven parallax
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start'],
    });
    const rawY = useTransform(scrollYProgress, [0, 1], ['10%', '-10%']);
    const imageY = useSpring(rawY, { stiffness: 60, damping: 20 });

    return (
        <section ref={sectionRef} className="py-24 relative overflow-hidden bg-[#0A0A0B]">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl aspect-video bg-primary-gold/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16">

                    {/* ── Left: Animated Image Panel ── */}
                    <div
                        ref={imageWrapRef}
                        className="w-full lg:w-1/2 relative"
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/10"
                        >
                            {/* ① Scroll Parallax Image — scaled 120% so edges stay hidden */}
                            <motion.div
                                style={{ y: imageY }}
                                className="absolute inset-0 scale-[1.2] will-change-transform"
                            >
                                <Image
                                    src={featured.image}
                                    alt={featured.title}
                                    fill
                                    className="object-cover object-center"
                                    priority
                                />
                            </motion.div>

                            {/* Base gradient vignette */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B]/20 to-transparent opacity-75 z-10 pointer-events-none" />

                            {/* ② Golden Shimmer Sweep */}
                            <div className="absolute inset-0 z-20 overflow-hidden pointer-events-none">
                                <motion.div
                                    animate={{ x: ['-150%', '250%'] }}
                                    transition={{
                                        duration: hovered ? 2 : 3.5,
                                        repeat: Infinity,
                                        repeatDelay: hovered ? 2 : 5,
                                        ease: "easeInOut",
                                    }}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        bottom: 0,
                                        width: '40%',
                                        transform: 'skewX(-20deg)',
                                        background:
                                            'linear-gradient(90deg, transparent 0%, rgba(255,215,0,0.03) 30%, rgba(255,215,0,0.1) 50%, rgba(255,215,0,0.03) 70%, transparent 100%)',
                                        filter: 'blur(8px)',
                                    }}
                                />
                            </div>

                            {/* ③ Floating Moisture Particles */}
                            <div className="absolute inset-0 z-20 overflow-hidden pointer-events-none">
                                {PARTICLES.map(p => (
                                    <MoistureParticle
                                        key={p.id}
                                        x={p.x}
                                        size={p.size}
                                        duration={p.duration}
                                        delay={p.delay}
                                        driftX={p.driftX}
                                        hovered={hovered}
                                    />
                                ))}
                            </div>

                            {/* Hover golden radial glow */}
                            <motion.div
                                animate={{ opacity: hovered ? 1 : 0 }}
                                transition={{ duration: 0.5 }}
                                className="absolute inset-0 z-[15] pointer-events-none"
                                style={{
                                    background:
                                        'radial-gradient(ellipse at 50% 60%, rgba(212,175,55,0.12) 0%, transparent 65%)',
                                }}
                            />

                            {/* Stylist's Choice badge */}
                            <motion.div
                                animate={{
                                    boxShadow: [
                                        '0 0 0px rgba(212,175,55,0)',
                                        '0 0 30px rgba(212,175,55,0.4)',
                                        '0 0 0px rgba(212,175,55,0)',
                                    ],
                                }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="absolute top-8 left-8 bg-gradient-to-r from-primary-gold via-[#FFD700] to-primary-gold text-primary-charcoal px-6 py-3 rounded-2xl flex items-center gap-3 overflow-hidden shadow-2xl z-30"
                            >
                                <motion.div
                                    animate={{ x: ['-100%', '200%'] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
                                    className="absolute inset-0 bg-white/40 skew-x-[30deg]"
                                />
                                <Zap className="w-4 h-4 relative z-10" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] relative z-10">
                                    Stylist&apos;s Choice
                                </span>
                            </motion.div>
                        </motion.div>

                        {/* Floating depth card */}
                        <motion.div
                            animate={{ y: [0, -15, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute -bottom-8 -right-8 w-48 h-48 bg-white/5 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 p-6 flex flex-col justify-center gap-2 shadow-2xl z-20"
                        >
                            <div className="flex items-center gap-2 text-primary-gold">
                                <Clock className="w-4 h-4" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">{featured.duration}</span>
                            </div>
                            <h4 className="font-fraunces text-xl text-white">Precise Ritual</h4>
                            <p className="text-white/40 text-[10px] uppercase tracking-widest leading-relaxed">
                                Booked 24 times this week
                            </p>
                        </motion.div>
                    </div>

                    {/* ── Right: Content ── */}
                    <div className="w-full lg:w-1/2 space-y-10">
                        <div className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/40 mb-2"
                            >
                                <Sparkles className="w-4 h-4 text-primary-gold" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Weekly Feature</span>
                            </motion.div>

                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="font-fraunces text-5xl md:text-7xl font-bold text-white leading-tight"
                            >
                                The Signature <br />
                                <span className="text-primary-gold italic">{featured.title}</span>
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="text-white/40 text-lg md:text-xl font-light leading-relaxed max-w-lg italic"
                            >
                                &ldquo;{featured.longDesc}&rdquo;
                            </motion.p>
                        </div>

                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                            {featured.subServices.slice(0, 4).map((sub, i) => (
                                <motion.li
                                    key={sub}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 + i * 0.1 }}
                                    className="flex items-center gap-3 group/item cursor-default"
                                >
                                    <div className="w-2 h-2 rounded-full bg-primary-gold/40 group-hover/item:bg-primary-gold transition-colors" />
                                    <span className="text-white/60 text-sm group-hover/item:text-white transition-colors">
                                        {sub}
                                    </span>
                                </motion.li>
                            ))}
                        </ul>

                        <div className="flex flex-col sm:flex-row items-center gap-6 pt-6">
                            <Button
                                asChild
                                size="lg"
                                className="h-16 px-10 bg-white text-primary-charcoal hover:bg-primary-gold rounded-2xl group w-full sm:w-auto"
                            >
                                <Link href={`/book?service=${featured.slug}`} className="flex items-center gap-3">
                                    <span className="font-black uppercase tracking-[0.2em] text-[11px]">Experience Now</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>

                            <div className="flex flex-col items-center sm:items-start">
                                <span className="text-[10px] uppercase tracking-widest text-white/20 mb-1">Ritual Value</span>
                                <span className="text-2xl font-bold text-white tracking-tight">AED {featured.startingPrice}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
