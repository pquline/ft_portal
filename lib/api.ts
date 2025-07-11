import { projectMap } from '@/components/projectMap';

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  created_at: number;
}

export interface StudentProfile {
  id: number;
  email: string;
  login: string;
  first_name: string;
  last_name: string;
  usual_first_name: string | null;
  usual_full_name: string | null;
  url: string;
  phone: string;
  displayname: string;
  kind: string;
  image: {
    link: string;
    versions: {
      large: string;
      medium: string;
      small: string;
      micro: string;
    };
  };
  correction_point: number;
  wallet: number;
  cursus_users: Array<{
    cursus_id: number;
    cursus: {
      id: number;
      name: string;
      slug: string;
    };
    level: number;
    skills: Array<{
      id: number;
      name: string;
      level: number;
    }>;
  }>;
  projects_users: Array<{
    id: number;
    occurrence: number;
    final_mark: number | null;
    status: string;
    "validated?": boolean;
    project: {
      id: number;
      name: string;
      slug: string;
      parent_id: number | null;
    };
    cursus_ids: number[];
    marked_at: string | null;
    marked: boolean;
    retriable_at: string | null;
    created_at: string;
    updated_at: string;
  }>;
}

export interface Evaluation {
  id: number;
  scale_id: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
  feedback: string | null;
  final_mark: number | null;
  flag: {
    id: number;
    name: string;
    positive: boolean;
    icon: string;
    created_at: string;
    updated_at: string;
  };
  begin_at: string;
  correcteds: Array<{
    id: number;
    login: string;
    url: string;
  }>;
  corrector: {
    id: number;
    login: string;
    url: string;
  };
  truant: {
    id: number;
    login: string;
    url: string;
  } | null;
  filled_at: string | null;
  questions_with_answers: Array<{
    id: number;
    question: string;
    answer: string;
  }>;
  scale: {
    id: number;
    evaluation_id: number;
    name: string;
    is_primary: boolean;
    comment: string;
    introduction_md: string;
    disclaimer_md: string;
    guidelines_md: string;
    created_at: string;
    correction_number: number;
    duration: number;
    manual_subscription: boolean;
    languages: Array<{
      id: number;
      name: string;
      identifier: string;
      created_at: string;
      updated_at: string;
    }>;
    flags: Array<{
      id: number;
      name: string;
      positive: boolean;
      icon: string;
      created_at: string;
      updated_at: string;
    }>;
    free: boolean;
  };
  team: {
    id: number;
    name: string;
    url: string;
    final_mark: number;
    project_id: number;
    created_at: string;
    updated_at: string;
    status: string;
    terminating_at: string | null;
    users: Array<{
      id: number;
      login: string;
      url: string;
      leader: boolean;
      occurrence: number;
      validated: boolean;
      projects_user_id: number;
    }>;
    locked: boolean;
    validated: boolean;
    closed: boolean;
    repo_url: string;
    repo_uuid: string;
    locked_at: string;
    closed_at: string;
    project_session_id: number;
    project_gitlab_path: string;
  };
  feedbacks: Array<{
    id: number;
    user: {
      login: string;
      id: number;
      url: string;
    };
    feedbackable_type: string;
    feedbackable_id: number;
    comment: string;
    rating: number;
    created_at: string;
  }>;
}

export interface EvaluationStats {
  totalEvaluations: number;
  averageRating: number;
  totalFeedback: number;
  projectStats: {
    [key: string]: {
      count: number;
      averageMark: number;
      outstandingCount: number;
      okCount: number;
    };
  };
  flagStats: {
    [key: string]: number;
  };
}

export interface HallVoiceSounds {
  hasHallVoice: boolean;
  inSounds: string[];
  outSounds: string[];
}

export interface CPiscineExamResult {
  name: string;
  mark: number;
  date: string;
  validated: boolean;
}

export interface CPiscineExamStats {
  exams: CPiscineExamResult[];
  averageScore: number;
  totalExams: number;
  passedExams: number;
  evolution: {
    labels: string[];
    data: number[];
  };
}

export const API_BASE_URL = "https://api.intra.42.fr";

export async function fetchWithDelay(url: string, options: RequestInit = {}, retryCount = 0): Promise<Response> {
  const response = await fetch(url, options);

  if (response.status === 429 && retryCount < 3) {
    const retryAfter = response.headers.get('Retry-After');
    const waitTime = retryAfter ? parseInt(retryAfter) * 500 : Math.min(500 * Math.pow(2, retryCount), 10000);
    await new Promise(resolve => setTimeout(resolve, waitTime));
    return fetchWithDelay(url, options, retryCount + 1);
  }

  if (response.status === 401 && retryCount === 0 && typeof window !== 'undefined') {
    document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = '/auth';
  }

  await new Promise(resolve => setTimeout(resolve, 500));
  return response;
}

