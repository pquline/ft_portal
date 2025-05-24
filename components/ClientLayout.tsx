"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hasCredentials, setHasCredentials] = useState(false);

  useEffect(() => {
    const checkCredentials = () => {
      const storedToken = localStorage.getItem("accessToken");
      setHasCredentials(!!storedToken);
    };

    checkCredentials();

    window.addEventListener('storage', checkCredentials);

    const handleForget = () => setHasCredentials(false);
    const handleUpdate = () => setHasCredentials(true);

    window.addEventListener('credentials-forgotten', handleForget);
    window.addEventListener('credentials-updated', handleUpdate);

    return () => {
      window.removeEventListener('storage', checkCredentials);
      window.removeEventListener('credentials-forgotten', handleForget);
      window.removeEventListener('credentials-updated', handleUpdate);
    };
  }, []);

  return (
    <div className="min-h-screen bg-secondary-50 flex flex-col">
      <Header hasCredentials={hasCredentials} />
      {children}
      <Footer />
    </div>
  );
}
