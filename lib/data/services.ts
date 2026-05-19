export interface Service {
    slug: string
    title: string
    icon: string        // Lucide icon name
    shortDesc: string        // 1-line — used on cards
    longDesc: string        // 2-3 sentences — used on detail page
    subServices: string[]      // bullet list on detail page
    image: string        // Unsplash URL
    startingPrice: number        // in AED
    duration: string        // e.g. "45–60 mins"
    tag?: string        // optional badge e.g. "Most Popular"
    isStylistsChoice?: boolean;
}

export const services: Service[] = [
    {
        slug: 'hair-coloring',
        title: 'Effortless Color',
        icon: 'Palette',
        shortDesc: 'Balayage, seamless blends, and "future-proof" hair health.',
        longDesc: 'We specialize in effortless & chic colour that grows out beautifully. Our "future-proof" approach ensures your hair remains healthy and vibrant long after you leave the chair.',
        subServices: ['Root Color', 'Full Color', 'Balayage', 'Highlights', 'Glossing', 'Color Correction'],
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80',
        startingPrice: 352,
        duration: '90–180 mins',
        tag: 'Most Popular',
    },
    {
        slug: 'hair-treatments',
        title: 'Hair Spa Rituals',
        icon: 'Sparkles',
        shortDesc: 'Kérastase scalp rituals and specialized hair restoration.',
        longDesc: 'A true sanctuary for your hair. We use specialized Kérastase rituals and gentle, chemical-additive-free products to nourish your scalp and hair from root to tip.',
        subServices: ['Kérastase Rituals', 'Scalp Treatments', 'Deep Conditioning', 'Hair Restoration'],
        image: '/images/hair_spa_rituals_hero.png',
        startingPrice: 265,
        duration: '60–120 mins',
        isStylistsChoice: true,
    },
    {
        slug: 'haircuts-styling',
        title: 'Precision Styling',
        icon: 'Scissors',
        shortDesc: 'Effortless cuts and signature waves that complement your vibe.',
        longDesc: 'Each cut is designed to work with your natural texture. From precision bobs to signature waves, we create looks that are easy to maintain and inherently chic.',
        subServices: ['Precision Haircut', 'Blowdry', 'Signature Waves', 'Bridal Styling', 'Occasion Hair'],
        image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80',
        startingPrice: 145,
        duration: '30–60 mins',
        tag: 'Essential',
    },
    {
        slug: 'hair-extensions',
        title: 'Hair Extensions',
        icon: 'Wind',
        shortDesc: 'Length, volume, and density — applied with a seamless finish.',
        longDesc: 'Our stylists blend extensions invisibly into your natural hair, adding length or volume that moves and feels completely real. We consult on the right method for your hair type before we begin.',
        subServices: ['Tape-In Extensions', 'Weft Extensions', 'Clip-In Styling', 'Extension Maintenance', 'Removal & Reset'],
        image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800&q=80',
        startingPrice: 800,
        duration: '90–180 mins',
    },
    {
        slug: 'hair-straightening',
        title: 'Permanent Straightening',
        icon: 'MoveHorizontal',
        shortDesc: 'Smooth, frizz-free hair that lasts — with a healthy finish.',
        longDesc: 'Our keratin-based permanent straightening treatments restructure the hair at a molecular level, eliminating frizz and delivering long-lasting smoothness. Results that look natural, never flat.',
        subServices: ['Keratin Treatment', 'Brazilian Blowout', 'BTX Smoothing', 'Grape Keratin'],
        image: 'https://images.unsplash.com/photo-1500840216050-6ffa99d75160?w=800&q=80',
        startingPrice: 1050,
        duration: '120–180 mins',
        tag: 'Premium',
    },
    {
        slug: 'skin-care',
        title: 'Skin Alchemy',
        icon: 'Flower2',
        shortDesc: 'Facials and rituals to bring out your natural glow.',
        longDesc: 'Experience our "Glow On The Go" facials and therapeutic skin treatments designed to rejuvenate and refresh your complexion using premium products.',
        subServices: ['Glow On The Go Facial', 'Deep Cleansing', 'Hydration Ritual', 'Anti-Aging Therapy'],
        image: 'https://images.unsplash.com/photo-1570172234560-9da078179260?w=800&q=80',
        startingPrice: 320,
        duration: '45–75 mins',
    },
    {
        slug: 'nail-care',
        title: 'Nail Artistry',
        icon: 'Hand',
        shortDesc: 'Manicures, extensions, and builder gel with meticulous detail.',
        longDesc: 'From basic manicures to complex builder gel overlays and nail art. Our master technicians Alla, Estefany, and Marzieh ensure every detail is flawless.',
        subServices: ['Manicure', 'Pedicure', 'Nail Extensions', 'Builder/Overlay', 'Nail Art'],
        image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=80',
        startingPrice: 135,
        duration: '45–90 mins',
    },
    {
        slug: 'lashes-brows',
        title: 'Lash & Brow',
        icon: 'Crown',
        shortDesc: 'Definition and grooming for a perfectly framed look.',
        longDesc: 'Expert eyelash extensions, eyebrow grooming, and threading to enhance your natural features. Perfectly framed eyes to complete your beauty ritual.',
        subServices: ['Eyelash Extensions', 'Eyebrow Grooming', 'Threading', 'Lash Lift', 'Brow Tinting'],
        image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&q=80',
        startingPrice: 350,
        duration: '30–90 mins',
    },
    {
        slug: 'mens-grooming',
        title: "Men's Grooming",
        icon: 'Zap',
        shortDesc: 'Sharp fades, beard sculpting, and premium male rituals.',
        longDesc: "Expert grooming tailored for the modern man. From precision fades to therapeutic beard treatments and skin rituals, we provide a complete sanctuary for male aesthetics.",
        subServices: ['Haircut & Fade', 'Beard Sculpting', 'Hot Towel Shave', 'Men\'s Facial', 'Scalp Treatment'],
        image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80',
        startingPrice: 120,
        duration: '30–60 mins',
    },
]

export const getServiceBySlug = (slug: string): Service | undefined =>
    services.find(s => s.slug === slug)

export const getFeaturedServices = () =>
    services.filter(s => s.tag === 'Most Popular' || s.tag === 'Premium')
