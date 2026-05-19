export interface Product {
    id: number
    name: string
    brand: string
    price: number
    image: string
    category: string
    desc: string
    benefits: string[]
    link: string
}

export const products: Product[] = [
    {
        id: 1,
        name: 'Elixir Ultime L\'Original Hair Oil',
        brand: 'Kérastase',
        price: 245,
        image: 'https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=400&q=80',
        category: 'Hair Care',
        desc: 'The iconic shine-enhancing hair oil for all hair types.',
        benefits: ['Instant shine', 'Heat protection', 'Frizz control'],
        link: 'https://www.fresha.com/a/the-hideaway-dubai-403-jumeirah-beach-rd-al-athar-street-la-plage-xemz3ky8/booking?menu=true'
    },
    {
        id: 2,
        name: 'Genesis Defense Thermique',
        brand: 'Kérastase',
        price: 195,
        image: 'https://images.unsplash.com/photo-1626784215021-2e39ccf971cd?w=400&q=80',
        category: 'Hair Care',
        desc: 'Blow-dry primer for weakened hair prone to falling.',
        benefits: ['Detangles', 'Hydrates', 'Reduces hair fall'],
        link: 'https://www.fresha.com/a/the-hideaway-dubai-403-jumeirah-beach-rd-al-athar-street-la-plage-xemz3ky8/booking?menu=true'
    },
    {
        id: 3,
        name: 'Chronologiste Masque',
        brand: 'Kérastase',
        price: 320,
        image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&q=80',
        category: 'Hair Care',
        desc: 'Youth revitalizing hair mask to treat aging hair and scalp.',
        benefits: ['Scalp hydration', 'Fiber shine', 'Volumizing'],
        link: 'https://www.fresha.com/a/the-hideaway-dubai-403-jumeirah-beach-rd-al-athar-street-la-plage-xemz3ky8/booking?menu=true'
    },
    {
        id: 4,
        name: 'Soleil Huile Sirene',
        brand: 'Kérastase',
        price: 185,
        image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400&q=80',
        category: 'Styling',
        desc: 'Bi-phase spray for beachy waves with UV protection.',
        benefits: ['Sun protection', 'No-crunch waves', 'Texturizing'],
        link: 'https://www.fresha.com/a/the-hideaway-dubai-403-jumeirah-beach-rd-al-athar-street-la-plage-xemz3ky8/booking?menu=true'
    }
];
