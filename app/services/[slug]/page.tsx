"use client";

import { useState } from "react";
import { useParams, notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { getServiceBySlug, services as allServices } from "@/lib/data/services";
import { Button } from "@/components/ui/Button";
import {
    Scissors,
    Sparkles,
    Flower2,
    Heart,
    Star,
    Smile,
    Clock,
    Palette,
    Crown,
    Zap,
    Wand2,
    Hand,
    Eye,
    Bot,
    ArrowLeft,
    CheckCircle2,
    Gem,
    Layers,
    ChevronRight,
    Loader2,
    Shirt,
    Paintbrush,
    Ruler,
    Droplets,
    ScanFace,
    Ungroup,
    TestTube,
    EyeOff,
} from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { cn } from "@/lib/utils";

// ─── MCP Tailwind-inspired category color system ───
const CATEGORY_COLORS: Record<string, { color: string; light: string; gradient: string; dark: string }> = {
    "Effortless Color": { color: "#C9A962", light: "rgba(201,169,98,0.15)", gradient: "from-amber-800/40 to-amber-950/20", dark: "#8B7335" },
    "Hair Spa Rituals": { color: "#6366F1", light: "rgba(99,102,241,0.15)", gradient: "from-indigo-800/40 to-indigo-950/20", dark: "#4338CA" },
    "Precision Styling": { color: "#EC4899", light: "rgba(236,72,153,0.15)", gradient: "from-pink-800/40 to-pink-950/20", dark: "#BE185D" },
    "Permanent Straightening": { color: "#A855F7", light: "rgba(168,85,247,0.15)", gradient: "from-purple-800/40 to-purple-950/20", dark: "#7E22CE" },
    "Hair Extensions": { color: "#F97316", light: "rgba(249,115,22,0.15)", gradient: "from-orange-800/40 to-orange-950/20", dark: "#C2410C" },
    "Skin Alchemy": { color: "#10B981", light: "rgba(16,185,129,0.15)", gradient: "from-emerald-800/40 to-emerald-950/20", dark: "#047857" },
    "Nail Artistry": { color: "#14B8A6", light: "rgba(20,185,166,0.15)", gradient: "from-teal-800/40 to-teal-950/20", dark: "#0D9488" },
    "Lash & Brow": { color: "#E11D48", light: "rgba(225,29,72,0.15)", gradient: "from-rose-800/40 to-rose-950/20", dark: "#BE123C" },
    "Men's Grooming": { color: "#6B7280", light: "rgba(107,114,128,0.15)", gradient: "from-gray-800/40 to-gray-950/20", dark: "#374151" },
};

// ─── Per-Service AI Studio Tools ───
interface AITool {
    icon: any;
    label: string;
    desc: string;
    mcpTool: string;
}

const SERVICE_AI_TOOLS: Record<string, AITool[]> = {
    "hair-coloring": [
        { icon: Palette, label: "Color Preview", desc: "Upload a selfie to preview this shade on your hair", mcpTool: "supaui → create-image" },
        { icon: Layers, label: "Shade Matcher", desc: "AI matches your skin tone to the perfect shade level", mcpTool: "ui-ux-mcp → tailwind-generate" },
        { icon: Eye, label: "Virtual Try-On", desc: "See balayage, highlights or full color in real-time", mcpTool: "supaui → create-image" },
    ],
    "hair-treatments": [
        { icon: ScanFace, label: "Scalp Analysis", desc: "AI analyzes scalp condition from your photos", mcpTool: "supaui → create-image" },
        { icon: Droplets, label: "Ritual Recommender", desc: "Personalized Kérastase ritual based on hair porosity", mcpTool: "ui-ux-mcp → workflow-ux" },
        { icon: Sparkles, label: "Restoration Preview", desc: "See projected results after 4-week treatment plan", mcpTool: "supaui → create-image" },
    ],
    "haircuts-styling": [
        { icon: Scissors, label: "Style Suggester", desc: "AI recommends cuts matching your face shape", mcpTool: "ui-ux-mcp → workflow-ux" },
        { icon: Wand2, label: "Virtual Stylist", desc: "Try 10+ hairstyles on your uploaded photo", mcpTool: "supaui → create-image" },
        { icon: Ruler, label: "Length Visualizer", desc: "See exactly how short/long each cut will look", mcpTool: "supaui → create-image" },
    ],
    "hair-extensions": [
        { icon: Shirt, label: "Length & Volume", desc: "AI shows you with different extension lengths", mcpTool: "supaui → create-image" },
        { icon: Ruler, label: "Extension Calculator", desc: "Calculates exact number of wefts/tapes needed", mcpTool: "ui-ux-mcp → workflow-ux" },
        { icon: Palette, label: "Color Match", desc: "Perfectly blends extension color to your natural hair", mcpTool: "ui-ux-mcp → tailwind-generate" },
    ],
    "hair-straightening": [
        { icon: EyeOff, label: "Before/After", desc: "Interactive slider showing your hair smooth results", mcpTool: "supaui → create-image" },
        { icon: TestTube, label: "Texture Analysis", desc: "AI analyzes hair porosity for optimal treatment", mcpTool: "ui-ux-mcp → component-analyze" },
        { icon: Clock, label: "Results Timeline", desc: "See how results evolve over 6 months post-treatment", mcpTool: "ui-ux-mcp → animation-timeline" },
    ],
    "skin-care": [
        { icon: ScanFace, label: "Skin Analysis", desc: "AI analyzes skin type, pores, and undertone", mcpTool: "supaui → create-image" },
        { icon: Palette, label: "Tone Matcher", desc: "Find your seasonal color palette for makeup", mcpTool: "ui-ux-mcp → tailwind-generate" },
        { icon: Flower2, label: "Glow Simulator", desc: "Preview your complexion after the facial ritual", mcpTool: "supaui → create-image" },
    ],
    "nail-care": [
        { icon: Paintbrush, label: "Nail Designer", desc: "Design custom nail art with AI color palettes", mcpTool: "supaui → create-image" },
        { icon: Palette, label: "Color Explorer", desc: "200+ gel colors matched to your skin tone", mcpTool: "ui-ux-mcp → tailwind-generate" },
        { icon: Hand, label: "Shape Suggester", desc: "AI recommends nail shape for your finger type", mcpTool: "ui-ux-mcp → workflow-ux" },
    ],
    "lashes-brows": [
        { icon: Eye, label: "Lash Preview", desc: "See different lash styles on your eye shape", mcpTool: "supaui → create-image" },
        { icon: Ungroup, label: "Brow Architect", desc: "AI maps perfect brow arch for your face", mcpTool: "supaui → create-image" },
        { icon: Crown, label: "Style Match", desc: "Match lash/brow style to your eye color + shape", mcpTool: "ui-ux-mcp → workflow-ux" },
    ],
    "mens-grooming": [
        { icon: Zap, label: "Beard Preview", desc: "See 20+ beard styles on your uploaded photo", mcpTool: "supaui → create-image" },
        { icon: Scissors, label: "Fade Designer", desc: "AI suggests fade levels matching your face shape", mcpTool: "ui-ux-mcp → workflow-ux" },
        { icon: Wand2, label: "Complete Restyle", desc: "Full head-to-beard AI restyling preview", mcpTool: "supaui → create-image" },
    ],
};

const DEFAULT_AI_TOOLS: AITool[] = [
    { icon: Eye, label: "Try This Look", desc: "Generate a preview via AI", mcpTool: "supaui → create-image" },
    { icon: Palette, label: "Style Match", desc: "AI-powered recommendations", mcpTool: "ui-ux-mcp → workflow-ux" },
    { icon: Wand2, label: "Color Analysis", desc: "Find your perfect palette", mcpTool: "ui-ux-mcp → tailwind-generate" },
];

// ─── Icon resolver ───
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconMap: Record<string, any> = {
    Scissors, Sparkles, Flower2, Heart, Star, Smile, Clock, Palette, Crown, Zap, Wand2, Hand, MoveHorizontal: Wand2,
};

export default function ServiceDetail() {
    const params = useParams();
    const slug = params.slug as string;
    const service = getServiceBySlug(slug) as NonNullable<ReturnType<typeof getServiceBySlug>>;
    const [activeAITool, setActiveAITool] = useState<number | null>(null);

    if (!service) {
        notFound();
        return null;
    }

    const Icon = iconMap[service.icon] || Scissors;
    const catColor = CATEGORY_COLORS[service.title] || { color: "#C9A962", light: "rgba(201,169,98,0.15)", gradient: "from-amber-800/40 to-amber-950/20", dark: "#8B7335" };

    // AI Tools unique to this service
    const aiTools = SERVICE_AI_TOOLS[service.slug] || DEFAULT_AI_TOOLS;

    // Related services (different slug, filtered intelligently)
    const relatedServices = allServices
        .filter(s =>
            s.slug !== service.slug &&
            (s.icon === service.icon || Math.abs(s.startingPrice - service.startingPrice) < 300)
        )
        .slice(0, 3);

    return (
        <div className="flex flex-col w-full bg-white">
            {/* ✦ Hero Section — unique per-service */}
            <section className="relative h-[70vh] min-h-[600px] flex items-center justify-center overflow-hidden">
                <motion.div
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
                    className="absolute inset-0 z-0"
                >
                    <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover grayscale-[20%]"
                        priority
                    />
                </motion.div>

                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80 z-10" />
                <div className="absolute inset-0 z-10" style={{
                    background: `linear-gradient(135deg, ${catColor.light} 0%, transparent 50%)`,
                }} />

                {/* Back button */}
                <div className="absolute top-28 left-6 z-30">
                    <Link href="/services">
                        <Button variant="outline" className="border-white/20 text-white/70 hover:text-white hover:bg-white/10 rounded-full h-12 px-5 gap-3 backdrop-blur-md bg-black/20">
                            <ArrowLeft className="w-4 h-4" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">All Rituals</span>
                        </Button>
                    </Link>
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-20 text-center text-white">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="space-y-8"
                    >
                        {/* Badge row */}
                        <div className="flex items-center justify-center gap-3 flex-wrap">
                            {service.isStylistsChoice && (
                                <motion.div
                                    animate={{
                                        boxShadow: [`0 0 0px ${catColor.light}`, `0 0 30px ${catColor.light}`, `0 0 0px ${catColor.light}`],
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary-gold via-[#FFD700] to-primary-gold text-primary-charcoal text-[9px] font-black uppercase tracking-[0.2em]"
                                >
                                    <Zap className="w-3.5 h-3.5" /> Stylist's Choice
                                </motion.div>
                            )}
                            {service.tag && !service.isStylistsChoice && (
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-gold/20 text-primary-gold border border-primary-gold/30 text-[9px] font-black uppercase tracking-[0.2em]">
                                    <Star className="w-3 h-3" /> {service.tag}
                                </div>
                            )}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/70 text-[9px] font-bold uppercase tracking-[0.2em]">
                                <Clock className="w-3 h-3" /> {service.duration}
                            </div>
                            {/* Service-specific badge */}
                            {service.slug === 'hair-coloring' && (
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[9px] font-bold uppercase tracking-[0.2em]">
                                    <Palette className="w-3 h-3" /> 30+ Shades
                                </div>
                            )}
                            {service.slug === 'mens-grooming' && (
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-500/20 border border-gray-500/30 text-gray-300 text-[9px] font-bold uppercase tracking-[0.2em]">
                                    <Zap className="w-3 h-3" /> Quick Book
                                </div>
                            )}
                        </div>

                        {/* Spring-animated icon */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.4, type: "spring", damping: 15 }}
                            className="inline-flex w-24 h-24 rounded-full items-center justify-center mx-auto shadow-2xl border-2 border-white/20 backdrop-blur-xl"
                            style={{ backgroundColor: catColor.color + '30' }}
                        >
                            <Icon className="w-12 h-12" style={{ color: catColor.color }} />
                        </motion.div>

                        <h1 className="font-fraunces text-6xl md:text-8xl font-bold tracking-tight leading-[0.9]">
                            {service.title}
                        </h1>

                        {/* Service-specific subtitle */}
                        <p className="text-white/50 text-lg max-w-xl mx-auto font-light italic leading-relaxed">
                            {service.slug === 'mens-grooming' && "Where masculine refinement meets sanctuary-grade care."}
                            {service.slug === 'hair-coloring' && "Future-proof colour that grows out beautifully, not harshly."}
                            {service.slug === 'hair-treatments' && "Molecular repair for hair that's been through it all."}
                            {service.slug === 'haircuts-styling' && "Architectural cuts designed for your natural texture."}
                            {service.slug === 'hair-extensions' && "Invisible volume, undetectable blend, transformative results."}
                            {service.slug === 'hair-straightening' && "Scientifically proven smoothness without compromising integrity."}
                            {service.slug === 'skin-care' && "Reveal your inner radiance with clinical-grade facials."}
                            {service.slug === 'nail-care' && "Precision nail architecture by Dubai's master technicians."}
                            {service.slug === 'lashes-brows' && "Frame your eyes with artisanal precision and care."}
                        </p>

                        {/* Price row */}
                        <div className="flex items-center justify-center gap-8 text-sm font-bold tracking-widest uppercase">
                            <div className="flex items-center gap-2">
                                <Gem className="w-4 h-4 text-primary-gold" />
                                <span className="text-white/80">Starting from</span>
                                <span className="text-2xl font-bold text-primary-gold">AED {service.startingPrice}</span>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="flex items-center justify-center gap-4 pt-4">
                            <Button size="lg" asChild className="h-14 px-10 bg-primary-gold text-primary-charcoal hover:bg-white hover:text-[#0A0A0B] rounded-2xl tracking-[0.2em] uppercase text-[11px] font-black border-none shadow-[0_0_30px_rgba(212,175,55,0.3)]">
                                <Link href={`/book?service=${service.slug}`}>Book Now</Link>
                            </Button>
                            <Button size="lg" variant="outline" asChild className="h-14 px-10 border-white/20 text-white/80 hover:bg-white/10 rounded-2xl tracking-[0.2em] uppercase text-[11px] font-black backdrop-blur-md">
                                <Link href={`/consultation?service=${service.slug}`}>
                                    <Eye className="w-4 h-4 mr-2" />
                                    AI Preview
                                </Link>
                            </Button>
                        </div>
                    </motion.div>
                </div>

                {/* Bottom gradient fade */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-10" />
            </section>

            {/* ✦ Detail Content */}
            <section className="py-24 bg-white relative">
                <div className="absolute top-6 right-6 z-10 hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-white text-[8px] text-black/30 font-mono uppercase tracking-wider shadow-sm">
                    <Bot className="w-3 h-3" /> MCP orchestrated
                </div>

                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* ====== Main Content ====== */}
                    <motion.div
                        initial="initial"
                        whileInView="animate"
                        variants={staggerContainer}
                        className="lg:col-span-2 space-y-16"
                    >
                        {/* Description */}
                        <motion.div variants={fadeInUp} className="space-y-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: catColor.color + '20' }}>
                                    <Palette className="w-4 h-4" style={{ color: catColor.color }} />
                                </div>
                                <h2 className="font-fraunces text-4xl font-bold text-primary-charcoal">
                                    Experience the <span className="italic" style={{ color: catColor.color }}>transformation</span>
                                </h2>
                            </div>
                            <div className="p-6 rounded-2xl bg-gradient-to-br from-primary-ivory to-white border border-secondary-pearl">
                                <p className="text-lg text-secondary-slate leading-relaxed font-light">{service.longDesc}</p>
                            </div>
                        </motion.div>

                        {/* ✦ Per-Service AI Studio — Unique tools for each service */}
                        <motion.div variants={fadeInUp}>
                            <div className="rounded-3xl border overflow-hidden" style={{ borderColor: catColor.color + '30' }}>
                                <div className="p-6 border-b border-secondary-pearl flex items-center justify-between" style={{ backgroundColor: catColor.color + '08' }}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: catColor.color + '20' }}>
                                            <Bot className="w-5 h-5" style={{ color: catColor.color }} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-primary-charcoal text-sm">AI Studio — {service.title}</h3>
                                            <p className="text-[9px] text-secondary-slate uppercase tracking-wider font-mono">
                                                {aiTools.length} tools · supaui · ui-ux-mcp
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 space-y-3">
                                    {aiTools.map((tool, i) => {
                                        const ToolIcon = tool.icon;
                                        const isActive = activeAITool === i;
                                        return (
                                            <motion.button
                                                key={tool.label}
                                                initial={{ opacity: 0, x: -10 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.08 }}
                                                onClick={() => setActiveAITool(isActive ? null : i)}
                                                className={cn(
                                                    "w-full flex items-center gap-4 p-4 rounded-2xl border transition-all duration-500 text-left group",
                                                    isActive
                                                        ? "bg-primary-gold/5 border-primary-gold/30 shadow-sm"
                                                        : "bg-white border-secondary-pearl hover:border-primary-gold/20 hover:shadow-sm"
                                                )}
                                            >
                                                <div className={cn(
                                                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 flex-shrink-0",
                                                    isActive ? "bg-primary-gold text-white" : "bg-primary-ivory text-secondary-slate group-hover:text-primary-gold"
                                                )}>
                                                    <ToolIcon className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1 min-w-0 text-left">
                                                    <p className={cn("text-sm font-bold transition-colors", isActive ? "text-primary-gold" : "text-primary-charcoal")}>
                                                        {tool.label}
                                                    </p>
                                                    <p className="text-xs text-secondary-slate">{tool.desc}</p>
                                                </div>
                                                <div className="text-right flex-shrink-0">
                                                    <span className="text-[8px] text-secondary-slate/50 font-mono uppercase tracking-wider">{tool.mcpTool}</span>
                                                </div>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </div>
                        </motion.div>

                        {/* What's Included */}
                        <motion.div variants={fadeInUp} className="space-y-8">
                            <div className="flex items-center gap-3 border-b border-secondary-pearl pb-4">
                                <Layers className="w-5 h-5" style={{ color: catColor.color }} />
                                <h3 className="font-fraunces text-2xl font-bold text-primary-charcoal">What's included</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {service.subServices.map((sub, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="group flex items-center gap-4 p-5 bg-primary-ivory rounded-2xl border border-secondary-pearl hover:border-primary-gold/30 hover:shadow-md transition-all duration-500"
                                    >
                                        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 bg-white shadow-sm" style={{ color: catColor.color }}>
                                            <CheckCircle2 className="w-4 h-4" />
                                        </div>
                                        <span className="font-bold text-primary-charcoal text-sm group-hover:text-primary-gold transition-colors">{sub}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Price Timeline */}
                        <motion.div variants={fadeInUp}>
                            <div className="p-8 rounded-3xl border border-secondary-pearl bg-gradient-to-br from-primary-ivory to-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-48 h-48 opacity-5 rounded-full blur-3xl" style={{ backgroundColor: catColor.color }} />
                                <div className="relative z-10 space-y-6">
                                    <h3 className="font-fraunces text-xl font-bold text-primary-charcoal">Ritual Investment</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-secondary-slate font-medium">Session Value</span>
                                            <div className="flex items-baseline gap-1.5">
                                                <span className="text-[10px] text-secondary-slate font-mono">AED</span>
                                                <span className="text-4xl font-fraunces font-bold text-primary-charcoal">{service.startingPrice}</span>
                                            </div>
                                        </div>
                                        <div className="h-2 bg-secondary-pearl rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${Math.min((service.startingPrice / 1200) * 100, 100)}%` }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
                                                className="h-full rounded-full"
                                                style={{ background: `linear-gradient(90deg, ${catColor.color}66, ${catColor.color})` }}
                                            />
                                        </div>
                                        <div className="flex justify-between text-[10px] text-secondary-slate font-mono">
                                            <span>AED 0</span>
                                            <span>AED 1,200+</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Stylist Note */}
                        <motion.div
                            variants={fadeInUp}
                            className="p-8 rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-8"
                            style={{ background: `linear-gradient(135deg, #1a1a2e, ${catColor.color}22)` }}
                        >
                            <div className="space-y-3 text-center md:text-left">
                                <div className="flex items-center gap-2 mb-2">
                                    <Sparkles className="w-4 h-4" style={{ color: catColor.color }} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: catColor.color }}>Stylist's Note</span>
                                </div>
                                <h4 className="font-fraunces text-2xl font-bold text-white">Ready to book your ritual?</h4>
                                <p className="text-white/50 text-sm">Secure your session now via our online system or WhatsApp concierge.</p>
                            </div>
                            <div className="flex gap-4">
                                <Button size="lg" asChild className="h-14 px-8 rounded-2xl tracking-[0.2em] uppercase text-[11px] font-black border-none shadow-xl"
                                    style={{ backgroundColor: catColor.color, color: '#0A0A0B' }}>
                                    <Link href={`/book?service=${service.slug}`}>Book Online</Link>
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* ====== Sidebar ====== */}
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="rounded-3xl border space-y-8 sticky top-28 overflow-hidden"
                            style={{ borderColor: catColor.color + '30', backgroundColor: catColor.color + '08' }}
                        >
                            <div className="h-2 w-full" style={{ background: `linear-gradient(90deg, ${catColor.color}, ${catColor.color}44)` }} />

                            <div className="p-8 space-y-8">
                                {/* Service icon */}
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg" style={{ backgroundColor: catColor.color + '20' }}>
                                        <Icon className="w-7 h-7" style={{ color: catColor.color }} />
                                    </div>
                                    <div>
                                        <h4 className="font-fraunces text-xl font-bold text-primary-charcoal">{service.title}</h4>
                                        <p className="text-xs text-secondary-slate">{service.shortDesc}</p>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="space-y-4">
                                    <h4 className="font-fraunces text-lg font-bold text-primary-charcoal flex items-center gap-2">
                                        <Gem className="w-4 h-4" style={{ color: catColor.color }} /> Service Details
                                    </h4>
                                    <ul className="space-y-4">
                                        <li className="flex items-center justify-between p-4 rounded-xl bg-white/80 border border-secondary-pearl">
                                            <span className="text-secondary-slate uppercase tracking-widest font-bold text-[10px]">Avg. Duration</span>
                                            <span className="font-bold text-primary-charcoal flex items-center gap-2">
                                                <Clock className="w-3.5 h-3.5" style={{ color: catColor.color }} /> {service.duration}
                                            </span>
                                        </li>
                                        <li className="flex items-center justify-between p-4 rounded-xl bg-white/80 border border-secondary-pearl">
                                            <span className="text-secondary-slate uppercase tracking-widest font-bold text-[10px]">Price starts at</span>
                                            <span className="font-bold text-primary-charcoal text-lg font-fraunces" style={{ color: catColor.color }}>AED {service.startingPrice}</span>
                                        </li>
                                        <li className="flex items-center justify-between p-4 rounded-xl bg-white/80 border border-secondary-pearl">
                                            <span className="text-secondary-slate uppercase tracking-widest font-bold text-[10px]">Availability</span>
                                            <span className="font-bold text-green-600 flex items-center gap-1.5">
                                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Now Booking
                                            </span>
                                        </li>
                                        {/* Service-specific detail */}
                                        {service.slug === 'mens-grooming' && (
                                            <li className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-center">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-primary-gold">Walk-ins Welcome</span>
                                                <p className="text-[9px] text-secondary-slate mt-1">No appointment needed for quick trims</p>
                                            </li>
                                        )}
                                        {service.slug === 'hair-coloring' && (
                                            <li className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-center">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600">Free Consultation</span>
                                                <p className="text-[9px] text-secondary-slate mt-1">Included with every first color booking</p>
                                            </li>
                                        )}
                                        {service.slug === 'skin-care' && (
                                            <li className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Complimentary Analysis</span>
                                                <p className="text-[9px] text-secondary-slate mt-1">Free skin assessment before any facial</p>
                                            </li>
                                        )}
                                    </ul>
                                </div>

                                {/* AI Preview CTA */}
                                <div className="p-4 rounded-2xl border border-dashed" style={{ borderColor: catColor.color + '40' }}>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Bot className="w-3.5 h-3.5" style={{ color: catColor.color }} />
                                        <span className="text-[9px] font-bold uppercase tracking-wider text-secondary-slate">AI Preview Studio</span>
                                        <span className="text-[7px] text-secondary-slate/50 font-mono ml-auto">MCP · supaui</span>
                                    </div>
                                    <p className="text-xs text-secondary-slate mb-4 leading-relaxed">See how this look would appear on you before you book.</p>
                                    <Button size="sm" className="w-full rounded-xl text-[9px] font-bold uppercase tracking-widest h-10"
                                        style={{ backgroundColor: catColor.color, color: '#0A0A0B' }}>
                                        <Eye className="w-3.5 h-3.5 mr-2" /> Generate Preview
                                    </Button>
                                </div>

                                {/* Guarantee */}
                                <div className="p-5 rounded-2xl bg-white/80 border border-secondary-pearl">
                                    <h4 className="font-fraunces text-lg font-bold text-primary-charcoal mb-3">Our Guarantee</h4>
                                    <p className="text-xs text-secondary-slate leading-relaxed italic">
                                        &ldquo;If you aren't completely satisfied with your transformation, we will make it right. That is our promise.&rdquo;
                                    </p>
                                </div>

                                <Button variant="outline" size="lg" asChild className="w-full rounded-2xl border-primary-charcoal/20 text-primary-charcoal hover:bg-primary-charcoal hover:text-white">
                                    <Link href="/services">Back to all services</Link>
                                </Button>
                            </div>
                        </motion.div>

                        {/* Related Services */}
                        {relatedServices.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                className="rounded-3xl border border-secondary-pearl p-6 space-y-6 bg-primary-ivory/50"
                            >
                                <h4 className="font-fraunces text-lg font-bold text-primary-charcoal flex items-center gap-2">
                                    <ChevronRight className="w-4 h-4" style={{ color: catColor.color }} /> You might also like
                                </h4>
                                <div className="space-y-4">
                                    {relatedServices.map((rel) => {
                                        const RelIcon = iconMap[rel.icon] || Scissors;
                                        return (
                                            <Link key={rel.slug} href={`/services/${rel.slug}`}>
                                                <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-secondary-pearl hover:border-primary-gold/30 hover:shadow-md transition-all duration-500 group">
                                                    <div className="w-10 h-10 rounded-xl bg-primary-gold/10 flex items-center justify-center flex-shrink-0">
                                                        <RelIcon className="w-5 h-5 text-primary-gold" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-bold text-primary-charcoal group-hover:text-primary-gold transition-colors truncate">{rel.title}</p>
                                                        <p className="text-[10px] text-secondary-slate">From AED {rel.startingPrice}</p>
                                                    </div>
                                                    <ChevronRight className="w-4 h-4 text-secondary-slate group-hover:text-primary-gold transition-colors" />
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}

                        {/* MCP Badge */}
                        <div className="text-center py-4">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-secondary-pearl shadow-sm">
                                <Bot className="w-3 h-3 text-primary-gold/60" />
                                <span className="text-[8px] text-secondary-slate/60 uppercase tracking-widest font-mono">Multi-MCP · supaui · ui-ux-mcp</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}