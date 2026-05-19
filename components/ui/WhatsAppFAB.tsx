"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, ArrowRight, Sparkles, User, Headphones, Scissors, Send, ArrowLeft } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { team } from "@/lib/data/team";
import { supabase } from "@/lib/supabase";

interface ChatContact {
    id: string;
    name: string;
    role: string;
    number: string;
    type: 'reception' | 'stylist' | 'director';
    avatar?: string;
    status: 'Online' | 'Busy' | 'Offline';
}

export default function WhatsAppFAB() {
    const [isVisible, setIsVisible] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [liveStatuses, setLiveStatuses] = useState<Record<number, boolean>>({});
    
    // Live Chat State
    const [activeSession, setActiveSession] = useState<{ id: string, contact: ChatContact } | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [messageInput, setMessageInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 2500);
        
        // Initial fetch
        const fetchStatuses = async () => {
            const { data } = await supabase.from('staff_status').select('staff_id, is_online');
            if (data) {
                const statusMap: Record<number, boolean> = {};
                data.forEach(s => statusMap[s.staff_id] = s.is_online);
                setLiveStatuses(statusMap);
            }
        };
        fetchStatuses();

        // Subscribe to real-time changes
        const channel = supabase
            .channel('staff_status_changes')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'staff_status' }, (payload) => {
                setLiveStatuses(prev => ({
                    ...prev,
                    [payload.new.staff_id]: payload.new.is_online
                }));
            })
            .subscribe();

        return () => {
            clearTimeout(timer);
            supabase.removeChannel(channel);
        };
    }, []);

    // Subscribe to messages when a session is active
    useEffect(() => {
        if (!activeSession) return;

        const fetchMessages = async () => {
            const { data } = await supabase
                .from('live_chat_messages')
                .select('*')
                .eq('session_id', activeSession.id)
                .order('created_at', { ascending: true });
            if (data) setMessages(data);
        };
        fetchMessages();

        const channel = supabase
            .channel('live_chat_' + activeSession.id)
            .on('postgres_changes', { 
                event: 'INSERT', 
                schema: 'public', 
                table: 'live_chat_messages',
                filter: `session_id=eq.${activeSession.id}`
            }, (payload) => {
                setMessages(prev => [...prev, payload.new]);
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [activeSession]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, activeSession]);

    const contacts: ChatContact[] = [
        {
            id: 'reception',
            name: 'Hideaway Reception',
            role: 'Bookings & Inquiries',
            number: '971561348671',
            type: 'reception',
            status: 'Online'
        },
        ...team.map(member => ({
            id: member.id.toString(),
            name: member.name,
            role: member.role,
            number: member.whatsapp,
            type: member.seniority === 'Executive' ? 'director' as const : 'stylist' as const,
            avatar: member.image,
            status: liveStatuses[member.id] ?? member.isOnline ? 'Online' as const : 'Offline' as const
        }))
    ];

    const handleChatStart = async (contact: ChatContact) => {
        const staffId = contact.id === 'reception' ? 0 : parseInt(contact.id);
        
        // Log the inquiry to Supabase and get the ID
        const { data, error } = await supabase.from('inquiries').insert({
            staff_id: staffId,
            message_type: contact.type === 'reception' ? 'Booking Inquiry' : 'Ritual Consultation',
            customer_name: 'Website Visitor',
            platform: 'Live Chat'
        }).select().single();

        if (data) {
            setActiveSession({ id: data.id, contact });
            
            // Send initial automated message from staff
            await supabase.from('live_chat_messages').insert({
                session_id: data.id,
                staff_id: staffId,
                sender_type: 'staff',
                content: `Hi there! You are connected to ${contact.name}. How can we help you today?`
            });
        }
    };

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageInput.trim() || !activeSession) return;

        const content = messageInput;
        setMessageInput("");

        await supabase.from('live_chat_messages').insert({
            session_id: activeSession.id,
            staff_id: activeSession.contact.id === 'reception' ? 0 : parseInt(activeSession.contact.id),
            sender_type: 'customer',
            content
        });
    };

    return (
        <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20, originX: 1, originY: 1 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="bg-white rounded-[2.5rem] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.3)] w-[360px] border border-secondary-pearl overflow-hidden relative flex flex-col h-[500px]"
                    >
                        {/* Header */}
                        <div className="bg-primary-charcoal p-8 relative shrink-0">
                            <div className="absolute top-0 left-0 w-full h-1 bg-primary-gold" />
                            {activeSession ? (
                                <button 
                                    onClick={() => setActiveSession(null)}
                                    className="absolute top-6 left-6 text-white/50 hover:text-white transition-colors"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                            ) : null}
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            
                            <h3 className={cn("font-fraunces text-white mb-2", activeSession ? "text-xl mt-4" : "text-2xl")}>
                                {activeSession ? activeSession.contact.name : "Artisan Concierge"}
                            </h3>
                            <p className="text-white/50 text-[11px] font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                                <Sparkles className="w-3 h-3 text-primary-gold" /> 
                                {activeSession ? activeSession.contact.role : "Select your contact"}
                            </p>
                        </div>

                        {!activeSession ? (
                            <>
                                {/* Contact List */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-primary-ivory/30">
                                    {contacts.map((contact) => (
                                        <button
                                            key={contact.id}
                                            onClick={() => handleChatStart(contact)}
                                            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white border border-secondary-pearl hover:border-primary-gold hover:shadow-md transition-all group text-left"
                                        >
                                            <div className="relative shrink-0">
                                                <div className="w-12 h-12 rounded-full overflow-hidden bg-primary-ivory border border-secondary-pearl">
                                                    {contact.avatar ? (
                                                        <img src={contact.avatar} alt={contact.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-primary-charcoal/30">
                                                            {contact.type === 'reception' ? <Headphones className="w-5 h-5" /> : <Scissors className="w-5 h-5" />}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className={cn(
                                                    "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white",
                                                    contact.status === 'Online' ? "bg-green-500" : "bg-amber-500"
                                                )} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-primary-charcoal text-sm group-hover:text-primary-gold transition-colors">{contact.name}</p>
                                                <p className="text-[10px] text-primary-charcoal/40 font-bold uppercase tracking-widest">{contact.role}</p>
                                            </div>
                                            <ArrowRight className="w-4 h-4 text-primary-charcoal/10 group-hover:text-primary-gold group-hover:translate-x-1 transition-all" />
                                        </button>
                                    ))}
                                </div>
                                <div className="p-4 bg-white border-t border-secondary-pearl text-center shrink-0">
                                    <p className="text-[10px] text-primary-charcoal/30 font-medium italic mb-0">
                                        Typical response time: Under 5 minutes
                                    </p>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Active Chat Window */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-primary-ivory/20">
                                    {messages.map((msg) => {
                                        const isCustomer = msg.sender_type === 'customer';
                                        return (
                                            <div key={msg.id} className={cn("flex flex-col", isCustomer ? "items-end" : "items-start")}>
                                                <div className={cn(
                                                    "max-w-[85%] p-4 rounded-2xl text-sm shadow-sm",
                                                    isCustomer ? "bg-primary-gold text-white rounded-br-none" : "bg-white text-primary-charcoal border border-secondary-pearl rounded-bl-none"
                                                )}>
                                                    <p className="leading-relaxed">{msg.content}</p>
                                                </div>
                                                <p className="text-[8px] font-bold text-primary-charcoal/30 uppercase tracking-widest mt-1">
                                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        );
                                    })}
                                    <div ref={messagesEndRef} />
                                </div>
                                <form onSubmit={sendMessage} className="p-4 bg-white border-t border-secondary-pearl shrink-0">
                                    <div className="relative">
                                        <input 
                                            type="text"
                                            value={messageInput}
                                            onChange={(e) => setMessageInput(e.target.value)}
                                            placeholder="Type a message..."
                                            className="w-full h-12 pl-4 pr-12 bg-primary-ivory/50 rounded-xl border border-secondary-pearl focus:ring-2 focus:ring-primary-gold outline-none transition-all text-sm text-primary-charcoal placeholder:text-primary-charcoal/30"
                                        />
                                        <button 
                                            type="submit"
                                            className="absolute right-1 top-1 h-10 w-10 text-primary-charcoal hover:text-primary-gold flex items-center justify-center transition-all"
                                        >
                                            <Send className="w-5 h-5" />
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isVisible && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        onClick={() => setIsOpen(!isOpen)}
                        className={cn(
                            "w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 relative group overflow-hidden",
                            isOpen ? "bg-white text-primary-charcoal rotate-90" : "bg-primary-charcoal text-white hover:bg-primary-gold"
                        )}
                    >
                        {isOpen ? <X className="w-8 h-8" /> : <MessageCircle className="w-8 h-8 group-hover:scale-110 transition-transform" />}
                        {!isOpen && (
                            <motion.span 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="absolute right-full mr-6 py-2.5 px-5 bg-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-primary-charcoal shadow-xl whitespace-nowrap hidden md:block"
                            >
                                CHAT WITH US
                            </motion.span>
                        )}
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}
