import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "ft_stats",
  description: "View students statistics at 42",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
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
