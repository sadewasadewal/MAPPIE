import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { Navigation } from "@/components/Navigation";
import { ClientModals } from "@/components/ClientModals";

export const metadata: Metadata = {
  title: "MAPPIE • Wayfinder Curated Destinations",
  description: "Ultra-minimal Apple-inspired discovery and navigation guide for boutique hotels, chef-driven restaurants, and cultural landmarks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AppProvider>
          <div className="app-container">
            <Navigation />
            <main style={{ flex: 1, position: "relative" }}>
              {children}
            </main>
            <ClientModals />
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
