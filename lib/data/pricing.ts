export interface PriceItem {
    name: string
    price: number       // in AED
    note?: string       // e.g. "per session" or "starting from"
}

export interface PriceCategory {
    category: string
    items: PriceItem[]
}

export const pricingTable: PriceCategory[] = [
    {
        category: 'Bespoke Color',
        items: [
            { name: 'Root Color', price: 352, note: 'starting from' },
            { name: 'Full Color', price: 468, note: 'starting from' },
            { name: 'Full Color (Ammonia Free)', price: 492, note: 'starting from' },
            { name: 'Glossing', price: 265, note: 'starting from' },
            { name: 'Glaze', price: 264, note: 'starting from' },
        ],
    },
    {
        category: 'Dimensional Artistry',
        items: [
            { name: 'Balayage', price: 770, note: 'starting from' },
            { name: 'Half Head Highlights', price: 462, note: 'starting from' },
            { name: 'Full Head Highlights', price: 543, note: 'starting from' },
            { name: 'Partial Highlights', price: 311, note: 'starting from' },
        ],
    },
    {
        category: 'Signature Styling',
        items: [
            { name: 'Blowdry', price: 145, note: 'starting from' },
            { name: 'Precision Cutting', price: 266, note: 'starting from' },
            { name: 'Up-Do Styling', price: 385, note: 'starting from' },
            { name: 'Trim / Dusting', price: 231, note: 'starting from' },
        ],
    },
    {
        category: 'Smoothing Rituals',
        items: [
            { name: 'Grape Keratin Treatment', price: 1050, note: 'starting from' },
            { name: 'Coconut Oil Smoothing', price: 1050, note: 'starting from' },
            { name: 'BTX Smoothing', price: 1050, note: 'starting from' },
        ],
    },
    {
        category: 'Scalp Sanctuary',
        items: [
            { name: 'Energizing Scalp Spa', price: 460 },
            { name: 'Purifying Scalp Spa', price: 460 },
            { name: 'Rebalancing Scalp Spa', price: 460 },
            { name: 'Anti-Hair Loss Protocol', price: 365 },
        ],
    },
    {
        category: 'Nail Couture',
        items: [
            { name: 'Hermes Manicure', price: 135, note: 'starting from' },
            { name: 'Hermes Pedicure', price: 145, note: 'starting from' },
            { name: 'Gel Manicure', price: 170, note: 'starting from' },
            { name: 'Japanese Nail Treatment', price: 175, note: 'starting from' },
        ],
    },
    {
        category: 'Lash & Brow Art',
        items: [
            { name: 'Classic Individual Lashes', price: 350 },
            { name: '3D Volume Lashes', price: 450 },
            { name: 'Russian Volume 5D', price: 550 },
            { name: 'Lash Lifting', price: 350 },
            { name: 'Brow Lamination & Tint', price: 350 },
        ],
    },
];


export interface Membership {
    tier: string
    subtitle: string
    price: number
    period: string
    popular: boolean
    features: string[]
    cta: string
}

export const memberships: Membership[] = [
    {
        tier: 'Single Ritual',
        subtitle: 'One bespoke session',
        price: 250,
        period: 'per appointment',
        popular: false,
        features: [
            'One hair or beauty service',
            'In-depth consultation',
            'Expert artisan assigned',
            'No commitment required',
        ],
        cta: 'Book Now',
    },
    {
        tier: 'Hideaway Monthly',
        subtitle: 'Unlimited visits',
        price: 850,
        period: 'per month',
        popular: true,
        features: [
            'Two core services monthly',
            'Priority booking access',
            '15% discount on additional rituals',
            'Guest privileges once a month',
            'Free scalp treatment quarterly',
            'Concierge booking via WhatsApp',
        ],
        cta: 'Join The Circle',
    },
    {
        tier: 'Sanctuary Annual',
        subtitle: 'The ultimate experience',
        price: 8500,
        period: 'per year',
        popular: false,
        features: [
            'Unlimited core services all year',
            '25% discount on all premium rituals',
            'Guaranteed weekend slots',
            'Complimentary bridal trial',
            'Birthday special spa ritual',
            'Dedicated personal artisan',
            'Free monthly deep conditioning',
        ],
        cta: 'Become a Resident',
    },
]
