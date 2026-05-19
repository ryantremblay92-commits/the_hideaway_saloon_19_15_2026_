'use server';

import { supabase } from '@/lib/supabase';

export async function submitContact(formData: {
    name: string;
    email?: string;
    phone?: string;
    message: string;
}) {
    const { data, error } = await supabase
        .from('contact_messages')
        .insert({
            name: formData.name,
            email: formData.email || null,
            phone: formData.phone || null,
            message: formData.message,
        })
        .select()
        .single();

    if (error) {
        console.error('Contact error:', error);
        return { success: false, error: error.message };
    }

    return { success: true, data };
}
