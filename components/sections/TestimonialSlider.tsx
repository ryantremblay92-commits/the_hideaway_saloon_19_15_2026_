"use client";

import { motion } from "framer-motion";
import { testimonials } from "@/lib/data/testimonials";
import SectionHeader from "@/components/ui/SectionHeader";
import { fadeInUp, viewportOptions } from "@/lib/animations";
import Image from "next/image";
import { Quote } from "lucide-react";

export default function TestimonialSlider() {
    return (
        <section className="py-24 bg-primary-charcoal text-white overflow-hidden relative">
            {/* Background patterns */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#fff_1px,transparent_1px)] [background-size:40px_40px]" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <SectionHeader
                    subtitle="Client Stories"
                    title="What our clients say about us"
                    align="center"
                    light
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 lg:gap-12">
                    {testimonials.slice(0, 4).map((testimonial, idx) => (
                        <motion.div
                            key={testimonial.id}
                            initial="initial"
                            whileInView="animate"
                            viewport={viewportOptions}
                            variants={fadeInUp}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white/5 backdrop-blur-sm border border-white/10 p-10 rounded-3xl relative group hover:bg-white/10 transition-all duration-500"
                        >
                            <Quote className="absolute top-10 right-10 w-12 h-12 text-primary-gold/20 group-hover:text-primary-gold/40 transition-colors" />

                            <div className="flex items-center gap-1 text-primary-gold mb-6">
                                {[...Array(testimonial.stars)].map((_, i) => (
                                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                    </svg>
                                ))}
                            </div>

                            <p className="text-xl md:text-2xl font-medium italic leading-relaxed mb-8 text-secondary-rose/90">
                                &quot;{testimonial.quote}&quot;
                            </p>

                            <div className="flex items-center gap-4">
                                <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-primary-gold shadow-xl">
                                    {testimonial.image ? (
                                        <Image
                                            src={testimonial.image}
                                            alt={testimonial.name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-primary-gold/20 flex items-center justify-center font-bold text-primary-gold">
                                            {testimonial.name[0]}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-fraunces text-lg font-bold">{testimonial.name}</h4>
                                    <p className="text-secondary-rose/40 text-sm uppercase tracking-widest">{testimonial.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
