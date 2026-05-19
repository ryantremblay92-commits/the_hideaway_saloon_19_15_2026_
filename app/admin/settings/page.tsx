"use client";

import React, { useState } from "react";
import {
    Settings as SettingsIcon,
    Bell,
    Shield,
    Clock,
    CreditCard,
    Smartphone,
    Save
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

export default function SettingsPage() {
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            toast.success("Settings saved successfully.");
        }, 1000);
    };

    return (
        <div className="space-y-10">
            <div>
                <h1 className="font-fraunces text-4xl font-bold text-white mb-2">System Preferences</h1>
                <p className="text-white/40 italic">Manage your operational settings and security.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Navigation Sidebar */}
                <div className="lg:col-span-3 space-y-2">
                    {[
                        { label: "General", icon: SettingsIcon, active: true },
                        { label: "Notifications", icon: Bell, active: false },
                        { label: "Security", icon: Shield, active: false },
                        { label: "Business Hours", icon: Clock, active: false },
                        { label: "Billing", icon: CreditCard, active: false },
                        { label: "Integrations", icon: Smartphone, active: false },
                    ].map((item, idx) => (
                        <button
                            key={idx}
                            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${item.active
                                    ? "bg-primary-gold/10 text-primary-gold border border-primary-gold/20 font-bold"
                                    : "text-white/40 hover:text-white hover:bg-white/5 font-medium"
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </button>
                    ))}
                </div>

                {/* Main Settings Area */}
                <div className="lg:col-span-9 space-y-8">
                    {/* General Settings */}
                    <div className="bg-[#0F0F10] border border-white/5 rounded-[2.5rem] p-8 space-y-8">
                        <div>
                            <h2 className="text-xl font-bold text-white font-fraunces mb-2">Salon Details</h2>
                            <p className="text-sm text-white/40">Update your primary business information.</p>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-white/60">Business Name</label>
                                    <input
                                        type="text"
                                        defaultValue="The Hideaway Saloon"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-gold transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-white/60">Support Email</label>
                                    <input
                                        type="email"
                                        defaultValue="hello@thehideawaysaloon.ae"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-gold transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-white/60">Contact Number</label>
                                <input
                                    type="text"
                                    defaultValue="+971 50 123 4567"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-gold transition-colors"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-white/60">Location</label>
                                <textarea
                                    defaultValue="The Hideaway Saloon, Downtown Dubai, UAE"
                                    rows={3}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-gold transition-colors resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Booking Preferences */}
                    <div className="bg-[#0F0F10] border border-white/5 rounded-[2.5rem] p-8 space-y-8">
                        <div>
                            <h2 className="text-xl font-bold text-white font-fraunces mb-2">Booking Preferences</h2>
                            <p className="text-sm text-white/40">Configure how clients can book rituals.</p>
                        </div>

                        <div className="space-y-4">
                            {[
                                { title: "Auto-Confirm Walk-ins", desc: "Automatically approve bookings made by admins.", enabled: true },
                                { title: "Require Phone Number", desc: "Clients must provide a valid phone number.", enabled: true },
                                { title: "Email Notifications", desc: "Send confirmation emails to clients.", enabled: true },
                                { title: "Allow Cancellations", desc: "Clients can cancel within 24 hours.", enabled: false },
                            ].map((setting, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl">
                                    <div>
                                        <h4 className="font-bold text-white">{setting.title}</h4>
                                        <p className="text-xs text-white/40 mt-1">{setting.desc}</p>
                                    </div>
                                    <div className={`w-12 h-6 rounded-full flex items-center px-1 cursor-pointer transition-colors ${setting.enabled ? 'bg-primary-gold' : 'bg-white/10'}`}>
                                        <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${setting.enabled ? 'translate-x-6' : 'translate-x-0'}`} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex justify-end pt-4">
                        <Button
                            variant="primary"
                            onClick={handleSave}
                            disabled={isLoading}
                            className="w-full md:w-auto flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-primary-charcoal border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Save Preferences
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
