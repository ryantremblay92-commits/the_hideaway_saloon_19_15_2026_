import React from "react";
import { getInvitationData } from "@/lib/actions/referral-invite";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Sparkles, Scissors, Clock, Zap, Star } from "lucide-react";
import { ClaimGiftButton } from "@/components/engagement/ClaimGiftButton";
import * as Framer from "framer-motion";

// Note: Framer-motion doesn't work directly in Server Components without 'use client', 
// so we'll wrap the layout in a client component or use standard CSS for the base structure.

export default async function InvitePage({
    params,
    searchParams
}: {
    params: { code: string },
    searchParams: { ritual?: string }
}) {
    const { code } = params;
    const ritualSlug = searchParams.ritual;

    const data = await getInvitationData(code, ritualSlug);

    if (!data.success || !data.service) {
        notFound();
    }

    const { referrerName, service, referralCode } = data;

    return (
        <main className="min-h-screen bg-[#080809] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary-gold/10 blur-[150px] rounded-full animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-white/5 blur-[120px] rounded-full animate-bounce-slow" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-30" />
            </div>

            <div className="max-w-xl w-full relative z-10">
                {/* Header / Brand */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/40 mb-6 backdrop-blur-md">
                        <Sparkles className="w-4 h-4 text-primary-gold" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Signature Invitation</span>
                    </div>
                </div>

                {/* The "Golden Ticket" Card */}
                <div className="relative group perspective-1000">
                    {/* Shadow/Glow behind card */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary-gold/40 via-white/10 to-primary-gold/40 rounded-[3rem] blur-2xl opacity-50 transition-all duration-700 group-hover:opacity-100" />

                    <div className="relative bg-[#0D0D0F] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl">
                        {/* Invitation Header */}
                        <div className="p-8 pb-4 text-center">
                            <h1 className="font-fraunces text-3xl text-white mb-2 leading-tight">
                                You&apos;ve Been <br />
                                <span className="text-primary-gold italic">Personally Invited</span>
                            </h1>
                            <p className="text-white/40 text-sm font-light">
                                &ldquo;Your friend <span className="text-white font-medium">{referrerName}</span> just experienced a ritual and left this for you.&rdquo;
                            </p>
                        </div>

                        {/* Ritual Spotlight Section */}
                        <div className="px-6 py-4">
                            <div className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden group/ritual bg-gradient-to-b from-white/[0.05] to-transparent">
                                <div className="relative h-48 w-full">
                                    <Image
                                        src={service.image}
                                        alt={service.title}
                                        fill
                                        className="object-cover opacity-60 group-hover/ritual:scale-105 transition-transform duration-[2s]"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0F] to-transparent" />
                                    <div className="absolute top-4 left-4 bg-primary-gold/10 backdrop-blur-md border border-primary-gold/20 px-3 py-1 rounded-full flex items-center gap-2">
                                        <Zap className="w-3 h-3 text-primary-gold" />
                                        <span className="text-[8px] font-black uppercase tracking-widest text-primary-gold">Recommended Ritual</span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-fraunces text-2xl font-bold text-white group-hover/ritual:text-primary-gold transition-colors">
                                                {service.title}
                                            </h3>
                                            <div className="flex items-center gap-3 mt-1 underline decoration-white/10 text-white/30 text-[10px] uppercase font-bold tracking-widest">
                                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {service.duration}</span>
                                                <span className="flex items-center gap-1"><Star className="w-3 h-3 text-primary-gold" /> Rated 4.9/5</span>
                                            </div>
                                        </div>
                                        <span className="text-xl font-bold text-white tracking-tight">AED {service.startingPrice}</span>
                                    </div>
                                    <p className="text-white/40 text-[11px] leading-relaxed italic mb-0">
                                        &ldquo;{service.shortDesc}&rdquo;
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Section */}
                        <div className="p-8 pt-4 space-y-6">
                            <ClaimGiftButton referralCode={referralCode} serviceSlug={service.slug} />

                            <p className="text-center text-[10px] text-white/20 uppercase tracking-[0.2em] font-medium">
                                Valid for first-time visitors only • Hideaway terms apply
                            </p>
                        </div>

                        {/* Aesthetic Footer / Line */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 flex items-center justify-center">
                            <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-primary-gold to-transparent opacity-50" />
                        </div>
                    </div>
                </div>

                {/* Secondary Info */}
                <div className="mt-12 text-center text-white/40 space-y-2">
                    <p className="text-xs font-light">The Hideaway Hair & Beauty Salon Dubai</p>
                    <div className="flex items-center justify-center gap-4">
                        <span className="w-1 h-1 rounded-full bg-white/10" />
                        <span className="w-1 h-1 rounded-full bg-white/10" />
                        <span className="w-1 h-1 rounded-full bg-white/10" />
                    </div>
                </div>
            </div>
        </main>
    );
}
