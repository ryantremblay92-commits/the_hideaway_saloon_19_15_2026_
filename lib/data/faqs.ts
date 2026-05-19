export interface FAQ {
    id: number
    question: string
    answer: string
    category?: 'general' | 'booking' | 'membership' | 'services'
}

export const faqs: FAQ[] = [
    {
        id: 1,
        question: 'How do I book an appointment?',
        answer: 'Use our online booking system on the Book Online page. Select your service, choose your stylist, and pick a time that works. You\'ll get a confirmation and reminder. Simple as that.',
        category: 'booking',
    },
    {
        id: 2,
        question: 'Can I request a specific stylist?',
        answer: 'Yes. Each stylist has a specialty and a portfolio. Browse their work on our Team page and request them when you book. If they\'re available, they\'re yours.',
        category: 'booking',
    },
    {
        id: 3,
        question: 'What\'s included in a consultation?',
        answer: 'We talk about what you want, what your hair can do, and what will work best for your lifestyle. No surprises. Just honest conversation before we start.',
        category: 'general',
    },
    {
        id: 4,
        question: 'How long do results typically last?',
        answer: 'Haircuts hold their shape for four to six weeks. Color lasts six to eight weeks depending on the service. Treatments vary. We\'ll tell you exactly what to expect.',
        category: 'services',
    },
    {
        id: 5,
        question: 'Do you offer touch-up appointments?',
        answer: 'We do. Book a touch-up at a reduced rate within the recommended timeframe. Members get priority scheduling for touch-ups.',
        category: 'services',
    },
    {
        id: 6,
        question: 'What\'s the difference between memberships?',
        answer: 'Single visits work for occasional clients. Monthly memberships give you two services, priority booking, and discounts. Annual memberships offer the best value for regular clients.',
        category: 'membership',
    },
    {
        id: 7,
        question: 'Can I transfer my membership?',
        answer: 'Memberships are personal to you. They can\'t be transferred, but you can gift a membership to someone else as a present.',
        category: 'membership',
    },
    {
        id: 8,
        question: 'What if I need to cancel or reschedule?',
        answer: 'Thank you for choosing The Hideaway. We understand life happens. Cancel or reschedule up to 24 hours before your ritual with no penalty. Less notice may result in a cancellation fee.',
        category: 'booking',
    },
    {
        id: 9,
        question: 'Do you use quality products?',
        answer: 'Only the best. We use professional-grade products that work. No shortcuts. Your hair deserves better than drugstore solutions.',
        category: 'general',
    },
    {
        id: 10,
        question: 'Are you open on weekends?',
        answer: 'Yes. We\'re open Saturday and Sunday. Weekday hours are flexible too. Check the Contact page for our full schedule.',
        category: 'general',
    },
]

// Helper — filter FAQs by category
export const getFAQsByCategory = (cat: FAQ['category']) =>
    faqs.filter(f => f.category === cat)
