"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Calendar,
    Search,
    Filter,
    MoreHorizontal,
    CheckCircle2,
    XCircle,
    Clock,
    Phone,
    Mail,
    Plus,
    ChevronRight,
    Printer,
    Download
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { completeBooking } from "@/lib/actions/engagement";
import { toast } from "sonner";

interface Booking {
    id: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    service_name: string;
    date: string;
    time: string;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    created_at: string;
}

const statusColors = {
    pending: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    confirmed: "text-green-400 bg-green-400/10 border-green-400/20",
    cancelled: "text-red-400 bg-red-400/10 border-red-400/20",
    completed: "text-blue-400 bg-blue-400/10 border-blue-400/20",
};

export default function BookingsPage() {
    const supabase = createClient();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("all");

    useEffect(() => {
        const fetchBookings = async () => {
            const { data, error } = await supabase
                .from('bookings')
                .select('*')
                .order('date', { ascending: true })
                .order('time', { ascending: true });

            if (data) setBookings(data);
            setIsLoading(false);
        };

        fetchBookings();

        // Subscribe to real-time updates
        const channel = supabase
            .channel('bookings_updates')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => {
                fetchBookings();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase]);

    const updateBookingStatus = async (id: string, status: string) => {
        if (status === 'completed') {
            const result = await completeBooking(id);
            if (result.success) {
                toast.success("Ritual marked as completed!");
            } else {
                toast.error(result.error || "Failed to complete ritual");
            }
            return;
        }

        const { error } = await supabase
            .from('bookings')
            .update({ status })
            .eq('id', id);

        if (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update status");
        } else {
            toast.success(`Booking ${status} successfully`);
        }
    };

    const filteredBookings = bookings.filter(booking => {
        const matchesSearch =
            booking.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.service_name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === "all" || booking.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-10">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="font-fraunces text-4xl font-bold bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">
                        Booking <span className="text-primary-gold">Archive</span>
                    </h1>
                    <p className="text-white/40 mt-2 italic font-light">Manage and oversee all salon rituals.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-12 px-6 gap-2 border-white/10 hover:bg-white/5 transition-all text-white/60">
                        <Printer className="w-4 h-4" /> Print Rituals
                    </Button>
                    <Button className="h-12 px-6 gap-2 shadow-lg shadow-primary-gold/10">
                        <Plus className="w-4 h-4" /> New Booking
                    </Button>
                </div>
            </div>

            {/* Controls Row */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-2 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                    <input
                        type="text"
                        placeholder="Search by name or service..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-primary-gold/50 transition-all"
                    />
                </div>
                <div className="relative">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-white appearance-none focus:outline-none focus:ring-1 focus:ring-primary-gold/50 transition-all font-medium"
                    >
                        <option value="all" className="bg-[#1A1A1B]">All Rituals</option>
                        <option value="pending" className="bg-[#1A1A1B]">Pending</option>
                        <option value="confirmed" className="bg-[#1A1A1B]">Confirmed</option>
                        <option value="completed" className="bg-[#1A1A1B]">Completed</option>
                        <option value="cancelled" className="bg-[#1A1A1B]">Cancelled</option>
                    </select>
                </div>
                <Button variant="outline" className="h-14 gap-2 border-white/10 hover:bg-white/5 text-white/60">
                    <Download className="w-4 h-4" /> Export CSV
                </Button>
            </div>

            {/* Bookings List Area */}
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-2xl">
                <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-primary-gold" />
                        <span className="font-bold tracking-widest text-xs uppercase text-white/60">Upcoming Rituals Feed</span>
                    </div>
                    <span className="text-xs font-mono text-white/20">{filteredBookings.length} Ritual(s) Found</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/30 border-b border-white/5">
                                <th className="px-8 py-6">Ritualist / Service</th>
                                <th className="px-8 py-6">Date & Time</th>
                                <th className="px-8 py-6">Status</th>
                                <th className="px-8 py-6">Contact</th>
                                <th className="px-8 py-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <AnimatePresence mode="popLayout">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="w-10 h-10 border-2 border-primary-gold border-t-transparent rounded-full animate-spin" />
                                                <p className="text-white/20 text-sm font-medium animate-pulse">Syncing Rituals...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredBookings.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-20 text-center">
                                            <p className="text-white/20 text-sm font-medium">No rituals found matching your criteria.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredBookings.map((booking) => (
                                        <motion.tr
                                            key={booking.id}
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="group hover:bg-white/[0.03] transition-colors"
                                        >
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center font-fraunces text-lg text-white/60 group-hover:bg-primary-gold group-hover:text-primary-charcoal transition-all">
                                                        {booking.customer_name[0]}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-white text-base">{booking.customer_name}</p>
                                                        <p className="text-xs text-white/30 font-medium uppercase tracking-widest mt-0.5">{booking.service_name}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="space-y-1">
                                                    <p className="text-sm font-fraunces font-bold text-white">{new Date(booking.date).toLocaleDateString()}</p>
                                                    <div className="flex items-center gap-2 text-primary-gold/60 text-xs font-bold uppercase tracking-wider">
                                                        <Clock className="w-3.5 h-3.5" /> {booking.time}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${statusColors[booking.status]}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${booking.status === 'confirmed' ? 'bg-green-400' : booking.status === 'pending' ? 'bg-amber-400' : 'bg-red-400'} animate-pulse`} />
                                                    {booking.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex gap-2">
                                                    <a href={`tel:${booking.customer_phone}`} className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/30 hover:text-primary-gold hover:bg-white/10 transition-all">
                                                        <Phone className="w-4 h-4" />
                                                    </a>
                                                    <a href={`mailto:${booking.customer_email}`} className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/30 hover:text-primary-gold hover:bg-white/10 transition-all">
                                                        <Mail className="w-4 h-4" />
                                                    </a>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {booking.status === 'pending' && (
                                                        <button
                                                            onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                                                            className="p-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-2xl hover:bg-green-500 hover:text-white transition-all shadow-xl shadow-green-500/10"
                                                        >
                                                            <CheckCircle2 className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                    {booking.status === 'confirmed' && (
                                                        <button
                                                            onClick={() => updateBookingStatus(booking.id, 'completed')}
                                                            className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-2xl hover:bg-blue-500 hover:text-white transition-all shadow-xl shadow-blue-500/10"
                                                            title="Complete Ritual"
                                                        >
                                                            <CheckCircle2 className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                    {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                                                        <button
                                                            onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                                                            className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-xl shadow-red-500/10"
                                                            title="Cancel Ritual"
                                                        >
                                                            <XCircle className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                    <button className="p-3 bg-white/5 border border-white/10 text-white/30 rounded-2xl hover:bg-white/10 hover:text-white transition-all">
                                                        <MoreHorizontal className="w-5 h-5" />
                                                    </button>
                                                </div>
                                                <div className="group-hover:hidden transition-all text-white/10">
                                                    <ChevronRight className="w-5 h-5 ml-auto" />
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
