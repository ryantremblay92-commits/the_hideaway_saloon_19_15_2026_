"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { viewportOptions, fadeInUp, staggerContainer } from "@/lib/animations";
import BeforeAfterSlider from "@/components/ui/BeforeAfterSlider";
import { ArrowRight, Bot, Zap, Search, ShieldCheck, Target, Cpu } from "lucide-react";

const steps = [
    {
        number: "01",
        title: "Feature Biometric Mapping",
        desc: "High-fidelity mapping of your natural undertones, eye depth, and melanin levels via neural analysis.",
        icon: Target
    },
    {
        number: "02",
        title: "Aesthetic Logic Engine",
        desc: "The system orchestrates a curated spectrum of shades matched to your unique biometric profile.",
        icon: Cpu
    },
    {
        number: "03",
        title: "Artisan Finalization",
        desc: "Collaborative review with your stylist to finalize the precise formula. Zero ambiguity, absolute perfection.",
        icon: ShieldCheck
    },
];

export default function GalleryPreview() {
    return (
        <section className="py-32 bg-primary-charcoal-premium relative overflow-hidden">
            {/* ✦ Cinematic Background elements */}
            <div className="absolute top-0 right-0 w-2/3 h-full bg-primary-gold/5 blur-3xl pointer-events-none animate-pulse" />
            <div className="absolute -bottom-48 -left-48 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
            
            {/* Scanline effect */}
            <div className="absolute inset-0 bg-[url(https://www.transparenttextures.com/patterns/carbon-fibre.png)] opacity-[0.03] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* ── Header: The Vision ─────────────────────────── */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-24 gap-12">
                    <motion.div 
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={viewportOptions}
                        className="space-y-8 max-w-3xl"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary-gold/10 text-primary-gold border border-primary-gold/20 shadow-luxury">
                                <Bot className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Neural Visualization</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/30">
                                <Zap className="w-4 h-4" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.4em]">99.8% Fidelity</span>
                            </div>
                        </div>

                        <h2 className="font-fraunces text-6xl md:text-8xl font-bold text-white leading-[0.85] tracking-tight">
                            See the <br />
                            <span className="text-primary-gold italic">Transformation.</span>
                        </h2>
                        
                        <p className="text-white/40 text-xl font-light leading-relaxed max-w-2xl italic">
                            &ldquo;Drag the slider to witness the surgical precision of our AI-assisted colour rituals — 
                            orchestrated before a single drop of pigment touches your hair.&rdquo;
                        </p>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={viewportOptions}
                        className="hidden lg:block"
                    >
                        <Button
                            asChild
                            className="bg-primary-gold text-primary-charcoal hover:bg-white transition-all h-20 px-12 rounded-[2rem] tracking-[0.3em] text-[12px] font-black shadow-luxury group overflow-hidden relative"
                        >
                            <Link href="/consultation" className="flex items-center gap-3">
                                <span className="relative z-10">INITIATE ANALYSIS</span>
                                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-2 transition-transform" />
                                </Link>
                        </Button>
                    </motion.div>
                </div>

                {/* ── Main Grid: The Interface ───────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

                    {/* Left — Immersive Visualization Slider */}
                    <motion.div
                        className="lg:col-span-7 relative group"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={viewportOptions}
                        transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
                    >
                        {/* Elite Framing */}
                        <div className="absolute -inset-4 bg-gradient-to-tr from-primary-gold/10 via-transparent to-white/5 rounded-[4rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                        
                        <div className="relative rounded-[3.5rem] overflow-hidden border border-white/10 shadow-[0_80px_160px_-40px_rgba(0,0,0,0.9)] bg-[#0F0F10]">
                            <BeforeAfterSlider
                                beforeSrc="/images/ai_before_v2.png"
                                afterSrc="/images/ai_after_v3.png"
                                beforeLabel="Raw State"
                                afterLabel="Neural Result"
                                beforeAlt="Biometric mapping: Natural State"
                                afterAlt="Biometric mapping: Final Result"
                                className="min-h-[600px] lg:min-h-[720px]"
                            />
                            
                            {/* HUD elements */}
                            <div className="absolute top-8 left-8 right-8 flex justify-between items-start pointer-events-none z-30">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-1">Scanner Active</span>
                                    <div className="flex gap-1">
                                        {[...Array(4)].map((_, i) => (
                                            <div key={i} className="w-4 h-[1px] bg-primary-gold/40" />
                                        ))}
                                    </div>
                                </div>
                                <div className="p-3 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10">
                                    <Search className="w-5 h-5 text-primary-gold" />
                                </div>
                            </div>

                            {/* Refined Drag hint */}
                            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 bg-black/60 backdrop-blur-2xl border border-white/20 px-8 py-4 rounded-[2rem] flex items-center gap-4 group-hover:scale-110 transition-transform duration-500 shadow-2xl pointer-events-none">
                                <div className="w-2 h-2 rounded-full bg-primary-gold animate-ping" />
                                <span className="text-white text-[11px] font-black uppercase tracking-[0.3em] whitespace-nowrap">
                                    Drag to Reconstruct
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right — The Logic Grid */}
                    <div className="lg:col-span-5 flex flex-col gap-8">
                        {/* Title Module */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={viewportOptions}
                            className="elite-glass rounded-[3rem] p-10 relative overflow-hidden group border-primary-gold/10"
                        >
                            <div className="absolute top-0 right-0 w-48 h-48 bg-primary-gold/5 blur-[60px] -mr-24 -mt-24 group-hover:bg-primary-gold/10 transition-colors duration-1000" />
                            <p className="text-primary-gold text-[10px] font-black uppercase tracking-[0.5em] mb-6 flex items-center gap-3">
                                <span className="w-8 h-[1px] bg-primary-gold/40" />
                                Protocol 0.1
                            </p>
                            <h3 className="text-white font-fraunces text-4xl leading-tight mb-6">
                                Precision Data Meets <br />
                                <span className="italic font-light">Artisan Intuition.</span>
                            </h3>
                            <p className="text-white/40 text-lg font-light leading-relaxed italic">
                                &ldquo;The algorithm handles the math. Our master stylists handle the soul. Together, they ensure perfection.&rdquo;
                            </p>
                        </motion.div>

                        {/* Procedural Step Module */}
                        <div className="flex flex-col gap-4">
                            {steps.map((step, i) => {
                                const Icon = step.icon;
                                return (
                                    <motion.div
                                        key={step.number}
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={viewportOptions}
                                        transition={{ delay: 0.3 + i * 0.1, duration: 0.8 }}
                                        className="bg-white/[0.02] border border-white/5 rounded-[2.2rem] p-8 flex gap-8 items-center hover:bg-white/[0.04] hover:border-primary-gold/20 transition-all duration-700 group cursor-default"
                                    >
                                        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-primary-gold group-hover:text-primary-charcoal transition-all duration-500 shadow-2xl">
                                            <Icon className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className="text-[10px] font-black text-primary-gold/40 uppercase tracking-widest">{step.number}</span>
                                                <p className="text-white font-bold text-lg group-hover:text-primary-gold transition-colors">{step.title}</p>
                                            </div>
                                            <p className="text-white/30 text-sm font-light leading-relaxed">{step.desc}</p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Mobile CTA */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={viewportOptions}
                            className="lg:hidden mt-4"
                        >
                            <Button
                                asChild
                                className="w-full bg-primary-gold text-primary-charcoal h-20 rounded-[2rem] text-[12px] font-black tracking-[0.3em] shadow-luxury"
                            >
                                <Link href="/consultation">INITIATE ANALYSIS</Link>
                            </Button>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}

