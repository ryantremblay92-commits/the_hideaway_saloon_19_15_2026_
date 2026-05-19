'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Gift,
    Users,
    TrendingUp,
    Award,
    Coins,
    ArrowUpRight,
    Crown,
    Sparkles,
    Receipt,
    Ticket,
    Plus,
    X,
    ToggleLeft,
    ToggleRight,
    Trash2,
    Percent,
    DollarSign
} from 'lucide-react';
import { getLoyaltyStats, getAllCustomerPoints, getAllReferrals, getAllPointsTransactions } from '@/lib/actions/loyalty';
import { getAllCoupons, createCoupon, toggleCouponStatus, deleteCoupon, type Coupon } from '@/lib/actions/coupons';
import { toast } from 'sonner';

interface LoyaltyStats {
    totalPointsOutstanding: number;
    totalCustomers: number;
    tierDistribution: Record<string, number> | [];
    monthlyEarned: number;
    monthlyRedeemed: number;
    totalReferrals: number;
    topEarners: Array<{
        available_points: number;
        lifetime_points: number;
        profiles: { full_name: string | null };
    }>;
}

interface CustomerPoints {
    id: string;
    customer_id: string;
    total_points: number;
    available_points: number;
    lifetime_points: number;
    tier: string;
    profiles: {
        id: string;
        full_name: string | null;
        email: string | null;
        avatar_url: string | null;
    };
}

interface Referral {
    id: string;
    referral_code: string;
    status: string;
    referrer: {
        full_name: string | null;
        email: string | null;
    };
    referred_at: string;
    completed_at: string | null;
}

interface Transaction {
    id: string;
    points: number;
    transaction_type: string;
    description: string;
    created_at: string;
    profiles: {
        id: string;
        full_name: string | null;
        email: string | null;
    } | null;
}

const tierColors: Record<string, string> = {
    bronze: '#CD7F32',
    silver: '#C0C0C0',
    gold: '#FFD700',
    platinum: '#E5E4E2'
};

const tierGradients: Record<string, string> = {
    bronze: 'from-[#CD7F32] to-[#8B4513]',
    silver: 'from-[#C0C0C0] to-[#808080]',
    gold: 'from-[#FFD700] to-[#B8860B]',
    platinum: 'from-[#E5E4E2] to-[#A9A9A9]'
};

