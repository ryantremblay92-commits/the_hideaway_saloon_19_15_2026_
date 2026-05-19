'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function setStylistsChoice(serviceId: string) {
    const supabase = await createClient();

    // 1. Reset all others
    await supabase
        .from('services')
        .update({ is_stylists_choice: false })
        .not('id', 'eq', serviceId);

    // 2. Set the new one
    const { data, error } = await supabase
        .from('services')
        .update({ is_stylists_choice: true })
        .eq('id', serviceId)
        .select()
        .single();

    if (error) {
        console.error('Error setting stylist choice:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/');
    revalidatePath('/services');
    return { success: true, data };
}

export async function getStylistsChoice() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_stylists_choice', true)
        .single();

    return data;
}
