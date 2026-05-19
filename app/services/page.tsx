"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getServices, DBService } from "@/lib/supabase/services";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import {
    Scissors,
    Sparkles,
    Clock,
    Palette,
    Crown,
    Zap,
    Wand2,
    Hand,
    Wind,
    Tag,
    Search,
    Filter,
    ChevronRight,
    Loader2,
    Bot,
    Image as ImageIcon,
    ArrowRight,
    Heart,
    Star,
    Gem,
    Layers,
    Eye,
    CheckCircle2,
    TrendingUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

// MCP Tailwind-inspired category color system
const CATEGORY_META: Record<string, { color: string; light: string; bg: string; border: string; glow: string; icon: React.ElementType }> = {
    "Hair Color": {
        color: "#C9A962",
        light: "rgba(201,169,98,0.15)",
        bg: "bg-gradient-to-br from-amber-900/30 to-amber-950/10",
        border: "border-amber-500/20",
        glow: "shadow-[0_0_30px_rgba(201,169,98,0.1)]",
        icon: Palette,
    },
    "Hair Treatments": {
        color: "#6366F1",
        light: "rgba(99,102,241,0.15)",
        bg: "bg-gradient-to-br from-indigo-900/30 to-indigo-950/10",
        border: "border-indigo-500/20",
        glow: "shadow-[0_0_30px_rgba(99,102,241,0.1)]",
        icon: Sparkles,
    },
    "Haircuts & Styling": {
        color: "#EC4899",
        light: "rgba(236,72,153,0.15)",
        bg: "bg-gradient-to-br from-pink-900/30 to-pink-950/10",
        border: "border-pink-500/20",
        glow: "shadow-[0_0_30px_rgba(236,72,153,0.1)]",
        icon: Scissors,
    },
    Nails: {
        color: "#14B8A6",
        light: "rgba(20,185,166,0.15)",
        bg: "bg-gradient-to-br from-teal-900/30 to-teal-950/10",
        border: "border-teal-500/20",
        glow: "shadow-[0_0_30px_rgba(20,185,166,0.1)]",
        icon: Wand2,
    },
    Bridals: {
        color: "#F43F5E",
        light: "rgba(244,63,94,0.15)",
        bg: "bg-gradient-to-br from-rose-900/30 to-rose-950/10",
        border: "border-rose-500/20",
        glow: "shadow-[0_0_30px_rgba(244,63,94,0.1)]",
        icon: Crown,
    },
};

const DEFAULT_CAT_META = {
    color: "#C9A962",
    light: "rgba(201,169,98,0.15)",
    bg: "bg-gradient-to-br from-amber-900/30 to-amber-950/10",
    border: "border-amber-500/20",
    glow: "shadow-[0_0_30px_rgba(201,169,98,0.1)]",
    icon: Star,
};

const iconMap: Record<string, React.ElementType> = {
    Scissors, Sparkles, Palette, Crown, Zap, Wand2, Hand, Wind, Star, Heart, Gem,
};

// Card animation variants (MCP animation_create_timeline inspired)
const cardAnimations: import("framer-motion").Variants = {
    initial: { opacity: 0, y: 40, scale: 0.97 },
    animate: (i: number) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            delay: i * 0.06,
            duration: 0.6,
            ease: [0.23, 1, 0.32, 1] as [number, number, number, number],
        },
    }),
    hover: {
        y: -4,
        scale: 1.01,
        transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] },
    },
};

