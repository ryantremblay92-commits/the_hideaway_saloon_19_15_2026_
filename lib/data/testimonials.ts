export interface Testimonial {
    id: number
    stars: number
    quote: string
    name: string
    role: string
    image?: string
}

export const testimonials: Testimonial[] = [
    {
        id: 1,
        stars: 5,
        quote: 'Priya understood exactly what I wanted before I could fully explain it. The cut is sharp, the color is perfect, and it\'s held up beautifully.',
        name: 'Anjali Menon',
        role: 'Marketing Professional',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80',
    },
    {
        id: 2,
        stars: 5,
        quote: 'My wedding day hair was flawless. They didn\'t just style it, they made me feel confident walking down the aisle.',
        name: 'Divya Kumar',
        role: 'Bride',
        image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80',
    },
    {
        id: 3,
        stars: 5,
        quote: 'I\'ve tried everywhere. The keratin treatment here actually works and doesn\'t damage my hair. I\'m a regular now.',
        name: 'Ravi Shankar',
        role: 'Business Owner',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
    },
    {
        id: 4,
        stars: 5,
        quote: 'Best balayage in Kerala. The team really listened to what I wanted and delivered exactly that.',
        name: 'Meera Pillai',
        role: 'Regular Client',
        image: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=200&q=80',
    },
]
