export interface TeamMember {
    id: number
    name: string
    role: string
    seniority: 'Executive' | 'Senior' | 'Master' | 'Artisan'
    specialty: string
    bio: string
    years: number
    image: string    // Unsplash avatar URL
    instagram?: string
    whatsapp: string
    isOnline: boolean
    pin: string
}

export const team: TeamMember[] = [
    {
        id: 1,
        name: 'Callena Sabir',
        role: 'Creative Director & Owner',
        seniority: 'Executive',
        specialty: 'L’Oréal Colour Specialist',
        bio: 'In the industry since 2008, Callena specializes in effortless chic colour and seamless blends that maintain hair health.',
        years: 16,
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
        instagram: 'https://www.instagram.com/thehideawaydubai/',
        whatsapp: '971561348671',
        isOnline: true,
        pin: '1111'
    },
    {
        id: 2,
        name: 'Emma',
        role: 'Senior Stylist',
        seniority: 'Senior',
        specialty: 'Colour Specialist',
        bio: 'Expert in creating tailored looks that complement individual lifestyle and hair texture.',
        years: 12,
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
        instagram: '#',
        whatsapp: '971561348671',
        isOnline: true,
        pin: '1111'
    },
    {
        id: 3,
        name: 'Charlotte',
        role: 'Senior Stylist',
        seniority: 'Senior',
        specialty: 'Creative Colour & Extensions',
        bio: 'Specializes in transformative colour techniques and high-quality hair extensions.',
        years: 10,
        image: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&q=80',
        instagram: '#',
        whatsapp: '971561348671',
        isOnline: false,
        pin: '1111'
    },
    {
        id: 4,
        name: 'Alla',
        role: 'Master Nail Technician',
        seniority: 'Master',
        specialty: 'Precision Nail Artistry',
        bio: 'Master of precision in nail artistry and high-definition lash extensions.',
        years: 11,
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
        instagram: '#',
        whatsapp: '971561348671',
        isOnline: true,
        pin: '1111'
    },
    {
        id: 5,
        name: 'Estefany',
        role: 'Master Nail Technician',
        seniority: 'Master',
        specialty: 'Meticulous Manicures',
        bio: 'Dedicated to providing a flawless nail experience with attention to detail and care.',
        years: 7,
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
        instagram: '#',
        whatsapp: '971561348671',
        isOnline: true,
        pin: '1111'
    },
    {
        id: 6,
        name: 'Marzieh',
        role: 'Master Nail Technician',
        seniority: 'Master',
        specialty: 'Gel & Builder Extensions',
        bio: 'Expert in complex builder gel overlays and intricate nail art designs.',
        years: 9,
        image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80',
        instagram: '#',
        whatsapp: '971561348671',
        isOnline: false,
        pin: '1111'
    },
    {
        id: 7,
        name: 'Rebecca Sabir',
        role: 'Salon Manager',
        seniority: 'Executive',
        specialty: 'Client Relations & Experience',
        bio: 'Ensuring every visit to The Hideaway is a seamless and elegant experience.',
        years: 15,
        image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&q=80',
        instagram: '#',
        whatsapp: '971561348671',
        isOnline: true,
        pin: '1111'
    },
];
