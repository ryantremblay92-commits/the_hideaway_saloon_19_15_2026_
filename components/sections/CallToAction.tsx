"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { fadeInUp, viewportOptions } from "@/lib/animations";

export default function CallToAction() {
    return (
        <section className="py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-primary-charcoal z-0" />

            {/* Background visual texture */}
            <div className="absolute inset-0 opacity-10 z-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1600&q=80')] bg-cover bg-center grayscale" />
                <div className="absolute inset-0 bg-primary-charcoal/60" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-20 text-center">
                <motion.div
                    initial="initial"
                    whileInView="animate"
                    viewport={viewportOptions}
                    variants={fadeInUp}
                    className="max-w-3xl mx-auto space-y-8"
                >
                    <h2 className="font-fraunces text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                        Ready for your <span className="text-primary-gold">Hideaway ritual?</span>
                    </h2>

                    <p className="text-xl text-secondary-rose/60 leading-relaxed">
                        Secure your session today and join our community of chic & effortless hair enthusiasts in Jumeirah.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-6 pt-6">
                        <Button size="lg" asChild className="h-16 px-10 text-lg">
                            <Link href="/book">Book Now</Link>
                        </Button>
                        <Button variant="outline" size="lg" asChild className="h-16 px-10 text-lg border-white text-white hover:bg-white hover:text-primary-charcoal transition-all">
                            <Link href="/contact">Get in Touch</Link>
                        </Button>
                    </div>

                    <div className="pt-8 flex items-center justify-center gap-8 text-secondary-rose/40 text-sm uppercase tracking-[0.2em]">
                        <span>Professional Care</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-gold" />
                        <span>Artisan Styling</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-gold" />
                        <span>Premium Results</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