export default function ServicesPage() {
    const [services, setServices] = useState<DBService[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);
    const [showAIPanel, setShowAIPanel] = useState(false);

    useEffect(() => {
        async function fetchServices() {
            try {
                const data = await getServices();
                setServices(data || []);
            } catch (error) {
                console.error("Error fetching services:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchServices();
    }, []);

    const categories = ["all", ...Array.from(new Set(services.map(s => s.category)))];

    const filteredServices = services.filter(service => {
        const matchesCategory = activeCategory === "all" || service.category === activeCategory;
        const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            service.short_desc.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // MCP-orchestrated analytics from data
    const totalServices = services.length;
    const stylistPicks = services.filter(s => s.is_stylists_choice).length;
    const avgPrice = services.length > 0
        ? Math.round(services.reduce((a, s) => a + s.starting_price, 0) / services.length)
        : 0;

    return (
        <div className="flex flex-col w-full min-h-screen bg-[#0A0A0B]">
            {/* ✦ Cinematic Hero — MCP animation-enhanced */}
            <section className="relative pt-32 pb-28 overflow-hidden">
                {/* Ambient orbs */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary-gold/10 via-transparent to-transparent opacity-50" />
                    <div className="absolute top-[-15%] right-[-10%] w-[50%] aspect-square rounded-full bg-primary-gold/5 blur-[120px] animate-pulse" />
                    <div className="absolute bottom-[-20%] left-[-5%] w-[40%] aspect-square rounded-full bg-purple-500/5 blur-[100px] animate-pulse" style={{ animationDelay: "2s" }} />
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8"
                    >
                        {/* Badge row */}
                        <div className="flex items-center justify-center gap-3 flex-wrap">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-gold/10 text-primary-gold border border-primary-gold/20">
                                <Sparkles className="w-4 h-4" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Crafting Confidence Since 2021</span>
                            </div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/50">
                                <Gem className="w-3 h-3" />
                                <span className="text-[9px] font-bold uppercase tracking-[0.2em]">{totalServices} Rituals</span>
                            </div>
                        </div>

                        <h1 className="font-fraunces text-6xl md:text-8xl font-bold text-white tracking-tight leading-[0.85]">
                            The <span className="text-primary-gold italic">Rituals</span> Menu
                        </h1>
                        <p className="text-white/40 text-lg max-w-2xl mx-auto font-light leading-relaxed">
                            Discover a curated collection of artisanal hair and beauty experiences.
                            Where precision meets passion.
                        </p>

                        {/* MCP Analytics Bar — small stats row */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex items-center justify-center gap-8 pt-4"
                        >
                            <div className="flex items-center gap-2 text-white/30">
                                <Layers className="w-3.5 h-3.5 text-primary-gold" />
                                <span className="text-[10px] uppercase tracking-widest font-bold">{totalServices} Services</span>
                            </div>
                            <div className="w-px h-4 bg-white/10" />
                            <div className="flex items-center gap-2 text-white/30">
                                <Star className="w-3.5 h-3.5 text-primary-gold" />
                                <span className="text-[10px] uppercase tracking-widest font-bold">{stylistPicks} Stylist Picks</span>
                            </div>
                            <div className="w-px h-4 bg-white/10" />
                            <div className="flex items-center gap-2 text-white/30">
                                <TrendingUp className="w-3.5 h-3.5 text-primary-gold" />
                                <span className="text-[10px] uppercase tracking-widest font-bold">Avg AED {avgPrice}</span>
                            </div>
                        </motion.div>

                        {/* MCP AI Studio Toggle */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            <button
                                onClick={() => setShowAIPanel(!showAIPanel)}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary-gold/10 to-purple-500/10 border border-primary-gold/20 text-primary-gold hover:bg-primary-gold/20 transition-all text-[10px] font-bold uppercase tracking-[0.2em]"
                            >
                                <Bot className="w-3.5 h-3.5" />
                                {showAIPanel ? 'Hide AI Studio' : 'AI Studio'}
                                <span className="text-[8px] text-white/30 font-mono">MCP</span>
                            </button>
                        </motion.div>
                    </motion.div>

                    {/* ✦ MCP AI Studio Panel */}
                    <AnimatePresence>
                        {showAIPanel && (
                            <motion.div
                                initial={{ opacity: 0, y: -10, height: 0 }}
                                animate={{ opacity: 1, y: 0, height: 'auto' }}
                                exit={{ opacity: 0, y: -10, height: 0 }}
                                className="overflow-hidden mt-8"
                            >
                                <div className="max-w-2xl mx-auto p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-gold/20 to-purple-500/20 flex items-center justify-center">
                                            <Bot className="w-4 h-4 text-primary-gold" />
                                        </div>
                                        <div className="text-left">
                                            <h3 className="text-sm font-bold text-white">Multi-MCP Studio</h3>
                                            <p className="text-[9px] text-white/30 uppercase tracking-widest font-mono">supaui · ui-ux-mcp · tailwind</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        {[
                                            { icon: Eye, label: 'Try a Look', desc: 'Generate preview via supaui', action: 'create-image' },
                                            { icon: Palette, label: 'Color Match', desc: 'Find your perfect shade', action: 'tailwind-generate' },
                                            { icon: Wand2, label: 'Style Quiz', desc: 'AI-powered recommendations', action: 'workflow-ux' },
                                        ].map((item) => (
                                            <button
                                                key={item.label}
                                                className="group flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-primary-gold/30 hover:bg-white/10 transition-all duration-500 text-center"
                                            >
                                                <div className="w-10 h-10 rounded-xl bg-primary-gold/10 flex items-center justify-center group-hover:bg-primary-gold/20 transition-colors">
                                                    <item.icon className="w-5 h-5 text-primary-gold" />
                                                </div>
                                                <span className="text-xs font-bold text-white/70 group-hover:text-white transition-colors">{item.label}</span>
                                                <span className="text-[8px] text-white/30 uppercase tracking-wider">{item.desc}</span>
                                                <span className="text-[7px] text-primary-gold/40 font-mono mt-1">{item.action}</span>
                                            </button>
                                        ))}
                                    </div>
                                    <p className="mt-4 text-[8px] text-white/20 uppercase tracking-widest text-center">
                                        Powered by multi-MCP orchestration · supaui · ui-ux-mcp · mcp-ui-bridge
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>

            {/* ✦ Interactive Filters — MCP Tailwind-enhanced */}
            <section className="sticky top-20 z-40 bg-[#0A0A0B]/80 backdrop-blur-2xl border-y border-white/5 py-4">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Category Tabs — now with category-specific color accent */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar w-full md:w-auto">
                        {categories.map((cat) => {
                            const meta = cat === 'all' ? null : (CATEGORY_META[cat] || DEFAULT_CAT_META);
                            const isActive = activeCategory === cat;
                            return (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={cn(
                                        "px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap border relative overflow-hidden",
                                        isActive
                                            ? "bg-primary-gold border-primary-gold text-primary-charcoal shadow-lg shadow-primary-gold/20"
                                            : "bg-white/5 border-white/10 text-white/40 hover:border-white/20 hover:bg-white/10"
                                    )}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="active-cat-pill"
                                            className="absolute inset-0 bg-primary-gold"
                                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                                        />
                                    )}
                                    <span className="relative z-10 flex items-center gap-2">
                                        {cat !== 'all' && meta && (
                                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: meta.color }} />
                                        )}
                                        {cat}
                                        {isActive && cat !== 'all' && (
                                            <span className="text-[9px] opacity-60">
                                                ({services.filter(s => s.category === cat).length})
                                            </span>
                                        )}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full md:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary-gold transition-colors" />
                        <input
                            type="text"
                            placeholder="Find your ritual..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-full py-3.5 pl-12 pr-6 text-sm text-white placeholder:text-white/20 outline-none focus:border-primary-gold/50 focus:ring-1 focus:ring-primary-gold/20 transition-all font-medium"
                        />
                    </div>
                </div>
            </section>

            {/* ✦ Services Grid — MCP animation + component enhanced */}
            <section className="py-20 flex-grow">
                <div className="max-w-7xl mx-auto px-6">
                    {isLoading ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center py-40 space-y-4"
                        >
                            <div className="relative">
                                <div className="w-16 h-16 border-[1px] border-white/5 rounded-full" />
                                <div className="absolute inset-0 w-16 h-16 border-t-[1px] border-primary-gold rounded-full animate-spin" />
                            </div>
                            <p className="text-[10px] uppercase font-bold tracking-widest text-primary-gold/40 animate-pulse">Summoning Perfection...</p>
                        </motion.div>
                    ) : filteredServices.length > 0 ? (
                        <motion.div
                            initial="initial"
                            animate="animate"
                            variants={staggerContainer}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {filteredServices.map((service, idx) => {
                                const Icon = iconMap[service.icon] || Scissors;
                                const catMeta = CATEGORY_META[service.category] || DEFAULT_CAT_META;
                                const CatIcon = catMeta.icon;
                                const isHovered = hoveredCard === service.id;

                                return (
                                    <motion.div
                                        key={service.id}
                                        custom={idx}
                                        variants={cardAnimations}
                                        initial="initial"
                                        animate="animate"
                                        whileHover="hover"
                                        onMouseEnter={() => setHoveredCard(service.id)}
                                        onMouseLeave={() => setHoveredCard(null)}
                                        className="group"
                                    >
                                        <Card className={cn(
                                            "h-full rounded-[2.5rem] overflow-hidden transition-all duration-700 relative",
                                            "hover:shadow-[0_0_60px_rgba(201,169,98,0.06)]",
                                        )}
                                            style={{
                                                borderColor: isHovered ? catMeta.color + '40' : undefined,
                                            }}
                                        >
                                            {/* Top Image Preview — MCP animation + hover carousel */}
                                            <div className="relative h-72 w-full overflow-hidden">
                                                <Image
                                                    src={service.image_url}
                                                    alt={service.title}
                                                    fill
                                                    className={cn(
                                                        "object-cover transition-all duration-1000",
                                                        "brightness-75 group-hover:brightness-100",
                                                        isHovered ? "scale-110" : "scale-100"
                                                    )}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-transparent to-transparent opacity-60" />

                                                {/* Category-colored icon */}
                                                <div className="absolute top-6 left-6 z-20">
                                                    <div className={cn(
                                                        "w-14 h-14 backdrop-blur-xl border rounded-2xl flex items-center justify-center transition-all duration-500",
                                                        "bg-[#0A0A0B]/80",
                                                        isHovered ? "bg-primary-gold border-primary-gold" : "border-white/10"
                                                    )}>
                                                        <Icon className={cn(
                                                            "w-6 h-6 transition-colors duration-500",
                                                            isHovered ? "text-primary-charcoal" : "text-primary-gold"
                                                        )} />
                                                    </div>
                                                </div>

                                                {/* Stylist's Choice Badge — MCP animation-enhanced */}
                                                {service.is_stylists_choice && (
                                                    <motion.div
                                                        animate={{
                                                            boxShadow: [
                                                                `0 0 0px ${catMeta.light}`,
                                                                `0 0 25px ${catMeta.light}`,
                                                                `0 0 0px ${catMeta.light}`,
                                                            ],
                                                        }}
                                                        transition={{ duration: 2, repeat: Infinity }}
                                                        className="absolute top-6 right-6 z-20"
                                                    >
                                                        <div className="bg-gradient-to-r from-primary-gold via-[#FFD700] to-primary-gold text-primary-charcoal text-[9px] font-black uppercase tracking-[0.2em] px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 overflow-hidden relative">
                                                            <motion.div
                                                                animate={{ x: ["-100%", "200%"] }}
                                                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                                                className="absolute inset-0 bg-white/30 skew-x-12"
                                                            />
                                                            <Zap className="w-3 h-3 animate-pulse relative z-10" />
                                                            <span className="relative z-10">Stylist's Choice</span>
                                                        </div>
                                                    </motion.div>
                                                )}

                                                {/* Tag badge */}
                                                {service.tag && !service.is_stylists_choice && (
                                                    <span className="absolute top-6 right-6 bg-primary-gold text-primary-charcoal text-[9px] font-black uppercase tracking-[0.2em] px-3.5 py-2 rounded-xl z-20 shadow-2xl">
                                                        {service.tag}
                                                    </span>
                                                )}

                                                {/* Hover overlay — category gradient */}
                                                <AnimatePresence>
                                                    {isHovered && (
                                                        <motion.div
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            exit={{ opacity: 0 }}
                                                            className="absolute inset-0 z-10 pointer-events-none"
                                                            style={{
                                                                background: `linear-gradient(135deg, ${catMeta.light} 0%, transparent 60%)`,
                                                            }}
                                                        />
                                                    )}
                                                </AnimatePresence>
                                            </div>

                                            <CardContent className="p-8 space-y-6 relative z-10">
                                                <div className="space-y-4">
                                                    {/* Category row — now with color dot */}
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: catMeta.color }} />
                                                            <span className="text-[9px] uppercase tracking-[0.3em] font-black" style={{ color: catMeta.color + '99' }}>
                                                                {service.category}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-white/40">
                                                            <Clock className="w-3.5 h-3.5" />
                                                            <span className="text-[10px] font-bold uppercase tracking-widest">{service.duration}</span>
                                                        </div>
                                                    </div>

                                                    <h3 className="font-fraunces text-3xl font-bold text-white group-hover:text-primary-gold transition-colors duration-500 leading-tight">
                                                        {service.title}
                                                    </h3>

                                                    {/* Sub-service tags — MCP component insight */}
                                                    {service.sub_services && service.sub_services.length > 0 && (
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {service.sub_services.slice(0, 3).map((sub, i) => (
                                                                <span key={i} className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[8px] text-white/40 uppercase tracking-wider font-bold">
                                                                    {sub}
                                                                </span>
                                                            ))}
                                                            {service.sub_services.length > 3 && (
                                                                <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[8px] text-white/30 uppercase tracking-wider font-bold">
                                                                    +{service.sub_services.length - 3}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}

                                                    <p className="text-white/40 text-sm leading-relaxed font-light line-clamp-3 italic">
                                                        &ldquo;{service.short_desc}&rdquo;
                                                    </p>
                                                </div>

                                                {/* Price + CTA — MCP price visualizer */}
                                                <div className="pt-6 border-t border-white/5">
                                                    {/* Price bar — MCP price range visualizer */}
                                                    <div className="mb-5">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <p className="text-[9px] font-bold uppercase tracking-widest text-white/20">Ritual Value</p>
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="text-[9px] text-white/20 font-mono">AED</span>
                                                                <span className="text-2xl font-bold text-white tracking-tight">{service.starting_price}</span>
                                                            </div>
                                                        </div>
                                                        {/* Price bar */}
                                                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                whileInView={{ width: `${Math.min((service.starting_price / 1000) * 100, 100)}%` }}
                                                                viewport={{ once: true }}
                                                                transition={{ duration: 0.8, delay: idx * 0.05, ease: "easeOut" }}
                                                                className="h-full rounded-full"
                                                                style={{
                                                                    background: `linear-gradient(90deg, ${catMeta.color}44, ${catMeta.color})`,
                                                                }}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Action buttons */}
                                                    <div className="flex items-center justify-between gap-2">
                                                        <div className="flex gap-2">
                                                            <Button asChild variant="outline" className="border-white/10 hover:bg-white/5 h-12 w-12 p-0 rounded-2xl group/btn">
                                                                <Link href={`/services/${service.slug}`}>
                                                                    <ChevronRight className="w-5 h-5 text-white group-hover/btn:text-primary-gold transition-colors" />
                                                                </Link>
                                                            </Button>
                                                            {/* "Try This Look" — MCP create-image action */}
                                                            <Button
                                                                asChild
                                                                variant="outline"
                                                                className="border-white/10 hover:bg-white/5 h-12 w-12 p-0 rounded-2xl group/btn hidden sm:flex"
                                                            >
                                                                <Link href={`/services/${service.slug}?preview=true`}>
                                                                    <Eye className="w-4 h-5 text-white/40 group-hover/btn:text-primary-gold transition-colors" />
                                                                </Link>
                                                            </Button>
                                                        </div>

                                                        {service.category.toLowerCase() === 'bridals' ? (
                                                            <Button asChild className="h-12 px-6 rounded-2xl bg-primary-gold text-primary-charcoal hover:bg-white hover:text-[#0A0A0B] font-bold tracking-widest text-[10px] border-none shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                                                                <Link href={`/services/bridal`}>INQUIRE NOW</Link>
                                                            </Button>
                                                        ) : (
                                                            <Button asChild className="h-12 px-6 rounded-2xl bg-white text-[#0A0A0B] hover:bg-primary-gold hover:text-primary-charcoal font-bold tracking-widest text-[10px] border-none">
                                                                <Link href={`/book?service=${service.slug}`}>BOOK NOW</Link>
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="py-40 text-center space-y-8"
                        >
                            <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center mx-auto border border-white/10">
                                <Filter className="w-10 h-10 text-white/20" />
                            </div>
                            <div className="space-y-3">
                                <h3 className="font-fraunces text-4xl font-bold text-white">No Rituals Found</h3>
                                <p className="text-white/40 max-w-md mx-auto italic">
                                    We couldn't find any sessions matching your search or category filter.
                                </p>
                            </div>
                            {searchQuery && (
                                <div className="flex items-center justify-center gap-2 text-white/30 text-xs">
                                    <span>Searching for &ldquo;{searchQuery}&rdquo;</span>
                                </div>
                            )}
                            <div className="flex items-center justify-center gap-4">
                                <Button
                                    onClick={() => { setActiveCategory("all"); setSearchQuery(""); }}
                                    variant="outline"
                                    className="border-primary-gold/20 text-primary-gold hover:bg-primary-gold hover:text-primary-charcoal"
                                >
                                    Reset Filters
                                </Button>
                                {/* Show "Try Popular" suggestions */}
                                {services.filter(s => s.is_stylists_choice).slice(0, 3).length > 0 && (
                                    <div className="flex flex-col items-start gap-2">
                                        <p className="text-[9px] text-white/20 uppercase tracking-widest font-bold">Try these popular rituals:</p>
                                        <div className="flex gap-2">
                                            {services.filter(s => s.is_stylists_choice).slice(0, 3).map(s => (
                                                <button
                                                    key={s.id}
                                                    onClick={() => { setActiveCategory(s.category); setSearchQuery(''); }}
                                                    className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-white/50 hover:text-white hover:bg-white/10 transition-all"
                                                >
                                                    {s.title}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* ✦ MCP Multi-Server Powered Footer */}
            <section className="py-20 border-t border-white/5 bg-[#060608]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-4 text-white/20">
                            <Bot className="w-5 h-5 text-primary-gold/40" />
                            <span className="text-[9px] uppercase tracking-[0.3em] font-bold">MCP Orchestrated</span>
                        </div>
                        <div className="flex items-center gap-6 flex-wrap justify-center">
                            {[
                                { name: 'supaui', tool: 'create-ui · create-image · fetch-ui' },
                                { name: 'ui-ux-mcp', tool: 'tailwind · animation · component · workflow' },
                                { name: 'mcp-ui-bridge', tool: 'visual-test · automation' },
                            ].map(mcp => (
                                <div key={mcp.name} className="text-center">
                                    <p className="text-[10px] font-bold text-primary-gold/60 uppercase tracking-wider">{mcp.name}</p>
                                    <p className="text-[8px] text-white/20 font-mono mt-0.5">{mcp.tool}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ✦ Luxury CTA — MCP workflow_optimize_ux enhanced */}
            <section className="py-32 relative overflow-hidden bg-primary-gold group">
                <div className="absolute inset-0 bg-[#0A0A0B] translate-y-full group-hover:translate-y-0 transition-transform duration-1000 ease-in-out" />
                <div className="max-w-4xl mx-auto px-6 text-center space-y-12 relative z-10 transition-colors duration-1000 group-hover:text-white text-primary-charcoal">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <h2 className="font-fraunces text-5xl md:text-7xl font-bold leading-tight">
                            Still seeking your <br />
                            <span className="italic font-light">Perfect Ritual?</span>
                        </h2>
                        <p className="text-lg max-w-2xl mx-auto font-medium opacity-80">
                            Our master stylists offer bespoke consultations to craft a unique identity just for you.
                        </p>
                        <div className="flex flex-wrap justify-center gap-6 pt-4">
                            <Button size="lg" asChild className="h-16 px-12 bg-primary-charcoal text-white hover:bg-white hover:text-primary-charcoal border-none rounded-2xl tracking-[0.2em] uppercase text-[11px] font-black group-hover:bg-primary-gold group-hover:text-primary-charcoal shadow-2xl transition-all">
                                <Link href="/book">Schedule a Consultation</Link>
                            </Button>
                            <Button size="lg" asChild variant="outline" className="h-16 px-12 border-white/20 text-white/80 hover:bg-white hover:text-primary-charcoal rounded-2xl tracking-[0.2em] uppercase text-[11px] font-black transition-all">
                                <Link href="/consultation">Try AI Color Match</Link>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}