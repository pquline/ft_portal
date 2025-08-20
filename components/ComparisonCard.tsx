import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp, Users, ArrowRight, Download } from "lucide-react";
import { type EvaluationStats, type StudentProfile } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ComparisonCardProps {
  onCompare: (login1: string, login2: string) => Promise<void>;
  isLoading: boolean;
  user1Data: {
    profile: StudentProfile | null;
    stats: EvaluationStats | null;
  } | null;
  user2Data: {
    profile: StudentProfile | null;
    stats: EvaluationStats | null;
  } | null;
}

export function ComparisonCard({
  onCompare,
  isLoading,
  user1Data,
  user2Data,
}: ComparisonCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [login1, setLogin1] = useState("");
  const [login2, setLogin2] = useState("");

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!login1.trim() || !login2.trim()) return;
    await onCompare(login1.trim(), login2.trim());
  };

  const getDifferenceColor = (value1: number, value2: number) => {
    if (value1 === value2) return "text-green-600";
    if (value1 > value2) return "text-blue-600";
    return "text-red-600";
  };

  const getDifferenceIcon = (value1: number, value2: number) => {
    if (value1 === value2) return "=";
    if (value1 > value2) return "↑";
    return "↓";
  };

  const formatValue = (value: number, decimals: number = 2) => {
    return value % 1 === 0 ? value.toFixed(0) : value.toFixed(decimals);
  };

  const exportComparison = () => {
    if (!user1Data?.stats || !user2Data?.stats) return;

    const csvContent = [
      "Metric,User 1,User 2,Difference",
      `Total Evaluations,${user1Data.stats.totalEvaluations},${user2Data.stats.totalEvaluations},${user1Data.stats.totalEvaluations - user2Data.stats.totalEvaluations}`,
      `Total Feedback,${user1Data.stats.totalFeedback},${user2Data.stats.totalFeedback},${user1Data.stats.totalFeedback - user2Data.stats.totalFeedback}`,
      `Average Rating,${formatValue(user1Data.stats.averageRating)},${formatValue(user2Data.stats.averageRating)},${formatValue(user1Data.stats.averageRating - user2Data.stats.averageRating)}`,
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `comparison-${login1}-${login2}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
        <div className="space-y-2">
          <CardTitle className="font-mono flex items-center gap-2">
            <Users className="h-5 w-5" />
            Profile Comparison
          </CardTitle>
          <CardDescription>
            Compare statistics between two students side by side
          </CardDescription>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-8 w-8"
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>
      {isExpanded && (
        <CardContent className="space-y-6">
          <form onSubmit={handleCompare} className="flex gap-4 items-end">
            <div className="flex-1">
              <label htmlFor="login1" className="text-sm font-medium mb-2 block">
                First Student Login
              </label>
              <Input
                id="login1"
                value={login1}
                onChange={(e) =>
                  setLogin1(e.target.value.toLowerCase().replace(/\s+/g, ""))
                }
                placeholder="Enter first student login"
                required
                className="bg-background/50 backdrop-blur-sm"
              />
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <label htmlFor="login2" className="text-sm font-medium mb-2 block">
                Second Student Login
              </label>
              <Input
                id="login2"
                value={login2}
                onChange={(e) =>
                  setLogin2(e.target.value.toLowerCase().replace(/\s+/g, ""))
                }
                placeholder="Enter second student login"
                required
                className="bg-background/50 backdrop-blur-sm"
              />
            </div>
            <Button type="submit" disabled={isLoading || !login1 || !login2}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                  Comparing...
                </div>
              ) : (
                "Compare"
              )}
            </Button>
          </form>

          {user1Data?.stats && user2Data?.stats && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Comparison Results</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportComparison}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export CSV
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* User 1 Column */}
                <Card className="dark:bg-background/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-mono">
                      {user1Data.profile?.login || login1}
                    </CardTitle>
                    <CardDescription>
                      {user1Data.profile?.first_name} {user1Data.profile?.last_name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Total Evaluations</span>
                        <span className="font-mono font-semibold">
                          {user1Data.stats.totalEvaluations}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Total Feedback</span>
                        <span className="font-mono font-semibold">
                          {user1Data.stats.totalFeedback}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Average Rating</span>
                        <span className="font-mono font-semibold">
                          {formatValue(user1Data.stats.averageRating)}/5
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* User 2 Column */}
                <Card className="dark:bg-background/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-mono">
                      {user2Data.profile?.login || login2}
                    </CardTitle>
                    <CardDescription>
                      {user2Data.profile?.first_name} {user2Data.profile?.last_name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Total Evaluations</span>
                        <span className="font-mono font-semibold">
                          {user2Data.stats.totalEvaluations}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Total Feedback</span>
                        <span className="font-mono font-semibold">
                          {user2Data.stats.totalFeedback}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Average Rating</span>
                        <span className="font-mono font-semibold">
                          {formatValue(user2Data.stats.averageRating)}/5
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Comparison Table */}
              <Card className="dark:bg-background/30">
                <CardHeader>
                  <CardTitle className="font-mono">Detailed Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Metric</TableHead>
                        <TableHead className="text-center">{user1Data.profile?.login || login1}</TableHead>
                        <TableHead className="text-center">{user2Data.profile?.login || login2}</TableHead>
                        <TableHead className="text-center">Difference</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Total Evaluations</TableCell>
                        <TableCell className="text-center font-mono">{user1Data.stats.totalEvaluations}</TableCell>
                        <TableCell className="text-center font-mono">{user2Data.stats.totalEvaluations}</TableCell>
                        <TableCell className={`text-center font-mono ${getDifferenceColor(user1Data.stats.totalEvaluations, user2Data.stats.totalEvaluations)}`}>
                          {getDifferenceIcon(user1Data.stats.totalEvaluations, user2Data.stats.totalEvaluations)} {Math.abs(user1Data.stats.totalEvaluations - user2Data.stats.totalEvaluations)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Total Feedback</TableCell>
                        <TableCell className="text-center font-mono">{user1Data.stats.totalFeedback}</TableCell>
                        <TableCell className="text-center font-mono">{user2Data.stats.totalFeedback}</TableCell>
                        <TableCell className={`text-center font-mono ${getDifferenceColor(user1Data.stats.totalFeedback, user2Data.stats.totalFeedback)}`}>
                          {getDifferenceIcon(user1Data.stats.totalFeedback, user2Data.stats.totalFeedback)} {Math.abs(user1Data.stats.totalFeedback - user2Data.stats.totalFeedback)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Average Rating</TableCell>
                        <TableCell className="text-center font-mono">{formatValue(user1Data.stats.averageRating)}/5</TableCell>
                        <TableCell className="text-center font-mono">{formatValue(user2Data.stats.averageRating)}/5</TableCell>
                        <TableCell className={`text-center font-mono ${getDifferenceColor(user1Data.stats.averageRating, user2Data.stats.averageRating)}`}>
                          {getDifferenceIcon(user1Data.stats.averageRating, user2Data.stats.averageRating)} {formatValue(Math.abs(user1Data.stats.averageRating - user2Data.stats.averageRating))}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
