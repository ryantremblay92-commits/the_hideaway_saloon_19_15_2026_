"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { team, TeamMember } from "@/lib/data/team";
import { Instagram, ArrowRight, ExternalLink, Award, Sparkles } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type Category = "All" | "Hair" | "Nails" | "Management";

export default function TeamProfiles() {
    const [activeCategory, setActiveCategory] = useState<Category>("All");
    const [hoveredId, setHoveredId] = useState<number | null>(null);

    const filteredTeam = team.filter((member) => {
        if (activeCategory === "All") return true;
        if (activeCategory === "Hair") return member.role.toLowerCase().includes("stylist") || member.role.toLowerCase().includes("director");
        if (activeCategory === "Nails") return member.role.toLowerCase().includes("nail");
        if (activeCategory === "Management") return member.role.toLowerCase().includes("manager");
        return true;
    });

    const categories: Category[] = ["All", "Hair", "Nails", "Management"];

    return (
        <section className="py-32 bg-white overflow-hidden" id="artisans">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-10">
                    <div className="max-w-2xl">
                        <SectionHeader
                            subtitle="The Artisans"
                            title="Curators of <span class='text-primary-gold italic'>Excellence</span>"
                            description="Meet the world-class experts behind Jumeirah's most exclusive aesthetic sanctuary."
                            align="left"
                        />
                    </div>
                    
                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-2 p-1.5 bg-primary-ivory rounded-2xl border border-secondary-pearl">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={cn(
                                    "px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-500",
                                    activeCategory === cat
                                        ? "bg-primary-charcoal text-white shadow-lg"
                                        : "text-primary-charcoal/40 hover:text-primary-charcoal hover:bg-white"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <motion.div 
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredTeam.map((member) => (
                            <motion.div
                                layout
                                key={member.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                className="group relative"
                                onMouseEnter={() => setHoveredId(member.id)}
                                onMouseLeave={() => setHoveredId(null)}
                            >
                                {/* Image Container */}
                                <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-8 bg-primary-ivory shadow-2xl transition-all duration-700 group-hover:-translate-y-2">
                                    <Image
                                        src={member.image}
                                        alt={member.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                                    />
                                    
                                    {/* Seniority Badge */}
                                    <div className="absolute top-6 left-6 z-20">
                                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.2em]">
                                            <Award className="w-3 h-3 text-primary-gold" />
                                            {member.seniority}
                                        </div>
                                    </div>

                                    {/* Overlay Info (Mobile/Hover) */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-primary-charcoal via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-10">
                                        <div className="space-y-4">
                                            <p className="text-white/80 text-sm italic leading-relaxed translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">
                                                &ldquo;{member.bio}&rdquo;
                                            </p>
                                            <div className="flex items-center gap-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-200">
                                                <a 
                                                    href={member.instagram} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-primary-gold hover:text-primary-charcoal transition-all"
                                                >
                                                    <Instagram className="w-5 h-5" />
                                                </a>
                                                <Button size="sm" variant="primary" className="bg-white text-primary-charcoal hover:bg-primary-gold h-10 rounded-full px-6" asChild>
                                                    <Link href={`/book?stylist=${member.id}`}>
                                                        Book Ritual <ArrowRight className="w-3 h-3 ml-2" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Static Info */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-fraunces text-3xl text-primary-charcoal group-hover:text-primary-gold transition-colors duration-500">
                                            {member.name}
                                        </h4>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary-gold flex items-center gap-1">
                                            <Sparkles className="w-3 h-3" /> {member.years} Yrs
                                        </span>
                                    </div>
                                    <p className="text-xs font-black uppercase tracking-[0.3em] text-secondary-slate">
                                        {member.role}
                                    </p>
                                    <p className="text-sm text-secondary-slate italic">
                                        Specialist: {member.specialty}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Video Consultation Banner (Found in Research) */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-32 p-12 bg-primary-charcoal rounded-[3.5rem] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10"
                >
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary-gold/10 to-transparent pointer-events-none" />
                    <div className="relative z-10 max-w-xl text-center md:text-left">
                        <span className="text-primary-gold text-[10px] font-bold uppercase tracking-[0.3em] mb-4 block">New Feature</span>
                        <h3 className="font-fraunces text-3xl md:text-5xl text-white mb-6">Digital Hair <span className="italic">Consultations</span></h3>
                        <p className="text-white/60 leading-relaxed text-lg">
                            Not sure which ritual is right for you? Book a complimentary 15-minute video call with our lead artisans to discuss your aesthetic goals from home.
                        </p>
                    </div>
                    <Button variant="primary" size="lg" className="h-16 px-10 bg-primary-gold text-primary-charcoal rounded-2xl group relative z-10">
                        Request Consultation <ExternalLink className="w-4 h-4 ml-3" />
                    </Button>
                </motion.div>
            </div>
        </section>
    );
}
