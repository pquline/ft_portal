import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Evaluation } from "@/lib/api";
import { Progress } from "@/components/ui/progress";

const EXCLUDED_FEEDBACK_MESSAGES = new Set([
  "You failed to complete this feedback within the allocated time (this is very wrong), so we did it for you (do it next time)."
]);

interface EvaluationQualityMetricsProps {
  evaluations: Evaluation[];
}

export function EvaluationQualityMetrics({ evaluations }: EvaluationQualityMetricsProps) {
  const lengthRanges = {
    '0-50': 0,
    '51-100': 0,
    '101-200': 0,
    '201-500': 0,
    '500+': 0,
    'Writer\'s soul (180+)': 0,
  };

  const ratingDistribution = {
    '0': 0,
    '1': 0,
    '2': 0,
    '3': 0,
    '4': 0,
    '5': 0,
  };

  let totalEvaluations = 0;
  let totalRatings = 0;

  evaluations.forEach(evaluation => {
    totalEvaluations++;
    const length = evaluation.comment?.length || 0;
    if (length >= 180) lengthRanges['Writer\'s soul (180+)']++;
    if (length <= 50) lengthRanges['0-50']++;
    else if (length <= 100) lengthRanges['51-100']++;
    else if (length <= 200) lengthRanges['101-200']++;
    else if (length <= 500) lengthRanges['201-500']++;
    else lengthRanges['500+']++;

    if (evaluation.feedbacks && evaluation.feedbacks.length > 0) {
      evaluation.feedbacks.forEach(feedback => {
        if (!EXCLUDED_FEEDBACK_MESSAGES.has(feedback.comment)) {
          if (feedback.rating >= 0 && feedback.rating <= 5) {
            ratingDistribution[feedback.rating.toString() as keyof typeof ratingDistribution]++;
            totalRatings++;
          }
        }
      });
    }
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="dark:bg-background/30">
        <CardHeader>
          <CardTitle className="font-mono">Rating Distribution</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(ratingDistribution).map(([rating, count]) => (
            <div key={rating} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{rating}★</span>
                <span className="text-sm text-gray-500">{count} ratings</span>
              </div>
              <Progress value={(count / totalRatings) * 100} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>
      <Card className="dark:bg-background/30">
        <CardHeader>
          <CardTitle className="font-mono">Evaluation Length Distribution</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(lengthRanges).map(([range, count]) => (
            <div key={range} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{range}</span>
                <span className="text-sm text-gray-500">
                  {range === 'Writer\'s soul (180+)'
                    ? `${count}/42 evaluations`
                    : `${count} evaluations`}
                </span>
              </div>
              <Progress
                value={range === 'Writer\'s soul (180+)'
                  ? (count / 42) * 100
                  : (count / totalEvaluations) * 100}
                className="h-2"
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
