import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendBookingConfirmation(email: string, booking: {
  serviceName: string;
  date: string;
  time: string;
  name: string;
}) {
  try {
    await resend.emails.send({
      from: 'The Hideaway Hair & Beauty Salon <bookings@thehideaway.ae>',
      to: email,
      subject: 'Booking Confirmed - The Hideaway Hair & Beauty Salon',
      html: `
        <!DOCTYPE html>
        <html>
        <body style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #C9A962; padding: 20px; text-align: center;">
            <h1 style="color: #1A1A1A; margin: 0;">Elegancia Salon</h1>
          </div>
          <div style="padding: 30px;">
            <h2 style="color: #1A1A1A;">Booking Confirmed!</h2>
            <p>Hi ${booking.name},</p>
            <p>Your appointment has been confirmed. Here are the details:</p>
            <div style="background: #FAF8F5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Service:</strong> ${booking.serviceName}</p>
              <p><strong>Date:</strong> ${booking.date}</p>
              <p><strong>Time:</strong> ${booking.time}</p>
            </div>
            <p>We look forward to seeing you!</p>
            <p>Best regards,<br>Elegancia Salon Team</p>
          </div>
        </body>
        </html>
      `
    });
    return { success: true };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error };
  }
}
