"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Sparkles, Crown, CalendarHeart, Users, Send, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export default function BridalShowcasePage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate form submission
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);
        }, 1500);
    };

    return (
        <div className="flex flex-col w-full min-h-screen bg-[#0A0A0B] overflow-hidden">
            {/* Navigation */}
            <nav className="absolute top-0 left-0 w-full z-50 p-6 md:p-12">
                <Link href="/services" className="inline-flex items-center gap-2 text-white/60 hover:text-primary-gold transition-colors font-medium text-sm tracking-widest uppercase">
                    <ChevronLeft className="w-4 h-4" />
                    Back to Rituals
                </Link>
            </nav>

            {/* Immersive Hero */}
            <section className="relative h-[80vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2000"
                        alt="Bridal Styling"
                        fill
                        className="object-cover object-center opacity-40 mix-blend-luminosity"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B]/60 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0B]/80 via-transparent to-[#0A0A0B]/80" />
                </div>

                {/* Golden Rose SVG Trace Animation */}
                <motion.svg
                    viewBox="0 0 600 600"
                    className="absolute inset-0 w-full h-full z-[1] pointer-events-none"
                    xmlns="http://www.w3.org/2000/svg"
                    initial="hidden"
                    animate="visible"
                >
                    <defs>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Outer rose bloom petals */}
                    <motion.path
                        d="M300,200 C320,160 370,150 380,190 C390,230 360,260 300,260 C240,260 210,230 220,190 C230,150 280,160 300,200Z"
                        fill="none" stroke="#D4AF37" strokeWidth="0.8" filter="url(#glow)"
                        variants={{ hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 0.6, transition: { pathLength: { duration: 2.5, ease: "easeInOut" }, opacity: { duration: 0.5 } } } }}
                    />
                    <motion.path
                        d="M300,200 C340,170 390,185 385,220 C380,255 345,270 300,260 C255,270 220,255 215,220 C210,185 260,170 300,200Z"
                        fill="none" stroke="#D4AF37" strokeWidth="0.7" filter="url(#glow)"
                        variants={{ hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 0.5, transition: { pathLength: { duration: 2.8, ease: "easeInOut", delay: 0.4 }, opacity: { duration: 0.5, delay: 0.4 } } } }}
                    />
                    {/* Inner rose swirl */}
                    <motion.path
                        d="M300,230 C310,220 325,222 326,232 C327,242 315,248 300,245 C285,248 273,242 274,232 C275,222 290,220 300,230Z"
                        fill="none" stroke="#D4AF37" strokeWidth="1.2" filter="url(#glow)"
                        variants={{ hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 0.9, transition: { pathLength: { duration: 1.8, ease: "easeInOut", delay: 1.2 }, opacity: { duration: 0.3, delay: 1.2 } } } }}
                    />
                    {/* Stem */}
                    <motion.path
                        d="M300,260 C298,290 295,320 292,360"
                        fill="none" stroke="#D4AF37" strokeWidth="0.9" filter="url(#glow)"
                        variants={{ hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 0.55, transition: { pathLength: { duration: 1.5, ease: "easeInOut", delay: 2 }, opacity: { duration: 0.4, delay: 2 } } } }}
                    />
                    {/* Left leaf */}
                    <motion.path
                        d="M296,310 C280,295 255,295 250,310 C245,325 268,338 295,325"
                        fill="none" stroke="#D4AF37" strokeWidth="0.8" filter="url(#glow)"
                        variants={{ hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 0.5, transition: { pathLength: { duration: 1.4, ease: "easeInOut", delay: 2.5 }, opacity: { duration: 0.4, delay: 2.5 } } } }}
                    />
                    {/* Right leaf */}
                    <motion.path
                        d="M293,335 C310,318 338,316 342,331 C346,346 322,360 293,348"
                        fill="none" stroke="#D4AF37" strokeWidth="0.8" filter="url(#glow)"
                        variants={{ hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 0.5, transition: { pathLength: { duration: 1.4, ease: "easeInOut", delay: 2.9 }, opacity: { duration: 0.4, delay: 2.9 } } } }}
                    />
                    {/* Decorative outer petals — top left */}
                    <motion.path
                        d="M270,190 C255,165 240,145 255,135 C270,125 285,148 280,175"
                        fill="none" stroke="#D4AF37" strokeWidth="0.7" filter="url(#glow)"
                        variants={{ hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 0.4, transition: { pathLength: { duration: 1.6, ease: "easeInOut", delay: 0.8 }, opacity: { duration: 0.4, delay: 0.8 } } } }}
                    />
                    {/* top right */}
                    <motion.path
                        d="M330,190 C345,165 362,143 348,133 C334,123 318,147 322,174"
                        fill="none" stroke="#D4AF37" strokeWidth="0.7" filter="url(#glow)"
                        variants={{ hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 0.4, transition: { pathLength: { duration: 1.6, ease: "easeInOut", delay: 1.0 }, opacity: { duration: 0.4, delay: 1.0 } } } }}
                    />
                    {/* Soft sparkle dots */}
                    <motion.circle cx="252" cy="178" r="1.5" fill="#D4AF37" filter="url(#glow)"
                        variants={{ hidden: { opacity: 0, scale: 0 }, visible: { opacity: 0.8, scale: 1, transition: { delay: 3.2, duration: 0.5 } } }}
                    />
                    <motion.circle cx="350" cy="175" r="1.5" fill="#D4AF37" filter="url(#glow)"
                        variants={{ hidden: { opacity: 0, scale: 0 }, visible: { opacity: 0.8, scale: 1, transition: { delay: 3.4, duration: 0.5 } } }}
                    />
                    <motion.circle cx="300" cy="148" r="2" fill="#D4AF37" filter="url(#glow)"
                        variants={{ hidden: { opacity: 0, scale: 0 }, visible: { opacity: 1, scale: 1, transition: { delay: 3.6, duration: 0.6 } } }}
                    />
                </motion.svg>

                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="relative z-10 text-center max-w-4xl px-6 space-y-6"
                >
                    <div className="inline-flex items-center justify-center space-x-2 px-5 py-2 rounded-full bg-primary-gold/10 text-primary-gold border border-primary-gold/20 backdrop-blur-md mb-4">
                        <Crown className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">The Ultimate Luxury</span>
                    </div>
                    <h1 className="font-fraunces text-6xl md:text-8xl font-bold text-white tracking-tight leading-tight">
                        Bridal <span className="text-primary-gold italic">Artistry</span>
                    </h1>
                    <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
                        Styles that hold through dancing, tears, and photographs. A completely bespoke experience tailored for your most important day.
                    </p>
                </motion.div>
            </section>

            {/* The Packages */}
            <section className="py-32 relative z-10">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div 
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        {/* Package 1 */}
                        <motion.div variants={fadeInUp} className="group relative">
                            <div className="absolute inset-0 bg-gradient-to-b from-primary-gold/5 to-transparent rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl" />
                            <div className="h-full bg-white/5 border border-white/10 hover:border-primary-gold/30 rounded-[2.5rem] p-10 flex flex-col transition-all duration-500 relative z-10">
                                <div className="w-14 h-14 bg-primary-gold/10 rounded-2xl flex items-center justify-center mb-8 border border-primary-gold/20 text-primary-gold">
                                    <Sparkles className="w-6 h-6" />
                                </div>
                                <h3 className="font-fraunces text-2xl font-bold text-white mb-4">The Bridal Trial</h3>
                                <div className="text-[10px] uppercase tracking-widest text-primary-gold mb-6 font-bold">In-Salon Consultation</div>
                                <p className="text-white/50 text-sm leading-relaxed mb-8 flex-grow">
                                    A comprehensive 2-hour session to explore and perfect your vision. We'll test multiple styles, discuss hair accessories, and finalize the exact look you want before the big day to ensure zero stress.
                                </p>
                                <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Duration</p>
                                        <p className="text-white font-medium text-sm">2 Hours</p>
                                    </div>
                                    <p className="text-xl font-bold text-white tracking-tight">AED 450</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Package 2 */}
                        <motion.div variants={fadeInUp} className="group relative md:-translate-y-8">
                            <div className="absolute inset-0 bg-gradient-to-b from-primary-gold/20 to-transparent rounded-[2.5rem] blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
                            <div className="h-full bg-[#111112] border border-primary-gold/30 hover:border-primary-gold/60 rounded-[2.5rem] p-10 flex flex-col transition-all duration-500 relative z-10 shadow-2xl shadow-primary-gold/5">
                                <div className="absolute top-0 right-10 -translate-y-1/2 bg-primary-gold text-primary-charcoal text-[9px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-xl shadow-xl">
                                    The Core Ritual
                                </div>
                                <div className="w-14 h-14 bg-primary-gold text-primary-charcoal rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-primary-gold/20">
                                    <Crown className="w-6 h-6" />
                                </div>
                                <h3 className="font-fraunces text-2xl font-bold text-white mb-4">The Signature Bride</h3>
                                <div className="text-[10px] uppercase tracking-widest text-primary-gold mb-6 font-bold">Wedding Day Styling</div>
                                <p className="text-white/60 text-sm leading-relaxed mb-8 flex-grow">
                                    The ultimate wedding day experience. Includes premium skin-prep, flawless long-lasting makeup, intricate hair styling or updo, padding/extension application, and veil placement. Designed to look perfect in person and on camera.
                                </p>
                                <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Availability</p>
                                        <p className="text-white font-medium text-sm">Salon or On-Location</p>
                                    </div>
                                    <p className="text-xl font-bold text-white tracking-tight">AED 1,800</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Package 3 */}
                        <motion.div variants={fadeInUp} className="group relative">
                            <div className="absolute inset-0 bg-gradient-to-b from-primary-gold/5 to-transparent rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl" />
                            <div className="h-full bg-white/5 border border-white/10 hover:border-primary-gold/30 rounded-[2.5rem] p-10 flex flex-col transition-all duration-500 relative z-10">
                                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-8 border border-white/10 text-white/80">
                                    <Users className="w-6 h-6" />
                                </div>
                                <h3 className="font-fraunces text-2xl font-bold text-white mb-4">The Bridal Party</h3>
                                <div className="text-[10px] uppercase tracking-widest text-white/50 mb-6 font-bold">Bridesmaids & Family</div>
                                <p className="text-white/50 text-sm leading-relaxed mb-8 flex-grow">
                                    Cohesive, elegant styling for your closest circle. We ensure your bridesmaids and family members feel beautiful with styles that complement the bride's overall aesthetic while reflecting their personal taste.
                                </p>
                                <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Per Person</p>
                                        <p className="text-white font-medium text-sm">Hair & Makeup</p>
                                    </div>
                                    <p className="text-xl font-bold text-white tracking-tight">AED 650</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Inquiry Form */}
            <section id="inquiry-form" className="py-20 relative bg-black border-t border-white/5">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
                <div className="max-w-4xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <CalendarHeart className="w-12 h-12 text-primary-gold mx-auto mb-6 opacity-80" />
                        <h2 className="font-fraunces text-4xl md:text-5xl font-bold text-white mb-4">Request a Consultation</h2>
                        <p className="text-white/50 text-lg font-light">Tell us about your special day, and our bridal coordinator will be in touch within 24 hours.</p>
                    </div>

                    <div className="bg-[#0A0A0B] border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl">
                        {isSubmitted ? (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-16 space-y-6"
                            >
                                <div className="w-20 h-20 bg-primary-gold/20 text-primary-gold rounded-full flex items-center justify-center mx-auto mb-8">
                                    <Sparkles className="w-10 h-10" />
                                </div>
                                <h3 className="text-3xl font-fraunces font-bold text-white">Inquiry Received</h3>
                                <p className="text-white/60 max-w-md mx-auto leading-relaxed">
                                    Thank you for considering The Hideaway for your special day. Our bridal coordinator will contact you shortly to arrange your consultation.
                                </p>
                                <Button onClick={() => setIsSubmitted(false)} variant="outline" className="mt-8 border-white/20 text-white hover:bg-white/10">
                                    Submit Another Inquiry
                                </Button>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-white/50 pl-4">First Name</label>
                                        <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder:text-white/20 focus:border-primary-gold focus:ring-1 focus:ring-primary-gold outline-none transition-all" placeholder="Jane" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-white/50 pl-4">Last Name</label>
                                        <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder:text-white/20 focus:border-primary-gold focus:ring-1 focus:ring-primary-gold outline-none transition-all" placeholder="Doe" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-white/50 pl-4">Email Address</label>
                                        <input required type="email" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder:text-white/20 focus:border-primary-gold focus:ring-1 focus:ring-primary-gold outline-none transition-all" placeholder="jane@example.com" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-white/50 pl-4">Phone Number</label>
                                        <input required type="tel" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder:text-white/20 focus:border-primary-gold focus:ring-1 focus:ring-primary-gold outline-none transition-all" placeholder="+971 50 123 4567" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-white/50 pl-4">Wedding Date</label>
                                        <input required type="date" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:border-primary-gold focus:ring-1 focus:ring-primary-gold outline-none transition-all [color-scheme:dark]" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-white/50 pl-4">Location / Venue</label>
                                        <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder:text-white/20 focus:border-primary-gold focus:ring-1 focus:ring-primary-gold outline-none transition-all" placeholder="e.g. Burj Al Arab (or In-Salon)" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-white/50 pl-4">Bridal Party Details (Numbers & Services required)</label>
                                    <textarea required rows={4} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder:text-white/20 focus:border-primary-gold focus:ring-1 focus:ring-primary-gold outline-none transition-all resize-none" placeholder="E.g. Just the bride for hair and makeup, plus 3 bridesmaids for hair only..."></textarea>
                                </div>
                                <Button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    className="w-full h-16 rounded-2xl bg-primary-gold text-primary-charcoal hover:bg-white font-bold tracking-[0.2em] uppercase text-xs flex items-center justify-center gap-3 transition-all duration-500 shadow-[0_0_30px_rgba(212,175,55,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Sending Inquiry...
                                        </>
                                    ) : (
                                        <>
                                            Send Inquiry
                                            <Send className="w-4 h-4" />
                                        </>
                                    )}
                                </Button>
                            </form>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
