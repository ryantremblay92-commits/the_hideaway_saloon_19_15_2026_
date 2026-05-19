"use client";

import { motion } from "framer-motion";
import { faqs } from "@/lib/data/faqs";
import { fadeInUp, viewportOptions } from "@/lib/animations";
import { useState } from "react";
import { ChevronDown, Search, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function FAQPage() {
    const [openId, setOpenId] = useState<number | null>(1);
    const [search, setSearch] = useState("");

    const filteredFaqs = faqs.filter(f =>
        f.question.toLowerCase().includes(search.toLowerCase()) ||
        f.answer.toLowerCase().includes(search.toLowerCase())
    );

    const categories = ["all", "general", "booking", "membership", "services"];
    const [activeCategory, setActiveCategory] = useState("all");

    const finalFaqs = activeCategory === "all"
        ? filteredFaqs
        : filteredFaqs.filter(f => f.category === activeCategory);

    return (
        <div className="flex flex-col w-full pb-20">
            {/* Page Header */}
            <section className="bg-primary-charcoal py-20 relative overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1590159763121-7c9fd312190e?w=1600&q=80')] bg-cover bg-center" />
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="font-fraunces text-5xl md:text-6xl font-bold text-white mb-6">
                            Help <span className="text-primary-gold">Center</span>
                        </h1>
                        <p className="text-secondary-rose/60 text-lg max-w-2xl mx-auto">
                            Everything you need to know about our services, booking process,
                            and memberships. Can&apos;t find an answer? We&apos;re here to help.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Search & Categories */}
            <section className="py-12 bg-primary-ivory border-b border-secondary-pearl sticky top-20 z-30">
                <div className="max-w-7xl mx-auto px-6 space-y-8">
                    <div className="max-w-xl mx-auto relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-slate w-5 h-5 pointer-events-none" />
                        <Input
                            className="pl-12 h-14 bg-white border-secondary-pearl focus-visible:ring-primary-gold"
                            placeholder="Search your question..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-2">
                        {categories.map((c) => (
                            <button
                                key={c}
                                onClick={() => setActiveCategory(c)}
                                className={cn(
                                    "px-6 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all duration-300",
                                    activeCategory === c
                                        ? "bg-primary-charcoal text-white"
                                        : "bg-white text-secondary-slate border border-secondary-pearl hover:border-primary-gold"
                                )}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Accordion */}
            <section className="py-20 bg-primary-white min-h-[40vh]">
                <div className="max-w-3xl mx-auto px-6">
                    {finalFaqs.length > 0 ? (
                        <div className="space-y-4">
                            {finalFaqs.map((faq, idx) => (
                                <motion.div
                                    key={faq.id}
                                    initial="initial"
                                    whileInView="animate"
                                    viewport={viewportOptions}
                                    variants={fadeInUp}
                                    transition={{ delay: idx * 0.05 }}
                                    className={cn(
                                        "border border-secondary-pearl rounded-2xl overflow-hidden transition-all duration-300",
                                        openId === faq.id ? "bg-white shadow-xl border-primary-gold/30 scale-[1.02]" : "bg-white/50 hover:bg-white"
                                    )}
                                >
                                    <button
                                        onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                                        className="w-full flex items-center justify-between p-7 text-left"
                                    >
                                        <span className="font-fraunces text-xl font-bold text-primary-charcoal">
                                            {faq.question}
                                        </span>
                                        <ChevronDown
                                            className={cn(
                                                "w-6 h-6 text-secondary-slate transition-transform duration-300",
                                                openId === faq.id ? "rotate-180 text-primary-gold" : ""
                                            )}
                                        />
                                    </button>

                                    <div
                                        className={cn(
                                            "overflow-hidden transition-all duration-400 ease-in-out",
                                            openId === faq.id ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                                        )}
                                    >
                                        <p className="px-7 pb-8 text-secondary-slate text-lg leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 space-y-4">
                            <div className="w-16 h-16 bg-primary-gold/10 rounded-full flex items-center justify-center mx-auto">
                                <Search className="w-8 h-8 text-primary-gold" />
                            </div>
                            <h3 className="font-fraunces text-2xl font-bold text-primary-charcoal">No results found</h3>
                            <p className="text-secondary-slate">Try adjusting your search or category filter.</p>
                            <Button variant="outline" onClick={() => { setSearch(""); setActiveCategory("all") }}>
                                Clear all filters
                            </Button>
                        </div>
                    )}
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-24 bg-primary-charcoal text-white text-center relative overflow-hidden">
                <div className="max-w-4xl mx-auto px-6 relative z-10 space-y-8">
                    <div className="w-20 h-20 bg-primary-gold/20 rounded-full flex items-center justify-center mx-auto mb-8">
                        <MessageCircle className="w-10 h-10 text-primary-gold" />
                    </div>
                    <h2 className="font-fraunces text-4xl md:text-5xl font-bold">Still have questions?</h2>
                    <p className="text-secondary-rose/60 text-lg">
                        Our support team is always available to help you with your booking or service inquiries.
                    </p>
                    <div className="flex flex-wrap justify-center gap-6 pt-4">
                        <Button size="lg" asChild className="h-16 px-12 text-lg">
                            <Link href="/contact">Contact Support</Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
