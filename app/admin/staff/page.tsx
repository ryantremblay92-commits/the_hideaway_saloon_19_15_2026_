"use client";

import React from "react";
import { createClient } from "@/lib/supabase/client";
import { 
    Users, 
    UserPlus, 
    ShieldCheck, 
    Scissors, 
    CheckCircle2, 
    XCircle,
    MoreHorizontal,
    Search
} from "lucide-react";
import { motion } from "framer-motion";

export default function StaffManagementPage() {
    const [profiles, setProfiles] = React.useState<any[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [searchTerm, setSearchTerm] = React.useState("");
    const supabase = createClient();

    const fetchProfiles = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('role', { ascending: true });
        
        if (data) setProfiles(data);
        setIsLoading(false);
    };

    React.useEffect(() => {
        fetchProfiles();
    }, []);

    const updateRole = async (userId: string, newRole: string) => {
        const { error } = await supabase
            .from('profiles')
            .update({ role: newRole })
            .eq('id', userId);
        
        if (!error) {
            if (newRole === 'employee') {
                const { data: existing } = await supabase
                    .from('staff_profiles')
                    .select('id')
                    .eq('id', userId)
                    .maybeSingle();
                
                if (!existing) {
                    await supabase
                        .from('staff_profiles')
                        .insert([{ 
                            id: userId, 
                            expertise: ['Generalist'], 
                            commission_rate: 0.10 
                        }]);
                }
            }
            fetchProfiles();
            toast.success(`Role updated to ${newRole}`);
        }
    };

    const filteredProfiles = profiles.filter(p => 
        p.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-12 pb-20">
            {/* Cinematic Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-8">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-2"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-[1px] bg-primary-gold" />
                        <span className="text-[10px] font-bold text-primary-gold uppercase tracking-[0.4em]">Administrative Hub</span>
                    </div>
                    <h1 className="font-fraunces text-6xl font-light text-white leading-none">
                        Team <span className="italic">Directory</span>
                    </h1>
                    <p className="text-white/40 font-light italic text-lg">Orchestrate permissions and access for The Hideaway collective.</p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="relative w-full md:w-96 group"
                >
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary-gold transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search collective..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 pl-14 pr-8 text-sm focus:outline-none focus:border-primary-gold/30 transition-all font-light italic placeholder:text-white/10"
                    />
                </motion.div>
            </div>

            {/* Elite Table */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="elite-glass rounded-[3rem] overflow-hidden shadow-luxury"
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/[0.04] bg-white/[0.01]">
                                <th className="px-10 py-8 text-[10px] uppercase tracking-[0.3em] font-bold text-white/20">Member Profile</th>
                                <th className="px-10 py-8 text-[10px] uppercase tracking-[0.3em] font-bold text-white/20">Authority</th>
                                <th className="px-10 py-8 text-[10px] uppercase tracking-[0.3em] font-bold text-white/20">Telemetry</th>
                                <th className="px-10 py-8 text-[10px] uppercase tracking-[0.3em] font-bold text-white/20 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                            {filteredProfiles.map((profile, idx) => (
                                <motion.tr 
                                    key={profile.id} 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="group hover:bg-white/[0.02] transition-all duration-500"
                                >
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-6">
                                            <div className="relative w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center font-fraunces text-2xl text-primary-gold group-hover:border-primary-gold/30 transition-all duration-700 overflow-hidden">
                                                <div className="absolute inset-0 bg-gradient-to-br from-primary-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                <span className="relative z-10">{profile.full_name?.[0] || 'U'}</span>
                                            </div>
                                            <div>
                                                <p className="font-fraunces text-xl text-white group-hover:text-primary-gold transition-colors duration-500">{profile.full_name || "New User"}</p>
                                                <p className="text-xs text-white/20 font-mono tracking-tight mt-1">{profile.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] border
                                            ${profile.role === 'admin' ? 'bg-primary-gold/10 text-primary-gold border-primary-gold/20 shadow-[0_0_15px_rgba(201,169,98,0.1)]' : 
                                              profile.role === 'employee' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                                              'bg-white/5 text-white/20 border-white/10'}`}
                                        >
                                            {profile.role === 'admin' && <ShieldCheck className="w-3 h-3 mr-2" />}
                                            {profile.role === 'employee' && <Scissors className="w-3 h-3 mr-2" />}
                                            {profile.role}
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)] animate-pulse" />
                                            <span className="text-[10px] text-white/40 uppercase tracking-[0.1em] font-bold">Synchronized</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <div className="flex items-center justify-end gap-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                                            {profile.role === 'user' && (
                                                <button 
                                                    onClick={() => updateRole(profile.id, 'employee')}
                                                    className="h-10 px-6 rounded-xl bg-primary-gold text-primary-charcoal hover:bg-white transition-all text-[10px] font-bold uppercase tracking-widest shadow-luxury"
                                                >
                                                    Elevate to Staff
                                                </button>
                                            )}
                                            {profile.role === 'employee' && (
                                                <button 
                                                    onClick={() => updateRole(profile.id, 'user')}
                                                    className="h-10 px-6 rounded-xl bg-white/[0.05] text-white/40 border border-white/10 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/20 transition-all text-[10px] font-bold uppercase tracking-widest"
                                                >
                                                    Revoke Access
                                                </button>
                                            )}
                                            <button className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 text-white/20 hover:text-white hover:border-primary-gold/30 transition-all flex items-center justify-center">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredProfiles.length === 0 && (
                    <div className="py-32 text-center">
                        <Users className="w-12 h-12 text-white/5 mx-auto mb-4" />
                        <p className="text-white/20 font-fraunces italic text-xl">No collective members found matching your query.</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
