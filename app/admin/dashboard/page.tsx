"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    Calendar,
    Scissors,
    TrendingUp,
    Users,
    Sparkles,
    ArrowUpRight,
    Clock,
    CheckCircle2,
    XCircle,
    MoreHorizontal,
    Zap,
    Crown,
    ChevronRight,
    Activity
} from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { format, isToday, isThisWeek } from "date-fns";
import Link from "next/link";

// --- Design Constants ---
const GOLD_GLOW = "shadow-[0_0_40px_-12px_rgba(212,175,55,0.3)]";
const GLASS_DARK = "bg-white/[0.03] backdrop-blur-3xl border border-white/10";

// --- Animation Variants ---
const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
};

const stagger = {
    animate: { transition: { staggerChildren: 0.12 } }
};

const shimmer = {
    initial: { x: "-100%" },
    animate: { x: "100%" },
    transition: { duration: 2, repeat: Infinity, ease: "linear" }
};

// --- Sub-components ---

const Sparkline = ({ color = "rgba(212, 175, 55, 0.5)" }) => (
    <div className="h-8 w-24 opacity-60">
        <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible">
            <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                d="M0,25 L15,20 L30,28 L45,10 L60,18 L75,5 L100,12"
                fill="none"
                stroke={color}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    </div>
);

