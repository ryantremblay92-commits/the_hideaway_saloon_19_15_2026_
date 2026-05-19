import { NextResponse } from 'next/server';
import { sendMarketingPromotionEmail } from '@/lib/actions/email';

export async function POST(request: Request) {
    try {
        const { email, name, promoCode, discountPercentage } = await request.json();

        if (!email || !name || !promoCode || !discountPercentage) {
            return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
        }

        console.log(`[Email Service] Triggering custom ritual marketing invitation via Resend to: ${email}`);
        const result = await sendMarketingPromotionEmail(email, {
            name,
            promoCode,
            discountPercentage
        });

        if (!result.success) {
            return NextResponse.json({ error: 'Failed to dispatch promotional email via Resend' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error('[Promo Email API Error]:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
