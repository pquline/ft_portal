import { NextResponse } from 'next/server'
import { API_BASE_URL } from '@/lib/api'

async function fetchWithDelay(url: string, options: RequestInit = {}) {
  const response = await fetch(url, options);
  await new Promise((resolve) => setTimeout(resolve, 500));
  return response;
}

export async function POST(request: Request) {
  try {
    const credentials = await request.json()

    const response = await fetchWithDelay(`${API_BASE_URL}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'client_credentials',
        client_id: credentials.clientId,
        client_secret: credentials.clientSecret,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(
        { error: error.error_description || error.error || 'Failed to get access token' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error getting access token:', error)
    return NextResponse.json(
      { error: 'Failed to get access token' },
      { status: 500 }
    )
  }
}
