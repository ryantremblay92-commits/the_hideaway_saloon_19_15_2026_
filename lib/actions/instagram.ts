'use server';

import { createClient } from '@/lib/supabase/server';
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary';
import { revalidatePath } from 'next/cache';

export async function addInstagramPost(formData: FormData) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: 'Unauthorized' };

    const file = formData.get('file') as File;
    const caption = formData.get('caption') as string;
    const postUrl = formData.get('post_url') as string;
    const type = formData.get('type') as string;

    if (!file) return { success: false, error: 'No file provided' };

    try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const fileUri = `data:${file.type};base64,${buffer.toString('base64')}`;

        // Upload to Cloudinary with 'instagram' folder
        const uploadResult = await uploadToCloudinary(fileUri, 'instagram');

        const { data, error } = await supabase
            .from('instagram_posts')
            .insert({
                caption,
                image_url: uploadResult.secure_url,
                post_url: postUrl,
                type: type || 'image',
                is_featured: false,
            })
            .select()
            .single();

        if (error) throw error;

        revalidatePath('/');
        revalidatePath('/admin/content');

        return { success: true, data };
    } catch (err: any) {
        console.error('Instagram post upload error:', err);
        return { success: false, error: err.message };
    }
}

export async function updateInstagramPost(id: string, updates: {
    caption?: string;
    post_url?: string;
    type?: string;
    is_featured?: boolean;
}) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: 'Unauthorized' };

    try {
        const { error } = await supabase
            .from('instagram_posts')
            .update(updates)
            .eq('id', id);

        if (error) throw error;

        revalidatePath('/');
        revalidatePath('/admin/content');

        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

export async function deleteInstagramPost(id: string, imageUrl: string) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: 'Unauthorized' };

    try {
        // Try to extract public_id from Cloudinary URL and delete
        if (imageUrl && imageUrl.includes('cloudinary.com')) {
            try {
                const urlParts = imageUrl.split('/upload/');
                if (urlParts.length > 1) {
                    const publicId = 'instagram/' + urlParts[1].split('.')[0];
                    await deleteFromCloudinary(publicId);
                }
            } catch (e) {
                console.log('Could not delete from Cloudinary:', e);
            }
        }

        // Delete from database
        const { error } = await supabase.from('instagram_posts').delete().eq('id', id);

        if (error) throw error;

        revalidatePath('/');
        revalidatePath('/admin/content');

        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

export async function getInstagramPosts() {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('instagram_posts')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching Instagram posts:', error);
        return { success: false, error: error.message, data: [] };
    }

    return { success: true, data: data || [] };
}

export async function toggleInstagramFeatured(id: string, currentStatus: boolean) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: 'Unauthorized' };

    try {
        const { error } = await supabase
            .from('instagram_posts')
            .update({ is_featured: !currentStatus })
            .eq('id', id);

        if (error) throw error;

        revalidatePath('/');
        revalidatePath('/admin/content');

        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}
