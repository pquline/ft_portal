"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Logoimg from "@/public/ft_portal.png";

export default function SignIn() {
  const router = useRouter();

  useEffect(() => {
    const userCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("user="));

    if (userCookie) {
      router.push("/");
    }
  }, [router]);

  const handleLogin = async () => {
    try {
      const response = await fetch("/api/auth/login");
      if (!response.ok) {
        throw new Error("Failed to initiate login");
      }
      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Login error:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 flex flex-col items-center justify-between">
      <main className="flex-1 w-full flex items-center justify-center">
        <div className="w-full max-w-sm p-8">
          {/* Logo and Title */}
          <div className="flex justify-center items-center space-x-4 mb-8">
            <Link
              href="/"
              className="flex items-center space-x-4 hover:opacity-80 transition-opacity"
            >
              <Image
                src={Logoimg}
                alt="ft_portal Logo"
                width={40}
                height={40}
                priority
              />
              <p className="text-2xl font-bold text-foreground font-mono">
                ft_portal
              </p>
            </Link>
          </div>

          {/* Login Button */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              className="p-6 rounded-lg border text-card-foreground shadow bg-white dark:bg-secondary dark:hover:bg-primary border-foreground/10 group"
              onClick={handleLogin}
              type="button"
            >
              <div className="flex items-center justify-center space-x-4">
                <span className="text-lg">Sign in with</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 57 40"
                  height="48"
                  className="transition-all group:fill-black dark:fill-white dark:group-hover:fill-white"
                  aria-hidden="true"
                >
                  <path d="M31.627.205H21.084L0 21.097v8.457h21.084V40h10.543V21.097H10.542L31.627.205M35.349 10.233 45.58 0H35.35v10.233M56.744 10.542V0H46.512v10.542L36.279 21.085v10.543h10.233V21.085l10.232-10.543M56.744 21.395 46.512 31.628h10.232V21.395"></path>
                </svg>
              </div>
            </Button>
          </div>
        </div>
      </main>
      <footer className="w-full py-6 bg-white dark:bg-secondary/50 backdrop-blur-sm border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-foreground/70 font-mono">
          <div>
            <span className="text-primary">$&#62; </span>./made
            {" "}with{" "}
            <span className="text-red-500">&lt;3</span>
            <span> on </span>
            <Link
              href="https://github.com/pquline/ft_portal"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:underline"
            >
              GitHub
            </Link>
            <span className="text-yellow-400 animate-pulse"> █</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
