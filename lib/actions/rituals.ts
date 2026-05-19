'use server';

import { createClient } from '@/lib/supabase/server';

export async function getLastCompletedRitual(userId: string) {
    const supabase = await createClient();

    const { data: booking, error } = await supabase
        .from('bookings')
        .select(`
            service_id,
            services:service_id (
                slug,
                title,
                image
            )
        `)
        .eq('user_id', userId)
        .eq('status', 'completed')
        .order('booking_date', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error || !booking) return null;

    return (booking as any).services;
}
