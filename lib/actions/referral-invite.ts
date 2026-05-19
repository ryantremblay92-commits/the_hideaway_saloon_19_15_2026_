import { createClient } from '@/lib/supabase/server';

export async function getInvitationData(referralCode: string, serviceSlug?: string) {
    const supabase = await createClient();

    // 1. Fetch referral and referrer info
    const { data: referral, error: referralError } = await supabase
        .from('referrals')
        .select(`
            *,
            referrer:profiles!referrals_referrer_id_fkey (
                full_name,
                email
            )
        `)
        .eq('referral_code', referralCode.toUpperCase())
        .is('referee_id', null)
        .single();

    if (referralError || !referral) {
        console.error('Referral lookup failed:', referralError || 'No referral found');
        return { success: false, error: 'Invite link is invalid or has expired.' };
    }

    // 2. Get the specific service (default to stylists choice or first service if not found)
    const slugToFetch = serviceSlug || 'haircuts-styling';
    const { data: service, error: serviceError } = await supabase
        .from('services')
        .select('*')
        .eq('slug', slugToFetch)
        .eq('is_active', true)
        .single();

    if (serviceError) {
        console.warn('Service lookup failed, finding fallback:', serviceError);
    }

    return {
        success: true,
        referrerName: referral.referrer?.full_name || 'A Friend',
        service: service || null,
        referralCode: referral.referral_code
    };
}
