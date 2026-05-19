"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Image as ImageIcon,
    Upload,
    Trash2,
    Plus,
    Scissors,
    Check,
    X,
    Filter,
    Loader2,
    LayoutDashboard,
    Edit3,
    ArrowRight,
    Zap,
    Instagram,
    Play
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import { uploadGalleryPhoto, deleteGalleryPhoto, updateService } from "@/lib/actions/content";
import { addInstagramPost, deleteInstagramPost, updateInstagramPost, toggleInstagramFeatured } from "@/lib/actions/instagram";
import { setStylistsChoice } from "@/lib/actions/services";
import { toast } from "sonner";

interface InstagramPost {
    id: string;
    caption: string;
    image_url: string;
    post_url: string;
    type: string;
    is_featured: boolean;
    created_at: string;
}

interface GalleryItem {
    id: string;
    title: string;
    image_url: string;
    public_id: string;
    category: string;
}

interface Service {
    id: string;
    title: string;
    slug: string;
    category: string;
    starting_price: number;
    is_active: boolean;
    is_stylists_choice: boolean;
}

export default function ContentManagementPage() {
    const supabase = createClient();
    const [activeTab, setActiveTab] = useState<'gallery' | 'services' | 'home' | 'instagram'>('gallery');
    const [gallery, setGallery] = useState<GalleryItem[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [instagramPosts, setInstagramPosts] = useState<InstagramPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadPreview, setUploadPreview] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setIsLoading(true);

        if (activeTab === 'gallery' || activeTab === 'home') {
            const query = supabase.from('gallery').select('*');
            if (activeTab === 'home') {
                query.eq('category', 'home_hero');
            }
            const { data } = await query.order('created_at', { ascending: false });
            setGallery(data || []);
        } else if (activeTab === 'instagram') {
            const { data } = await supabase.from('instagram_posts').select('*').order('created_at', { ascending: false });
            setInstagramPosts(data || []);
        } else if (activeTab === 'services') {
            const { data } = await supabase.from('services').select('*').order('category', { ascending: true });
            setServices(data || []);
        }

        setIsLoading(false);
    };

    const handleFileUpload = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsUploading(true);
        const form = e.currentTarget;
        const formData = new FormData(form);

        try {
            const result = await uploadGalleryPhoto(formData);
            if (result.success) {
                setUploadPreview(null);
                form.reset();
                fetchData();
            } else {
                alert(result.error);
            }
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeletePhoto = async (id: string, publicId: string) => {
        if (!confirm('Are you sure you want to delete this photo?')) return;

        const result = await deleteGalleryPhoto(id, publicId);
        if (result.success) {
            fetchData();
        } else {
            alert(result.error);
        }
    };

    const toggleServiceStatus = async (id: string, currentStatus: boolean) => {
        const result = await updateService(id, { is_active: !currentStatus });
        if (result.success) fetchData();
    };

    const handleSetStylistsChoice = async (id: string) => {
        const result = await setStylistsChoice(id);
        if (result.success) {
            toast.success("✨ Stylist's Choice updated!");
            fetchData();
        } else {
            toast.error(result.error || "Failed to update Stylist's Choice");
        }
    };

    return (
        <div className="space-y-12 pb-24">
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col xl:flex-row justify-between xl:items-end gap-10"
            >
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="px-3 py-1 bg-primary-gold/10 border border-primary-gold/20 rounded-full">
                            <span className="text-[10px] font-bold text-primary-gold uppercase tracking-[0.3em]">Creative Hub</span>
                        </div>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-fraunces font-light tracking-tight text-white leading-[0.9]">
                        Editor <span className="text-primary-gold italic">Suite</span>
                    </h1>
                    <p className="text-white/30 text-sm max-w-md font-light leading-relaxed">
                        Sculpt your digital presence. Curate every visual touchpoint of The Hideaway.
                    </p>
                </div>

                <div className="flex elite-glass p-1.5 rounded-2xl w-fit">
                    {(['gallery', 'home', 'services', 'instagram'] as const).map((tab) => {
                        const labels = { gallery: 'Gallery Studio', home: 'Homepage Aesthetic', services: 'Retail Rituals', instagram: 'Social Media Manager' };
                        return (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-500 ${activeTab === tab ? 'bg-primary-gold text-primary-charcoal shadow-[0_0_20px_rgba(201,169,98,0.2)]' : 'text-white/30 hover:text-white/60'}`}
                            >
                                {labels[tab]}
                            </button>
                        );
                    })}
                </div>
            </motion.header>

            <AnimatePresence mode="wait">
                {(activeTab === 'gallery' || activeTab === 'home') && (
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                    >
                        {/* Upload Panel */}
                        <div className="lg:col-span-4">
                            <div className="elite-glass rounded-[2.5rem] p-8 border-dashed hover:border-primary-gold/30 transition-all duration-700 sticky top-32 group">
                                <form onSubmit={handleFileUpload} className="space-y-6">
                                    <h3 className="font-fraunces text-2xl font-bold mb-4 flex items-center gap-3">
                                        <Upload className="w-5 h-5 text-primary-gold" /> {activeTab === 'home' ? 'Hero Update' : 'Upload New Work'}
                                    </h3>

                                    <label className="block w-full aspect-square bg-[#0A0A0B] rounded-3xl cursor-pointer relative overflow-hidden group/upload border-2 border-dashed border-white/5 hover:border-primary-gold/20 transition-all">
                                        {uploadPreview ? (
                                            <Image src={uploadPreview} alt="Preview" fill className="object-cover scale-105 group-hover/upload:scale-100 transition-transform duration-700" />
                                        ) : (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center space-y-4">
                                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center group-hover/upload:scale-110 transition-transform">
                                                    <Plus className="w-8 h-8 text-white/20 group-hover/upload:text-primary-gold transition-colors" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Select Visual Asset</p>
                                                    <p className="text-[10px] text-white/20 italic">JPG, PNG up to 5MB</p>
                                                </div>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            name="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) setUploadPreview(URL.createObjectURL(file));
                                            }}
                                            required
                                        />
                                    </label>

                                    <div className="space-y-4">
                                        <input
                                            type="text"
                                            name="title"
                                            placeholder={activeTab === 'home' ? "Slide Name (Hero Background)" : "Asset Title (e.g., Summer Cut)"}
                                            className="w-full bg-[#0A0A0B]/60 border border-white/5 rounded-2xl p-4 text-sm font-medium outline-none focus:border-primary-gold/40 transition-all"
                                            required
                                        />
                                        <select
                                            name="category"
                                            className="w-full bg-[#0A0A0B]/60 border border-white/5 rounded-2xl p-4 text-sm font-medium outline-none focus:border-primary-gold/40 transition-all uppercase tracking-widest"
                                            defaultValue={activeTab === 'home' ? 'home_hero' : 'hair'}
                                        >
                                            {activeTab === 'home' ? (
                                                <option value="home_hero">Homepage Hero</option>
                                            ) : (
                                                <>
                                                    <option value="hair">Hair Design</option>
                                                    <option value="nails">Artistic Nails</option>
                                                    <option value="makeup">Facial Bloom</option>
                                                    <option value="bridals">Bridal Couture</option>
                                                    <option value="interior">Interior Aesthetic</option>
                                                </>
                                            )}
                                        </select>
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={isUploading || !uploadPreview}
                                        className="w-full h-14 bg-primary-gold text-primary-charcoal hover:bg-white transition-all font-black"
                                    >
                                        {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : activeTab === 'home' ? "SWAP HERO IMAGE" : "PUBLISH TO GALLERY"}
                                    </Button>
                                </form>
                            </div>
                        </div>

                        {/* Gallery List */}
                        <div className="lg:col-span-8">
                            <div className="elite-glass rounded-[2.5rem] p-8 min-h-[600px]">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="font-fraunces text-2xl font-bold flex items-center gap-3">
                                        <ImageIcon className="w-5 h-5 text-white/40" /> Active Assets
                                    </h3>
                                    <div className="text-[10px] uppercase font-bold text-white/20 tracking-widest">
                                        {gallery.length} Images Loaded
                                    </div>
                                </div>

                                {isLoading ? (
                                    <div className="flex py-20 items-center justify-center">
                                        <Loader2 className="w-10 h-10 text-primary-gold/20 animate-spin" />
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                        {gallery.map((item) => (
                                            <div key={item.id} className="group/item relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-white/5 border border-white/5 hover:border-red-500/30 transition-all">
                                                <Image src={item.image_url} alt={item.title} fill className="object-cover group-hover/item:scale-110 transition-all duration-1000 group-hover/item:brightness-50" />

                                                <div className="absolute inset-0 flex flex-col justify-between p-6 opacity-0 group-hover/item:opacity-100 transition-all z-20">
                                                    <div className="flex justify-end">
                                                        <button
                                                            onClick={() => handleDeletePhoto(item.id, item.public_id)}
                                                            className="w-10 h-10 bg-red-500 text-white rounded-xl flex items-center justify-center hover:scale-110 transition-transform shadow-xl"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-[10px] font-bold text-primary-gold uppercase tracking-widest bg-primary-gold/10 px-2 py-0.5 rounded-full w-fit">
                                                            {item.category}
                                                        </p>
                                                        <p className="text-sm font-bold text-white truncate">{item.title}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {gallery.length === 0 && (
                                            <div className="col-span-full py-40 border-2 border-dashed border-white/5 rounded-[2rem] flex flex-col items-center justify-center text-white/20 italic">
                                                <ImageIcon className="w-12 h-12 mb-4 opacity-20" />
                                                Your masterpiece collection is empty.
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'services' && (
                    <motion.div
                        key="services"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <div className="elite-glass rounded-[3rem] p-10 shadow-luxury">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                                <div className="space-y-2">
                                    <h3 className="font-fraunces text-3xl font-bold flex items-center gap-4">
                                        <Scissors className="w-6 h-6 text-primary-gold" /> Ritual Archive
                                    </h3>
                                    <p className="text-white/40 text-sm italic">Control the pricing and availability of your salon experiences.</p>
                                </div>
                                <Button className="bg-primary-gold text-primary-charcoal rounded-2xl h-14 px-8 flex items-center gap-3">
                                    <Plus className="w-5 h-5" /> EXPAND RITUALS
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {services.map((service) => (
                                    <div key={service.id} className={`p-8 bg-white/5 border rounded-[3rem] transition-all group ${service.is_active ? 'border-white/5 hover:border-primary-gold/20' : 'border-red-500/20 opacity-60'}`}>
                                        <div className="flex items-center justify-between mb-8">
                                            <div className="space-y-1">
                                                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary-gold/60">{service.category}</span>
                                                <h4 className="font-fraunces text-2xl font-bold text-white group-hover:text-primary-gold transition-colors">{service.title}</h4>
                                            </div>
                                            <div className="flex flex-col items-end gap-3">
                                                <button
                                                    onClick={() => toggleServiceStatus(service.id, service.is_active)}
                                                    className={`w-14 h-8 rounded-full border transition-all flex items-center px-1 ${service.is_active ? 'bg-primary-gold border-primary-gold justify-end' : 'bg-red-500/10 border-red-500/20 justify-start'
                                                        }`}
                                                >
                                                    <div className={`w-6 h-6 rounded-full shadow-lg ${service.is_active ? 'bg-primary-charcoal' : 'bg-red-500'}`} />
                                                </button>

                                                <button
                                                    onClick={() => handleSetStylistsChoice(service.id)}
                                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-wider transition-all ${service.is_stylists_choice
                                                        ? 'bg-primary-gold/20 border-primary-gold text-primary-gold shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                                                        : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20 hover:text-white'}`}
                                                >
                                                    <Zap className={`w-3 h-3 ${service.is_stylists_choice ? 'fill-current' : ''}`} />
                                                    {service.is_stylists_choice ? "Featured Choice" : "Set As Choice"}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex items-end justify-between">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest italic">Starts At</p>
                                                <p className="text-3xl font-bold text-white tracking-tight">AED {service.starting_price}</p>
                                            </div>

                                            <div className="flex gap-2">
                                                <Button variant="outline" className="w-12 h-12 rounded-2xl border-white/5 p-0 hover:bg-white/5">
                                                    <Edit3 className="w-4 h-4 text-white/40" />
                                                </Button>
                                                <Button variant="outline" className="w-12 h-12 rounded-2xl border-white/5 p-0 hover:bg-white/5">
                                                    <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-primary-gold" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'instagram' && (
                    <motion.div
                        key="instagram"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <div className="elite-glass rounded-[3rem] p-10 shadow-luxury">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                                <div className="space-y-2">
                                    <h3 className="font-fraunces text-3xl font-bold flex items-center gap-4">
                                        <Instagram className="w-6 h-6 text-primary-gold" /> Social Media Manager
                                    </h3>
                                    <p className="text-white/40 text-sm italic">Sculpt your Social Proof section and manage Instagram highlights.</p>
                                </div>
                                <form onSubmit={async (e) => {
                                    e.preventDefault();
                                    const form = e.currentTarget;
                                    const formData = new FormData(form);
                                    setIsUploading(true);
                                    try {
                                        const result = await addInstagramPost(formData);
                                        if (result.success) {
                                            form.reset();
                                            fetchData();
                                            toast.success('Instagram post added!');
                                        } else {
                                            toast.error(result.error || 'Failed to add post');
                                        }
                                    } finally {
                                        setIsUploading(false);
                                    }
                                }} className="flex gap-3">
                                    <input
                                        type="file"
                                        name="file"
                                        accept="image/*"
                                        required
                                        className="hidden"
                                        id="instagram-upload"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onload = (ev) => setUploadPreview(ev.target?.result as string);
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                    <label
                                        htmlFor="instagram-upload"
                                        className="bg-white/10 border border-white/10 text-white px-6 py-3 rounded-2xl cursor-pointer hover:bg-white/20 transition-all flex items-center gap-2"
                                    >
                                        <Upload className="w-5 h-5" /> Choose Image
                                    </label>
                                    <Button type="submit" disabled={isUploading} className="bg-primary-gold text-primary-charcoal rounded-2xl h-auto px-6">
                                        {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>POST TO FEED</>}
                                    </Button>
                                </form>
                            </div>

                            {/* Upload Preview */}
                            {uploadPreview && (
                                <div className="mb-8 p-6 bg-white/5 rounded-3xl border border-white/10">
                                    <p className="text-white/60 text-sm mb-4">Preview:</p>
                                    <div className="relative w-32 h-32 rounded-2xl overflow-hidden">
                                        <Image src={uploadPreview} alt="Preview" fill className="object-cover" />
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
                                {instagramPosts.map((post) => (
                                    <div key={post.id} className="group relative aspect-square bg-white/5 rounded-2xl overflow-hidden border border-white/5 hover:border-primary-gold/30 transition-all">
                                        <Image
                                            src={post.image_url}
                                            alt={post.caption || 'Instagram post'}
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center p-4">
                                            <p className="text-white text-xs text-center line-clamp-3 mb-4">{post.caption}</p>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={async () => {
                                                        const result = await toggleInstagramFeatured(post.id, post.is_featured);
                                                        if (result.success) fetchData();
                                                    }}
                                                    className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase ${post.is_featured ? 'bg-primary-gold/20 text-primary-gold' : 'bg-white/10 text-white/60'}`}
                                                >
                                                    {post.is_featured ? 'Featured' : 'Feature'}
                                                </button>
                                                <button
                                                    onClick={async () => {
                                                        if (confirm('Delete this post?')) {
                                                            const result = await deleteInstagramPost(post.id, post.image_url);
                                                            if (result.success) {
                                                                fetchData();
                                                                toast.success('Post deleted');
                                                            }
                                                        }
                                                    }}
                                                    className="p-2 bg-red-500/20 rounded-xl text-red-400 hover:bg-red-500/40"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                        {post.type === 'reel' && (
                                            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded-full p-1.5">
                                                <Play className="w-3 h-3 text-white fill-white" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {instagramPosts.length === 0 && !isLoading && (
                                <div className="text-center py-16">
                                    <Instagram className="w-16 h-16 text-white/20 mx-auto mb-4" />
                                    <p className="text-white/40">No Instagram posts yet. Upload your first post above!</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
