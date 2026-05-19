"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { galleryImages, galleryFilters, GalleryImage } from "@/lib/data/gallery";
import { cn } from "@/lib/utils";
import { fadeInUp, staggerContainer, viewportOptions } from "@/lib/animations";
import Lightbox from "@/components/gallery/Lightbox";
import InstagramFeed from "@/components/sections/InstagramFeed";
import { 
    Scissors, 
    Sparkles, 
    Palette, 
    Crown, 
    Zap, 
    Wand2, 
    Search, 
    Filter, 
    ChevronRight, 
    Eye, 
    Bot,
    Gem,
    TrendingUp,
    Layers,
    Camera
} from "lucide-react";
import { Button } from "@/components/ui/Button";

// Category metadata system for cinematic visual cues
const CATEGORY_META: Record<string, { color: string; light: string; icon: any }> = {
    "color": { color: "#C9A962", light: "rgba(201,169,98,0.15)", icon: Palette },
    "haircut": { color: "#EC4899", light: "rgba(236,72,153,0.15)", icon: Scissors },
    "bridal": { color: "#F43F5E", light: "rgba(244,63,94,0.15)", icon: Crown },
    "mens": { color: "#6B7280", light: "rgba(107,114,128,0.15)", icon: Zap },
    "treatment": { color: "#6366F1", light: "rgba(99,102,241,0.15)", icon: Sparkles },
};

