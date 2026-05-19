import { NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/actions/email';

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Please enter a valid recipient email address' }, { status: 400 });
        }

        console.log(`[Email Verification API] Sending luxury test email to: ${email}`);
        const result = await sendWelcomeEmail(email, { name: 'Vanguard Guest' });

        if (!result.success) {
            return NextResponse.json({ error: 'Failed to send test email via Resend' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error('[Email Verification API Error]:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
