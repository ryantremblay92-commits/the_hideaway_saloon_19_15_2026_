"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Sparkles, ArrowRight, CheckCircle2, RotateCcw, Heart, Droplets, Zap, Shield } from "lucide-react";
import { pricingTable } from "@/lib/data/pricing";
import { cn } from "@/lib/utils";

const questions = [
  {
    id: "hair-mood",
    question: "What is your hair's current mood?",
    options: [
      { id: "frizzy", label: "Frizzy & Unruly", icon: <Zap className="w-5 h-5" />, desc: "Needs serious smoothing" },
      { id: "dull", label: "Dull & Tired", icon: <Sparkles className="w-5 h-5" />, desc: "Needs mirror-like shine" },
      { id: "dry", label: "Dry & Thirsty", icon: <Droplets className="w-5 h-5" />, desc: "Needs deep hydration" },
      { id: "thin", label: "Thin & Weak", icon: <Shield className="w-5 h-5" />, desc: "Needs strength & volume" },
    ],
  },
  {
    id: "goal",
    question: "What is your ultimate hair goal?",
    options: [
      { id: "transformation", label: "Bold Transformation", icon: <Heart className="w-5 h-5" />, desc: "A brand new look" },
      { id: "maintenance", label: "Perfect Maintenance", icon: <RotateCcw className="w-5 h-5" />, desc: "Keep it looking fresh" },
      { id: "health", label: "Maximum Health", icon: <Shield className="w-5 h-5" />, desc: "Repair and restore" },
      { id: "style", label: "Red Carpet Style", icon: <Sparkles className="w-5 h-5" />, desc: "Perfectly styled" },
    ],
  },
];

export default function DiscoveryExperience() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isFinished, setIsFinished] = useState(false);

  const handleOptionSelect = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsFinished(true);
    }
  };

  const reset = () => {
    setCurrentStep(0);
    setAnswers({});
    setIsFinished(false);
  };

  // Logic to determine recommendation based on answers
  const getRecommendation = () => {
    if (answers["hair-mood"] === "frizzy") {
      const smoothing = pricingTable.find(c => c.category === "Smoothing Rituals");
      return {
        title: "Smoothing Ritual",
        service: smoothing?.items[0].name || "BTX Smoothing",
        price: smoothing?.items[0].price || 1050,
        desc: "Designed to eliminate frizz and reconstruct your hair at a molecular level for lasting silkiness.",
      };
    }
    if (answers["goal"] === "transformation") {
      const color = pricingTable.find(c => c.category === "Dimensional Artistry");
      return {
        title: "Dimensional Artistry",
        service: "Bespoke Balayage",
        price: 770,
        desc: "A hand-painted technique that creates a natural, sun-kissed look with soft, seamless transitions.",
      };
    }
    if (answers["hair-mood"] === "dry" || answers["goal"] === "health") {
      const scalp = pricingTable.find(c => c.category === "Scalp Sanctuary");
      return {
        title: "Scalp Sanctuary",
        service: scalp?.items[0].name || "Energizing Scalp Spa",
        price: scalp?.items[0].price || 460,
        desc: "A therapeutic experience that balances your scalp and rejuvenates hair from the root.",
      };
    }
    // Default
    return {
      title: "Signature Styling",
      service: "Precision Cut & Blowdry",
      price: 266,
      desc: "An essential ritual to redefine your shape and leave you feeling polished and renewed.",
    };
  };

  const recommendation = getRecommendation();

  return (
    <section className="py-24 bg-primary-charcoal relative overflow-hidden">
      {/* Background kinetic elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary-gold/30 to-transparent blur-[120px]" 
        />
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary-gold mb-6"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Discovery Experience</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-fraunces text-4xl md:text-6xl text-white"
          >
            Find Your <span className="italic text-primary-gold">Perfect Ritual</span>
          </motion.h2>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-8 md:p-16 min-h-[400px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {!isFinished ? (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-12"
              >
                <div className="space-y-4">
                  <span className="text-primary-gold font-mono text-sm tracking-tighter">Step 0{currentStep + 1} / 0{questions.length}</span>
                  <h3 className="font-fraunces text-2xl md:text-3xl text-white leading-tight">
                    {questions[currentStep].question}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {questions[currentStep].options.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleOptionSelect(questions[currentStep].id, option.id)}
                      className="group relative flex items-center gap-6 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary-gold/50 transition-all duration-500 text-left"
                    >
                      <div className="w-12 h-12 rounded-xl bg-primary-gold/10 flex items-center justify-center text-primary-gold group-hover:bg-primary-gold group-hover:text-primary-charcoal transition-all duration-500">
                        {option.icon}
                      </div>
                      <div className="space-y-1">
                        <span className="block text-white font-medium group-hover:text-primary-gold transition-colors">{option.label}</span>
                        <span className="block text-white/40 text-xs">{option.desc}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-white/20 ml-auto group-hover:text-primary-gold transition-all group-hover:translate-x-1" />
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-10"
              >
                <div className="flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-primary-gold/20 flex items-center justify-center text-primary-gold">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                </div>

                <div className="space-y-4">
                  <span className="text-primary-gold text-[10px] font-bold uppercase tracking-[0.3em]">Your Bespoke Match</span>
                  <h3 className="font-fraunces text-4xl md:text-5xl text-white">
                    {recommendation.service}
                  </h3>
                  <p className="text-white/60 max-w-lg mx-auto text-lg leading-relaxed">
                    {recommendation.desc}
                  </p>
                </div>

                <div className="flex flex-col items-center gap-8">
                  <div className="text-center">
                    <span className="block text-[10px] uppercase tracking-widest text-white/20 mb-2">Investment Starting From</span>
                    <span className="text-4xl font-fraunces font-bold text-white">
                      <span className="text-sm font-sans mr-2 text-white/40">AED</span>
                      {recommendation.price}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <Button 
                      variant="primary" 
                      size="lg" 
                      className="bg-primary-gold text-primary-charcoal h-16 px-12 rounded-2xl font-bold"
                      asChild
                    >
                      <Link href="/book">
                        Secure This Ritual <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                    <button 
                      onClick={reset}
                      className="h-16 px-8 rounded-2xl border border-white/10 text-white/60 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" /> Start Over
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
