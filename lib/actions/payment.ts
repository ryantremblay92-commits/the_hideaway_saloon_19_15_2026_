'use server';

import { createClient } from '@/lib/supabase/server';

export async function uploadPaymentScreenshot(bookingId: string, screenshotUrl: string) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('bookings')
        .update({
            payment_screenshot: screenshotUrl,
            payment_status: 'paid'
        })
        .eq('id', bookingId)
        .select();

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true, data };
}

export async function updatePaymentStatus(
    bookingId: string,
    status: 'pending' | 'paid' | 'failed' | 'refunded',
    amount?: number,
    method?: string,
    reference?: string
) {
    const supabase = createClient();

    const updateData: Record<string, unknown> = {
        payment_status: status,
    };

    if (amount !== undefined) updateData.payment_amount = amount;
    if (method !== undefined) updateData.payment_method = method;
    if (reference !== undefined) updateData.payment_reference = reference;

    const { data, error } = await supabase
        .from('bookings')
        .update(updateData)
        .eq('id', bookingId)
        .select();

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true, data };
}

export async function getBookingByRef(ref: string) {
    const supabase = createClient();

    // Try to find by payment_reference first, then by created pattern
    const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .or(`payment_reference.eq.${ref},id.eq.${ref}`)
        .single();

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true, data };
}
