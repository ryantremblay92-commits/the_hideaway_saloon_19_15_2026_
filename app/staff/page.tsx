"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { TeamMember, team as fallbackTeam } from "@/lib/data/team";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { 
    LogIn, 
    Power, 
    MessageSquare, 
    Users, 
    Sparkles, 
    Bell, 
    Send,
    ArrowLeftRight,
    Search,
    CalendarCheck,
    Camera,
    Crown,
    Check,
    X,
    Upload
} from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { toast } from "sonner";
import { LineChart, BarChart } from "lucide-react"; // Additional icons

type Tab = 'overview' | 'inquiries' | 'backstage' | 'appointments' | 'gallery' | 'loyalty' | 'team';

export default function StaffPortal() {
    const [team, setTeam] = useState<TeamMember[]>([]);
    const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);
    const [pin, setPin] = useState("");
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isOnline, setIsOnline] = useState(false);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<Tab>('inquiries');
    const [inquiries, setInquiries] = useState<any[]>([]);
    const [internalMessages, setInternalMessages] = useState<any[]>([]);
    const [messageInput, setMessageInput] = useState("");
    const [allStaffStatus, setAllStaffStatus] = useState<any[]>([]);
    
    // Feature States
    const [appointments, setAppointments] = useState<any[]>([]);
    const [portfolioImages, setPortfolioImages] = useState<any[]>([]);
    const [loyaltyProfiles, setLoyaltyProfiles] = useState<any[]>([]);
    const [newImageUrl, setNewImageUrl] = useState("");
    const [newImageCaption, setNewImageCaption] = useState("");

    // Live Chat with Customer State
    const [activeInquiryId, setActiveInquiryId] = useState<string | null>(null);
    const [inquiryMessages, setInquiryMessages] = useState<any[]>([]);
    const [inquiryMessageInput, setInquiryMessageInput] = useState("");
    const inquiryChatEndRef = useRef<HTMLDivElement>(null);

    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setAudio(new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3"));
        }
        const fetchTeam = async () => {
            try {
                const { data, error } = await supabase.from('salon_team').select('*').order('id', { ascending: true });
                if (data && data.length > 0) {
                    setTeam(data);
                } else {
                    console.log("Empty or missing salon_team, using static fallbackTeam.");
                    setTeam(fallbackTeam);
                }
            } catch (err) {
                console.error("Supabase fetch failed, using fallbackTeam:", err);
                setTeam(fallbackTeam);
            }
        };
        fetchTeam();
    }, []);

    useEffect(() => {
        if (activeTab === 'backstage') {
            chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
        if (activeInquiryId) {
            inquiryChatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [internalMessages, inquiryMessages, activeTab, activeInquiryId]);

    const playNotification = () => {
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(e => console.log("Audio play blocked", e));
        }
    };

    const currentStaff = team.find(m => m.id === selectedStaffId);

    const handlePinSubmit = () => {
        if (currentStaff && pin === currentStaff.pin) {
            setIsAuthorized(true);
            setActiveTab(currentStaff.seniority === 'Executive' ? 'overview' : 'inquiries');
            toast.success(`Welcome back, ${currentStaff.name}`);
        } else {
            toast.error("Invalid Station PIN");
            setPin("");
        }
    };

    const toggleStatus = async () => {
        if (!selectedStaffId) return;
        setLoading(true);
        const nextStatus = !isOnline;

        const { error } = await supabase
            .from('staff_status')
            .update({ is_online: nextStatus, updated_at: new Date().toISOString() })
            .eq('staff_id', selectedStaffId);

        if (error) {
            toast.error("Failed to update status");
        } else {
            setIsOnline(nextStatus);
            toast.success(`You are now ${nextStatus ? 'ONLINE' : 'OFFLINE'}`);
        }
        setLoading(false);
    };

    const fetchInquiries = async () => {
        if (!selectedStaffId) return;
        let query = supabase.from('inquiries').select('*');
        if (currentStaff?.seniority !== 'Executive') {
            query = query.or(`staff_id.eq.${selectedStaffId},staff_id.eq.0`);
        }
        const { data } = await query.order('created_at', { ascending: false }).limit(20);
        if (data) setInquiries(data);
    };

    const fetchInternalMessages = async () => {
        const { data } = await supabase
            .from('internal_messages')
            .select('*')
            .order('created_at', { ascending: true })
            .limit(50);
        if (data) setInternalMessages(data);
    };

    const fetchAppointments = async () => {
        if (!selectedStaffId) return;
        let query = supabase.from('bookings').select('*');
        if (currentStaff?.seniority !== 'Executive') {
            query = query.eq('stylist_id', selectedStaffId);
        }
        const { data } = await query.order('created_at', { ascending: false });
        if (data) setAppointments(data);
    };

    const fetchPortfolio = async () => {
        let query = supabase.from('portfolio_images').select('*');
        if (currentStaff?.seniority !== 'Executive') {
            query = query.eq('stylist_id', selectedStaffId);
        }
        const { data } = await query.order('created_at', { ascending: false });
        if (data) setPortfolioImages(data);
    };

    const fetchLoyalty = async () => {
        const { data } = await supabase.from('loyalty_profiles').select('*').order('points', { ascending: false });
        if (data) setLoyaltyProfiles(data);
    };

    const updateAppointmentStatus = async (id: string, status: string) => {
        // We will dynamically import the server action to avoid client/server issues
        const { updateBookingStatus } = await import('@/lib/actions/booking');
        const res = await updateBookingStatus(id, status);
        if (res.success) {
            toast.success(`Booking ${status}`);
            fetchAppointments();
        } else {
            toast.error("Failed to update booking: " + res.error);
        }
    };

    const uploadPortfolioImage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newImageUrl.trim() || !selectedStaffId) return;
        
        const { error } = await supabase.from('portfolio_images').insert([{
            stylist_id: selectedStaffId,
            image_url: newImageUrl,
            caption: newImageCaption
        }]);

        if (!error) {
            toast.success("Image added to Lookbook");
            setNewImageUrl("");
            setNewImageCaption("");
            fetchPortfolio();
        } else {
            toast.error("Failed to add image");
        }
    };

    const sendInternalMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!messageInput.trim() || !selectedStaffId) return;

        const content = messageInput;
        setMessageInput("");

        const { error } = await supabase
            .from('internal_messages')
            .insert([{
                sender_id: selectedStaffId,
                receiver_id: 0, // Broadcast to all for now
                content: content
            }]);

        if (error) toast.error("Message failed to send");
    };

    // Subscriptions for Customer Live Chat
    useEffect(() => {
        if (!activeInquiryId) return;

        const fetchInquiryMessages = async () => {
            const { data } = await supabase
                .from('live_chat_messages')
                .select('*')
                .eq('session_id', activeInquiryId)
                .order('created_at', { ascending: true });
            if (data) setInquiryMessages(data);
        };
        fetchInquiryMessages();

        const channel = supabase
            .channel('staff_live_chat_' + activeInquiryId)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'live_chat_messages',
                filter: `session_id=eq.${activeInquiryId}`
            }, (payload) => {
                setInquiryMessages(prev => [...prev, payload.new]);
                if (payload.new.sender_type === 'customer') {
                    playNotification();
                }
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [activeInquiryId]);

    const sendInquiryMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inquiryMessageInput.trim() || !activeInquiryId || !selectedStaffId) return;

        const content = inquiryMessageInput;
        setInquiryMessageInput("");

        const { error } = await supabase
            .from('live_chat_messages')
            .insert([{
                session_id: activeInquiryId,
                staff_id: selectedStaffId,
                sender_type: 'staff',
                content: content
            }]);

        if (error) toast.error("Failed to send reply");
    };

    useEffect(() => {
        if (selectedStaffId && isAuthorized) {
            const fetchStatus = async () => {
                const { data } = await supabase
                    .from('staff_status')
                    .select('*');
                if (data) {
                    setAllStaffStatus(data);
                    const myStatus = data.find(s => s.staff_id === selectedStaffId);
                    if (myStatus) setIsOnline(myStatus.is_online);
                }
            };
            
            fetchStatus();
            fetchInquiries();
            fetchInternalMessages();
            fetchAppointments();
            fetchPortfolio();
            if (currentStaff?.seniority === 'Executive') fetchLoyalty();

            const inquiriesChannel = supabase
                .channel('staff_updates')
                .on('postgres_changes', { 
                    event: 'INSERT', 
                    schema: 'public', 
                    table: 'inquiries' 
                }, (payload) => {
                    if (currentStaff?.seniority === 'Executive' || payload.new.staff_id === selectedStaffId || payload.new.staff_id === 0) {
                        setInquiries(prev => [payload.new, ...prev].slice(0, 20));
                        playNotification();
                        toast.success("New Inquiry Received!", {
                            description: payload.new.message_type,
                        });
                    }
                })
                .on('postgres_changes', {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'internal_messages'
                }, (payload) => {
                    setInternalMessages(prev => [...prev, payload.new]);
                    if (payload.new.sender_id !== selectedStaffId) {
                        playNotification();
                        if (activeTab !== 'backstage') {
                            toast.info(`Backstage: New message from ${team.find(m => m.id === payload.new.sender_id)?.name}`);
                        }
                    }
                })
                .on('postgres_changes', {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'staff_status'
                }, (payload) => {
                    setAllStaffStatus(prev => {
                        const exists = prev.find(s => s.staff_id === payload.new.staff_id);
                        if (exists) return prev.map(s => s.staff_id === payload.new.staff_id ? payload.new : s);
                        return [...prev, payload.new];
                    });
                })
                .subscribe();

            return () => { supabase.removeChannel(inquiriesChannel); };
        }
    }, [selectedStaffId, isAuthorized, activeTab]);

    return (
        <div className="min-h-screen bg-primary-ivory py-20 px-6">
            <div className="max-w-4xl mx-auto">
                <SectionHeader
                    subtitle="Internal"
                    title="Staff <span class='text-primary-gold italic'>Interaction Hub</span>"
                    description="Sign in to your station to manage the salon concierge and communicate backstage."
                    align="center"
                />

                {!selectedStaffId ? (
                    /* Step 1: Select Staff */
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-12">
                        {team.map((member) => (
                            <button
                                key={member.id}
                                onClick={() => setSelectedStaffId(member.id)}
                                className="p-6 bg-white rounded-3xl border border-secondary-pearl hover:border-primary-gold transition-all text-left group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full overflow-hidden bg-primary-ivory">
                                        <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-primary-charcoal">{member.name}</p>
                                        <p className="text-[10px] text-primary-charcoal/40 font-bold uppercase tracking-widest">{member.role}</p>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                ) : !isAuthorized ? (
                    /* Step 2: PIN Verification */
                    <div className="max-w-md mx-auto mt-12 bg-white rounded-[3rem] p-10 shadow-2xl border border-secondary-pearl text-center">
                        <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-6 border-4 border-primary-ivory shadow-lg">
                            <img src={currentStaff?.image} alt={currentStaff?.name} className="w-full h-full object-cover" />
                        </div>
                        <h3 className="font-fraunces text-2xl text-primary-charcoal mb-2">{currentStaff?.name}</h3>
                        <p className="text-primary-charcoal/40 text-[10px] font-bold uppercase tracking-widest mb-8">Enter Station PIN</p>
                        
                        <div className="space-y-4">
                            <input
                                type="password"
                                maxLength={4}
                                value={pin}
                                onChange={(e) => setPin(e.target.value)}
                                placeholder="••••"
                                className="w-full h-16 bg-primary-ivory rounded-2xl text-center text-3xl tracking-[1em] font-black text-primary-charcoal focus:ring-2 focus:ring-primary-gold outline-none transition-all"
                            />
                            <Button 
                                onClick={handlePinSubmit}
                                className="w-full h-16 rounded-2xl bg-primary-charcoal text-white font-black tracking-widest text-[10px] uppercase hover:bg-primary-gold transition-all"
                            >
                                Sign In
                            </Button>
                            <Button 
                                variant="ghost"
                                onClick={() => setSelectedStaffId(null)}
                                className="w-full text-primary-charcoal/40 font-bold uppercase tracking-widest text-[10px]"
                            >
                                Back to Selection
                            </Button>
                        </div>
                    </div>
                ) : (
                    /* Step 3: Dashboard */
                    <div className="mt-12 space-y-8">
                        {/* Top Profile Bar */}
                        <div className="bg-white rounded-[3rem] p-8 shadow-2xl border border-secondary-pearl">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="flex items-center gap-5">
                                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary-ivory shadow-md">
                                        <img src={currentStaff?.image} alt={currentStaff?.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h3 className="font-fraunces text-xl text-primary-charcoal">{currentStaff?.name}</h3>
                                        <p className="text-primary-gold font-bold uppercase tracking-widest text-[9px]">{currentStaff?.role}</p>
                                    </div>
                                </div>

                                    <div className="flex gap-1 overflow-x-auto custom-scrollbar pb-2">
                                        {currentStaff?.seniority === 'Executive' && (
                                            <button 
                                                onClick={() => { setActiveTab('overview'); setActiveInquiryId(null); }}
                                                className={cn(
                                                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap",
                                                    activeTab === 'overview' && !activeInquiryId ? "bg-white text-primary-charcoal shadow-sm" : "text-primary-charcoal/40 hover:text-primary-charcoal"
                                                )}
                                            >
                                                <BarChart className="w-3.5 h-3.5" /> Overview
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => { setActiveTab('appointments'); setActiveInquiryId(null); }}
                                            className={cn(
                                                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap",
                                                activeTab === 'appointments' && !activeInquiryId ? "bg-white text-primary-charcoal shadow-sm" : "text-primary-charcoal/40 hover:text-primary-charcoal"
                                            )}
                                        >
                                            <CalendarCheck className="w-3.5 h-3.5" /> Appointments
                                        </button>
                                        <button 
                                            onClick={() => { setActiveTab('inquiries'); setActiveInquiryId(null); }}
                                            className={cn(
                                                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap",
                                                activeTab === 'inquiries' && !activeInquiryId ? "bg-white text-primary-charcoal shadow-sm" : "text-primary-charcoal/40 hover:text-primary-charcoal"
                                            )}
                                        >
                                            <Bell className="w-3.5 h-3.5" /> Inquiries
                                        </button>
                                        <button 
                                            onClick={() => setActiveTab('gallery')}
                                            className={cn(
                                                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap",
                                                activeTab === 'gallery' ? "bg-white text-primary-charcoal shadow-sm" : "text-primary-charcoal/40 hover:text-primary-charcoal"
                                            )}
                                        >
                                            <Camera className="w-3.5 h-3.5" /> Gallery
                                        </button>
                                        <button 
                                            onClick={() => setActiveTab('backstage')}
                                            className={cn(
                                                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap",
                                                activeTab === 'backstage' ? "bg-white text-primary-charcoal shadow-sm" : "text-primary-charcoal/40 hover:text-primary-charcoal"
                                            )}
                                        >
                                            <ArrowLeftRight className="w-3.5 h-3.5" /> Backstage
                                        </button>
                                        {currentStaff?.seniority === 'Executive' && (
                                            <>
                                                <button 
                                                    onClick={() => { setActiveTab('loyalty'); setActiveInquiryId(null); }}
                                                    className={cn(
                                                        "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap",
                                                        activeTab === 'loyalty' ? "bg-white text-primary-charcoal shadow-sm" : "text-primary-charcoal/40 hover:text-primary-charcoal"
                                                    )}
                                                >
                                                    <Crown className="w-3.5 h-3.5" /> VIPs
                                                </button>
                                                <button 
                                                    onClick={() => { setActiveTab('team'); setActiveInquiryId(null); }}
                                                    className={cn(
                                                        "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap",
                                                        activeTab === 'team' ? "bg-white text-primary-charcoal shadow-sm" : "text-primary-charcoal/40 hover:text-primary-charcoal"
                                                    )}
                                                >
                                                    <Users className="w-3.5 h-3.5" /> Team
                                                </button>
                                            </>
                                        )}
                                    </div>

                                <div className="flex gap-2">
                                    <Button 
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setSelectedStaffId(null);
                                            setIsAuthorized(false);
                                            setPin("");
                                        }}
                                        className="rounded-xl font-bold uppercase tracking-widest text-[9px] border-secondary-pearl h-11"
                                    >
                                        Sign Out
                                    </Button>
                                    <Button 
                                        size="sm"
                                        onClick={toggleStatus}
                                        disabled={loading}
                                        className={cn(
                                            "rounded-xl font-bold uppercase tracking-widest text-[9px] h-11 px-6",
                                            isOnline ? "bg-amber-500 hover:bg-amber-600" : "bg-green-500 hover:bg-green-600"
                                        )}
                                    >
                                        {isOnline ? 'Go Offline' : 'Go Online'}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="md:col-span-2">
                                {activeTab === 'overview' && currentStaff?.seniority === 'Executive' ? (
                                    <div className="space-y-6">
                                        <h4 className="font-fraunces text-2xl text-primary-charcoal flex items-center gap-3">
                                            <LineChart className="w-6 h-6 text-primary-gold" /> Executive Dashboard
                                        </h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-white p-6 rounded-3xl border border-secondary-pearl shadow-sm hover:border-primary-gold transition-colors">
                                                <p className="text-[10px] text-primary-charcoal/40 font-bold uppercase tracking-widest mb-2">Total Inquiries</p>
                                                <p className="text-4xl font-fraunces text-primary-charcoal">{inquiries.length}</p>
                                            </div>
                                            <div className="bg-white p-6 rounded-3xl border border-secondary-pearl shadow-sm hover:border-primary-gold transition-colors">
                                                <p className="text-[10px] text-primary-charcoal/40 font-bold uppercase tracking-widest mb-2">Internal Comms</p>
                                                <p className="text-4xl font-fraunces text-primary-charcoal">{internalMessages.length}</p>
                                            </div>
                                        </div>

                                        <h4 className="font-fraunces text-xl text-primary-charcoal mt-10 mb-4 flex items-center gap-2">
                                            <Users className="w-5 h-5 text-primary-gold" /> Team Availability
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {team.map(member => {
                                                const status = allStaffStatus.find(s => s.staff_id === member.id);
                                                const isMemberOnline = status?.is_online || false;
                                                return (
                                                    <div key={member.id} className="bg-white p-4 rounded-2xl border border-secondary-pearl flex items-center gap-4 shadow-sm">
                                                        <div className="relative">
                                                            <img src={member.image} alt={member.name} className="w-12 h-12 rounded-full object-cover border border-secondary-pearl" />
                                                            <div className={cn(
                                                                "absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white",
                                                                isMemberOnline ? "bg-green-500" : "bg-amber-500"
                                                            )} />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-sm text-primary-charcoal">{member.name}</p>
                                                            <p className="text-[9px] uppercase tracking-widest text-primary-charcoal/40 font-bold">{member.role}</p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ) : activeTab === 'appointments' && !activeInquiryId ? (
                                    <div className="space-y-6">
                                        <h4 className="font-fraunces text-2xl text-primary-charcoal flex items-center gap-3">
                                            <CalendarCheck className="w-6 h-6 text-primary-gold" /> 
                                            {currentStaff?.seniority === 'Executive' ? 'All Salon Appointments' : 'Your Appointments'}
                                        </h4>
                                        <div className="space-y-4">
                                            {appointments.length > 0 ? appointments.map((apt) => (
                                                <div key={apt.id} className="bg-white p-6 rounded-3xl border border-secondary-pearl flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-primary-gold transition-all shadow-sm">
                                                    <div className="flex items-center gap-4">
                                                        <div className={cn(
                                                            "w-12 h-12 rounded-xl flex items-center justify-center",
                                                            apt.status === 'confirmed' ? "bg-green-100 text-green-600" : 
                                                            apt.status === 'cancelled' ? "bg-red-100 text-red-600" : 
                                                            "bg-amber-100 text-amber-600"
                                                        )}>
                                                            <CalendarCheck className="w-6 h-6" />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-primary-charcoal">{apt.service_name}</p>
                                                            <p className="text-[10px] text-primary-charcoal/60 uppercase font-bold tracking-widest">
                                                                {apt.date} @ {apt.time} • {apt.customer_name}
                                                            </p>
                                                            {currentStaff?.seniority === 'Executive' && apt.stylist_id && (
                                                                <p className="text-[10px] text-primary-gold uppercase font-bold tracking-widest mt-1">
                                                                    Stylist: {team.find(t => String(t.id) === String(apt.stylist_id))?.name || 'Any'}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {apt.status === 'pending' && (
                                                            <>
                                                                <Button onClick={() => updateAppointmentStatus(apt.id, 'confirmed')} size="sm" className="bg-green-500 hover:bg-green-600 text-white rounded-xl">
                                                                    <Check className="w-4 h-4 mr-1" /> Accept
                                                                </Button>
                                                                <Button onClick={() => updateAppointmentStatus(apt.id, 'cancelled')} size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 rounded-xl">
                                                                    <X className="w-4 h-4 mr-1" /> Decline
                                                                </Button>
                                                            </>
                                                        )}
                                                        {apt.status === 'confirmed' && (
                                                            <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-widest rounded-lg">Confirmed</span>
                                                        )}
                                                        {apt.status === 'cancelled' && (
                                                            <span className="px-3 py-1 bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-widest rounded-lg">Cancelled</span>
                                                        )}
                                                    </div>
                                                </div>
                                            )) : (
                                                <div className="bg-white/50 border-2 border-dashed border-secondary-pearl p-12 rounded-[2.5rem] text-center">
                                                    <p className="text-primary-charcoal/40 font-bold uppercase tracking-widest text-xs">No upcoming appointments found.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : activeTab === 'gallery' && !activeInquiryId ? (
                                    <div className="space-y-6">
                                        <h4 className="font-fraunces text-2xl text-primary-charcoal flex items-center gap-3">
                                            <Camera className="w-6 h-6 text-primary-gold" /> 
                                            Portfolio Management
                                        </h4>
                                        
                                        <div className="bg-white p-6 rounded-3xl border border-secondary-pearl shadow-sm">
                                            <h5 className="text-[10px] font-bold uppercase tracking-widest text-primary-charcoal mb-4">Add New Transformation</h5>
                                            <form onSubmit={uploadPortfolioImage} className="space-y-4">
                                                <input 
                                                    type="url" 
                                                    value={newImageUrl}
                                                    onChange={e => setNewImageUrl(e.target.value)}
                                                    placeholder="Image URL (e.g. Unsplash link)" 
                                                    className="w-full h-12 px-4 rounded-xl border border-secondary-pearl bg-primary-ivory text-sm focus:ring-2 focus:ring-primary-gold outline-none"
                                                    required
                                                />
                                                <input 
                                                    type="text" 
                                                    value={newImageCaption}
                                                    onChange={e => setNewImageCaption(e.target.value)}
                                                    placeholder="Caption (e.g. Balayage & Layers)" 
                                                    className="w-full h-12 px-4 rounded-xl border border-secondary-pearl bg-primary-ivory text-sm focus:ring-2 focus:ring-primary-gold outline-none"
                                                />
                                                <Button type="submit" className="w-full rounded-xl bg-primary-charcoal hover:bg-primary-gold text-white font-bold uppercase tracking-widest text-[10px]">
                                                    <Upload className="w-4 h-4 mr-2" /> Upload to Lookbook
                                                </Button>
                                            </form>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {portfolioImages.map(img => (
                                                <div key={img.id} className="relative group rounded-2xl overflow-hidden aspect-[4/5] border border-secondary-pearl">
                                                    <img src={img.image_url} alt={img.caption} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                                        <p className="text-white font-bold text-sm">{img.caption}</p>
                                                        <p className="text-primary-gold text-[9px] uppercase tracking-widest font-bold">
                                                            {team.find(t => String(t.id) === String(img.stylist_id))?.name}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : activeTab === 'loyalty' && currentStaff?.seniority === 'Executive' && !activeInquiryId ? (
                                    <div className="space-y-6">
                                        <h4 className="font-fraunces text-2xl text-primary-charcoal flex items-center gap-3">
                                            <Crown className="w-6 h-6 text-primary-gold" /> VIP Loyalty Program
                                        </h4>
                                        <div className="bg-white rounded-3xl border border-secondary-pearl shadow-sm overflow-hidden">
                                            <div className="p-6 border-b border-secondary-pearl flex justify-between items-center bg-primary-ivory">
                                                <h5 className="font-bold text-primary-charcoal text-sm">Top Clients</h5>
                                                <span className="px-3 py-1 bg-primary-gold/10 text-primary-gold text-[10px] font-bold uppercase tracking-widest rounded-lg">Live Leaderboard</span>
                                            </div>
                                            <div className="divide-y divide-secondary-pearl">
                                                {loyaltyProfiles.length > 0 ? loyaltyProfiles.map((profile, i) => (
                                                    <div key={profile.user_id} className="p-4 flex items-center justify-between hover:bg-primary-ivory/50 transition-colors">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-8 h-8 rounded-full bg-primary-charcoal text-white flex items-center justify-center font-bold text-sm">
                                                                #{i + 1}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-primary-charcoal text-sm font-mono">{profile.user_id.split('-')[0]}...</p>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <span className={cn(
                                                                        "px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest",
                                                                        profile.tier === 'Platinum' ? "bg-slate-200 text-slate-700" :
                                                                        profile.tier === 'Gold' ? "bg-amber-100 text-amber-700" :
                                                                        "bg-orange-100 text-orange-700"
                                                                    )}>
                                                                        {profile.tier}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-bold text-primary-charcoal">{profile.points} pts</p>
                                                            <p className="text-[9px] uppercase tracking-widest text-secondary-label font-bold">AED {profile.total_spent} spent</p>
                                                        </div>
                                                    </div>
                                                )) : (
                                                    <div className="p-12 text-center text-secondary-label text-sm font-bold">
                                                        No VIP profiles found yet.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : activeTab === 'inquiries' && !activeInquiryId ? (
                                    <div className="space-y-6">
                                        <h4 className="font-fraunces text-2xl text-primary-charcoal flex items-center gap-3">
                                            <Bell className="w-6 h-6 text-primary-gold" /> 
                                            {currentStaff?.seniority === 'Executive' ? 'All Recent Inquiries' : 'Your Inquiries'}
                                        </h4>
                                        <div className="space-y-4">
                                            {inquiries.length > 0 ? inquiries.map((item) => (
                                                <div key={item.id} className="bg-white p-6 rounded-3xl border border-secondary-pearl flex items-center justify-between group hover:border-primary-gold transition-all shadow-sm">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-full bg-primary-ivory flex items-center justify-center">
                                                            <MessageSquare className="w-5 h-5 text-primary-gold" />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-sm text-primary-charcoal">{item.message_type}</p>
                                                            <p className="text-[10px] text-primary-charcoal/40 uppercase font-bold tracking-widest">
                                                                {new Date(item.created_at).toLocaleTimeString()} • {item.customer_name} • {item.platform}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Button onClick={() => setActiveInquiryId(item.id)} variant="ghost" size="sm" className="text-primary-gold hover:text-primary-charcoal hover:bg-primary-gold/10 rounded-xl">
                                                        Reply
                                                    </Button>
                                                </div>
                                            )) : (
                                                <div className="bg-white/50 border-2 border-dashed border-secondary-pearl p-12 rounded-[2.5rem] text-center">
                                                    <p className="text-primary-charcoal/40 font-bold uppercase tracking-widest text-xs">No active inquiries at your station.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : activeInquiryId ? (
                                    <div className="flex flex-col h-[500px] bg-white rounded-[2.5rem] shadow-xl border border-secondary-pearl overflow-hidden">
                                        <div className="p-6 border-b border-secondary-pearl flex items-center justify-between bg-white/50 backdrop-blur-sm sticky top-0 z-10">
                                            <div>
                                                <h4 className="font-fraunces text-xl text-primary-charcoal">Customer Conversation</h4>
                                                <p className="text-[9px] font-bold text-primary-charcoal/40 uppercase tracking-widest">Live Chat Support</p>
                                            </div>
                                            <Button variant="outline" size="sm" onClick={() => setActiveInquiryId(null)} className="rounded-xl font-bold uppercase tracking-widest text-[9px]">
                                                Close
                                            </Button>
                                        </div>

                                        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
                                            {inquiryMessages.map((msg) => {
                                                const isStaff = msg.sender_type === 'staff';
                                                return (
                                                    <div key={msg.id} className={cn("flex flex-col", isStaff ? "items-end" : "items-start")}>
                                                        <div className={cn(
                                                            "max-w-[80%] p-4 rounded-2xl text-sm shadow-sm",
                                                            isStaff ? "bg-primary-charcoal text-white rounded-br-none" : "bg-primary-ivory text-primary-charcoal border border-secondary-pearl rounded-bl-none"
                                                        )}>
                                                            <p className="leading-relaxed">{msg.content}</p>
                                                        </div>
                                                        <p className="text-[8px] font-bold text-primary-charcoal/30 uppercase tracking-widest mt-1">
                                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                );
                                            })}
                                            <div ref={inquiryChatEndRef} />
                                        </div>

                                        <form onSubmit={sendInquiryMessage} className="p-6 bg-primary-ivory border-t border-secondary-pearl">
                                            <div className="relative">
                                                <input 
                                                    type="text"
                                                    value={inquiryMessageInput}
                                                    onChange={(e) => setInquiryMessageInput(e.target.value)}
                                                    placeholder="Reply to customer..."
                                                    className="w-full h-14 pl-6 pr-16 bg-white rounded-2xl border border-secondary-pearl focus:ring-2 focus:ring-primary-gold outline-none transition-all text-sm text-primary-charcoal placeholder:text-primary-charcoal/30 shadow-sm"
                                                />
                                                <button 
                                                    type="submit"
                                                    className="absolute right-2 top-2 h-10 w-10 bg-primary-charcoal text-white rounded-xl flex items-center justify-center hover:bg-primary-gold transition-all"
                                                >
                                                    <Send className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                ) : (
                                    <div className="flex flex-col h-[500px] bg-white rounded-[2.5rem] shadow-xl border border-secondary-pearl overflow-hidden">
                                        <div className="p-6 border-b border-secondary-pearl flex items-center justify-between bg-white/50 backdrop-blur-sm sticky top-0 z-10">
                                            <div>
                                                <h4 className="font-fraunces text-xl text-primary-charcoal">Backstage Chat</h4>
                                                <p className="text-[9px] font-bold text-primary-charcoal/40 uppercase tracking-widest">Internal Communication Only</p>
                                            </div>
                                            <div className="flex -space-x-2">
                                                {team.slice(0, 4).map(m => (
                                                    <div key={m.id} className="w-7 h-7 rounded-full border-2 border-white overflow-hidden shadow-sm">
                                                        <img src={m.image} alt={m.name} className="w-full h-full object-cover" />
                                                    </div>
                                                ))}
                                                <div className="w-7 h-7 rounded-full border-2 border-white bg-primary-ivory flex items-center justify-center text-[8px] font-bold text-primary-charcoal/40 shadow-sm">
                                                    +{team.length - 4}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
                                            {internalMessages.map((msg) => {
                                                const isMine = msg.sender_id === selectedStaffId;
                                                const sender = team.find(m => m.id === msg.sender_id);
                                                return (
                                                    <div key={msg.id} className={cn("flex flex-col", isMine ? "items-end" : "items-start")}>
                                                        <div className={cn(
                                                            "max-w-[80%] p-4 rounded-2xl text-sm shadow-sm",
                                                            isMine ? "bg-primary-charcoal text-white rounded-br-none" : "bg-primary-ivory text-primary-charcoal border border-secondary-pearl rounded-bl-none"
                                                        )}>
                                                            {!isMine && (
                                                                <p className="text-[9px] font-black uppercase tracking-widest mb-1 text-primary-gold opacity-80">
                                                                    {sender?.name}
                                                                </p>
                                                            )}
                                                            <p className="leading-relaxed">{msg.content}</p>
                                                        </div>
                                                        <p className="text-[8px] font-bold text-primary-charcoal/30 uppercase tracking-widest mt-1">
                                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                );
                                            })}
                                            <div ref={chatEndRef} />
                                        </div>

                                        <form onSubmit={sendInternalMessage} className="p-6 bg-primary-ivory border-t border-secondary-pearl">
                                            <div className="relative">
                                                <input 
                                                    type="text"
                                                    value={messageInput}
                                                    onChange={(e) => setMessageInput(e.target.value)}
                                                    placeholder="Share an update with the team..."
                                                    className="w-full h-14 pl-6 pr-16 bg-white rounded-2xl border border-secondary-pearl focus:ring-2 focus:ring-primary-gold outline-none transition-all text-sm text-primary-charcoal placeholder:text-primary-charcoal/30 shadow-sm"
                                                />
                                                <button 
                                                    type="submit"
                                                    className="absolute right-2 top-2 h-10 w-10 bg-primary-charcoal text-white rounded-xl flex items-center justify-center hover:bg-primary-gold transition-all"
                                                >
                                                    <Send className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {activeTab === 'team' && currentStaff?.seniority === 'Executive' && (
                                    <div className="bg-white rounded-3xl border border-secondary-pearl overflow-hidden shadow-sm">
                                        <div className="p-6 border-b border-secondary-pearl bg-primary-ivory">
                                            <h4 className="font-fraunces text-2xl text-primary-charcoal">Role Management</h4>
                                            <p className="text-sm text-primary-charcoal/60 mt-2">Manage staff roles, access levels, and details.</p>
                                        </div>
                                        <div className="divide-y divide-secondary-pearl">
                                            {team.map((member) => (
                                                <div key={member.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-primary-ivory/50 transition-colors">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary-ivory">
                                                            <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                                                        </div>
                                                        <div>
                                                            <h5 className="font-fraunces font-bold text-primary-charcoal">{member.name}</h5>
                                                            <p className="text-[10px] font-bold uppercase tracking-widest text-primary-gold">{member.seniority} • {member.role}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold uppercase tracking-widest">
                                                            Edit Role
                                                        </Button>
                                                        <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold uppercase tracking-widest text-primary-charcoal/40 hover:text-red-500">
                                                            Reset PIN
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-6">
                                <div className="bg-primary-charcoal rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-gold/10 blur-3xl" />
                                    <h4 className="font-fraunces text-xl mb-6 flex items-center gap-2">
                                        <Users className="w-5 h-5 text-primary-gold" /> Station Pulse
                                    </h4>
                                    <div className="space-y-6">
                                        <div>
                                            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1 text-xs">Status</p>
                                            <p className={cn("text-2xl font-fraunces", isOnline ? "text-green-500" : "text-amber-500")}>
                                                {isOnline ? 'Live & Accepting' : 'Paused'}
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Leads</p>
                                                <p className="text-3xl font-fraunces text-primary-gold">{inquiries.length}</p>
                                            </div>
                                            <div>
                                                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Appointments</p>
                                                <p className="text-3xl font-fraunces text-white">{appointments.length}</p>
                                            </div>
                                        </div>
                                        <div className="pt-6 border-t border-white/10">
                                            <p className="text-xs text-white/40 leading-relaxed italic">
                                                "Inspiration starts with interaction."
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-[2rem] p-6 border border-secondary-pearl shadow-lg">
                                    <h5 className="text-[10px] font-bold text-primary-charcoal/40 uppercase tracking-widest mb-4">Quick Shortcuts</h5>
                                    <div className="space-y-2">
                                        <Button variant="ghost" className="w-full justify-start text-[10px] font-bold uppercase tracking-widest text-primary-charcoal/60 hover:text-primary-gold">
                                            <Search className="w-3.5 h-3.5 mr-2" /> Search Client
                                        </Button>
                                        <Button variant="ghost" className="w-full justify-start text-[10px] font-bold uppercase tracking-widest text-primary-charcoal/60 hover:text-primary-gold">
                                            <Sparkles className="w-3.5 h-3.5 mr-2" /> Daily Rituals
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
