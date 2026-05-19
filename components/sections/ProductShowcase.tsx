"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { products } from "@/lib/data/products";
import { ShoppingBag, ArrowRight, Check } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";

export default function ProductShowcase() {
    return (
        <section className="py-32 bg-primary-ivory" id="rituals-at-home">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-20 mb-24">
                    <div className="lg:w-1/2">
                        <SectionHeader
                            subtitle="The Collection"
                            title="Rituals for your <span class='text-primary-gold italic'>Inner Sanctuary</span>"
                            description="Extend the Hideaway experience to your home. We've curated the world's most powerful botanical and scientific formulations for lasting results."
                            align="left"
                        />
                        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {['Complimentary Shipping on Memberships', 'Personalized Product Consultations', 'Exclusive Kérastase Partner', 'Sustainable Packaging'].map((benefit) => (
                                <div key={benefit} className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-primary-gold/10 flex items-center justify-center">
                                        <Check className="w-3 h-3 text-primary-gold" />
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-widest text-primary-charcoal/60">{benefit}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="lg:w-1/2 relative">
                        <div className="absolute -inset-10 bg-primary-gold/5 rounded-full blur-3xl" />
                        <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl">
                            <Image 
                                src="https://images.unsplash.com/photo-1560067174-c5a3a8f37060?w=800&q=80" 
                                alt="High-end salon products" 
                                fill 
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-primary-charcoal/60 to-transparent" />
                            <div className="absolute bottom-10 left-10">
                                <span className="text-primary-gold text-[10px] font-black uppercase tracking-[0.4em] mb-2 block">Curation</span>
                                <p className="text-white text-2xl font-fraunces italic">The Kérastase Edit</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((product, idx) => (
                        <motion.div 
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="group bg-white p-8 rounded-[2.5rem] border border-secondary-pearl hover:shadow-2xl transition-all duration-500"
                        >
                            <div className="relative aspect-square mb-8 rounded-2xl overflow-hidden bg-primary-ivory group-hover:scale-105 transition-transform duration-700">
                                <Image 
                                    src={product.image} 
                                    alt={product.name} 
                                    fill 
                                    className="object-cover mix-blend-multiply opacity-80"
                                />
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-gold">{product.brand}</span>
                                    <h4 className="font-fraunces text-xl text-primary-charcoal mt-1 leading-tight group-hover:text-primary-gold transition-colors">
                                        {product.name}
                                    </h4>
                                </div>
                                <p className="text-secondary-slate text-sm line-clamp-2">
                                    {product.desc}
                                </p>
                                <div className="flex items-center justify-between pt-4 border-t border-secondary-pearl">
                                    <span className="font-fraunces text-lg text-primary-charcoal">AED {product.price}</span>
                                    <Button variant="ghost" size="sm" className="p-0 hover:bg-transparent hover:text-primary-gold group/btn">
                                        View Details <ArrowRight className="w-3 h-3 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-20 text-center">
                    <Button variant="primary" size="lg" className="h-16 px-12 bg-primary-charcoal text-white rounded-2xl hover:bg-primary-gold transition-colors">
                        Explore Full Boutique <ShoppingBag className="w-4 h-4 ml-3" />
                    </Button>
                </div>
            </div>
        </section>
    );
}
