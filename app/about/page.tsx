import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function About() {
  return (
    <main className="flex-1">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2 font-mono">About ft_portal</h2>
          <p className="text-muted-foreground text-sm">
            The ultimate tool for viewing 42 student data
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
              is a powerful tool that allows you to view detailed insights
              about 42 students, such as their evaluations. It provides insights
              into student performance and activity patterns within the 42
              network.
            </p>
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
                To use{" "}
                <Link href="/" className="text-foreground font-mono">
                  ft_portal
                </Link>
                , you need to authenticate with your 42 API credentials. You can
                get these from your{" "}
                <Link
                  href="https://profile.intra.42.fr/oauth/applications"
                  className="text-foreground hover:underline font-mono"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  42 OAuth applications
                </Link>
                . Your credentials are stored locally in your browser and are
                never sent to our servers.
              </p>
            </div>

            <div>
              <h3 className="mb-4 font-mono text-sm">2. Search for Students</h3>
              <p className="text-muted-foreground">
                Once authenticated, you can search for any student by their
                login. The tool will fetch and display comprehensive statistics
                about their activity at 42.
              </p>
            </div>

            <div>
              <h3 className="mb-4 font-mono text-sm">3. View Statistics</h3>
              <p className="text-muted-foreground">
                The tool provides several categories of insights:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                <li>
                  Evaluations as a corrector: Peer rating, flag distribution,
                  feedback length distribution and data about the projects
                </li>
                <li>
                  Hall Voice: Access to student&apos;s hall voice sounds,
                  including separate sections for &quot;In&quot; and
                  &quot;Out&quot; sounds with integrated audio playback. Sounds
                  are fetched from{" "}
                  <Link
                    className="text-foreground hover:underline font-mono"
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://github.com/42paris/hall-voice"
                  >
                    GitHub
                  </Link>
                  .
                </li>
              </ul>
            </div>
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
              is designed with privacy and security in mind. All data is fetched
              directly from the 42 API and is not stored on our servers. Your
              API credentials are stored locally in your browser and can be
              removed at any time using the{" "}
              <span className="font-mono text-foreground/90">Forget</span>{" "}
              button.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
