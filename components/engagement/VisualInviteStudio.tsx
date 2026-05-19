"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Download, Link as LinkIcon, Share2, Sparkles, Zap, Copy, Check, Instagram, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import Image from "next/image";

interface CreatorKitProps {
    referralCode: string;
    lastRitual?: {
        slug: string;
        title: string;
        image: string;
    } | null;
}

export default function VisualInviteStudio({ referralCode, lastRitual }: CreatorKitProps) {
    const [copied, setCopied] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadingAsset, setDownloadingAsset] = useState<string | null>(null);

    const assetBundle = [
        { id: 'macro', name: 'Golden Essence', url: '/ritual_macro_texture_1773252164631.png' },
        { id: 'vibe', name: 'Salon Atmosphere', url: '/ritual_atmosphere_salon_1773252185825.png' },
        { id: 'ritual', name: 'Master Massage', url: '/ritual_massage_focus_1773252265730.png' }
    ];

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://thehideaway.ae';
    const inviteLink = `${baseUrl}/invite/${referralCode}${lastRitual ? `?ritual=${lastRitual.slug}` : ''}`;

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(inviteLink)}&color=c9a962&bgcolor=0D0D0F&margin=10`;

    const handleCopy = () => {
        navigator.clipboard.writeText(inviteLink);
        setCopied(true);
        toast.success("Magic Link copied!", {
            description: "Add this to your Instagram Story 'Link' sticker."
        });
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownloadQR = async () => {
        setIsDownloading(true);
        try {
            const response = await fetch(qrUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Hideaway_QR_${referralCode}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            toast.success("Smart QR Downloaded!", {
                description: "Overlay this on your photos or videos."
            });
        } catch (error) {
            toast.error("Failed to download QR code.");
        } finally {
            setIsDownloading(false);
        }
    };

    const handleDownloadAsset = async (assetUrl: string, assetName: string) => {
        setDownloadingAsset(assetName);
        try {
            const response = await fetch(assetUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Hideaway_Asset_${assetName.replace(/\s+/g, '_')}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            toast.success(`${assetName} Pack Downloaded!`, {
                description: "Use this as a luxury background for your posts."
            });
        } catch (error) {
            toast.error(`Failed to download ${assetName}.`);
        } finally {
            setDownloadingAsset(null);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Visual Preview / Asset Kit */}
                <div className="flex-1 space-y-4">
                    <div className="relative aspect-[9/16] w-full max-w-[280px] mx-auto rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl group">
                        {/* The "Vibe" Preview */}
                        {lastRitual ? (
                            <Image
                                src={lastRitual.image}
                                alt="Ritual Atmosphere"
                                fill
                                className="object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-700"
                            />
                        ) : (
                            <div className="absolute inset-0 bg-primary-charcoal" />
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-primary-charcoal via-transparent to-black/20 p-6 flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <Sparkles className="w-6 h-6 text-primary-gold" />
                                <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[8px] font-black uppercase tracking-widest text-white/60">Live Invitations</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-2xl">
                                    <div className="flex justify-center mb-2">
                                        <div className="relative p-2 bg-white rounded-xl shadow-lg">
                                            <img src={qrUrl} alt="Smart QR" className="w-24 h-24" />
                                        </div>
                                    </div>
                                    <p className="text-center text-[8px] text-white/40 uppercase tracking-[0.2em] font-medium leading-relaxed">
                                        Scan to book {lastRitual?.title}&apos;s <br />
                                        Signature Ritual
                                    </p>
                                </div>

                                <div className="text-center">
                                    <h4 className="font-fraunces text-lg text-white mb-1">Join the Circle</h4>
                                    <p className="text-white/40 text-[9px] uppercase tracking-widest">At The Hideaway Dubai</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Toolkit Actions */}
                <div className="flex-[1.5] space-y-6">
                    <div>
                        <h3 className="font-fraunces text-2xl text-white mb-2">Creator Kit</h3>
                        <p className="text-white/40 text-sm leading-relaxed">
                            Be creative! Capture your new look and use these tools to directly invite your friends to try your ritual.
                        </p>
                    </div>

                    <div className="grid gap-4">
                        {/* Magic Link Sticker */}
                        <div className="bg-white/5 border border-white/10 p-6 rounded-3xl group hover:bg-white/[0.07] transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary-gold/10 flex items-center justify-center">
                                        <LinkIcon className="w-5 h-5 text-primary-gold" />
                                    </div>
                                    <div>
                                        <p className="text-white font-bold text-sm">Magic Link Sticker</p>
                                        <p className="text-white/30 text-[10px] uppercase tracking-widest">For IG Stories</p>
                                    </div>
                                </div>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={handleCopy}
                                    className="text-primary-gold hover:bg-primary-gold/10"
                                >
                                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                </Button>
                            </div>
                            <div className="relative bg-black/40 rounded-xl p-3 border border-white/5 overflow-hidden">
                                <code className="text-xs text-white/30 block truncate">
                                    {inviteLink}
                                </code>
                            </div>
                        </div>

                        {/* Branded QR Download */}
                        <div className="bg-white/5 border border-white/10 p-6 rounded-3xl group hover:bg-white/[0.07] transition-all">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center">
                                        <Zap className="w-5 h-5 text-sky-500" />
                                    </div>
                                    <div>
                                        <p className="text-white font-bold text-sm">Smart Ritual QR</p>
                                        <p className="text-white/30 text-[10px] uppercase tracking-widest">Transparent Overlay</p>
                                    </div>
                                </div>
                                <Button
                                    size="sm"
                                    onClick={handleDownloadQR}
                                    disabled={isDownloading}
                                    className="bg-sky-500 hover:bg-sky-600 text-white rounded-xl"
                                >
                                    {isDownloading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Download className="w-4 h-4" />}
                                </Button>
                            </div>
                        </div>

                        {/* Assets Bundle */}
                        <div className="bg-white/5 border border-white/10 p-6 rounded-3xl group hover:bg-white/[0.07] transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                        <ImageIcon className="w-5 h-5 text-purple-500" />
                                    </div>
                                    <div>
                                        <p className="text-white font-bold text-sm">Visual Ritual Pack</p>
                                        <p className="text-white/30 text-[10px] uppercase tracking-widest">High-end Backgrounds</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                {assetBundle.map((asset) => (
                                    <button
                                        key={asset.id}
                                        onClick={() => handleDownloadAsset(asset.url, asset.name)}
                                        disabled={downloadingAsset === asset.name}
                                        className="relative aspect-[9/16] rounded-xl overflow-hidden border border-white/5 hover:border-primary-gold/50 transition-all group/asset"
                                    >
                                        <Image
                                            src={asset.url}
                                            alt={asset.name}
                                            fill
                                            className="object-cover opacity-60 group-hover/asset:opacity-100 group-hover/asset:scale-110 transition-all duration-500"
                                        />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/asset:opacity-100 transition-opacity">
                                            {downloadingAsset === asset.name ? (
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <Download className="w-5 h-5 text-white" />
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 pt-4 text-white/30">
                        <Share2 className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Share your ritual:</span>
                        <div className="flex gap-4">
                            <Instagram className="w-4 h-4 hover:text-white cursor-pointer transition-colors" />
                            <Share2 className="w-4 h-4 hover:text-white cursor-pointer transition-colors" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
