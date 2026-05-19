'use server';

import { createClient } from '@/lib/supabase/server';
import { notifyAdmins } from './engagement';

// Get customer points
export async function getCustomerPoints(customerId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('customer_points')
        .select(`
      *,
      profiles:customer_id (
        id,
        full_name,
        email,
        avatar_url
      )
    `)
        .eq('customer_id', customerId)
        .single();

    if (error) {
        console.error('Error fetching customer points:', error);
        return null;
    }

    return data;
}

// Get all customers with points (admin view)
export async function getAllCustomerPoints() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('customer_points')
        .select(`
      *,
      profiles:customer_id (
        id,
        full_name,
        email,
        avatar_url,
        created_at
      )
    `)
        .order('available_points', { ascending: false });

    if (error) {
        console.error('Error fetching all customer points:', error);
        return [];
    }

    return data;
}

// Get points transactions for a customer
export async function getPointsTransactions(customerId: string, limit = 20) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('points_transactions')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching transactions:', error);
        return [];
    }

    return data;
}

// Get all points transactions (admin view)
export async function getAllPointsTransactions(limit = 100) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('points_transactions')
        .select(`
            id,
            points,
            transaction_type,
            description,
            created_at,
            profiles:customer_id (
                id,
                full_name,
                email
            )
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching all transactions:', error);
        return [];
    }

    return data;
}

// Add points to customer (called after booking completion)
export async function addPointsToCustomer(
    customerId: string,
    points: number,
    description: string,
    bookingId?: string
) {
    const supabase = await createClient();

    // Get loyalty program settings
    const { data: program } = await supabase
        .from('loyalty_programs')
        .select('*')
        .eq('is_active', true)
        .single();

    // Calculate bonus points based on tier
    const { data: customerPoints } = await supabase
        .from('customer_points')
        .select('tier')
        .eq('customer_id', customerId)
        .single();

    let bonusPercentage = 0;
    if (customerPoints?.tier) {
        const { data: tierBenefit } = await supabase
            .from('tier_benefits')
            .select('bonus_percentage')
            .eq('tier_name', customerPoints.tier)
            .single();
        bonusPercentage = tierBenefit?.bonus_percentage || 0;
    }

    // Apply tier bonus
    const totalPoints = Math.round(points * (1 + bonusPercentage / 100));

    // Call the database function
    const { data, error } = await supabase.rpc('add_loyalty_points', {
        p_customer_id: customerId,
        p_points: totalPoints,
        p_transaction_type: 'earn',
        p_description: description,
        p_booking_id: bookingId || null
    });

    if (error) {
        console.error('Error adding points:', error);
        return { success: false, error: error.message };
    }

    // Notify admins of significant point additions
    if (totalPoints >= 100) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', customerId)
            .single();

        await notifyAdmins(
            'Points Earned',
            `${profile?.full_name || 'A customer'} earned ${totalPoints} loyalty points!`,
            'points_earned',
            { customer_id: customerId, points: totalPoints }
        );
    }

    return { success: true, points: totalPoints };
}

// Redeem points for customer
export async function redeemPoints(
    customerId: string,
    points: number,
    description: string
) {
    const supabase = await createClient();

    // Check if customer has enough points
    const { data: currentPoints } = await supabase
        .from('customer_points')
        .select('available_points')
        .eq('customer_id', customerId)
        .single();

    if (!currentPoints || currentPoints.available_points < points) {
        return { success: false, error: 'Insufficient points' };
    }

    // Call the database function
    const { error } = await supabase.rpc('redeem_loyalty_points', {
        p_customer_id: customerId,
        p_points: points,
        p_description: description
    });

    if (error) {
        console.error('Error redeeming points:', error);
        return { success: false, error: error.message };
    }

    return { success: true };
}

// Manual points adjustment (admin only)
export async function adjustPoints(
    customerId: string,
    points: number,
    type: 'add' | 'subtract',
    reason: string
) {
    const supabase = await createClient();

    const transactionType = type === 'add' ? 'bonus' : 'redeem';
    const finalPoints = type === 'add' ? points : -points;

    const { error } = await supabase.rpc('add_loyalty_points', {
        p_customer_id: customerId,
        p_points: finalPoints,
        p_transaction_type: transactionType,
        p_description: reason,
        p_booking_id: null
    });

    if (error) {
        console.error('Error adjusting points:', error);
        return { success: false, error: error.message };
    }

    return { success: true };
}

// Get referral for a customer
export async function getCustomerReferral(customerId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_id', customerId)
        .single();

    if (error && error.code !== 'PGRST116') {
        console.error('Error fetching referral:', error);
        return null;
    }

    return data;
}

// Create referral code for customer
export async function createReferralCode(customerId: string) {
    const supabase = await createClient();

    // 1. Ensure customer_points record exists first
    const { data: pointsRecord, error: pointsError } = await supabase
        .from('customer_points')
        .select('id')
        .eq('customer_id', customerId)
        .single();

    if (pointsError && pointsError.code === 'PGRST116') { // Record not found
        console.log('Creating initial customer_points for', customerId);
        await supabase.from('customer_points').insert({
            customer_id: customerId,
            available_points: 0,
            total_points: 0,
            tier: 'bronze'
        });
    }

    // 2. Try to generate a code using the RPC
    let code: string | null = null;
    try {
        const { data: rpcCode, error: rpcError } = await supabase.rpc('generate_referral_code');
        if (!rpcError && rpcCode) {
            code = rpcCode;
        }
    } catch (e) {
        console.error('RPC Error:', e);
    }

    // 3. Fallback to simple random code if RPC failed
    if (!code) {
        code = 'HWY' + Math.random().toString(36).substring(2, 8).toUpperCase();
    }

    // 4. Insert the referral record
    const { error: insertError } = await supabase
        .from('referrals')
        .insert({
            referrer_id: customerId,
            referral_code: code,
            referrer_reward_points: 100,
            referee_reward_points: 50,
            status: 'pending'
        });

    if (insertError) {
        console.error('Error creating referral record:', insertError);
        // Double check if one was created while we were working (race condition)
        const { data: existing } = await supabase
            .from('referrals')
            .select('referral_code')
            .eq('referrer_id', customerId)
            .is('referee_id', null)
            .maybeSingle();

        if (existing) return { success: true, code: existing.referral_code };
        return { success: false, error: insertError.message };
    }

    return { success: true, code };
}

// Validate and use referral code
export async function useReferralCode(code: string, refereeId: string) {
    const supabase = await createClient();

    // Find the referral "template" by code
    const { data: referral, error: findError } = await supabase
        .from('referrals')
        .select('*')
        .eq('referral_code', code.toUpperCase())
        .is('referee_id', null) // Look for the original code record
        .single();

    if (findError || !referral) {
        return { success: false, error: 'Invalid or expired referral code' };
    }

    // Can't refer yourself
    if (referral.referrer_id === refereeId) {
        return { success: false, error: 'You cannot use your own referral code' };
    }

    // Check if referee already was referred
    const { data: existing } = await supabase
        .from('referrals')
        .select('id')
        .eq('referee_id', refereeId)
        .single();

    if (existing) {
        return { success: false, error: 'You have already used a referral code' };
    }

    // Complete the referral. We insert a NEW row for the conversion
    const { error: completeError } = await supabase
        .from('referrals')
        .insert({
            referrer_id: referral.referrer_id,
            referee_id: refereeId,
            referral_code: code.toUpperCase(),
            status: 'completed',
            completed_at: new Date().toISOString(),
            referrer_reward_points: referral.referrer_reward_points,
            referee_reward_points: referral.referee_reward_points
        });

    if (completeError) {
        console.error('Error completing referral:', completeError);
        return { success: false, error: completeError.message };
    }

    // Award points
    await Promise.all([
        addPointsToCustomer(referral.referrer_id, referral.referrer_reward_points, `Referral bonus - someone used your code`),
        addPointsToCustomer(refereeId, referral.referee_reward_points, `Welcome bonus from referral`)
    ]);

    // Check for "Referral Master" milestone (5 referrals)
    const count = await getReferralCount(referral.referrer_id);
    if (count >= 5) {
        const { error: upgradeError } = await supabase
            .from('customer_points')
            .update({ tier: 'black' })
            .eq('customer_id', referral.referrer_id);

        if (!upgradeError) {
            console.log(`User ${referral.referrer_id} promoted to BLACK TIER`);
        }
    }

    return { success: true, message: 'Referral applied! You earned bonus points.' };
}

export async function getReferralCount(userId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc('get_referral_count', { p_user_id: userId });
    return data || 0;
}

// Get all referrals (admin)
export async function getAllReferrals() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('referrals')
        .select(`
      *,
      referrer:profiles!referrals_referrer_id_fkey (
        id,
        full_name,
        email
      )
    `)
        .order('referred_at', { ascending: false });

    if (error) {
        console.error('Error fetching referrals:', error);
        return [];
    }

    return data;
}

// Get loyalty program settings
export async function getLoyaltySettings() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('loyalty_programs')
        .select('*')
        .eq('is_active', true)
        .single();

    if (error) {
        console.error('Error fetching loyalty settings:', error);
        return null;
    }

    return data;
}

// Update loyalty settings (admin)
export async function updateLoyaltySettings(settings: {
    points_per_rupee?: number;
    points_to_redeem?: number;
    rupee_value_per_point?: number;
    is_active?: boolean;
}) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('loyalty_programs')
        .update({
            ...settings,
            updated_at: new Date().toISOString()
        })
        .eq('is_active', true);

    if (error) {
        console.error('Error updating loyalty settings:', error);
        return { success: false, error: error.message };
    }

    return { success: true };
}

// Get tier benefits
export async function getTierBenefits() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('tier_benefits')
        .select('*')
        .order('min_points', { ascending: true });

    if (error) {
        console.error('Error fetching tier benefits:', error);
        return [];
    }

    return data;
}

// Get loyalty statistics (admin dashboard)
export async function getLoyaltyStats() {
    const supabase = await createClient();

    // Total points outstanding
    const { data: allPoints } = await supabase
        .from('customer_points')
        .select('available_points');
    const totalPointsOutstanding = allPoints?.reduce((sum, p) => sum + (p.available_points || 0), 0) || 0;

    // Total customers in program
    const { data: allCustomers } = await supabase
        .from('customer_points')
        .select('customer_id');
    const totalCustomers = allCustomers?.length || 0;

    // Tier distribution
    const { data: tierData } = await supabase
        .from('customer_points')
        .select('tier');
    const tierDistribution = tierData?.reduce((acc: Record<string, number>, item) => {
        const tier = item.tier || 'bronze';
        acc[tier] = (acc[tier] || 0) + 1;
        return acc;
    }, {}) || [];

    // This month's points earned
    const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
    const { data: earnedData } = await supabase
        .from('points_transactions')
        .select('points')
        .gte('created_at', monthStart)
        .eq('transaction_type', 'earn');
    const monthlyEarned = earnedData?.reduce((sum, item) => sum + (item.points || 0), 0) || 0;

    // This month's points redeemed
    const { data: redeemedData } = await supabase
        .from('points_transactions')
        .select('points')
        .gte('created_at', monthStart)
        .eq('transaction_type', 'redeem');
    const monthlyRedeemed = Math.abs(redeemedData?.reduce((sum, item) => sum + (item.points || 0), 0) || 0);

    // Total referrals
    const { data: referralsData } = await supabase
        .from('referrals')
        .select('id')
        .eq('status', 'completed');
    const totalReferrals = referralsData?.length || 0;

    // Top point earners
    const { data: topEarners } = await supabase
        .from('customer_points')
        .select(`
      available_points,
      lifetime_points,
      profiles:customer_id (
        full_name
      )
    `)
        .order('lifetime_points', { ascending: false })
        .limit(5);

    return {
        totalPointsOutstanding,
        totalCustomers,
        tierDistribution,
        monthlyEarned,
        monthlyRedeemed,
        totalReferrals,
        topEarners: topEarners || []
    };
}

/**
 * Birthday Ritual Reward Functions
 */

export async function getBirthdayOffer(userId: string) {
    const supabase = await createClient();
    const today = new Date();
    const month = today.getMonth() + 1; // 1-12

    // 1. Get user's birth month from profile
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('date_of_birth, full_name')
        .eq('id', userId)
        .single();

    if (profileError || !profile?.date_of_birth) return null;

    const birthDate = new Date(profile.date_of_birth);
    const birthMonth = birthDate.getMonth() + 1;

    // Is it their birthday month?
    if (birthMonth !== month) return null;

    // 2. Check if they already have an offer for THIS year/month
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();

    const { data: existing } = await supabase
        .from('birthday_offers')
        .select('*')
        .eq('user_id', userId)
        .gte('valid_from', startOfMonth)
        .single();

    if (existing) return existing;

    // 3. Create a new birthday offer if not exists
    const code = `BDAY${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const validFrom = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();
    const validUntil = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString(); // Last day of month

    const { data: newOffer, error: insertError } = await supabase
        .from('birthday_offers')
        .insert({
            user_id: userId,
            offer_code: code,
            discount_percent: 20, // Default 20%
            valid_from: validFrom,
            valid_until: validUntil,
        })
        .select()
        .single();

    if (insertError) {
        console.error('Error creating birthday offer:', insertError);
        return null;
    }

    return newOffer;
}

export async function updateDateOfBirth(userId: string, dob: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from('profiles')
        .update({ date_of_birth: dob })
        .eq('id', userId);

    return { success: !error, error: error?.message };
}
