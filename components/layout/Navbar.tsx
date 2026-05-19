"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { type Session } from "@supabase/supabase-js";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "Gallery", href: "/gallery" },
    { name: "Pricing", href: "/pricing" },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    const [user, setUser] = useState<any>(null);
    const supabase = createClient();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
            setUser(session?.user ?? null);
        });

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
            setUser(session?.user ?? null);
        });

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
            subscription.unsubscribe();
        };
    }, []);

    // Close menu when route changes
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    return (
        <nav
            className={cn(
                "fixed top-0 w-full h-20 z-50 transition-all duration-300",
                scrolled
                    ? "luxury-glass shadow-luxury border-b border-white/5"
                    : "bg-transparent"
            )}
        >
            <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative w-12 h-12 transition-transform duration-500 group-hover:scale-110">
                        <Image
                            src="/images/logo.png"
                            alt="The Hideaway Logo"
                            fill
                            className="object-contain mix-blend-screen"
                        />
                    </div>
                    <span className="font-fraunces text-2xl font-light tracking-tighter text-white">
                        Hideaway
                    </span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden lg:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={cn(
                                "text-sm font-light tracking-widest uppercase transition-colors hover:text-primary-gold",
                                pathname === link.href ? "text-primary-gold" : "text-white/70"
                            )}
                        >
                            {link.name}
                        </Link>
                    ))}

                    {user ? (
                        <Button asChild size="sm" variant="ghost" className="text-white hover:text-primary-gold p-0">
                            <Link href={user.user_metadata?.role === 'admin' ? "/admin/dashboard" : "/profile"}>
                                Dashboard
                            </Link>
                        </Button>
                    ) : (
                        <Link
                            href="/auth/login"
                            className="text-sm font-light tracking-widest uppercase text-white/70 hover:text-primary-gold transition-colors"
                        >
                            Sign In
                        </Link>
                    )}

                    <Button asChild size="sm" variant="luxury">
                        <Link href="/book">Book Now</Link>
                    </Button>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="lg:hidden p-2 text-white"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: "100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-0 top-20 bg-primary-charcoal-premium z-40 lg:hidden flex flex-col p-6 gap-6"
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={cn(
                                    "text-xl font-light tracking-widest uppercase border-b border-white/5 pb-4",
                                    pathname === link.href ? "text-primary-gold" : "text-white/70"
                                )}
                            >
                                {link.name}
                            </Link>
                        ))}

                        {user && (
                            <Link
                                href={user.user_metadata?.role === 'admin' ? "/admin/dashboard" : "/profile"}
                                className="text-xl font-light tracking-widest uppercase border-b border-white/5 pb-4 text-white/70"
                            >
                                Dashboard
                            </Link>
                        )}

                        <div className="mt-auto space-y-4">
                            {!user && (
                                <Button className="w-full" variant="outline" size="lg" asChild>
                                    <Link href="/auth/login">Sign In</Link>
                                </Button>
                            )}
                            <Button className="w-full" size="lg" asChild>
                                <Link href="/book">Book Online</Link>
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
