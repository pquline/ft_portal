import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const login = searchParams.get("login");

  if (!login) {
    return NextResponse.json({ error: "Login parameter is required" }, { status: 400 });
  }

  try {
    // Fetch hall voice directory listing from GitHub API
    const response = await fetch(`https://api.github.com/repos/42paris/hall-voice/contents/mp3/${login}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'ft_portal/1.0'
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({
          hasHallVoice: false,
          inSounds: [],
          outSounds: []
        });
      }
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const files = await response.json();

    if (!Array.isArray(files)) {
      return NextResponse.json({
        hasHallVoice: false,
        inSounds: [],
        outSounds: []
      });
    }

    const audioFiles = files.filter((file: any) =>
      file.type === 'file' &&
      (file.name.endsWith('.mp3') || file.name.endsWith('.wav') || file.name.endsWith('.ogg'))
    );

    const inSounds: string[] = [];
    const outSounds: string[] = [];

    audioFiles.forEach((file: any) => {
      const soundUrl = `https://raw.githubusercontent.com/42paris/hall-voice/master/mp3/${login}/${file.name}`;

      if (file.name.toLowerCase().includes('in') || file.name.toLowerCase().includes('enter')) {
        inSounds.push(soundUrl);
      } else if (file.name.toLowerCase().includes('out') || file.name.toLowerCase().includes('exit')) {
        outSounds.push(soundUrl);
      } else {
        inSounds.push(soundUrl);
      }
    });

    return NextResponse.json({
      hasHallVoice: audioFiles.length > 0,
      inSounds,
      outSounds
    });

  } catch (error) {
    console.error('Error fetching hall voice data:', error);
    return NextResponse.json({
      hasHallVoice: false,
      inSounds: [],
      outSounds: []
    }, { status: 500 });
  }
}
