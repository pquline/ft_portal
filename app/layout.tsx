import type { Metadata, Viewport } from "next";
import { Inter, Fira_Code } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { ClientLayout } from "@/components/ClientLayout";

import "./globals.css";

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
  title: "ft_stats",
  description: "View students statistics at 42",
  manifest: "/manifest.json",
  icons: {
    apple: "/pwa.png",
    icon: "/favicon.ico",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ft_stats",
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
        <meta name="apple-mobile-web-app-title" content="ft_stats" />
      </head>
      <body className={`${inter.className} ${firaCode.variable} bg-gradient-to-t from-primary/5 to-primary/10`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClientLayout>{children}</ClientLayout>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
