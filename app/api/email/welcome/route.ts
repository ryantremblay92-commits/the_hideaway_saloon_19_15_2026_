import { NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/actions/email';

export async function POST(request: Request) {
    try {
        const { email, name } = await request.json();

        if (!email || !name) {
            return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
        }

        console.log(`[Email Service] Triggering welcome onboarding email via Resend to: ${email}`);
        const result = await sendWelcomeEmail(email, { name });

        if (!result.success) {
            return NextResponse.json({ error: 'Failed to dispatch welcome email via Resend' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error('[Welcome Email API Error]:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
