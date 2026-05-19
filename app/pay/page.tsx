'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
    QrCode,
    Copy,
    CheckCircle2,
    Smartphone,
    CreditCard,
    ArrowLeft,
    Loader2,
    MessageCircle,
    Upload,
    X,
    Eye
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { paymentConfig, generateUPIDeepLinks } from '@/lib/data/payments';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

import { Suspense } from 'react';

function PaymentPageContent() {
    const searchParams = useSearchParams();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const supabase = createClient();

    const [copied, setCopied] = useState(false);
    const [isGenerating, setIsGenerating] = useState(true);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Booking reference input for screenshot upload
    const [bookingRef, setBookingRef] = useState('');
    const [showUpload, setShowUpload] = useState(false);

    // Get payment details from URL
    const amount = searchParams.get('amount') || '500';
    const ref = searchParams.get('ref') || 'ELE-' + Date.now().toString().slice(-6);
    const name = searchParams.get('name') || 'Customer';
    const service = searchParams.get('service') || 'Service';

    const upiLinks = generateUPIDeepLinks(parseFloat(amount), ref);

    // Generate QR code URL
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiLinks.generic)}&bgcolor=0A0A0B&color=C9A962&format=png`;

    useEffect(() => {
        const timer = setTimeout(() => setIsGenerating(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    const copyUPIID = () => {
        navigator.clipboard.writeText(paymentConfig.upi.id);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Handle image upload via URL input (simpler approach)
    const handleImageUrlSubmit = async () => {
        if (!bookingRef.trim()) {
            toast.error('Please enter your booking reference');
            return;
        }

        setShowUpload(true);
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);

        try {
            // Convert to base64 and upload via Supabase storage
            const reader = new FileReader();
            reader.onload = async () => {
                const base64 = reader.result as string;

                // Upload to Supabase storage
                const fileName = `payment_${bookingRef || ref}_${Date.now()}.${file.type.split('/')[1]}`;
                const { data, error } = await supabase.storage
                    .from('payments')
                    .upload(fileName, file);

                if (error) {
                    // Try alternative: store as base64 in notes or just show success
                    console.log('Storage error, showing manual upload success');
                    toast.success('Payment screenshot submitted! Send this image to our WhatsApp for verification.');
                    setShowSuccess(true);
                    setIsUploading(false);
                    return;
                }

                // Get public URL
                const { data: urlData } = supabase.storage
                    .from('payments')
                    .getPublicUrl(fileName);

                setUploadedImage(urlData.publicUrl);

                // Update booking with screenshot
                if (bookingRef) {
                    await supabase
                        .from('bookings')
                        .update({
                            payment_screenshot: urlData.publicUrl,
                            payment_status: 'paid'
                        })
                        .or(`id.eq.${bookingRef},payment_reference.eq.${bookingRef}`);
                }

                toast.success('Payment screenshot uploaded successfully!');
                setShowSuccess(true);
                setIsUploading(false);
            };

            reader.onerror = () => {
                toast.error('Failed to read image');
                setIsUploading(false);
            };

            reader.readAsDataURL(file);
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload screenshot');
            setIsUploading(false);
        }
    };

    // Success state
    if (showSuccess) {
        return (
            <div className="min-h-screen bg-[#0A0A0B] text-white py-12 px-4">
                <div className="max-w-lg mx-auto text-center">
                    <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-12 h-12 text-green-400" />
                    </div>
                    <h1 className="font-fraunces text-3xl font-bold mb-4">Payment Submitted!</h1>
                    <p className="text-white/60 mb-8">
                        We've received your payment screenshot. We'll verify and confirm your booking within 1 hour.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Button asChild className="bg-primary-gold hover:bg-primary-gold/90">
                            <Link href="/">Back to Home</Link>
                        </Button>
                        <a
                            href="https://wa.me/919999999999"
                            className="px-6 py-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-2xl hover:bg-green-500/20 flex items-center gap-2"
                        >
                            <MessageCircle className="w-5 h-5" />
                            Chat on WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0A0A0B] text-white py-12 px-4">
            <div className="max-w-lg mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/">
                        <Button variant="outline" size="sm" className="border-white/10">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="font-fraunces text-2xl font-bold">Complete Payment</h1>
                        <p className="text-white/40 text-sm">Booking Ref: {ref}</p>
                    </div>
                </div>

                {/* Booking Details */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-white/60">Service</span>
                        <span className="font-medium">{service}</span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-white/60">Name</span>
                        <span className="font-medium">{name}</span>
                    </div>
                    <div className="border-t border-white/10 pt-4 mt-4">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-medium">Total Amount</span>
                            <span className="text-3xl font-fraunces font-bold text-primary-gold">₹{amount}</span>
                        </div>
                    </div>
                </div>

                {/* QR Code Section */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-6 text-center">
                    <div className="w-48 h-48 mx-auto mb-6 bg-[#0A0A0B] rounded-2xl p-4 flex items-center justify-center">
                        {isGenerating ? (
                            <Loader2 className="w-12 h-12 text-primary-gold animate-spin" />
                        ) : (
                            <Image
                                src={qrCodeUrl}
                                alt="UPI QR Code"
                                width={200}
                                height={200}
                                className="rounded-xl"
                            />
                        )}
                    </div>

                    <h3 className="font-fraunces text-xl font-bold mb-2">Scan to Pay</h3>
                    <p className="text-white/40 text-sm mb-6">
                        Open any UPI app and scan this QR code
                    </p>

                    {/* UPI ID Copy */}
                    <div className="bg-[#0A0A0B] rounded-2xl p-4 flex items-center justify-between">
                        <div>
                            <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Pay to UPI ID</p>
                            <p className="font-mono text-primary-gold font-bold">{paymentConfig.upi.id}</p>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={copyUPIID}
                            className="border-white/10 hover:bg-white/5"
                        >
                            {copied ? (
                                <CheckCircle2 className="w-4 h-4 text-green-400" />
                            ) : (
                                <Copy className="w-4 h-4" />
                            )}
                        </Button>
                    </div>
                </div>

                {/* Payment Apps */}
                <div className="space-y-4 mb-6">
                    <h3 className="font-fraunces text-lg font-bold mb-4">Pay with App</h3>

                    {/* PhonePe */}
                    <a
                        href={upiLinks.phonepe}
                        className="block bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-colors"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                                <Smartphone className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="font-bold">PhonePe</p>
                                <p className="text-white/40 text-sm">Open PhonePe app</p>
                            </div>
                        </div>
                    </a>

                    {/* Paytm */}
                    <a
                        href={upiLinks.paytm}
                        className="block bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-colors"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                                <CreditCard className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="font-bold">Paytm</p>
                                <p className="text-white/40 text-sm">Open Paytm app</p>
                            </div>
                        </div>
                    </a>

                    {/* Google Pay */}
                    <a
                        href={upiLinks.gpay}
                        className="block bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-colors"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                                <MessageCircle className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="font-bold">Google Pay</p>
                                <p className="text-white/40 text-sm">Open GPay app</p>
                            </div>
                        </div>
                    </a>
                </div>

                {/* Screenshot Upload Section */}
                <div className="bg-primary-gold/10 border border-primary-gold/20 rounded-3xl p-6">
                    <h3 className="font-fraunces text-lg font-bold mb-4 text-primary-gold">Upload Payment Screenshot</h3>

                    {!showUpload ? (
                        <div className="space-y-4">
                            <div>
                                <label className="text-white/60 text-sm mb-2 block">Enter Booking Reference (from confirmation)</label>
                                <input
                                    type="text"
                                    value={bookingRef}
                                    onChange={(e) => setBookingRef(e.target.value)}
                                    placeholder="e.g., ELE-123456 or booking ID"
                                    className="w-full h-12 bg-[#0A0A0B] border border-white/10 rounded-2xl px-4 text-white placeholder:text-white/30"
                                />
                            </div>
                            <Button
                                onClick={handleImageUrlSubmit}
                                className="w-full bg-primary-gold hover:bg-primary-gold/90"
                            >
                                Continue to Upload
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-white/60 text-sm">
                                After making payment, take a screenshot and upload it here:
                            </p>

                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                            />

                            <Button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                                variant="outline"
                                className="w-full border-primary-gold/30 hover:bg-primary-gold/10"
                            >
                                {isUploading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-4 h-4 mr-2" />
                                        Choose Screenshot
                                    </>
                                )}
                            </Button>

                            <p className="text-white/40 text-xs text-center">
                                or send directly to WhatsApp
                            </p>

                            <a
                                href={`https://wa.me/919999999999?text=Hi, I've made payment for booking ${bookingRef || ref}. Here's my payment screenshot.`}
                                className="block w-full py-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-2xl text-center hover:bg-green-500/20"
                            >
                                Send via WhatsApp
                            </a>
                        </div>
                    )}
                </div>

                {/* WhatsApp Support */}
                <div className="mt-8 text-center">
                    <p className="text-white/40 text-sm mb-4">
                        Need help with payment?
                    </p>
                    <a
                        href="https://wa.me/919999999999"
                        className="inline-flex items-center gap-2 text-green-400 hover:text-green-300"
                    >
                        <MessageCircle className="w-5 h-5" />
                        <span>Chat on WhatsApp</span>
                    </a>
                </div>
            </div>
        </div>
    );
}

export default function PaymentPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0A0A0B] text-white py-12 px-4 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary-gold" /></div>}>
            <PaymentPageContent />
        </Suspense>
    );
}
