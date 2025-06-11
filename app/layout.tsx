import type { Metadata, Viewport } from "next";
import { Inter, Fira_Code } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });
const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: '--font-fira-code',
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#1d1731",
};

export const metadata: Metadata = {
  title: "ft_portal",
  description: "View students data at 42",
  manifest: "/manifest.json",
  icons: {
    apple: "/pwa.png",
    icon: "/favicon.ico",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ft_portal",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1d1731" />
        <link rel="apple-touch-icon" href="/pwa.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ft_portal" />
      </head>
      <body className={`${inter.className} ${firaCode.variable} bg-background dark:bg-gradient-to-t dark:from-primary/5 dark:to-primary/10`}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
