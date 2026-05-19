"use client";

import React, { useState, useEffect } from "react";
import { Bell, Check, Trash2, Clock, Sparkles, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getMyNotifications, markNotificationAsRead } from "@/lib/actions/engagement";
import { createClient } from "@/lib/supabase/client";

export default function NotificationCenter() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const supabase = createClient();

    const fetchNotifications = async () => {
        const data = await getMyNotifications();
        setNotifications(data);
        setUnreadCount(data.filter((n: any) => !n.is_read).length);
    };

    useEffect(() => {
        fetchNotifications();

        // Subscribe to real-time notifications
        const channel = supabase
            .channel('realtime_notifications')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, () => {
                fetchNotifications();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const handleMarkAsRead = async (id: string) => {
        await markNotificationAsRead(id);
        fetchNotifications();
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-primary-gold/30 transition-all group"
            >
                <Bell className="w-5 h-5 text-white/60 group-hover:text-primary-gold transition-colors" />
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-primary-gold rounded-full border-2 border-[#0A0A0B] animate-pulse" />
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 mt-4 w-96 bg-[#121214] border border-white/10 rounded-[2rem] shadow-2xl z-50 overflow-hidden backdrop-blur-3xl"
                        >
                            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                                <h3 className="font-fraunces text-xl font-bold flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-primary-gold" /> Commands
                                </h3>
                                <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{unreadCount} Unread</span>
                            </div>

                            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                {notifications.length === 0 ? (
                                    <div className="p-12 text-center">
                                        <p className="text-white/20 text-sm italic">Transmission silent...</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-white/5">
                                        {notifications.map((n) => (
                                            <div
                                                key={n.id}
                                                className={`p-6 hover:bg-white/[0.02] transition-colors relative group ${!n.is_read ? 'bg-primary-gold/5' : ''}`}
                                            >
                                                <div className="flex gap-4">
                                                    <div className={`mt-1 p-2 rounded-xl border ${n.type === 'reward' ? 'bg-primary-gold/10 border-primary-gold/20 text-primary-gold' :
                                                            n.type === 'booking_new' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                                                                'bg-white/5 border-white/10 text-white/40'
                                                        }`}>
                                                        {n.type === 'reward' ? <Sparkles className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                                                    </div>
                                                    <div className="flex-1 space-y-1">
                                                        <div className="flex justify-between items-start">
                                                            <p className="text-sm font-bold text-white">{n.title}</p>
                                                            {!n.is_read && (
                                                                <button
                                                                    onClick={() => handleMarkAsRead(n.id)}
                                                                    className="p-1 text-primary-gold/40 hover:text-primary-gold transition-colors"
                                                                    title="Dismiss"
                                                                >
                                                                    <Check className="w-3.5 h-3.5" />
                                                                </button>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-white/40 leading-relaxed">{n.message}</p>
                                                        <div className="flex items-center gap-2 pt-2">
                                                            <Clock className="w-3 h-3 text-white/10" />
                                                            <span className="text-[9px] font-bold text-white/10 uppercase tracking-widest">
                                                                {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="p-4 bg-white/[0.02] border-t border-white/5 text-center">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-[10px] font-bold text-primary-gold uppercase tracking-[0.2em] hover:text-white transition-colors"
                                >
                                    Close Operations
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
