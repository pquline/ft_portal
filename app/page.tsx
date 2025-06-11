"use client";

import { EvaluationsCard } from "@/components/EvaluationsCard";
import { HallVoiceCard } from "@/components/HallVoiceCard";
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
	type EvaluationStats,
	type HallVoiceSounds,
} from "@/lib/api";
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
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const verifySession = async () => {
      try {
        const response = await fetch("/api/auth/session");
        if (!response.ok) {
          throw new Error("Session verification failed");
        }
        const data = await response.json();
        if (data.accessToken) {
          setAccessToken(data.accessToken);
        }
      } catch (error) {
        toast.error("Failed to verify session");
      }
    };

    verifySession();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) {
      toast.error("Not authenticated");
      return;
    }

    setIsLoadingStats(true);
    setError(null);
    setStats(null);
    setEvaluationsData([]);
    setHallVoiceSounds(null);

    try {
      const studentData = await searchStudent(login, accessToken);
      if (!studentData) {
        toast.error("Student not found");
        return;
      }
      const evaluations = await getEvaluations(studentData.id, accessToken);
      if (
        !evaluations ||
        !Array.isArray(evaluations) ||
        evaluations.length === 0
      ) {
        toast.error("No evaluations found for this student");
        return;
      }
      const stats = calculateEvaluationStats(evaluations);
      const hallVoice = await checkHallVoice(login);

      setStats(stats);
      setEvaluationsData(evaluations);
      setHallVoiceSounds(hallVoice);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch data";
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
                {isLoadingStats ? "Loading..." : "Load Data"}
              </Button>
            </form>
            {error && (
              <div className="mt-4 p-4 bg-red-50/80 backdrop-blur-sm text-red-700 rounded-md">
                {error}
              </div>
            )}
          </CardContent>
        </Card>
        {stats && evaluationsData.length > 0 && (
          <EvaluationsCard stats={stats} evaluationsData={evaluationsData} />
        )}
        {hallVoiceSounds && <HallVoiceCard sounds={hallVoiceSounds} />}
      </div>
    </main>
  );
}
