'use server';

import { createClient } from '@/lib/supabase/server';
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary';
import { revalidatePath } from 'next/cache';

export async function uploadGalleryPhoto(formData: FormData) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: 'Unauthorized' };

    const file = formData.get('file') as File;
    const category = formData.get('category') as string;
    const title = formData.get('title') as string;

    if (!file) return { success: false, error: 'No file provided' };

    try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const fileUri = `data:${file.type};base64,${buffer.toString('base64')}`;

        const uploadResult = await uploadToCloudinary(fileUri, 'gallery');

        const { data, error } = await supabase
            .from('gallery')
            .insert({
                title,
                image_url: uploadResult.secure_url,
                public_id: uploadResult.public_id,
                category,
            })
            .select()
            .single();

        if (error) throw error;

        revalidatePath('/gallery');
        revalidatePath('/admin/dashboard');

        return { success: true, data };
    } catch (err: any) {
        console.error('Gallery upload error:', err);
        return { success: false, error: err.message };
    }
}

export async function deleteGalleryPhoto(id: string, publicId: string) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: 'Unauthorized' };

    try {
        await deleteFromCloudinary(publicId);
        const { error } = await supabase.from('gallery').delete().eq('id', id);

        if (error) throw error;

        revalidatePath('/gallery');
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

export async function updateService(id: string, updates: any) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: 'Unauthorized' };

    try {
        const { error } = await supabase
            .from('services')
            .update(updates)
            .eq('id', id);

        if (error) throw error;

        revalidatePath('/services');
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}
