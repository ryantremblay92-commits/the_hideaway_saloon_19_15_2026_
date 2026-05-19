"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import SectionHeader from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Sparkles } from "lucide-react";

const looks = [
    {
        id: 1,
        title: "The Sunkissed Balayage",
        category: "Signature Colour",
        image: "https://images.unsplash.com/photo-1595475243692-3929c744a97a?w=800&q=80",
        description: "Seamless blends that mimic natural light, tailored to your skin's unique undertones.",
        service: "Bespoke Balayage"
    },
    {
        id: 2,
        title: "The Precision Bob",
        category: "Sculptural Cut",
        image: "https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?w=800&q=80",
        description: "Architectural lines meet effortless movement. A timeless silhouette for the modern muse.",
        service: "Artisan Cut & Finish"
    },
    {
        id: 3,
        title: "The Royal Spa Ritual",
        category: "Hair Health",
        image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&q=80",
        description: "Intensive molecular repair with Kérastase Chronologiste. Restoring youth from root to tip.",
        service: "Signature Hair Spa"
    },
    {
        id: 4,
        title: "The Sculpted French Tip",
        category: "Nail Artistry",
        image: "https://images.unsplash.com/photo-1604654894610-df490651e123?w=800&q=80",
        description: "A refined interpretation of a classic. Precision-engineered for lasting elegance.",
        service: "Master Manicure"
    }
];

export default function EditorialLookBook() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);

    return (
        <section ref={containerRef} className="py-32 bg-primary-charcoal relative overflow-hidden" id="lookbook">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] opacity-10 pointer-events-none" />
            
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-24">
                    <SectionHeader
                        subtitle="Inspiration"
                        title="The <span class='text-primary-gold italic'>Look Book</span>"
                        description="A curated collection of our most celebrated transformations. Find your next aesthetic direction."
                        align="center"
                        className="text-white"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-32">
                    {looks.map((look, idx) => (
                        <motion.div
                            key={look.id}
                            style={{ y: idx % 2 === 0 ? y1 : y2 }}
                            className="group"
                        >
                            <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden mb-8 shadow-2xl">
                                <Image
                                    src={look.image}
                                    alt={look.title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary-charcoal via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                                
                                <div className="absolute bottom-10 left-10 right-10">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Sparkles className="w-4 h-4 text-primary-gold" />
                                        <span className="text-primary-gold text-[10px] font-black uppercase tracking-[0.4em]">
                                            {look.category}
                                        </span>
                                    </div>
                                    <h4 className="font-fraunces text-4xl text-white mb-4 group-hover:text-primary-gold transition-colors">
                                        {look.title}
                                    </h4>
                                    <p className="text-white/60 text-sm leading-relaxed mb-6 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                        {look.description}
                                    </p>
                                    <Button variant="ghost" className="p-0 text-primary-gold hover:text-white transition-colors group/btn">
                                        BOOK THIS LOOK <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-2 transition-transform" />
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-32 text-center">
                    <Button variant="primary" size="lg" className="h-16 px-12 bg-white text-primary-charcoal hover:bg-primary-gold rounded-2xl transition-all shadow-2xl">
                        View Full Archive
                    </Button>
                </div>
            </div>
        </section>
    );
}
