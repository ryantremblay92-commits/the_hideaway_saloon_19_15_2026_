'use server';

import { createClient } from '@/lib/supabase/server';
import { services, Service } from '@/lib/data/services';

export interface Suggestion {
    service: Service;
    reason: string;
    priority: number; // 1 (highest) to 3
}

export async function getPersonalizedSuggestions(userId: string): Promise<Suggestion[]> {
    const supabase = await createClient();

    // 1. Fetch booking history
    const { data: bookings, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

    if (error || !bookings || bookings.length === 0) {
        // Default suggestions for new users
        return [
            {
                service: services.find(s => s.slug === 'haircuts-styling')!,
                reason: "Our most popular ritual to start your journey.",
                priority: 1
            },
            {
                service: services.find(s => s.slug === 'hair-treatments')!,
                reason: "The perfect detox for your hair.",
                priority: 2
            }
        ];
    }

    const suggestions: Suggestion[] = [];
    const now = new Date();
    const lastBooking = bookings[0];
    const lastBookingDate = new Date(lastBooking.date);
    const weeksSinceLastBooking = Math.floor((now.getTime() - lastBookingDate.getTime()) / (1000 * 60 * 60 * 24 * 7));

    // 2. Logic based on service types
    const hasService = (slug: string) => bookings.some(b => b.service_id === slug);

    // Case: Hair Color Refresh
    if (hasService('hair-coloring') && weeksSinceLastBooking >= 6 && weeksSinceLastBooking < 12) {
        suggestions.push({
            service: services.find(s => s.slug === 'hair-treatments')!,
            reason: "Time to lock in that color brilliance with a Deep Conditioning Spa.",
            priority: 1
        });
    }

    // Case: Regular Haircut (Gents or ladies who haven't come in 8+ weeks)
    if (hasService('haircuts-styling') && weeksSinceLastBooking >= 8) {
        suggestions.push({
            service: services.find(s => s.slug === 'haircuts-styling')!,
            reason: "It's been 8 weeks since your last cut. Ready for a refresh?",
            priority: 1
        });
    }

    // Case: Nail Refill / Care
    if (hasService('nail-care') && weeksSinceLastBooking >= 3) {
        suggestions.push({
            service: services.find(s => s.slug === 'nail-care')!,
            reason: "Your nails deserve a fresh coat of perfection.",
            priority: 2
        });
    }

    // Case: Men's Grooming Cycle
    if (hasService('mens-grooming') && weeksSinceLastBooking >= 3) {
        suggestions.push({
            service: services.find(s => s.slug === 'mens-grooming')!,
            reason: "Keep that sharp look maintained. Perfect time for a trim.",
            priority: 1
        });
    }

    // If still empty, suggest something new
    if (suggestions.length === 0) {
        const untried = services.filter(s => !bookings.some(b => b.service_id === s.slug));
        if (untried.length > 0) {
            suggestions.push({
                service: untried[0],
                reason: "Explore a new facet of Elegancia.",
                priority: 3
            });
        }
    }

    // Filter out services already booked for the future
    const futureBookings = bookings.filter(b => new Date(b.date) > now && b.status !== 'cancelled');
    return suggestions.filter(s => !futureBookings.some(fb => fb.service_id === s.service.slug)).slice(0, 2);
}
