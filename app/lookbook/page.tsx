'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Instagram, Sparkles, Gem, Bot, TrendingUp, Zap, User, Clock, Share2, Search } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { team } from '@/lib/data/team';
import { cn } from '@/lib/utils';

export default function LookbookPage() {
    const [images, setImages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    useEffect(() => {
        const fetchImages = async () => {
            const supabase = createClient();
            const { data } = await supabase
                .from('portfolio_images')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (data) setImages(data);
            setLoading(false);
        };
        fetchImages();
    }, []);

    return (
        <div className="flex flex-col w-full min-h-screen bg-[#0A0A0B]">
            {/* ✦ Cinematic Live Header */}
            <section className="relative pt-40 pb-20 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-primary-gold/10 via-transparent to-transparent opacity-50" />
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] aspect-square rounded-full bg-primary-gold/5 blur-[100px] animate-pulse" />
                    <div className="absolute top-[-5%] right-[-5%] w-[30%] aspect-square rounded-full bg-blue-500/5 blur-[80px] animate-pulse" style={{ animationDelay: '2s' }} />
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col items-center text-center space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
                            className="space-y-6"
                        >
                            <div className="flex items-center justify-center gap-4">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-gold/10 text-primary-gold border border-primary-gold/20 shadow-luxury">
                                    <div className="w-2 h-2 rounded-full bg-primary-gold animate-ping" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Live Feed</span>
                                </div>
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/30">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Realtime Telemetry</span>
                                </div>
                            </div>

                            <h1 className="font-fraunces text-7xl md:text-9xl font-bold text-white tracking-tight leading-[0.85]">
                                The <br />
                                <span className="text-primary-gold italic">Lookbook</span>
                            </h1>
                            
                            <p className="text-white/40 text-lg max-w-xl mx-auto font-light leading-relaxed italic">
                                &ldquo;Direct synchronization from the salon floor. Witness the evolution of beauty in absolute fidelity.&rdquo;
                            </p>

                            <div className="flex items-center justify-center gap-8 pt-4">
                                <div className="flex items-center gap-2 text-white/20">
                                    <TrendingUp className="w-4 h-4 text-primary-gold" />
                                    <span className="text-[10px] uppercase tracking-[0.2em] font-black">Trending Now</span>
                                </div>
                                <div className="w-px h-4 bg-white/10" />
                                <div className="flex items-center gap-2 text-white/20">
                                    <Gem className="w-4 h-4 text-primary-gold" />
                                    <span className="text-[10px] uppercase tracking-[0.2em] font-black">Elite Selection</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ✦ Grid of Realtime Rituals */}
            <section className="relative z-10 pb-32 px-6 max-w-7xl mx-auto w-full">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="aspect-[4/5] rounded-[3rem] bg-white/[0.02] border border-white/5 overflow-hidden p-8 flex flex-col justify-end">
                                <div className="w-full h-4 bg-white/5 rounded-full mb-4 animate-pulse" />
                                <div className="w-2/3 h-3 bg-white/5 rounded-full animate-pulse" />
                            </div>
                        ))}
                    </div>
                ) : images.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {images.map((img, i) => {
                            const stylist = team.find(t => String(t.id) === String(img.stylist_id));
                            const isHovered = hoveredId === img.id;
                            
                            return (
                                <motion.div 
                                    key={img.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1, duration: 1, ease: [0.23, 1, 0.32, 1] }}
                                    onMouseEnter={() => setHoveredId(img.id)}
                                    onMouseLeave={() => setHoveredId(null)}
                                    className="group relative aspect-[4/5] rounded-[3rem] overflow-hidden bg-white/[0.02] border border-white/5 shadow-2xl cursor-pointer"
                                >
                                    <img 
                                        src={img.image_url} 
                                        alt={img.caption} 
                                        className={cn(
                                            "w-full h-full object-cover transition-all duration-1000 ease-[0.23, 1, 0.32, 1]",
                                            isHovered ? "scale-110 brightness-110" : "scale-100 brightness-[0.85]"
                                        )}
                                    />
                                    
                                    <div className={cn(
                                        "absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent transition-all duration-700",
                                        isHovered ? "opacity-90" : "opacity-40"
                                    )} />
                                    
                                    {/* Stylist Attribution Overlay */}
                                    <div className="absolute inset-0 p-10 flex flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <div className={cn(
                                                "flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 backdrop-blur-xl transition-all duration-500",
                                                isHovered ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                                            )}>
                                                <Bot className="w-3 h-3 text-primary-gold" />
                                                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/80">mcp-vision-verified</span>
                                            </div>
                                            <div className={cn(
                                                "w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all duration-500",
                                                isHovered ? "opacity-100 scale-100" : "opacity-0 scale-50"
                                            )}>
                                                <Share2 className="w-4 h-4" />
                                            </div>
                                        </div>

                                        <div className={cn(
                                            "transition-all duration-700 flex flex-col gap-4",
                                            isHovered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                                        )}>
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-primary-gold shadow-luxury">
                                                    <img src={stylist?.image} alt="Stylist" className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <p className="text-white text-base font-bold tracking-tight">{stylist?.name}</p>
                                                    <div className="flex items-center gap-2">
                                                        <Zap className="w-3 h-3 text-primary-gold" />
                                                        <p className="text-[9px] text-primary-gold uppercase font-black tracking-[0.2em]">{stylist?.role}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-6 h-[1px] bg-primary-gold/40" />
                                                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">Technique Notes</span>
                                                </div>
                                                <p className="text-white/80 text-sm leading-relaxed font-light italic">
                                                    &ldquo;{img.caption}&rdquo;
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quick Preview Badge */}
                                    <div className={cn(
                                        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-[2rem] bg-primary-gold text-primary-charcoal flex items-center justify-center shadow-luxury transition-all duration-700",
                                        isHovered ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-0 -rotate-45"
                                    )}>
                                        <Search className="w-6 h-6" />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-40 elite-glass rounded-[4rem] border border-white/10">
                        <Camera className="w-16 h-16 text-primary-gold/20 mx-auto mb-6 animate-pulse" />
                        <h3 className="font-fraunces text-4xl text-white font-bold mb-4">Awaiting Synchronization</h3>
                        <p className="text-white/30 text-lg font-light max-w-md mx-auto">The artistic telemetry is currently initializing. Stay tuned for live transformations.</p>
                    </div>
                )}
            </section>

            {/* ✦ Elite Social Command */}
            <section className="relative z-10 py-32 border-t border-white/5 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary-gold/10 blur-[200px] rounded-full" />
                </div>
                
                <div className="max-w-4xl mx-auto px-6 text-center space-y-10 relative z-10">
                    <div className="flex items-center justify-center gap-3">
                        <Instagram className="w-6 h-6 text-primary-gold" />
                        <div className="w-8 h-[1px] bg-white/10" />
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40">Neural Stream</span>
                    </div>
                    
                    <h2 className="font-fraunces text-5xl md:text-7xl font-bold text-white leading-tight">
                        Witness the <br />
                        <span className="text-primary-gold italic">Global Collective.</span>
                    </h2>
                    
                    <p className="text-white/30 text-lg font-light leading-relaxed max-w-2xl mx-auto italic">
                        Join our exclusive digital circle for behind-the-scenes telemetry and daily masterclasses.
                    </p>
                    
                    <motion.a
                        href="#"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center gap-4 px-10 py-5 rounded-[2rem] bg-white text-primary-charcoal hover:bg-primary-gold transition-all duration-500 shadow-luxury"
                    >
                        <Instagram className="w-5 h-5" />
                        <span className="text-[11px] font-black uppercase tracking-[0.3em]">@TheHideawayDXB</span>
                    </motion.a>
                </div>
            </section>
        </div>
    );
}
