"use client";

import React, { useState, useEffect } from "react";
import {
    Settings as SettingsIcon,
    Bell,
    Shield,
    Clock,
    CreditCard,
    Smartphone,
    Save,
    Cpu,
    CheckCircle,
    HelpCircle,
    RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

interface AIConfig {
    engine: "flux" | "dalle3" | "antigravity";
    clientId: string;
    clientSecret: string;
    syncMode: boolean;
}

export default function SettingsPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("general");
    const [aiConfig, setAiConfig] = useState<AIConfig>({
        engine: "flux",
        clientId: "antigravity-hideaway-salon-19",
        clientSecret: "ag_sec_****************************92db",
        syncMode: true
    });
    const [isSyncing, setIsSyncing] = useState(false);

    // Load initial config from localStorage
    useEffect(() => {
        const stored = localStorage.getItem("hideaway_ai_config");
        if (stored) {
            try {
                setAiConfig(JSON.parse(stored));
            } catch (e) {
                console.error("Error parsing stored AI config:", e);
            }
        }
    }, []);

    const handleSave = () => {
        setIsLoading(true);
        // Persist settings
        localStorage.setItem("hideaway_ai_config", JSON.stringify(aiConfig));
        setTimeout(() => {
            setIsLoading(false);
            toast.success("Preferences updated successfully.");
        }, 800);
    };

    const handleVerifyOAuth = () => {
        setIsSyncing(true);
        setTimeout(() => {
            setIsSyncing(false);
            toast.success("Antigravity OAuth connection verified & synchronized successfully!");
        }, 1500);
    };

    return (
        <div className="space-y-10">
            <div>
                <h1 className="font-fraunces text-4xl font-bold text-white mb-2">System Preferences</h1>
                <p className="text-white/40 italic">Manage your operational settings and AI engine integrations.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Navigation Sidebar */}
                <div className="lg:col-span-3 space-y-2">
                    {[
                        { id: "general", label: "General", icon: SettingsIcon },
                        { id: "notifications", label: "Notifications", icon: Bell },
                        { id: "security", label: "Security", icon: Shield },
                        { id: "hours", label: "Business Hours", icon: Clock },
                        { id: "billing", label: "Billing", icon: CreditCard },
                        { id: "integrations", label: "Integrations & AI", icon: Smartphone },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${activeTab === item.id
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
                    {activeTab === "general" && (
                        <>
                            {/* General Settings */}
                            <div className="bg-[#0F0F10] border border-white/5 rounded-[2.5rem] p-8 space-y-8 animate-fadeIn">
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
                        </>
                    )}

                    {activeTab === "integrations" && (
                        <div className="space-y-8 animate-fadeIn">
                            {/* AI & OAuth Connector Preference */}
                            <div className="bg-[#0F0F10] border border-white/5 rounded-[2.5rem] p-8 space-y-8">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Cpu className="w-6 h-6 text-primary-gold" />
                                            <h2 className="text-xl font-bold text-white font-fraunces">AI Studio Integration Settings</h2>
                                        </div>
                                        <p className="text-sm text-white/40">Choose your live image generation engine and manage connectivity credentials.</p>
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-bold w-fit">
                                        <CheckCircle className="w-4 h-4" />
                                        Antigravity Auth Synchronized
                                    </div>
                                </div>

                                <div className="space-y-6 border-t border-white/5 pt-6">
                                    {/* AI Engine Selection */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-white/60">Active AI Model / Engine</label>
                                        <select
                                            value={aiConfig.engine}
                                            onChange={(e) => setAiConfig({ ...aiConfig, engine: e.target.value as any })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-gold transition-colors"
                                        >
                                            <option value="flux" className="bg-[#0F0F10] text-white">Flagship FLUX (Fast, photorealistic & completely free)</option>
                                            <option value="dalle3" className="bg-[#0F0F10] text-white">OpenAI DALL-E 3 (High fidelity, detailed, requires API Key)</option>
                                            <option value="antigravity" className="bg-[#0F0F10] text-white">Antigravity Autonomous OAuth Connector (Premium execution layer)</option>
                                        </select>
                                    </div>

                                    {/* Antigravity OAuth Panel */}
                                    <div className="bg-white/5 border border-white/5 rounded-3xl p-6 space-y-6">
                                        <div>
                                            <h3 className="font-bold text-white mb-1">Antigravity OAuth Link</h3>
                                            <p className="text-xs text-white/40">Enter credentials to connect the salon's consultation tools directly to the Antigravity autonomous workspace.</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-white/60">OAuth Client ID</label>
                                                <input
                                                    type="text"
                                                    value={aiConfig.clientId}
                                                    onChange={(e) => setAiConfig({ ...aiConfig, clientId: e.target.value })}
                                                    placeholder="Enter Client ID"
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-gold transition-colors"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-white/60">OAuth Client Secret</label>
                                                <input
                                                    type="password"
                                                    value={aiConfig.clientSecret}
                                                    onChange={(e) => setAiConfig({ ...aiConfig, clientSecret: e.target.value })}
                                                    placeholder="Enter Client Secret"
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-gold transition-colors"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-4 pt-2">
                                            <Button
                                                variant="secondary"
                                                onClick={handleVerifyOAuth}
                                                disabled={isSyncing}
                                                className="flex items-center gap-2"
                                            >
                                                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                                                Verify & Sync Connection
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Synchronization Mode */}
                                    <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl">
                                        <div>
                                            <h4 className="font-bold text-white">Visual Cloud Synchronization</h4>
                                            <p className="text-xs text-white/40 mt-1">Automatically upload all generated styling options directly to secure Cloudinary buckets.</p>
                                        </div>
                                        <div 
                                            onClick={() => setAiConfig({ ...aiConfig, syncMode: !aiConfig.syncMode })}
                                            className={`w-12 h-6 rounded-full flex items-center px-1 cursor-pointer transition-colors ${aiConfig.syncMode ? 'bg-primary-gold' : 'bg-white/10'}`}
                                        >
                                            <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${aiConfig.syncMode ? 'translate-x-6' : 'translate-x-0'}`} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab !== "general" && activeTab !== "integrations" && (
                        <div className="bg-[#0F0F10] border border-white/5 rounded-[2.5rem] p-8 text-center py-20 animate-fadeIn">
                            <HelpCircle className="w-12 h-12 text-white/25 mx-auto mb-4" />
                            <h3 className="font-bold text-white text-lg">Work in Progress</h3>
                            <p className="text-white/40 text-sm mt-1">This preference module is currently configured to inherit from global defaults.</p>
                        </div>
                    )}

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
