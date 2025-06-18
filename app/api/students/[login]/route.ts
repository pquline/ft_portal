import { API_BASE_URL, fetchWithDelay } from '@/lib/api';
import { NextResponse } from 'next/server';

interface StudentResponse {
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

interface LogData {
  login: string;
  event: 'search_started' | 'search_failed' | 'search_successful' | 'search_exception';
  error?: string;
  status?: number;
  student_id?: number;
}

async function sendToBetterStack(level: 'info' | 'error', message: string, data: LogData) {
  const sourceToken = process.env.BETTERSTACK_SOURCE_TOKEN;

  if (!sourceToken) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Better Stack] ${level.toUpperCase()}: ${message}`, data);
    }
    return;
  }

  try {
    const response = await fetch('https://in.logs.betterstack.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sourceToken}`
      },
      body: JSON.stringify({
        level,
        message,
        timestamp: new Date().toISOString(),
        ...data
      })
    });

    if (!response.ok) {
      if (process.env.NODE_ENV === 'development') {
        console.error(`[Better Stack] Failed to send log: ${response.status} ${response.statusText}`);
      }
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[Better Stack] Network error:', error);
    }
  }
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('Authorization')

  if (!authHeader) {
    return NextResponse.json({ error: 'Missing authorization header' }, { status: 401 })
  }

  const login = request.url.split('/').pop();

  if (!login) {
    return NextResponse.json({ error: 'Missing login parameter' }, { status: 400 });
  }

  try {
    const response = await fetchWithDelay(`${API_BASE_URL}/v2/users/${login}`, {
      headers: {
        Authorization: authHeader,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      await sendToBetterStack('error', 'Login search failed', {
        login,
        error: error.message || 'Failed to fetch profile',
        status: response.status,
        event: 'search_failed'
      });
      return NextResponse.json({ error: error.message || 'Failed to fetch profile' }, { status: response.status })
    }

    const data: StudentResponse = await response.json()
    await sendToBetterStack('info', 'Login search successful', {
      login,
      student_id: data.id,
      event: 'search_successful'
    });
    return NextResponse.json(data)
  } catch (error) {
    await sendToBetterStack('error', 'Login search exception', {
      login,
      error: error instanceof Error ? error.message : 'Unknown error',
      event: 'search_exception'
    });
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}
