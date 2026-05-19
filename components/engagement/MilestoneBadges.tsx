'use client';

import { motion } from 'framer-motion';
import { Award, Star, Gem, Trophy, Crown, Zap } from 'lucide-react';

const MILESTONES = [
    { visits: 1, label: 'First Ritual', emoji: '🌟', icon: <Star className="w-5 h-5" />, color: '#D4AF37', border: 'border-yellow-500/30', bg: 'bg-yellow-500/10', text: 'text-yellow-400', desc: 'Welcome to The Hideaway family!' },
    { visits: 5, label: 'Regular', emoji: '💎', icon: <Gem className="w-5 h-5" />, color: '#60A5FA', border: 'border-blue-500/30', bg: 'bg-blue-500/10', text: 'text-blue-400', desc: '5 visits strong! You are a familiar face.' },
    { visits: 10, label: 'Loyalist', emoji: '👑', icon: <Crown className="w-5 h-5" />, color: '#A78BFA', border: 'border-purple-500/30', bg: 'bg-purple-500/10', text: 'text-purple-400', desc: 'Elite status! 10 rituals completed.' },
    { visits: 25, label: 'Elite', emoji: '🏆', icon: <Trophy className="w-5 h-5" />, color: '#F472B6', border: 'border-pink-500/30', bg: 'bg-pink-500/10', text: 'text-pink-400', desc: 'VIP Guest. You are part of our inner circle.' },
    { referrals: 5, label: 'Referral Master', emoji: '🌑', icon: <Zap className="w-5 h-5" />, color: '#FFFFFF', border: 'border-white/50', bg: 'bg-white/20', text: 'text-white shadow-[0_0_10px_rgba(255,255,255,0.3)]', desc: 'Master of Growth. You have invited 5+ friends!', isBlack: true },
    { visits: 50, label: 'Legend', emoji: '🔱', icon: <Zap className="w-5 h-5" />, color: '#34D399', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', text: 'text-emerald-400', desc: 'Absolute legend. The gold standard.' },
];

export function MilestoneBadges({ totalVisits, referralCount = 0 }: { totalVisits: number, referralCount?: number }) {
    const nextMilestone = MILESTONES.find(m => (m.visits && totalVisits < m.visits) || (m.referrals && referralCount < m.referrals));

    return (
        <div className="mb-10">
            <div className="flex items-center justify-between mb-5 px-1">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center">
                        <Award className="w-4 h-4 text-[#D4AF37]" />
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.3em] font-black text-white/30">
                        Your Achievements
                    </p>
                </div>
                {nextMilestone && (
                    <p className="text-[11px] text-white/20">
                        🎯 <strong className="text-white/40">
                            {nextMilestone.visits
                                ? `${nextMilestone.visits - totalVisits} more visits`
                                : `${(nextMilestone.referrals || 0) - referralCount} more referrals`}
                        </strong> to <strong className="text-white/40">{nextMilestone.label}</strong>
                    </p>
                )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {MILESTONES.map((m, i) => {
                    const isUnlocked = m.visits ? totalVisits >= m.visits : (m.referrals ? referralCount >= m.referrals : false);
                    return (
                        <motion.div
                            key={m.label}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.08, type: 'spring', stiffness: 200 }}
                            whileHover={isUnlocked ? { y: -4, scale: 1.02 } : {}}
                            title={m.desc}
                            className={`relative flex flex-col items-center gap-2 p-5 rounded-[2rem] border transition-all duration-300 ${isUnlocked
                                ? `bg-white/[0.04] ${m.border} ${m.text}`
                                : 'border-white/[0.04] bg-white/[0.01] opacity-20 grayscale'
                                } ${m.isBlack && isUnlocked ? 'shadow-[0_0_20px_rgba(255,255,255,0.1)]' : ''}`}
                        >
                            {/* Inner Glow */}
                            {isUnlocked && (
                                <div className={`absolute inset-0 rounded-[2rem] opacity-20 blur-xl ${m.bg}`} />
                            )}

                            {/* Milestone Marker */}
                            {isUnlocked && (
                                <motion.div
                                    animate={{
                                        scale: [1, 1.3, 1],
                                        opacity: [0.5, 1, 0.5]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                                    className={`absolute top-3 right-4 w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor]`}
                                    style={{ backgroundColor: m.color }}
                                />
                            )}

                            <div className={`relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-transform duration-500 ${isUnlocked ? 'scale-110 shadow-lg' : ''}`}>
                                {m.icon}
                            </div>

                            <div className="relative z-10 text-center">
                                <p className={`text-[9px] font-black uppercase tracking-[0.2em] mb-0.5 ${isUnlocked ? 'text-white' : 'text-white/40'}`}>
                                    {m.label}
                                </p>
                                <p className={`text-[10px] font-bold opacity-30`}>
                                    {m.visits ? `${m.visits} Visit${m.visits > 1 ? 's' : ''}` : `${m.referrals || 0} Referral${(m.referrals || 0) > 1 ? 's' : ''}`}
                                </p>
                            </div>

                            {/* Unlocked Particles (Subtle) */}
                            {isUnlocked && (
                                <motion.div
                                    className="absolute inset-0 pointer-events-none"
                                    animate={{ opacity: [0, 1, 0] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                >
                                    <div className="absolute top-2 left-4 w-px h-px bg-white" />
                                    <div className="absolute bottom-4 right-6 w-px h-px bg-white" />
                                </motion.div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