export default function LoyaltyPage() {
    const [stats, setStats] = useState<LoyaltyStats | null>(null);
    const [customers, setCustomers] = useState<CustomerPoints[]>([]);
    const [referrals, setReferrals] = useState<Referral[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'customers' | 'transactions' | 'referrals' | 'coupons'>('overview');
    const [showCouponForm, setShowCouponForm] = useState(false);
    const [newCoupon, setNewCoupon] = useState({
        code: '',
        description: '',
        discount_type: 'percentage' as 'percentage' | 'fixed',
        discount_value: 10,
        min_order_value: 0,
        max_uses: '' as string | number,
        valid_until: '',
    });
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [statsData, customersData, referralsData, transactionsData, couponsData] = await Promise.all([
                getLoyaltyStats(),
                getAllCustomerPoints(),
                getAllReferrals(),
                getAllPointsTransactions(),
                getAllCoupons()
            ]);

            if (statsData) {
                setStats(statsData as unknown as LoyaltyStats);
            }
            setCustomers(customersData);
            setReferrals(referralsData);
            setTransactions(transactionsData as unknown as Transaction[]);
            setCoupons(couponsData);
        } catch (error) {
            console.error('Error loading loyalty data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCoupon = async () => {
        if (!newCoupon.code || !newCoupon.description) {
            toast.error('Code and description are required.');
            return;
        }
        setIsCreating(true);
        const result = await createCoupon({
            ...newCoupon,
            max_uses: newCoupon.max_uses === '' ? null : Number(newCoupon.max_uses),
            valid_until: newCoupon.valid_until || null,
        });
        if (result.success) {
            toast.success('Coupon created!');
            setShowCouponForm(false);
            setNewCoupon({ code: '', description: '', discount_type: 'percentage', discount_value: 10, min_order_value: 0, max_uses: '', valid_until: '' });
            loadData();
        } else {
            toast.error(result.error || 'Failed to create coupon');
        }
        setIsCreating(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-gold"></div>
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-24">
            {/* Cinematic Header */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col xl:flex-row justify-between xl:items-end gap-10"
            >
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="px-3 py-1 bg-primary-gold/10 border border-primary-gold/20 rounded-full">
                            <span className="text-[10px] font-bold text-primary-gold uppercase tracking-[0.3em]">Ambassador Program</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.3em]">Active Registry</span>
                        </div>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-fraunces font-light tracking-tight text-white leading-[0.9]">
                        Loyalty & <span className="text-primary-gold italic">Rituals</span>
                    </h1>
                    <p className="text-white/30 text-sm max-w-md font-light leading-relaxed">
                        Manage your elite inner circle, track engagement metrics, and curate bespoke rewards.
                    </p>
                </div>

                <div className="flex elite-glass p-1.5 rounded-2xl w-fit">
                    {[
                        { id: 'overview', label: 'Overview', icon: TrendingUp },
                        { id: 'customers', label: 'Customers', icon: Users },
                        { id: 'transactions', label: 'Transactions', icon: Receipt },
                        { id: 'referrals', label: 'Referrals', icon: Gift },
                        { id: 'coupons', label: 'Coupons', icon: Ticket }
                    ].map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`
                                    flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-500 group relative
                                    ${isActive
                                        ? 'bg-primary-gold text-primary-charcoal shadow-[0_0_20px_rgba(201,169,98,0.2)]'
                                        : 'text-white/30 hover:text-white/60'}
                                `}
                            >
                                <Icon className={`w-4 h-4 ${isActive ? 'text-primary-charcoal' : 'group-hover:text-primary-gold transition-colors duration-500'}`} />
                                <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${isActive ? 'opacity-100' : 'opacity-60'}`}>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
            </motion.header>

            {/* Overview Tab */}
            {activeTab === 'overview' && stats && (
                <div className="space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="elite-glass p-8 rounded-[2.5rem] relative group overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-primary-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <div className="relative z-10 space-y-6">
                                <div className="w-14 h-14 bg-primary-gold/10 rounded-2xl flex items-center justify-center text-primary-gold border border-primary-gold/20 shadow-luxury">
                                    <Coins className="w-7 h-7" />
                                </div>
                                <div>
                                    <p className="text-4xl font-fraunces font-light text-white leading-tight">
                                        {stats.totalPointsOutstanding.toLocaleString()}
                                    </p>
                                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mt-2">Points Outstanding</p>
                                </div>
                            </div>
                        </motion.div>
 
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="elite-glass p-8 rounded-[2.5rem] relative group overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <div className="relative z-10 space-y-6">
                                <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/20">
                                    <Users className="w-7 h-7" />
                                </div>
                                <div>
                                    <p className="text-4xl font-fraunces font-light text-white leading-tight">
                                        {stats.totalCustomers}
                                    </p>
                                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mt-2">Active Members</p>
                                </div>
                            </div>
                        </motion.div>
 
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="elite-glass p-8 rounded-[2.5rem] relative group overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <div className="relative z-10 space-y-6">
                                <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 border border-purple-500/20">
                                    <Gift className="w-7 h-7" />
                                </div>
                                <div>
                                    <p className="text-4xl font-fraunces font-light text-white leading-tight">
                                        {stats.monthlyEarned.toLocaleString()}
                                    </p>
                                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mt-2">Points Earned (MTD)</p>
                                </div>
                            </div>
                        </motion.div>
 
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="elite-glass p-8 rounded-[2.5rem] relative group overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <div className="relative z-10 space-y-6">
                                <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                                    <Award className="w-7 h-7" />
                                </div>
                                <div>
                                    <p className="text-4xl font-fraunces font-light text-white leading-tight">
                                        {stats.totalReferrals}
                                    </p>
                                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mt-2">Successful Referrals</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Tier Distribution & Top Earners */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Tier Distribution */}
                        <div className="elite-glass p-10 rounded-[3rem] relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8">
                                <Crown className="w-12 h-12 text-white/5 group-hover:text-primary-gold/10 transition-colors duration-700" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-fraunces text-2xl font-light text-white">Tier <span className="text-primary-gold italic">Intelligence</span></h3>
                                <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">Ambassador Distribution</p>
                            </div>
                            <div className="mt-10 space-y-8">
                                {Object.entries(stats.tierDistribution).map(([tier, count]) => {
                                    const percentage = stats.totalCustomers > 0 ? (count / stats.totalCustomers) * 100 : 0;
                                    return (
                                        <div key={tier} className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: tierColors[tier] }} />
                                                    <span className="capitalize text-sm font-medium text-white/60 tracking-wide">{tier}</span>
                                                </div>
                                                <span className="text-[11px] font-mono text-white/20">{count} Members</span>
                                            </div>
                                            <div className="h-1.5 bg-white/[0.03] rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${percentage}%` }}
                                                    transition={{ duration: 1, ease: "easeOut" }}
                                                    className={`h-full bg-gradient-to-r ${tierGradients[tier]} rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]`}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Top Earners */}
                        <div className="elite-glass p-10 rounded-[3rem] relative overflow-hidden group">
                            <div className="space-y-1">
                                <h3 className="font-fraunces text-2xl font-light text-white">Elite <span className="text-primary-gold italic">Patrons</span></h3>
                                <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">Top Point Accumulators</p>
                            </div>
                            <div className="mt-10 space-y-4">
                                {stats.topEarners.length === 0 ? (
                                    <div className="py-20 text-center">
                                        <p className="text-white/20 font-fraunces italic">The registry is currently empty.</p>
                                    </div>
                                ) : (
                                    stats.topEarners.map((earner, index) => (
                                        <div key={index} className="flex items-center gap-5 p-4 rounded-[1.5rem] bg-white/[0.02] border border-white/[0.04] group/earner hover:bg-white/[0.04] transition-all duration-500">
                                            <div className={`
                                                w-12 h-12 rounded-2xl flex items-center justify-center font-fraunces text-lg shadow-luxury
                                                ${index === 0 ? 'bg-gradient-to-br from-[#FFD700] to-[#B8860B] text-black' : ''}
                                                ${index === 1 ? 'bg-gradient-to-br from-[#C0C0C0] to-[#808080] text-black' : ''}
                                                ${index === 2 ? 'bg-gradient-to-br from-[#CD7F32] to-[#8B4513] text-white' : ''}
                                                ${index > 2 ? 'bg-white/10 text-white/40' : ''}
                                            `}>
                                                {index + 1}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-white font-medium group-hover/earner:text-primary-gold transition-colors">{earner.profiles?.full_name || 'Anonymous'}</p>
                                                <p className="text-[10px] text-white/20 uppercase tracking-widest font-bold mt-1">{earner.lifetime_points.toLocaleString()} Lifetime Points</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="flex items-center justify-end gap-1.5 text-primary-gold">
                                                    <Sparkles className="w-3 h-3" />
                                                    <span className="text-xl font-fraunces font-light">{earner.available_points.toLocaleString()}</span>
                                                </div>
                                                <p className="text-[9px] text-white/20 uppercase tracking-widest font-bold">Available</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Customers Tab */}
            {activeTab === 'customers' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="elite-glass rounded-[3rem] overflow-hidden shadow-luxury"
                >
                    <div className="p-10 border-b border-white/[0.04] flex items-center justify-between bg-white/[0.01]">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary-gold/10 rounded-2xl flex items-center justify-center text-primary-gold border border-primary-gold/20">
                                <Users className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-fraunces text-2xl font-light text-white">Member <span className="text-primary-gold italic">Directory</span></h3>
                                <p className="text-[10px] text-white/20 uppercase tracking-[0.3em] font-bold mt-1">Full Ambassador Registry</p>
                            </div>
                        </div>
                        <span className="text-[10px] font-mono text-white/20 tracking-widest px-4 py-2 bg-white/5 rounded-xl border border-white/5">{customers.length} Members</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/[0.04] bg-white/[0.01]">
                                    <th className="px-10 py-8 text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">Ambassador</th>
                                    <th className="px-10 py-8 text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">Current Tier</th>
                                    <th className="px-10 py-8 text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 text-right">Available Points</th>
                                    <th className="px-10 py-8 text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 text-right">Lifetime Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.04]">
                                {customers.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-10 py-32 text-center">
                                            <p className="text-white/20 font-fraunces italic text-xl">The registry is currently empty.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    customers.map((customer, idx) => (
                                        <motion.tr
                                            key={customer.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.03 }}
                                            className="group hover:bg-white/[0.02] transition-all duration-500 cursor-pointer"
                                        >
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-6">
                                                    <div className="relative">
                                                        <div className="w-16 h-16 rounded-2xl bg-[#0F0F0F] border border-white/5 flex items-center justify-center text-2xl font-fraunces text-white/20 group-hover:border-primary-gold/30 group-hover:text-primary-gold transition-all duration-700">
                                                            {customer.profiles?.full_name?.[0]?.toUpperCase() || '?'}
                                                        </div>
                                                        <div className="absolute -inset-1 bg-primary-gold opacity-0 group-hover:opacity-10 blur-xl rounded-full transition-opacity duration-700" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-white text-lg group-hover:text-primary-gold transition-colors">{customer.profiles?.full_name || 'Anonymous'}</p>
                                                        <p className="text-[11px] text-white/20 italic mt-1">{customer.profiles?.email || 'No Transmission Address'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <span className={`
                                                    inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.1em]
                                                    bg-gradient-to-r ${tierGradients[customer.tier]} text-black shadow-lg
                                                `}>
                                                    <Crown className="w-3 h-3" />
                                                    {customer.tier}
                                                </span>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <div className="flex items-center justify-end gap-2 text-primary-gold">
                                                    <Sparkles className="w-4 h-4" />
                                                    <span className="text-2xl font-fraunces font-light">{customer.available_points.toLocaleString()}</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <span className="text-xl font-fraunces font-light text-white/40">{customer.lifetime_points.toLocaleString()}</span>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            )}

            {/* Transactions Tab */}
            {activeTab === 'transactions' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="elite-glass rounded-[3rem] overflow-hidden shadow-luxury"
                >
                    <div className="p-10 border-b border-white/[0.04] flex items-center justify-between bg-white/[0.01]">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/20">
                                <Receipt className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-fraunces text-2xl font-light text-white">Ritual <span className="text-primary-gold italic">Ledger</span></h3>
                                <p className="text-[10px] text-white/20 uppercase tracking-[0.3em] font-bold mt-1">Historical Point Transmissions</p>
                            </div>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/[0.04] bg-white/[0.01]">
                                    <th className="px-10 py-8 text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">Transmission Date</th>
                                    <th className="px-10 py-8 text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">Member</th>
                                    <th className="px-10 py-8 text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">Type</th>
                                    <th className="px-10 py-8 text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">Narrative</th>
                                    <th className="px-10 py-8 text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 text-right">Impact</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.04]">
                                {transactions.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-10 py-32 text-center">
                                            <p className="text-white/20 font-fraunces italic text-xl">No rituals recorded in the ledger.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    transactions.map((tx, idx) => (
                                        <motion.tr
                                            key={tx.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.02 }}
                                            className="group hover:bg-white/[0.02] transition-all duration-500"
                                        >
                                            <td className="px-10 py-8">
                                                <div className="flex flex-col">
                                                    <span className="text-white font-medium">{new Date(tx.created_at).toLocaleDateString()}</span>
                                                    <span className="text-[10px] text-white/20 font-mono mt-1 uppercase">{new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-xs font-fraunces text-white/40">
                                                        {tx.profiles?.full_name?.[0]?.toUpperCase() || '?'}
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-medium group-hover:text-primary-gold transition-colors">{tx.profiles?.full_name || 'Anonymous'}</p>
                                                        <p className="text-[10px] text-white/20 italic">{tx.profiles?.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <span className={`
                                                    inline-flex px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest
                                                    ${['earn', 'bonus', 'referral_earn', 'referral_bonus'].includes(tx.transaction_type) ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : ''}
                                                    ${tx.transaction_type === 'redeem' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : ''}
                                                    ${tx.transaction_type === 'expire' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : ''}
                                                `}>
                                                    {tx.transaction_type.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-10 py-8 text-white/60 text-sm italic font-light">
                                                "{tx.description}"
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <span className={`text-2xl font-fraunces font-light ${['earn', 'bonus', 'referral_earn', 'referral_bonus'].includes(tx.transaction_type) ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                    {['earn', 'bonus', 'referral_earn', 'referral_bonus'].includes(tx.transaction_type) ? '+' : '-'}{Math.abs(tx.points)}
                                                </span>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            )}

            {/* Referrals Tab */}
            {activeTab === 'referrals' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="elite-glass rounded-[3rem] overflow-hidden shadow-luxury"
                >
                    <div className="p-10 border-b border-white/[0.04] flex items-center justify-between bg-white/[0.01]">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 border border-purple-500/20">
                                <Gift className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-fraunces text-2xl font-light text-white">Expansion <span className="text-primary-gold italic">Network</span></h3>
                                <p className="text-[10px] text-white/20 uppercase tracking-[0.3em] font-bold mt-1">Ambassador Referral Registry</p>
                            </div>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/[0.04] bg-white/[0.01]">
                                    <th className="px-10 py-8 text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">Primary Ambassador</th>
                                    <th className="px-10 py-8 text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">Transmission Code</th>
                                    <th className="px-10 py-8 text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">Current Status</th>
                                    <th className="px-10 py-8 text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 text-right">Initiated On</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.04]">
                                {referrals.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-10 py-32 text-center">
                                            <p className="text-white/20 font-fraunces italic text-xl">No active referral cycles detected.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    referrals.map((referral, idx) => (
                                        <motion.tr
                                            key={referral.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="group hover:bg-white/[0.02] transition-all duration-500"
                                        >
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-xs font-fraunces text-white/40">
                                                        {referral.referrer?.full_name?.[0]?.toUpperCase() || '?'}
                                                    </div>
                                                    <p className="text-white font-medium group-hover:text-primary-gold transition-colors">{referral.referrer?.full_name || 'Anonymous'}</p>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-2">
                                                    <code className="bg-primary-gold/10 px-4 py-2 rounded-xl text-primary-gold font-mono text-sm border border-primary-gold/20 shadow-luxury">
                                                        {referral.referral_code}
                                                    </code>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <span className={`
                                                    inline-flex px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest
                                                    ${referral.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : ''}
                                                    ${referral.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : ''}
                                                    ${referral.status === 'expired' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : ''}
                                                `}>
                                                    {referral.status}
                                                </span>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <span className="text-white/40 font-mono text-sm">{new Date(referral.referred_at).toLocaleDateString()}</span>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            )}
            {/* Coupons Tab */}
            {activeTab === 'coupons' && (
                <div className="space-y-10">
                    {/* Header + Create Button */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-between"
                    >
                        <div className="space-y-1">
                            <h3 className="font-fraunces text-2xl font-light text-white">Privilege <span className="text-primary-gold italic">Keys</span></h3>
                            <p className="text-[10px] text-white/20 uppercase tracking-[0.3em] font-bold mt-1">{coupons.length} Active Credentials</p>
                        </div>
                        <button
                            onClick={() => setShowCouponForm(v => !v)}
                            className="luxury-button py-3 px-8 rounded-2xl flex items-center gap-3 group"
                        >
                            {showCouponForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500" />}
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{showCouponForm ? 'Cancel Transmission' : 'Forge New Key'}</span>
                        </button>
                    </motion.div>

                    {/* Create Form */}
                    {showCouponForm && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="elite-glass p-12 rounded-[3rem] relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-10 opacity-10">
                                <Ticket className="w-24 h-24 text-primary-gold" />
                            </div>
                            
                            <div className="relative z-10 space-y-10">
                                <div className="space-y-2">
                                    <h4 className="text-white font-fraunces text-xl font-light">Transmission <span className="text-primary-gold italic">Parameters</span></h4>
                                    <p className="text-[10px] text-white/20 font-bold uppercase tracking-[0.3em]">Define the new privilege credential</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] ml-2">Credential Code</label>
                                        <input
                                            value={newCoupon.code}
                                            onChange={e => setNewCoupon(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                                            placeholder="E.G. EXCLUSIVE2026"
                                            className="w-full h-16 px-6 bg-white/[0.03] border border-white/10 rounded-2xl text-white font-mono font-bold tracking-widest placeholder:text-white/10 focus:outline-none focus:border-primary-gold/50 transition-all backdrop-blur-2xl"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] ml-2">Narrative Description</label>
                                        <input
                                            value={newCoupon.description}
                                            onChange={e => setNewCoupon(p => ({ ...p, description: e.target.value }))}
                                            placeholder="e.g. 20% off for elite inner circle"
                                            className="w-full h-16 px-6 bg-white/[0.03] border border-white/10 rounded-2xl text-white italic placeholder:text-white/10 focus:outline-none focus:border-primary-gold/50 transition-all backdrop-blur-2xl"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] ml-2">Reward Architecture</label>
                                        <div className="flex gap-4">
                                            {(['percentage', 'fixed'] as const).map(type => (
                                                <button
                                                    key={type}
                                                    onClick={() => setNewCoupon(p => ({ ...p, discount_type: type }))}
                                                    className={`flex-1 h-16 rounded-2xl border text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all duration-500 ${
                                                        newCoupon.discount_type === type
                                                            ? 'bg-primary-gold text-primary-charcoal border-primary-gold shadow-luxury'
                                                            : 'bg-white/[0.03] border-white/10 text-white/20 hover:border-white/30'
                                                    }`}
                                                >
                                                    {type === 'percentage' ? <Percent className="w-4 h-4" /> : <DollarSign className="w-4 h-4" />}
                                                    {type === 'percentage' ? 'Fractional' : 'Fixed Impact'}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] ml-2">
                                            {newCoupon.discount_type === 'percentage' ? 'Impact Percentage' : 'Impact Magnitude (AED)'}
                                        </label>
                                        <input
                                            type="number"
                                            value={newCoupon.discount_value}
                                            onChange={e => setNewCoupon(p => ({ ...p, discount_value: Number(e.target.value) }))}
                                            className="w-full h-16 px-6 bg-white/[0.03] border border-white/10 rounded-2xl text-white font-fraunces text-xl focus:outline-none focus:border-primary-gold/50 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] ml-2">Minimum Threshold (AED)</label>
                                        <input
                                            type="number"
                                            value={newCoupon.min_order_value}
                                            onChange={e => setNewCoupon(p => ({ ...p, min_order_value: Number(e.target.value) }))}
                                            className="w-full h-16 px-6 bg-white/[0.03] border border-white/10 rounded-2xl text-white font-fraunces text-xl focus:outline-none focus:border-primary-gold/50 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] ml-2">Utilization Cap</label>
                                        <input
                                            type="number"
                                            value={newCoupon.max_uses}
                                            onChange={e => setNewCoupon(p => ({ ...p, max_uses: e.target.value }))}
                                            placeholder="Infinity"
                                            className="w-full h-16 px-6 bg-white/[0.03] border border-white/10 rounded-2xl text-white font-fraunces text-xl placeholder:text-white/10 focus:outline-none focus:border-primary-gold/50 transition-all"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={handleCreateCoupon}
                                    disabled={isCreating}
                                    className="w-full h-20 bg-primary-gold text-primary-charcoal rounded-3xl font-bold text-[11px] uppercase tracking-[0.4em] hover:bg-white shadow-[0_20px_50px_rgba(201,169,98,0.2)] transition-all duration-700 disabled:opacity-50"
                                >
                                    {isCreating ? 'Transmitting Data...' : 'Authorize New Key'}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Coupons List */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="elite-glass rounded-[3rem] overflow-hidden shadow-luxury"
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/[0.04] bg-white/[0.01]">
                                        <th className="px-10 py-8 text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">Credential</th>
                                        <th className="px-10 py-8 text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">Architecture</th>
                                        <th className="px-10 py-8 text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">Utilization</th>
                                        <th className="px-10 py-8 text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">Stasis Date</th>
                                        <th className="px-10 py-8 text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">Stasis</th>
                                        <th className="px-10 py-8 text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 text-right">Operations</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/[0.04]">
                                    {coupons.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-10 py-32 text-center">
                                                <p className="text-white/20 font-fraunces italic text-xl">The credential registry is empty.</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        coupons.map((coupon, idx) => (
                                            <motion.tr
                                                key={coupon.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.04 }}
                                                className={`group hover:bg-white/[0.02] transition-all duration-500 ${!coupon.is_active ? 'opacity-30 grayscale' : ''}`}
                                            >
                                                <td className="px-10 py-8">
                                                    <div className="flex items-center gap-4">
                                                        <code className="bg-primary-gold/10 text-primary-gold font-mono font-bold px-4 py-2 rounded-xl text-sm border border-primary-gold/20 shadow-luxury tracking-widest">
                                                            {coupon.code}
                                                        </code>
                                                        <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold hidden xl:block">{coupon.description}</p>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <div>
                                                        <p className="text-xl font-fraunces font-light text-white">
                                                            {coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : `₹${coupon.discount_value}`}
                                                        </p>
                                                        {coupon.min_order_value > 0 && (
                                                            <p className="text-[9px] text-white/20 uppercase tracking-widest font-bold mt-1">Min ₹{coupon.min_order_value}</p>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <div className="flex items-end gap-1.5">
                                                        <span className="text-xl font-fraunces font-light text-white">{coupon.uses_count}</span>
                                                        <span className="text-[10px] text-white/20 font-bold uppercase mb-1">/ {coupon.max_uses || '∞'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <p className="text-sm font-mono text-white/40">
                                                        {coupon.valid_until ? new Date(coupon.valid_until).toLocaleDateString() : 'PERPETUAL'}
                                                    </p>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border transition-all duration-700 ${
                                                        coupon.is_active
                                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                            : 'bg-white/5 text-white/20 border-white/10'
                                                    }`}>
                                                        <div className={`w-1.5 h-1.5 rounded-full ${coupon.is_active ? 'bg-emerald-400 animate-pulse' : 'bg-white/20'}`} />
                                                        {coupon.is_active ? 'Authorized' : 'Suspended'}
                                                    </span>
                                                </td>
                                                <td className="px-10 py-8 text-right">
                                                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500">
                                                        <button
                                                            onClick={async () => {
                                                                const r = await toggleCouponStatus(coupon.id, coupon.is_active);
                                                                if (r.success) { loadData(); toast.success(`Key ${coupon.is_active ? 'suspended' : 'authorized'}`); }
                                                            }}
                                                            className="w-12 h-12 bg-white/[0.03] border border-white/10 rounded-2xl flex items-center justify-center text-white/20 hover:text-primary-gold hover:border-primary-gold/30 transition-all"
                                                        >
                                                            {coupon.is_active ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                                                        </button>
                                                        <button
                                                            onClick={async () => {
                                                                if (!confirm(`Permanently delete key ${coupon.code}?`)) return;
                                                                const r = await deleteCoupon(coupon.id);
                                                                if (r.success) { loadData(); toast.success('Key purged'); }
                                                            }}
                                                            className="w-12 h-12 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center text-rose-400 hover:bg-rose-500 hover:text-white transition-all"
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
