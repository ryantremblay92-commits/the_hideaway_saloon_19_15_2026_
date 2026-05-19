"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, AlertCircle, Facebook } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

import { Suspense } from "react";

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const authError = searchParams.get('error');

    useEffect(() => {
        if (authError === 'auth_failed') {
            toast.error("Authentication failed. Please check your credentials or provider settings.");
        }
    }, [authError]);

    const supabase = createClient();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setIsLoading(false);
        } else {
            router.push("/admin/dashboard");
            router.refresh();
        }
    };

    const handleGoogleLogin = async () => {
        setError(null);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) {
            setError(error.message);
        }
    };

    const handleFacebookLogin = async () => {
        setError(null);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'facebook',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) {
            setError(error.message);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-6 bg-[#0A0A0B] relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-gold/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary-gold/5 rounded-full blur-[120px]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Logo Area */}
                <div className="text-center mb-10">
                    <Link href="/" className="inline-flex items-center gap-3 mb-6">
                        <div className="relative w-12 h-12">
                            <Image
                                src="/images/logo.png"
                                alt="The Hideaway Logo"
                                fill
                                className="object-contain mix-blend-screen"
                            />
                        </div>
                        <span className="font-fraunces text-3xl font-light tracking-tighter text-white">The Hideaway</span>
                    </Link>
                    <h2 className="font-fraunces text-2xl font-bold text-white mb-2">Welcome Back</h2>
                    <p className="text-white/50 text-sm italic">Enter your details to access your rituals.</p>
                </div>

                {/* Login Card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-[2.5rem] shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 bg-red-400/10 border border-red-400/20 rounded-2xl text-red-400 text-xs flex items-center gap-3"
                            >
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                {error}
                            </motion.div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary-gold/80 block ml-1">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                                <Input
                                    type="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-12 bg-white/5 border-white/10 text-white placeholder:text-white/20 h-14"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary-gold/80 block">
                                    Password
                                </label>
                                <Link href="#" className="text-[10px] uppercase tracking-[0.1em] font-medium text-white/40 hover:text-primary-gold transition-colors">
                                    Forgot?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-12 pr-12 bg-white/5 border-white/10 text-white placeholder:text-white/20 h-14"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-14 text-base font-bold group relative overflow-hidden"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    Sign In <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                            )}
                        </Button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-white/5 text-center">
                        <p className="text-white/40 text-sm">
                            Don&apos;t have an account?{" "}
                            <Link href="/auth/register" className="text-primary-gold hover:underline font-semibold">
                                Create Account
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Social Login Hint */}
                <div className="mt-8 text-center space-y-4">
                    <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/20">OR CONTINUE WITH</p>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={handleGoogleLogin}
                            type="button"
                            className="flex-1 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center gap-3 hover:bg-white/10 transition-all hover:scale-[1.02] active:scale-[0.98] text-sm font-medium"
                        >
                            <svg className="w-5 h-5 shadow-sm" viewBox="0 0 24 24">
                                <path fill="white" d="M12.48 10.92v3.28h7.84c-.24 1.84-.908 3.152-1.928 4.176-1.028 1.024-2.604 2.144-4.592 2.144-6.944 0-12.6-5.32-12.6-11.9s5.656-11.9 12.6-11.9c3.816 0 6.548 1.416 8.528 3.208l2.268-2.268C21.78 1.944 18.06 0 13.32 0 6.07 0 0 5.61 0 12.5s6.07 12.5 13.32 12.5c4.11 0 7.224-1.352 9.61-3.824 2.472-2.472 3.256-5.912 3.256-8.68 0-.84-.064-1.632-.192-2.384H12.48z" />
                            </svg>
                            Google
                        </button>
                        <button
                            onClick={handleFacebookLogin}
                            type="button"
                            className="flex-1 h-14 rounded-2xl bg-[#1877F2]/10 border border-[#1877F2]/20 flex items-center justify-center gap-3 hover:bg-[#1877F2]/20 transition-all hover:scale-[1.02] active:scale-[0.98] text-sm font-medium text-[#1877F2]"
                        >
                            <Facebook className="w-5 h-5 fill-[#1877F2]" />
                            Facebook
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen w-full flex items-center justify-center p-6 bg-[#0A0A0B]"><Loader2 className="w-8 h-8 animate-spin text-primary-gold" /></div>}>
            <LoginContent />
        </Suspense>
    );
}
