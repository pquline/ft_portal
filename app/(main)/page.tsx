"use client";

import { AcademicPerformanceCard } from "@/components/AcademicPerformanceCard";
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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Evaluation,
    calculateCPiscineExamStats,
    calculateEvaluationStats,
    checkHallVoice,
    filterValidEvaluations,
    getEvaluations,
    searchStudent,
    type CPiscineExamStats,
    type EvaluationStats,
    type HallVoiceSounds,
    type StudentProfile,
} from "@/lib/api";
import { X } from "lucide-react";
import Head from "next/head";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const [login, setLogin] = useState("");
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [compareLogin, setCompareLogin] = useState("");
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [isLoadingComparison, setIsLoadingComparison] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<EvaluationStats | null>(null);
  const [evaluationsData, setEvaluationsData] = useState<Evaluation[]>([]);
  const [hallVoiceSounds, setHallVoiceSounds] =
    useState<HallVoiceSounds | null>(null);
  const [cPiscineStats, setCPiscineStats] = useState<CPiscineExamStats | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const [user1Data, setUser1Data] = useState<{
    profile: StudentProfile | null;
    stats: EvaluationStats | null;
  } | null>(null);
  const [user2Data, setUser2Data] = useState<{
    profile: StudentProfile | null;
    stats: EvaluationStats | null;
  } | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();

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

  const performSearch = useCallback(async (searchLogin: string) => {
    setIsLoadingStats(true);
    setError(null);
    setStats(null);
    setEvaluationsData([]);
    setHallVoiceSounds(null);
    setCPiscineStats(null);
    // Clear comparison state when performing new search
    setUser1Data(null);
    setUser2Data(null);
    setShowCompareModal(false);

    try {
      if (process.env.NODE_ENV !== 'production') {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      const studentData = await searchStudent(searchLogin, accessToken || 'dev_mock_token');
      if (!studentData) {
        toast.error("Student not found");
        setIsLoadingStats(false);
        return;
      }
      const evaluations = await getEvaluations(studentData.id, accessToken || 'dev_mock_token');
      if (
        !evaluations ||
        !Array.isArray(evaluations) ||
        evaluations.length === 0
      ) {
        toast.error("No evaluations found for this student");
        setIsLoadingStats(false);
        return;
      }

      const validEvaluations = filterValidEvaluations(evaluations);
      if (validEvaluations.length === 0) {
        toast.error("No valid evaluations found for this student");
        setIsLoadingStats(false);
        return;
      }

      const stats = calculateEvaluationStats(evaluations);
      const hallVoice = await checkHallVoice(searchLogin);
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
  }, [accessToken]);

  const performComparison = useCallback(async (login1: string, login2: string) => {
    setIsLoadingComparison(true);
    setError(null);
    setUser1Data(null);
    setUser2Data(null);

    try {
      if (process.env.NODE_ENV !== 'production') {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      // Fetch data for both users
      const [studentData1, studentData2] = await Promise.all([
        searchStudent(login1, accessToken || 'dev_mock_token'),
        searchStudent(login2, accessToken || 'dev_mock_token')
      ]);

      if (!studentData1 || !studentData2) {
        toast.error("One or both students not found");
        setIsLoadingComparison(false);
        return;
      }

      // Fetch evaluations for both users
      const [evaluations1, evaluations2] = await Promise.all([
        getEvaluations(studentData1.id, accessToken || 'dev_mock_token'),
        getEvaluations(studentData2.id, accessToken || 'dev_mock_token')
      ]);

      if (!evaluations1 || !evaluations2 || !Array.isArray(evaluations1) || !Array.isArray(evaluations2)) {
        toast.error("No evaluations found for one or both students");
        setIsLoadingComparison(false);
        return;
      }

      const validEvaluations1 = filterValidEvaluations(evaluations1);
      const validEvaluations2 = filterValidEvaluations(evaluations2);

      if (validEvaluations1.length === 0 || validEvaluations2.length === 0) {
        toast.error("No valid evaluations found for one or both students");
        setIsLoadingComparison(false);
        return;
      }

      const stats1 = calculateEvaluationStats(evaluations1);
      const stats2 = calculateEvaluationStats(evaluations2);

      setUser1Data({
        profile: studentData1,
        stats: stats1
      });
      setUser2Data({
        profile: studentData2,
        stats: stats2
      });

    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch comparison data";

      if (errorMessage.includes("access token expired") || errorMessage.includes("401")) {
        document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        window.location.href = '/auth';
        return;
      }

      setError(errorMessage);
      toast.error("Failed to fetch comparison data", {
        description: errorMessage,
      });
    } finally {
      setIsLoadingComparison(false);
    }
  }, [accessToken]);

  const handleCompareSubmit = async () => {
    if (!login.trim() || !compareLogin.trim()) return;
    await performComparison(login.trim(), compareLogin.trim());
    setShowCompareModal(false);
  };

  const startComparison = () => {
    setShowCompareModal(true);
    setCompareLogin("");
    // Clear any existing comparison data
    setUser1Data(null);
    setUser2Data(null);
  };



  useEffect(() => {
    const loginFromQuery = searchParams.get("login");
    if (loginFromQuery && loginFromQuery.trim() && accessToken) {
      const normalizedQueryLogin = loginFromQuery.toLowerCase();
      if (login !== normalizedQueryLogin) {
        setLogin(normalizedQueryLogin);
        performSearch(normalizedQueryLogin);
      }
    }
  }, [searchParams, accessToken, performSearch]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!login.trim()) return;

    const url = new URL(window.location.href);
    url.searchParams.set('login', login);
    router.push(url.pathname + url.search, { scroll: false });

    await performSearch(login);
  };

  return (
    <main className="flex-1">
      <Head>
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Head>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-mono">Student Data Search</CardTitle>
            <CardDescription>
              Enter a student login to view comprehensive evaluation and performance data, or compare with another student
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex gap-4">
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
              </div>

            </form>

            {error && (
              <div className="mt-4 p-4 bg-red-50/80 backdrop-blur-sm text-red-700 rounded-md">
                {error}
              </div>
            )}

            {/* Comparison Modal */}
            {showCompareModal && (
              <>
              <div className="mt-4 p-4 border rounded-lg bg-white dark:bg-background/30 border-foreground/10 dark:border-foreground/20">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold font-mono">Compare with another user</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCompareModal(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex gap-4">
                  <Input
                    value={compareLogin}
                    onChange={(e) =>
                      setCompareLogin(e.target.value.toLowerCase().replace(/\s+/g, ""))
                    }
                    placeholder="Enter student login to compare with"
                    className="bg-background/50 backdrop-blur-sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleCompareSubmit();
                      }
                    }}
                  />
                  <Button
                    variant="outline"
                    onClick={handleCompareSubmit}
                    disabled={isLoadingComparison || !compareLogin.trim()}
                  >
                    {isLoadingComparison ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                        Loading...
                      </div>
                    ) : (
                      "Compare"
                    )}
                  </Button>
                  </div>
                </div>
              </>
            )}

            {/* Comparison Results */}
            {user1Data?.stats && user2Data?.stats && (
              <div className="mt-6 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Comparison Results</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setUser1Data(null);
                      setUser2Data(null);
                      setShowCompareModal(false);
                    }}
                    className="flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Close Comparison
                  </Button>
                </div>

                {/* User Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="dark:bg-background/30">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-mono">
                        {user1Data.profile?.login || login}
                      </CardTitle>
                      <CardDescription>
                        {user1Data.profile?.first_name} {user1Data.profile?.last_name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-primary">
                        {user1Data.stats.totalEvaluations}
                      </div>
                      <div className="text-sm text-muted-foreground">evaluations completed</div>
                    </CardContent>
                  </Card>

                  <Card className="dark:bg-background/30">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-mono">
                        {user2Data.profile?.login || compareLogin}
                      </CardTitle>
                      <CardDescription>
                        {user2Data.profile?.first_name} {user2Data.profile?.last_name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-primary">
                        {user2Data.stats.totalEvaluations}
                      </div>
                      <div className="text-sm text-muted-foreground">evaluations completed</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Flag Distribution Comparison */}
                <Card className="dark:bg-background/30">
                  <CardHeader>
                    <CardTitle className="font-mono">Evaluation Flag Distribution</CardTitle>
                    <CardDescription>
                      Compare how each user distributes evaluation outcomes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {[user1Data, user2Data].map((userData, index) => {
                        const totalFlags = Object.values(userData.stats.flagStats).reduce((acc, count) => acc + count, 0);
                        const username = userData.profile?.login || (index === 0 ? login : compareLogin);

                        return (
                          <div key={index} className="space-y-4">
                            <h4 className="font-semibold font-mono text-center">{username}</h4>
                            <div className="grid grid-cols-1 gap-3">
                              {Object.entries(userData.stats.flagStats).map(([flag, count]) => {
                                const percentage = totalFlags > 0 ? (count / totalFlags * 100) : 0;
                                const flagColor = flag === "Ok" ? "oklch(0.723 0.219 149.579)" :
                                                 flag === "Outstanding project" ? "oklch(0.541 0.281 293.009)" :
                                                 "hsl(var(--chart-1))";

                                return (
                                  <div key={flag} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                                    <div className="flex items-center gap-2">
                                      <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: flagColor }}
                                      />
                                      <span className="text-sm font-medium">{flag}</span>
                                    </div>
                                    <div className="text-right">
                                      <div className="font-bold">{count}</div>
                                      <div className="text-xs text-muted-foreground">{percentage.toFixed(1)}%</div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Project Expertise Comparison */}
                <Card className="dark:bg-background/30">
                  <CardHeader>
                    <CardTitle className="font-mono">Project Expertise Comparison</CardTitle>
                    <CardDescription>
                      Compare average evaluation performance across different projects
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {(() => {
                        // Get common projects between both users
                        const user1Projects = Object.keys(user1Data.stats.projectStats);
                        const user2Projects = Object.keys(user2Data.stats.projectStats);
                        const commonProjects = user1Projects.filter(project => user2Projects.includes(project));

                        // Sort by total evaluations (most evaluated projects first)
                        const sortedProjects = commonProjects
                          .map(project => ({
                            name: project,
                            user1: user1Data.stats.projectStats[project],
                            user2: user2Data.stats.projectStats[project],
                            totalEvals: (user1Data.stats.projectStats[project]?.count || 0) + (user2Data.stats.projectStats[project]?.count || 0)
                          }))
                          .filter(p => p.totalEvals > 0)
                          .sort((a, b) => b.totalEvals - a.totalEvals)
                          .slice(0, 8); // Show top 8 projects

                        if (sortedProjects.length === 0) {
                          return <div className="text-center text-muted-foreground py-8">No common projects found</div>;
                        }

                        return (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Project</TableHead>
                                <TableHead className="text-center">{user1Data.profile?.login || login}</TableHead>
                                <TableHead className="text-center">{user2Data.profile?.login || compareLogin}</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {sortedProjects.map((project) => {
                                const user1Outstanding = project.user1.outstandingCount || 0;
                                const user1Total = project.user1.count || 0;
                                const user2Outstanding = project.user2.outstandingCount || 0;
                                const user2Total = project.user2.count || 0;

                                const user1OutstandingRate = user1Total > 0 ? (user1Outstanding / user1Total * 100) : 0;
                                const user2OutstandingRate = user2Total > 0 ? (user2Outstanding / user2Total * 100) : 0;

                                return (
                                  <TableRow key={project.name}>
                                    <TableCell className="font-medium">
                                      {project.name}
                                    </TableCell>
                                    <TableCell className="text-center">
                                      <div className="space-y-1">
                                        <div className="font-mono text-sm">{user1Outstanding}/{user1Total}</div>
                                        <div className="text-xs text-muted-foreground">
                                          {user1OutstandingRate.toFixed(0)}% outstanding
                                        </div>
                                      </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                      <div className="space-y-1">
                                        <div className="font-mono text-sm">{user2Outstanding}/{user2Total}</div>
                                        <div className="text-xs text-muted-foreground">
                                          {user2OutstandingRate.toFixed(0)}% outstanding
                                        </div>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        );
                      })()}
                    </div>
                  </CardContent>
                </Card>

                {/* Evaluation Quality Summary */}
                <Card className="dark:bg-background/30">
                  <CardHeader>
                    <CardTitle className="font-mono">Evaluation Quality Summary</CardTitle>
                    <CardDescription>
                      Overall evaluation performance and feedback quality
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold font-mono text-center">{user1Data.profile?.login || login}</h4>
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold text-primary">
                              {user1Data.stats.averageRating ? user1Data.stats.averageRating.toFixed(1) : 'N/A'}
                            </div>
                            <div className="text-sm text-muted-foreground">avg rating received</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-primary">
                              {user1Data.stats.totalFeedback}
                            </div>
                            <div className="text-sm text-muted-foreground">feedback sessions</div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold font-mono text-center">{user2Data.profile?.login || compareLogin}</h4>
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold text-primary">
                              {user2Data.stats.averageRating ? user2Data.stats.averageRating.toFixed(1) : 'N/A'}
                            </div>
                            <div className="text-sm text-muted-foreground">avg rating received</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-primary">
                              {user2Data.stats.totalFeedback}
                            </div>
                            <div className="text-sm text-muted-foreground">feedback sessions</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Single User Results - only show when not in comparison mode */}
        {!user1Data && !user2Data && (
          <>
            {stats && evaluationsData.length > 0 && (
              <EvaluationsCard
                stats={stats}
                evaluationsData={evaluationsData}
                onStartComparison={startComparison}
              />
            )}
            {cPiscineStats && <AcademicPerformanceCard stats={cPiscineStats} />}
            {hallVoiceSounds && <HallVoiceCard sounds={hallVoiceSounds} />}
          </>
        )}
      </div>
    </main>
  );
}
