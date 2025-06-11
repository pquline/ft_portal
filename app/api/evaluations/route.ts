import { Evaluation, fetchWithDelay } from '@/lib/api';
import { NextResponse } from 'next/server';

const API_BASE_URL = 'https://api.intra.42.fr';

export async function GET(request: Request) {
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
