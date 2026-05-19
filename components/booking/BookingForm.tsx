'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User,
    Scissors,
    CheckCircle2,
    ChevronRight,
    ChevronLeft,
    Sparkles,
    AlertCircle,
    Loader2,
    Gift,
    Clock,
    CalendarX
} from 'lucide-react';
import { services } from '@/lib/data/services';
import { getStylistsForService, getAvailableSlots, type Stylist } from '@/lib/actions/stylists';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';

import { createBooking } from '@/lib/actions/booking';
import { ShareBookingCard } from '@/components/engagement/ShareBookingCard';
import { getCustomerReferral, createReferralCode } from '@/lib/actions/loyalty';
import { validateCoupon } from '@/lib/actions/coupons';
import { createClient } from '@/lib/supabase/client';

type Step = 'service' | 'stylist' | 'datetime' | 'details' | 'confirm' | 'success';

export default function BookingForm() {
    const [step, setStep] = useState<Step>('service');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        service: '',
        stylist: '',
        date: '',
        time: '',
        name: '',
        email: '',
        phone: '',
        notes: '',
    });
    const [referralCode, setReferralCode] = useState<string>('');
    const [appliedReferral, setAppliedReferral] = useState<string | null>(null);
    const [referralGift, setReferralGift] = useState<{ amount: number; message: string } | null>(null);
    const [couponCode, setCouponCode] = useState('');
    const [couponDiscount, setCouponDiscount] = useState<{ amount: number; message: string } | null>(null);
    const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
    const [couponError, setCouponError] = useState<string | null>(null);

    // Live stylist + slot state
    const [stylists, setStylists] = useState<Stylist[]>([]);
    const [loadingStylists, setLoadingStylists] = useState(false);
    const [availableSlots, setAvailableSlots] = useState<{ slot: string; available: boolean }[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(false);

    const searchParams = useSearchParams();

    useEffect(() => {
        const serviceSlug = searchParams.get('service');
        const refParam = searchParams.get('ref');

        // Handle service pre-selection
        if (serviceSlug) {
            const exists = services.some(s => s.slug === serviceSlug);
            if (exists) {
                setFormData(prev => ({ ...prev, service: serviceSlug }));
                setStep('stylist');
            }
        }

        // Handle referral detection
        const checkReferral = () => {
            const cookieMatch = document.cookie.match(/referral_code=([^;]+)/);
            const ref = refParam || (cookieMatch ? cookieMatch[1] : null);

            if (ref) {
                setAppliedReferral(ref);
                setReferralGift({
                    amount: 50,
                    message: "Welcome Gift: AED 50 off applied!"
                });
            }
        };

        checkReferral();
    }, [searchParams]);

    const steps: Step[] = ['service', 'stylist', 'datetime', 'details', 'confirm'];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const currentIndex = steps.indexOf(step as any);

    // Fetch stylists when service is selected
    const fetchStylists = useCallback(async (serviceSlug: string) => {
        setLoadingStylists(true);
        const data = await getStylistsForService(serviceSlug);
        setStylists(data);
        setLoadingStylists(false);
    }, []);

    // Fetch slots when stylist + date are both set
    const fetchSlots = useCallback(async (stylistId: string, date: string, serviceSlug: string) => {
        if (!stylistId || !date) return;
        setLoadingSlots(true);
        setAvailableSlots([]);
        const data = await getAvailableSlots(stylistId, date, serviceSlug);
        setAvailableSlots(data);
        setLoadingSlots(false);
    }, []);

    useEffect(() => {
        if (step === 'stylist' && formData.service) {
            fetchStylists(formData.service);
        }
    }, [step, formData.service, fetchStylists]);

    useEffect(() => {
        if (formData.stylist && formData.date && formData.service) {
            fetchSlots(formData.stylist, formData.date, formData.service);
        }
    }, [formData.stylist, formData.date, formData.service, fetchSlots]);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError(null);

        const selectedServiceData = services.find(s => s.slug === formData.service);

        try {
            const result = await createBooking({
                serviceId: formData.service,
                serviceName: selectedServiceData?.title || formData.service,
                stylistId: formData.stylist || undefined,
                date: formData.date,
                time: formData.time,
                name: formData.name,
                phone: formData.phone,
                email: formData.email,
                notes: formData.notes,
                referralCode: appliedReferral || undefined,
            });

            if (result.success) {
                setStep('success');
            } else {
                setError(result.error || 'Failed to book appointment. Please try again.');
            }
        } catch {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);

            // Try to get/create referral code for sharing
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const referral = await getCustomerReferral(user.id);
                if (referral) {
                    setReferralCode(referral.referral_code);
                } else {
                    const newCode = await createReferralCode(user.id);
                    if (newCode.success) setReferralCode(newCode.code || '');
                }
            }
        }
    };

    const nextStep = () => {
        if (step === 'confirm') {
            handleSubmit();
            return;
        }
        const nextIdx = currentIndex + 1;
        if (nextIdx < steps.length) setStep(steps[nextIdx]);
    };

    const prevStep = () => {
        if (step === 'success') return;
        const prevIdx = currentIndex - 1;
        if (prevIdx >= 0) setStep(steps[prevIdx]);
    };

    const isStepValid = () => {
        switch (step) {
            case 'service': return !!formData.service;
            case 'stylist': return !!formData.stylist; // 'any' or a real id
            case 'datetime': return !!formData.date && !!formData.time;
            case 'details': return !!formData.name && !!formData.email && !!formData.phone;
            default: return true;
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-secondary-pearl">
            <div className="flex flex-col md:flex-row min-h-[600px]">
                {/* Progress Sidebar */}
                <div className="md:w-1/3 bg-primary-charcoal p-8 md:p-12 text-white relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80')] bg-cover bg-center opacity-10 grayscale" />

                    <div className="relative z-10 space-y-12">
                        <div>
                            <h2 className="font-fraunces text-3xl font-bold mb-2">Book Your Visit</h2>
                            <p className="text-secondary-rose/60 text-sm">Follow the steps to secure your premium experience.</p>
                        </div>

                        <div className="space-y-6">
                            {steps.map((s, i) => (
                                <div key={s} className="flex items-center space-x-4">
                                    <div className={cn(
                                        "w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all duration-500 border",
                                        currentIndex >= i
                                            ? "bg-primary-gold border-primary-gold text-primary-charcoal"
                                            : "bg-white/5 border-white/10 text-white/40"
                                    )}>
                                        {currentIndex > i ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                                    </div>
                                    <span className={cn(
                                        "text-sm font-bold tracking-widest uppercase transition-colors duration-500",
                                        currentIndex >= i ? "text-white" : "text-white/20"
                                    )}>
                                        {s}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Selection Summary */}
                        {formData.service && (
                            <div className="pt-12 border-t border-white/10 space-y-4">
                                <p className="text-[10px] font-bold text-primary-gold uppercase tracking-[0.2em]">Your Selection</p>
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3 text-sm">
                                        <Scissors className="w-4 h-4 text-primary-gold" />
                                        <span className="font-bold">{services.find(ser => ser.slug === formData.service)?.title}</span>
                                    </div>
                                    {formData.stylist && (
                                        <div className="flex items-center space-x-3 text-sm">
                                            <User className="w-4 h-4 text-primary-gold" />
                                            <span className="font-bold">{stylists.find(t => t.id === formData.stylist)?.name || 'No Preference'}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Referral Gift Indicator */}
                        {referralGift && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="pt-8 border-t border-white/10"
                            >
                                <div className="bg-primary-gold/10 border border-primary-gold/20 rounded-2xl p-4 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary-gold flex items-center justify-center text-primary-charcoal shrink-0">
                                        <Gift className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-primary-gold uppercase tracking-widest">Referral Gift</p>
                                        <p className="text-xs font-bold text-white mt-0.5">{referralGift.message}</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Form Content */}
                <div className="md:w-2/3 p-8 md:p-16 flex flex-col">
                    <div className="flex-grow">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.4 }}
                                className="space-y-8"
                            >
                                {error && (
                                    <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold flex items-center gap-3">
                                        <AlertCircle className="w-5 h-5" />
                                        {error}
                                    </div>
                                )}

                                {/* Step Content */}
                                {step === 'success' && (
                                    <div className="space-y-8 text-center py-12">
                                        <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center text-green-600 mx-auto">
                                            <CheckCircle2 className="w-12 h-12" />
                                        </div>
                                        <div className="space-y-4">
                                            <h3 className="font-fraunces text-3xl font-bold text-primary-charcoal">Booking Confirmed!</h3>
                                            <p className="text-secondary-label max-w-sm mx-auto">
                                                Thank you for booking with The Hideaway Hair & Beauty Salon. We&apos;ve sent a confirmation email to {formData.email}.
                                            </p>
                                        </div>

                                        {/* UPI Payment Option */}
                                        <div className="bg-primary-gold/10 border border-primary-gold/20 rounded-2xl p-6 mt-4">
                                            <h4 className="font-bold text-primary-charcoal mb-2">Pay Now with UPI</h4>
                                            <p className="text-sm text-secondary-label mb-4">
                                                Secure your booking with instant UPI payment
                                            </p>

                                            {(() => {
                                                const selectedService = services.find(s => s.slug === formData.service);
                                                const amount = selectedService?.startingPrice || 500;
                                                const ref = 'ELE-' + Date.now().toString().slice(-6);
                                                const paymentUrl = `/pay?amount=${amount}&ref=${ref}&name=${encodeURIComponent(formData.name)}&service=${encodeURIComponent(selectedService?.title || 'Service')}`;

                                                return (
                                                    <div className="space-y-3">
                                                        <p className="font-bold text-2xl text-primary-charcoal">₹{amount}</p>
                                                        <div className="flex gap-3">
                                                            <Button asChild className="flex-1 bg-primary-gold hover:bg-primary-gold/90">
                                                                <Link href={paymentUrl}>
                                                                    Pay Now
                                                                </Link>
                                                            </Button>
                                                            <Button asChild variant="outline" className="flex-1">
                                                                <Link href="/">
                                                                    Skip
                                                                </Link>
                                                            </Button>
                                                        </div>
                                                    </div>
                                                );
                                            })()}
                                        </div>

                                        <Button asChild size="lg" variant="outline" className="w-full mt-4 border-secondary-pearl">
                                            <Link href="/">Back to Home</Link>
                                        </Button>

                                        {/* Social Share Card */}
                                        <ShareBookingCard
                                            booking={{
                                                service_name: services.find(s => s.slug === formData.service)?.title || formData.service,
                                                date: formData.date,
                                                time: formData.time
                                            }}
                                            referralCode={referralCode}
                                        />
                                    </div>
                                )}

                                {step === 'service' && (
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <h3 className="font-fraunces text-2xl font-bold text-primary-charcoal">Select Service</h3>
                                            <p className="text-secondary-label text-sm">Which transformation are we working on today?</p>
                                        </div>
                                        <div className="grid grid-cols-1 gap-4 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                                            {services.map((s) => (
                                                <button
                                                    key={s.slug}
                                                    onClick={() => setFormData({ ...formData, service: s.slug })}
                                                    className={cn(
                                                        "w-full p-6 rounded-2xl border text-left transition-all group flex items-center justify-between",
                                                        formData.service === s.slug
                                                            ? "bg-primary-gold/5 border-primary-gold ring-1 ring-primary-gold"
                                                            : "bg-white border-secondary-pearl hover:border-primary-gold/50"
                                                    )}
                                                >
                                                    <div className="flex items-center space-x-4">
                                                        <div className={cn(
                                                            "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                                                            formData.service === s.slug ? "bg-primary-gold text-primary-charcoal" : "bg-primary-ivory text-secondary-rose"
                                                        )}>
                                                            <Scissors className="w-6 h-6" />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-primary-charcoal">{s.title}</p>
                                                            <p className="text-[10px] text-secondary-label uppercase font-bold tracking-widest">AED {s.startingPrice} • {s.duration}</p>
                                                        </div>
                                                    </div>
                                                    {formData.service === s.slug && <CheckCircle2 className="w-6 h-6 text-primary-gold" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {step === 'stylist' && (
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <h3 className="font-fraunces text-2xl font-bold text-primary-charcoal">Choose Your Stylist</h3>
                                            <p className="text-secondary-label text-sm">All stylists shown are qualified for your selected service.</p>
                                        </div>
                                        {loadingStylists ? (
                                            <div className="flex flex-col items-center justify-center py-16 space-y-3">
                                                <Loader2 className="w-8 h-8 text-primary-gold animate-spin" />
                                                <p className="text-xs font-bold uppercase tracking-widest text-secondary-label">Finding available experts...</p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 gap-4 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                                                {/* No Preference option */}
                                                <button
                                                    onClick={() => setFormData({ ...formData, stylist: 'any' })}
                                                    className={cn(
                                                        "w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between",
                                                        formData.stylist === 'any'
                                                            ? "bg-primary-gold/5 border-primary-gold ring-1 ring-primary-gold"
                                                            : "bg-white border-secondary-pearl hover:border-primary-gold/50"
                                                    )}
                                                >
                                                    <div className="flex items-center space-x-4">
                                                        <div className="w-14 h-14 rounded-xl bg-primary-ivory flex items-center justify-center">
                                                            <Sparkles className="w-6 h-6 text-primary-gold" />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-primary-charcoal">No Preference</p>
                                                            <p className="text-[10px] text-secondary-label uppercase font-bold tracking-widest">First available expert</p>
                                                        </div>
                                                    </div>
                                                    {formData.stylist === 'any' && <CheckCircle2 className="w-6 h-6 text-primary-gold" />}
                                                </button>

                                                {stylists.map((t) => (
                                                    <button
                                                        key={t.id}
                                                        onClick={() => setFormData({ ...formData, stylist: t.id, time: '' })}
                                                        className={cn(
                                                            "w-full p-4 rounded-2xl border text-left transition-all group flex items-center justify-between",
                                                            formData.stylist === t.id
                                                                ? "bg-primary-gold/5 border-primary-gold ring-1 ring-primary-gold"
                                                                : "bg-white border-secondary-pearl hover:border-primary-gold/50"
                                                        )}
                                                    >
                                                        <div className="flex items-center space-x-4">
                                                            <div className="relative w-14 h-14 rounded-xl overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                                                                <Image src={t.image_url} alt={t.name} width={56} height={56} className="object-cover w-full h-full" />
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-primary-charcoal">{t.name}</p>
                                                                <p className="text-[10px] text-primary-gold uppercase font-bold tracking-widest">{t.specialty}</p>
                                                                <p className="text-[10px] text-secondary-label mt-0.5">{t.years_experience} yrs experience</p>
                                                            </div>
                                                        </div>
                                                        {formData.stylist === t.id && <CheckCircle2 className="w-6 h-6 text-primary-gold" />}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {step === 'datetime' && (
                                    <div className="space-y-8">
                                        <div className="space-y-2">
                                            <h3 className="font-fraunces text-2xl font-bold text-primary-charcoal">Select Date & Time</h3>
                                            <p className="text-secondary-label text-sm">Slots shown reflect your stylist&apos;s live schedule.</p>
                                        </div>
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-secondary-rose uppercase tracking-widest">Appointment Date</label>
                                                <input
                                                    type="date"
                                                    min={new Date().toISOString().split('T')[0]}
                                                    className="w-full h-16 px-6 bg-primary-ivory border border-secondary-pearl rounded-2xl font-bold focus:ring-2 focus:ring-primary-gold outline-none transition-all"
                                                    onChange={(e) => setFormData({ ...formData, date: e.target.value, time: '' })}
                                                    value={formData.date}
                                                />
                                            </div>

                                            {formData.date && (
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <label className="text-[10px] font-bold text-secondary-rose uppercase tracking-widest">Available Slots</label>
                                                        {loadingSlots && <Loader2 className="w-4 h-4 text-primary-gold animate-spin" />}
                                                    </div>

                                                    {loadingSlots ? (
                                                        <div className="grid grid-cols-3 gap-3">
                                                            {[...Array(6)].map((_, i) => (
                                                                <div key={i} className="h-14 rounded-xl bg-secondary-pearl/50 animate-pulse" />
                                                            ))}
                                                        </div>
                                                    ) : availableSlots.length === 0 ? (
                                                        <div className="flex flex-col items-center justify-center py-10 space-y-3 bg-primary-ivory rounded-2xl border border-secondary-pearl">
                                                            <CalendarX className="w-8 h-8 text-secondary-label" />
                                                            <p className="text-sm font-bold text-secondary-label">No availability on this day</p>
                                                            <p className="text-xs text-secondary-label/60">Try another date or choose &quot;No Preference&quot; for stylist</p>
                                                        </div>
                                                    ) : (
                                                        <div className="grid grid-cols-3 gap-3">
                                                            {availableSlots.map(({ slot, available }) => (
                                                                <button
                                                                    key={slot}
                                                                    disabled={!available}
                                                                    onClick={() => available && setFormData({ ...formData, time: slot })}
                                                                    className={cn(
                                                                        "h-14 rounded-xl border font-bold text-sm transition-all relative",
                                                                        formData.time === slot
                                                                            ? "bg-primary-gold border-primary-gold text-primary-charcoal shadow-lg"
                                                                            : available
                                                                                ? "bg-white border-secondary-pearl text-secondary-slate hover:border-primary-gold"
                                                                                : "bg-secondary-pearl/30 border-secondary-pearl text-secondary-label/40 cursor-not-allowed line-through"
                                                                    )}
                                                                >
                                                                    {slot}
                                                                    {!available && (
                                                                        <span className="absolute -top-1.5 -right-1.5 bg-secondary-slate text-white text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-widest">
                                                                            Taken
                                                                        </span>
                                                                    )}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                    <p className="flex items-center gap-2 text-[10px] text-secondary-label/60">
                                                        <Clock className="w-3 h-3" />
                                                        Crossed-out slots are already booked
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {step === 'details' && (
                                    <div className="space-y-8">
                                        <div className="space-y-2">
                                            <h3 className="font-fraunces text-2xl font-bold text-primary-charcoal">Personal Details</h3>
                                            <p className="text-secondary-label text-sm">Tell us how we can reach you.</p>
                                        </div>
                                        <div className="grid grid-cols-1 gap-6">
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-bold text-secondary-rose uppercase tracking-widest">Full Name</label>
                                                <input
                                                    type="text"
                                                    placeholder="E.g. Jane Doe"
                                                    className="w-full h-16 px-6 bg-primary-ivory border border-secondary-pearl rounded-2xl font-bold focus:ring-2 focus:ring-primary-gold outline-none transition-all"
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    value={formData.name}
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-4">
                                                    <label className="text-[10px] font-bold text-secondary-rose uppercase tracking-widest">Email Address</label>
                                                    <input
                                                        type="email"
                                                        placeholder="jane@example.com"
                                                        className="w-full h-16 px-6 bg-primary-ivory border border-secondary-pearl rounded-2xl font-bold focus:ring-2 focus:ring-primary-gold outline-none transition-all"
                                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                        value={formData.email}
                                                    />
                                                </div>
                                                <div className="space-y-4">
                                                    <label className="text-[10px] font-bold text-secondary-rose uppercase tracking-widest">Phone Number</label>
                                                    <input
                                                        type="tel"
                                                        placeholder="+971 56 134 8671"
                                                        className="w-full h-16 px-6 bg-primary-ivory border border-secondary-pearl rounded-2xl font-bold focus:ring-2 focus:ring-primary-gold outline-none transition-all"
                                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                        value={formData.phone}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-bold text-secondary-rose uppercase tracking-widest">Special Notes (Optional)</label>
                                                <textarea
                                                    placeholder="Any specific requests or hair history..."
                                                    className="w-full h-32 p-6 bg-primary-ivory border border-secondary-pearl rounded-2xl font-bold focus:ring-2 focus:ring-primary-gold outline-none transition-all resize-none"
                                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                                    value={formData.notes}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {step === 'confirm' && (
                                    <div className="space-y-12 text-center py-12">
                                        <div className="w-24 h-24 rounded-full bg-primary-gold/10 flex items-center justify-center text-primary-gold mx-auto relative">
                                            <Sparkles className="w-12 h-12" />
                                            <motion.div
                                                animate={{ scale: [1, 1.2, 1] }}
                                                transition={{ repeat: Infinity, duration: 2 }}
                                                className="absolute inset-0 rounded-full border-2 border-primary-gold/20"
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <h3 className="font-fraunces text-3xl font-bold text-primary-charcoal">All Set!</h3>
                                            <p className="text-secondary-label max-w-sm mx-auto">
                                                Review your appointment details and confirm to secure your slot.
                                            </p>
                                        </div>
                                        <div className="bg-primary-ivory rounded-3xl p-8 border border-secondary-pearl text-left space-y-4 max-w-sm mx-auto shadow-inner">
                                            <div className="flex justify-between items-center pb-4 border-b border-secondary-pearl/50">
                                                <span className="text-[10px] font-bold text-secondary-rose uppercase tracking-widest">Service</span>
                                                <span className="font-bold text-primary-charcoal">{services.find(s => s.slug === formData.service)?.title}</span>
                                            </div>
                                            <div className="flex justify-between items-center pb-4 border-b border-secondary-pearl/50">
                                                <span className="text-[10px] font-bold text-secondary-rose uppercase tracking-widest">Stylist</span>
                                                <span className="font-bold text-primary-charcoal">
                                                    {formData.stylist === 'any' ? 'No Preference' : stylists.find(t => t.id === formData.stylist)?.name || '—'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-bold text-secondary-rose uppercase tracking-widest">Time</span>
                                                <span className="font-bold text-primary-charcoal">{formData.date} at {formData.time}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-secondary-label text-sm">
                                                <span>Base Price</span>
                                                <span>AED {services.find(s => s.slug === formData.service)?.startingPrice}</span>
                                            </div>
                                            {referralGift && (
                                                <div className="flex justify-between items-center text-emerald-600 text-sm">
                                                    <span className="flex items-center gap-1.5"><Gift className="w-3.5 h-3.5" /> Welcome Gift Applied</span>
                                                    <span>- AED {referralGift.amount}</span>
                                                </div>
                                            )}
                                            {couponDiscount && (
                                                <div className="flex justify-between items-center text-emerald-600 text-sm">
                                                    <span className="flex items-center gap-1.5"><Gift className="w-3.5 h-3.5" /> Coupon Applied</span>
                                                    <span>- AED {couponDiscount.amount}</span>
                                                </div>
                                            )}
                                            {/* Coupon input */}
                                            <div className="pt-4 border-t border-secondary-pearl/50">
                                                <label className="text-[10px] font-bold text-secondary-rose uppercase tracking-widest block mb-2">Coupon Code</label>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={couponCode}
                                                        onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError(null); }}
                                                        placeholder="Enter code (e.g. WELCOME20)"
                                                        className="flex-1 h-12 px-4 bg-white border border-secondary-pearl rounded-xl font-bold text-sm focus:ring-2 focus:ring-primary-gold outline-none transition-all uppercase"
                                                    />
                                                    <button
                                                        type="button"
                                                        disabled={isValidatingCoupon || !couponCode.trim()}
                                                        onClick={async () => {
                                                            if (!couponCode.trim()) return;
                                                            setIsValidatingCoupon(true);
                                                            setCouponError(null);
                                                            setCouponDiscount(null);
                                                            const service = services.find(s => s.slug === formData.service);
                                                            const result = await validateCoupon(couponCode, formData.service, service?.startingPrice || 0);
                                                            if (result.valid && result.discount_amount !== undefined) {
                                                                setCouponDiscount({ amount: result.discount_amount, message: result.message });
                                                            } else {
                                                                setCouponError(result.message);
                                                            }
                                                            setIsValidatingCoupon(false);
                                                        }}
                                                        className="h-12 px-4 bg-primary-charcoal text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-primary-gold hover:text-primary-charcoal transition-all disabled:opacity-50 whitespace-nowrap"
                                                    >
                                                        {isValidatingCoupon ? '...' : 'Apply'}
                                                    </button>
                                                </div>
                                                {couponError && <p className="text-red-500 text-xs mt-1 font-medium">{couponError}</p>}
                                                {couponDiscount && <p className="text-emerald-600 text-xs mt-1 font-bold">{couponDiscount.message}</p>}
                                            </div>
                                            <div className="flex justify-between items-center pt-4 border-t border-secondary-pearl/50">
                                                <span className="text-[10px] font-bold text-secondary-rose uppercase tracking-widest">Total to Pay at Salon</span>
                                                <span className="text-xl font-bold text-primary-charcoal">
                                                    AED {Math.max(0, (services.find(s => s.slug === formData.service)?.startingPrice || 0) - (referralGift?.amount || 0) - (couponDiscount?.amount || 0))}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Controls */}
                    {step !== 'success' && (
                        <div className="pt-12 border-t border-secondary-pearl flex items-center justify-between">
                            <button
                                onClick={prevStep}
                                className={cn(
                                    "h-14 px-8 rounded-xl font-bold flex items-center space-x-2 transition-all",
                                    step === 'service' ? "invisible" : "text-secondary-slate hover:text-primary-charcoal hover:bg-secondary-pearl/20"
                                )}
                            >
                                <ChevronLeft className="w-5 h-5" />
                                <span>Back</span>
                            </button>
                            <button
                                onClick={nextStep}
                                disabled={!isStepValid() || isSubmitting}
                                className={cn(
                                    "h-14 px-10 rounded-xl font-bold flex items-center space-x-2 transition-all shadow-lg",
                                    isStepValid() && !isSubmitting
                                        ? "bg-primary-charcoal text-white hover:bg-primary-gold hover:text-primary-charcoal"
                                        : "bg-secondary-pearl text-secondary-label cursor-not-allowed"
                                )}
                            >
                                {isSubmitting ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <span>{step === 'confirm' ? 'Confirm Booking' : 'Next Step'}</span>
                                        <ChevronRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
