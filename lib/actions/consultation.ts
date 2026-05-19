'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface Consultation {
    id: string;
    user_id: string;
    color_level: number;
    tone: string;
    selected_color_name: string;
    reference_images: string[];
    current_hair_images: string[];
    status: 'pending' | 'approved' | 'rejected' | 'completed';
    estimated_price?: number;
    sessions_required?: number;
    stylist_notes?: string;
    created_at: string;
    updated_at: string;
    profiles?: {
        full_name: string;
        email: string;
        avatar_url: string;
    };
}

export interface ConsultationMessage {
    id: string;
    consultation_id: string;
    sender_type: 'customer' | 'stylist';
    sender_id: string;
    text_content: string;
    image_url?: string;
    created_at: string;
}

export async function createConsultation(data: {
    color_level: number;
    tone: string;
    selected_color_name: string;
    reference_images: string[];
    current_hair_images: string[];
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: 'Unauthorized' };

    const { data: consultation, error } = await supabase
        .from('consultations')
        .insert({
            user_id: user.id,
            color_level: data.color_level,
            tone: data.tone,
            selected_color_name: data.selected_color_name,
            reference_images: data.reference_images,
            current_hair_images: data.current_hair_images,
            status: 'pending'
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating consultation:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/dashboard');
    return { success: true, consultation };
}

export async function getUserConsultations() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
        .from('consultations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching consultations:', error);
        return [];
    }

    return data as Consultation[];
}

export async function getAllConsultations() {
    const supabase = await createClient();

    // Debug: Check auth state on server
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    console.log('[getAllConsultations] Auth user:', user?.id, user?.email, 'Auth error:', authError?.message);

    const { data, error } = await supabase
        .from('consultations')
        .select(`
            *,
            profiles:user_id (
                full_name,
                email,
                avatar_url
            )
        `)
        .order('created_at', { ascending: false });

    console.log('[getAllConsultations] Query result:', data?.length, 'rows, Error:', error?.message);

    if (error) {
        console.error('Error fetching all consultations:', error);
        return [];
    }

    return data as Consultation[];
}

export async function getConsultationById(id: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('consultations')
        .select(`
            *,
            profiles:user_id (
                full_name,
                email,
                avatar_url
            )
        `)
        .eq('id', id)
        .single();

    if (error) {
        console.error('[getConsultationById] Error fetching consultation:', JSON.stringify(error, null, 2));
        return null;
    }

    return data as Consultation;
}

export async function updateConsultationStatus(
    id: string,
    status: 'approved' | 'rejected' | 'completed',
    details: {
        estimated_price?: number;
        sessions_required?: number;
        stylist_notes?: string;
    }
) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('consultations')
        .update({
            status,
            ...details
        })
        .eq('id', id);

    if (error) return { success: false, error: error.message };
    
    revalidatePath('/admin/consultations');
    revalidatePath(`/dashboard/consultations/${id}`);
    return { success: true };
}

export async function getConsultationMessages(consultationId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('consultation_messages')
        .select('*')
        .eq('consultation_id', consultationId)
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching messages:', error);
        return [];
    }

    return data as ConsultationMessage[];
}

export async function sendMessage(
    consultationId: string,
    textContent: string,
    imageUrl?: string
) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: 'Unauthorized' };

    // Determine sender type
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    const senderType = profile?.role === 'admin' ? 'stylist' : 'customer';

    const { data: message, error } = await supabase
        .from('consultation_messages')
        .insert({
            consultation_id: consultationId,
            sender_id: user.id,
            sender_type: senderType,
            text_content: textContent,
            image_url: imageUrl || null
        })
        .select()
        .single();

    if (error) return { success: false, error: error.message };

    revalidatePath(`/dashboard/consultations/${consultationId}`);
    revalidatePath(`/admin/consultations/${consultationId}`);
    return { success: true, message };
}
