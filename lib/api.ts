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

export const API_BASE_URL = "https://api.intra.42.fr";

export async function fetchWithDelay(url: string, options: RequestInit = {}, retryCount = 0): Promise<Response> {
  const response = await fetch(url, options);
  if (response.status === 429 && retryCount < 3) {
    const retryAfter = response.headers.get('Retry-After');
    const waitTime = retryAfter ? parseInt(retryAfter) * 500 : Math.min(500 * Math.pow(2, retryCount), 10000);
    await new Promise(resolve => setTimeout(resolve, waitTime));
    return fetchWithDelay(url, options, retryCount + 1);
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

export function calculateEvaluationStats(evaluations: Evaluation[]): EvaluationStats {
  const stats: EvaluationStats = {
    totalEvaluations: evaluations.length,
    averageRating: 0,
    totalFeedback: 0,
    projectStats: {},
    flagStats: {},
  };

  let totalRating = 0;
  let totalFeedbackCount = 0;
  let validRatingsCount = 0;

  evaluations.forEach((evaluation) => {
    if (evaluation.feedbacks && evaluation.feedbacks.length > 0) {
      totalFeedbackCount++;

      const evaluationRatings = evaluation.feedbacks
        .map(feedback => feedback.rating)
        .filter(rating => typeof rating === 'number' && !isNaN(rating));

      if (evaluationRatings.length > 0) {
        const averageRating = evaluationRatings.reduce((sum, rating) => sum + rating, 0) / evaluationRatings.length;
        totalRating += averageRating;
        validRatingsCount++;
      }
    }

    const flagName = evaluation.flag.name;
    stats.flagStats[flagName] = (stats.flagStats[flagName] || 0) + 1;

    const gitlabPath = evaluation.team.project_gitlab_path;
    const projectName = gitlabPath ? gitlabPath.split('/').slice(-2).join('/') : 'Unknown Project';

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
  interface GitHubFile {
    name: string;
    path: string;
    sha: string;
    size: number;
    url: string;
    html_url: string;
    git_url: string;
    download_url: string;
    type: string;
    _links: {
      self: string;
      git: string;
      html: string;
    };
  }

  const baseUrl = 'https://api.github.com/repos/42paris/hall-voice/contents/mp3';
  const result: HallVoiceSounds = {
    hasHallVoice: false,
    inSounds: [],
    outSounds: []
  };

  try {
    const userDirResponse = await fetch(`${baseUrl}/${login}`);
    if (!userDirResponse.ok) {
      return result;
    }

    result.hasHallVoice = true;

    const inDirResponse = await fetch(`${baseUrl}/${login}/in`);
    if (inDirResponse.ok) {
      const inFiles = await inDirResponse.json() as GitHubFile[];
      result.inSounds = inFiles
        .filter(file => file.name.endsWith('.mp3'))
        .map(file => file.download_url);
    }

    const outDirResponse = await fetch(`${baseUrl}/${login}/out`);
    if (outDirResponse.ok) {
      const outFiles = await outDirResponse.json() as GitHubFile[];
      result.outSounds = outFiles
        .filter(file => file.name.endsWith('.mp3'))
        .map(file => file.download_url);
    }

    return result;
  } catch (error) {
    console.error('Error checking hall voice:', error);
    return result;
  }
}
