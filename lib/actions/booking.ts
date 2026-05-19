'use server';

import { createClient } from '@/lib/supabase/server';
import { 
    sendBookingConfirmation, 
    sendBookingCancelled, 
    sendReviewInvitation, 
    sendBookingRescheduled 
} from './email';
import { notifyAdmins } from './engagement';

export async function createBooking(formData: {
    serviceId: string;
    serviceName: string;
    stylistId?: string;
    date: string;
    time: string;
    name: string;
    phone: string;
    email?: string;
    notes?: string;
    referralCode?: string;
}) {
    const supabase = await createClient();

    // Get current user if logged in
    const { data: { user } } = await supabase.auth.getUser();

    // 1. Get service price for total_price calculation
    const { data: service } = await supabase
        .from('services')
        .select('starting_price')
        .eq('slug', formData.serviceId)
        .single();

    const basePrice = service?.starting_price || 0;
    const discount = formData.referralCode ? 500 : 0;
    const totalPrice = Math.max(0, basePrice - discount);

    // 2. Insert booking into Supabase
    const { data, error } = await supabase
        .from('bookings')
        .insert({
            service_id: formData.serviceId,
            service_name: formData.serviceName,
            date: formData.date,
            time: formData.time,
            customer_name: formData.name,
            customer_phone: formData.phone,
            customer_email: formData.email || null,
            notes: formData.notes || null,
            user_id: user?.id || null,
            referral_code: formData.referralCode || null,
            total_price: totalPrice,
            status: 'pending',
            stylist_id: (formData.stylistId && formData.stylistId !== 'any') ? formData.stylistId : null,
        })
        .select()
        .single();

    if (error) {
        console.error('Booking error:', error);
        return { success: false, error: error.message };
    }

    // Handle Referral Conversion
    if (formData.referralCode && user?.id) {
        // We import it dynamically here or at the top
        const { useReferralCode } = await import('./loyalty');
        await useReferralCode(formData.referralCode, user.id);
    }

    // 1. Notify Admins in real-time
    await notifyAdmins(
        'New Ritual Requested',
        `${formData.name} requested a ${formData.serviceName} for ${formData.date} at ${formData.time}.`,
        'booking_new',
        { booking_id: data.id }
    );

    // 2. Send confirmation email if email provided
    if (formData.email) {
        await sendBookingConfirmation(formData.email, {
            serviceName: formData.serviceName,
            date: formData.date,
            time: formData.time,
            name: formData.name,
        });
    }

    return { success: true, data };
}

