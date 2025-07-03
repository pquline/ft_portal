"use client";

import { Footer } from "@/components/Footer";
import Header from "@/components/Header";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (process.env.NODE_ENV !== 'production') {
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/auth/session");
        if (!response.ok && !pathname.startsWith("/auth")) {
          router.push("/auth");
        }
      } catch (error) {
        if (!pathname.startsWith("/auth")) {
          router.push("/auth");
          if (error instanceof Error) {
            toast.error(error.message || "Authentication failed");
          } else {
            toast.error("Failed to authenticate. Please try again.");
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Loading application...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50 flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
