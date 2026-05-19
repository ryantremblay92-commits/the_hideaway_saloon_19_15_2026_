"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

import {
    Users,
    Search,
    Sparkles,
    ArrowUpCircle,
    ArrowDownCircle,
    History,
    Shield
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

interface Client {
    id: string;
    full_name: string;
    email: string;
    loyalty_points: number;
    total_spent: number;
    created_at: string;
}

export default function ClientsPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();

    const fetchClients = async () => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error) setClients(data);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const adjustPoints = async (id: string, amount: number) => {
        const client = clients.find(c => c.id === id);
        if (!client) return;

        const newPoints = (client.loyalty_points || 0) + amount;

        const { error } = await supabase
            .from('profiles')
            .update({ loyalty_points: newPoints })
            .eq('id', id);

        if (error) {
            toast.error("Correction failed");
        } else {
            toast.success(`Ritual balance adjusted by ${amount > 0 ? '+' : ''}${amount}`);
            fetchClients();
        }
    };

    const filteredClients = clients.filter(c =>
        c.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-12 pb-24">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col xl:flex-row xl:items-end justify-between gap-10"
            >
                <div className="space-y-4">
                    <div className="px-3 py-1 bg-primary-gold/10 border border-primary-gold/20 rounded-full w-fit">
                        <span className="text-[10px] font-bold text-primary-gold uppercase tracking-[0.3em]">Clientele Registry</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-fraunces font-light tracking-tight text-white leading-[0.9]">
                        Aesthetic <span className="text-primary-gold italic">Directory</span>
                    </h1>
                    <p className="text-white/30 text-sm max-w-md font-light leading-relaxed">
                        Your inner circle. Manage elite clientele, loyalty balances, and ritual histories.
                    </p>
                </div>
            </motion.div>

            {/* Search & Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-2 relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-primary-gold transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by name or transmission..."
                        className="w-full h-16 pl-16 pr-6 bg-white/[0.03] border border-white/10 rounded-2xl focus:outline-none focus:border-primary-gold/50 text-white transition-all backdrop-blur-2xl"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="elite-glass p-6 rounded-2xl flex items-center gap-5">
                    <div className="w-14 h-14 bg-primary-gold/10 rounded-2xl flex items-center justify-center text-primary-gold border border-primary-gold/20">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-white/20 tracking-[0.3em]">Inner Circle</p>
                        <p className="text-3xl font-fraunces font-light text-white mt-0.5">{clients.length}</p>
                    </div>
                </div>
            </div>

            {/* Clients Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="elite-glass rounded-[3rem] overflow-hidden shadow-luxury"
            >
                <div className="p-10 border-b border-white/[0.04] flex items-center justify-between bg-white/[0.01]">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary-gold/10 rounded-2xl flex items-center justify-center text-primary-gold border border-primary-gold/20">
                            <Shield className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-fraunces text-2xl font-light text-white">Inner Circle</h3>
                            <p className="text-[10px] text-white/20 uppercase tracking-[0.3em] font-bold mt-1">Member Profiles</p>
                        </div>
                    </div>
                    <span className="text-[10px] font-mono text-white/20 tracking-widest px-4 py-2 bg-white/5 rounded-xl border border-white/5">{filteredClients.length} Members</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/[0.04] bg-white/[0.01]">
                                <th className="px-10 py-8 text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">Member Profile</th>
                                <th className="px-10 py-8 text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">Loyalty Balance</th>
                                <th className="px-10 py-8 text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">Total Investment</th>
                                <th className="px-10 py-8 text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">Management</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                            {isLoading ? (
                                <tr><td colSpan={4} className="px-10 py-32 text-center">
                                    <div className="flex flex-col items-center gap-6">
                                        <div className="relative"><div className="w-16 h-16 border-[1px] border-white/5 rounded-full" /><div className="absolute inset-0 w-16 h-16 border-t-[1px] border-primary-gold rounded-full animate-spin" /></div>
                                        <p className="text-white/20 text-xs font-bold uppercase tracking-[0.4em] animate-pulse">Loading Members...</p>
                                    </div>
                                </td></tr>
                            ) : filteredClients.length === 0 ? (
                                <tr><td colSpan={4} className="px-10 py-32 text-center">
                                    <p className="text-white/20 font-fraunces italic text-xl">The directory is empty.</p>
                                </td></tr>
                            ) : filteredClients.map((client, idx) => (
                                <motion.tr
                                    key={client.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.04 }}
                                    className="group hover:bg-white/[0.02] transition-all duration-500 cursor-pointer"
                                >
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-6">
                                            <div className="relative">
                                                <div className="w-16 h-16 rounded-2xl bg-[#0F0F0F] border border-white/5 flex items-center justify-center text-2xl font-fraunces text-white/20 group-hover:border-primary-gold/30 group-hover:text-primary-gold transition-all duration-700">
                                                    {client.full_name?.[0] || 'U'}
                                                </div>
                                                <div className="absolute -inset-1 bg-primary-gold opacity-0 group-hover:opacity-10 blur-xl rounded-full transition-opacity duration-700" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-white text-lg group-hover:text-primary-gold transition-colors">{client.full_name || 'Anonymous'}</p>
                                                <p className="text-[11px] text-white/20 italic mt-1">{client.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-3">
                                            <Sparkles className="w-5 h-5 text-primary-gold" />
                                            <span className="text-2xl font-fraunces font-light text-white">{client.loyalty_points || 0}</span>
                                            <span className="text-[9px] text-primary-gold/40 uppercase tracking-widest font-bold">pts</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <p className="text-xl font-fraunces font-light text-white">₹{(client.total_spent || 0).toLocaleString()}</p>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                                            <button onClick={() => adjustPoints(client.id, 50)} className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl hover:bg-emerald-500 text-emerald-400 hover:text-white transition-all flex items-center justify-center" title="Add Points">
                                                <ArrowUpCircle className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => adjustPoints(client.id, -50)} className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-2xl hover:bg-red-500 text-red-400 hover:text-white transition-all flex items-center justify-center" title="Deduct Points">
                                                <ArrowDownCircle className="w-5 h-5" />
                                            </button>
                                            <button className="w-12 h-12 bg-primary-gold/10 border border-primary-gold/20 rounded-2xl hover:bg-primary-gold text-primary-gold hover:text-primary-charcoal transition-all flex items-center justify-center">
                                                <History className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
}
