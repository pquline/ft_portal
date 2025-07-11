import { Evaluation, fetchWithDelay } from '@/lib/api';
import { NextResponse } from 'next/server';

const API_BASE_URL = 'https://api.intra.42.fr';

export async function GET(request: Request) {
  // Return mock evaluations in development
  if (process.env.NODE_ENV !== 'production') {
    return NextResponse.json([
      {
        id: 1,
        scale_id: 1,
        comment: "Great work!",
        feedback: "Excellent implementation",
        final_mark: 100,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        flag: {
          id: 1,
          name: "Ok",
          positive: true,
          icon: "check",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        begin_at: new Date().toISOString(),
        correcteds: [
          { id: 1, login: "student1", url: "https://api.intra.42.fr/v2/users/student1" }
        ],
        corrector: {
          id: 1,
          login: "corrector1",
          url: "https://api.intra.42.fr/v2/users/corrector1"
        },
        truant: null,
        filled_at: new Date().toISOString(),
        questions_with_answers: [],
        scale: {
          id: 1,
          evaluation_id: 1,
          name: "Sample Scale",
          is_primary: true,
          comment: "Sample scale comment",
          introduction_md: "",
          disclaimer_md: "",
          guidelines_md: "",
          created_at: new Date().toISOString(),
          correction_number: 1,
          duration: 60,
          manual_subscription: false,
          languages: [],
          flags: [],
          free: true
        },
        team: {
          id: 1,
          name: "Sample Project",
          url: "https://api.intra.42.fr/v2/teams/1",
          final_mark: 100,
          project_id: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          status: "finished",
          terminating_at: null,
          users: [],
          locked: false,
          validated: true,
          closed: true,
          repo_url: "https://gitlab.com/sample/project",
          repo_uuid: "uuid1",
          locked_at: new Date().toISOString(),
          closed_at: new Date().toISOString(),
          project_session_id: 1,
          project_gitlab_path: "sample/project"
        },
        feedbacks: [
          {
            id: 1,
            user: { login: "student1", id: 1, url: "https://api.intra.42.fr/v2/users/student1" },
            feedbackable_type: "ScaleTeam",
            feedbackable_id: 1,
            comment: "Great evaluation, very helpful feedback!",
            rating: 5,
            created_at: new Date().toISOString()
          }
        ]
      },
      {
        id: 2,
        scale_id: 1,
        comment: "Good work, but could be improved",
        feedback: "Nice implementation",
        final_mark: 85,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        flag: {
          id: 9,
          name: "Outstanding project",
          positive: true,
          icon: "star",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        begin_at: new Date().toISOString(),
        correcteds: [
          { id: 2, login: "student2", url: "https://api.intra.42.fr/v2/users/student2" }
        ],
        corrector: {
          id: 1,
          login: "corrector1",
          url: "https://api.intra.42.fr/v2/users/corrector1"
        },
        truant: null,
        filled_at: new Date().toISOString(),
        questions_with_answers: [],
        scale: {
          id: 1,
          evaluation_id: 2,
          name: "Sample Scale",
          is_primary: true,
          comment: "Sample scale comment",
          introduction_md: "",
          disclaimer_md: "",
          guidelines_md: "",
          created_at: new Date().toISOString(),
          correction_number: 1,
          duration: 60,
          manual_subscription: false,
          languages: [],
          flags: [],
          free: true
        },
        team: {
          id: 2,
          name: "Another Project",
          url: "https://api.intra.42.fr/v2/teams/2",
          final_mark: 85,
          project_id: 2,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          status: "finished",
          terminating_at: null,
          users: [],
          locked: false,
          validated: true,
          closed: true,
          repo_url: "https://gitlab.com/sample/project2",
          repo_uuid: "uuid2",
          locked_at: new Date().toISOString(),
          closed_at: new Date().toISOString(),
          project_session_id: 1,
          project_gitlab_path: "sample/project2"
        },
        feedbacks: [
          {
            id: 2,
            user: { login: "student2", id: 2, url: "https://api.intra.42.fr/v2/users/student2" },
            feedbackable_type: "ScaleTeam",
            feedbackable_id: 2,
            comment: "Fair evaluation, thanks for the feedback",
            rating: 4,
            created_at: new Date().toISOString()
          },
          {
            id: 3,
            user: { login: "student3", id: 3, url: "https://api.intra.42.fr/v2/users/student3" },
            feedbackable_type: "ScaleTeam",
            feedbackable_id: 2,
            comment: "Good evaluation",
            rating: 3,
            created_at: new Date().toISOString()
          }
        ]
      },
      {
        id: 3,
        scale_id: 1,
        comment: "Excellent work! Very impressive implementation",
        feedback: "Outstanding job",
        final_mark: 100,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        flag: {
          id: 9,
          name: "Outstanding project",
          positive: true,
          icon: "star",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        begin_at: new Date().toISOString(),
        correcteds: [
          { id: 3, login: "student3", url: "https://api.intra.42.fr/v2/users/student3" }
        ],
        corrector: {
          id: 1,
          login: "corrector1",
          url: "https://api.intra.42.fr/v2/users/corrector1"
        },
        truant: null,
        filled_at: new Date().toISOString(),
        questions_with_answers: [],
        scale: {
          id: 1,
          evaluation_id: 3,
          name: "Sample Scale",
          is_primary: true,
          comment: "Sample scale comment",
          introduction_md: "",
          disclaimer_md: "",
          guidelines_md: "",
          created_at: new Date().toISOString(),
          correction_number: 1,
          duration: 60,
          manual_subscription: false,
          languages: [],
          flags: [],
          free: true
        },
        team: {
          id: 3,
          name: "Third Project",
          url: "https://api.intra.42.fr/v2/teams/3",
          final_mark: 100,
          project_id: 3,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          status: "finished",
          terminating_at: null,
          users: [],
          locked: false,
          validated: true,
          closed: true,
          repo_url: "https://gitlab.com/sample/project3",
          repo_uuid: "uuid3",
          locked_at: new Date().toISOString(),
          closed_at: new Date().toISOString(),
          project_session_id: 1,
          project_gitlab_path: "sample/project3"
        },
        feedbacks: []
      },
      {
        id: 4,
        scale_id: 1,
        comment: "Great work! I'm so proud of you! You're a great student! Omg im so impressed by your level you should definitely be a teacher! Wow such a great understanding of all the notions...",
        feedback: "Excellent implementation",
        final_mark: 100,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        flag: {
          id: 9,
          name: "Outstanding project",
          positive: true,
          icon: "star",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        begin_at: new Date().toISOString(),
        correcteds: [
          { id: 4, login: "student4", url: "https://api.intra.42.fr/v2/users/student4" }
        ],
        corrector: {
          id: 1,
          login: "corrector1",
          url: "https://api.intra.42.fr/v2/users/corrector1"
        },
        truant: null,
        filled_at: new Date().toISOString(),
        questions_with_answers: [],
        scale: {
          id: 1,
          evaluation_id: 4,
          name: "Sample Scale",
          is_primary: true,
          comment: "Sample scale comment",
          introduction_md: "",
          disclaimer_md: "",
          guidelines_md: "",
          created_at: new Date().toISOString(),
          correction_number: 1,
          duration: 60,
          manual_subscription: false,
          languages: [],
          flags: [],
          free: true
        },
        team: {
          id: 4,
          name: "Long Comment Project",
          url: "https://api.intra.42.fr/v2/teams/4",
          final_mark: 100,
          project_id: 4,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          status: "finished",
          terminating_at: null,
          users: [],
          locked: false,
          validated: true,
          closed: true,
          repo_url: "https://gitlab.com/sample/project4",
          repo_uuid: "uuid4",
          locked_at: new Date().toISOString(),
          closed_at: new Date().toISOString(),
          project_session_id: 1,
          project_gitlab_path: "sample/project4"
        },
        feedbacks: [
          {
            id: 4,
            user: { login: "student4", id: 4, url: "https://api.intra.42.fr/v2/users/student4" },
            feedbackable_type: "ScaleTeam",
            feedbackable_id: 4,
            comment: "Amazing evaluation, very detailed feedback!",
            rating: 5,
            created_at: new Date().toISOString()
          }
        ]
      },
      {
        id: 5,
        scale_id: 1,
        comment: "Great work...",
        feedback: "Excellent implementation",
        final_mark: 75,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        flag: {
          id: 1,
          name: "Ok",
          positive: true,
          icon: "check",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        begin_at: new Date().toISOString(),
        correcteds: [
          { id: 5, login: "student5", url: "https://api.intra.42.fr/v2/users/student5" }
        ],
        corrector: {
          id: 1,
          login: "corrector1",
          url: "https://api.intra.42.fr/v2/users/corrector1"
        },
        truant: null,
        filled_at: new Date().toISOString(),
        questions_with_answers: [],
        scale: {
          id: 1,
          evaluation_id: 5,
          name: "Sample Scale",
          is_primary: true,
          comment: "Sample scale comment",
          introduction_md: "",
          disclaimer_md: "",
          guidelines_md: "",
          created_at: new Date().toISOString(),
          correction_number: 1,
          duration: 60,
          manual_subscription: false,
          languages: [],
          flags: [],
          free: true
        },
        team: {
          id: 5,
          name: "Short Comment Project",
          url: "https://api.intra.42.fr/v2/teams/5",
          final_mark: 75,
          project_id: 5,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          status: "finished",
          terminating_at: null,
          users: [],
          locked: false,
          validated: true,
          closed: true,
          repo_url: "https://gitlab.com/sample/project5",
          repo_uuid: "uuid5",
          locked_at: new Date().toISOString(),
          closed_at: new Date().toISOString(),
          project_session_id: 1,
          project_gitlab_path: "sample/project5"
        },
        feedbacks: [
          {
            id: 5,
            user: { login: "student5", id: 5, url: "https://api.intra.42.fr/v2/users/student5" },
            feedbackable_type: "ScaleTeam",
            feedbackable_id: 5,
            comment: "Could be more detailed",
            rating: 2,
            created_at: new Date().toISOString()
          }
        ]
      }
    ]);
  }

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const accessToken = request.headers.get('Authorization')?.split(' ')[1];

  if (!userId || !accessToken) {
    return NextResponse.json({ error: 'Missing userId or access token' }, { status: 400 });
  }

  try {
    let allEvaluations: Evaluation[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await fetchWithDelay(
        `${API_BASE_URL}/v2/users/${userId}/scale_teams/as_corrector?page[size]=100&page[number]=${page}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        let errorMessage = 'Failed to fetch evaluations';
        const contentType = response.headers.get('content-type');
        if (contentType?.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } else {
          errorMessage = await response.text() || errorMessage;
        }

        if (response.status === 401) {
          return NextResponse.json({
            error: 'The access token expired. Please refresh your session.'
          }, { status: 401 });
        }

        return NextResponse.json({ error: errorMessage }, { status: response.status });
      }

      const data = await response.json();
      allEvaluations = [...allEvaluations, ...data];

      hasMore = data.length === 100;
      page++;
    }

    return NextResponse.json(allEvaluations);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch evaluations' }, { status: 500 });
  }
}
