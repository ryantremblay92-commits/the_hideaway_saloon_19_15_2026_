'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Clock, 
    CheckCircle2, 
    XCircle, 
    Search, 
    Filter, 
    Sparkles, 
    MessageCircle, 
    TrendingUp, 
    Zap,
    Bot,
    User,
    ArrowUpRight,
    Activity
} from 'lucide-react';
import { getAllConsultations, type Consultation } from '@/lib/actions/consultation';
import Image from 'next/image';

const STATUS_META = {
    pending: {
        icon: Clock,
        label: 'Under Review',
        color: 'text-primary-gold',
        bg: 'bg-primary-gold/10',
        border: 'border-primary-gold/20',
        dot: 'bg-primary-gold',
    },
    approved: {
        icon: CheckCircle2,
        label: 'Authorized',
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/20',
        dot: 'bg-emerald-400',
    },
    rejected: {
        icon: XCircle,
        label: 'Declined',
        color: 'text-red-400',
        bg: 'bg-red-500/10',
        border: 'border-red-500/20',
        dot: 'bg-red-400',
    },
    completed: {
        icon: CheckCircle2,
        label: 'Finalized',
        color: 'text-white/40',
        bg: 'bg-white/5',
        border: 'border-white/10',
        dot: 'bg-white/30',
    },
};

