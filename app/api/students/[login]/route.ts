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
      ],
      projects_users: [
        {
          id: 1,
          occurrence: 0,
          final_mark: 100,
          status: "finished",
          "validated?": true,
          project: {
            id: 1301,
            name: "C Piscine Exam 00",
            slug: "c-piscine-exam-00",
            parent_id: null
          },
          cursus_ids: [9],
          marked_at: "2024-02-09T16:44:24.883Z",
          marked: true,
          retriable_at: null,
          created_at: "2024-02-06T15:15:46.556Z",
          updated_at: "2024-02-09T19:55:50.956Z"
        },
        {
          id: 2,
          occurrence: 0,
          final_mark: 100,
          status: "finished",
          "validated?": true,
          project: {
            id: 1302,
            name: "C Piscine Exam 01",
            slug: "c-piscine-exam-01",
            parent_id: null
          },
          cursus_ids: [9],
          marked_at: "2024-02-16T16:47:54.114Z",
          marked: true,
          retriable_at: null,
          created_at: "2024-02-14T09:24:01.295Z",
          updated_at: "2024-02-20T10:22:21.390Z"
        },
        {
          id: 3,
          occurrence: 0,
          final_mark: 100,
          status: "finished",
          "validated?": true,
          project: {
            id: 1303,
            name: "C Piscine Exam 02",
            slug: "c-piscine-exam-02",
            parent_id: null
          },
          cursus_ids: [9],
          marked_at: "2024-02-23T17:18:08.462Z",
          marked: true,
          retriable_at: null,
          created_at: "2024-02-19T21:12:16.681Z",
          updated_at: "2024-02-23T19:09:18.970Z"
        },
        {
          id: 4,
          occurrence: 0,
          final_mark: 72,
          status: "finished",
          "validated?": true,
          project: {
            id: 1304,
            name: "C Piscine Final Exam",
            slug: "c-piscine-final-exam",
            parent_id: null
          },
          cursus_ids: [9],
          marked_at: "2024-03-01T15:13:34.537Z",
          marked: true,
          retriable_at: null,
          created_at: "2024-02-24T19:57:57.462Z",
          updated_at: "2024-03-01T17:34:48.273Z"
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

      if (response.status === 401) {
        return NextResponse.json({
          error: 'The access token expired. Please refresh your session.'
        }, { status: 401 })
      }

      return NextResponse.json({
        error: error.message || 'Failed to fetch student profile'
      }, { status: response.status })
    }

    const data: StudentResponse = await response.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch student profile' }, { status: 500 })
  }
}