export default function GalleryPage() {
    const [filter, setFilter] = useState("all");
    const [selectedImage, setSelectedImage] = useState<{ image: GalleryImage; index: number } | null>(null);
    const [hoveredId, setHoveredId] = useState<number | null>(null);
    const [showAIStudio, setShowAIStudio] = useState(false);

    const filteredImages = filter === "all"
        ? galleryImages
        : galleryImages.filter(img => img.category === filter);

    const handleNext = () => {
        if (!selectedImage) return;
        const nextIndex = (selectedImage.index + 1) % filteredImages.length;
        setSelectedImage({ image: filteredImages[nextIndex], index: nextIndex });
    };

    const handlePrev = () => {
        if (!selectedImage) return;
        const prevIndex = (selectedImage.index - 1 + filteredImages.length) % filteredImages.length;
        setSelectedImage({ image: filteredImages[prevIndex], index: prevIndex });
    };

    return (
        <div className="flex flex-col w-full min-h-screen bg-[#0A0A0B]">
            {/* ✦ Cinematic Hero — Elite Portfolio Specification */}
            <section className="relative pt-32 pb-24 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary-gold/10 via-transparent to-transparent opacity-50" />
                    <div className="absolute top-[-15%] right-[-10%] w-[50%] aspect-square rounded-full bg-primary-gold/5 blur-[120px] animate-pulse" />
                    <div className="absolute bottom-[-20%] left-[-5%] w-[40%] aspect-square rounded-full bg-purple-500/5 blur-[100px] animate-pulse" style={{ animationDelay: "2s" }} />
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
                        className="space-y-8"
                    >
                        <div className="flex items-center justify-center gap-3">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-gold/10 text-primary-gold border border-primary-gold/20">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Master Portfolio</span>
                            </div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/30">
                                <Camera className="w-3.5 h-3.5" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.3em]">{galleryImages.length} Rituals</span>
                            </div>
                        </div>

                        <h1 className="font-fraunces text-7xl md:text-9xl font-bold text-white tracking-tight leading-[0.85]">
                            Transform <br />
                            <span className="text-primary-gold italic">Gallery</span>
                        </h1>
                        <p className="text-white/40 text-lg max-w-2xl mx-auto font-light leading-relaxed italic">
                            &ldquo;A curated collective of bespoke transformations, where technical precision meets high-fashion artistry.&rdquo;
                        </p>

                        <div className="flex items-center justify-center gap-8 pt-4">
                            <div className="flex items-center gap-2 text-white/30">
                                <TrendingUp className="w-4 h-4 text-primary-gold" />
                                <span className="text-[10px] uppercase tracking-[0.2em] font-bold">100% Real Results</span>
                            </div>
                            <div className="w-px h-4 bg-white/10" />
                            <div className="flex items-center gap-2 text-white/30">
                                <Gem className="w-4 h-4 text-primary-gold" />
                                <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Elite Techniques</span>
                            </div>
                        </div>

                        {/* MCP AI Studio Toggle */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="pt-4"
                        >
                            <button
                                onClick={() => setShowAIStudio(!showAIStudio)}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary-gold/20 to-purple-500/20 border border-primary-gold/30 text-primary-gold hover:bg-primary-gold/30 transition-all text-[10px] font-black uppercase tracking-[0.2em] shadow-luxury"
                            >
                                <Bot className="w-4 h-4" />
                                {showAIStudio ? 'Hide AI Visualization' : 'AI Visualization Studio'}
                            </button>
                        </motion.div>
                    </motion.div>

                    {/* AI Visualization Panel */}
                    <AnimatePresence>
                        {showAIStudio && (
                            <motion.div
                                initial={{ opacity: 0, y: -20, height: 0 }}
                                animate={{ opacity: 1, y: 0, height: 'auto' }}
                                exit={{ opacity: 0, y: -20, height: 0 }}
                                className="overflow-hidden mt-12"
                            >
                                <div className="max-w-3xl mx-auto p-10 rounded-[3rem] elite-glass border border-white/10">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-12 h-12 rounded-2xl bg-primary-gold/20 flex items-center justify-center">
                                            <Bot className="w-6 h-6 text-primary-gold" />
                                        </div>
                                        <div className="text-left">
                                            <h3 className="text-xl font-bold text-white">Neural Transformation Suite</h3>
                                            <p className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-mono">mcp-vision · deep-aesthetic · ritual-ai</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                                        {[
                                            { icon: Palette, label: "Chromatic Swap", desc: "Change hair color in realtime", mcp: "supaui" },
                                            { icon: Scissors, label: "Structural Cut", desc: "Preview length & silhouette", mcp: "ritual-gen" },
                                            { icon: Wand2, label: "Complete Identity", desc: "Full-spectrum AI restyle", mcp: "vision-mcp" }
                                        ].map((tool) => (
                                            <div key={tool.label} className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-primary-gold/30 transition-all group cursor-pointer">
                                                <div className="w-10 h-10 rounded-xl bg-primary-gold/10 flex items-center justify-center mb-4 group-hover:bg-primary-gold group-hover:text-primary-charcoal transition-all">
                                                    <tool.icon className="w-5 h-5" />
                                                </div>
                                                <p className="text-sm font-bold text-white mb-1">{tool.label}</p>
                                                <p className="text-[10px] text-white/30 leading-relaxed mb-3">{tool.desc}</p>
                                                <span className="text-[8px] text-primary-gold/40 font-mono tracking-widest">{tool.mcp} → Active</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>

            {/* ✦ Glassmorphic Filter Bar */}
            <section className="sticky top-20 z-40 bg-[#0A0A0B]/80 backdrop-blur-3xl border-y border-white/5 py-6">
                <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-center gap-4">
                    {galleryFilters.map((f) => {
                        const meta = CATEGORY_META[f.value];
                        const isActive = filter === f.value;
                        return (
                            <button
                                key={f.value}
                                onClick={() => setFilter(f.value)}
                                className={cn(
                                    "px-6 py-3 rounded-full text-[10px] font-black tracking-[0.2em] uppercase transition-all duration-500 border relative overflow-hidden group",
                                    isActive
                                        ? "bg-primary-gold border-primary-gold text-primary-charcoal shadow-luxury"
                                        : "bg-white/[0.03] border-white/10 text-white/40 hover:border-primary-gold/30 hover:text-white"
                                )}
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    {meta && <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: meta.color }} />}
                                    {f.label}
                                    {isActive && <span className="opacity-40 ml-1">({filteredImages.length})</span>}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </section>

            {/* ✦ Elite Gallery Grid */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredImages.map((image, index) => {
                                const meta = CATEGORY_META[image.category];
                                const isHovered = hoveredId === image.id;
                                
                                return (
                                    <motion.div
                                        key={image.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ delay: index * 0.05, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                                        onMouseEnter={() => setHoveredId(image.id)}
                                        onMouseLeave={() => setHoveredId(null)}
                                        onClick={() => setSelectedImage({ image, index })}
                                        className="group relative aspect-[4/5] rounded-[2.5rem] overflow-hidden cursor-pointer shadow-2xl bg-white/[0.02] border border-white/5"
                                    >
                                        <Image
                                            src={image.src}
                                            alt={image.alt}
                                            fill
                                            className={cn(
                                                "object-cover transition-all duration-1000 ease-[0.23, 1, 0.32, 1]",
                                                isHovered ? "scale-110 brightness-110" : "scale-100 brightness-[0.85]"
                                            )}
                                        />
                                        
                                        {/* Dynamic Glass Overlay */}
                                        <div className={cn(
                                            "absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent transition-all duration-700",
                                            isHovered ? "opacity-90" : "opacity-40"
                                        )} />

                                        {/* Content - Telemetry Style */}
                                        <div className="absolute inset-0 p-10 flex flex-col justify-end">
                                            <div className={cn(
                                                "transition-all duration-700 flex flex-col gap-2",
                                                isHovered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                                            )}>
                                                <div className="flex items-center gap-3">
                                                    <span className="w-6 h-[1px] bg-primary-gold" />
                                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary-gold">
                                                        {image.category}
                                                    </span>
                                                </div>
                                                <h3 className="font-fraunces text-3xl font-bold text-white leading-tight">
                                                    {image.alt}
                                                </h3>
                                                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/10">
                                                    <div className="flex items-center gap-2 text-white/40">
                                                        <Gem className="w-3.5 h-3.5 text-primary-gold" />
                                                        <span className="text-[9px] font-bold uppercase tracking-widest">Master Execution</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-white/40">
                                                        <Eye className="w-3.5 h-3.5" />
                                                        <span className="text-[9px] font-bold uppercase tracking-widest text-primary-gold">AI Verified</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Status Badges */}
                                        <div className="absolute top-8 left-8 right-8 flex justify-between items-start pointer-events-none">
                                            {image.before && (
                                                <motion.div
                                                    animate={{ opacity: isHovered ? 0 : 1 }}
                                                    className="bg-primary-gold text-primary-charcoal text-[9px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-xl shadow-luxury flex items-center gap-2"
                                                >
                                                    <Layers className="w-3 h-3" />
                                                    Before & After
                                                </motion.div>
                                            )}
                                            <div className={cn(
                                                "w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center transition-all duration-700",
                                                isHovered ? "opacity-100 scale-100" : "opacity-0 scale-50"
                                            )}>
                                                <Search className="w-5 h-5 text-white" />
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </section>

            {/* ✦ Lightbox Overlay */}
            <AnimatePresence>
                {selectedImage && (
                    <Lightbox
                        image={{
                            src: selectedImage.image.src,
                            title: selectedImage.image.alt,
                            category: selectedImage.image.category,
                        }}
                        onClose={() => setSelectedImage(null)}
                        onNext={handleNext}
                        onPrev={handlePrev}
                    />
                )}
            </AnimatePresence>

            {/* ✦ Instagram Feed */}
            <InstagramFeed />

            {/* ✦ Elite Luxury CTA */}
            <section className="py-32 relative overflow-hidden bg-primary-gold group">
                <div className="absolute inset-0 bg-[#0A0A0B] translate-y-full group-hover:translate-y-0 transition-transform duration-1000 ease-in-out" />
                <div className="max-w-4xl mx-auto px-6 text-center space-y-12 relative z-10 transition-colors duration-1000 group-hover:text-white text-primary-charcoal">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <div className="flex items-center justify-center gap-4 mb-4">
                            <div className="w-12 h-[1px] bg-current" />
                            <span className="text-[10px] font-black uppercase tracking-[0.5em]">The Next Chapter</span>
                            <div className="w-12 h-[1px] bg-current" />
                        </div>
                        <h2 className="font-fraunces text-6xl md:text-8xl font-bold leading-none">
                            Inspired by <br />
                            <span className="italic font-light">the results?</span>
                        </h2>
                        <p className="text-xl max-w-2xl mx-auto font-light leading-relaxed opacity-80">
                            Every masterpiece begins with a single consultation. Orchestrate your transformation today.
                        </p>
                        <div className="flex flex-wrap justify-center gap-6 pt-6">
                            <Button size="lg" asChild className="h-16 px-12 bg-primary-charcoal text-white hover:bg-white hover:text-primary-charcoal border-none rounded-2xl tracking-[0.3em] uppercase text-[11px] font-black group-hover:bg-primary-gold group-hover:text-primary-charcoal shadow-2xl transition-all duration-500">
                                <Link href="/book">Initiate Booking</Link>
                            </Button>
                            <Button size="lg" asChild variant="outline" className="h-16 px-12 border-current hover:bg-current hover:text-primary-gold rounded-2xl tracking-[0.3em] uppercase text-[11px] font-black transition-all duration-500">
                                <Link href="/services">Explore Rituals</Link>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
