import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found - ft_portal",
  description: "The page you're looking for doesn't exist. Return to ft_portal to search and analyze student data from the 42 API.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold text-primary">404</CardTitle>
          <CardDescription className="text-xl">
            Page Not Found
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>
          <div className="space-y-2">
            <Button asChild className="w-full">
              <Link href="/">
                Return to Home
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/about">
                Learn More About ft_portal
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
