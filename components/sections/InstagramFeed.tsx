"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play, ExternalLink } from "lucide-react";

interface InstagramPost {
    id: string;
    caption: string;
    media_url: string;
    permalink: string;
    media_type: string;
    is_reel?: boolean;
    is_featured?: boolean;
}

export default function InstagramFeed() {
    const [posts, setPosts] = useState<InstagramPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchInstagramPosts() {
            try {
                const response = await fetch('/api/instagram');
                const data = await response.json();
                if (data.data && data.data.length > 0) {
                    setPosts(data.data);
                }
            } catch (error) {
                console.error('Failed to fetch Instagram posts:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchInstagramPosts();
    }, []);

    if (loading) {
        return (
            <section className="py-20 bg-primary-charcoal">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="inline-block w-8 h-8 border-4 border-primary-gold border-t-transparent rounded-full animate-spin" />
                </div>
            </section>
        );
    }

    if (posts.length === 0) return null;

    // Featured = first post with is_featured=true, or just the first post. The rest are smaller.
    const featuredIndex = posts.findIndex(p => p.is_featured);
    const featured = featuredIndex !== -1 ? posts[featuredIndex] : posts[0];
    const smallPosts = posts.filter(p => p.id !== featured.id).slice(0, 5);

    return (
        <section className="py-20 bg-primary-charcoal relative overflow-hidden">
            {/* Subtle gold glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary-gold/5 blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* ── SOCIAL PROOF HEADER ─────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6"
                >
                    <div className="space-y-4 max-w-2xl">
                        <span className="text-primary-gold font-bold tracking-[0.25em] uppercase text-xs block">
                            Social Proof
                        </span>
                        <p className="font-fraunces text-3xl md:text-4xl font-bold text-white leading-snug">
                            Real clients. Real results.{" "}
                            <span className="text-primary-gold">Real vibes.</span>
                        </p>
                        <p className="text-white/40 text-sm tracking-wide">
                            Follow us{" "}
                            <a
                                href="https://www.instagram.com/thehideawaydubai/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary-gold hover:underline"
                            >
                                @thehideawaydubai
                            </a>{" "}
                            for your daily dose of hair rituals.
                        </p>
                    </div>
                    <a
                        href="https://www.instagram.com/thehideawaydubai/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-7 py-3.5 border border-primary-gold text-primary-gold font-bold rounded-full text-sm uppercase tracking-widest hover:bg-primary-gold hover:text-primary-charcoal transition-all duration-300 whitespace-nowrap self-end md:self-auto"
                    >
                        Follow the Grid →
                    </a>
                </motion.div>

                {/* ── BENTO GRID ──────────────────────────────── */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">

                    {/* Featured post — large, spans 2 cols × 2 rows */}
                    {featured && (
                        <motion.a
                            href={featured.permalink}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, scale: 0.97 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="group relative col-span-2 row-span-2 rounded-2xl overflow-hidden shadow-xl border border-white/5 aspect-square"
                        >
                            <Image
                                src={featured.media_url}
                                alt={featured.caption || "Instagram post"}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                            {featured.is_reel && (
                                <div className="absolute top-3 right-3 z-20 bg-black/60 backdrop-blur-sm rounded-full p-2">
                                    <Play className="w-4 h-4 text-white fill-white" />
                                </div>
                            )}
                            {/* Caption overlay — always slightly visible, full on hover */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                                <p className="text-white/70 text-xs mb-3 line-clamp-2 group-hover:text-white transition-colors duration-300">
                                    {featured.caption}
                                </p>
                                <span className="inline-flex items-center gap-1.5 text-primary-gold text-[11px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <ExternalLink className="w-3 h-3" /> View Post
                                </span>
                            </div>
                        </motion.a>
                    )}

                    {/* Smaller posts */}
                    {smallPosts.map((post, index) => (
                        <motion.a
                            key={post.id}
                            href={post.permalink}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.07, duration: 0.4 }}
                            className="group relative rounded-2xl overflow-hidden shadow-md border border-white/5 aspect-square hover:border-primary-gold/30 transition-all duration-300"
                        >
                            <Image
                                src={post.media_url}
                                alt={post.caption || "Instagram post"}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                                sizes="(max-width: 768px) 50vw, 25vw"
                            />
                            {post.is_reel && (
                                <div className="absolute top-2 right-2 z-20 bg-black/60 backdrop-blur-sm rounded-full p-1.5">
                                    <Play className="w-3 h-3 text-white fill-white" />
                                </div>
                            )}
                            {/* Caption overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-400 flex flex-col justify-end p-4">
                                <p className="text-white text-[11px] line-clamp-2 mb-2 leading-relaxed">
                                    {post.caption}
                                </p>
                                <span className="text-primary-gold text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                                    <ExternalLink className="w-2.5 h-2.5" /> View Post
                                </span>
                            </div>
                        </motion.a>
                    ))}
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mt-10"
                >
                    <a
                        href="https://www.instagram.com/thehideawaydubai/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/40 text-sm hover:text-primary-gold transition-colors duration-300 tracking-widest uppercase"
                    >
                        See all posts on Instagram →
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
