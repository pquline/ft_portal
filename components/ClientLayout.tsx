"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

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
      try {
        const response = await fetch("/api/auth/session");
        if (!response.ok && !pathname.startsWith("/auth")) {
          router.push("/auth");
        }
      } catch (error) {
        if (!pathname.startsWith("/auth")) {
          router.push("/auth");
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [pathname, router]);

  if (isLoading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-secondary-50 flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
