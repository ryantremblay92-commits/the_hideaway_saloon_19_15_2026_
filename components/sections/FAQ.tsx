"use client";

import { motion } from "framer-motion";
import { faqs } from "@/lib/data/faqs";
import SectionHeader from "@/components/ui/SectionHeader";
import { fadeInUp, viewportOptions } from "@/lib/animations";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FAQ() {
    const [openId, setOpenId] = useState<number | null>(1);
    const homeFaqs = faqs.slice(0, 5);

    return (
        <section className="py-24 bg-primary-ivory">
            <div className="max-w-4xl mx-auto px-6">
                <SectionHeader
                    subtitle="Q&A"
                    title="Common questions"
                    align="center"
                />

                <div className="space-y-4">
                    {homeFaqs.map((faq, idx) => (
                        <motion.div
                            key={faq.id}
                            initial="initial"
                            whileInView="animate"
                            viewport={viewportOptions}
                            variants={fadeInUp}
                            transition={{ delay: idx * 0.1 }}
                            className={cn(
                                "border border-secondary-pearl rounded-2xl overflow-hidden transition-all duration-300",
                                openId === faq.id ? "bg-white shadow-md border-primary-gold/30" : "bg-white/50 hover:bg-white"
                            )}
                        >
                            <button
                                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                                className="w-full flex items-center justify-between p-6 text-left"
                            >
                                <span className="font-fraunces text-lg font-bold text-primary-charcoal">
                                    {faq.question}
                                </span>
                                <ChevronDown
                                    className={cn(
                                        "w-5 h-5 text-secondary-slate transition-transform duration-300",
                                        openId === faq.id ? "rotate-180 text-primary-gold" : ""
                                    )}
                                />
                            </button>

                            <div
                                className={cn(
                                    "overflow-hidden transition-all duration-300 ease-in-out",
                                    openId === faq.id ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                                )}
                            >
                                <p className="px-6 pb-6 text-secondary-slate leading-relaxed">
                                    {faq.answer}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
