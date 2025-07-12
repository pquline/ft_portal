import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy - ft_portal",
  description: "Learn how ft_portal handles your data and protects your privacy. We do not collect, store, or process any personal data on our servers. All data is fetched directly from the 42 API.",
  keywords: [
    "privacy policy",
    "data protection",
    "42 school",
    "student portal",
    "privacy",
    "data security",
    "OAuth",
    "session management",
    "GDPR compliance",
    "data privacy",
    "user rights"
  ],
  openGraph: {
    title: "Privacy Policy - ft_portal",
    description: "Learn how ft_portal handles your data and protects your privacy. We do not collect, store, or process any personal data on our servers.",
    url: "https://portal.pfischof.com/privacy",
  },
  twitter: {
    title: "Privacy Policy - ft_portal",
    description: "Learn how ft_portal handles your data and protects your privacy.",
  },
};

export default function Privacy() {
  return (
    <main className="flex-1">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2 font-mono">Privacy Policy</h2>
          <p className="text-muted-foreground text-sm">
            How we handle your data and protect your privacy
          </p>
          <p className="text-muted-foreground text-xs mt-2">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-mono">Our Privacy Commitment</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              <Link href="/" className="text-foreground font-mono">ft_portal</Link> is designed with privacy as a core principle. We believe in transparency about how we handle your data and are committed to protecting your privacy rights. This policy explains how we collect, use, and protect your information.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-mono">Data Collection & Storage</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              <strong>No Server-Side Data Storage:</strong> We do not collect, store, or process any personal data on our servers. All data is fetched directly from the 42 API and is only stored temporarily in your browser&apos;s session.
            </p>
            <p className="text-muted-foreground">
              <strong>Real-Time Data Access:</strong> When you search for a student, we make real-time API calls to the 42 API to retrieve the requested information. This data is displayed to you but never stored on our infrastructure.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-mono">Session Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              The only data stored in your browser are:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
              <li><strong>Session Token (JWT):</strong> Encrypted authentication token for maintaining your login session</li>
              <li><strong>User Information:</strong> Your name, login, and profile picture from your 42 account</li>
              <li><strong>Theme Preference:</strong> Your dark/light mode preference (if enabled)</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              This data is stored in your browser&apos;s secure cookies and is automatically removed when you sign out or when your session expires (2 hours). We use httpOnly and sameSite cookie policies for enhanced security.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-mono">Third-Party Services</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              <Link href="/" className="text-foreground font-mono">ft_portal</Link> interacts with the following third-party services:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
              <li><strong>42 API:</strong> Official 42 API for student data, evaluations, and academic records</li>
              <li><strong>GitHub API:</strong> For accessing hall voice sound files from the 42paris/hall-voice repository</li>
              <li><strong>Discord Webhooks:</strong> For error monitoring and system alerts (production only)</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              <strong>No Analytics or Tracking:</strong> We do not use any third-party analytics, tracking, or advertising services. Your data is never shared with any third parties for marketing or commercial purposes.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-mono">Data Security Measures</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              We implement several security measures to protect your data:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
              <li><strong>OAuth 2.0 Authentication:</strong> Secure authentication through 42&apos;s official OAuth system</li>
              <li><strong>JWT Token Management:</strong> Encrypted session tokens with automatic expiration</li>
              <li><strong>HTTPS Encryption:</strong> All data transmission is encrypted using TLS/SSL</li>
              <li><strong>Secure Cookies:</strong> httpOnly and sameSite policies prevent XSS and CSRF attacks</li>
              <li><strong>Rate Limiting:</strong> API rate limiting to prevent abuse and ensure service stability</li>
              <li><strong>Error Monitoring:</strong> Secure error reporting without exposing sensitive data</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-mono">Your Privacy Rights</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              You have full control over your data and privacy:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
              <li><strong>Right to Access:</strong> You can view all data we have about you (stored in your browser)</li>
              <li><strong>Right to Deletion:</strong> Sign out at any time to immediately clear all session data</li>
              <li><strong>Right to Portability:</strong> All data is accessible through your browser&apos;s developer tools</li>
              <li><strong>Right to Revoke Access:</strong> Revoke ft_portal&apos;s access through your 42 OAuth applications settings</li>
              <li><strong>Right to Object:</strong> You can stop using the service at any time</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              Since we don&apos;t store your data on our servers, most privacy rights are automatically satisfied. Your data remains under your control at all times.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-mono">Data Retention</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              <strong>No Data Retention:</strong> We do not retain any personal data on our servers. Session data stored in your browser is automatically cleared when:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
              <li>You manually sign out</li>
              <li>Your session expires (2 hours)</li>
              <li>You clear your browser cookies</li>
              <li>You close your browser (depending on your browser settings)</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-mono">Children&apos;s Privacy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              ft_portal is designed for use by 42 students and community members. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-mono">Changes to This Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We may update this privacy policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify users of any material changes by updating the &quot;Last updated&quot; date at the top of this policy. Continued use of ft_portal after changes constitutes acceptance of the updated policy.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-mono">Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              If you have any questions about this privacy policy or our data practices, please contact us through our{" "}
              <Link
                className="text-foreground hover:underline font-mono"
                target="_blank"
                rel="noopener noreferrer"
                href="https://github.com/pquline/ft_portal"
              >
                GitHub repository
              </Link>
              {" "}or by creating an issue in the repository.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
