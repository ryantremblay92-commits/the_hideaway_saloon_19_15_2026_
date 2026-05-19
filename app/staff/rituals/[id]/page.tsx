"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
    ChevronLeft, 
    ClipboardCheck, 
    MessageSquare, 
    History, 
    Sparkles,
    CheckCircle2,
    Clock,
    User,
    Scissors,
    Save
} from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { addInteractionLog, updateCompliance } from "@/lib/actions/staff";
import { toast } from "sonner";

export default function RitualWorkbench({ params }: { params: { id: string } }) {
    const router = useRouter();
    const supabase = createClient();
    const [booking, setBooking] = React.useState<any>(null);
    const [clientHistory, setClientHistory] = React.useState<any[]>([]);
    const [notes, setNotes] = React.useState("");
    const [interactionType, setInteractionType] = React.useState("Color Record");
    const [compliance, setCompliance] = React.useState<any>({
        consultation_done: false,
        skin_test_verified: false,
        hair_health_checked: false,
        client_consent_signed: false,
    });
    const [isSaving, setIsSaving] = React.useState(false);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        async function loadRitual() {
            const { data: bookingData } = await supabase
                .from('bookings')
                .select('*, profiles:user_id(*)')
                .eq('id', params.id)
                .single();

            if (bookingData) {
                setBooking(bookingData);
                // Load client history
                if (bookingData.user_id) {
                    const { data: history } = await supabase
                        .from('client_interaction_logs')
                        .select('*')
                        .eq('customer_id', bookingData.user_id)
                        .order('created_at', { ascending: false })
                        .limit(5);
                    setClientHistory(history || []);
                }
            }
            setLoading(false);
        }
        loadRitual();
    }, [params.id, supabase]);

    const handleSaveInteraction = async () => {
        if (!notes.trim()) return toast.error("Please enter some notes.");
        setIsSaving(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (user && booking) {
            const result = await addInteractionLog({
                customer_id: booking.user_id,
                staff_id: user.id,
                booking_id: booking.id,
                interaction_type: interactionType,
                notes: notes,
                metadata: { color_level: "7.4", tone: "Copper" } // Demo metadata
            });

            if (result.success) {
                toast.success("Interaction recorded in archive.");
                setNotes("");
            } else {
                toast.error("Failed to save interaction.");
            }
        }
        setIsSaving(false);
    };

    const handleToggleCompliance = (key: string) => {
        setCompliance(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSaveCompliance = async () => {
        setIsSaving(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (user && booking) {
            const allChecked = Object.values(compliance).every(v => v === true);
            const result = await updateCompliance({
                booking_id: booking.id,
                staff_id: user.id,
                checklist_items: compliance,
                compliance_status: allChecked ? 'completed' : 'pending'
            });

            if (result.success) {
                toast.success("Compliance status updated.");
            } else {
                toast.error("Failed to update compliance.");
            }
        }
        setIsSaving(false);
    };

    if (loading) return <div className="p-20 text-center text-white/20">Loading Workbench...</div>;
    if (!booking) return <div className="p-20 text-center text-white/20">Ritual not found.</div>;

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <button 
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-white/40 hover:text-primary-gold transition-colors group"
                >
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Back to Studio
                </button>
                <div className="flex items-center gap-4">
                    <span className="text-[10px] uppercase tracking-widest text-white/20 font-black">Ritual ID: #{booking.id.slice(0, 8)}</span>
                    <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/60">
                        {booking.status}
                    </div>
                </div>
            </div>

            {/* Client Card */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary-gold/40 to-transparent" />
                <div className="flex items-center gap-8">
                    <div className="h-24 w-24 rounded-3xl bg-primary-gold flex items-center justify-center text-primary-charcoal font-fraunces text-4xl font-bold">
                        {booking.customer_name[0]}
                    </div>
                    <div>
                        <h1 className="text-4xl font-fraunces font-bold text-white mb-2">{booking.customer_name}</h1>
                        <div className="flex flex-wrap gap-4 text-white/40 text-sm">
                            <span className="flex items-center gap-2"><User className="w-4 h-4" /> Client Profile</span>
                            <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {booking.time} Today</span>
                            <span className="flex items-center gap-2 text-primary-gold/80"><Scissors className="w-4 h-4" /> {booking.service_name}</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button className="h-14 px-8 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all">
                        Contact Client
                    </button>
                    <button className="h-14 px-8 rounded-2xl bg-primary-gold text-black font-bold text-xs uppercase tracking-widest hover:bg-white transition-all shadow-lg shadow-primary-gold/10">
                        Start Ritual
                    </button>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left: Interaction & Archive */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Interaction Logger */}
                    <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-fraunces font-bold text-white flex items-center gap-3">
                                <MessageSquare className="w-6 h-6 text-primary-gold" />
                                Ritual Notes & Archives
                            </h2>
                            <select 
                                value={interactionType}
                                onChange={(e) => setInteractionType(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white/60 outline-none"
                            >
                                <option value="Color Record">Color Record</option>
                                <option value="Style Preference">Style Preference</option>
                                <option value="Chemical History">Chemical History</option>
                                <option value="General Note">General Note</option>
                            </select>
                        </div>
                        <textarea 
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Record level, tone, mixture ratios, or client preferences here..."
                            className="w-full h-48 bg-white/5 border border-white/10 rounded-3xl p-6 text-white placeholder:text-white/20 focus:outline-none focus:border-primary-gold/50 transition-all resize-none"
                        />
                        <div className="flex justify-end">
                            <button 
                                onClick={handleSaveInteraction}
                                disabled={isSaving}
                                className="flex items-center gap-3 h-14 px-10 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-widest transition-all"
                            >
                                <Save className="w-4 h-4" /> {isSaving ? "Saving..." : "Record to Archive"}
                            </button>
                        </div>
                    </div>

                    {/* History Feed */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-fraunces font-bold text-white/60 flex items-center gap-3">
                            <History className="w-5 h-5" />
                            Interaction History
                        </h3>
                        <div className="space-y-4">
                            {clientHistory.length > 0 ? clientHistory.map((log, i) => (
                                <div key={log.id} className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl">
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="text-[10px] uppercase tracking-widest font-black text-primary-gold/60">{log.interaction_type}</span>
                                        <span className="text-[10px] text-white/20">{new Date(log.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-sm text-white/60 leading-relaxed italic">"{log.notes}"</p>
                                </div>
                            )) : (
                                <div className="p-10 border border-dashed border-white/10 rounded-3xl text-center text-white/20 italic">
                                    No prior interaction records found for this client.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Compliance & Quality Control */}
                <div className="space-y-8">
                    <div className="bg-[#0D0D0F] border border-white/10 rounded-[2.5rem] p-8 space-y-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-gold/5 rounded-full blur-3xl -mr-16 -mt-16" />
                        <h2 className="text-xl font-fraunces font-bold text-white flex items-center gap-3">
                            <ClipboardCheck className="w-5 h-5 text-primary-gold" />
                            Compliance Check
                        </h2>
                        <div className="space-y-5">
                            {Object.entries(compliance).map(([key, value]) => (
                                <button 
                                    key={key}
                                    onClick={() => handleToggleCompliance(key)}
                                    className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/5 hover:border-white/20 rounded-2xl transition-all group"
                                >
                                    <span className="text-xs text-white/60 group-hover:text-white capitalize">
                                        {key.replace(/_/g, ' ')}
                                    </span>
                                    {value ? (
                                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                                    ) : (
                                        <div className="w-5 h-5 rounded-full border-2 border-white/10 group-hover:border-primary-gold/30" />
                                    )}
                                </button>
                            ))}
                        </div>
                        <div className="pt-4 border-t border-white/5">
                            <div className="flex items-center gap-3 mb-6 p-4 bg-primary-gold/5 rounded-2xl border border-primary-gold/10">
                                <Sparkles className="w-5 h-5 text-primary-gold" />
                                <p className="text-[10px] text-primary-gold/80 leading-relaxed font-bold uppercase tracking-wider">
                                    All items must be checked for premium quality assurance.
                                </p>
                            </div>
                            <button 
                                onClick={handleSaveCompliance}
                                disabled={isSaving}
                                className="w-full h-14 rounded-2xl bg-white text-black font-black text-[10px] uppercase tracking-widest hover:bg-primary-gold transition-all"
                            >
                                Verify Compliance
                            </button>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8">
                        <h3 className="text-sm font-bold text-white/30 uppercase tracking-widest mb-6">Service Summary</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-white/40">Est. Duration</span>
                                <span className="text-white font-medium">180 mins</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-white/40">Consultation Link</span>
                                <span className="text-primary-gold font-bold underline cursor-pointer">View #CONS-492</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-white/40">Loyalty Status</span>
                                <span className="text-amber-400 font-black uppercase tracking-tighter">GOLD MEMBER</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
