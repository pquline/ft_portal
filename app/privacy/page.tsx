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
              <Link href="/" className="text-foreground font-mono">ft_portal</Link> is designed with privacy as a core principle. We do not collect, store, or process any personal data on our servers. All data is fetched directly from the 42 API and is only stored temporarily in your browser&apos;s session.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-mono">Session Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              The only data stored in your browser are:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
              <li>Your session token (JWT)</li>
              <li>Your user information (name, login, profile picture)</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              This data is stored in your browser&apos;s cookies and is automatically removed when you sign out or when your session expires (24 hours).
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-mono">Third-Party Services</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              <Link href="/" className="text-foreground font-mono">ft_portal</Link> interacts with the following third-party services:
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
              You have full control over your data:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
              <li>Sign out at any time using the Sign out button</li>
              <li>Clear your session data by signing out</li>
              <li>Revoke access to your 42 account through your 42 OAuth applications settings</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
