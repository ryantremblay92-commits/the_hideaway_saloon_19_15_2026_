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
    Download,
    Eye,
    X,
    Heart,
    Sparkles,
    Lightbulb,
    MessageSquare,
    Send,
    Activity,
    ShieldCheck
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { completeBooking } from "@/lib/actions/engagement";
import { sendThankYouNote } from "@/lib/actions/notes";
import { toast } from "sonner";
import Image from "next/image";

interface Booking {
    id: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    service_name: string;
    date: string;
    time: string;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
    payment_amount: number;
    payment_method: string;
    payment_reference: string;
    payment_screenshot: string;
    created_at: string;
    user_id?: string;
}

const statusColors: Record<string, string> = {
    pending: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    confirmed: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    cancelled: "text-red-400 bg-red-400/10 border-red-400/20",
    completed: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
};

const paymentStatusColors: Record<string, string> = {
    pending: "text-amber-400 bg-amber-400/10",
    paid: "text-emerald-400 bg-emerald-400/10",
    failed: "text-red-400 bg-red-400/10",
    refunded: "text-blue-400 bg-blue-400/10",
};

export default function BookingsPage() {
    const supabase = createClient();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [screenshotModal, setScreenshotModal] = useState<{ show: boolean, url: string, booking: Booking | null }>({ show: false, url: '', booking: null });
    const [noteModal, setNoteModal] = useState<{
        show: boolean;
        booking: Booking | null;
        type: 'thank_you' | 'hair_care_tip' | 'personal_note';
        message: string;
        isSending: boolean;
    }>({
        show: false,
        booking: null,
        type: 'thank_you',
        message: '',
        isSending: false
    });

    const fetchBookings = async () => {
        const { data, error } = await supabase
            .from('bookings')
            .select('*')
            .order('date', { ascending: true })
            .order('time', { ascending: true });

        if (data) setBookings(data);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchBookings();

        const channel = supabase
            .channel('bookings_updates')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => {
                fetchBookings();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

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

    const handleSendNote = async () => {
        if (!noteModal.booking || !noteModal.message.trim()) return;

        setNoteModal(prev => ({ ...prev, isSending: true }));
        const result = await sendThankYouNote(
            noteModal.booking.user_id || '',
            noteModal.message,
            noteModal.booking.id,
            noteModal.type
        );

        if (result.success) {
            toast.success("Note sent to client!");
            setNoteModal({ show: false, booking: null, type: 'thank_you', message: '', isSending: false });
        } else {
            toast.error(result.error || "Failed to send note");
            setNoteModal(prev => ({ ...prev, isSending: false }));
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
        <div className="max-w-[1600px] mx-auto pb-24 px-4 sm:px-6">
            {/* --- Premium Header --- */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10 mb-16"
            >
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="px-3 py-1 bg-primary-gold/10 border border-primary-gold/20 rounded-full">
                            <span className="text-[10px] font-bold text-primary-gold uppercase tracking-[0.3em]">Operational</span>
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Horizon-1</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-fraunces font-light tracking-tight text-white leading-[0.9]">
                        Booking <span className="text-primary-gold italic">Archive</span>
                    </h1>
                    <p className="text-white/40 text-sm max-w-md font-light leading-relaxed">
                        The master registry of all sanctuary rituals. Oversee, confirm, and curate every client experience.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <Button variant="outline" className="h-14 px-8 gap-3 border-white/5 luxury-glass hover:border-white/20 transition-all text-white/60">
                        <Printer className="w-4 h-4" /> Print Registry
                    </Button>
                    <Button variant="luxury" className="h-14 px-8 gap-3">
                        <Plus className="w-5 h-5" /> New Ritual
                    </Button>
                </div>
            </motion.div>

            {/* --- Intelligence Controls --- */}
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12"
            >
                <div className="lg:col-span-2 relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-primary-gold transition-colors" />
                    <input
                        type="text"
                        placeholder="Search ritualists or services..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-16 bg-white/[0.03] border border-white/10 rounded-2xl pl-16 pr-6 text-white placeholder:text-white/20 focus:outline-none focus:border-primary-gold/50 transition-all backdrop-blur-2xl"
                    />
                </div>
                <div className="relative group">
                    <Filter className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-primary-gold transition-colors" />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full h-16 bg-white/[0.03] border border-white/10 rounded-2xl pl-16 pr-6 text-white appearance-none focus:outline-none focus:border-primary-gold/50 transition-all backdrop-blur-2xl font-medium"
                    >
                        <option value="all" className="bg-[#0A0A0B]">All Statuses</option>
                        <option value="pending" className="bg-[#0A0A0B]">Pending</option>
                        <option value="confirmed" className="bg-[#0A0A0B]">Confirmed</option>
                        <option value="completed" className="bg-[#0A0A0B]">Completed</option>
                        <option value="cancelled" className="bg-[#0A0A0B]">Cancelled</option>
                    </select>
                </div>
                <Button variant="outline" className="h-16 gap-3 border-white/5 luxury-glass hover:border-white/20 text-white/60">
                    <Download className="w-4 h-4" /> Export Analytics
                </Button>
            </motion.div>

            {/* --- Registry Feed --- */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/[0.02] border border-white/10 rounded-[3rem] overflow-hidden backdrop-blur-3xl shadow-luxury"
            >
                <div className="p-10 border-b border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 bg-white/[0.01]">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary-gold/10 rounded-2xl flex items-center justify-center text-primary-gold border border-primary-gold/20">
                            <Activity className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-fraunces text-2xl font-light text-white leading-none">Registry Feed</h3>
                            <p className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-bold mt-2">Real-time Transmission</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/5">
                             <span className="text-[10px] font-mono text-white/40 tracking-widest">{filteredBookings.length} Ritualists Synchronized</span>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/30 border-b border-white/5">
                                <th className="px-10 py-8">Ritualist / Expertise</th>
                                <th className="px-10 py-8">Schedule</th>
                                <th className="px-10 py-8">Phase</th>
                                <th className="px-10 py-8">Ledger</th>
                                <th className="px-10 py-8 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <AnimatePresence mode="popLayout">
                                {isLoading ? (
                                    <tr key="loading">
                                        <td colSpan={5} className="px-10 py-32 text-center">
                                            <div className="flex flex-col items-center gap-6">
                                                <div className="relative">
                                                    <div className="w-16 h-16 border-[1px] border-white/5 rounded-full" />
                                                    <div className="absolute inset-0 w-16 h-16 border-t-[1px] border-primary-gold rounded-full animate-spin" />
                                                    <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-primary-gold animate-pulse" />
                                                </div>
                                                <p className="text-white/20 text-xs font-bold uppercase tracking-[0.4em] animate-pulse">Syncing Registry...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredBookings.length === 0 ? (
                                    <tr key="empty">
                                        <td colSpan={5} className="px-10 py-32 text-center">
                                            <div className="max-w-xs mx-auto space-y-4">
                                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto opacity-20">
                                                    <ShieldCheck className="w-8 h-8 text-white" />
                                                </div>
                                                <p className="text-white/20 font-fraunces italic text-lg tracking-wide">The registry is pristine. No matching rituals found.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredBookings.map((booking, idx) => (
                                        <motion.tr
                                            key={booking.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="group hover:bg-white/[0.03] transition-all duration-500 cursor-pointer"
                                        >
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-6">
                                                    <div className="relative">
                                                        <div className="w-16 h-16 bg-[#0F0F0F] border border-white/5 rounded-2xl flex items-center justify-center font-fraunces text-2xl text-white/20 group-hover:border-primary-gold/30 group-hover:text-primary-gold transition-all duration-700">
                                                            {booking.customer_name[0]}
                                                        </div>
                                                        <div className="absolute -inset-1 bg-primary-gold opacity-0 group-hover:opacity-10 blur-xl rounded-full transition-opacity duration-700" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-white text-lg group-hover:text-primary-gold transition-colors">{booking.customer_name}</p>
                                                        <div className="flex items-center gap-3 mt-1.5">
                                                            <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest">{booking.service_name}</span>
                                                            <span className="w-1 h-1 rounded-full bg-white/10" />
                                                            <span className="text-[9px] text-primary-gold/40 font-bold uppercase tracking-widest">Premium Ritualist</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="space-y-2">
                                                    <p className="text-sm font-fraunces font-bold text-white">{format(new Date(booking.date), 'MMM dd, yyyy')}</p>
                                                    <div className="flex items-center gap-2.5 text-primary-gold/60 text-[10px] font-bold uppercase tracking-widest">
                                                        <Clock className="w-3.5 h-3.5" /> {booking.time}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <span className={`inline-flex items-center gap-3 px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all duration-500 ${statusColors[booking.status]}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${
                                                        booking.status === 'confirmed' ? 'bg-blue-400' : 
                                                        booking.status === 'pending' ? 'bg-amber-400' : 
                                                        booking.status === 'completed' ? 'bg-emerald-400' : 'bg-red-400'
                                                    } animate-pulse shadow-[0_0_8px_currentColor]`} />
                                                    {booking.status}
                                                </span>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="space-y-2">
                                                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-tighter ${paymentStatusColors[booking.payment_status || 'pending']}`}>
                                                        {booking.payment_status === 'paid' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />} 
                                                        {booking.payment_status || 'pending'}
                                                    </span>
                                                    {booking.payment_amount > 0 && (
                                                        <div className="flex items-center gap-3">
                                                            <p className="text-lg font-fraunces font-light text-white">₹{booking.payment_amount.toLocaleString()}</p>
                                                            {booking.payment_screenshot && (
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setScreenshotModal({ show: true, url: booking.payment_screenshot, booking });
                                                                    }}
                                                                    className="p-1.5 rounded-lg bg-primary-gold/10 border border-primary-gold/20 text-primary-gold hover:bg-primary-gold hover:text-primary-charcoal transition-all"
                                                                >
                                                                    <Eye className="w-3.5 h-3.5" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                                                    {booking.status === 'pending' && (
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); updateBookingStatus(booking.id, 'confirmed'); }}
                                                            className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-2xl hover:bg-blue-500 hover:text-white transition-all shadow-xl shadow-blue-500/10 flex items-center justify-center"
                                                        >
                                                            <CheckCircle2 className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                    {booking.status === 'confirmed' && (
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); updateBookingStatus(booking.id, 'completed'); }}
                                                            className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl hover:bg-emerald-500 hover:text-white transition-all shadow-xl shadow-emerald-500/10 flex items-center justify-center"
                                                        >
                                                            <CheckCircle2 className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                    {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); updateBookingStatus(booking.id, 'cancelled'); }}
                                                            className="w-12 h-12 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-xl shadow-red-500/10 flex items-center justify-center"
                                                        >
                                                            <XCircle className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setNoteModal({ show: true, booking, type: 'thank_you', message: '', isSending: false }); }}
                                                        className="w-12 h-12 bg-primary-gold/10 border border-primary-gold/20 text-primary-gold rounded-2xl hover:bg-primary-gold hover:text-primary-charcoal transition-all shadow-xl flex items-center justify-center"
                                                    >
                                                        <Heart className="w-5 h-5" />
                                                    </button>
                                                    <button className="w-12 h-12 bg-white/5 border border-white/10 text-white/30 rounded-2xl hover:bg-white/10 hover:text-white transition-all flex items-center justify-center">
                                                        <MoreHorizontal className="w-5 h-5" />
                                                    </button>
                                                </div>
                                                <div className="group-hover:hidden transition-all text-white/10">
                                                    <ChevronRight className="w-6 h-6 ml-auto" />
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* --- Modals (Enhanced) --- */}
            <AnimatePresence>
                {screenshotModal.show && (
                    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-6" onClick={() => setScreenshotModal({ show: false, url: '', booking: null })}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="luxury-glass border border-white/20 rounded-[3rem] p-10 max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-8 text-white">
                                <h3 className="font-fraunces text-3xl font-light">Ledger <span className="text-primary-gold italic">Evidence</span></h3>
                                <button onClick={() => setScreenshotModal({ show: false, url: '', booking: null })} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {screenshotModal.booking && (
                                <div className="mb-8 p-6 bg-white/[0.03] rounded-3xl border border-white/5 flex justify-between items-center">
                                    <div>
                                        <p className="font-bold text-white text-lg">{screenshotModal.booking.customer_name}</p>
                                        <p className="text-[10px] text-white/30 uppercase tracking-widest mt-1">{screenshotModal.booking.service_name}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-fraunces text-primary-gold">₹{screenshotModal.booking.payment_amount.toLocaleString()}</p>
                                    </div>
                                </div>
                            )}

                            <div className="relative h-96 bg-black/40 rounded-3xl overflow-hidden border border-white/10 group cursor-zoom-in">
                                <Image src={screenshotModal.url} alt="Payment screenshot" fill className="object-contain group-hover:scale-110 transition-transform duration-1000" />
                            </div>

                            <div className="flex gap-4 mt-10">
                                <Button
                                    onClick={() => {
                                        updateBookingStatus(screenshotModal.booking!.id, 'confirmed');
                                        setScreenshotModal({ show: false, url: '', booking: null });
                                    }}
                                    variant="luxury"
                                    className="flex-1 h-16 rounded-2xl text-primary-charcoal"
                                >
                                    Verify Ledger Entry
                                </Button>
                                <Button variant="outline" onClick={() => setScreenshotModal({ show: false, url: '', booking: null })} className="flex-1 h-16 rounded-2xl border-white/10 luxury-glass">
                                    Dismiss
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {noteModal.show && noteModal.booking && (
                    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            className="luxury-glass border border-white/20 rounded-[3rem] p-10 max-w-lg w-full shadow-2xl relative"
                        >
                            <div className="flex justify-between items-center mb-10">
                                <h3 className="font-fraunces text-3xl font-light text-white leading-none">
                                    Curate <span className="text-primary-gold italic">Ritual Note</span>
                                </h3>
                                <button onClick={() => setNoteModal({ ...noteModal, show: false })} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all text-white/20 hover:text-white">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="space-y-8">
                                <div className="p-6 bg-white/[0.03] rounded-3xl border border-white/5">
                                    <p className="text-white font-bold text-lg">{noteModal.booking.customer_name}</p>
                                    <p className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-bold mt-1.5">{noteModal.booking.service_name}</p>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { id: 'thank_you', icon: Sparkles, label: 'Gratitude', color: 'text-primary-gold' },
                                        { id: 'hair_care_tip', icon: Lightbulb, label: 'Alchemy Tip', color: 'text-emerald-400' },
                                        { id: 'personal_note', icon: MessageSquare, label: 'Bespoke', color: 'text-blue-400' }
                                    ].map((type) => (
                                        <button
                                            key={type.id}
                                            onClick={() => setNoteModal({ ...noteModal, type: type.id as any })}
                                            className={`flex flex-col items-center gap-3 p-5 rounded-2xl border transition-all duration-500 ${noteModal.type === type.id
                                                    ? 'bg-primary-gold/10 border-primary-gold shadow-[0_0_20px_rgba(212,175,55,0.1)]'
                                                    : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                                                }`}
                                        >
                                            <type.icon className={`w-6 h-6 ${type.color}`} />
                                            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">{type.label}</span>
                                        </button>
                                    ))}
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-white/20 uppercase tracking-[0.4em] ml-2">Message</label>
                                    <textarea
                                        value={noteModal.message}
                                        onChange={(e) => setNoteModal({ ...noteModal, message: e.target.value })}
                                        placeholder="Compose your sanctuary note..."
                                        className="w-full h-44 bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-white placeholder:text-white/20 focus:outline-none focus:border-primary-gold/50 transition-all resize-none italic font-light leading-relaxed"
                                    />
                                </div>

                                <Button
                                    onClick={handleSendNote}
                                    disabled={!noteModal.message.trim() || noteModal.isSending}
                                    variant="luxury"
                                    className="w-full h-16 rounded-2xl text-primary-charcoal font-bold gap-3"
                                >
                                    {noteModal.isSending ? 'Transmitting...' : 'Transmit Note'}
                                    <Send className="w-5 h-5" />
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
