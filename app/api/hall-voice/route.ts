import { NextRequest, NextResponse } from "next/server";

interface GitHubFile {
  type: string;
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string | null;
}

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

    const directories = await response.json() as GitHubFile[];

    if (!Array.isArray(directories)) {
      return NextResponse.json({
        hasHallVoice: false,
        inSounds: [],
        outSounds: []
      });
    }

    const inSounds: string[] = [];
    const outSounds: string[] = [];

    // Check for 'in' directory
    const inDir = directories.find((dir: GitHubFile) => dir.type === 'dir' && dir.name === 'in');
    if (inDir) {
      const inResponse = await fetch(`https://api.github.com/repos/42paris/hall-voice/contents/mp3/${login}/in`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'ft_portal/1.0'
        }
      });

      if (inResponse.ok) {
        const inFiles = await inResponse.json() as GitHubFile[];
        inFiles.forEach((file: GitHubFile) => {
          if (file.type === 'file' && (file.name.endsWith('.mp3') || file.name.endsWith('.wav') || file.name.endsWith('.ogg'))) {
            const soundUrl = `https://raw.githubusercontent.com/42paris/hall-voice/master/mp3/${login}/in/${file.name}`;
            inSounds.push(soundUrl);
          }
        });
      }
    }

    // Check for 'out' directory
    const outDir = directories.find((dir: GitHubFile) => dir.type === 'dir' && dir.name === 'out');
    if (outDir) {
      const outResponse = await fetch(`https://api.github.com/repos/42paris/hall-voice/contents/mp3/${login}/out`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'ft_portal/1.0'
        }
      });

      if (outResponse.ok) {
        const outFiles = await outResponse.json() as GitHubFile[];
        outFiles.forEach((file: GitHubFile) => {
          if (file.type === 'file' && (file.name.endsWith('.mp3') || file.name.endsWith('.wav') || file.name.endsWith('.ogg'))) {
            const soundUrl = `https://raw.githubusercontent.com/42paris/hall-voice/master/mp3/${login}/out/${file.name}`;
            outSounds.push(soundUrl);
          }
        });
      }
    }

    return NextResponse.json({
      hasHallVoice: inSounds.length > 0 || outSounds.length > 0,
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
