'use server';

import { createClient } from '@/lib/supabase/server';

export async function getThankYouNotes(userId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('thank_you_notes')
        .select(`
            *,
            sender:sender_id (
                full_name,
                avatar_url
            )
        `)
        .eq('recipient_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching thank you notes:', error);
        return [];
    }

    return data;
}

export async function sendThankYouNote(recipientId: string, message: string, bookingId?: string, noteType = 'thank_you') {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: 'Not authenticated' };

    const { data, error } = await supabase
        .from('thank_you_notes')
        .insert({
            sender_id: user.id,
            recipient_id: recipientId,
            message,
            booking_id: bookingId,
            note_type: noteType
        })
        .select()
        .single();

    if (error) {
        console.error('Error sending thank you note:', error);
        return { success: false, error: error.message };
    }

    return { success: true, data };
}

export async function markNoteAsRead(noteId: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('thank_you_notes')
        .update({ is_read: true })
        .eq('id', noteId);

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true };
}
