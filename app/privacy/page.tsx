import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function Privacy() {
  return (
    <main className="flex-1">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2 font-mono">Privacy Policy</h2>
          <p className="text-muted-foreground text-sm">
            How we handle your data and protect your privacy
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-mono">Data Collection</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              <Link href="/" className="text-foreground font-mono">ft_stats</Link> is designed with privacy as a core principle. We do not collect, store, or process any personal data on our servers. All data is fetched directly from the 42 API and is only stored locally in your browser.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-mono">Local Storage</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              The only data stored locally in your browser are:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
              <li>Your 42 API credentials (client_id and client_secret)</li>
              <li>The access token received from the 42 API</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              This data is stored in your browser&apos;s local storage and can be removed at any time using the <span className="font-mono text-foreground/90">Forget</span> button.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-mono">Third-Party Services</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              <Link href="/" className="text-foreground font-mono">ft_stats</Link> interacts with the following third-party services:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
              <li>The official 42 API for student data and statistics</li>
              <li>GitHub API for accessing hall voice sound files</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              We do not use any third-party analytics, tracking, or advertising services. Your data is never shared with any third parties.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-mono">Your Rights</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Since we don&apos;t store any of your data on our servers, you have complete control over your information. You can:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
              <li>Remove your credentials at any time using the Forget button</li>
              <li>Clear your browser&apos;s local storage to remove all stored data</li>
              <li>Stop using the service at any time</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
