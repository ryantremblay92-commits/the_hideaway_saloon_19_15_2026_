"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, viewportOptions } from "@/lib/animations";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import SectionHeader from "@/components/ui/SectionHeader";
import { Phone, Mail, MapPin, Clock, Instagram, Facebook, Loader2, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { submitContact } from "@/lib/actions/contact";

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus('idle');

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            phone: formData.get('phone') as string,
            message: formData.get('message') as string,
        };

        try {
            const result = await submitContact(data);
            if (result.success) {
                setStatus('success');
                (e.target as HTMLFormElement).reset();
            } else {
                setStatus('error');
                setErrorMessage(result.error || "Something went wrong.");
            }
        } catch {
            setStatus('error');
            setErrorMessage("Failed to send message. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col w-full pb-20">
            {/* Page Header */}
            <section className="bg-primary-charcoal py-20 relative overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1600&q=80')] bg-cover bg-center grayscale" />
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="font-fraunces text-5xl md:text-6xl font-bold text-white mb-6">
                            Contact <span className="text-primary-gold">Us</span>
                        </h1>
                        <p className="text-secondary-rose/60 text-lg max-w-2xl mx-auto">
                            Visit our sanctuary in Jumeirah. We&apos;re here to assist
                            with rituals, consultations, and all your hair health inquiries.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Contact Grid */}
            <section className="py-24 bg-primary-white">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20">

                    {/* Info Side */}
                    <motion.div
                        initial="initial"
                        whileInView="animate"
                        viewport={viewportOptions}
                        variants={staggerContainer}
                        className="space-y-12"
                    >
                        <motion.div variants={fadeInUp} className="space-y-6">
                            <SectionHeader
                                subtitle="Get in touch"
                                title="We'd love to hear from you"
                                align="left"
                            />
                            <p className="text-secondary-slate text-lg leading-relaxed">
                                Whether you&apos;re looking for a consultation, have questions about our memberships,
                                or want to book a group event, our team is ready to help.
                            </p>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="space-y-4 p-8 bg-primary-ivory rounded-3xl border border-secondary-pearl group hover:border-primary-gold transition-colors">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary-gold shadow-sm group-hover:bg-primary-gold group-hover:text-white transition-colors">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <h4 className="font-fraunces text-xl font-bold text-primary-charcoal">Call/WhatsApp</h4>
                                <p className="text-secondary-slate text-sm">056 134 8671 / 04 591 8879</p>
                            </div>

                            <div className="space-y-4 p-8 bg-primary-ivory rounded-3xl border border-secondary-pearl group hover:border-primary-gold transition-colors">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary-gold shadow-sm group-hover:bg-primary-gold group-hover:text-white transition-colors">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <h4 className="font-fraunces text-xl font-bold text-primary-charcoal">Email Us</h4>
                                <p className="text-secondary-slate text-sm">info@thehideaway.ae</p>
                            </div>

                            <div className="space-y-4 p-8 bg-primary-ivory rounded-3xl border border-secondary-pearl group hover:border-primary-gold transition-colors">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary-gold shadow-sm group-hover:bg-primary-gold group-hover:text-white transition-colors">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <h4 className="font-fraunces text-xl font-bold text-primary-charcoal">Find Us</h4>
                                <p className="text-secondary-slate text-sm">La Plage, Jumeirah 2, Dubai</p>
                            </div>

                            <div className="space-y-4 p-8 bg-primary-ivory rounded-3xl border border-secondary-pearl group hover:border-primary-gold transition-colors">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary-gold shadow-sm group-hover:bg-primary-gold group-hover:text-white transition-colors">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <h4 className="font-fraunces text-xl font-bold text-primary-charcoal">Hours</h4>
                                <p className="text-secondary-slate text-sm italic">Tue-Thu 9-7, Fri-Sat 9-8, Sun 10-7 (Mon: Closed)</p>
                            </div>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="flex gap-4 pt-4">
                            {process.env.NEXT_PUBLIC_INSTAGRAM_URL && (
                                <a
                                    href={process.env.NEXT_PUBLIC_INSTAGRAM_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-14 h-14 bg-primary-charcoal text-white rounded-full flex items-center justify-center hover:bg-primary-gold transition-colors"
                                    title="Instagram"
                                >
                                    <Instagram className="w-6 h-6" />
                                </a>
                            )}
                            {process.env.NEXT_PUBLIC_FACEBOOK_URL && (
                                <a
                                    href={process.env.NEXT_PUBLIC_FACEBOOK_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-14 h-14 bg-primary-charcoal text-white rounded-full flex items-center justify-center hover:bg-primary-gold transition-colors"
                                    title="Facebook"
                                >
                                    <Facebook className="w-6 h-6" />
                                </a>
                            )}
                        </motion.div>
                    </motion.div>

                    {/* Form Side */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={viewportOptions}
                        className="bg-primary-ivory p-10 md:p-12 rounded-[3rem] border border-secondary-pearl shadow-2xl relative overflow-hidden"
                    >
                        {/* Decorative element */}
                        <div className="absolute top-[-10%] right-[-10%] w-40 h-40 bg-primary-gold/10 rounded-full blur-3xl" />

                        <div className="relative z-10 space-y-8">
                            <h3 className="font-fraunces text-3xl font-bold text-primary-charcoal">
                                Send a message
                            </h3>

                            {status === 'success' ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-8 text-center space-y-4"
                                >
                                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                                        <CheckCircle2 className="w-10 h-10" />
                                    </div>
                                    <h4 className="font-fraunces text-2xl font-bold text-primary-charcoal">Message Sent!</h4>
                                    <p className="text-secondary-slate">Thank you for reaching out. Our team will get back to you shortly.</p>
                                    <Button onClick={() => setStatus('idle')} variant="outline" className="mt-4">
                                        Send another message
                                    </Button>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Input name="name" placeholder="Full Name" required />
                                        <Input name="email" placeholder="Email Address" type="email" />
                                    </div>
                                    <Input name="phone" placeholder="Phone Number" />
                                    <textarea
                                        name="message"
                                        required
                                        className="w-full h-40 rounded-xl border border-secondary-pearl bg-white px-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-gold text-primary-charcoal placeholder:text-secondary-slate"
                                        placeholder="How can we help you?"
                                    />

                                    {status === 'error' && (
                                        <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-center gap-3">
                                            <AlertCircle className="w-5 h-5" />
                                            {errorMessage}
                                        </div>
                                    )}

                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full h-16 text-lg font-bold"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                                Sending...
                                            </>
                                        ) : (
                                            "Send Inquiry"
                                        )}
                                    </Button>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* QR Codes Section */}
            <section className="py-24 bg-primary-ivory border-t border-secondary-pearl">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial="initial"
                        whileInView="animate"
                        viewport={viewportOptions}
                        variants={staggerContainer}
                        className="text-center space-y-16"
                    >
                        <motion.div variants={fadeInUp} className="max-w-2xl mx-auto space-y-4">
                            <h2 className="font-fraunces text-4xl font-bold text-primary-charcoal">
                                Scan & <span className="text-primary-gold">Connect</span>
                            </h2>
                            <p className="text-secondary-slate italic">
                                Quick access to our digital sanctuary. Scan the codes below to scan our rituals or leave a review.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                            {/* Instagram QR */}
                            <motion.div
                                variants={fadeInUp}
                                className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-secondary-pearl flex flex-col items-center gap-8 group hover:border-primary-gold transition-all duration-500"
                            >
                                <div className="relative w-48 h-48 bg-primary-ivory rounded-3xl p-4 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                                    <Image
                                        src="/images/qr-instagram.png"
                                        alt="Instagram QR Code"
                                        width={200}
                                        height={200}
                                        className="object-contain"
                                    />
                                    <div className="absolute inset-0 border-2 border-dashed border-primary-gold/20 rounded-3xl animate-[spin_20s_linear_infinite]" />
                                </div>
                                <div className="space-y-4 text-center">
                                    <h4 className="font-fraunces text-2xl font-bold text-primary-charcoal flex items-center justify-center gap-3">
                                        <Instagram className="w-6 h-6 text-primary-gold" />
                                        Instagram
                                    </h4>
                                    <p className="text-secondary-slate text-sm">Follow our latest rituals & bridal makeovers</p>
                                    <Button asChild variant="outline" size="sm" className="rounded-full">
                                        <a href={process.env.NEXT_PUBLIC_INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">@thehideawaydubai</a>
                                    </Button>
                                </div>
                            </motion.div>

                            {/* Google Review QR */}
                            <motion.div
                                variants={fadeInUp}
                                className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-secondary-pearl flex flex-col items-center gap-8 group hover:border-primary-gold transition-all duration-500"
                            >
                                <div className="relative w-48 h-48 bg-primary-ivory rounded-3xl p-4 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                                    <Image
                                        src="/images/qr-google.png"
                                        alt="Google Review QR Code"
                                        width={200}
                                        height={200}
                                        className="object-contain"
                                    />
                                    <div className="absolute inset-0 border-2 border-dashed border-primary-gold/20 rounded-3xl animate-[spin_20s_linear_infinite]" />
                                </div>
                                <div className="space-y-4 text-center">
                                    <h4 className="font-fraunces text-2xl font-bold text-primary-charcoal flex items-center justify-center gap-3">
                                        <Sparkles className="w-6 h-6 text-primary-gold" />
                                        Google Reviews
                                    </h4>
                                    <p className="text-secondary-slate text-sm">Your feedback is our greatest reward</p>
                                    <Button asChild variant="outline" size="sm" className="rounded-full">
                                        <a href={process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL} target="_blank" rel="noopener noreferrer">Rate Our Service</a>
                                    </Button>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Map integration - simplified as visual placeholder */}
            <section className="h-[500px] w-full bg-secondary-pearl relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                    <Image
                        src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=1600&q=80"
                        alt="Map placeholder"
                        fill
                        className="object-cover opacity-50 grayscale"
                    />
                    <div className="relative z-10 text-center space-y-4">
                        <div className="w-16 h-16 bg-primary-gold rounded-full flex items-center justify-center mx-auto shadow-2xl animate-bounce">
                            <MapPin className="w-8 h-8 text-primary-charcoal" />
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-2xl border border-secondary-pearl">
                            <h5 className="font-fraunces font-bold text-primary-charcoal text-lg">The Hideaway</h5>
                            <p className="text-secondary-slate text-sm">La Plage, 403 Jumeirah Beach Road, Dubai</p>
                            <a
                                href={process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary-gold text-xs font-bold uppercase mt-3 inline-block hover:underline"
                            >
                                Get Directions
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

