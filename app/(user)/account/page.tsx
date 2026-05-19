"use client";

import React, { useEffect, useState } from "react";
import {
    Calendar,
    History,
    Settings,
    LogOut,
    Clock,
    CheckCircle2,
    Scissors,
    CreditCard,
    Camera,
    ChevronRight,
    Sparkles,
    XCircle,
    Gift,
    Users,
    Receipt,
    Star,
    TrendingUp,
    Copy,
    Zap,
    Shield,
    Award
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { getCustomerPoints, getPointsTransactions, getCustomerReferral, createReferralCode, getTierBenefits, useReferralCode, redeemPoints, getBirthdayOffer, updateDateOfBirth, getReferralCount } from "@/lib/actions/loyalty";
import { BirthdayBanner } from "@/components/engagement/BirthdayBanner";
import { BirthdayPrompt } from "@/components/engagement/BirthdayPrompt";
import { MilestoneBadges } from "@/components/engagement/MilestoneBadges";
import { PointsExpiryWarning } from "@/components/engagement/PointsExpiryWarning";
import { ThankYouNotes } from "@/components/engagement/ThankYouNotes";
import { ServiceSuggestions } from "@/components/engagement/ServiceSuggestions";
import { getThankYouNotes } from "@/lib/actions/notes";
import { getPersonalizedSuggestions, Suggestion } from "@/lib/actions/suggestions";
import { getLastCompletedRitual } from "@/lib/actions/rituals";
import { getUserConsultations, type Consultation } from "@/lib/actions/consultation";
import VisualInviteStudio from "@/components/engagement/VisualInviteStudio";

interface Booking {
    id: string;
    service_name: string;
    date: string;
    time: string;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}

interface Profile {
    full_name: string;
    email: string;
    avatar_url: string;
    loyalty_points: number;
    total_spent: number;
    date_of_birth?: string;
}

interface Transaction {
    id: string;
    points: number;
    transaction_type: string;
    description: string;
    created_at: string;
}

interface LoyaltyData {
    id: string;
    customer_id: string;
    total_points: number;
    available_points: number;
    lifetime_points: number;
    tier: string;
    points_expire_at?: string;
}

interface TierBenefit {
    tier_name: string;
    min_points: number;
    max_points: number | null;
    bonus_percentage: number;
    description: string;
}

const tierColors: Record<string, { from: string; to: string; via: string; badge: string; glow: string }> = {
    bronze: { from: '#CD7F32', to: '#8B4513', via: '#B8660D', badge: 'bg-amber-700/30 text-amber-400 border-amber-600/30', glow: 'rgba(205,127,50,0.4)' },
    silver: { from: '#C0C0C0', to: '#808080', via: '#A8A8A8', badge: 'bg-slate-400/20 text-slate-300 border-slate-400/30', glow: 'rgba(192,192,192,0.35)' },
    gold: { from: '#FFD700', to: '#B8860B', via: '#D4AF37', badge: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30', glow: 'rgba(212,175,55,0.45)' },
    platinum: { from: '#E5E4E2', to: '#A0A0A0', via: '#BCC6CC', badge: 'bg-sky-300/20 text-sky-200 border-sky-300/20', glow: 'rgba(229,228,226,0.4)' },
};

function FloatingOrb({ x, y, size, color, delay }: { x: string; y: string; size: number; color: string; delay: number }) {
    return (
        <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{ left: x, top: y, width: size, height: size, background: color, filter: 'blur(80px)' }}
            animate={{ y: [0, -30, 0], x: [0, 15, 0], opacity: [0.15, 0.3, 0.15] }}
            transition={{ duration: 8 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
        />
    );
}

export default function AccountPage() {
    const supabase = createClient();
    const router = useRouter();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [userId, setUserId] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [loyaltyData, setLoyaltyData] = useState<LoyaltyData | null>(null);
    const [tierBenefits, setTierBenefits] = useState<TierBenefit[]>([]);
    const [referralCode, setReferralCode] = useState<string>('');
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isRedeeming, setIsRedeeming] = useState(false);
    const [redeemAmount, setRedeemAmount] = useState<number | ''>('');
    const [redeemLoading, setRedeemLoading] = useState(false);
    const [enteredReferralCode, setEnteredReferralCode] = useState('');
    const [referralLoading, setReferralLoading] = useState(false);
    const [codeCopied, setCodeCopied] = useState(false);
    const [birthdayOffer, setBirthdayOffer] = useState<any>(null);
    const [notes, setNotes] = useState<any[]>([]);
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [referralCount, setReferralCount] = useState(0);
    const [lastRitual, setLastRitual] = useState<any>(null);
    const [consultations, setConsultations] = useState<Consultation[]>([]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    setUserId(user.id);
                    const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single();
                    setProfile(profileData);
                    const { data: bookingData } = await supabase.from('bookings').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
                    setBookings(bookingData || []);

                    // Fetch all secondary data in parallel
                    console.time('AccountDataFetch');
                    const results = await Promise.allSettled([
                        getCustomerPoints(user.id),
                        getTierBenefits(),
                        getCustomerReferral(user.id),
                        getPointsTransactions(user.id, 10),
                        getBirthdayOffer(user.id),
                        getThankYouNotes(user.id),
                        getPersonalizedSuggestions(user.id),
                        getReferralCount(user.id),
                        getLastCompletedRitual(user.id),
                        getUserConsultations()
                    ]);
                    console.timeEnd('AccountDataFetch');

                    // Extract results with fallbacks
                    const [
                        loyaltyResult,
                        tierResult,
                        referralResult,
                        transactionsResult,
                        birthdayResult,
                        notesResult,
                        suggestionsResult,
                        countResult,
                        lastRitualResult,
                        consultationsResult
                    ] = results.map(r => r.status === 'fulfilled' ? r.value : null);

                    if (loyaltyResult) setLoyaltyData(loyaltyResult);
                    if (tierResult) setTierBenefits(tierResult);

                    if (referralResult) {
                        setReferralCode(referralResult.referral_code);
                    } else {
                        try {
                            const codeResult = await createReferralCode(user.id);
                            if (codeResult.success && codeResult.code) setReferralCode(codeResult.code);
                        } catch (e) {
                            console.error('Error creating referral code:', e);
                        }
                    }

                    if (transactionsResult) setTransactions(transactionsResult);
                    if (birthdayResult) setBirthdayOffer(birthdayResult);
                    if (notesResult) setNotes(notesResult);
                    if (suggestionsResult) setSuggestions(suggestionsResult);
                    if (countResult !== null && countResult !== undefined) setReferralCount(countResult);
                    if (lastRitualResult) setLastRitual(lastRitualResult);
                    if (consultationsResult) setConsultations(consultationsResult as Consultation[]);
                }
            } catch (err) {
                console.error('Fatal error in fetchUserData:', err);
                toast.error("Some data failed to load. Please refresh.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/login');
        router.refresh();
    };

    const handleRedeemPoints = async () => {
        if (!redeemAmount || Number(redeemAmount) <= 0) { toast.error("Enter a valid amount to redeem."); return; }
        if (Number(redeemAmount) > (loyaltyData?.available_points || 0)) { toast.error("Not enough available points."); return; }
        setRedeemLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const result = await redeemPoints(user.id, Number(redeemAmount), "Self-redemption from dashboard");
            if (result.success) {
                toast.success(`✨ ${redeemAmount} points redeemed!`);
                setIsRedeeming(false);
                setRedeemAmount('');
                window.location.reload();
            } else {
                toast.error(result.error || "Failed to redeem points.");
            }
        }
        setRedeemLoading(false);
    };

    const handleApplyReferral = async () => {
        if (!enteredReferralCode.trim()) { toast.error("Please enter a referral code."); return; }
        setReferralLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const result = await useReferralCode(enteredReferralCode.trim(), user.id);
            if (result.success) {
                toast.success(result.message || "Referral applied! 🎉");
                setEnteredReferralCode('');
                window.location.reload();
            } else {
                toast.error(result.error || "Failed to apply referral code.");
            }
        }
        setReferralLoading(false);
    };

    const handleCopyCode = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(referralCode);
            setCodeCopied(true);
            toast.success('Code copied! Share it with friends 🎁');
            setTimeout(() => setCodeCopied(false), 2500);
        }
    };

    const tier = (loyaltyData?.tier || 'bronze').toLowerCase();
    const tc = tierColors[tier] || tierColors.bronze;
    const upcomingBookings = bookings.filter(b => ['pending', 'confirmed'].includes(b.status));
    const pastBookings = bookings.filter(b => ['completed', 'cancelled'].includes(b.status));
    const nextTier = tierBenefits.find(t => (t.min_points || 0) > (loyaltyData?.lifetime_points || 0));
    const progressPct = nextTier
        ? Math.min(100, ((loyaltyData?.lifetime_points || 0) / nextTier.min_points) * 100)
        : 100;

    const getTimeGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 17) return "Good Afternoon";
        return "Good Evening";
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#080809] overflow-x-hidden pb-28">
                {/* Hero skeleton */}
                <div className="h-52 w-full bg-white/[0.03] animate-pulse" />

                <div className="max-w-6xl mx-auto px-4 md:px-6 -mt-20 relative z-10">
                    {/* Profile header skeleton */}
                    <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start md:items-end mb-10 pt-2">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] bg-white/[0.06] animate-pulse shrink-0" />
                        <div className="flex-1 space-y-3 py-2">
                            <div className="h-5 w-24 bg-white/[0.06] rounded-full animate-pulse" />
                            <div className="h-10 w-56 bg-white/[0.06] rounded-xl animate-pulse" />
                            <div className="h-4 w-40 bg-white/[0.04] rounded-lg animate-pulse" />
                        </div>
                        <div className="flex gap-3">
                            <div className="w-28 h-11 rounded-2xl bg-white/[0.05] animate-pulse" />
                            <div className="w-11 h-11 rounded-2xl bg-white/[0.05] animate-pulse" />
                        </div>
                    </div>

                    {/* Stats skeleton */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white/[0.03] rounded-3xl p-5 border border-white/[0.06] animate-pulse">
                                <div className="w-10 h-10 rounded-2xl bg-white/[0.06] mb-3" />
                                <div className="h-3 w-16 bg-white/[0.05] rounded mb-2" />
                                <div className="h-7 w-20 bg-white/[0.06] rounded-lg" />
                            </div>
                        ))}
                    </div>

                    {/* Main grid skeleton */}
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                        <div className="xl:col-span-8 space-y-6">
                            {[...Array(2)].map((_, i) => (
                                <div key={i} className="rounded-[2rem] border border-white/[0.06] bg-white/[0.02] p-8 md:p-10 animate-pulse">
                                    <div className="h-7 w-48 bg-white/[0.06] rounded-xl mb-8" />
                                    <div className="space-y-3">
                                        {[...Array(3)].map((_, j) => (
                                            <div key={j} className="h-20 bg-white/[0.04] rounded-2xl" />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="xl:col-span-4 space-y-5">
                            <div className="h-64 rounded-[2rem] bg-white/[0.06] animate-pulse" />
                            <div className="h-32 rounded-[2rem] bg-white/[0.04] animate-pulse" />
                            <div className="h-28 rounded-[2rem] bg-white/[0.04] animate-pulse" />
                        </div>
                    </div>
                </div>

                {/* Loading label */}
                <div className="flex items-center justify-center mt-10 gap-3">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 rounded-full border border-transparent border-t-[#D4AF37]"
                    />
                    <p className="text-white/40 text-[10px] uppercase tracking-[0.4em] font-bold">Preparing your sanctuary…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#080809] text-white pb-28 font-sans selection:bg-primary-gold/30 overflow-x-hidden relative">

            {/* ─── Ambient Background ─── */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
                <FloatingOrb x="10%" y="10%" size={500} color={tc.glow} delay={0} />
                <FloatingOrb x="65%" y="5%" size={400} color="rgba(212,175,55,0.12)" delay={3} />
                <FloatingOrb x="80%" y="60%" size={350} color="rgba(255,255,255,0.04)" delay={5} />
                <FloatingOrb x="5%" y="70%" size={300} color="rgba(100,80,30,0.15)" delay={1.5} />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(212,175,55,0.07)_0%,transparent_60%)]" />
                {/* Subtle grid */}
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{ backgroundImage: 'linear-gradient(#D4AF37 1px, transparent 1px),linear-gradient(90deg,#D4AF37 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
            </div>

            {/* ─── Hero / Cover ─── */}
            <div className="relative h-52 w-full overflow-hidden z-10">
                {/* Background image */}
                <motion.div
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.3 }}
                    transition={{ duration: 2, ease: 'easeOut' }}
                    className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center"
                />
                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/15 via-transparent to-[#080809]" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#080809]/60 via-transparent to-[#080809]/60" />
                {/* Floating particles */}
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-0.5 h-0.5 bg-[#D4AF37]/50 rounded-full"
                        style={{ left: `${20 + i * 14}%`, bottom: '20%' }}
                        animate={{ y: [-10, -50, -10], opacity: [0, 0.8, 0] }}
                        transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.9 }}
                    />
                ))}
            </div>

            <div className="max-w-6xl mx-auto px-4 md:px-6 -mt-20 relative z-10">

                {/* ─── Profile Header ─── */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="flex flex-col md:flex-row gap-6 md:gap-10 items-start md:items-end mb-10 pt-2"
                >
                    {/* Avatar */}
                    <div className="relative group shrink-0">
                        {/* Glow ring behind avatar */}
                        <motion.div
                            animate={{ opacity: [0.3, 0.7, 0.3] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="absolute -inset-2 rounded-[2.5rem] blur-xl"
                            style={{ background: `linear-gradient(135deg, ${tc.from}80, ${tc.to}40)` }}
                        />
                        {/* White ring border from page background */}
                        <div className="absolute -inset-1 rounded-[2.5rem] bg-[#080809]" />
                        <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] overflow-hidden border-2 shadow-2xl bg-[#0D0D0F]"
                            style={{ borderColor: `${tc.from}60` }}>
                            {profile?.avatar_url ? (
                                <Image src={profile.avatar_url} alt="Profile" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center font-fraunces text-7xl font-bold"
                                    style={{ background: `linear-gradient(135deg, ${tc.from}22, ${tc.to}11)`, color: tc.from }}>
                                    {profile?.full_name?.[0]?.toUpperCase() || 'U'}
                                </div>
                            )}
                        </div>
                        <button className="absolute bottom-2 right-2 w-11 h-11 rounded-2xl flex items-center justify-center border-4 border-[#080809] hover:scale-110 transition-all shadow-xl"
                            style={{ background: tc.from }}>
                            <Camera className="w-4 h-4 text-black" />
                        </button>
                    </div>

                    {/* Name & Tier — sits below hero seam */}
                    <div className="flex-1 pt-4 md:pt-0 md:pb-1">
                        <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.25 }}
                            className={`inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.3em] font-black px-4 py-1.5 rounded-full border mb-3 ${tc.badge}`}
                        >
                            <Award className="w-3 h-3" />
                            {tier} member
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35 }}
                            className="font-fraunces text-3xl md:text-5xl font-bold mb-1.5 leading-tight"
                            style={{ backgroundImage: `linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.55) 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                        >
                            <span className="text-white/30 text-lg md:text-xl block mb-2 font-sans uppercase tracking-[0.2em] font-medium">{getTimeGreeting()},</span>
                            {profile?.full_name || 'Valued Client'}
                        </motion.h1>
                        <p className="text-white/50 text-sm">{profile?.email}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-end gap-4 pb-2 md:pb-0 shrink-0">
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-5 h-11 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium transition-all group">
                                <Settings className="w-4 h-4 text-white/50 group-hover:rotate-90 transition-transform duration-500" /> 
                                <span className="hidden md:inline">Settings</span>
                            </button>
                            <button onClick={handleSignOut} className="w-11 h-11 rounded-2xl bg-red-500/10 hover:bg-red-500 border border-red-500/20 flex items-center justify-center transition-all group">
                                <LogOut className="w-4 h-4 text-red-400 group-hover:text-white transition-colors" />
                            </button>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#D4AF37]/5 border border-[#D4AF37]/10">
                            <Shield className="w-3.5 h-3.5 text-[#D4AF37]/60" />
                            <span className="text-[9px] font-black uppercase tracking-[0.15em] text-[#D4AF37]/60">Member since 2024</span>
                        </div>
                    </div>
                </motion.div>

                {/* Birthday Offer Banner */}
                {birthdayOffer && !birthdayOffer.is_used && (
                    <BirthdayBanner offer={birthdayOffer} name={profile?.full_name || ''} />
                )}

                {/* Birthday Prompt (if DOB missing) */}
                {profile && !profile.date_of_birth && !birthdayOffer && (
                    <BirthdayPrompt
                        userId={userId}
                        onUpdate={() => window.location.reload()}
                    />
                )}

                {/* Points Expiry Warning */}
                {loyaltyData?.points_expire_at && (
                    <PointsExpiryWarning
                        expiryDate={loyaltyData.points_expire_at}
                        points={loyaltyData.available_points}
                    />
                )}

                {/* ─── Quick Stats Row ─── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
                >
                    {[
                        { label: 'Bookings', value: bookings.length, icon: <Scissors className="w-5 h-5" />, color: '#D4AF37' },
                        { label: 'Points', value: loyaltyData?.available_points || 0, icon: <Sparkles className="w-5 h-5" />, color: '#A78BFA' },
                        { label: 'Total Spent', value: `₹${(profile?.total_spent || 0).toLocaleString()}`, icon: <TrendingUp className="w-5 h-5" />, color: '#34D399' },
                        { label: 'Tier Rank', value: tier.charAt(0).toUpperCase() + tier.slice(1), icon: <Star className="w-5 h-5" />, color: tc.from },
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + i * 0.08 }}
                            whileHover={{ y: -4, scale: 1.02, backgroundColor: 'rgba(255,255,255,0.08)' }}
                            className="relative bg-white/[0.03] border border-white/[0.08] rounded-3xl p-6 overflow-hidden cursor-default transition-all group backdrop-blur-md shadow-2xl"
                        >
                            <div className="absolute top-0 left-0 w-full h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${stat.color}88, transparent)` }} />
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: `${stat.color}18`, color: stat.color }}>
                                    {stat.icon}
                                </div>
                                <motion.div 
                                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="w-1.5 h-1.5 rounded-full" 
                                    style={{ backgroundColor: stat.color }} 
                                />
                            </div>
                            <p className="text-[10px] uppercase tracking-[0.25em] font-bold text-white/40 mb-1.5">{stat.label}</p>
                            <p className="font-fraunces text-2xl md:text-3xl font-bold text-white tracking-tight">{stat.value}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Achievement Milestones */}
                <MilestoneBadges
                    totalVisits={bookings.filter(b => b.status === 'completed').length}
                    referralCount={referralCount}
                />

                {/* ─── Main Grid ─── */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

                    {/* Left: Bookings & Notes */}
                    <div className="xl:col-span-8 space-y-8">

                        {/* Thank You Notes */}
                        <ThankYouNotes notes={notes} />

                        {/* Personalized Suggestions */}
                        <ServiceSuggestions suggestions={suggestions} />

                        {/* Consultations */}
                        {consultations.length > 0 && (
                            <motion.div
                                initial={{ y: 24, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.52 }}
                                className="relative rounded-[2rem] overflow-hidden border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl"
                            >
                                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
                                <div className="p-8 md:p-10">
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="font-fraunces text-2xl font-bold flex items-center gap-3">
                                            <Sparkles className="w-6 h-6 text-[#D4AF37]" />
                                            Color Consultations
                                        </h3>
                                        <span className="text-[10px] uppercase tracking-[0.25em] font-bold px-4 py-1.5 rounded-full bg-white/5 text-white/30 border border-white/5">
                                            {consultations.length} Total
                                        </span>
                                    </div>
                                    <div className="space-y-3">
                                        {consultations.map((consult, i) => (
                                            <motion.div
                                                key={consult.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                onClick={() => router.push(`/dashboard/consultations/${consult.id}`)}
                                                className="group relative p-5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] hover:border-[#D4AF37]/30 rounded-2xl cursor-pointer transition-all flex items-center justify-between gap-4"
                                            >
                                                <div>
                                                    <h4 className="font-bold text-white group-hover:text-[#D4AF37] transition-colors">{consult.selected_color_name}</h4>
                                                    <p className="text-xs text-white/40 mt-1">{new Date(consult.created_at).toLocaleDateString()}</p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border ${
                                                        consult.status === 'approved' ? 'text-green-400 bg-green-500/10 border-green-500/20' : 
                                                        consult.status === 'rejected' ? 'text-red-400 bg-red-500/10 border-red-500/20' : 
                                                        'text-[#D4AF37] bg-[#D4AF37]/10 border-[#D4AF37]/20'
                                                    }`}>
                                                        {consult.status}
                                                    </span>
                                                    <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-[#D4AF37] transition-colors" />
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Upcoming Rituals */}
                        <motion.div
                            initial={{ y: 24, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.55 }}
                            className="relative rounded-[2rem] overflow-hidden border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl"
                        >
                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
                            <div className="p-8 md:p-10">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="font-fraunces text-2xl font-bold flex items-center gap-3">
                                        <motion.span animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 3, repeat: Infinity, delay: 1 }}>
                                            <Sparkles className="w-6 h-6 text-[#D4AF37]" />
                                        </motion.span>
                                        Upcoming Rituals
                                    </h3>
                                    <span className="text-[10px] uppercase tracking-[0.25em] font-bold px-4 py-1.5 rounded-full bg-white/5 text-white/30 border border-white/5">
                                        {upcomingBookings.length} Active
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    <AnimatePresence>
                                        {upcomingBookings.length > 0 ? upcomingBookings.map((booking, i) => (
                                            <motion.div
                                                key={booking.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                whileHover={{ x: 4 }}
                                                className="group relative p-5 md:p-6 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/[0.15] rounded-2xl cursor-pointer transition-all overflow-hidden"
                                            >
                                                <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl ${booking.status === 'confirmed' ? 'bg-emerald-400' : 'bg-[#D4AF37]'}`} />
                                                <div className="flex items-center justify-between gap-4 pl-3">
                                                    <div className="flex items-center gap-5">
                                                        <div className="w-13 h-13 w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center text-black"
                                                            style={{ background: `linear-gradient(135deg, #D4AF37, #AA8015)` }}>
                                                            <Scissors className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-white group-hover:text-[#D4AF37] transition-colors text-sm md:text-base">{booking.service_name}</h4>
                                                            <div className="flex items-center flex-wrap gap-3 mt-1.5">
                                                                <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-white/40">
                                                                    <Calendar className="w-3 h-3 text-[#D4AF37]" />
                                                                    {new Date(booking.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                                </span>
                                                                <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-white/40">
                                                                    <Clock className="w-3 h-3 text-[#D4AF37]" />
                                                                    {booking.time}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3 shrink-0">
                                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border ${booking.status === 'confirmed' ? 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20' : 'text-[#D4AF37] bg-[#D4AF37]/10 border-[#D4AF37]/20'}`}>
                                                            {booking.status}
                                                        </span>
                                                        <div className="w-9 h-9 rounded-full bg-white/5 group-hover:bg-[#D4AF37] flex items-center justify-center transition-all">
                                                            <ChevronRight className="w-4 h-4 group-hover:text-black transition-colors" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )) : (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-white/[0.07] rounded-2xl"
                                            >
                                                <motion.div
                                                    animate={{ y: [0, -10, 0] }}
                                                    transition={{ duration: 3, repeat: Infinity }}
                                                    className="w-20 h-20 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mb-5"
                                                >
                                                    <Calendar className="w-9 h-9 text-[#D4AF37]/60" />
                                                </motion.div>
                                                <p className="text-white/50 text-sm font-medium mb-6">Your schedule is clear</p>
                                                <button className="px-8 py-3 rounded-2xl bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors shadow-lg shadow-[#D4AF37]/20">
                                                    Book a Ritual
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.div>

                        {/* Ritual Archive */}
                        <motion.div
                            initial={{ y: 24, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.65 }}
                            className="rounded-[2rem] border border-white/[0.06] bg-white/[0.015] backdrop-blur-xl overflow-hidden"
                        >
                            <div className="p-8 md:p-10">
                                <h3 className="font-fraunces text-xl font-bold flex items-center gap-3 mb-7 text-white/70">
                                    <History className="w-5 h-5 text-white/25" /> Ritual Archive
                                </h3>
                                <div className="space-y-3">
                                    {pastBookings.length > 0 ? pastBookings.map((booking, i) => (
                                        <motion.div
                                            key={booking.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: i * 0.06 }}
                                            className="p-5 bg-black/20 rounded-2xl flex items-center justify-between opacity-50 hover:opacity-100 transition-opacity group border border-white/[0.04] hover:border-white/[0.1]"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${booking.status === 'completed' ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                                                    {booking.status === 'completed'
                                                        ? <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                                        : <XCircle className="w-5 h-5 text-red-400" />}
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-bold text-white/90 group-hover:text-white transition-colors">{booking.service_name}</h4>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className={`text-[9px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full ${booking.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                                            {booking.status}
                                                        </span>
                                                        <span className="text-[10px] font-mono text-white/50">{new Date(booking.date).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {booking.status === 'completed' && (
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const slug = booking.service_name.toLowerCase().replace(/\s+/g, '-');
                                                            router.push(`/book?service=${slug}`);
                                                        }}
                                                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-[#D4AF37] text-white/40 hover:text-black text-[9px] font-black uppercase tracking-widest transition-all border border-white/5 hover:border-[#D4AF37] opacity-0 group-hover:opacity-100"
                                                    >
                                                        Rebook
                                                    </button>
                                                )}
                                                <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-[#D4AF37] transition-colors" />
                                            </div>
                                        </motion.div>
                                    )) : (
                                        <div className="py-12 text-center rounded-2xl border border-white/5 bg-black/10">
                                            <p className="text-white/45 text-sm italic">Your story is just beginning…</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* ─── Right Column ─── */}
                    <div className="xl:col-span-4 space-y-5">

                        {/* Loyalty Points Card */}
                        <motion.div
                            initial={{ x: 30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.7, delay: 0.5 }}
                            className="relative rounded-[2rem] overflow-hidden"
                            style={{ boxShadow: `0 25px 60px -15px ${tc.glow}` }}
                        >
                            <div className="absolute inset-0" style={{ background: `linear-gradient(145deg, ${tc.from}, ${tc.via}, ${tc.to})` }} />
                            {/* Shine effect */}
                            <motion.div
                                animate={{ x: ['-100%', '200%'] }}
                                transition={{ duration: 3, repeat: Infinity, repeatDelay: 4, ease: 'easeInOut' }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]"
                            />
                            {/* Orb glow */}
                            <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/25 rounded-full blur-[60px]" />
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-black/20 rounded-full blur-[40px]" />

                            <div className="relative z-10 p-8">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-6">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-[0.35em] font-black text-black/60 mb-1">Hideaway Rewards</p>
                                        <motion.div
                                            initial={{ scale: 0.5 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: 'spring', stiffness: 200, delay: 0.8 }}
                                            className="flex items-baseline gap-2"
                                        >
                                            <span className="font-fraunces text-7xl font-black text-black/90 leading-none">
                                                {loyaltyData?.available_points || 0}
                                            </span>
                                            <Zap className="w-6 h-6 text-black/50 mb-2" />
                                        </motion.div>
                                    </div>
                                    <span className="text-[10px] uppercase tracking-[0.2em] font-black bg-black/20 text-black/70 px-3 py-1.5 rounded-full backdrop-blur-sm border border-black/10">
                                        {tier}
                                    </span>
                                </div>

                                {/* Progress */}
                                <div className="mb-6 bg-black/30 p-5 rounded-2xl backdrop-blur-xl border border-black/10 relative overflow-hidden group/progress">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover/progress:opacity-100 transition-opacity" />
                                    {nextTier ? (
                                        <>
                                            <div className="flex justify-between items-end mb-3 relative z-10">
                                                <div>
                                                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-black/50 mb-1">Ascending To</p>
                                                    <p className="text-sm font-black text-black/90 uppercase tracking-widest">{nextTier.tier_name}</p>
                                                </div>
                                                <p className="text-[10px] font-black text-black/80 bg-black/10 px-2 py-1 rounded-lg">
                                                    {Math.max(0, nextTier.min_points - (loyaltyData?.lifetime_points || 0))} pts remaining
                                                </p>
                                            </div>
                                            <div className="w-full bg-black/20 h-3 rounded-full overflow-hidden relative z-10 border border-black/5">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${progressPct}%` }}
                                                    transition={{ duration: 2, delay: 1, ease: 'circOut' }}
                                                    className="h-full rounded-full bg-black/80 relative overflow-hidden"
                                                >
                                                    <motion.div
                                                        animate={{ x: ['-100%', '200%'] }}
                                                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                                    />
                                                </motion.div>
                                            </div>
                                            <div className="mt-3 flex justify-between items-center relative z-10">
                                                <span className="text-[8px] font-black text-black/40 uppercase tracking-widest">{tier}</span>
                                                <span className="text-[8px] font-black text-black/40 uppercase tracking-widest">{nextTier.tier_name}</span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex items-center gap-3 py-2 relative z-10">
                                            <div className="w-10 h-10 rounded-full bg-black/20 flex items-center justify-center">
                                                <Shield className="w-5 h-5 text-black/60" />
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-black/50">Elite Status</p>
                                                <p className="text-sm font-black text-black/90">Maximum Tier Reached</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Redeem Button */}
                                <button
                                    onClick={() => setIsRedeeming(!isRedeeming)}
                                    className="w-full h-14 rounded-2xl bg-black/80 hover:bg-black text-[#D4AF37] font-black text-[11px] uppercase tracking-[0.25em] flex items-center justify-center gap-2 transition-all hover:shadow-xl"
                                >
                                    <Gift className="w-4 h-4" />
                                    {isRedeeming ? 'Cancel' : 'Redeem Points'}
                                </button>

                                {/* Redeem Panel */}
                                <AnimatePresence>
                                    {isRedeeming && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                            animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="p-4 bg-black/30 rounded-2xl border border-black/20 backdrop-blur-md">
                                                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-black/60 mb-3">Select Amount</p>
                                                <div className="grid grid-cols-4 gap-1.5 mb-3">
                                                    {[50, 100, 200, 500].map(val => {
                                                        const isDisabled = val > (loyaltyData?.available_points || 0);
                                                        return (
                                                            <button
                                                                key={val}
                                                                disabled={isDisabled}
                                                                onClick={() => {
                                                                    const curr = Number(redeemAmount || 0);
                                                                    const next = curr + val;
                                                                    setRedeemAmount(next > (loyaltyData?.available_points || 0) ? (loyaltyData?.available_points || 0) : next);
                                                                }}
                                                                className="py-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-black text-black/80 transition-all"
                                                            >
                                                                +{val}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="number"
                                                        value={redeemAmount}
                                                        onChange={e => setRedeemAmount(Number(e.target.value))}
                                                        max={loyaltyData?.available_points || 0}
                                                        placeholder="Custom…"
                                                        className="flex-1 h-11 bg-black/30 border border-black/20 rounded-xl px-3 text-sm font-bold text-black/80 placeholder:text-black/30 focus:outline-none focus:ring-1 focus:ring-black/30"
                                                    />
                                                    <button
                                                        onClick={handleRedeemPoints}
                                                        disabled={redeemLoading || !redeemAmount || Number(redeemAmount) <= 0}
                                                        className="h-11 px-5 bg-black/80 hover:bg-black text-[#D4AF37] rounded-xl font-black text-xs uppercase tracking-wider disabled:opacity-40 transition-all"
                                                    >
                                                        {redeemLoading ? '…' : 'Apply'}
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>

                        {/* Referral Code — Enter */}
                        <motion.div
                            initial={{ x: 30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="relative rounded-[2rem] border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl overflow-hidden p-6"
                        >
                            <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-[#D4AF37]/10 rounded-full blur-3xl" />
                            <div className="flex items-center gap-3 mb-4 relative z-10">
                                <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-[#D4AF37]/10">
                                    <Gift className="w-5 h-5 text-[#D4AF37]" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-sm">Have a Referral Code?</h4>
                                    <p className="text-[11px] text-white/35">Claim your instant bonus</p>
                                </div>
                            </div>
                            <div className="flex gap-2 relative z-10">
                                <input
                                    type="text"
                                    value={enteredReferralCode}
                                    onChange={e => setEnteredReferralCode(e.target.value.toUpperCase())}
                                    placeholder="ELG12345"
                                    className="flex-1 h-12 bg-black/40 border border-white/[0.08] hover:border-white/[0.15] focus:border-[#D4AF37]/40 rounded-2xl px-4 text-white placeholder:text-white/20 font-mono tracking-widest text-sm focus:outline-none transition-all"
                                />
                                <button
                                    onClick={handleApplyReferral}
                                    disabled={referralLoading}
                                    className="h-12 px-5 bg-[#D4AF37] hover:bg-white text-black font-black text-xs uppercase tracking-[0.2em] rounded-2xl transition-all hover:shadow-lg hover:shadow-[#D4AF37]/20 disabled:opacity-50"
                                >
                                    {referralLoading ? '…' : 'Claim'}
                                </button>
                            </div>
                        </motion.div>

                        {/* Your Referral Code — Share */}
                        {referralCode && (
                            <motion.div
                                initial={{ x: 30, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.7 }}
                                className="relative rounded-[2rem] border border-[#D4AF37]/20 bg-[#D4AF37]/[0.03] backdrop-blur-xl overflow-hidden p-6 group hover:border-[#D4AF37]/40 transition-all"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="flex items-center gap-3 mb-3 relative z-10">
                                    <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/15 flex items-center justify-center">
                                        <Users className="w-5 h-5 text-[#D4AF37]" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-sm">Share the Love</h4>
                                        <p className="text-[11px] text-white/35">Earn <strong className="text-[#D4AF37]">100 pts</strong> per referral</p>
                                    </div>
                                </div>
                                <motion.div
                                    whileTap={{ scale: 0.97 }}
                                    onClick={handleCopyCode}
                                    className="relative z-10 flex items-center justify-between bg-black/30 hover:bg-black/50 border border-white/[0.08] hover:border-[#D4AF37]/30 rounded-2xl p-3 px-4 cursor-pointer transition-all group/copy"
                                >
                                    <code className="font-mono text-[#D4AF37] font-black tracking-[0.25em] text-sm">{referralCode}</code>
                                    <motion.div
                                        animate={codeCopied ? { scale: [1, 1.3, 1] } : {}}
                                        className="w-8 h-8 rounded-xl bg-white/5 group-hover/copy:bg-[#D4AF37]/20 flex items-center justify-center transition-all"
                                    >
                                        {codeCopied
                                            ? <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                            : <Copy className="w-4 h-4 text-white/40 group-hover/copy:text-[#D4AF37] transition-colors" />}
                                    </motion.div>
                                </motion.div>
                            </motion.div>
                        )}

                        {/* Points Activity */}
                        {transactions && transactions.length > 0 && (
                            <motion.div
                                initial={{ x: 30, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.8 }}
                                className="rounded-[2rem] border border-white/[0.06] bg-white/[0.025] backdrop-blur-xl overflow-hidden p-6"
                            >
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-9 h-9 rounded-2xl bg-white/5 flex items-center justify-center">
                                        <Receipt className="w-4 h-4 text-white/30" />
                                    </div>
                                    <h4 className="font-bold text-white/60 text-sm tracking-wide">Points Activity</h4>
                                </div>
                                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                                    {transactions.slice(0, 6).map((tx, i) => (
                                        <motion.div
                                            key={tx.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.85 + i * 0.06 }}
                                            className="flex items-center justify-between text-xs p-3 rounded-xl bg-black/20 border border-white/[0.04] hover:border-white/[0.1] transition-colors"
                                        >
                                            <div className="flex-1 pr-3 min-w-0">
                                                <p className="text-white/80 font-medium truncate">{tx.description}</p>
                                                <p className="text-white/45 text-[10px] font-mono mt-0.5">{new Date(tx.created_at).toLocaleDateString()}</p>
                                            </div>
                                            <span className={`shrink-0 font-black px-2.5 py-1 rounded-xl text-[11px] ${tx.points > 0 ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/15' : 'text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/15'}`}>
                                                {tx.points > 0 ? '+' : ''}{tx.points}
                                            </span>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Visual Invite Studio / Creator Kit */}
                        <motion.div
                            initial={{ x: 30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.9 }}
                            className="relative rounded-[2.5rem] border border-white/[0.08] bg-white/[0.02] backdrop-blur-2xl overflow-hidden p-8 group/kit"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover/kit:bg-[#D4AF37]/10 transition-colors duration-1000" />
                            <div className="relative z-10 mb-10">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-fraunces text-2xl md:text-3xl font-bold flex items-center gap-3">
                                        <Camera className="w-6 h-6 text-[#D4AF37]" />
                                        The Creator Kit
                                    </h3>
                                    <div className="px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                                        <span className="text-[8px] font-black uppercase tracking-widest text-[#D4AF37]">Pro Tools</span>
                                    </div>
                                </div>
                                <p className="text-white/40 text-[10px] uppercase font-bold tracking-[0.3em]">
                                    Authentic Invitations • Smart Referral Assets
                                </p>
                            </div>
                            
                            <div className="relative z-10">
                                <VisualInviteStudio
                                    referralCode={referralCode}
                                    lastRitual={lastRitual}
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
