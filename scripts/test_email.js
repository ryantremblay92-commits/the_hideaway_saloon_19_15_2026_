const { Resend } = require('resend');

// Load environment variables manually if not loaded in terminal
const apiKey = process.env.RESEND_API_KEY || 're_eJaCR5f7_64V8ERyfM6GSzk3Au77EKWeR';
const resend = new Resend(apiKey);
const recipientEmail = 'varunvijay235@gmail.com';

async function runTest() {
    console.log(`[Resend Live CLI] Dispatching premium onboarding invitation to: ${recipientEmail}...`);
    try {
        const response = await resend.emails.send({
            from: 'The Hideaway Saloon <onboarding@resend.dev>',
            to: recipientEmail,
            subject: 'Sanctuary Integration Verification Test',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Welcome to the Sanctuary</title>
                </head>
                <body style="margin: 0; padding: 0; background-color: #0A0A0B; font-family: sans-serif; color: #FFFFFF;">
                  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #0F0F10; border: 1px solid rgba(201, 169, 98, 0.15); margin: 40px auto; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                    <tr>
                      <td align="center" style="background: linear-gradient(135deg, #161617 0%, #0A0A0B 100%); padding: 40px 20px; border-bottom: 1px solid rgba(201, 169, 98, 0.1);">
                        <div style="font-size: 24px; font-weight: 300; letter-spacing: 0.15em; color: #C9A962; text-transform: uppercase;">
                          THE HIDEAWAY
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 40px 40px 30px 40px;">
                        <h1 style="font-family: Georgia, serif; font-size: 26px; font-weight: normal; line-height: 36px; color: #FFFFFF; margin: 0 0 20px 0; text-align: center;">
                          Live Sanctuary Verification
                        </h1>
                        <p style="font-size: 15px; line-height: 24px; color: rgba(255, 255, 255, 0.6); margin: 0 0 30px 0; text-align: center;">
                          The transactional mailing pipeline has been successfully verified using the custom Jumeirah layout.
                        </p>
                      </td>
                    </tr>
                  </table>
                </body>
                </html>
            `
        });

        if (response.error) {
            console.error('\n❌ RESEND INTEGRATION FAILURE:');
            console.error('Error Details:', JSON.stringify(response.error, null, 2));
            console.error('=========================================\n');
        } else {
            console.log('\n=========================================');
            console.log('🎉 LIVE EMAIL DISPATCHED SUCCESSFULLY!');
            console.log('=========================================');
            console.log('Recipient:', recipientEmail);
            console.log('Response ID:', response.data.id);
            console.log('=========================================\n');
        }
    } catch (err) {
        console.error('\n❌ HTTP CONNECTION ERROR TO RESEND:', err);
    }
}

runTest();
