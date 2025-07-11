import { Evaluation, fetchWithDelay } from '@/lib/api';
import { NextResponse } from 'next/server';

const API_BASE_URL = 'https://api.intra.42.fr';

export async function GET(request: Request) {
  // Return mock evaluations in development
  if (process.env.NODE_ENV !== 'production') {
    return NextResponse.json([
      {
        id: 8214866,
        scale_id: 45226,
        comment: "Great work! Very detailed evaluation with comprehensive feedback.",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        feedback: "Excellent implementation and thorough evaluation process.",
        final_mark: 100,
        flag: {
          id: 1,
          name: "Ok",
          positive: true,
          icon: "check-4",
          created_at: "2015-09-14T23:06:52.000Z",
          updated_at: "2015-09-14T23:06:52.000Z"
        },
        begin_at: new Date().toISOString(),
        correcteds: [
          {
            id: 177398,
            login: "student1",
            url: "https://api.intra.42.fr/v2/users/student1"
          }
        ],
        corrector: {
          id: 129060,
          login: "corrector1",
          url: "https://api.intra.42.fr/v2/users/corrector1"
        },
        truant: {},
        filled_at: new Date().toISOString(),
        questions_with_answers: [],
        scale: {
          id: 45226,
          evaluation_id: 3696,
          name: "scale 3.2",
          is_primary: true,
          comment: "",
          introduction_md: "Please adhere to the following rules...",
          disclaimer_md: "",
          guidelines_md: "- Only grade the work submitted...",
          created_at: "2025-06-02T15:37:30.072Z",
          correction_number: 3,
          duration: 1800,
          manual_subscription: true,
          languages: [
            {
              id: 2,
              name: "English",
              identifier: "en",
              created_at: "2015-04-14T16:07:38.122Z",
              updated_at: "2025-06-16T09:58:04.908Z"
            }
          ],
          flags: [],
          free: false
        },
        team: {
          id: 6624176,
          name: "student1's group",
          url: "https://api.intra.42.fr/v2/teams/6624176",
          final_mark: 100,
          project_id: 1983,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          status: "finished",
          terminating_at: null,
          users: [
            {
              id: 177398,
              login: "student1",
              url: "https://api.intra.42.fr/v2/users/student1",
              leader: true,
              occurrence: 0,
              validated: true,
              projects_user_id: 4340841
            }
          ],
          "locked?": true,
          "validated?": true,
          "closed?": true,
          repo_url: "git@vogsphere.42paris.fr:vogsphere/sample-repo",
          repo_uuid: "sample-uuid",
          locked_at: new Date().toISOString(),
          closed_at: new Date().toISOString(),
          project_session_id: 5921,
          project_gitlab_path: "pedago_world/42-cursus/inner-circle/sample-project"
        },
        feedbacks: [
          {
            id: 8234969,
            user: {
              login: "student1",
              id: 177398,
              url: "https://profile.intra.42.fr/users/student1"
            },
            feedbackable_type: "ScaleTeam",
            feedbackable_id: 8214866,
            comment: "Great evaluation, very helpful feedback!",
            rating: 5,
            created_at: new Date().toISOString()
          }
        ]
      },
      {
        id: 7602191,
        scale_id: 38662,
        comment: "Good work, but could be improved in some areas.",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        feedback: "Nice implementation with room for improvement.",
        final_mark: 85,
        flag: {
          id: 9,
          name: "Outstanding project",
          positive: true,
          icon: "star-1",
          created_at: "2017-05-18T14:07:37.380Z",
          updated_at: "2017-05-18T14:12:07.415Z"
        },
        begin_at: new Date().toISOString(),
        correcteds: [
          {
            id: 100469,
            login: "student2",
            url: "https://api.intra.42.fr/v2/users/student2"
          },
          {
            id: 129071,
            login: "student3",
            url: "https://api.intra.42.fr/v2/users/student3"
          }
        ],
        corrector: {
          id: 129060,
          login: "corrector1",
          url: "https://api.intra.42.fr/v2/users/corrector1"
        },
        truant: {},
        filled_at: new Date().toISOString(),
        questions_with_answers: [],
        scale: {
          id: 38662,
          evaluation_id: 3824,
          name: "scale 7",
          is_primary: false,
          comment: "",
          introduction_md: "Please comply with the following rules...",
          disclaimer_md: "",
          guidelines_md: "- Only grade the work that was turned in...",
          created_at: "2024-12-02T10:43:28.123Z",
          correction_number: 3,
          duration: 3600,
          manual_subscription: true,
          languages: [
            {
              id: 2,
              name: "English",
              identifier: "en",
              created_at: "2015-04-14T16:07:38.122Z",
              updated_at: "2025-07-10T09:06:36.787Z"
            }
          ],
          flags: [],
          free: false
        },
        team: {
          id: 6241422,
          name: "student2's team",
          url: "https://api.intra.42.fr/v2/teams/6241422",
          final_mark: 85,
          project_id: 1336,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          status: "finished",
          terminating_at: null,
          users: [
            {
              id: 100469,
              login: "student2",
              url: "https://api.intra.42.fr/v2/users/student2",
              leader: false,
              occurrence: 0,
              validated: true,
              projects_user_id: 3734328
            },
            {
              id: 129071,
              login: "student3",
              url: "https://api.intra.42.fr/v2/users/student3",
              leader: true,
              occurrence: 1,
              validated: true,
              projects_user_id: 3645650
            }
          ],
          "locked?": true,
          "validated?": true,
          "closed?": true,
          repo_url: "git@vogsphere.42paris.fr:vogsphere/sample-repo2",
          repo_uuid: "sample-uuid2",
          locked_at: new Date().toISOString(),
          closed_at: new Date().toISOString(),
          project_session_id: 6088,
          project_gitlab_path: "pedago_world/42-cursus/inner-circle/another-project"
        },
        feedbacks: [
          {
            id: 7626046,
            user: {
              login: "student2",
              id: 100469,
              url: "https://profile.intra.42.fr/users/student2"
            },
            feedbackable_type: "ScaleTeam",
            feedbackable_id: 7602191,
            comment: "Fair evaluation, thanks for the feedback",
            rating: 4,
            created_at: new Date().toISOString()
          },
          {
            id: 7626047,
            user: {
              login: "student3",
              id: 129071,
              url: "https://profile.intra.42.fr/users/student3"
            },
            feedbackable_type: "ScaleTeam",
            feedbackable_id: 7602191,
            comment: "Good evaluation",
            rating: 3,
            created_at: new Date().toISOString()
          }
        ]
      },
      {
        id: 7592171,
        scale_id: 35605,
        comment: "Excellent work! Very impressive implementation with detailed explanations.",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        feedback: "Outstanding job and thorough evaluation process.",
        final_mark: 100,
        flag: {
          id: 9,
          name: "Outstanding project",
          positive: true,
          icon: "star-1",
          created_at: "2017-05-18T14:07:37.380Z",
          updated_at: "2017-05-18T14:12:07.415Z"
        },
        begin_at: new Date().toISOString(),
        correcteds: [
          {
            id: 153949,
            login: "student4",
            url: "https://api.intra.42.fr/v2/users/student4"
          }
        ],
        corrector: {
          id: 129060,
          login: "corrector1",
          url: "https://api.intra.42.fr/v2/users/corrector1"
        },
        truant: {},
        filled_at: new Date().toISOString(),
        questions_with_answers: [],
        scale: {
          id: 35605,
          evaluation_id: 2229,
          name: "scale 10",
          is_primary: false,
          comment: "",
          introduction_md: "Please comply with the following rules...",
          disclaimer_md: "",
          guidelines_md: "- Only grade the work that was turned in...",
          created_at: "2024-07-22T13:26:56.493Z",
          correction_number: 3,
          duration: 1800,
          manual_subscription: true,
          languages: [
            {
              id: 2,
              name: "English",
              identifier: "en",
              created_at: "2015-04-14T16:07:38.122Z",
              updated_at: "2025-07-08T07:01:51.488Z"
            }
          ],
          flags: [],
          free: false
        },
        team: {
          id: 5709163,
          name: "student4's group",
          url: "https://api.intra.42.fr/v2/teams/5709163",
          final_mark: 100,
          project_id: 1334,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          status: "finished",
          terminating_at: null,
          users: [
            {
              id: 153949,
              login: "student4",
              url: "https://api.intra.42.fr/v2/users/student4",
              leader: true,
              occurrence: 0,
              validated: true,
              projects_user_id: 3693033
            }
          ],
          "locked?": true,
          "validated?": true,
          "closed?": true,
          repo_url: "git@vogsphere.42paris.fr:vogsphere/sample-repo3",
          repo_uuid: "sample-uuid3",
          locked_at: new Date().toISOString(),
          closed_at: new Date().toISOString(),
          project_session_id: 4505,
          project_gitlab_path: "pedago_world/42-cursus/inner-circle/third-project"
        },
        feedbacks: []
      },
      {
        id: 7592202,
        scale_id: 37447,
        comment: "Great work! I'm so proud of you! You're a great student! Omg im so impressed by your level you should definitely be a teacher! Wow such a great understanding of all the notions and concepts. This is exactly what we look for in evaluations - thorough, detailed, and constructive feedback that helps students grow and improve their skills.",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        feedback: "Excellent implementation and very detailed evaluation process.",
        final_mark: 100,
        flag: {
          id: 9,
          name: "Outstanding project",
          positive: true,
          icon: "star-1",
          created_at: "2017-05-18T14:07:37.380Z",
          updated_at: "2017-05-18T14:12:07.415Z"
        },
        begin_at: new Date().toISOString(),
        correcteds: [
          {
            id: 197895,
            login: "student5",
            url: "https://api.intra.42.fr/v2/users/student5"
          }
        ],
        corrector: {
          id: 129060,
          login: "corrector1",
          url: "https://api.intra.42.fr/v2/users/corrector1"
        },
        truant: {},
        filled_at: new Date().toISOString(),
        questions_with_answers: [],
        scale: {
          id: 37447,
          evaluation_id: 2181,
          name: "scale 7",
          is_primary: false,
          comment: "",
          introduction_md: "Please comply with the following rules...",
          disclaimer_md: "",
          guidelines_md: "- Only grade the work that was turned in...",
          created_at: "2024-10-28T14:18:54.848Z",
          correction_number: 3,
          duration: 1800,
          manual_subscription: true,
          languages: [
            {
              id: 2,
              name: "English",
              identifier: "en",
              created_at: "2015-04-14T16:07:38.122Z",
              updated_at: "2025-07-07T10:40:07.508Z"
            }
          ],
          flags: [],
          free: false
        },
        team: {
          id: 6223444,
          name: "student5's group",
          url: "https://api.intra.42.fr/v2/teams/6223444",
          final_mark: 100,
          project_id: 1316,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          status: "finished",
          terminating_at: null,
          users: [
            {
              id: 197895,
              login: "student5",
              url: "https://api.intra.42.fr/v2/users/student5",
              leader: true,
              occurrence: 0,
              validated: true,
              projects_user_id: 4048191
            }
          ],
          "locked?": true,
          "validated?": true,
          "closed?": true,
          repo_url: "git@vogsphere.42paris.fr:vogsphere/sample-repo4",
          repo_uuid: "sample-uuid4",
          locked_at: new Date().toISOString(),
          closed_at: new Date().toISOString(),
          project_session_id: 4472,
          project_gitlab_path: "pedago_world/42-cursus/inner-circle/long-comment-project"
        },
        feedbacks: [
          {
            id: 7615819,
            user: {
              login: "student5",
              id: 197895,
              url: "https://profile.intra.42.fr/users/student5"
            },
            feedbackable_type: "ScaleTeam",
            feedbackable_id: 7592202,
            comment: "Amazing evaluation, very detailed feedback!",
            rating: 5,
            created_at: new Date().toISOString()
          }
        ]
      },
      {
        id: 7398656,
        scale_id: 35514,
        comment: "Great work...",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        feedback: "Good implementation",
        final_mark: 75,
        flag: {
          id: 1,
          name: "Ok",
          positive: true,
          icon: "check-4",
          created_at: "2015-09-14T23:06:52.000Z",
          updated_at: "2015-09-14T23:06:52.000Z"
        },
        begin_at: new Date().toISOString(),
        correcteds: [
          {
            id: 177576,
            login: "student6",
            url: "https://api.intra.42.fr/v2/users/student6"
          },
          {
            id: 177620,
            login: "student7",
            url: "https://api.intra.42.fr/v2/users/student7"
          }
        ],
        corrector: {
          id: 129060,
          login: "corrector1",
          url: "https://api.intra.42.fr/v2/users/corrector1"
        },
        truant: {},
        filled_at: new Date().toISOString(),
        questions_with_answers: [],
        scale: {
          id: 35514,
          evaluation_id: 2227,
          name: "scale 8.1",
          is_primary: false,
          comment: "",
          introduction_md: "Please comply with the following rules...",
          disclaimer_md: "",
          guidelines_md: "- Only grade the work that was turned in...",
          created_at: "2024-07-15T12:03:07.343Z",
          correction_number: 3,
          duration: 3600,
          manual_subscription: true,
          languages: [
            {
              id: 2,
              name: "English",
              identifier: "en",
              created_at: "2015-04-14T16:07:38.122Z",
              updated_at: "2025-07-09T02:32:04.691Z"
            }
          ],
          flags: [],
          free: false
        },
        team: {
          id: 6050703,
          name: "student6's team",
          url: "https://api.intra.42.fr/v2/teams/6050703",
          final_mark: 75,
          project_id: 1331,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          status: "finished",
          terminating_at: null,
          users: [
            {
              id: 177576,
              login: "student6",
              url: "https://api.intra.42.fr/v2/users/student6",
              leader: false,
              occurrence: 0,
              validated: true,
              projects_user_id: 3898861
            },
            {
              id: 177620,
              login: "student7",
              url: "https://api.intra.42.fr/v2/users/student7",
              leader: true,
              occurrence: 0,
              validated: true,
              projects_user_id: 3920370
            }
          ],
          "locked?": true,
          "validated?": true,
          "closed?": true,
          repo_url: "git@vogsphere.42paris.fr:vogsphere/sample-repo5",
          repo_uuid: "sample-uuid5",
          locked_at: new Date().toISOString(),
          closed_at: new Date().toISOString(),
          project_session_id: 4503,
          project_gitlab_path: "pedago_world/42-cursus/inner-circle/short-comment-project"
        },
        feedbacks: [
          {
            id: 7421739,
            user: {
              login: "student6",
              id: 177576,
              url: "https://profile.intra.42.fr/users/student6"
            },
            feedbackable_type: "ScaleTeam",
            feedbackable_id: 7398656,
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
