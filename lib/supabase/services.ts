import { createClient } from "./client";

export interface DBService {
    id: string;
    slug: string;
    title: string;
    category: string;
    icon: string;
    short_desc: string;
    long_desc: string;
    sub_services: string[];
    image_url: string;
    starting_price: number;
    duration: string;
    tag?: string;
    is_active: boolean;
    is_stylists_choice: boolean;
    created_at: string;
}

export const getServices = async (category?: string) => {
    const supabase = createClient();
    let query = supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true })
        .order('starting_price', { ascending: true });

    if (category && category !== 'all') {
        query = query.eq('category', category);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as DBService[];
};

export const getServiceBySlug = async (slug: string) => {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

    if (error) throw error;
    return data as DBService;
};

export const getCategories = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('services')
        .select('category')
        .eq('is_active', true);

    if (error) throw error;

    const categories = Array.from(new Set(data.map(item => item.category)));
    return categories;
};
