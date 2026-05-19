import type { Metadata, Viewport } from "next";
import { Inter, Fraunces, Orbitron } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppFAB from "@/components/ui/WhatsAppFAB";
import FloatingBookingBar from "@/components/ui/FloatingBookingBar";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
});

export const metadata: Metadata = {
  title: "The Hideaway Hair & Beauty Salon | Dubai",
  description: "The Hideaway – Hair & Beauty Salon in Jumeirah, Dubai. A Hair Spa Sanctuary specializing in effortless chic color and future-proof hair health. Cosy and elegant boutique experience.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "The Hideaway",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${fraunces.variable} ${orbitron.variable} font-inter antialiased bg-background text-foreground bg-luxury-gradient`}
      >
        <div className="noise-overlay" />
        <Navbar />
        <main className="min-h-screen pt-20">
          {children}
        </main>
        <Footer />
        <WhatsAppFAB />
        <FloatingBookingBar />
        <Toaster position="top-right" richColors theme="dark" />
      </body>
    </html>
  );
}
