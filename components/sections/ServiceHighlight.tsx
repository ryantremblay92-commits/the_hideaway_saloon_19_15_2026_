"use client";

import Link from "next/link";
import { motion, useMotionValue, useMotionTemplate } from "framer-motion";
import { services } from "@/lib/data/services";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import SectionHeader from "@/components/ui/SectionHeader";
import { fadeInUp, staggerContainer, viewportOptions } from "@/lib/animations";
import { Scissors, Sparkles, Flower2, Heart, Star, Smile, Clock, Palette, Crown, Zap, Wand2, Hand } from "lucide-react";
import Image from "next/image";

function SpotlightCard({ service }: { service: typeof services[0] }) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const iconMap: Record<string, any> = { Scissors, Sparkles, Flower2, Heart, Star, Smile, Clock, Palette, Crown, Zap, Wand2, Hand };
    const Icon = iconMap[service.icon] || Scissors;

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <motion.div
            variants={fadeInUp}
            onMouseMove={handleMouseMove}
            className="group relative"
        >
            <Card className="h-full group overflow-hidden glass-morphism-dark border-white/5 hover:border-primary-gold/30 transition-all duration-500">
                <motion.div
                    className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
                    style={{
                        background: useMotionTemplate`
                            radial-gradient(
                                600px circle at ${mouseX}px ${mouseY}px,
                                rgba(201, 169, 98, 0.1),
                                transparent 80%
                            )
                        `,
                    }}
                />

                <div className="relative h-72 w-full overflow-hidden">
                    <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover group-hover:scale-110 grayscale transition-transform duration-1000 group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-charcoal-premium via-primary-charcoal-premium/40 to-transparent p-8 flex flex-col justify-end">
                        {service.isStylistsChoice ? (
                            <div className="flex items-center gap-2 mb-2">
                                <Zap className="w-3 h-3 text-primary-gold animate-pulse" />
                                <span className="text-primary-gold text-[10px] font-black uppercase tracking-[0.3em] shimmer-text">
                                    Stylist&apos;s Choice
                                </span>
                            </div>
                        ) : (
                            <span className="text-primary-gold text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
                                {service.tag || "Ritual"}
                            </span>
                        )}
                        <h3 className="font-fraunces text-3xl font-light text-white group-hover:text-primary-gold transition-colors">
                            {service.title}
                        </h3>
                    </div>
                </div>

                <CardContent className="p-8 space-y-6">
                    <p className="text-white/60 text-sm leading-relaxed font-light">
                        {service.longDesc}
                    </p>

                    <div className="pt-6 flex items-center justify-between border-t border-white/10">
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase text-white/40 tracking-widest mb-1">Starting from</span>
                            <span className="text-white font-bold text-xl">AED {service.startingPrice}</span>
                        </div>
                        <Button variant="ghost" asChild className="text-primary-gold hover:text-white hover:bg-white/5 group/btn">
                            <Link href={`/services/${service.slug}`} className="flex items-center gap-2">
                                Detail Ritual <Icon className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

export default function ServiceHighlight() {
    const featuredServices = services.slice(0, 3);

    return (
        <section className="py-32 bg-primary-charcoal-premium relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="mb-20">
                    <SectionHeader
                        subtitle="The Experience"
                        title="The Hideaway Rituals"
                        align="center"
                        className="text-white"
                    />
                    <p className="text-center text-white/40 max-w-xl mx-auto -mt-6 font-light uppercase tracking-[0.2em] text-xs">
                        Curated transformations for hair, beauty & soul
                    </p>
                </div>

                <motion.div
                    initial="initial"
                    whileInView="animate"
                    viewport={viewportOptions}
                    variants={staggerContainer}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
                >
                    {featuredServices.map((service) => (
                        <SpotlightCard key={service.slug} service={service} />
                    ))}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={viewportOptions}
                    className="mt-24 text-center"
                >
                    <Button variant="outline" size="lg" asChild className="px-16 h-16 text-lg glass-morphism text-white border-white/10 hover:bg-white/5 transition-all">
                        <Link href="/services">Discover Full Rituals Menu</Link>
                    </Button>
                </motion.div>
            </div>

            {/* Subtle light leak for mood */}
            <div className="absolute -top-[20%] -left-[10%] w-[600px] h-[600px] bg-primary-gold/5 rounded-full blur-[150px] -z-0" />
        </section>
    );
}
