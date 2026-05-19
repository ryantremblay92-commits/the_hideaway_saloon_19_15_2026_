'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Clock, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Suggestion } from '@/lib/actions/suggestions';

export function ServiceSuggestions({ suggestions }: { suggestions: Suggestion[] }) {
    if (!suggestions || suggestions.length === 0) return null;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-primary-gold/10 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-primary-gold" />
                    </div>
                    <h4 className="font-bold text-white uppercase tracking-widest text-xs">Curated For You</h4>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suggestions.map((item, i) => (
                    <motion.div
                        key={item.service.slug}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="group relative overflow-hidden rounded-[2rem] bg-white/[0.03] border border-white/10 hover:border-primary-gold/30 transition-all p-1"
                    >
                        {/* Background subtle image */}
                        <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Image
                                src={item.service.image}
                                alt=""
                                fill
                                className="object-cover scale-110 group-hover:scale-100 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-transparent to-transparent" />
                        </div>

                        <div className="relative p-6 space-y-4">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <h5 className="font-fraunces text-xl font-bold text-white group-hover:text-primary-gold transition-colors">
                                        {item.service.title}
                                    </h5>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-gold">
                                            ₹{item.service.startingPrice}+
                                        </span>
                                        <div className="flex items-center gap-1 text-[10px] text-white/40 uppercase tracking-widest">
                                            <Clock className="w-3 h-3" /> {item.service.duration}
                                        </div>
                                    </div>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-primary-gold group-hover:bg-primary-gold group-hover:text-primary-charcoal transition-all">
                                    <Star className="w-4 h-4 fill-current" />
                                </div>
                            </div>

                            <p className="text-white/60 text-sm leading-relaxed line-clamp-2 italic">
                                &ldquo;{item.reason}&rdquo;
                            </p>

                            <Link
                                href={`/booking?service=${item.service.slug}`}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold uppercase tracking-widest hover:bg-primary-gold hover:text-primary-charcoal hover:border-primary-gold transition-all group/btn w-full justify-center"
                            >
                                Experience This Ritual
                                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
