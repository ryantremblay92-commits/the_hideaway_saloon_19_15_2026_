'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Upload, Camera, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { createConsultation } from '@/lib/actions/consultation';
import { toast } from 'sonner';

const TONES = ['warm', 'cool', 'neutral'] as const;

// Example mapped shades for UI simplicity
const SHADES = [
    { level: 1, name: 'Black' },
    { level: 2, name: 'Very Dark Brown' },
    { level: 3, name: 'Dark Brown' },
    { level: 4, name: 'Medium Brown' },
    { level: 5, name: 'Light Brown' },
    { level: 6, name: 'Dark Blonde' },
    { level: 7, name: 'Medium Blonde' },
    { level: 8, name: 'Light Blonde' },
    { level: 9, name: 'Very Light Blonde' },
    { level: 10, name: 'Lightest Blonde / Platinum' }
];

export default function ConsultationPage() {
    const router = useRouter();
    const supabase = createClient();
    
    const [step, setStep] = useState(1);
    const [selectedLevel, setSelectedLevel] = useState<number>(7);
    const [selectedTone, setSelectedTone] = useState<'warm' | 'cool' | 'neutral'>('neutral');
    
    const [referenceFiles, setReferenceFiles] = useState<File[]>([]);
    const [currentHairFiles, setCurrentHairFiles] = useState<File[]>([]);
    
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                toast.error('Please log in to request a consultation');
                router.push('/auth/login?redirect=/consultation');
            }
        };
        checkAuth();
    }, [router, supabase]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'reference' | 'current') => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files).slice(0, 3); // Max 3 images
            if (type === 'reference') setReferenceFiles(filesArray);
            else setCurrentHairFiles(filesArray);
        }
    };

    const uploadFiles = async (files: File[]) => {
        const uploadedUrls: string[] = [];
        for (const file of files) {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('consultation_images')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage.from('consultation_images').getPublicUrl(filePath);
            uploadedUrls.push(data.publicUrl);
        }
        return uploadedUrls;
    };

    const handleSubmit = async () => {
        if (referenceFiles.length === 0) {
            toast.error('Please upload at least one reference image.');
            return;
        }

        setIsSubmitting(true);
        try {
            // Upload images
            const refUrls = await uploadFiles(referenceFiles);
            const currUrls = await uploadFiles(currentHairFiles);

            const shadeName = SHADES.find(s => s.level === selectedLevel)?.name || 'Custom Shade';
            const fullColorName = `${selectedTone.charAt(0).toUpperCase() + selectedTone.slice(1)} ${shadeName}`;

            // Create consultation
            const result = await createConsultation({
                color_level: selectedLevel,
                tone: selectedTone,
                selected_color_name: fullColorName,
                reference_images: refUrls,
                current_hair_images: currUrls
            });

            if (result.success) {
                toast.success('Consultation request sent!');
                // Wait for toast to be visible before redirecting
                setTimeout(() => {
                    router.push(`/dashboard/consultations/${result.consultation?.id}`);
                }, 1000);
            } else {
                toast.error(result.error || 'Failed to submit consultation');
                setIsSubmitting(false);
            }
        } catch (error: any) {
            console.error('Upload Error:', error);
            toast.error(error.message || 'Error uploading images. Please try again.');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-primary-charcoal pt-32 pb-24 px-4 sm:px-6">
            <div className="max-w-3xl mx-auto">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">Pre-Color Consultation</h1>
                    <p className="text-white/60">Share your vision and get stylist approval before booking.</p>
                </div>

                {/* Warning Banner */}
                <div className="mb-8 p-4 bg-primary-gold/10 border border-primary-gold/20 rounded-2xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-primary-gold shrink-0 mt-0.5" />
                    <div className="text-sm text-white/80 space-y-1">
                        <p className="font-bold text-white">Consultation Required</p>
                        <p>To ensure the best results, all color appointments require a pre-consultation. Final results may vary depending on your hair's current condition.</p>
                    </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-10">
                    
                    {step === 1 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-6">Step 1: Choose Your Desired Shade</h2>
                                
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-sm font-bold text-white/60 uppercase tracking-widest block mb-4">Level (Dark to Light)</label>
                                        <input 
                                            type="range" 
                                            min="1" max="10" 
                                            value={selectedLevel}
                                            onChange={(e) => setSelectedLevel(Number(e.target.value))}
                                            className="w-full accent-primary-gold"
                                        />
                                        <div className="flex justify-between mt-2 text-xs text-white/40 font-mono">
                                            <span>Level 1 (Black)</span>
                                            <span>Level 10 (Platinum)</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-bold text-white/60 uppercase tracking-widest block mb-4">Tone</label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {TONES.map(t => (
                                                <button
                                                    key={t}
                                                    onClick={() => setSelectedTone(t)}
                                                    className={`py-3 rounded-xl border text-sm font-bold uppercase tracking-wider transition-all ${
                                                        selectedTone === t 
                                                        ? 'bg-primary-gold/20 border-primary-gold text-primary-gold' 
                                                        : 'bg-white/5 border-white/10 text-white/40 hover:border-white/30'
                                                    }`}
                                                >
                                                    {t}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-6 bg-black/30 rounded-2xl text-center">
                                        <p className="text-sm text-white/60 mb-2">You selected:</p>
                                        <p className="text-xl font-bold text-white">
                                            {selectedTone.charAt(0).toUpperCase() + selectedTone.slice(1)} {SHADES.find(s => s.level === selectedLevel)?.name}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    onClick={() => setStep(2)}
                                    className="flex items-center gap-2 bg-primary-gold text-primary-charcoal px-8 py-4 rounded-full font-bold hover:bg-white transition-all"
                                >
                                    Next Step <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">Step 2: Upload Photos</h2>
                                <p className="text-white/60 mb-6">Help our stylists understand your goal and starting point.</p>
                                
                                <div className="space-y-8">
                                    {/* Reference Upload */}
                                    <div>
                                        <label className="text-sm font-bold text-white block mb-2">Inspiration Photos (Required)</label>
                                        <p className="text-xs text-white/40 mb-4">Upload 1-3 photos of the color you want to achieve.</p>
                                        
                                        <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-white/10 border-dashed rounded-2xl cursor-pointer hover:bg-white/5 hover:border-primary-gold/50 transition-all">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <Upload className="w-8 h-8 text-primary-gold mb-3" />
                                                <p className="text-sm text-white/60 font-bold">Click to upload inspiration</p>
                                                <p className="text-xs text-white/40 mt-1">{referenceFiles.length} selected</p>
                                            </div>
                                            <input type="file" className="hidden" accept="image/*" multiple onChange={(e) => handleFileChange(e, 'reference')} />
                                        </label>
                                    </div>

                                    {/* Current Hair Upload */}
                                    <div>
                                        <label className="text-sm font-bold text-white block mb-2">Current Hair (Optional but Recommended)</label>
                                        <p className="text-xs text-white/40 mb-4">Show us what we're working with for a more accurate estimate.</p>
                                        
                                        <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-white/10 border-dashed rounded-2xl cursor-pointer hover:bg-white/5 hover:border-primary-gold/50 transition-all">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <Camera className="w-8 h-8 text-white/40 mb-3" />
                                                <p className="text-sm text-white/60 font-bold">Click to upload current hair</p>
                                                <p className="text-xs text-white/40 mt-1">{currentHairFiles.length} selected</p>
                                            </div>
                                            <input type="file" className="hidden" accept="image/*" multiple onChange={(e) => handleFileChange(e, 'current')} />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t border-white/10">
                                <button
                                    onClick={() => setStep(1)}
                                    className="text-white/60 hover:text-white font-bold px-4 py-2 transition-colors"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="flex items-center gap-2 bg-primary-gold text-primary-charcoal px-8 py-4 rounded-full font-bold hover:bg-white transition-all disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Request'} 
                                    {!isSubmitting && <CheckCircle2 className="w-5 h-5" />}
                                </button>
                            </div>
                        </motion.div>
                    )}

                </div>
            </div>
        </div>
    );
}
