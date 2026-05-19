// UPI Payment Configuration
// Configure your UPI payment details here

export const paymentConfig = {
    // UPI Payment Details
    upi: {
        // Your UPI ID (e.g., salonname@upi)
        id: 'elegancia@oksbi',

        // Business name to show on payment
        businessName: 'Elegancia Unisex Salon',

        // Payment note
        note: 'Salon Booking Payment',
    },

    // QR Code Configuration
    qrCode: {
        // Size in pixels
        size: 200,

        // QR Code color
        color: '#C9A962', // Primary gold color
    },

    // Payment Options
    options: {
        // Show QR code on booking confirmation
        showQRCode: true,

        // Allow advance payment (percentage)
        advancePaymentPercent: 50,

        // Minimum advance amount in rupees
        minAdvanceAmount: 100,
    }
};

// Generate UPI payment link
export function generateUPILink(amount: number, bookingRef: string): string {
    const { upi } = paymentConfig;
    const note = `${upi.note} - Ref: ${bookingRef}`;

    // UPI payment link format
    const upiLink = `upi://pay?pa=${upi.id}&pn=${encodeURIComponent(upi.businessName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;

    return upiLink;
}

// Generate UPI deep link for different apps
export function generateUPIDeepLinks(amount: number, bookingRef: string): Record<string, string> {
    const { upi } = paymentConfig;
    const note = `${upi.note} - Ref: ${bookingRef}`;

    return {
        // PhonePe
        phonepe: `phonepe://pay?pa=${upi.id}&pn=${encodeURIComponent(upi.businessName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`,

        // Paytm
        paytm: `https://p-ytm.com/${upi.id}?amount=${amount}&product=${encodeURIComponent(upi.businessName)}&txn=${bookingRef}`,

        // Google Pay
        gpay: `https://pay.google.com/gp/p/ui/pay?pa=${upi.id}&pn=${encodeURIComponent(upi.businessName)}&am=${amount}&cu=INR&ref=${bookingRef}`,

        // Generic UPI (works with most apps)
        generic: `upi://pay?pa=${upi.id}&pn=${encodeURIComponent(upi.businessName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`,
    };
}
