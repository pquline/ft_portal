"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
      const response = await fetch('/api/auth/login');
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="py-6">
      <Card className="w-[350px] mx-auto">
        <CardHeader>
          <CardTitle className="font-mono">Sign In</CardTitle>
          <CardDescription>
            Sign in with your 42 account to access <span className="font-mono">ft_portal</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            className="w-full"
            onClick={handleLogin}
          >
            Sign in
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
