"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import SectionHeader from "@/components/ui/SectionHeader";
import { fadeInUp, viewportOptions } from "@/lib/animations";
import { Star, Quote, ExternalLink } from "lucide-react";

interface GoogleReview {
    id: string;
    reviewer_name: string;
    rating: number;
    review_text: string;
    review_date: string;
    profile_picture_url: string;
}

export default function GoogleReviews() {
    const [reviews, setReviews] = useState<GoogleReview[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        async function fetchReviews() {
            try {
                const { data, error } = await supabase
                    .from("google_reviews")
                    .select("*")
                    .order("created_at", { ascending: false });

                if (error) throw error;
                if (data) setReviews(data);
            } catch (err) {
                console.error("Error fetching google reviews:", err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchReviews();
    }, []);

    if (isLoading) return null;

    return (
        <section className="py-24 bg-primary-charcoal text-white overflow-hidden relative">
            {/* Background patterns */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#fff_1px,transparent_1px)] [background-size:40px_40px]" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <SectionHeader
                    subtitle="Real Experiences"
                    title="Verified Google Reviews"
                    align="center"
                    light
                />

                {/* Google Summary Badge - Dark Mode Styled */}
                <div className="flex flex-col items-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={viewportOptions}
                        className="bg-white/5 backdrop-blur-md border border-white/10 px-10 py-6 rounded-[3rem] shadow-2xl flex items-center gap-6"
                    >
                        <div className="flex flex-col items-center">
                            <div className="flex items-center gap-1 text-primary-gold mb-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-current" />
                                ))}
                            </div>
                            <span className="text-xs text-white/40 uppercase tracking-widest font-bold">Google Rating</span>
                        </div>

                        <div className="h-10 w-px bg-white/10" />

                        <div className="flex items-center gap-3">
                            <span className="font-fraunces font-bold text-4xl text-primary-gold">4.8</span>
                            <div className="flex flex-col">
                                <span className="text-sm text-white/80 font-medium italic">"Excellent"</span>
                                <span className="text-[10px] text-white/40 uppercase tracking-tighter">Based on 100+ Reviews</span>
                            </div>
                        </div>

                        <div className="h-10 w-px bg-white/10" />

                        <Image
                            src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png"
                            alt="Google"
                            width={70}
                            height={24}
                            className="brightness-0 invert opacity-80"
                        />
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {reviews.map((review, idx) => (
                        <motion.div
                            key={review.id}
                            initial="initial"
                            whileInView="animate"
                            viewport={viewportOptions}
                            variants={fadeInUp}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white/5 backdrop-blur-sm border border-white/10 p-10 rounded-[2.5rem] relative group hover:bg-white/10 transition-all duration-500 h-full flex flex-col"
                        >
                            <Quote className="absolute top-8 right-8 w-12 h-12 text-primary-gold/10 group-hover:text-primary-gold/20 transition-all duration-500 transform group-hover:-translate-y-2" />

                            <div className="flex items-center gap-1 text-primary-gold mb-6">
                                {[...Array(review.rating)].map((_, i) => (
                                    <Star key={i} className="size-4 fill-current" />
                                ))}
                            </div>

                            <p className="text-white/90 text-lg font-medium italic leading-relaxed mb-auto pb-10">
                                &quot;{review.review_text}&quot;
                            </p>

                            <div className="flex items-center justify-between pt-8 border-t border-white/10 mt-auto">
                                <div className="flex items-center gap-4">
                                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary-gold/30 shadow-lg group-hover:border-primary-gold transition-colors duration-500">
                                        {review.profile_picture_url ? (
                                            <Image
                                                src={review.profile_picture_url}
                                                alt={review.reviewer_name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-primary-gold/20 flex items-center justify-center text-primary-gold font-bold">
                                                {review.reviewer_name[0]}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-fraunces font-bold text-white text-lg leading-none mb-1 group-hover:text-primary-gold transition-colors">
                                            {review.reviewer_name}
                                        </h4>
                                        <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest">
                                            {review.review_date}
                                        </span>
                                    </div>
                                </div>
                                <div className="bg-white/10 p-2.5 rounded-full backdrop-blur-md group-hover:bg-primary-gold transition-all duration-500">
                                    <Image
                                        src="https://www.google.com/favicon.ico"
                                        alt="Google"
                                        width={16}
                                        height={16}
                                        className="brightness-0 invert group-hover:invert-0"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-20 text-center">
                    <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href="https://www.google.com/maps/search/?api=1&query=The+Hideaway+Jumeirah+Dubai"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 px-10 py-5 bg-primary-gold text-primary-charcoal rounded-full font-bold hover:bg-white transition-all shadow-[0_10px_30px_rgba(212,175,55,0.3)] group"
                    >
                        <span>See All Google Reviews</span>
                        <ExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </motion.a>
                </div>
            </div>
        </section>
    );
}
