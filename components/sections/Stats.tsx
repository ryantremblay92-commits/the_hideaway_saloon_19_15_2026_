"use client";

import { motion } from "framer-motion";
import CountUp from "react-countup";
import { stats, type Stat } from "@/lib/data/stats";
import { fadeInUp, viewportOptions } from "@/lib/animations";

export default function Stats() {
    return (
        <section className="py-20 bg-primary-gold">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
                    {stats.map((stat: Stat, idx) => (
                        <motion.div
                            key={idx}
                            initial="initial"
                            whileInView="animate"
                            viewport={viewportOptions}
                            variants={fadeInUp}
                            transition={{ delay: idx * 0.1 }}
                            className="text-center space-y-2 group"
                        >
                            <div className="font-fraunces text-4xl md:text-5xl lg:text-6xl font-bold text-primary-charcoal flex items-center justify-center">
                                <CountUp
                                    end={stat.end}
                                    duration={2.5}
                                    enableScrollSpy
                                    scrollSpyOnce
                                />
                                <span>{stat.suffix}</span>
                            </div>
                            <div className="space-y-1">
                                <p className="font-bold text-primary-charcoal uppercase tracking-widest text-xs md:text-sm">
                                    {stat.label}
                                </p>
                                <p className="text-primary-charcoal/60 text-[10px] md:text-xs">
                                    {stat.sublabel}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
