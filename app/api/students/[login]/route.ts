import { API_BASE_URL, fetchWithDelay, StudentProfile } from '@/lib/api'
import { NextResponse } from 'next/server'

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
      return NextResponse.json({ error: error.message || 'Failed to fetch student profile' }, { status: response.status })
    }

    const data: StudentProfile = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching student profile:', error)
    return NextResponse.json({ error: 'Failed to fetch student profile' }, { status: 500 })
  }
}
