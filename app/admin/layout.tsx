"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    Calendar,
    Scissors,
    Image as ImageIcon,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    Sparkles,
    MessageCircle,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import Image from "next/image";
import NotificationCenter from "@/components/admin/NotificationCenter";

const sidebarLinks = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Bookings", href: "/admin/bookings", icon: Calendar },
    { name: "Editor Suite", href: "/admin/content", icon: ImageIcon },
    { name: "Clients", href: "/admin/clients", icon: Users },
    { name: "Loyalty", href: "/admin/loyalty", icon: Sparkles },
    { name: "Consultations", href: "/admin/consultations", icon: MessageCircle },
    { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

    return (
        <div className="min-h-screen bg-background text-white flex">
            {/* --- Elite Sidebar --- */}
            <aside
                className={`
                    fixed inset-y-0 left-0 z-50
                    bg-[#060608] border-r border-white/[0.04]
                    transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]
                    ${isSidebarOpen ? "w-72" : "w-20"}
                    hidden lg:flex flex-col
                `}
            >
                {/* Sidebar Ambient */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-20 -left-20 w-60 h-60 bg-primary-gold/[0.03] rounded-full blur-[80px]" />
                    <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary-gold/10 to-transparent" />
                </div>

                {/* Sidebar Header */}
                <div className="h-24 flex items-center px-6 mb-4 border-b border-white/[0.04] relative">
                    <Link href="/" className="flex items-center gap-3 overflow-hidden group">
                        <div className="relative w-10 h-10 flex-shrink-0">
                            <Image
                                src="/images/logo.png"
                                alt="The Hideaway Logo"
                                fill
                                className="object-contain mix-blend-screen group-hover:scale-110 transition-transform duration-500"
                            />
                        </div>
                        <AnimatePresence>
                            {isSidebarOpen && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className="font-fraunces text-2xl font-light tracking-tighter text-white/90"
                                >
                                    Hideaway
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </Link>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-3 space-y-1 py-4 relative">
                    {sidebarLinks.map((link, idx) => {
                        const isActive = pathname === link.href;
                        const Icon = link.icon;

                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`
                                    flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-500 group relative
                                    ${isActive
                                        ? "bg-primary-gold text-primary-charcoal shadow-[0_0_30px_rgba(201,169,98,0.15)]"
                                        : "text-white/30 hover:text-white/70 hover:bg-white/[0.03]"}
                                `}
                            >
                                {/* Active indicator line */}
                                {isActive && !isSidebarOpen && (
                                    <motion.div
                                        layoutId="sidebar-active"
                                        className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-8 bg-primary-gold rounded-r-full"
                                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                                    />
                                )}
                                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-primary-charcoal" : "group-hover:text-primary-gold transition-colors duration-500"}`} />
                                <AnimatePresence>
                                    {isSidebarOpen && (
                                        <motion.span
                                            initial={{ opacity: 0, x: -5 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -5 }}
                                            className={`text-[13px] tracking-tight whitespace-nowrap ${isActive ? "font-bold" : "font-medium"}`}
                                        >
                                            {link.name}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </Link>
                        );
                    })}
                </nav>

                {/* Sidebar Footer */}
                <div className="p-3 border-t border-white/[0.04] space-y-2">
                    <button className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-white/20 hover:text-red-400 hover:bg-red-400/5 transition-all duration-500 group">
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        <AnimatePresence>
                            {isSidebarOpen && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-[13px] font-medium tracking-tight"
                                >
                                    Sign Out
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </button>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="w-full flex items-center justify-center p-2.5 text-white/10 hover:text-white/40 transition-colors rounded-xl hover:bg-white/[0.02]"
                    >
                        {isSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                </div>
            </aside>

            {/* --- Main Content Area --- */}
            <main
                className="flex-1 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
                style={{ paddingLeft: isSidebarOpen ? '18rem' : '5rem' }}
            >
                {/* Admin Header Bar */}
                <header className="h-20 border-b border-white/[0.04] px-10 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-2xl z-40">
                    <div className="flex items-center gap-4">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em]">Operational: Horizon-1</span>
                    </div>
                    <div className="flex items-center gap-5">
                        <NotificationCenter />
                        <div className="h-6 w-px bg-white/[0.04]" />
                        <button className="flex items-center gap-3 px-4 py-2 bg-white/[0.03] border border-white/[0.06] rounded-2xl hover:bg-white/[0.06] transition-all duration-500 group">
                            <div className="w-8 h-8 rounded-xl bg-primary-gold flex items-center justify-center text-primary-charcoal font-bold text-[10px] tracking-wider shadow-[0_0_15px_rgba(201,169,98,0.2)]">
                                AD
                            </div>
                            <span className="text-[11px] font-medium text-white/40 group-hover:text-white/70 transition-colors tracking-tight">Administrator</span>
                        </button>
                    </div>
                </header>

                <div className="max-w-[1600px] mx-auto p-6 md:p-10">
                    {children}
                </div>
            </main>
        </div>
    );
}
