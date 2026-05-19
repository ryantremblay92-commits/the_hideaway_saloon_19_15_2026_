'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Send,
    ArrowLeft,
    Image as ImageIcon,
    CheckCircle2,
    XCircle,
    DollarSign,
    Layers,
    Sparkles,
    Clock,
    Palette,
    Download,
    Loader2,
    Bot,
    User,
    Gem,
    Wand2,
} from 'lucide-react';
import {
    getConsultationById,
    getConsultationMessages,
    sendMessage,
    updateConsultationStatus,
    type Consultation,
    type ConsultationMessage,
} from '@/lib/actions/consultation';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import Image from 'next/image';

// Color visualization mapping (MCP tailwind-inspired)
const COLOR_LEVEL_SWATCHES: Record<string, string> = {
    '1': '#0A0A0A', '2': '#1A1A1A', '3': '#2D2D2D',
    '4': '#404040', '5': '#5C4A3A', '6': '#7A5D3D',
    '7': '#9B7B4F', '8': '#C4A265', '9': '#E0C88A', '10': '#F5E6C4',
};
const TONE_GRADIENTS: Record<string, string> = {
    warm: 'from-orange-400/30 to-amber-500/10',
    cool: 'from-blue-400/30 to-purple-500/10',
    neutral: 'from-gray-400/30 to-white/5',
};

// AI Studio action types
type AIActionType = 'hairstyle' | 'makeup' | 'color';

const AI_ACTIONS: Array<{ type: AIActionType; label: string; description: string; icon: any }> = [
    { type: 'hairstyle', label: 'Hairstyle Variations', description: 'AI-generated styles based on face shape', icon: Wand2 },
    { type: 'makeup', label: 'Makeup Looks', description: 'Undertone-matched makeup visualization', icon: Palette },
    { type: 'color', label: 'Color Analysis', description: 'Digital draping for seasonal palette', icon: Sparkles },
];

