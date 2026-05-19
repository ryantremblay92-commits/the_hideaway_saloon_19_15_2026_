import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Helper to determine the "from" address (always use onboarding@resend.dev for unverified test accounts to ensure delivery)
const getFromAddress = () => {
  return 'The Hideaway Saloon <onboarding@resend.dev>';
};

/**
 * 1. Booking Confirmation Email Template
 */
export async function sendBookingConfirmation(email: string, booking: {
  serviceName: string;
  date: string;
  time: string;
  name: string;
}) {
  try {
    const from = getFromAddress();
    await resend.emails.send({
      from,
      to: email,
      subject: 'Reservation Confirmed – The Hideaway Saloon',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reservation Confirmed</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #0A0A0B; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #FFFFFF;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #0F0F10; border: 1px solid rgba(201, 169, 98, 0.15); margin: 40px auto; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
            <!-- Header Banner -->
            <tr>
              <td align="center" style="background: linear-gradient(135deg, #161617 0%, #0A0A0B 100%); padding: 40px 20px; border-bottom: 1px solid rgba(201, 169, 98, 0.1);">
                <div style="font-size: 24px; font-weight: 300; letter-spacing: 0.15em; color: #C9A962; text-transform: uppercase;">
                  THE HIDEAWAY
                </div>
                <div style="font-size: 10px; font-weight: 600; letter-spacing: 0.3em; color: rgba(255,255,255,0.4); text-transform: uppercase; margin-top: 5px;">
                  HAIR & BEAUTY SANCTUARY
                </div>
              </td>
            </tr>
            <!-- Content -->
            <tr>
              <td style="padding: 40px 40px 30px 40px;">
                <h1 style="font-family: 'Playfair Display', Georgia, serif; font-size: 26px; font-weight: normal; line-height: 36px; color: #FFFFFF; margin: 0 0 20px 0; text-align: center;">
                  Your Ritual is Scheduled
                </h1>
                <p style="font-size: 15px; line-height: 24px; color: rgba(255, 255, 255, 0.6); margin: 0 0 30px 0; text-align: center;">
                  Dear ${booking.name}, your upcoming reservation at The Hideaway is officially confirmed. Prepare to immerse yourself in absolute luxury.
                </p>
                <!-- Details Card -->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 16px; padding: 24px; margin-bottom: 30px;">
                  <tr>
                    <td style="padding-bottom: 12px;">
                      <span style="font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; color: #C9A962;">Ritual Service</span>
                      <div style="font-size: 16px; font-weight: bold; color: #FFFFFF; margin-top: 4px;">${booking.serviceName}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom: 12px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 12px;">
                      <span style="font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; color: #C9A962;">Date</span>
                      <div style="font-size: 16px; font-weight: 500; color: #FFFFFF; margin-top: 4px;">${booking.date}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="border-top: 1px solid rgba(255,255,255,0.05); padding-top: 12px;">
                      <span style="font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; color: #C9A962;">Time</span>
                      <div style="font-size: 16px; font-weight: 500; color: #FFFFFF; margin-top: 4px;">${booking.time}</div>
                    </td>
                  </tr>
                </table>
                <!-- CTA Button -->
                <table align="center" border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" style="background-color: #C9A962; border-radius: 12px;">
                      <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3002'}/dashboard" target="_blank" style="display: inline-block; font-size: 14px; font-weight: bold; color: #0A0A0B; text-decoration: none; padding: 16px 32px; letter-spacing: 0.1em; text-transform: uppercase;">
                        Manage Sanctuary Rituals
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td style="background-color: #0A0A0B; padding: 30px; text-align: center; border-top: 1px solid rgba(201, 169, 98, 0.1);">
                <p style="font-size: 12px; color: rgba(255,255,255,0.3); margin: 0 0 10px 0;">
                  La Plage, 403 Jumeirah Beach Road, Dubai, UAE
                </p>
                <p style="font-size: 11px; color: rgba(201, 169, 98, 0.4); margin: 0;">
                  © ${new Date().getFullYear()} The Hideaway Saloon. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
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

/**
 * 2. Welcome & Sanctuary Membership Onboarding Template
 */
export async function sendWelcomeEmail(email: string, details: {
  name: string;
}) {
  try {
    const from = getFromAddress();
    await resend.emails.send({
      from,
      to: email,
      subject: 'Welcome to the Sanctuary – The Hideaway Saloon',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to the Sanctuary</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #0A0A0B; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #FFFFFF;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #0F0F10; border: 1px solid rgba(201, 169, 98, 0.15); margin: 40px auto; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
            <!-- Header Banner -->
            <tr>
              <td align="center" style="background: linear-gradient(135deg, #161617 0%, #0A0A0B 100%); padding: 40px 20px; border-bottom: 1px solid rgba(201, 169, 98, 0.1);">
                <div style="font-size: 24px; font-weight: 300; letter-spacing: 0.15em; color: #C9A962; text-transform: uppercase;">
                  THE HIDEAWAY
                </div>
                <div style="font-size: 10px; font-weight: 600; letter-spacing: 0.3em; color: rgba(255,255,255,0.4); text-transform: uppercase; margin-top: 5px;">
                  HAIR & BEAUTY SANCTUARY
                </div>
              </td>
            </tr>
            <!-- Content -->
            <tr>
              <td style="padding: 40px 40px 30px 40px;">
                <h1 style="font-family: 'Playfair Display', Georgia, serif; font-size: 26px; font-weight: normal; line-height: 36px; color: #FFFFFF; margin: 0 0 20px 0; text-align: center;">
                  Welcome to Elite Membership
                </h1>
                <p style="font-size: 15px; line-height: 24px; color: rgba(255, 255, 255, 0.6); margin: 0 0 30px 0; text-align: center;">
                  Dear ${details.name}, thank you for registering with The Hideaway. As a registered member, you now hold the keys to Dubai's most exclusive wellness and beauty sanctuary.
                </p>
                <!-- Benefits -->
                <div style="margin-bottom: 30px;">
                  <h3 style="font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; color: #C9A962; margin-bottom: 15px;">Your Member Privileges Include:</h3>
                  <ul style="padding-left: 20px; color: rgba(255,255,255,0.6); font-size: 14px; line-height: 22px;">
                    <li style="margin-bottom: 10px;"><strong>AI Artisan Concierge:</strong> Directly receive custom hair, color, and makeup visualizations.</li>
                    <li style="margin-bottom: 10px;"><strong>Ritual History:</strong> Seamlessly review past bookings and perform instantaneous one-click re-bookings.</li>
                    <li style="margin-bottom: 10px;"><strong>Elite Priority:</strong> Enjoy early reservation access to high-fashion master stylists.</li>
                  </ul>
                </div>
                <!-- CTA Button -->
                <table align="center" border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" style="background-color: #C9A962; border-radius: 12px;">
                      <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3002'}/auth/login" target="_blank" style="display: inline-block; font-size: 14px; font-weight: bold; color: #0A0A0B; text-decoration: none; padding: 16px 32px; letter-spacing: 0.1em; text-transform: uppercase;">
                        Enter the Sanctuary
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td style="background-color: #0A0A0B; padding: 30px; text-align: center; border-top: 1px solid rgba(201, 169, 98, 0.1);">
                <p style="font-size: 12px; color: rgba(255,255,255,0.3); margin: 0 0 10px 0;">
                  La Plage, 403 Jumeirah Beach Road, Dubai, UAE
                </p>
                <p style="font-size: 11px; color: rgba(201, 169, 98, 0.4); margin: 0;">
                  © ${new Date().getFullYear()} The Hideaway Saloon. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    });
    return { success: true };
  } catch (error) {
    console.error('Welcome Email error:', error);
    return { success: false, error };
  }
}

/**
 * 3. AI Consultation Update Email Template
 */
export async function sendConsultationUpdateEmail(email: string, details: {
  name: string;
  type: 'hairstyle' | 'makeup' | 'color';
  stylistName: string;
}) {
  try {
    const from = getFromAddress();
    const typeLabel = details.type === 'hairstyle' ? 'Hairstyle Analysis' : details.type === 'makeup' ? 'Makeup Styling' : 'Seasonal Color Palette';
    await resend.emails.send({
      from,
      to: email,
      subject: `AI Styling Consultation Updated – ${typeLabel}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>AI Consultation Updated</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #0A0A0B; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #FFFFFF;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #0F0F10; border: 1px solid rgba(201, 169, 98, 0.15); margin: 40px auto; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
            <!-- Header Banner -->
            <tr>
              <td align="center" style="background: linear-gradient(135deg, #161617 0%, #0A0A0B 100%); padding: 40px 20px; border-bottom: 1px solid rgba(201, 169, 98, 0.1);">
                <div style="font-size: 24px; font-weight: 300; letter-spacing: 0.15em; color: #C9A962; text-transform: uppercase;">
                  THE HIDEAWAY
                </div>
                <div style="font-size: 10px; font-weight: 600; letter-spacing: 0.3em; color: rgba(255,255,255,0.4); text-transform: uppercase; margin-top: 5px;">
                  AI ARTISAN CONCIERGE
                </div>
              </td>
            </tr>
            <!-- Content -->
            <tr>
              <td style="padding: 40px 40px 30px 40px;">
                <h1 style="font-family: 'Playfair Display', Georgia, serif; font-size: 26px; font-weight: normal; line-height: 36px; color: #FFFFFF; margin: 0 0 20px 0; text-align: center;">
                  Styling Swatches Ready
                </h1>
                <p style="font-size: 15px; line-height: 24px; color: rgba(255, 255, 255, 0.6); margin: 0 0 30px 0; text-align: center;">
                  Hello ${details.name}, your master artisan ${details.stylistName} has updated your digital styling workspace and generated a brand-new **${typeLabel}** visualization.
                </p>
                <!-- Notice Box -->
                <div style="background-color: rgba(201, 169, 98, 0.05); border-left: 4px solid #C9A962; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                  <p style="margin: 0; font-size: 14px; line-height: 22px; color: rgba(255,255,255,0.8);">
                    "Your styling profile was processed with the flagship AI model using your custom hair color specifications. The interactive 3D visualizations and seasonal palette swatches are now available to view."
                  </p>
                </div>
                <!-- CTA Button -->
                <table align="center" border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" style="background-color: #C9A962; border-radius: 12px;">
                      <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3002'}/dashboard" target="_blank" style="display: inline-block; font-size: 14px; font-weight: bold; color: #0A0A0B; text-decoration: none; padding: 16px 32px; letter-spacing: 0.1em; text-transform: uppercase;">
                        View Visualizations
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td style="background-color: #0A0A0B; padding: 30px; text-align: center; border-top: 1px solid rgba(201, 169, 98, 0.1);">
                <p style="font-size: 12px; color: rgba(255,255,255,0.3); margin: 0 0 10px 0;">
                  La Plage, 403 Jumeirah Beach Road, Dubai, UAE
                </p>
                <p style="font-size: 11px; color: rgba(201, 169, 98, 0.4); margin: 0;">
                  © ${new Date().getFullYear()} The Hideaway Saloon. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    });
    return { success: true };
  } catch (error) {
    console.error('Consultation Email error:', error);
    return { success: false, error };
  }
}

/**
 * 4. Marketing & Ritual Promotion Email Template
 */
export async function sendMarketingPromotionEmail(email: string, details: {
  name: string;
  promoCode: string;
  discountPercentage: number;
}) {
  try {
    const from = getFromAddress();
    await resend.emails.send({
      from,
      to: email,
      subject: `Exclusive Ritual Offer – The Hideaway Sanctuary`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Exclusive Sanctuary Offer</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #0A0A0B; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #FFFFFF;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #0F0F10; border: 1px solid rgba(201, 169, 98, 0.15); margin: 40px auto; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
            <!-- Header Banner -->
            <tr>
              <td align="center" style="background: linear-gradient(135deg, #161617 0%, #0A0A0B 100%); padding: 40px 20px; border-bottom: 1px solid rgba(201, 169, 98, 0.1);">
                <div style="font-size: 24px; font-weight: 300; letter-spacing: 0.15em; color: #C9A962; text-transform: uppercase;">
                  THE HIDEAWAY
                </div>
                <div style="font-size: 10px; font-weight: 600; letter-spacing: 0.3em; color: rgba(255,255,255,0.4); text-transform: uppercase; margin-top: 5px;">
                  HAIR & BEAUTY SANCTUARY
                </div>
              </td>
            </tr>
            <!-- Content -->
            <tr>
              <td style="padding: 40px 40px 30px 40px;">
                <h1 style="font-family: 'Playfair Display', Georgia, serif; font-size: 26px; font-weight: normal; line-height: 36px; color: #FFFFFF; margin: 0 0 20px 0; text-align: center;">
                  An Invitation to Indulgence
                </h1>
                <p style="font-size: 15px; line-height: 24px; color: rgba(255, 255, 255, 0.6); margin: 0 0 30px 0; text-align: center;">
                  Dear ${details.name}, we invite you back to experience our state-of-the-art luxury styling and premium wellness sessions with a curated gift.
                </p>
                <!-- Promo Code Card -->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: rgba(201, 169, 98, 0.03); border: 2px dashed rgba(201, 169, 98, 0.25); border-radius: 16px; padding: 24px; text-align: center; margin-bottom: 30px;">
                  <tr>
                    <td>
                      <span style="font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.2em; color: #C9A962; display: block; margin-bottom: 8px;">Exclusive Sanctuary Invitation Code</span>
                      <div style="font-size: 32px; font-weight: bold; color: #FFFFFF; letter-spacing: 0.05em; margin-bottom: 6px;">${details.promoCode}</div>
                      <span style="font-size: 13px; color: rgba(255, 255, 255, 0.6); display: block;">Enjoy <strong>${details.discountPercentage}% off</strong> your next high-fashion treatment.</span>
                    </td>
                  </tr>
                </table>
                <!-- CTA Button -->
                <table align="center" border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" style="background-color: #C9A962; border-radius: 12px;">
                      <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3002'}/book" target="_blank" style="display: inline-block; font-size: 14px; font-weight: bold; color: #0A0A0B; text-decoration: none; padding: 16px 32px; letter-spacing: 0.1em; text-transform: uppercase;">
                        Redeem Ritual Code
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td style="background-color: #0A0A0B; padding: 30px; text-align: center; border-top: 1px solid rgba(201, 169, 98, 0.1);">
                <p style="font-size: 12px; color: rgba(255,255,255,0.3); margin: 0 0 10px 0;">
                  La Plage, 403 Jumeirah Beach Road, Dubai, UAE
                </p>
                <p style="font-size: 11px; color: rgba(201, 169, 98, 0.4); margin: 0;">
                  © ${new Date().getFullYear()} The Hideaway Saloon. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    });
    return { success: true };
  } catch (error) {
    console.error('Marketing Email error:', error);
    return { success: false, error };
  }
}
