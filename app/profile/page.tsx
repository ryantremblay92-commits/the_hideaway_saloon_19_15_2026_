"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { 
    User, 
    Calendar, 
    Clock, 
    History, 
    Award, 
    ChevronRight, 
    LogOut,
    Sparkles,
    Bell
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import SectionHeader from "@/components/ui/SectionHeader";
import { fadeInUp, staggerContainer } from "@/lib/animations";

interface UserProfile {
    full_name: string;
    loyalty_points: number;
    total_spent: number;
    tier?: string;
}

interface Booking {
    id: string;
    service_name: string;
    date: string;
    time: string;
    status: string;
}

export default function ProfilePage() {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);

    const [notifications, setNotifications] = useState<any[]>([]);

    useEffect(() => {
        async function loadProfile() {
            const { data: { session } } = await supabase.auth.getSession();
            
            if (!session) {
                router.push("/auth/login");
                return;
            }

            setUser(session.user);

            // Fetch profile data (name) from profiles
            const { data: userData } = await supabase
                .from("profiles")
                .select("full_name")
                .eq("id", session.user.id)
                .single();

            // Fetch loyalty data from loyalty_profiles
            const { data: loyaltyData } = await supabase
                .from("loyalty_profiles")
                .select("points, total_spent, tier")
                .eq("user_id", session.user.id)
                .single();

            setProfile({
                full_name: userData?.full_name || session.user.email,
                loyalty_points: loyaltyData?.points || 0,
                total_spent: loyaltyData?.total_spent || 0,
                tier: loyaltyData?.tier || 'Bronze'
            } as any);

            // Fetch bookings
            const { data: bookingsData } = await supabase
                .from("bookings")
                .select("id, service_name, date, time, status")
                .or(`user_id.eq.${session.user.id},customer_email.eq.${session.user.email}`)
                .order("date", { ascending: false });

            if (bookingsData) setBookings(bookingsData);

            // Fetch notifications
            const { data: notifData } = await supabase
                .from("notifications")
                .select("*")
                .eq("user_id", session.user.id)
                .order("created_at", { ascending: false })
                .limit(5);
            
            if (notifData) setNotifications(notifData);

            setLoading(false);
        }

        loadProfile();
    }, [router, supabase]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-primary-charcoal flex items-center justify-center">
                <div className="animate-pulse text-primary-gold font-fraunces text-2xl tracking-widest">
                    HIDEAWAY
                </div>
            </div>
        );
    }

    const upcomingBookings = bookings.filter(b => new Date(b.date) >= new Date() && b.status !== 'cancelled');
    const pastBookings = bookings.filter(b => new Date(b.date) < new Date() || b.status === 'cancelled');

    return (
        <main className="min-h-screen bg-primary-charcoal pt-32 pb-24 overflow-hidden relative">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-gold/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/2 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <motion.div 
                    initial="initial"
                    animate="animate"
                    variants={staggerContainer}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-12"
                >
                    {/* ── Sidebar: User Info ────────────────────────── */}
                    <motion.div variants={fadeInUp} className="lg:col-span-4 space-y-8">
                        <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-10 border border-white/10 shadow-glass">
                            <div className="flex flex-col items-center text-center space-y-6">
                                <div className="w-24 h-24 bg-gradient-to-br from-primary-gold to-primary-gold/50 rounded-full flex items-center justify-center shadow-2xl relative">
                                    <User className="w-12 h-12 text-primary-charcoal" />
                                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                                        <Award className="w-5 h-5 text-primary-gold" />
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <h1 className="font-fraunces text-3xl font-bold text-white uppercase tracking-tight">
                                        {profile?.full_name || user?.email?.split('@')[0] || "Guest"}
                                    </h1>
                                    <p className="text-white/40 text-sm font-medium tracking-widest uppercase">
                                        Loyal Member
                                    </p>
                                </div>

                                <div className="w-full h-px bg-white/10" />

                                <div className="grid grid-cols-2 w-full gap-4">
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-black">Points</p>
                                        <p className="text-2xl font-fraunces text-primary-gold">{profile?.loyalty_points || 0}</p>
                                    </div>
                                    <div className="space-y-1 border-l border-white/10">
                                        <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-black">Rank</p>
                                        <p className="text-lg font-fraunces text-white">{profile?.tier || 'Member'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-primary-gold/10 backdrop-blur-md rounded-3xl p-8 border border-primary-gold/20 flex flex-col items-center text-center space-y-4">
                            <Sparkles className="w-8 h-8 text-primary-gold" />
                            <h3 className="text-white font-bold">Reward Available</h3>
                            <p className="text-white/60 text-xs leading-relaxed">
                                You're 250 points away from a complimentary Scalp Ritual.
                            </p>
                            <Button variant="outline" size="sm" className="w-full border-primary-gold/30 text-primary-gold hover:bg-primary-gold hover:text-primary-charcoal">
                                View Rewards
                            </Button>
                        </div>

                        <button 
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-3 py-4 text-white/40 hover:text-white transition-colors text-sm uppercase tracking-widest font-bold"
                        >
                            <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                    </motion.div>

                    {/* ── Main Content: Bookings ──────────────────────── */}
                    <motion.div variants={fadeInUp} className="lg:col-span-8 space-y-12">
                        
                        {/* Upcoming Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-primary-gold/20 rounded-xl flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-primary-gold" />
                                </div>
                                <h2 className="font-fraunces text-2xl text-white">Upcoming Appointments</h2>
                            </div>

                            <div className="space-y-4">
                                {upcomingBookings.length > 0 ? (
                                    upcomingBookings.map(booking => (
                                        <div 
                                            key={booking.id} 
                                            className="group relative bg-white/5 hover:bg-white/[0.08] transition-all rounded-[1.5rem] p-6 border border-white/5 flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-6">
                                                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-primary-gold">
                                                    <Clock className="w-6 h-6" />
                                                </div>
                                                <div className="space-y-1">
                                                    <h4 className="text-white font-bold">{booking.service_name}</h4>
                                                    <div className="flex items-center gap-3 text-white/40 text-xs font-medium tracking-wide">
                                                        <span>{new Date(booking.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                                        <span className="w-1 h-1 bg-white/20 rounded-full" />
                                                        <span>{booking.time}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="px-3 py-1 bg-green-500/10 text-green-500 text-[10px] font-black uppercase tracking-widest rounded-full">
                                                    {booking.status}
                                                </span>
                                                <ChevronRight className="w-5 h-5 text-white/10 group-hover:text-primary-gold transition-colors" />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="bg-white/5 rounded-[1.5rem] p-12 border border-dashed border-white/10 text-center space-y-4">
                                        <p className="text-white/30 text-sm">No upcoming appointments found.</p>
                                        <Button asChild size="sm" variant="outline" className="border-white/10 text-white/60 hover:text-white">
                                            <a href="/book">Book Now</a>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* History Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                                    <History className="w-5 h-5 text-white/60" />
                                </div>
                                <h2 className="font-fraunces text-2xl text-white">Appointment History</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {pastBookings.length > 0 ? (
                                    pastBookings.map(booking => (
                                        <div 
                                            key={booking.id} 
                                            className="bg-white/[0.03] rounded-2xl p-5 border border-white/5 flex items-center gap-4 opacity-70 grayscale-[50%] hover:grayscale-0 hover:opacity-100 transition-all"
                                        >
                                            <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-white/30">
                                                <User className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white text-sm font-bold truncate">{booking.service_name}</p>
                                                <p className="text-white/30 text-[10px] uppercase tracking-tighter">
                                                    {new Date(booking.date).toLocaleDateString()} • {booking.status}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-white/20 text-sm italic col-span-2">Your history is clear.</p>
                                )}
                            </div>
                        </div>

                        {/* Notifications Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center relative">
                                    <Bell className="w-5 h-5 text-white/60" />
                                    {notifications.filter(n => !n.is_read).length > 0 && (
                                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-primary-charcoal" />
                                    )}
                                </div>
                                <h2 className="font-fraunces text-2xl text-white">Notifications</h2>
                            </div>

                            <div className="space-y-3">
                                {notifications.length > 0 ? (
                                    notifications.map(notif => (
                                        <div 
                                            key={notif.id} 
                                            className={`p-4 rounded-xl border flex items-start gap-4 transition-all ${notif.is_read ? 'bg-white/5 border-white/5 opacity-60' : 'bg-primary-gold/10 border-primary-gold/20'}`}
                                        >
                                            <div className="mt-1">
                                                {notif.type === 'reward' ? <Sparkles className="w-4 h-4 text-primary-gold" /> : <Bell className="w-4 h-4 text-white/60" />}
                                            </div>
                                            <div>
                                                <p className={`text-sm ${notif.is_read ? 'text-white/60' : 'text-white font-bold'}`}>{notif.title}</p>
                                                <p className="text-white/40 text-xs mt-1">{notif.message}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-white/20 text-sm italic">No new notifications.</p>
                                )}
                            </div>
                        </div>

                    </motion.div>
                </motion.div>
            </div>
        </main>
    );
}
