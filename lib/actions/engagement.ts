'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { services } from '@/lib/data/services';
import { addPointsToCustomer } from '@/lib/actions/loyalty';

/**
 * Marks a booking as completed and awards loyalty points to the user.
 */
export async function completeBooking(bookingId: string) {
    const supabase = await createClient();

    // 1. Get booking details
    const { data: booking, error: bError } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .single();

    if (bError || !booking) return { success: false, error: 'Booking not found' };
    if (booking.status === 'completed') return { success: false, error: 'Booking already completed' };

    // 2. Update booking status
    const { error: uError } = await supabase
        .from('bookings')
        .update({ status: 'completed' })
        .eq('id', bookingId);

    if (uError) return { success: false, error: 'Failed to update booking' };

    // 3. Award points if user_id exists (registered user)
    // Formula: 50 points per ₹1000 spent.
    if (booking.user_id) {
        // Try to get price from booking, or fallback to service data
        let price = Number(booking.total_price);
        if (!price || price === 0) {
            const service = services.find(s => s.slug === booking.service_id);
            price = service?.startingPrice || 500; // default to 500 if no data
        }

        const pointsToAward = Math.floor((price / 100) * 5) || 25; // 5 pts per AED 100, min 25

        // Use the new loyalty system to award points and record transaction
        const result = await addPointsToCustomer(
            booking.user_id,
            pointsToAward,
            `Earned from ${booking.service_name} ritual`,
            bookingId
        );

        // Also update the physical profile record's total spent
        const { data: profile } = await supabase
            .from('profiles')
            .select('total_spent')
            .eq('id', booking.user_id)
            .single();

        if (profile) {
            await supabase
                .from('profiles')
                .update({
                    total_spent: Number(profile.total_spent || 0) + price
                })
                .eq('id', booking.user_id);
        }

        // 4. Create notification for the user
        await supabase.from('notifications').insert({
            user_id: booking.user_id,
            title: 'Ritual Completed!',
            message: `You've earned ${result.points || pointsToAward} Hideaway Rewards for your ${booking.service_name} ritual.`,
            type: 'reward',
            metadata: { booking_id: bookingId, points: result.points || pointsToAward }
        });
    }

    revalidatePath('/(admin)/bookings');
    return { success: true };
}

/**
 * Creates a notification for all admins.
 */
export async function notifyAdmins(title: string, message: string, type: string = 'info', metadata: any = {}) {
    const supabase = await createClient();

    // In our system, notifications with user_id = null are for admins
    const { error } = await supabase.from('notifications').insert({
        title,
        message,
        type,
        metadata
    });

    return { success: !error };
}

/**
 * Fetches notifications for the current user.
 */
export async function getMyNotifications() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data } = await supabase
        .from('notifications')
        .select('*')
        .or(`user_id.eq.${user.id},user_id.is.null`)
        .order('created_at', { ascending: false })
        .limit(20);

    return data || [];
}

/**
 * Marks a notification as read.
 */
export async function markNotificationAsRead(id: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);
    return { success: !error };
}

/**
 * Placeholder for WhatsApp notification integration.
 * In a real-world scenario, you'd use Twilio or a similar API.
 */
export async function notifyWhatsApp(phone: string, message: string) {
    console.log(`[WhatsApp Simulation] To: ${phone}, Message: ${message}`);
    // implementation would go here
    return { success: true };
}
