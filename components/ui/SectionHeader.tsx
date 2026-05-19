import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { fadeInUp, viewportOptions } from "@/lib/animations";

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    align?: "left" | "center";
    className?: string;
    light?: boolean;
}

export default function SectionHeader({
    title,
    subtitle,
    align = "center",
    className,
    light = false,
}: SectionHeaderProps) {
    return (
        <motion.div
            initial="initial"
            whileInView="animate"
            viewport={viewportOptions}
            variants={fadeInUp}
            className={cn(
                "mb-12 md:mb-16 max-w-2xl",
                align === "center" ? "mx-auto text-center" : "text-left",
                className
            )}
        >
            {subtitle && (
                <span className={cn(
                    "inline-block mb-3 text-sm font-bold tracking-widest uppercase",
                    light ? "text-primary-gold" : "text-primary-gold"
                )}>
                    {subtitle}
                </span>
            )}
            <h2 
                className={cn(
                    "font-fraunces text-3xl md:text-4xl lg:text-5xl font-bold leading-tight",
                    light ? "text-white" : "text-primary-charcoal"
                )}
                dangerouslySetInnerHTML={{ __html: title }}
            />
            <div className={cn(
                "w-20 h-1.5 mt-6 rounded-full",
                align === "center" ? "mx-auto" : "mr-auto",
                light ? "bg-white/20" : "bg-primary-gold/30"
            )} />
        </motion.div>
    );
}
