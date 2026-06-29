import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | QR Menu",
    default: "QR Menu — Digital Restaurant Menus",
  },
  description: "Scan, browse, and enjoy — beautiful digital menus for modern restaurants.",
  applicationName: "QR Menu",
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-dvh bg-background font-sans text-foreground">{children}</body>
    </html>
  );
}
