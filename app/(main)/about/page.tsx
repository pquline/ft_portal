import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About ft_portal",
  description: "Learn about ft_portal, a comprehensive analytics platform for visualizing student data from the 42 API, including evaluations, academic performance, and hall voice data.",
  keywords: [
    "42 school",
    "student portal",
    "evaluation data",
    "student analytics",
    "42 API",
    "coding school",
    "student performance",
    "data visualization",
    "educational technology",
    "hall voice",
    "peer evaluations",
    "academic performance",
    "C Piscine",
    "analytics platform"
  ],
  openGraph: {
    title: "About ft_portal - 42 Student Analytics Platform",
    description: "Learn about ft_portal, a comprehensive analytics platform for visualizing student data from the 42 API, including evaluations, academic performance, and hall voice data.",
    url: "https://portal.pfischof.com/about",
  },
  twitter: {
    title: "About ft_portal - 42 Student Analytics Platform",
    description: "Learn about ft_portal, a comprehensive analytics platform for visualizing student data from the 42 API.",
  },
};

export default function About() {
  return (
    <main className="flex-1">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2 font-mono">About ft_portal</h2>
          <p className="text-muted-foreground text-sm">
            A comprehensive analytics platform for visualizing student data from the 42 API
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-mono">What is ft_portal?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              <Link href="/" className="text-foreground font-mono">
                ft_portal
              </Link>{" "}
              is a modern, comprehensive analytics platform that empowers the 42 community with advanced student analytics and performance insights. Built with Next.js 15, TypeScript, and modern web technologies, it provides detailed visualizations of student data directly from the 42 API.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-mono" id="features">
              Key Features
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="mb-4 font-mono text-sm">🔐 Secure Authentication</h3>
              <p className="text-muted-foreground">
                Secure OAuth 2.0 integration with the 42 API, featuring JWT token management, middleware-based route protection, and secure cookie handling with httpOnly and sameSite policies.
              </p>
            </div>

            <div>
              <h3 className="mb-4 font-mono text-sm">📊 Comprehensive Evaluation Analytics</h3>
              <p className="text-muted-foreground">
                Advanced evaluation statistics including peer evaluation performance metrics, interactive quality metrics with feedback length distribution analysis, project-specific performance tracking, and flag distribution visualization (Ok, Outstanding, Failed).
              </p>
            </div>

            <div>
              <h3 className="mb-4 font-mono text-sm">🎓 Academic Performance Tracking</h3>
              <p className="text-muted-foreground">
                Detailed C Piscine exam analysis with comprehensive scoring breakdowns, performance evolution tracking with trend analysis, success rate calculations, and predictive insights for academic progression.
              </p>
            </div>

            <div>
              <h3 className="mb-4 font-mono text-sm">🎵 Hall Voice Integration</h3>
              <p className="text-muted-foreground">
                Seamless integration with the{" "}
                <Link
                  className="text-foreground hover:underline font-mono"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://github.com/42paris/hall-voice"
                >
                  hall-voice repository
                </Link>
                , featuring custom audio playback interface, sound categorization (in/out sounds), and GitHub API integration for seamless file access.
              </p>
            </div>

            <div>
              <h3 className="mb-4 font-mono text-sm">📱 Modern User Experience</h3>
              <p className="text-muted-foreground">
                Progressive Web App (PWA) capabilities, responsive design with Tailwind CSS, dark/light theme support, real-time data visualization with Chart.js and Recharts, and comprehensive error handling with Discord webhook integration for production monitoring.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-mono" id="how-it-works">
              How it Works
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="mb-4 font-mono text-sm">1. Authentication</h3>
              <p className="text-muted-foreground">
                Click the &quot;Sign in&quot; button to authenticate with your 42 account using OAuth 2.0. Your session is managed securely using JWT tokens with automatic expiration handling and refresh capabilities.
              </p>
            </div>

            <div>
              <h3 className="mb-4 font-mono text-sm">2. Student Search</h3>
              <p className="text-muted-foreground">
                Enter any student&apos;s login to fetch comprehensive data from the 42 API. The platform retrieves real-time information including profile data, academic records, and project history.
              </p>
            </div>

            <div>
              <h3 className="mb-4 font-mono text-sm">3. Data Analysis & Visualization</h3>
              <p className="text-muted-foreground">
                The platform processes and visualizes data across multiple dimensions:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                <li>
                  <strong>Evaluation Analytics:</strong> Peer rating statistics, flag distribution analysis, feedback quality metrics, and project-specific performance data
                </li>
                <li>
                  <strong>Academic Performance:</strong> C Piscine exam analysis with detailed pass/fail tracking, performance evolution visualization, and success rate calculations
                </li>
                <li>
                  <strong>Hall Voice:</strong> Audio playback with custom player interface, categorized sound management, and seamless GitHub integration
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-mono">Technology Stack</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Built with modern web technologies for optimal performance and user experience:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li><strong>Frontend:</strong> Next.js 15, React 19, TypeScript, Tailwind CSS</li>
              <li><strong>UI Components:</strong> Radix UI primitives, shadcn/ui components</li>
              <li><strong>Data Visualization:</strong> Chart.js, Recharts for interactive charts</li>
              <li><strong>Authentication:</strong> 42 OAuth 2.0, JWT token management</li>
              <li><strong>State Management:</strong> React Hooks, React Hook Form with Zod validation</li>
              <li><strong>PWA Features:</strong> Service workers, offline capabilities, app-like experience</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-mono">Privacy & Security</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              <Link href="/" className="text-foreground font-mono">
                ft_portal
              </Link>{" "}
              is designed with privacy and security as core principles. All data is fetched directly from the 42 API and is not stored on our servers. Your session is managed securely using JWT tokens with automatic expiration, and you can sign out at any time. The platform includes comprehensive error monitoring and rate limiting to ensure reliable service.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-mono">Development & Contributing</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              ft_portal is an open-source project that welcomes contributions from the 42 community. The platform includes comprehensive development mode features with mock data for testing, detailed documentation, and a robust development workflow. Visit our{" "}
              <Link
                className="text-foreground hover:underline font-mono"
                target="_blank"
                rel="noopener noreferrer"
                href="https://github.com/pquline/ft_portal"
              >
                GitHub repository
              </Link>{" "}
              to learn more about contributing.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
