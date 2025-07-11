"use client";

import { EvaluationsCard } from "@/components/EvaluationsCard";
import { HallVoiceCard } from "@/components/HallVoiceCard";
import { AcademicPerformanceCard } from "@/components/AcademicPerformanceCard";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Evaluation,
    calculateEvaluationStats,
    checkHallVoice,
    getEvaluations,
    searchStudent,
    calculateCPiscineExamStats,
    filterValidEvaluations,
    type EvaluationStats,
    type HallVoiceSounds,
    type CPiscineExamStats,
} from "@/lib/api";
import Head from "next/head";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const [login, setLogin] = useState("");
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<EvaluationStats | null>(null);
  const [evaluationsData, setEvaluationsData] = useState<Evaluation[]>([]);
  const [hallVoiceSounds, setHallVoiceSounds] =
    useState<HallVoiceSounds | null>(null);
  const [cPiscineStats, setCPiscineStats] = useState<CPiscineExamStats | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "ft_portal",
    "description": "A modern web application for visualizing student data from the 42 API. Search and analyze student evaluations, performance metrics, and hall voice data with an intuitive interface.",
    "url": "https://portal.pfischof.com",
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "author": {
      "@type": "Organization",
      "name": "ft_portal Team"
    },
    "featureList": [
      "Student data visualization",
      "Evaluation analytics",
      "Performance metrics",
      "Hall voice data analysis",
      "42 API integration"
    ]
  };

  useEffect(() => {
    const verifySession = async () => {
      // Set mock access token in development
      if (process.env.NODE_ENV !== 'production') {
        setAccessToken('dev_mock_token');
        return;
      }

      try {
        const response = await fetch("/api/auth/session");
        if (!response.ok) {
          throw new Error("Session verification failed");
        }
        const data = await response.json();
        if (data.accessToken) {
          setAccessToken(data.accessToken);
        }
      } catch {
        toast.error("Failed to verify session");
      }
    };

    verifySession();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!login.trim()) return;

    setIsLoadingStats(true);
    setError(null);
    setStats(null);
    setEvaluationsData([]);
    setHallVoiceSounds(null);
    setCPiscineStats(null);

    try {
      if (process.env.NODE_ENV !== 'production') {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      // In development mode, the API routes will return mock data
      const studentData = await searchStudent(login, accessToken || 'dev_mock_token');
      if (!studentData) {
        toast.error("Student not found");
        return;
      }
      const evaluations = await getEvaluations(studentData.id, accessToken || 'dev_mock_token');
      if (
        !evaluations ||
        !Array.isArray(evaluations) ||
        evaluations.length === 0
      ) {
        toast.error("No evaluations found for this student");
        return;
      }

      const validEvaluations = filterValidEvaluations(evaluations);
      if (validEvaluations.length === 0) {
        toast.error("No valid evaluations found for this student");
        return;
      }

      const stats = calculateEvaluationStats(evaluations);
      const hallVoice = await checkHallVoice(login);
      const cPiscineStats = calculateCPiscineExamStats(studentData);

      setStats(stats);
      setEvaluationsData(validEvaluations);
      setHallVoiceSounds(hallVoice);
      setCPiscineStats(cPiscineStats);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch data";

      if (errorMessage.includes("access token expired") || errorMessage.includes("401")) {
        document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        window.location.href = '/auth';
        return;
      }

      setError(errorMessage);
      toast.error("Failed to fetch data", {
        description: errorMessage,
      });
    } finally {
      setIsLoadingStats(false);
    }
  };

  return (
    <main className="flex-1">
      <Head>
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Head>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-mono">Search</CardTitle>
            <CardDescription>
              Enter a student login to view their data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-4">
              <Input
                id="login"
                value={login}
                onChange={(e) =>
                  setLogin(e.target.value.toLowerCase().replace(/\s+/g, ""))
                }
                placeholder="Enter student login"
                required
                className="bg-background/50 backdrop-blur-sm"
              />
              <Button type="submit" disabled={isLoadingStats || !login}>
                {isLoadingStats ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                    Loading...
                  </div>
                ) : (
                  "Load Data"
                )}
              </Button>
            </form>
            {error && (
              <div className="mt-4 p-4 bg-red-50/80 backdrop-blur-sm text-red-700 rounded-md">
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoadingStats && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
                <div className="text-center space-y-2">
                  <p className="text-lg font-medium text-foreground">
                    Loading student data...
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Fetching evaluations and statistics for {login}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {stats && evaluationsData.length > 0 && (
          <EvaluationsCard stats={stats} evaluationsData={evaluationsData} />
        )}
        {cPiscineStats && <AcademicPerformanceCard stats={cPiscineStats} />}
        {hallVoiceSounds && <HallVoiceCard sounds={hallVoiceSounds} />}
      </div>
    </main>
  );
}
