"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { team } from "@/lib/data/team";
import { Instagram } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { fadeInUp, staggerContainer, viewportOptions } from "@/lib/animations";

export default function Team() {
    const featuredTeam = team.slice(0, 4);

    return (
        <section className="py-24 bg-primary-white">
            <div className="max-w-7xl mx-auto px-6">
                <SectionHeader
                    subtitle="The Artisans"
                    title="Meet our master stylists"
                    align="center"
                />

                <motion.div
                    initial="initial"
                    whileInView="animate"
                    viewport={viewportOptions}
                    variants={staggerContainer}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                    {featuredTeam.map((member) => (
                        <motion.div key={member.id} variants={fadeInUp} className="group">
                            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-6 shadow-lg">
                                <Image
                                    src={member.image}
                                    alt={member.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-primary-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                                    <Link
                                        href={member.instagram || "#"}
                                        className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary-charcoal hover:bg-primary-gold hover:text-white transition-colors"
                                    >
                                        <Instagram className="w-6 h-6" />
                                    </Link>
                                </div>
                            </div>
                            <div className="text-center">
                                <h4 className="font-fraunces text-2xl font-bold text-primary-charcoal group-hover:text-primary-gold transition-colors">
                                    {member.name}
                                </h4>
                                <p className="text-primary-gold text-xs font-bold uppercase tracking-widest mt-1">
                                    {member.role}
                                </p>
                                <p className="text-secondary-slate text-sm mt-3 px-4 leading-relaxed">
                                    {member.specialty}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
