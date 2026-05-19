'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Send, ArrowLeft, Image as ImageIcon, Clock, CheckCircle2, XCircle, AlertCircle, ShoppingBag } from 'lucide-react';
import { getConsultationById, getConsultationMessages, sendMessage, type Consultation, type ConsultationMessage } from '@/lib/actions/consultation';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import Image from 'next/image';

export default function ConsultationChatPage() {
    const params = useParams();
    const router = useRouter();
    const consultationId = params.id as string;
    const supabase = createClient();
    
    const [consultation, setConsultation] = useState<Consultation | null>(null);
    const [messages, setMessages] = useState<ConsultationMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadData();
        
        // Subscribe to real-time messages
        const channel = supabase
            .channel('custom-all-channel')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'consultation_messages', filter: `consultation_id=eq.${consultationId}` },
                (payload) => {
                    setMessages(prev => [...prev, payload.new as ConsultationMessage]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [consultationId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const loadData = async () => {
        const [consultData, messagesData] = await Promise.all([
            getConsultationById(consultationId),
            getConsultationMessages(consultationId)
        ]);
        
        if (consultData) setConsultation(consultData);
        if (messagesData) setMessages(messagesData);
        setIsLoading(false);
    };

    const handleSend = async () => {
        if (!newMessage.trim()) return;
        setIsSending(true);
        const result = await sendMessage(consultationId, newMessage);
        if (result.success) {
            setNewMessage('');
        } else {
            toast.error(result.error);
        }
        setIsSending(false);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from('consultation_images')
            .upload(fileName, file);

        if (uploadError) {
            toast.error('Failed to upload image');
            setUploadingImage(false);
            return;
        }

        const { data } = supabase.storage.from('consultation_images').getPublicUrl(fileName);
        
        const result = await sendMessage(consultationId, 'Sent an image', data.publicUrl);
        if (!result.success) toast.error('Failed to send message');
        
        setUploadingImage(false);
    };

    if (isLoading) return <div className="min-h-screen bg-primary-charcoal pt-32 flex justify-center"><div className="w-8 h-8 border-4 border-primary-gold border-t-transparent rounded-full animate-spin"></div></div>;
    if (!consultation) return <div className="min-h-screen bg-primary-charcoal pt-32 text-center text-white">Consultation not found.</div>;

    const StatusBadge = () => {
        switch (consultation.status) {
            case 'approved': return <span className="flex items-center gap-1.5 text-green-400 bg-green-500/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-green-500/20"><CheckCircle2 className="w-3.5 h-3.5" /> Approved</span>;
            case 'rejected': return <span className="flex items-center gap-1.5 text-red-400 bg-red-500/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-red-500/20"><XCircle className="w-3.5 h-3.5" /> Not Possible</span>;
            case 'completed': return <span className="flex items-center gap-1.5 text-white/60 bg-white/5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-white/10"><CheckCircle2 className="w-3.5 h-3.5" /> Completed</span>;
            default: return <span className="flex items-center gap-1.5 text-primary-gold bg-primary-gold/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-primary-gold/20"><Clock className="w-3.5 h-3.5" /> Under Review</span>;
        }
    };

    return (
        <div className="min-h-screen bg-primary-charcoal pt-24 pb-0 flex flex-col h-screen">
            <div className="max-w-4xl w-full mx-auto flex-1 flex flex-col h-full bg-white/5 border-x border-white/10">
                
                {/* Header */}
                <div className="p-4 md:p-6 border-b border-white/10 flex items-center justify-between bg-primary-charcoal/50 backdrop-blur-md sticky top-24 z-10">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.push('/dashboard')} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-white flex items-center gap-3">
                                Color Consultation <StatusBadge />
                            </h1>
                            <p className="text-sm text-white/60 mt-1">Requested: {consultation.selected_color_name}</p>
                        </div>
                    </div>
                    {consultation.status === 'approved' && (
                        <button onClick={() => router.push('/book')} className="hidden sm:flex items-center gap-2 bg-primary-gold text-primary-charcoal px-5 py-2.5 rounded-full font-bold text-sm hover:bg-white transition-all">
                            <ShoppingBag className="w-4 h-4" /> Book Now
                        </button>
                    )}
                </div>

                {/* Estimate Banner */}
                {consultation.status === 'approved' && consultation.estimated_price && (
                    <div className="p-4 bg-primary-gold/10 border-b border-primary-gold/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-primary-gold shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm text-white font-bold">Stylist Estimate</p>
                                <p className="text-xs text-white/80 mt-1">{consultation.stylist_notes || "This color is achievable based on your current hair."}</p>
                            </div>
                        </div>
                        <div className="text-right shrink-0">
                            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Estimated Cost</p>
                            <p className="text-xl font-bold text-primary-gold">AED {consultation.estimated_price}</p>
                            {consultation.sessions_required && consultation.sessions_required > 1 && (
                                <p className="text-xs text-white/60">Requires {consultation.sessions_required} sessions</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                    {/* Initial Request Bubble */}
                    <div className="flex flex-col gap-2 max-w-[85%] self-end items-end ml-auto">
                        <span className="text-[10px] text-white/40 uppercase font-bold tracking-wider">You (Initial Request)</span>
                        <div className="bg-primary-gold text-primary-charcoal p-4 rounded-2xl rounded-tr-sm">
                            <p className="font-bold mb-2">Requested Color: {consultation.selected_color_name}</p>
                            <p className="text-sm opacity-80 mb-3">Level: {consultation.color_level} • Tone: {consultation.tone}</p>
                            
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {consultation.reference_images.map((img, i) => (
                                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-primary-charcoal/20">
                                        <Image src={img} alt="Reference" fill className="object-cover" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex flex-col gap-1 max-w-[85%] ${msg.sender_type === 'customer' ? 'self-end items-end ml-auto' : 'self-start items-start mr-auto'}`}>
                            <span className="text-[10px] text-white/40 uppercase font-bold tracking-wider mb-1">
                                {msg.sender_type === 'customer' ? 'You' : 'The Hideaway Stylist'}
                            </span>
                            <div className={`p-4 rounded-2xl ${msg.sender_type === 'customer' ? 'bg-white/10 text-white rounded-tr-sm' : 'bg-primary-charcoal border border-white/20 text-white rounded-tl-sm'}`}>
                                {msg.image_url && (
                                    <div className="relative w-48 sm:w-64 aspect-[4/5] rounded-xl overflow-hidden mb-3 border border-white/10">
                                        <Image src={msg.image_url} alt="Attachment" fill className="object-cover" />
                                    </div>
                                )}
                                {msg.text_content && <p className="text-sm whitespace-pre-wrap">{msg.text_content}</p>}
                            </div>
                            <span className="text-[10px] text-white/30">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-primary-charcoal border-t border-white/10">
                    <div className="relative flex items-end gap-2">
                        <label className={`p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl cursor-pointer transition-colors ${uploadingImage ? 'opacity-50 pointer-events-none' : ''}`}>
                            <ImageIcon className="w-5 h-5 text-white/60" />
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                        </label>
                        <textarea 
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            placeholder="Message your stylist..."
                            className="flex-1 max-h-32 min-h-[48px] bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-primary-gold/50 resize-none"
                            rows={1}
                        />
                        <button 
                            onClick={handleSend}
                            disabled={!newMessage.trim() || isSending}
                            className="p-3 bg-primary-gold text-primary-charcoal rounded-xl hover:bg-white transition-colors disabled:opacity-50 disabled:hover:bg-primary-gold"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                
            </div>
        </div>
    );
}
