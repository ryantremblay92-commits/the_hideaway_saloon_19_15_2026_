'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

/**
 * Get all rituals assigned to a specific stylist/staff member
 */
export async function getStaffRituals(staffId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('stylist_id', staffId)
        .order('date', { ascending: true })
        .order('time', { ascending: true });

    if (error) {
        console.error('Error fetching staff rituals:', error);
        return [];
    }

    return data;
}

/**
 * Record a client interaction (notes, color codes, etc.)
 */
export async function addInteractionLog(payload: {
    customer_id: string;
    staff_id: string;
    booking_id: string;
    interaction_type: string;
    notes: string;
    metadata?: any;
}) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('client_interaction_logs')
        .insert([payload])
        .select()
        .single();

    if (error) {
        console.error('Error adding interaction log:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/(staff)/dashboard', 'page');
    return { success: true, data };
}

/**
 * Update compliance checklist for a booking
 */
export async function updateCompliance(payload: {
    booking_id: string;
    staff_id: string;
    checklist_items: any;
    compliance_status: 'pending' | 'completed' | 'flagged';
}) {
    const supabase = await createClient();

    // Check if record exists
    const { data: existing } = await supabase
        .from('service_compliance')
        .select('id')
        .eq('booking_id', payload.booking_id)
        .maybeSingle();

    let result;
    if (existing) {
        result = await supabase
            .from('service_compliance')
            .update({
                checklist_items: payload.checklist_items,
                compliance_status: payload.compliance_status,
                verified_at: payload.compliance_status === 'completed' ? new Date().toISOString() : null
            })
            .eq('id', existing.id);
    } else {
        result = await supabase
            .from('service_compliance')
            .insert([{
                ...payload,
                verified_at: payload.compliance_status === 'completed' ? new Date().toISOString() : null
            }]);
    }

    if (result.error) {
        console.error('Error updating compliance:', result.error);
        return { success: false, error: result.error.message };
    }

    revalidatePath('/(staff)/dashboard', 'page');
    return { success: true };
}

/**
 * Get business stats for a staff member
 */
export async function getStaffStats(staffId: string) {
    const supabase = await createClient();

    // Get staff profile for commission rate
    const { data: profile } = await supabase
        .from('staff_profiles')
        .select('commission_rate')
        .eq('id', staffId)
        .single();

    // Get completed bookings this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { data: bookings } = await supabase
        .from('bookings')
        .select('total_price')
        .eq('stylist_id', staffId)
        .eq('status', 'completed')
        .gte('date', startOfMonth.toISOString().split('T')[0]);

    const totalRevenue = bookings?.reduce((sum, b) => sum + (Number(b.total_price) || 0), 0) || 0;
    const commission = totalRevenue * (Number(profile?.commission_rate) || 0);

    // Get ritual count today
    const today = new Date().toISOString().split('T')[0];
    const { count: todayCount } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('stylist_id', staffId)
        .eq('date', today);

    return {
        revenue: totalRevenue,
        commission,
        todayRituals: todayCount || 0,
        commissionRate: profile?.commission_rate || 0
    };
}