const StatCard = ({ label, value, icon: Icon, change, color, index }: any) => (
    <motion.div
        variants={fadeInUp}
        whileHover={{ scale: 1.02, y: -5 }}
        whileTap={{ scale: 0.98 }}
        className={`relative group overflow-hidden ${GLASS_DARK} p-8 rounded-[2.5rem] transition-all duration-500 hover:border-white/20 ${GOLD_GLOW} cursor-pointer`}
    >
        {/* Animated Background Pulse */}
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/[0.02] rounded-full blur-3xl group-hover:bg-primary-gold/10 transition-colors duration-700" />
        
        <div className="relative z-10">
            <div className="flex justify-between items-start mb-8">
                <div className={`p-4 rounded-2xl ${color.bg} ${color.text} border border-white/5`}>
                    <Icon className="w-6 h-6" />
                </div>
                <Sparkline color={color.sparkline} />
            </div>
            
            <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/30 group-hover:text-white/50 transition-colors">
                    {label}
                </p>
                <div className="flex items-baseline gap-3">
                    <h3 className="text-4xl font-fraunces font-light text-white leading-tight">
                        {value}
                    </h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${color.badge} uppercase tracking-tighter`}>
                        {change}
                    </span>
                </div>
            </div>
        </div>
    </motion.div>
);

export default function DashboardPage() {
    const [stats, setStats] = React.useState({
        revenue: 0,
        rituals: 0,
        pending: 0,
        clients: 0,
        newClients: 0
    });
    const [dailyRituals, setDailyRituals] = React.useState<any[]>([]);
    const [liveActivity, setLiveActivity] = React.useState<any[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const supabase = createClient();

    React.useEffect(() => {
        const fetchDashboardData = async () => {
            const { data: bookings } = await supabase
                .from('bookings')
                .select('*')
                .order('created_at', { ascending: false });

            const { data: profiles } = await supabase
                .from('profiles')
                .select('*');

            const { data: notifications } = await supabase
                .from('notifications')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(6);

            if (bookings && profiles) {
                const todayBookings = bookings.filter(b => isToday(new Date(b.date)));
                const completedToday = todayBookings.filter(b => b.status === 'completed');
                const revenue = completedToday.reduce((sum, b) => sum + (Number(b.total_price) || 500), 0);
                const weekProfiles = profiles.filter(p => isThisWeek(new Date(p.created_at)));

                setStats({
                    revenue,
                    rituals: bookings.length,
                    pending: bookings.filter(b => b.status === 'pending').length,
                    clients: profiles.length,
                    newClients: weekProfiles.length
                });

                setDailyRituals(todayBookings.slice(0, 5));
            }

            if (notifications) {
                setLiveActivity(notifications);
            }

            setIsLoading(false);
        };

        fetchDashboardData();

        const channel = supabase
            .channel('dashboard_updates')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, fetchDashboardData)
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#050505]">
                <div className="relative">
                    <div className="w-16 h-16 border-[1px] border-white/5 rounded-full" />
                    <div className="absolute inset-0 w-16 h-16 border-t-[1px] border-primary-gold rounded-full animate-spin" />
                    <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-primary-gold animate-pulse" />
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-[1600px] mx-auto pb-24">
            {/* --- Premium Header --- */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-16 px-2"
            >
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="px-3 py-1 bg-primary-gold/10 border border-primary-gold/20 rounded-full">
                            <span className="text-[10px] font-bold text-primary-gold uppercase tracking-[0.3em]">Administrator</span>
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-fraunces font-light tracking-tight text-white">
                        Command <span className="text-primary-gold italic">Center</span>
                    </h1>
                    <p className="text-white/40 text-sm max-w-md font-light leading-relaxed">
                        Welcome to the sanctuary's core. Monitor every ritual, client interaction, and growth metric in real-time.
                    </p>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">System Status</span>
                        <span className="text-sm font-medium text-white/80">Synchronized & Optimal</span>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group cursor-pointer hover:border-primary-gold/40 transition-colors">
                        <Activity className="w-6 h-6 text-white/40 group-hover:text-primary-gold transition-colors" />
                    </div>
                </div>
            </motion.div>

            {/* --- Key Metrics Pulse --- */}
            <motion.div
                initial="initial"
                animate="animate"
                variants={stagger}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
            >
                <StatCard 
                    label="Live Revenue" 
                    value={`₹${stats.revenue.toLocaleString()}`} 
                    icon={TrendingUp} 
                    change="Today"
                    color={{ bg: "bg-emerald-500/10", text: "text-emerald-400", badge: "bg-emerald-500/20 text-emerald-400", sparkline: "#10b981" }}
                />
                <StatCard 
                    label="Rituals Handled" 
                    value={stats.rituals.toString()} 
                    icon={Scissors} 
                    change={`${stats.pending} Waiting`}
                    color={{ bg: "bg-primary-gold/10", text: "text-primary-gold", badge: "bg-primary-gold/20 text-primary-gold", sparkline: "#d4af37" }}
                />
                <StatCard 
                    label="Client Network" 
                    value={stats.clients.toString()} 
                    icon={Users} 
                    change={`+${stats.newClients} New`}
                    color={{ bg: "bg-blue-500/10", text: "text-blue-400", badge: "bg-blue-500/20 text-blue-400", sparkline: "#3b82f6" }}
                />
                <StatCard 
                    label="System Velocity" 
                    value="98%" 
                    icon={Zap} 
                    change="Optimal"
                    color={{ bg: "bg-purple-500/10", text: "text-purple-400", badge: "bg-purple-500/20 text-purple-400", sparkline: "#a855f7" }}
                />
            </motion.div>

            {/* --- Main Dashboard Body --- */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                
                {/* Rituals Registry (Left) */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className={`xl:col-span-8 ${GLASS_DARK} rounded-[3rem] p-10 relative overflow-hidden`}
                >
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-gold/[0.02] rounded-full blur-[120px] pointer-events-none" />
                    
                    <div className="flex justify-between items-center mb-12">
                        <div className="space-y-1">
                            <h2 className="font-fraunces text-3xl font-light text-white">Daily Registry</h2>
                            <p className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-bold">Scheduled Rituals Today</p>
                        </div>
                        <Link 
                            href="/admin/bookings" 
                            className="group flex items-center gap-3 text-[10px] font-bold text-primary-gold uppercase tracking-widest px-6 py-3 border border-primary-gold/20 rounded-2xl hover:bg-primary-gold hover:text-primary-charcoal transition-all"
                        >
                            Explore All <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="space-y-4">
                        <AnimatePresence mode="popLayout">
                            {dailyRituals.length > 0 ? dailyRituals.map((ritual, idx) => (
                                <motion.div
                                    key={ritual.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="group/item flex items-center justify-between p-6 rounded-[2rem] hover:bg-white/[0.03] border border-transparent hover:border-white/5 transition-all cursor-pointer"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className="relative">
                                            <div className="w-16 h-16 bg-[#0F0F0F] rounded-2xl flex items-center justify-center text-white/20 font-fraunces text-2xl border border-white/5 group-hover/item:border-primary-gold/30 transition-colors">
                                                {ritual.customer_name?.[0] || 'A'}
                                            </div>
                                            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-[#050505] shadow-xl ${
                                                ritual.status === 'completed' ? 'bg-emerald-500' :
                                                ritual.status === 'confirmed' ? 'bg-blue-500' :
                                                'bg-primary-gold'
                                            }`} />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-medium text-white group-hover/item:text-primary-gold transition-colors">{ritual.customer_name}</h4>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest">{ritual.service_name}</span>
                                                <span className="w-1 h-1 rounded-full bg-white/10" />
                                                <span className="text-[10px] text-primary-gold/60 font-bold uppercase tracking-widest">Premium Ritual</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-10">
                                        <div className="text-right">
                                            <div className="text-sm font-fraunces font-bold text-white flex items-center justify-end gap-2">
                                                <Clock className="w-3.5 h-3.5 text-primary-gold/40" /> {ritual.booking_time}
                                            </div>
                                            <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest mt-1">Scheduled Time</p>
                                        </div>
                                        <Link 
                                            href="/admin/bookings" 
                                            className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/20 hover:text-white hover:border-white/20 transition-all"
                                        >
                                            <MoreHorizontal className="w-5 h-5" />
                                        </Link>
                                    </div>
                                </motion.div>
                            )) : (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-24"
                                >
                                    <Sparkles className="w-12 h-12 text-white/5 mx-auto mb-4" />
                                    <p className="text-white/20 font-fraunces italic text-lg tracking-wide">The registry is empty. Awaiting the next ritual.</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* Sidebar Intelligence (Right) */}
                <div className="xl:col-span-4 space-y-8">
                    
                    {/* Activity Feed */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className={`${GLASS_DARK} rounded-[3rem] p-10`}
                    >
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-10 h-10 bg-primary-gold/10 text-primary-gold rounded-xl flex items-center justify-center">
                                <Activity className="w-5 h-5" />
                            </div>
                            <h3 className="font-fraunces text-xl font-light text-white tracking-tight">Intelligence Feed</h3>
                        </div>

                        <div className="space-y-8 relative">
                            <div className="absolute left-6 top-2 bottom-2 w-[1px] bg-gradient-to-b from-white/10 via-white/5 to-transparent" />

                            {liveActivity.map((item, idx) => (
                                <motion.div 
                                    key={item.id}
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + (idx * 0.1) }}
                                    className="flex gap-6 relative z-10 group"
                                >
                                    <div className={`w-12 h-12 rounded-2xl bg-[#080808] border border-white/5 flex flex-shrink-0 items-center justify-center transition-all duration-500 group-hover:border-primary-gold/30
                                        ${item.type === 'reward' ? 'text-primary-gold shadow-[0_0_15px_rgba(212,175,55,0.1)]' : 'text-white/30'}`}
                                    >
                                        {item.type === 'reward' ? <Crown className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                                    </div>
                                    <div className="flex-1 pt-1">
                                        <p className="text-sm font-medium text-white group-hover:text-primary-gold transition-colors duration-300">{item.title}</p>
                                        <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1.5 flex items-center gap-2">
                                            {format(new Date(item.created_at), 'hh:mm a')}
                                            <span className="w-1 h-1 rounded-full bg-white/10" />
                                            {item.type === 'reward' ? 'Milestone' : 'Update'}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Quick Action - Create Ritual */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="relative group cursor-pointer"
                    >
                        <div className="absolute inset-0 bg-primary-gold rounded-[3rem] blur-2xl opacity-10 group-hover:opacity-20 transition-opacity" />
                        <div className="relative bg-primary-gold rounded-[3rem] p-10 text-primary-charcoal overflow-hidden border border-white/10">
                            <div className="absolute -right-10 -top-10 opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-1000">
                                <LayoutDashboard className="w-64 h-64" />
                            </div>

                            <div className="relative z-10">
                                <h3 className="font-fraunces text-3xl font-bold mb-3">Initiate Ritual</h3>
                                <p className="text-primary-charcoal/60 text-sm font-medium leading-relaxed mb-10">
                                    Create a new sanctuary experience for a walk-in or returning client.
                                </p>
                                <Link 
                                    href="/admin/bookings" 
                                    className="flex items-center justify-between w-full bg-primary-charcoal text-white rounded-2xl px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] shadow-2xl hover:bg-black transition-all"
                                >
                                    Launch Creator <ArrowUpRight className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
