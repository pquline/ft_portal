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
          name: "Ok"
        },
        feedback_rating: 5,
        team: {
          id: 1,
          name: "Sample Project"
        }
      },
      {
        id: 2,
        scale_id: 1,
        comment: "Great work!",
        feedback: "Excellent implementation",
        final_mark: 100,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        flag: {
          id: 1,
          name: "Outstanding project"
        },
        feedback_rating: 5,
        team: {
          id: 1,
          name: "Sample Project"
        }
      },
      {
        id: 3,
        scale_id: 1,
        comment: "Great work!",
        feedback: "Excellent implementation",
        final_mark: 100,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        flag: {
          id: 1,
          name: "Outstanding project"
        },
        feedback_rating: 5,
        team: {
          id: 1,
          name: "Sample Project"
        }
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
          id: 1,
          name: "Outstanding project"
        },
        feedback_rating: 5,
        team: {
          id: 1,
          name: "Sample Project"
        }
      },
      {
        id: 5,
        scale_id: 1,
        comment: "Great work...",
        feedback: "Excellent implementation",
        final_mark: 100,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        flag: {
          id: 1,
          name: "Outstanding project"
        },
        feedback_rating: 5,
        team: {
          id: 1,
          name: "Sample Project"
        }
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
