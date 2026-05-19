"use client";

import { motion } from "framer-motion";
import { Check, Crown, Star, ShieldCheck, ArrowRight } from "lucide-react";
import { memberships } from "@/lib/data/pricing";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import SectionHeader from "@/components/ui/SectionHeader";

export default function MembershipTiers() {
  return (
    <section className="py-32 bg-primary-white relative overflow-hidden" id="memberships">
      {/* Subtle background texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <SectionHeader
          subtitle="Exclusive Access"
          title="The Hideaway Circle"
          description="Join an elite community of residents who prioritize their aesthetic wellness with our bespoke membership programs."
          align="center"
        />

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          {memberships.map((tier, idx) => (
            <motion.div
              key={tier.tier}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                "relative group p-10 rounded-[3rem] border transition-all duration-700 overflow-hidden",
                tier.popular 
                  ? "bg-primary-charcoal text-white border-primary-charcoal shadow-2xl shadow-primary-charcoal/20 scale-105 z-20" 
                  : "bg-white text-primary-charcoal border-secondary-pearl hover:border-primary-gold/30 hover:shadow-xl"
              )}
            >
              {/* Popular Badge */}
              {tier.popular && (
                <div className="absolute top-6 right-6 bg-primary-gold text-primary-charcoal text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full flex items-center gap-2">
                  <Star className="w-3 h-3 fill-primary-charcoal" /> Most Coveted
                </div>
              )}

              {/* Tier Icon */}
              <div className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center mb-10 transition-transform duration-700 group-hover:scale-110",
                tier.popular ? "bg-primary-gold/10 text-primary-gold" : "bg-primary-ivory text-primary-gold"
              )}>
                {idx === 0 && <ShieldCheck className="w-8 h-8" />}
                {idx === 1 && <Crown className="w-8 h-8" />}
                {idx === 2 && <Star className="w-8 h-8" />}
              </div>

              <div className="mb-10">
                <h3 className="font-fraunces text-3xl mb-2">{tier.tier}</h3>
                <p className={cn(
                  "text-sm tracking-wide",
                  tier.popular ? "text-white/60" : "text-secondary-slate"
                )}>
                  {tier.subtitle}
                </p>
              </div>

              <div className="mb-10">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-sans opacity-40 uppercase tracking-widest font-bold">AED</span>
                  <span className="text-5xl font-fraunces font-bold tracking-tight">{tier.price}</span>
                </div>
                <p className={cn(
                  "text-xs uppercase tracking-[0.2em] mt-2 font-bold",
                  tier.popular ? "text-primary-gold" : "text-secondary-slate"
                )}>
                  {tier.period}
                </p>
              </div>

              <ul className="space-y-4 mb-12">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 group/item">
                    <div className={cn(
                      "mt-1 p-0.5 rounded-full transition-colors duration-500",
                      tier.popular ? "bg-primary-gold/20 text-primary-gold" : "bg-primary-gold/10 text-primary-gold"
                    )}>
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span className={cn(
                      "text-sm transition-colors duration-500",
                      tier.popular ? "text-white/80 group-hover/item:text-white" : "text-secondary-slate group-hover/item:text-primary-charcoal"
                    )}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                variant={tier.popular ? "primary" : "outline"}
                className={cn(
                  "w-full h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] group/btn overflow-hidden",
                  tier.popular ? "bg-white text-primary-charcoal hover:bg-primary-gold" : "border-primary-charcoal text-primary-charcoal hover:bg-primary-charcoal hover:text-white"
                )}
                asChild
              >
                <a href="#book" className="flex items-center justify-center gap-3">
                  {tier.cta}
                  <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover/btn:translate-x-1" />
                </a>
              </Button>

              {/* Decorative light sweep for popular tier */}
              {tier.popular && (
                <motion.div
                  animate={{ x: ["-200%", "200%"] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-30deg] pointer-events-none"
                />
              )}
            </motion.div>
          ))}
        </div>

        <div className="mt-20 p-12 bg-primary-ivory rounded-[3rem] border border-secondary-pearl flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-2xl">
            <h4 className="font-fraunces text-2xl text-primary-charcoal mb-4">Corporate & Group Sanctuary</h4>
            <p className="text-secondary-slate leading-relaxed">
              Elevate your team&apos;s aesthetic wellness. We offer bespoke corporate programs and private salon buyouts for Jumeirah&apos;s leading organizations.
            </p>
          </div>
          <Button variant="outline" className="h-14 px-10 rounded-xl border-primary-charcoal/20 text-primary-charcoal whitespace-nowrap">
            Inquire About Bespoke Groups
          </Button>
        </div>
      </div>
    </section>
  );
}
