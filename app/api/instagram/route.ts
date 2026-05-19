import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const dataPath = path.join(process.cwd(), 'data', 'instagram_posts_v2.json');
        
        if (!fs.existsSync(dataPath)) {
            return NextResponse.json({
                data: [],
                caption: "Latest posts from @thehideawaydubai",
                error: 'Data file not found'
            });
        }

        const rawData = fs.readFileSync(dataPath, 'utf8');
        const posts = JSON.parse(rawData);

        // Transform the data to match the expected format for the frontend
        const transformedPosts = posts.map((post: any, index: number) => ({
            id: `local_${index}`,
            caption: post.caption || '',
            media_url: post.local_image_url || post.media_url,
            permalink: post.post_url || `https://www.instagram.com/thehideawaydubai/`,
            media_type: 'IMAGE',
            timestamp: new Date().toISOString()
        }));

        return NextResponse.json({
            data: transformedPosts,
            caption: "Latest posts from @thehideawaydubai"
        });
    } catch (error) {
        console.error('Error in Instagram API:', error);
        return NextResponse.json({
            data: [],
            caption: "Latest posts from @thehideawaydubai",
            error: 'Failed to fetch posts'
        });
    }
}
