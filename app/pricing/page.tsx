"use client";

import { motion } from "framer-motion";
import BespokePricing from "@/components/sections/BespokePricing";
import MembershipTiers from "@/components/sections/MembershipTiers";
import DiscoveryExperience from "@/components/sections/DiscoveryExperience";
import FAQ from "@/components/sections/FAQ";
import CallToAction from "@/components/sections/CallToAction";

export default function PricingPage() {
    return (
        <div className="flex flex-col w-full">
            {/* Hero Section */}
            <section className="bg-primary-charcoal pt-32 pb-20 relative overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-20">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1600&q=80')] bg-cover bg-center grayscale" />
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <h1 className="font-fraunces text-6xl md:text-8xl font-bold text-white mb-8">
                            Bespoke <span className="text-primary-gold italic">Rituals</span>
                        </h1>
                        <p className="text-white/60 text-xl max-w-2xl mx-auto font-light leading-relaxed">
                            A curated menu of aesthetic excellence. Explore our transparent investment 
                            tiers or join the Circle for the ultimate sanctuary experience.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Main Interactive Pricing */}
            <BespokePricing />

            {/* Membership Focus */}
            <MembershipTiers />

            {/* Interactive Discovery */}
            <div className="bg-primary-charcoal py-20">
                <DiscoveryExperience />
            </div>

            {/* FAQ & CTA */}
            <FAQ />
            <div className="bg-primary-ivory py-20">
                <CallToAction />
            </div>
        </div>
    );
}
