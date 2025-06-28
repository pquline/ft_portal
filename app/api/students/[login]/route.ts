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

export async function GET(request: Request) {
  // Return mock student data in development
  if (process.env.NODE_ENV !== 'production') {
    const login = request.url.split('/').pop() || 'dev_user';
    return NextResponse.json({
      id: 1,
      email: `${login}@student.42.fr`,
      login: login,
      first_name: 'Dev',
      last_name: 'User',
      usual_first_name: 'Dev',
      usual_full_name: 'Dev User',
      url: `https://api.intra.42.fr/v2/users/${login}`,
      phone: '+1234567890',
      displayname: 'Dev User',
      kind: 'student',
      image: {
        link: 'https://via.placeholder.com/150',
        versions: {
          large: 'https://via.placeholder.com/300',
          medium: 'https://via.placeholder.com/200',
          small: 'https://via.placeholder.com/100',
          micro: 'https://via.placeholder.com/50'
        }
      },
      correction_point: 10,
      wallet: 100,
      cursus_users: [
        {
          cursus_id: 1,
          cursus: {
            id: 1,
            name: '42',
            slug: '42'
          },
          level: 10.5,
          skills: [
            {
              id: 1,
              name: 'C',
              level: 10.5
            },
            {
              id: 2,
              name: 'Python',
              level: 8.2
            }
          ]
        }
      ]
    });
  }

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
      return NextResponse.json({ error: error.message || 'Failed to fetch student profile' }, { status: response.status })
    }

    const data: StudentResponse = await response.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch student profile' }, { status: 500 })
  }
}
