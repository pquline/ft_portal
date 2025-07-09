"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, TrendingUp, Award, Calendar, CheckCircle, XCircle } from "lucide-react";
import { type CPiscineExamStats } from "@/lib/api";

interface AcademicPerformanceCardProps {
  stats: CPiscineExamStats;
}

export function AcademicPerformanceCard({ stats }: AcademicPerformanceCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const getValidationColor = (validated: boolean) => {
    return validated ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400";
  };

  const getValidationIcon = (validated: boolean) => {
    return validated ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
        <div className="space-y-2">
          <CardTitle className="font-mono flex items-center gap-2">
            Academic Performance
          </CardTitle>
          <CardDescription>
            Student performance across different academic assessments and evaluations
          </CardDescription>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-8 w-8"
          aria-label={isExpanded ? "Collapse Academic Performance" : "Expand Academic Performance"}
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
          {/* C Piscine Exams Card */}
          <Card className="dark:bg-background/30">
            <CardHeader>
              <CardTitle className="font-mono text-lg">C Piscine Exams</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="dark:bg-background/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400 font-mono flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Average Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stats.averageScore.toFixed(1)}/100
                    </div>
                  </CardContent>
                </Card>
                <Card className="dark:bg-background/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400 font-mono flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      Passed Exams
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stats.passedExams}/{stats.totalExams}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stats.totalExams > 0 ? `${((stats.passedExams / stats.totalExams) * 100).toFixed(0)}% success rate` : "No exams"}
                    </div>
                  </CardContent>
                </Card>
                <Card className="dark:bg-background/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400 font-mono flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Total Exams
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stats.totalExams}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      C Piscine exams completed
                    </div>
                  </CardContent>
                </Card>
              </div>

              {stats.exams.length > 0 && (
                <Card className="dark:bg-background/50">
                  <CardHeader>
                    <CardTitle className="font-mono">Exam Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {stats.exams.map((exam, index) => (
                        <Card key={index} className="dark:bg-background/70">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">
                              {exam.name.replace("C Piscine ", "")}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-baseline justify-between">
                              <div className="text-2xl font-bold">
                                {exam.mark}/100
                              </div>
                              <div className={`flex items-center gap-1 text-sm ${getValidationColor(exam.validated)}`}>
                                {getValidationIcon(exam.validated)}
                                {exam.validated ? "Passed" : "Failed"}
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {new Date(exam.date).toLocaleDateString()}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {stats.exams.length === 0 && (
                <Card className="dark:bg-background/50">
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <div className="text-muted-foreground mb-2">
                        📚 No C Piscine exam data available
                      </div>
                      <p className="text-sm text-muted-foreground">
                        This student hasn&apos;t completed any C Piscine exams yet.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>

        </CardContent>
      )}
    </Card>
  );
}