export async function updateBookingStatus(bookingId: string, status: string) {
    const supabase = await createClient();

    // Fetch the booking first to get customer details before update
    const { data: currentBooking } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .single();

    // Update booking status
    const { data: booking, error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId)
        .select()
        .single();

    if (error) {
        console.error('Failed to update booking:', error);
        return { success: false, error: error.message };
    }

    // 1. Notification System: Add push notification for customer
    if (booking.user_id) {
        await supabase.from('notifications').insert([{
            user_id: booking.user_id,
            title: `Appointment ${status.charAt(0).toUpperCase() + status.slice(1)}`,
            message: `Your ${booking.service_name} on ${booking.date} at ${booking.time} has been ${status}.`,
            type: status === 'confirmed' ? 'booking_confirmed' : 'info'
        }]);
    }

    // 2. Dispatch Live Transactional Emails
    if (booking.customer_email) {
        try {
            if (status === 'cancelled') {
                console.log(`[Email Dispatch] Sending cancellation email to: ${booking.customer_email}`);
                await sendBookingCancelled(booking.customer_email, {
                    name: booking.customer_name,
                    serviceName: booking.service_name,
                    date: booking.date
                });
            } else if (status === 'completed') {
                console.log(`[Email Dispatch] Sending review invitation email to: ${booking.customer_email}`);
                // Try to resolve stylist name
                let stylistName = 'The Hideaway Artisan Team';
                if (booking.stylist_id) {
                    const { data: stylist } = await supabase
                        .from('stylists')
                        .select('name')
                        .eq('id', booking.stylist_id)
                        .single();
                    if (stylist?.name) {
                        stylistName = stylist.name;
                    }
                }
                await sendReviewInvitation(booking.customer_email, {
                    name: booking.customer_name,
                    stylistName
                });
            }
        } catch (mailErr) {
            console.error('Failed to dispatch transactional mail in updateBookingStatus:', mailErr);
        }
    }

    // 3. Loyalty Automation: Award points on completion
    if (status === 'completed' && booking.user_id && booking.total_price) {
        // Calculate points (e.g. 1 point per $10 spent)
        const pointsEarned = Math.floor(booking.total_price / 10);
        
        // Upsert loyalty profile
        const { data: existingProfile } = await supabase
            .from('loyalty_profiles')
            .select('*')
            .eq('user_id', booking.user_id)
            .single();

        if (existingProfile) {
            const newPoints = existingProfile.points + pointsEarned;
            const newTotalSpent = Number(existingProfile.total_spent) + Number(booking.total_price);
            
            // Auto-Tiering logic
            let newTier = existingProfile.tier;
            if (newTotalSpent > 5000) newTier = 'Gold';
            else if (newTotalSpent > 2000) newTier = 'Silver';

            await supabase.from('loyalty_profiles').update({
                points: newPoints,
                total_spent: newTotalSpent,
                tier: newTier
            }).eq('user_id', booking.user_id);

        } else {
            // Create new profile if it doesn't exist
            await supabase.from('loyalty_profiles').insert([{
                user_id: booking.user_id,
                points: pointsEarned,
                total_spent: booking.total_price,
                tier: booking.total_price > 5000 ? 'Gold' : booking.total_price > 2000 ? 'Silver' : 'Bronze'
            }]);
        }

        // Notify user about points earned
        await supabase.from('notifications').insert([{
            user_id: booking.user_id,
            title: 'Points Earned!',
            message: `You earned ${pointsEarned} points from your recent visit.`,
            type: 'reward'
        }]);
    }

    return { success: true, booking };
}

/**
 * 7. Reschedule Server Action (triggers Rescheduled Email automatically)
 */
export async function rescheduleBooking(bookingId: string, newDate: string, newTime: string) {
    const supabase = await createClient();

    // 1. Get the current booking details
    const { data: currentBooking, error: fetchError } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .single();

    if (fetchError || !currentBooking) {
        console.error('Failed to find booking for rescheduling:', fetchError);
        return { success: false, error: 'Booking not found' };
    }

    const oldDate = `${currentBooking.date} at ${currentBooking.time}`;

    // 2. Perform the update
    const { data: updatedBooking, error: updateError } = await supabase
        .from('bookings')
        .update({
            date: newDate,
            time: newTime
        })
        .eq('id', bookingId)
        .select()
        .single();

    if (updateError || !updatedBooking) {
        console.error('Failed to reschedule booking in Supabase:', updateError);
        return { success: false, error: updateError?.message || 'Update failed' };
    }

    // 3. Add customer push notification if user account exists
    if (updatedBooking.user_id) {
        await supabase.from('notifications').insert([{
            user_id: updatedBooking.user_id,
            title: 'Ritual Rescheduled',
            message: `Your booking has been moved to ${newDate} at ${newTime}.`,
            type: 'info'
        }]);
    }

    // 4. Dispatch the rescheduled email to the customer
    if (updatedBooking.customer_email) {
        try {
            console.log(`[Email Dispatch] Sending reschedule email to: ${updatedBooking.customer_email}`);
            await sendBookingRescheduled(updatedBooking.customer_email, {
                name: updatedBooking.customer_name,
                serviceName: updatedBooking.service_name,
                oldDate,
                newDate,
                newTime
            });
        } catch (mailErr) {
            console.error('Failed to dispatch rescheduled email:', mailErr);
        }
    }

    // 5. Notify Admins
    await notifyAdmins(
        'Ritual Rescheduled',
        `${updatedBooking.customer_name}'s reservation has been moved from ${oldDate} to ${newDate} at ${newTime}.`,
        'booking_new',
        { booking_id: updatedBooking.id }
    );

    return { success: true, booking: updatedBooking };
}

