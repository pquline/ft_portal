import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Evaluation } from "@/lib/api";
import { projectMap } from "@/components/projectMap";

interface EvaluationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  evaluations: Evaluation[];
  range: string;
}

export function EvaluationDetailsModal({
  isOpen,
  onClose,
  evaluations,
  range,
}: EvaluationDetailsModalProps) {
  const getLengthRange = (length: number): string => {
    if (length <= 50) return "0-50";
    if (length <= 100) return "51-100";
    if (length <= 200) return "101-200";
    if (length <= 500) return "201-500";
    return "500+";
  };

  // Filtering logic
  let filteredEvaluations: Evaluation[] = [];
  if (range === "Writer's soul (180+)") {
    filteredEvaluations = evaluations.filter(
      (evaluation) => (evaluation.comment?.length || 0) >= 180
    );
  } else {
    filteredEvaluations = evaluations.filter(
      (evaluation) => getLengthRange(evaluation.comment?.length || 0) === range
    );
  }

  const getProjectName = (evaluation: Evaluation): string => {
    const gitlabPath = evaluation.team.project_gitlab_path;
    if (gitlabPath) {
      return gitlabPath.split('/').slice(-2).join('/');
    } else {
      const projectEntry = projectMap.find(p => p.id === evaluation.team.project_id);
      return projectEntry ? projectEntry.project_path : 'unknown_project';
    }
  };

  const getFlagColor = (flagName: string) => {
    if (flagName === "Ok") return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    if (flagName === "Outstanding project") return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 5) return "text-green-600 dark:text-green-400";
    if (rating >= 4) return "text-yellow-600 dark:text-yellow-400";
    if (rating >= 3) return "text-orange-600 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-mono">
            Evaluations - {range} ({filteredEvaluations.length} evaluations)
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {filteredEvaluations.map((evaluation) => (
            <Card key={evaluation.id} className="dark:bg-background/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                  {evaluation.correcteds?.map(c => c.login).join(" + ") || "unknown_user"} <span className="text-sm font-mono"> ({getProjectName(evaluation)})</span>
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className={getFlagColor(evaluation.flag?.name || "unknown_flag")}> {evaluation.flag?.name || "unknown_flag"} </Badge>
                    {evaluation.final_mark !== null && (
                      <Badge variant="outline" className="bg-background/50"> {evaluation.final_mark}/100 </Badge>
                    )}
                    {range === "Writer's soul (180+)" && evaluation.comment && evaluation.comment.length >= 180 && (
                      <Badge variant="outline" className="bg-yellow-200 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-200">Writer's soul (180+)</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {evaluation.comment && (
                  <div>
                    <h4 className="font-medium text-sm mb-1">Comment:</h4>
                    <p className="text-sm bg-background/50 p-3 rounded-md">
                      {evaluation.comment}
                    </p>
                  </div>
                )}
                {evaluation.feedbacks && evaluation.feedbacks.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm mb-2">Feedback:</h4>
                    <div className="space-y-2">
                      {evaluation.feedbacks.map((feedback) => (
                        <div
                          key={feedback.id}
                          className="flex items-center justify-between bg-background/30 p-2 rounded"
                        >
                          <span className="text-sm">
                            {feedback.user?.login || "unknown_user"}: "{feedback.comment || "N/A"}"
                          </span>
                          <span className={`text-sm font-medium ${getRatingColor(feedback.rating)}`}>
                            {feedback.rating}/5
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
