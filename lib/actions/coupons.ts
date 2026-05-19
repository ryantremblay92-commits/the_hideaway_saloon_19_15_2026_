'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface Coupon {
    id: string;
    code: string;
    description: string;
    discount_type: 'percentage' | 'fixed';
    discount_value: number;
    min_order_value: number;
    max_uses: number | null;
    uses_count: number;
    valid_from: string;
    valid_until: string | null;
    is_active: boolean;
    applicable_services: string[] | null; // null = all services
    created_at: string;
}

export interface CouponValidationResult {
    valid: boolean;
    coupon?: Coupon;
    discount_amount?: number;
    message: string;
}

/**
 * Validate a coupon code against a booking
 */
export async function validateCoupon(
    code: string,
    serviceSlug: string,
    orderValue: number
): Promise<CouponValidationResult> {
    const supabase = await createClient();

    const { data: coupon, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', code.trim().toUpperCase())
        .eq('is_active', true)
        .single();

    if (error || !coupon) {
        return { valid: false, message: 'Invalid or expired coupon code.' };
    }

    // Check validity dates
    const now = new Date();
    if (coupon.valid_from && new Date(coupon.valid_from) > now) {
        return { valid: false, message: 'This coupon is not yet active.' };
    }
    if (coupon.valid_until && new Date(coupon.valid_until) < now) {
        return { valid: false, message: 'This coupon has expired.' };
    }

    // Check max uses
    if (coupon.max_uses !== null && coupon.uses_count >= coupon.max_uses) {
        return { valid: false, message: 'This coupon has reached its usage limit.' };
    }

    // Check min order value
    if (orderValue < coupon.min_order_value) {
        return {
            valid: false,
            message: `Minimum order value of AED ${coupon.min_order_value} required.`
        };
    }

    // Check service applicability
    if (coupon.applicable_services && coupon.applicable_services.length > 0) {
        if (!coupon.applicable_services.includes(serviceSlug)) {
            return { valid: false, message: 'This coupon is not valid for the selected service.' };
        }
    }

    // Calculate discount
    let discount_amount = 0;
    if (coupon.discount_type === 'percentage') {
        discount_amount = Math.round((orderValue * coupon.discount_value) / 100);
    } else {
        discount_amount = Math.min(coupon.discount_value, orderValue);
    }

    return {
        valid: true,
        coupon,
        discount_amount,
        message: `Coupon applied! You save AED ${discount_amount}.`
    };
}

/**
 * Increment the use count for a coupon (called after successful booking)
 */
export async function applyCouponToBooking(couponCode: string, bookingId: string) {
    const supabase = await createClient();

    // Increment usage count
    const { error } = await supabase.rpc('increment_coupon_use', {
        p_code: couponCode.toUpperCase(),
        p_booking_id: bookingId
    });

    if (error) {
        // Fallback: manual increment
        const { data: coupon } = await supabase
            .from('coupons')
            .select('id, uses_count')
            .eq('code', couponCode.toUpperCase())
            .single();

        if (coupon) {
            await supabase
                .from('coupons')
                .update({ uses_count: (coupon.uses_count || 0) + 1 })
                .eq('id', coupon.id);
        }
    }

    return { success: true };
}

/**
 * Get all coupons (admin)
 */
export async function getAllCoupons(): Promise<Coupon[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching coupons:', error);
        return [];
    }

    return data || [];
}

/**
 * Create a new coupon (admin)
 */
export async function createCoupon(coupon: {
    code: string;
    description: string;
    discount_type: 'percentage' | 'fixed';
    discount_value: number;
    min_order_value?: number;
    max_uses?: number | null;
    valid_from?: string;
    valid_until?: string | null;
    applicable_services?: string[] | null;
}) {
    const supabase = await createClient();

    const { error } = await supabase.from('coupons').insert({
        code: coupon.code.trim().toUpperCase(),
        description: coupon.description,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
        min_order_value: coupon.min_order_value || 0,
        max_uses: coupon.max_uses || null,
        uses_count: 0,
        valid_from: coupon.valid_from || new Date().toISOString(),
        valid_until: coupon.valid_until || null,
        applicable_services: coupon.applicable_services || null,
        is_active: true,
    });

    if (error) {
        console.error('Error creating coupon:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/loyalty');
    return { success: true };
}

/**
 * Toggle coupon active status (admin)
 */
export async function toggleCouponStatus(id: string, currentStatus: boolean) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('coupons')
        .update({ is_active: !currentStatus })
        .eq('id', id);

    if (error) return { success: false, error: error.message };
    revalidatePath('/admin/loyalty');
    return { success: true };
}

/**
 * Delete a coupon (admin)
 */
export async function deleteCoupon(id: string) {
    const supabase = await createClient();

    const { error } = await supabase.from('coupons').delete().eq('id', id);

    if (error) return { success: false, error: error.message };
    revalidatePath('/admin/loyalty');
    return { success: true };
}
