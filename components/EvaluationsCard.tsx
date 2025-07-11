import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, ArrowUpDown } from "lucide-react";
import { EvaluationQualityMetrics } from "@/components/EvaluationQualityMetrics";
import { EvaluationDetailsModal } from "@/components/EvaluationDetailsModal";
import { type EvaluationStats, type Evaluation } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface EvaluationsCardProps {
  stats: EvaluationStats;
  evaluationsData: Evaluation[];
}

type SortField = "project" | "total" | "ok" | "outstanding" | "ko";
type SortDirection = "asc" | "desc";

export function EvaluationsCard({
  stats,
  evaluationsData,
}: EvaluationsCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [sortField, setSortField] = useState<SortField>("total");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [selectedFlag, setSelectedFlag] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const colorPalette = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
    "hsl(var(--chart-6))",
  ];

  const totalFlags = Object.values(stats.flagStats).reduce(
    (acc, count) => acc + count,
    0
  );

  const getFlagColor = (flag: string) => {
    if (flag === "Ok") return "oklch(0.723 0.219 149.579)";
    if (flag === "Outstanding project") return "oklch(0.541 0.281 293.009)";
    return colorPalette[
      Object.keys(stats.flagStats).indexOf(flag) % colorPalette.length
    ];
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
    return sortDirection === "asc" ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  const handleFlagClick = (flag: string) => {
    setSelectedFlag(flag);
    setSelectedProject(null);
    setIsModalOpen(true);
  };

  const handleProjectClick = (project: string) => {
    setSelectedProject(project);
    setSelectedFlag(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFlag(null);
    setSelectedProject(null);
  };

  const sortProjects = (
    projects: [string, (typeof stats.projectStats)[string]][]
  ): [string, (typeof stats.projectStats)[string]][] => {
    return [...projects].sort((a, b) => {
      const [projectA, dataA] = a;
      const [projectB, dataB] = b;
      const multiplier = sortDirection === "asc" ? 1 : -1;

      switch (sortField) {
        case "project":
          return multiplier * projectA.localeCompare(projectB);
        case "total":
          return multiplier * (dataA.count - dataB.count);
        case "ok":
          return multiplier * (dataA.okCount - dataB.okCount);
        case "outstanding":
          return multiplier * (dataA.outstandingCount - dataB.outstandingCount);
        case "ko":
          const koA = dataA.count - dataA.okCount - dataA.outstandingCount;
          const koB = dataB.count - dataB.okCount - dataB.outstandingCount;
          return multiplier * (koA - koB);
        default:
          return 0;
      }
    });
  };

  return (
    <Card className="">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
        <div className="space-y-2">
          <CardTitle className="font-mono">Evaluations</CardTitle>
          <CardDescription>
            Detailed statistics about student evaluations as a corrector
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="dark:bg-background/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400 font-mono">
                  Total Evaluations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.totalEvaluations}
                </div>
              </CardContent>
            </Card>
            <Card className="dark:bg-background/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400 font-mono">
                  Total Feedbacks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalFeedback}</div>
              </CardContent>
            </Card>
            <Card className="dark:bg-background/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400 font-mono">
                  Average Rating
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.averageRating % 1 === 0
                    ? stats.averageRating.toFixed(0)
                    : stats.averageRating.toFixed(2)}
                  /5
                </div>
              </CardContent>
            </Card>
          </div>

          <EvaluationQualityMetrics evaluations={evaluationsData} />

          <Card className="flex flex-col dark:bg-background/30">
            <CardHeader className="items-center pb-0">
              <CardTitle className="font-mono">Flag Distribution</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(stats.flagStats).map(([flag, count]) => {
                  const flagColor = getFlagColor(flag);
                  return (
                    <Card
                      key={flag}
                      className="relative overflow-hidden dark:bg-background/30 cursor-pointer hover:bg-background/50 transition-colors"
                      onClick={() => handleFlagClick(flag)}
                    >
                      <div className="absolute inset-0 opacity-10" />
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{flag}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-baseline justify-between">
                          <div
                            className="text-2xl font-bold"
                            style={{ color: flagColor }}
                          >
                            {count}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {((count / totalFlags) * 100).toFixed(1)}%
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-background/30">
            <CardHeader className="pb-2">
              <CardTitle className="font-mono">Project Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader className="cursor-pointer hover:bg-secondary/10 dark:hover:bg-background/10">
                  <TableRow>
                    <TableHead
                      className="cursor-pointer hover:bg-secondary/30 dark:hover:bg-background/30"
                      onClick={() => handleSort("project")}
                    >
                      <div className="flex items-center gap-1">
                        Project {getSortIcon("project")}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-secondary/30 dark:hover:bg-background/30 w-24"
                      onClick={() => handleSort("total")}
                    >
                      <div className="flex items-center justify-end gap-1">
                        Total {getSortIcon("total")}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-secondary/30 dark:hover:bg-background/30 w-24"
                      onClick={() => handleSort("ok")}
                    >
                      <div className="flex items-center justify-end gap-1">
                        Ok {getSortIcon("ok")}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-secondary/30 dark:hover:bg-background/30 w-24"
                      onClick={() => handleSort("ko")}
                    >
                      <div className="flex items-center justify-end gap-1">
                        KO {getSortIcon("ko")}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-secondary/30 dark:hover:bg-background/30 w-32"
                      onClick={() => handleSort("outstanding")}
                    >
                      <div className="flex items-center justify-end gap-1">
                        Outstanding {getSortIcon("outstanding")}
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortProjects(Object.entries(stats.projectStats)).map(
                    ([project, data]) => (
                      <TableRow
                        key={project}
                        className="hover:bg-secondary/30 dark:hover:bg-background/30 cursor-pointer"
                        onClick={() => handleProjectClick(project)}
                      >
                        <TableCell className="font-medium">{project}</TableCell>
                        <TableCell className="text-right">{data.count}</TableCell>
                        <TableCell className="text-right">{data.okCount}</TableCell>
                        <TableCell className="text-right">{data.count - data.okCount - data.outstandingCount}</TableCell>
                        <TableCell className="text-right">{data.outstandingCount}</TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

                      {selectedFlag && (
              <EvaluationDetailsModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                evaluations={evaluationsData}
                range={`flag-${selectedFlag}`}
              />
            )}
            {selectedProject && (
              <EvaluationDetailsModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                evaluations={evaluationsData}
                range={`project-${selectedProject}`}
              />
            )}
        </CardContent>
      )}
    </Card>
  );
}
