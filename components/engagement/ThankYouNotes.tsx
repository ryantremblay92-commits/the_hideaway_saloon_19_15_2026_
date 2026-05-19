'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Lightbulb, MessageSquare, Check } from 'lucide-react';
import Image from 'next/image';
import { markNoteAsRead } from '@/lib/actions/notes';

interface Note {
    id: string;
    message: string;
    note_type: 'thank_you' | 'hair_care_tip' | 'personal_note';
    is_read: boolean;
    created_at: string;
    sender: {
        full_name: string;
        avatar_url: string;
    };
}

export function ThankYouNotes({ notes }: { notes: Note[] }) {
    if (notes.length === 0) return null;

    const handleMarkAsRead = async (id: string) => {
        await markNoteAsRead(id);
        // Refresh handled by parent or local state if needed
    };

    return (
        <div className="mb-10">
            <div className="flex items-center gap-3 mb-6 px-1">
                <div className="w-8 h-8 rounded-xl bg-pink-500/10 flex items-center justify-center">
                    <Heart className="w-4 h-4 text-pink-400" />
                </div>
                <h4 className="font-bold text-white uppercase tracking-widest text-xs">Stylist Notes</h4>
            </div>

            <div className="space-y-4">
                <AnimatePresence>
                    {notes.map((note, i) => (
                        <motion.div
                            key={note.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`relative group rounded-3xl border p-6 overflow-hidden transition-all ${note.is_read
                                    ? 'bg-white/[0.02] border-white/[0.05]'
                                    : 'bg-white/[0.05] border-pink-500/20 shadow-lg shadow-pink-500/5'
                                }`}
                        >
                            {/* Unread Glow */}
                            {!note.is_read && (
                                <div className="absolute top-0 left-0 w-1 h-full bg-pink-500" />
                            )}

                            <div className="flex items-start gap-4">
                                <div className="relative w-12 h-12 rounded-2xl overflow-hidden grayscale group-hover:grayscale-0 transition-all">
                                    <Image
                                        src={note.sender.avatar_url || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200&q=80'}
                                        alt={note.sender.full_name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center justify-between gap-4 mb-2">
                                        <div>
                                            <p className="font-bold text-white text-sm">{note.sender.full_name}</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                {note.note_type === 'thank_you' && <Sparkles className="w-3 h-3 text-pink-400" />}
                                                {note.note_type === 'hair_care_tip' && <Lightbulb className="w-3 h-3 text-yellow-400" />}
                                                {note.note_type === 'personal_note' && <MessageSquare className="w-3 h-3 text-blue-400" />}
                                                <span className="text-[10px] uppercase tracking-wider text-white/30 font-black">
                                                    {note.note_type.replace('_', ' ')}
                                                </span>
                                            </div>
                                        </div>
                                        <span className="text-[10px] text-white/20 whitespace-nowrap">
                                            {new Date(note.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                        </span>
                                    </div>
                                    <p className="text-white/60 text-sm leading-relaxed italic">
                                        &ldquo;{note.message}&rdquo;
                                    </p>
                                </div>

                                {!note.is_read && (
                                    <button
                                        onClick={() => handleMarkAsRead(note.id)}
                                        className="w-8 h-8 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-400 hover:bg-pink-500 hover:text-white transition-all"
                                        title="Mark as read"
                                    >
                                        <Check className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