export default function AdminConsultationChatPage() {
    const params = useParams();
    const router = useRouter();
    const consultationId = params.id as string;
    const supabase = createClient();

    const [consultation, setConsultation] = useState<Consultation | null>(null);
    const [messages, setMessages] = useState<ConsultationMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const [estimatePrice, setEstimatePrice] = useState<number | ''>('');
    const [estimateSessions, setEstimateSessions] = useState<number | ''>('');
    const [estimateNotes, setEstimateNotes] = useState('');
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const [activeAIAction, setActiveAIAction] = useState<AIActionType | null>(null);
    const [isAIGenerating, setIsAIGenerating] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadData();

        const channel = supabase
            .channel('admin-consult-channel')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'consultation_messages', filter: `consultation_id=eq.${consultationId}` },
                (payload) => {
                    setMessages(prev => [...prev, payload.new as ConsultationMessage]);
                }
            )
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [consultationId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const loadData = async () => {
        const [consultData, messagesData] = await Promise.all([
            getConsultationById(consultationId),
            getConsultationMessages(consultationId),
        ]);

        if (consultData) {
            setConsultation(consultData);
            if (consultData.estimated_price) setEstimatePrice(consultData.estimated_price);
            if (consultData.sessions_required) setEstimateSessions(consultData.sessions_required);
            if (consultData.stylist_notes) setEstimateNotes(consultData.stylist_notes);
        }
        if (messagesData) setMessages(messagesData);
        setIsLoading(false);
    };

    const handleSend = async () => {
        if (!newMessage.trim()) return;
        const result = await sendMessage(consultationId, newMessage);
        if (result.success) setNewMessage('');
        else toast.error(result.error);
    };

    const handleUpdateStatus = async (status: 'approved' | 'rejected') => {
        if (status === 'approved' && !estimatePrice) {
            toast.error('Please provide an estimated price for approval.');
            return;
        }
        setIsUpdatingStatus(true);
        const result = await updateConsultationStatus(consultationId, status, {
            estimated_price: estimatePrice === '' ? undefined : Number(estimatePrice),
            sessions_required: estimateSessions === '' ? undefined : Number(estimateSessions),
            stylist_notes: estimateNotes,
        });

        if (result.success) {
            toast.success(`Consultation ${status}`);
            loadData();
            await sendMessage(
                consultationId,
                `Hello! I've reviewed your request. ${status === 'approved' ? `Good news! We can achieve this. Estimated cost: AED ${estimatePrice}.` : 'Unfortunately, this color is not recommended for your current hair condition.'} ${estimateNotes}`
            );
        } else {
            toast.error(result.error);
        }
        setIsUpdatingStatus(false);
    };

    // Real DALL-E-3 AI Generation via our Next.js API Route Handler
    const handleGenerateAIVariation = async (type: AIActionType) => {
        setActiveAIAction(type);
        setIsAIGenerating(true);

        const title =
            type === 'hairstyle' ? 'Hairstyle Analysis' :
                type === 'makeup' ? 'Makeup Analysis' :
                    'Personal Color Analysis';

        try {
            // Load stored AI engine config from Settings
            let aiConfig = null;
            try {
                const stored = localStorage.getItem("hideaway_ai_config");
                if (stored) {
                    aiConfig = JSON.parse(stored);
                }
            } catch (e) {
                console.error("Error reading localStorage AI config:", e);
            }

            const response = await fetch('/api/ai/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    consultationId,
                    type,
                    config: aiConfig,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to generate image');
            }

            const data = await response.json();
            const imageUrl = data.imageUrl;

            const description =
                type === 'hairstyle'
                    ? "Here are some hairstyle variations I've generated based on your face shape and current hair condition. Let me know which one you prefer!"
                    : type === 'makeup'
                        ? "I've analyzed your skin undertone and generated these makeup look variations that would complement your requested hair color perfectly."
                        : "I've performed a digital color draping analysis to find your seasonal palette. These colors will highlight your features best!";

            const result = await sendMessage(consultationId, description, imageUrl);

            if (result.success) {
                toast.success(`${title} generated and sent to customer.`);
                
                // Trigger real-time Resend.com transactional notification to customer!
                if (consultation?.profiles?.email) {
                    try {
                        fetch('/api/email/consultation-update', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                email: consultation.profiles.email,
                                name: consultation.profiles.full_name || 'Valued Guest',
                                type: type,
                                stylistName: 'Master Artisan Stylist'
                            })
                        }).then(res => {
                            if (res.ok) console.log('[Email Trigger] Resend notification successfully dispatched.');
                            else console.warn('[Email Trigger] Resend dispatch returned non-ok status');
                        }).catch(e => {
                            console.warn('[Email Trigger] Resend connection error:', e);
                        });
                    } catch (e) {
                        console.warn('[Email Trigger] Non-blocking Resend dispatch error:', e);
                    }
                }
            } else {
                toast.error(result.error);
            }
        } catch (error: any) {
            console.error('Error generating AI variation:', error);
            toast.error(error.message || `Failed to generate ${title}.`);
        } finally {
            setIsAIGenerating(false);
            setActiveAIAction(null);
        }
    };

    const getTimeAgo = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const days = Math.floor(diff / 86400000);
        if (days === 0) { const h = Math.floor(diff / 3600000); return h === 0 ? 'Just now' : `${h}h ago`; }
        return days === 1 ? 'Yesterday' : `${days}d ago`;
    };

    if (isLoading) return (
        <div className="flex items-center justify-center h-[calc(100vh-120px)]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary-gold/20 border-t-primary-gold rounded-full animate-spin" />
                <p className="text-white/40 text-sm">Loading consultation...</p>
            </div>
        </div>
    );
    if (!consultation) return (
        <div className="flex items-center justify-center h-[calc(100vh-120px)]">
            <p className="text-white/40 text-lg">Consultation not found.</p>
        </div>
    );

    const swatchColor = COLOR_LEVEL_SWATCHES[String(consultation.color_level)] || '#7A5D3D';
    const toneGrad = TONE_GRADIENTS[consultation.tone] || 'from-gray-500/30 to-white/5';

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-120px)]">
            {/* ======= LEFT PANEL: Client Dossier + AI Studio ======= */}
            <div className="w-full lg:w-[380px] xl:w-[420px] bg-white/5 border border-white/10 rounded-3xl overflow-y-auto hidden-scrollbar flex flex-col flex-shrink-0">
                {/* Sticky Header */}
                <div className="p-6 border-b border-white/10 sticky top-0 bg-[#060608]/90 backdrop-blur-xl z-10 flex items-center gap-4">
                    <button onClick={() => router.push('/admin/consultations')} className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white/40 hover:text-white">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="min-w-0">
                        <h2 className="text-lg font-bold text-white truncate">{consultation.profiles?.full_name}</h2>
                        <p className="text-xs text-white/40 truncate">{consultation.profiles?.email}</p>
                    </div>
                    <div className="ml-auto">
                        <div className={`w-2.5 h-2.5 rounded-full ${consultation.status === 'pending' ? 'bg-primary-gold animate-pulse' :
                                consultation.status === 'approved' ? 'bg-emerald-400' :
                                    consultation.status === 'rejected' ? 'bg-red-400' : 'bg-white/30'
                            }`} />
                    </div>
                </div>

                <div className="p-6 space-y-8 flex-1 overflow-y-auto">
                    {/* Color Visualization Card — MCP Tailwind-inspired */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-transparent p-5"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                            <div className={`w-full h-full bg-gradient-to-br ${toneGrad} rounded-full blur-3xl`} />
                        </div>
                        <p className="text-[9px] text-white/30 uppercase font-bold tracking-[0.3em] mb-4 relative z-10">Color Profile</p>
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="relative w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-white/10 shadow-xl">
                                <div className={`absolute inset-0 bg-gradient-to-br ${toneGrad}`} />
                                <div className="absolute inset-0" style={{ backgroundColor: swatchColor }} />
                            </div>
                            <div>
                                <p className="text-xl font-bold text-primary-gold">{consultation.selected_color_name}</p>
                                <p className="text-xs text-white/40 mt-0.5">
                                    Level {consultation.color_level} · {consultation.tone} tone
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Inspiration Images */}
                    <div>
                        <p className="text-[9px] text-white/30 uppercase font-bold tracking-[0.3em] mb-3">Inspiration Gallery</p>
                        <div className="grid grid-cols-2 gap-2">
                            {consultation.reference_images.map((img, i) => (
                                <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group/image">
                                    <Image src={img} alt="Ref" fill className="object-cover group-hover/image:scale-110 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/20 transition-colors" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Current Hair Images */}
                    {consultation.current_hair_images && consultation.current_hair_images.length > 0 && (
                        <div>
                            <p className="text-[9px] text-white/30 uppercase font-bold tracking-[0.3em] mb-3">Current Canvas</p>
                            <div className="grid grid-cols-2 gap-2">
                                {consultation.current_hair_images.map((img, i) => (
                                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group/image">
                                        <Image src={img} alt="Current" fill className="object-cover group-hover/image:scale-110 transition-transform duration-500" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Activity Timeline */}
                    <div>
                        <p className="text-[9px] text-white/30 uppercase font-bold tracking-[0.3em] mb-3">Activity</p>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-xs text-white/40">
                                <Clock className="w-3 h-3 text-primary-gold" />
                                <span>Submitted {getTimeAgo(consultation.created_at)}</span>
                            </div>
                            {consultation.updated_at !== consultation.created_at && (
                                <div className="flex items-center gap-3 text-xs text-white/40">
                                    <Sparkles className="w-3 h-3 text-primary-gold" />
                                    <span>Updated {getTimeAgo(consultation.updated_at)}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-3 text-xs">
                                <div className={`w-3 h-3 rounded-full ${consultation.status === 'pending' ? 'bg-primary-gold' :
                                        consultation.status === 'approved' ? 'bg-emerald-400' :
                                            consultation.status === 'rejected' ? 'bg-red-400' : 'bg-white/30'
                                    }`} />
                                <span className="text-white/60 capitalize">{consultation.status}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ======= MCP AI STUDIO ======= */}
                <div className="p-5 bg-black/30 border-t border-white/10">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-gold/20 to-purple-500/20 flex items-center justify-center">
                            <Bot className="w-4 h-4 text-primary-gold" />
                        </div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">AI Studio</h3>
                        <span className="text-[8px] text-white/20 uppercase tracking-widest ml-auto font-mono">MCP · supaui</span>
                    </div>

                    <div className="flex flex-col gap-2">
                        {AI_ACTIONS.map((action) => {
                            const Icon = action.icon;
                            const isActive = activeAIAction === action.type;
                            return (
                                <button
                                    key={action.type}
                                    onClick={() => handleGenerateAIVariation(action.type)}
                                    disabled={isAIGenerating}
                                    className={`
                                        relative group flex items-center gap-4 p-4 rounded-xl transition-all duration-500 text-left overflow-hidden
                                        ${isActive && isAIGenerating
                                            ? 'bg-primary-gold/10 border border-primary-gold/30'
                                            : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary-gold/30'
                                        }
                                        disabled:opacity-50
                                    `}
                                >
                                    {/* Pulse animation while generating */}
                                    {isActive && isAIGenerating && (
                                        <div className="absolute inset-0">
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-gold/5 to-transparent animate-pulse" />
                                        </div>
                                    )}

                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-500 ${isActive && isAIGenerating
                                            ? 'bg-primary-gold text-primary-charcoal'
                                            : 'bg-white/5 text-white/40 group-hover:text-primary-gold group-hover:bg-primary-gold/10'
                                        }`}>
                                        {isActive && isAIGenerating ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Icon className="w-4 h-4" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-xs font-bold uppercase tracking-wider ${isActive && isAIGenerating ? 'text-primary-gold' : 'text-white/70 group-hover:text-white'
                                            } transition-colors`}>
                                            {isActive && isAIGenerating ? 'Generating...' : action.label}
                                        </p>
                                        <p className="text-[10px] text-white/30 mt-0.5 truncate">{action.description}</p>
                                    </div>
                                    {!isAIGenerating && (
                                        <Sparkles className="w-3 h-3 text-primary-gold/40 group-hover:text-primary-gold transition-colors" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-4 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                        <p className="text-[9px] text-white/20 uppercase tracking-widest text-center">
                            Powered by multi-MCP orchestration · supaui · ui-ux-mcp
                        </p>
                    </div>
                </div>

                {/* ======= Stylist Decision Panel ======= */}
                {(consultation.status === 'pending' || consultation.status === 'approved') && (
                    <div className="p-5 bg-black/30 border-t border-white/10">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Gem className="w-4 h-4 text-primary-gold" /> Stylist Decision
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4">
                                <DollarSign className="w-4 h-4 text-white/30" />
                                <input
                                    type="number"
                                    placeholder="Estimated Price (AED)"
                                    value={estimatePrice}
                                    onChange={(e) => setEstimatePrice(e.target.value ? Number(e.target.value) : '')}
                                    className="w-full h-12 bg-transparent text-white font-bold placeholder:text-white/20 focus:outline-none"
                                />
                            </div>
                            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4">
                                <Layers className="w-4 h-4 text-white/30" />
                                <input
                                    type="number"
                                    placeholder="Sessions Required (Optional)"
                                    value={estimateSessions}
                                    onChange={(e) => setEstimateSessions(e.target.value ? Number(e.target.value) : '')}
                                    className="w-full h-12 bg-transparent text-white font-bold placeholder:text-white/20 focus:outline-none"
                                />
                            </div>
                            <textarea
                                placeholder="Notes for customer (e.g., 'Will need to bleach first')"
                                value={estimateNotes}
                                onChange={(e) => setEstimateNotes(e.target.value)}
                                className="w-full h-24 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/20 focus:outline-none resize-none"
                            />

                            <div className="flex gap-2 pt-2">
                                <button
                                    onClick={() => handleUpdateStatus('rejected')}
                                    disabled={isUpdatingStatus}
                                    className="flex-1 py-3 rounded-xl font-bold text-sm bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors border border-red-500/20 disabled:opacity-50"
                                >
                                    {isUpdatingStatus ? 'Processing...' : 'Decline'}
                                </button>
                                <button
                                    onClick={() => handleUpdateStatus('approved')}
                                    disabled={isUpdatingStatus}
                                    className="flex-1 py-3 rounded-xl font-bold text-sm bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors border border-emerald-500/30 disabled:opacity-50"
                                >
                                    {isUpdatingStatus ? 'Processing...' : 'Authorize'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* ======= RIGHT PANEL: Chat ======= */}
            <div className="flex-1 bg-white/5 border border-white/10 rounded-3xl flex flex-col overflow-hidden min-w-0">
                {/* Chat Header */}
                <div className="p-4 border-b border-white/10 bg-black/20 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="font-bold text-white text-sm">Live Consultation</span>
                    </div>
                    <span className="text-[10px] text-white/30 uppercase tracking-wider font-mono">
                        {messages.length} messages
                    </span>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <AnimatePresence initial={false}>
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className={`flex flex-col gap-2 max-w-[85%] ${msg.sender_type === 'stylist' ? 'self-end items-end ml-auto' : 'self-start items-start mr-auto'
                                    }`}
                            >
                                {/* Sender label */}
                                <div className="flex items-center gap-2">
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${msg.sender_type === 'stylist' ? 'bg-primary-gold' : 'bg-white/10'
                                        }`}>
                                        {msg.sender_type === 'stylist' ? (
                                            <Bot className="w-3 h-3 text-primary-charcoal" />
                                        ) : (
                                            <User className="w-3 h-3 text-white/60" />
                                        )}
                                    </div>
                                    <span className="text-[10px] text-white/30 uppercase font-bold tracking-wider">
                                        {msg.sender_type === 'stylist' ? 'You (Stylist)' : consultation.profiles?.full_name?.split(' ')[0] || 'Client'}
                                    </span>
                                </div>

                                {/* Bubble */}
                                <div className={`p-4 rounded-2xl ${msg.sender_type === 'stylist'
                                        ? 'bg-primary-gold text-primary-charcoal rounded-tr-sm'
                                        : 'bg-white/5 border border-white/10 text-white rounded-tl-sm'
                                    }`}>
                                    {msg.image_url && (
                                        <div className="relative w-48 sm:w-64 aspect-[4/5] rounded-xl overflow-hidden mb-3 border border-white/10 group/image">
                                            <Image src={msg.image_url} alt="Attachment" fill className="object-cover" />
                                            <div className="absolute top-2 right-2 opacity-0 group-hover/image:opacity-100 transition-opacity">
                                                <span className="px-2 py-1 bg-black/60 backdrop-blur-sm rounded-lg text-[9px] text-white font-bold uppercase tracking-wider">
                                                    AI Generated
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                    {msg.text_content && (
                                        <p className="text-sm font-medium whitespace-pre-wrap leading-relaxed">{msg.text_content}</p>
                                    )}
                                </div>

                                <span className="text-[10px] text-white/20">
                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 bg-black/20 border-t border-white/10 flex items-end gap-2 flex-shrink-0">
                    <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        placeholder="Type a message..."
                        className="flex-1 max-h-32 min-h-[48px] bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-primary-gold/50 resize-none"
                        rows={1}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!newMessage.trim()}
                        className="p-3 bg-primary-gold text-primary-charcoal rounded-xl hover:bg-white transition-colors disabled:opacity-50 flex-shrink-0"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}