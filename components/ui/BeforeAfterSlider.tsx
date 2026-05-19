"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BeforeAfterSliderProps {
    beforeSrc: string;
    afterSrc: string;
    beforeAlt?: string;
    afterAlt?: string;
    beforeLabel?: string;
    afterLabel?: string;
    className?: string;
}

export default function BeforeAfterSlider({
    beforeSrc,
    afterSrc,
    beforeAlt = "Before",
    afterAlt = "After",
    beforeLabel = "BEFORE",
    afterLabel = "AFTER",
    className = ""
}: BeforeAfterSliderProps) {
    const [sliderPos, setSliderPos] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const calcPos = (clientX: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const pos = Math.max(2, Math.min(98, (x / rect.width) * 100));
        setSliderPos(pos);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        calcPos(e.clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        calcPos(e.touches[0].clientX);
    };

    return (
        <div
            ref={containerRef}
            className={`relative w-full overflow-hidden cursor-ew-resize select-none ${className}`}
            onMouseMove={handleMouseMove}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onTouchMove={handleTouchMove}
        >
            {/* After Image (Background — full width) */}
            <Image
                src={afterSrc}
                alt={afterAlt}
                fill
                className="object-cover object-center"
                draggable={false}
                priority
            />

            {/* Before Image (Clipped to left of slider) */}
            <div
                className="absolute inset-0 z-10"
                style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
            >
                <Image
                    src={beforeSrc}
                    alt={beforeAlt}
                    fill
                    className="object-cover object-center"
                    draggable={false}
                    priority
                />

                {/* BEFORE label — always visible, top-left */}
                <div className="absolute top-5 left-5 z-30">
                    <span className="bg-black/70 backdrop-blur-sm text-white text-[11px] font-black uppercase tracking-[0.25em] px-4 py-2 rounded-full border border-white/20 shadow-lg">
                        {beforeLabel}
                    </span>
                </div>
            </div>

            {/* AFTER label — always visible, top-right */}
            <div className="absolute top-5 right-5 z-30">
                <span className="bg-primary-gold text-primary-charcoal text-[11px] font-black uppercase tracking-[0.25em] px-4 py-2 rounded-full shadow-lg">
                    {afterLabel}
                </span>
            </div>

            {/* Slider Divider Line */}
            <div
                className="absolute inset-0 z-20 pointer-events-none"
                style={{ left: `${sliderPos}%` }}
            >
                <div className="absolute inset-y-0 -left-[1px] w-[2px] bg-white shadow-[0_0_20px_rgba(255,255,255,0.6)]" />

                {/* Drag Handle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[0_4px_24px_rgba(0,0,0,0.4)] border-2 border-primary-gold">
                    <div className="flex items-center gap-[2px]">
                        <ChevronLeft className="w-3.5 h-3.5 text-primary-charcoal" />
                        <ChevronRight className="w-3.5 h-3.5 text-primary-charcoal" />
                    </div>
                </div>
            </div>
        </div>
    );
}