export default function AdminConsultationsList() {
    const router = useRouter();
    const [consultations, setConsultations] = useState<Consultation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const data = await getAllConsultations();
        setConsultations(data);
        setIsLoading(false);
    };

    const filtered = consultations
        .filter(c => filter === 'all' ? true : c.status === filter)
        .filter(c => {
            if (!searchQuery.trim()) return true;
            const q = searchQuery.toLowerCase();
            return (
                c.profiles?.full_name?.toLowerCase().includes(q) ||
                c.selected_color_name?.toLowerCase().includes(q)
            );
        });

    const stats = {
        total: consultations.length,
        pending: consultations.filter(c => c.status === 'pending').length,
        approved: consultations.filter(c => c.status === 'approved').length,
        conversion: consultations.length > 0 ? Math.round((consultations.filter(c => c.status === 'approved').length / consultations.length) * 100) : 0
    };

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center py-48 gap-8">
            <div className="relative">
                <div className="w-24 h-24 border border-white/5 rounded-full" />
                <div className="absolute inset-0 w-24 h-24 border-t border-primary-gold rounded-full animate-spin" />
                <Bot className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-primary-gold/40 animate-pulse" />
            </div>
            <div className="flex flex-col items-center gap-2">
                <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">Syncing Control Center</p>
                <div className="w-48 h-[1px] bg-white/5 relative overflow-hidden">
                    <motion.div 
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                        className="absolute inset-0 bg-primary-gold/40"
                    />
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-16 pb-32">
            {/* ✦ Control Center Header */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col 2xl:flex-row justify-between 2xl:items-end gap-12"
            >
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-gold/10 border border-primary-gold/20 shadow-luxury">
                            <Bot className="w-3.5 h-3.5 text-primary-gold" />
                            <span className="text-[10px] font-black text-primary-gold uppercase tracking-[0.3em]">Aesthetic Intelligence</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">Live Feed</span>
                        </div>
                    </div>
                    
                    <h1 className="text-6xl md:text-8xl font-fraunces font-light tracking-tight text-white leading-[0.85]">
                        Ritual <br />
                        <span className="text-primary-gold italic">Authorizations</span>
                    </h1>
                    
                    <p className="text-white/30 text-lg max-w-xl font-light leading-relaxed italic">
                        &ldquo;Review and validate high-fidelity color transformations. Your authorization initiates the molecular ritual.&rdquo;
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                    {/* Search Field */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                            <Search className="w-4 h-4 text-white/20 group-focus-within:text-primary-gold transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Client name or shade..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-primary-gold/40 focus:bg-white/[0.05] transition-all w-full md:w-80"
                        />
                    </div>

                    <div className="flex elite-glass p-1.5 rounded-2xl w-fit">
                        {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`
                                    px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500
                                    ${filter === f 
                                        ? 'bg-primary-gold text-primary-charcoal shadow-luxury' 
                                        : 'text-white/30 hover:text-white/60'}
                                `}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </motion.header>

            {/* ✦ Analytic Modules */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Total Dossiers', value: stats.total, icon: Activity, color: 'text-white' },
                    { label: 'Awaiting Action', value: stats.pending, icon: Clock, color: 'text-primary-gold' },
                    { label: 'Approved Rituals', value: stats.approved, icon: CheckCircle2, color: 'text-emerald-400' },
                    { label: 'Aesthetic Alignment', value: `${stats.conversion}%`, icon: TrendingUp, color: 'text-blue-400' },
                ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="elite-glass p-8 rounded-[2.5rem] group hover:border-primary-gold/20 transition-all duration-700"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <stat.icon className={`w-5 h-5 ${stat.color} opacity-40`} />
                            <div className="w-1.5 h-1.5 rounded-full bg-white/5 group-hover:bg-primary-gold transition-colors" />
                        </div>
                        <p className="text-4xl font-fraunces font-light text-white mb-2">{stat.value}</p>
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* ✦ Dossier Grid */}
            <AnimatePresence mode="wait">
                <motion.div 
                    key={filter}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
                >
                    {filtered.map((consult, idx) => {
                        const meta = STATUS_META[consult.status as keyof typeof STATUS_META] || STATUS_META.pending;
                        const StatusIcon = meta.icon;
                        
                        return (
                            <motion.div
                                key={consult.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05, duration: 1, ease: [0.23, 1, 0.32, 1] }}
                                onClick={() => router.push(`/admin/consultations/${consult.id}`)}
                                className="elite-glass rounded-[3rem] p-10 cursor-pointer group relative overflow-hidden flex flex-col justify-between"
                            >
                                <div className="absolute inset-0 bg-primary-gold/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                
                                <div className="relative z-10">
                                    <div className="flex items-start justify-between mb-10">
                                        <div className="flex items-center gap-5">
                                            <div className="relative">
                                                <div className="w-16 h-16 rounded-[1.5rem] overflow-hidden bg-[#0F0F0F] border border-white/10 group-hover:border-primary-gold/40 transition-all duration-700">
                                                    {consult.profiles?.avatar_url ? (
                                                        <Image src={consult.profiles.avatar_url} alt="User" width={64} height={64} className="object-cover w-full h-full" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-white/20 font-fraunces text-2xl uppercase">
                                                            {consult.profiles?.full_name?.charAt(0) || '?'}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="absolute -inset-2 bg-primary-gold opacity-0 group-hover:opacity-10 blur-2xl rounded-full transition-opacity duration-700" />
                                            </div>
                                            <div>
                                                <p className="text-lg font-medium text-white group-hover:text-primary-gold transition-colors">{consult.profiles?.full_name || 'Anonymous Client'}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                                                    <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${meta.color}`}>{meta.label}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="p-6 bg-white/[0.03] border border-white/[0.05] rounded-[2rem] group-hover:border-primary-gold/20 transition-all duration-500">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Sparkles className="w-3.5 h-3.5 text-primary-gold opacity-40" />
                                                <p className="text-[9px] text-white/20 uppercase font-black tracking-[0.4em]">Target Shade</p>
                                            </div>
                                            <p className="text-3xl font-fraunces font-light text-white italic leading-tight">
                                                {consult.selected_color_name}
                                            </p>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-[1px] bg-white/10" />
                                                    <p className="text-[10px] text-white/20 uppercase font-black tracking-[0.3em]">Telemetry Scan</p>
                                                </div>
                                                <p className="text-[10px] font-mono text-white/20">{new Date(consult.created_at).toLocaleDateString()}</p>
                                            </div>
                                            
                                            <div className="flex gap-4">
                                                {consult.reference_images.slice(0, 3).map((img, i) => (
                                                    <div key={i} className="relative w-24 h-24 rounded-[1.5rem] overflow-hidden border border-white/5 group-hover:border-white/20 transition-all duration-700">
                                                        <Image src={img} alt="Ref" fill className="object-cover grayscale group-hover:grayscale-0 scale-105 group-hover:scale-110 transition-all duration-1000" />
                                                    </div>
                                                ))}
                                                {consult.reference_images.length > 3 && (
                                                    <div className="w-24 h-24 rounded-[1.5rem] bg-white/[0.04] border border-white/5 flex items-center justify-center text-white/20 text-xs font-black font-mono">
                                                        +{consult.reference_images.length - 3}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-12 pt-8 border-t border-white/[0.05] flex items-center justify-between opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-700">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center">
                                            <ArrowUpRight className="w-4 h-4 text-primary-gold" />
                                        </div>
                                        <span className="text-[10px] font-black text-primary-gold uppercase tracking-[0.4em]">Open Dossier</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1 h-1 rounded-full bg-primary-gold animate-ping" />
                                        <span className="text-[8px] font-mono text-white/20">mcp-node-0x{consult.id.slice(0,4)}</span>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </AnimatePresence>
            
            {filtered.length === 0 && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-48 elite-glass rounded-[4rem] border-dashed border-white/10"
                >
                    <div className="flex flex-col items-center gap-6">
                        <Bot className="w-12 h-12 text-white/5" />
                        <p className="text-white/20 font-fraunces italic text-2xl max-w-md mx-auto">
                            &ldquo;No dossiers matching these parameters were detected in the aesthetic stream.&rdquo;
                        </p>
                        <button 
                            onClick={() => {setFilter('all'); setSearchQuery('');}}
                            className="text-[10px] font-black text-primary-gold uppercase tracking-[0.4em] hover:text-white transition-colors"
                        >
                            Reset Telemetry
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
