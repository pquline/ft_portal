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
    if (length >= 180) return "Writer's soul (180+)";
    if (length <= 50) return "0-50";
    if (length <= 100) return "51-100";
    if (length <= 200) return "101-200";
    if (length <= 500) return "201-500";
    return "500+";
  };

  const filteredEvaluations = evaluations.filter(
    (evaluation) => getLengthRange(evaluation.comment?.length || 0) === range
  );

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
    return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-green-600 dark:text-green-400";
    if (rating >= 3) return "text-yellow-600 dark:text-yellow-400";
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
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {getProjectName(evaluation)}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className={getFlagColor(evaluation.flag?.name || "Unknown")}>
                      {evaluation.flag?.name || "Unknown"}
                    </Badge>
                    {evaluation.final_mark !== null && (
                      <Badge variant="outline" className="bg-background/50">
                        {evaluation.final_mark}/100
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Evaluated: {evaluation.correcteds?.map(c => c.login).join(", ") || "Unknown"}
                </div>
                {evaluation.final_mark !== null && (
                  <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-green-800 dark:text-green-200">Final Rating:</span>
                      <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {evaluation.final_mark}/100
                      </span>
                    </div>
                  </div>
                )}
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
                {evaluation.feedback && (
                  <div>
                    <h4 className="font-medium text-sm mb-1">Feedback:</h4>
                    <p className="text-sm bg-background/50 p-3 rounded-md">
                      {evaluation.feedback}
                    </p>
                  </div>
                )}
                {evaluation.feedbacks && evaluation.feedbacks.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm mb-2">Student Ratings:</h4>
                    <div className="space-y-2">
                      {evaluation.feedbacks.map((feedback) => (
                        <div
                          key={feedback.id}
                          className="flex items-center justify-between bg-background/30 p-2 rounded"
                        >
                          <span className="text-sm">
                            {feedback.user?.login || "Unknown"}: "{feedback.comment || "No comment"}"
                          </span>
                          <span className={`text-sm font-medium ${getRatingColor(feedback.rating)}`}>
                            {feedback.rating}★
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
