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
import Link from "next/link";

const EXCLUDED_FEEDBACK_MESSAGES = new Set([
  "You failed to complete this feedback within the allocated time (this is very wrong), so we did it for you (do it next time)."
]);

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

  const getProjectName = (evaluation: Evaluation): string => {
    const gitlabPath = evaluation.team.project_gitlab_path;
    if (gitlabPath) {
      return gitlabPath.split('/').slice(-2).join('/');
    } else {
      const projectEntry = projectMap.find(p => p.id === evaluation.team.project_id);
      return projectEntry ? projectEntry.project_path : 'unknown_project';
    }
  };

  // Filtering logic
  let filteredEvaluations: Evaluation[] = [];

  if (range.startsWith("rating-")) {
    const targetRating = parseInt(range.replace("rating-", ""));
    filteredEvaluations = evaluations.filter(evaluation => {
      if (evaluation.feedbacks && evaluation.feedbacks.length > 0) {
        return evaluation.feedbacks.some(feedback => {
          if (EXCLUDED_FEEDBACK_MESSAGES.has(feedback.comment)) {
            return false;
          }
          return feedback.rating === targetRating;
        });
      }
      return false;
    });
  } else if (range.startsWith("flag-")) {
    const targetFlag = range.replace("flag-", "");
    filteredEvaluations = evaluations.filter(evaluation => {
      return evaluation.flag?.name === targetFlag;
    });
  } else if (range.startsWith("project-")) {
    const targetProject = range.replace("project-", "");
    filteredEvaluations = evaluations.filter(evaluation => {
      const projectName = getProjectName(evaluation);
      return projectName === targetProject;
    });
  } else if (range === "Writer's soul (180+)") {
    filteredEvaluations = evaluations.filter(
      (evaluation) => (evaluation.comment?.length || 0) >= 180
    );
  } else {
    filteredEvaluations = evaluations.filter(
      (evaluation) => getLengthRange(evaluation.comment?.length || 0) === range
    );
  }

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

  const getDisplayTitle = () => {
    if (range.startsWith("rating-")) {
      const rating = range.replace("rating-", "");
      return `Evaluations with ${rating}/5 Rating (${filteredEvaluations.length} evaluations)`;
    } else if (range.startsWith("flag-")) {
      const flag = range.replace("flag-", "");
      return `Evaluations with ${flag} Flag (${filteredEvaluations.length} evaluations)`;
    } else if (range.startsWith("project-")) {
      const project = range.replace("project-", "");
      return `Evaluations for ${project} (${filteredEvaluations.length} evaluations)`;
    } else if (range === "Writer's soul (180+)") {
      return `Writer's Soul Evaluations - 180+ Characters (${filteredEvaluations.length} evaluations)`;
    } else if (range === "0-50") {
      return `Short Evaluations - 0-50 Characters (${filteredEvaluations.length} evaluations)`;
    } else if (range === "51-100") {
      return `Brief Evaluations - 51-100 Characters (${filteredEvaluations.length} evaluations)`;
    } else if (range === "101-200") {
      return `Standard Evaluations - 101-200 Characters (${filteredEvaluations.length} evaluations)`;
    } else if (range === "201-500") {
      return `Detailed Evaluations - 201-500 Characters (${filteredEvaluations.length} evaluations)`;
    } else if (range === "500+") {
      return `Comprehensive Evaluations - 500+ Characters (${filteredEvaluations.length} evaluations)`;
    }
    return `Evaluations - ${range} (${filteredEvaluations.length} evaluations)`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-6xl max-h-[80vh] overflow-y-auto rounded-lg mx-auto">
        <DialogHeader>
          <DialogTitle className="font-mono">
            {getDisplayTitle()}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {filteredEvaluations.length === 0 ? (
            <div className="flex items-center justify-center py-4">
              <div className="text-center">
                <p>No evaluations found</p>
              </div>
            </div>
          ) : (
            filteredEvaluations.map((evaluation) => (
              <Card key={evaluation.id} className="dark:bg-background/30">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <CardTitle className="text-lg">
                      {evaluation.correcteds?.map((c, index) => (
                        <span key={c.login}>
                          <Link
                            href={`https://profile.intra.42.fr/users/${c.login}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono hover:underline"
                          >
                            {c.login}
                          </Link>
                          {index < evaluation.correcteds!.length - 1 && " + "}
                        </span>
                      )) || "unknown_user"} <span className="text-sm"> ({getProjectName(evaluation)})</span>
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(evaluation.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </CardTitle>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={getFlagColor(evaluation.flag?.name || "unknown_flag")}> {evaluation.flag?.name || "unknown_flag"} </Badge>
                      {evaluation.final_mark !== null && (
                        <Badge variant="outline" className="bg-background/50"> {evaluation.final_mark}/100 </Badge>
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
                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-background/50 p-2 rounded-md gap-1"
                          >
                            <span className="text-sm flex-1">
                              {feedback.comment || "N/A"}
                            </span>
                            <span className={`text-sm font-medium ${getRatingColor(feedback.rating)} shrink-0`}>
                              {feedback.rating}/5
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