export async function searchStudent(login: string, accessToken: string): Promise<StudentProfile> {
  const response = await fetchWithDelay(`/api/students/${login}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch student profile');
  }

  return response.json();
}

export async function getEvaluations(userId: number, accessToken: string): Promise<Evaluation[]> {
  const response = await fetchWithDelay(`/api/evaluations?userId=${userId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch evaluations");
  }

  return response.json();
}

export function filterValidEvaluations(evaluations: Evaluation[]): Evaluation[] {
  return evaluations.filter(evaluation => {
    const isCancelled =
      evaluation.comment === null;

    return !isCancelled;
  });
}

export function calculateEvaluationStats(evaluations: Evaluation[]): EvaluationStats {
  const validEvaluations = filterValidEvaluations(evaluations);

  const stats: EvaluationStats = {
    totalEvaluations: validEvaluations.length,
    averageRating: 0,
    totalFeedback: 0,
    projectStats: {},
    flagStats: {},
  };

  let totalRating = 0;
  let totalFeedbackCount = 0;
  let validRatingsCount = 0;

  const EXCLUDED_FEEDBACK_MESSAGES = new Set([
    "You failed to complete this feedback within the allocated time (this is very wrong), so we did it for you (do it next time)."
  ]);

  validEvaluations.forEach((evaluation) => {
    if (evaluation.feedbacks && evaluation.feedbacks.length > 0) {
      const validFeedbacks = evaluation.feedbacks.filter(
        feedback => !EXCLUDED_FEEDBACK_MESSAGES.has(feedback.comment)
      );

      if (validFeedbacks.length > 0) {
        totalFeedbackCount++;

        const evaluationRatings = validFeedbacks
          .map(feedback => feedback.rating)
          .filter(rating => typeof rating === 'number' && !isNaN(rating));

        if (evaluationRatings.length > 0) {
          const averageRating = evaluationRatings.reduce((sum, rating) => sum + rating, 0) / evaluationRatings.length;
          totalRating += averageRating;
          validRatingsCount++;
        }
      }
    }

    const flagName = evaluation.flag.name;
    stats.flagStats[flagName] = (stats.flagStats[flagName] || 0) + 1;

    const gitlabPath = evaluation.team.project_gitlab_path;
    let projectName: string;
    if (gitlabPath) {
      projectName = gitlabPath.split('/').slice(-2).join('/');
    } else {
      const projectEntry = projectMap.find(p => p.id === evaluation.team.project_id);
      projectName = projectEntry ? projectEntry.project_path : 'unknown_project';
    }

    if (!stats.projectStats[projectName]) {
      stats.projectStats[projectName] = {
        count: 0,
        averageMark: 0,
        outstandingCount: 0,
        okCount: 0,
      };
    }

    const projectStat = stats.projectStats[projectName];
    projectStat.count++;

    if (evaluation.final_mark !== null) {
      projectStat.averageMark = ((projectStat.averageMark * (projectStat.count - 1)) + evaluation.final_mark) / projectStat.count;
    }

    if (evaluation.flag.id === 9) {
      projectStat.outstandingCount++;
    } else if (evaluation.flag.id === 1) {
      projectStat.okCount++;
    }
  });

  stats.averageRating = validRatingsCount > 0 ? totalRating / validRatingsCount : 0;
  stats.totalFeedback = totalFeedbackCount;

  return stats;
}

export async function checkHallVoice(login: string): Promise<HallVoiceSounds> {
  // Mock data for development
  if (process.env.NODE_ENV !== 'production') {
    return {
      hasHallVoice: true,
      inSounds: ["sound1", "sound2"],
      outSounds: ["sound3", "sound4"],
    };
  }

  try {
    const response = await fetch(`https://api.intra.42.fr/v2/users/${login}/locations`, {
      headers: {
        Authorization: `Bearer ${process.env.FORTYTWO_ACCESS_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch hall voice data');
    }

    const data = await response.json();
    return {
      hasHallVoice: data.length > 0,
      inSounds: data.filter((location: { end_at: string | null }) => location.end_at === null).map((location: { host: string }) => location.host),
      outSounds: data.filter((location: { end_at: string | null }) => location.end_at !== null).map((location: { host: string }) => location.host),
    };
  } catch (error) {
    console.error('Error fetching hall voice data:', error);
    return {
      hasHallVoice: false,
      inSounds: [],
      outSounds: [],
    };
  }
}

export function calculateCPiscineExamStats(studentProfile: StudentProfile): CPiscineExamStats {
  const examNames = [
    "C Piscine Exam 00",
    "C Piscine Exam 01",
    "C Piscine Exam 02",
    "C Piscine Final Exam"
  ];

  const examResults: CPiscineExamResult[] = [];

  studentProfile.projects_users.forEach(project => {
    if (examNames.includes(project.project.name) && project.final_mark !== null) {
      examResults.push({
        name: project.project.name,
        mark: project.final_mark,
        date: project.marked_at || project.created_at,
        validated: project["validated?"]
      });
    }
  });

  // Sort by date
  examResults.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const totalExams = examResults.length;
  const passedExams = examResults.filter(exam => exam.validated).length;
  const averageScore = totalExams > 0
    ? examResults.reduce((sum, exam) => sum + exam.mark, 0) / totalExams
    : 0;

  // Prepare evolution data for chart
  const evolution = {
    labels: examResults.map(exam => exam.name.replace("C Piscine ", "")),
    data: examResults.map(exam => exam.mark)
  };

  return {
    exams: examResults,
    averageScore,
    totalExams,
    passedExams,
    evolution
  };
}
