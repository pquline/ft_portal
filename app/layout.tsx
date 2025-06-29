import { Providers } from "@/components/Providers";
import type { Metadata, Viewport } from "next";
import { Fira_Code, Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: '--font-fira-code',
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#1d1731",
};

export const metadata: Metadata = {
  title: {
    default: "ft_portal",
    template: "%s | ft_portal"
  },
  description: "ft_portal is a modern web application for visualizing student data from the 42 API. Search and analyze student evaluations, performance metrics, and hall voice data with an intuitive interface.",
  keywords: [
    "42 school",
    "student portal",
    "evaluation data",
    "student analytics",
    "42 API",
    "coding school",
    "student performance",
    "data visualization",
    "educational technology"
  ],
  authors: [{ name: "ft_portal Team" }],
  creator: "ft_portal",
  publisher: "ft_portal",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://portal.pfischof.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://portal.pfischof.com',
    title: 'ft_portal - 42 Student Data Visualization Platform',
    description: 'Modern web application for visualizing student data from the 42 API. Search and analyze student evaluations, performance metrics, and hall voice data.',
    siteName: 'ft_portal',
    images: [
      {
        url: '/ft_portal.png',
        width: 1200,
        height: 630,
        alt: 'ft_portal - 42 Student Data Visualization Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ft_portal - 42 Student Data Visualization Platform',
    description: 'Modern web application for visualizing student data from the 42 API.',
    images: ['/ft_portal.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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
