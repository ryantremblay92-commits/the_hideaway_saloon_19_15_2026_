import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import React from "react";

const buttonVariants = cva(
    "inline-flex items-center justify-center rounded-lg text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-gold focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-95",
    {
        variants: {
            variant: {
                primary: "bg-primary-gold text-primary-charcoal hover:bg-[#B8944F]",
                secondary: "bg-transparent border-2 border-primary-gold text-primary-gold hover:bg-primary-gold hover:text-primary-charcoal",
                outline: "bg-transparent border border-secondary-pearl text-secondary-slate hover:border-primary-gold hover:text-primary-gold",
                ghost: "bg-transparent text-primary-gold hover:bg-primary-ivory",
                luxury: "bg-primary-charcoal text-primary-gold border border-primary-gold/20 hover:border-primary-gold hover:bg-black luxury-glass gold-shimmer uppercase tracking-[0.2em] font-bold text-[10px]",
            },
            size: {
                default: "h-12 px-6 py-3",
                sm: "h-10 px-4 py-2",
                lg: "h-14 px-8 py-4 text-base",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
