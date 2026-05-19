import { NextResponse } from 'next/server';
import { sendConsultationUpdateEmail } from '@/lib/actions/email';

export async function POST(request: Request) {
    try {
        const { email, name, type, stylistName } = await request.json();

        if (!email || !name || !type || !stylistName) {
            return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
        }

        console.log(`[Email Service] Triggering AI Consultation update notification via Resend to client: ${email}`);
        const result = await sendConsultationUpdateEmail(email, {
            name,
            type,
            stylistName
        });

        if (!result.success) {
            return NextResponse.json({ error: 'Failed to dispatch email' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error('[Consultation Email API Error]:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
