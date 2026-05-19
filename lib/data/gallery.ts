export interface GalleryImage {
    id: number
    src: string
    alt: string
    category: 'all' | 'haircut' | 'color' | 'bridal' | 'mens' | 'treatment'
    before?: string    // optional before image for slider
}

export const galleryImages: GalleryImage[] = [
    { id: 1, src: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80', alt: 'Precision haircut transformation', category: 'haircut' },
    { id: 2, src: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80', alt: 'Balayage color result', category: 'color', before: 'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=600&q=80' },
    { id: 3, src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80', alt: 'Bridal updo styling', category: 'bridal' },
    { id: 4, src: 'https://images.unsplash.com/photo-1503951914875-452162b28f1f?w=600&q=80', alt: 'Men\'s fade haircut', category: 'mens' },
    { id: 5, src: 'https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=600&q=80', alt: 'Hair spa treatment', category: 'treatment' },
    { id: 6, src: 'https://images.unsplash.com/photo-1634449571010-02389ed0f9b0?w=600&q=80', alt: 'Highlights color work', category: 'color', before: 'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=600&q=80' },
    { id: 7, src: 'https://images.unsplash.com/photo-1590159763121-7c9fd312190e?w=600&q=80', alt: 'Bob haircut styling', category: 'haircut' },
    { id: 8, src: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=600&q=80', alt: 'Bridal hair and makeup', category: 'bridal', before: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80' },
    { id: 9, src: 'https://images.unsplash.com/photo-1493256338651-d82f7a7e638?w=600&q=80', alt: 'Ombre color result', category: 'color' },
    { id: 10, src: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=600&q=80', alt: 'Beard styling and trim', category: 'mens' },
    { id: 11, src: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&q=80', alt: 'Keratin treatment result', category: 'treatment' },
    { id: 12, src: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&q=80', alt: 'Layered haircut', category: 'haircut' },
]

export const galleryFilters = [
    { label: 'All', value: 'all' },
    { label: 'Haircuts', value: 'haircut' },
    { label: 'Color', value: 'color' },
    { label: 'Bridal', value: 'bridal' },
    { label: "Men's", value: 'mens' },
    { label: 'Treatment', value: 'treatment' },
]

export const beforeAfterPairs = galleryImages.filter(img => img.before)
