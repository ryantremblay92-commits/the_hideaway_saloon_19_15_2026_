"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
    Users, 
    Calendar, 
    TrendingUp, 
    Star,
    ClipboardCheck,
    Clock
} from "lucide-react";
import { getStaffRituals, getStaffStats } from "@/lib/actions/staff";
import { createClient } from "@/lib/supabase/client";
import { format } from "date-fns";
import Link from "next/link";

export default function StaffDashboard() {
    const [staffId, setStaffId] = React.useState<string | null>(null);
    const [rituals, setRituals] = React.useState<any[]>([]);
    const [dashStats, setDashStats] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);
    const supabase = createClient();

    React.useEffect(() => {
        async function loadData() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setStaffId(user.id);
                const [ritualData, statsData] = await Promise.all([
                    getStaffRituals(user.id),
                    getStaffStats(user.id)
                ]);
                setRituals(ritualData || []);
                setDashStats(statsData);
            }
            setLoading(false);
        }
        loadData();
    }, [supabase]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-primary-gold border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const statsDisplay = [
        { name: "Today's Rituals", value: dashStats?.todayRituals || "0", icon: Calendar, color: "text-blue-400" },
        { name: "Client Satisfaction", value: "4.9", icon: Star, color: "text-yellow-400" },
        { name: "Est. Commission", value: `AED ${dashStats?.commission?.toFixed(2) || "0.00"}`, icon: TrendingUp, color: "text-green-400" },
        { name: "Compliance Score", value: "98%", icon: ClipboardCheck, color: "text-purple-400" },
    ];

    return (
        <div className="space-y-10">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-fraunces font-light mb-2 text-white">
                        Welcome back, <span className="text-primary-gold">Artist</span>
                    </h1>
                    <p className="text-white/40 tracking-wide italic">"Every head of hair is a new canvas for your masterpiece."</p>
                </div>
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-4 rounded-3xl backdrop-blur-xl">
                    <Clock className="w-5 h-5 text-primary-gold" />
                    <div>
                        <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Shift Active</p>
                        <p className="text-sm font-medium text-white/80">{format(new Date(), 'hh:mm a')} • Live</p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsDisplay.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] hover:bg-white/10 transition-all group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-3xl -mr-12 -mt-12 group-hover:bg-primary-gold/10 transition-colors" />
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-2xl bg-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                            </div>
                            <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-1">{stat.name}</p>
                            <p className="text-2xl font-fraunces font-bold text-white">{stat.value}</p>
                        </motion.div>
                    );
                })}
            </div>

            {/* Main Content Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Ritual Queue */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-fraunces font-bold flex items-center gap-3 text-white">
                            <Calendar className="w-5 h-5 text-primary-gold" />
                            Ritual Queue
                        </h2>
                        <span className="text-[10px] uppercase tracking-widest text-white/30 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                            {rituals.length} Total
                        </span>
                    </div>
                    
                    <div className="space-y-4">
                        {rituals.length > 0 ? rituals.map((ritual, i) => (
                            <Link key={ritual.id} href={`/staff/rituals/${ritual.id}`}>
                                <motion.div 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-white/5 border border-white/10 p-6 rounded-3xl flex items-center justify-between group hover:border-white/20 transition-all cursor-pointer mb-4"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-white/10 to-transparent flex flex-col items-center justify-center border border-white/10">
                                            <span className="text-sm font-bold text-white">{ritual.time?.split(' ')[0] || "TBD"}</span>
                                            <span className="text-[8px] uppercase tracking-tighter text-white/40">{ritual.time?.split(' ')[1] || ""}</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white mb-1 group-hover:text-primary-gold transition-colors">{ritual.customer_name || "Guest"}</h3>
                                            <p className="text-xs text-white/40 italic">{ritual.service_name || "Special Service"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border ${
                                            ritual.status === 'completed' ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' : 
                                            ritual.status === 'confirmed' ? 'text-green-400 bg-green-500/10 border-green-500/20' : 
                                            'text-primary-gold bg-primary-gold/10 border-primary-gold/20'
                                        }`}>
                                            {ritual.status}
                                        </span>
                                        <div className="p-3 rounded-xl bg-white/5 hover:bg-primary-gold hover:text-black transition-all group/btn">
                                            <ClipboardCheck className="w-5 h-5 text-white/40 group-hover/btn:text-black transition-colors" />
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        )) : (
                            <div className="bg-white/5 border border-white/5 rounded-3xl p-12 text-center">
                                <p className="text-white/20 italic">No rituals assigned for today yet.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Client Archive Sneak Peek */}
                <div className="space-y-6">
                    <h2 className="text-xl font-fraunces font-bold flex items-center gap-3 text-white">
                        <Users className="w-5 h-5 text-primary-gold" />
                        Client Archive
                    </h2>
                    <div className="bg-[#0D0D0F] border border-white/10 p-8 rounded-[2.5rem] space-y-8 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary-gold/30 to-transparent" />
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="Search archives..." 
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-primary-gold transition-all text-white placeholder:text-white/20"
                            />
                        </div>
                        <div className="space-y-6">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-white/20 font-black">History & Trends</p>
                            <div className="space-y-5">
                                {[1, 2, 3].map((item) => (
                                    <div key={item} className="flex items-center justify-between group cursor-pointer">
                                        <div className="flex items-center gap-4">
                                            <div className="h-11 w-11 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-primary-gold/30 transition-all">
                                                <Users className="w-5 h-5 text-white/10 group-hover:text-primary-gold transition-all" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white/80 group-hover:text-white transition-all">Archive Ref #{item * 401}</p>
                                                <p className="text-[10px] text-white/20 tracking-wider">PREVIOUS COLOR: LVL 7.4</p>
                                            </div>
                                        </div>
                                        <button className="text-white/10 group-hover:text-primary-gold transition-all">
                                            <TrendingUp className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white/40 text-[10px] uppercase tracking-widest font-black hover:bg-white/10 hover:text-white transition-all mt-4">
                                View Full Archive
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
