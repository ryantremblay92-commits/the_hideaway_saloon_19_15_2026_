'use server';

import { createClient } from '@/lib/supabase/server';

export interface Stylist {
    id: string;
    name: string;
    role: string;
    specialty: string;
    bio: string;
    image_url: string;
    years_experience: number;
    working_hours: Record<string, { open: string; close: string }>;
    expertise: string[];
}

// All possible slots for the salon (9am–7pm, hourly)
const ALL_SLOTS = [
    '09:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '01:00 PM', '02:00 PM',
    '03:00 PM', '04:00 PM', '05:00 PM',
    '06:00 PM', '07:00 PM',
];

/** Convert "HH:MM" 24h to "HH:MM AM/PM" 12h for comparison */
function to12h(time24: string): string {
    const [h, m] = time24.split(':').map(Number);
    const suffix = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${String(hour).padStart(2, '0')}:${String(m).padStart(2, '0')} ${suffix}`;
}

/** Return stylists who have the given service in their expertise array */
export async function getStylistsForService(serviceSlug: string): Promise<Stylist[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('staff_profiles')
        .select('id, name, role, specialty, bio, image_url, years_experience, working_hours, expertise')
        .eq('is_active', true)
        .contains('expertise', [serviceSlug]);

    if (error || !data) {
        console.error('getStylistsForService error:', error);
        return [];
    }

    return data as Stylist[];
}

/** Return available time slots for a stylist (or any qualified stylist) on a specific date */
export async function getAvailableSlots(
    stylistId: string, 
    date: string, 
    serviceSlug?: string
): Promise<{
    slot: string;
    available: boolean;
}[]> {
    if (!stylistId || !date) return [];

    const supabase = await createClient();

    let targetStylistIds: string[] = [];

    if (stylistId === 'any') {
        if (!serviceSlug) return [];
        // Find all stylists who can do this service
        const { data: qualified } = await supabase
            .from('staff_profiles')
            .select('id')
            .eq('is_active', true)
            .contains('expertise', [serviceSlug]);
        
        if (!qualified || qualified.length === 0) return [];
        targetStylistIds = qualified.map(s => s.id);
    } else {
        targetStylistIds = [stylistId];
    }

    // 1. Get working hours for all target stylists
    const { data: staff } = await supabase
        .from('staff_profiles')
        .select('id, working_hours')
        .in('id', targetStylistIds);

    if (!staff || staff.length === 0) return [];

    // 2. Determine day of week
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[new Date(date).getDay()];

    // 3. Fetch all bookings for these stylists on this date
    const { data: booked } = await supabase
        .from('bookings')
        .select('time, stylist_id')
        .in('stylist_id', targetStylistIds)
        .eq('date', date)
        .in('status', ['pending', 'confirmed']);

    const bookingsByStylist: Record<string, Set<string>> = {};
    targetStylistIds.forEach(id => bookingsByStylist[id] = new Set());
    booked?.forEach(b => {
        if (b.stylist_id) bookingsByStylist[b.stylist_id].add(b.time);
    });

    // 4. For each slot, check if ANY stylist is working AND free
    return ALL_SLOTS.map(slot => {
        const isAnyAvailable = staff.some(s => {
            const dayHours = s.working_hours?.[dayName];
            if (!dayHours) return false;

            const openIdx = ALL_SLOTS.indexOf(to12h(dayHours.open));
            const closeIdx = ALL_SLOTS.indexOf(to12h(dayHours.close));
            const slotIdx = ALL_SLOTS.indexOf(slot);

            const isWorking = slotIdx >= openIdx && slotIdx < (closeIdx >= 0 ? closeIdx : ALL_SLOTS.length);
            const isFree = !bookingsByStylist[s.id].has(slot);

            return isWorking && isFree;
        });

        return {
            slot,
            available: isAnyAvailable
        };
    });
}
