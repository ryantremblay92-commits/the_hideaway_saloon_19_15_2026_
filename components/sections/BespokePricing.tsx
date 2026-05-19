"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { pricingTable } from "@/lib/data/pricing";
import { fadeInUp, staggerContainer, viewportOptions } from "@/lib/animations";
import { Button } from "@/components/ui/Button";
import SectionHeader from "@/components/ui/SectionHeader";
import { cn } from "@/lib/utils";
import { ChevronRight, ExternalLink, Info } from "lucide-react";

export default function BespokePricing() {
    const [activeCategory, setActiveCategory] = useState(pricingTable[0].category);

    const activeData = pricingTable.find((c) => c.category === activeCategory);

    return (
        <section className="py-32 bg-primary-white overflow-hidden" id="rituals-menu">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-20 items-start">
                    {/* Left Side: Categories */}
                    <div className="w-full lg:w-1/3 sticky top-32">
                        <SectionHeader
                            subtitle="The Menu"
                            title="Bespoke Rituals"
                            align="left"
                        />
                        <div className="mt-12 flex flex-col gap-2">
                            {pricingTable.map((category) => (
                                <button
                                    key={category.category}
                                    onClick={() => setActiveCategory(category.category)}
                                    className={cn(
                                        "group flex items-center justify-between p-6 rounded-2xl transition-all duration-500 text-left",
                                        activeCategory === category.category
                                            ? "bg-primary-charcoal text-white shadow-xl shadow-primary-charcoal/20"
                                            : "hover:bg-primary-ivory text-primary-charcoal/60 hover:text-primary-charcoal"
                                    )}
                                >
                                    <span className={cn(
                                        "font-fraunces text-xl transition-all duration-500",
                                        activeCategory === category.category ? "translate-x-2" : "translate-x-0"
                                    )}>
                                        {category.category}
                                    </span>
                                    <ChevronRight className={cn(
                                        "w-5 h-5 transition-all duration-500",
                                        activeCategory === category.category ? "opacity-100 rotate-90" : "opacity-0 -rotate-90"
                                    )} />
                                </button>
                            ))}
                        </div>

                        <div className="mt-12 p-8 bg-primary-ivory rounded-3xl border border-secondary-pearl">
                            <p className="text-secondary-slate text-sm italic">
                                * Each ritual is tailored to your unique hair profile. Final pricing determined after clinical consultation.
                            </p>
                        </div>
                    </div>

                    {/* Right Side: Services Grid */}
                    <div className="w-full lg:w-2/3 min-h-[600px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeCategory}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                className="space-y-4"
                            >
                                <div className="grid grid-cols-1 gap-4">
                                    {activeData?.items.map((item, idx) => (
                                        <motion.div
                                            key={item.name}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="group relative bg-white border border-secondary-pearl p-8 rounded-3xl hover:border-primary-gold/30 hover:shadow-2xl hover:shadow-primary-gold/5 transition-all duration-500"
                                        >
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-3">
                                                        <h4 className="font-fraunces text-2xl text-primary-charcoal group-hover:text-primary-gold transition-colors duration-500">
                                                            {item.name}
                                                        </h4>
                                                        {item.note && (
                                                            <span className="text-[10px] uppercase tracking-widest px-2 py-1 bg-primary-gold/10 text-primary-gold rounded-md font-bold">
                                                                {item.note === 'starting from' ? 'From' : item.note}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-secondary-slate text-sm font-light max-w-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 h-0 group-hover:h-auto overflow-hidden">
                                                        Experience excellence with our curated {item.name.toLowerCase()} service, designed to elevate your aesthetic.
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-8">
                                                    <div className="text-right">
                                                        <span className="block text-[10px] uppercase tracking-[0.2em] text-secondary-slate mb-1">Ritual Value</span>
                                                        <span className="text-3xl font-fraunces font-bold text-primary-charcoal">
                                                            <span className="text-sm font-sans mr-1 text-secondary-slate">AED</span>
                                                            {item.price}
                                                        </span>
                                                    </div>
                                                    <Button 
                                                        variant="primary" 
                                                        size="sm" 
                                                        className="opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0"
                                                        asChild
                                                    >
                                                        <Link href={`/book?service=${encodeURIComponent(item.name)}`}>
                                                            Book <ExternalLink className="w-3 h-3 ml-2" />
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
}
