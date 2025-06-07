"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  getAccessToken,
  searchStudent,
  getEvaluations,
  calculateEvaluationStats,
  type EvaluationStats,
  Evaluation,
  checkHallVoice,
  type HallVoiceSounds,
} from "@/lib/api";
import { EvaluationsCard } from "@/components/EvaluationsCard";
import { HallVoiceCard } from "@/components/HallVoiceCard";
import Link from "next/link";

export default function Home() {
  const [credentials, setCredentials] = useState({
    clientId: "",
    clientSecret: "",
  });
  const [login, setLogin] = useState("");
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [hasCredentials, setHasCredentials] = useState(false);
  const [isAuthenticating, setisAuthenticating] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<EvaluationStats | null>(null);
  const [evaluationsData, setEvaluationsData] = useState<Evaluation[]>([]);
  const [hallVoiceSounds, setHallVoiceSounds] =
    useState<HallVoiceSounds | null>(null);

  useEffect(() => {
    const storedCredentials = localStorage.getItem("credentials");
    const storedToken = localStorage.getItem("accessToken");
    if (storedCredentials && storedToken) {
      const parsed = JSON.parse(storedCredentials);
      setCredentials(parsed);
      setAccessToken(storedToken);
      if (storedToken) {
        setHasCredentials(true);
      } else {
        handleForgetCredentials();
      }
    }
  }, []);

  const handleForgetCredentials = () => {
    localStorage.removeItem("credentials");
    localStorage.removeItem("accessToken");
    setCredentials({ clientId: "", clientSecret: "" });
    setAccessToken(null);
    setHasCredentials(false);
    window.dispatchEvent(new Event("credentials-forgotten"));
    toast.success("Credentials forgotten");
  };

  const handleCredentialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setisAuthenticating(true);
    setError(null);

    try {
      const response = await getAccessToken(credentials);
      if (!response.access_token) {
        throw new Error("No access token received from authentication");
      }
      setAccessToken(response.access_token);
      localStorage.setItem("credentials", JSON.stringify(credentials));
      localStorage.setItem("accessToken", response.access_token);
      setHasCredentials(true);
      window.dispatchEvent(new Event("credentials-updated"));
      toast.success("Credentials validated successfully");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to validate credentials";
      setError(errorMessage);
      toast.error("Failed to validate credentials", {
        description: errorMessage,
      });
      handleForgetCredentials();
    } finally {
      setisAuthenticating(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken || !login) {
      toast.error(
        "Please enter a student login and ensure you have valid credentials"
      );
      return;
    }

    setIsLoadingStats(true);
    setError(null);
    setStats(null);
    setHallVoiceSounds(null);

    try {
      const [student, hallVoice] = await Promise.all([
        searchStudent(login, accessToken),
        checkHallVoice(login),
      ]);

      const evaluations = await getEvaluations(student.id, accessToken);
      const evaluationStats = calculateEvaluationStats(evaluations);

      setStats(evaluationStats);
      setEvaluationsData(evaluations);
      setHallVoiceSounds(hallVoice);

      toast.success("Data loaded successfully");
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to fetch evaluation data";
      setError(errorMessage);
      toast.error("Failed to fetch data", {
        description: errorMessage.replace(/'/g, "&apos;"),
      });
    } finally {
      setIsLoadingStats(false);
    }
  };

  return (
    <main className="flex-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3">
          {/* Left side - Credentials */}
          <div className="lg:col-span-1 lg:mr-6">
            <Card className="sticky top-8">
              <div className="relative">
                <Link
                  href="/about#how-it-works"
                  className="absolute -top-2 right-4 z-10"
                  title="How it works"
                >
                  <Badge
                    variant="outline"
                    className="h-6 w-6 p-0 flex items-center justify-center hover:bg-primary/10"
                  >
                    ?
                  </Badge>
                </Link>
                <CardHeader>
                  <CardTitle className="font-mono">API Credentials</CardTitle>
                  <CardDescription>
                    Enter your{" "}
                    <Link
                      href="https://profile.intra.42.fr/oauth/applications"
                      className="hover:underline text-foreground/90 font-mono"
                    >
                      42 API credentials
                    </Link>{" "}
                    to authenticate
                  </CardDescription>
                </CardHeader>
              </div>
              <CardContent>
                <form onSubmit={handleCredentialSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientId">client_id (UID)</Label>
                    <Input
                      id="clientId"
                      value={credentials.clientId}
                      onChange={(e) =>
                        setCredentials({
                          ...credentials,
                          clientId: e.target.value.toLowerCase().replace(/\s+/g, ''),
                        })
                      }
                      placeholder="Enter your client_id"
                      required
                      className="bg-background/50 backdrop-blur-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientSecret">client_secret (SECRET)</Label>
                    <Input
                      id="clientSecret"
                      type="password"
                      value={credentials.clientSecret}
                      onChange={(e) =>
                        setCredentials({
                          ...credentials,
                          clientSecret: e.target.value.toLowerCase().replace(/\s+/g, ''),
                        })
                      }
                      placeholder="Enter your client_secret"
                      required
                      className="bg-background/50 backdrop-blur-sm"
                    />
                  </div>
                  <div className="flex w-full gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={
                        hasCredentials ? handleForgetCredentials : undefined
                      }
                      className="flex-1"
                      disabled={!hasCredentials}
                    >
                      Forget
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={isAuthenticating}
                    >
                      {isAuthenticating ? "Authenticating..." : "Authenticate"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right side - Search and Results */}
          <div className="lg:col-span-2 space-y-4 lg:space-y-6 pt-4 lg:py-0">
            <Card>
              <CardHeader>
                <CardTitle className="font-mono">Data</CardTitle>
                <CardDescription>
                  Enter a login to load student&apos;s data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      id="login"
                      value={login}
                      onChange={(e) => setLogin(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                      placeholder="Enter student login"
                      required
                      className="bg-background/50 backdrop-blur-sm"
                    />
                  </div>
                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      disabled={
                        !hasCredentials ||
                        isAuthenticating ||
                        isLoadingStats ||
                        !login
                      }
                      className="w-full"
                    >
                      {isLoadingStats ? "Loading..." : "Load Statistics"}
                    </Button>
                  </div>
                </form>

                {error && (
                  <div className="mt-4 p-4 bg-red-50/80 backdrop-blur-sm text-red-700 rounded-md">
                    {error}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid gap-4 lg:gap-6 w-full max-w-full overflow-hidden">
              {stats && (
                <div className="w-full overflow-hidden">
                  <EvaluationsCard
                    stats={stats}
                    evaluationsData={evaluationsData}
                  />
                </div>
              )}
              {hallVoiceSounds && <HallVoiceCard sounds={hallVoiceSounds} />}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
