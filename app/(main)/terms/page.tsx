import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use - ft_portal",
  description: "Rules and guidelines for using ft_portal. Learn about acceptable use, data usage policies, API limitations, and account security requirements.",
  keywords: [
    "terms of use",
    "acceptable use",
    "42 school",
    "student portal",
    "data usage",
    "account security",
    "service terms",
    "user guidelines",
    "API usage",
    "service agreement",
    "user guidelines",
    "API usage",
    "service agreement"
  ],
  openGraph: {
    title: "Terms of Use - ft_portal",
    description: "Rules and guidelines for using ft_portal. Learn about acceptable use, data usage policies, API limitations, and account security requirements.",
    url: "https://portal.pfischof.com/terms",
  },
  twitter: {
    title: "Terms of Use - ft_portal",
    description: "Rules and guidelines for using ft_portal.",
  },
};

export default function Terms() {
  return (
    <main className="flex-1">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2 font-mono">Terms of Use</h2>
          <p className=" text-sm">
            Rules and guidelines for using ft_portal
          </p>
          <p className=" text-xs mt-2">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-mono">Acceptance of Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              By accessing and using <Link href="/" className="text-foreground font-mono">ft_portal</Link>, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-mono">Acceptable Use</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              By using <Link href="/" className="text-foreground font-mono">ft_portal</Link>, you agree to:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Use the service in accordance with 42&apos;s terms of service and community guidelines</li>
              <li>Respect the privacy and rights of other students whose data you may access</li>
              <li>Use the data for legitimate educational or community purposes only</li>
              <li>Not attempt to circumvent any security measures or access controls</li>
              <li>Not use the service for any illegal or unauthorized purpose</li>
              <li>Not interfere with or disrupt the service or servers</li>
              <li>Not attempt to gain unauthorized access to any part of the service</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-mono">Data Usage & Privacy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              When using <Link href="/" className="text-foreground font-mono">ft_portal</Link>, you agree to:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Use the data only for legitimate educational or community purposes</li>
              <li>Respect student privacy and confidentiality</li>
              <li>Not use the data for harassment, discrimination, or any harmful purpose</li>
              <li>Not share or distribute student data without proper authorization</li>
              <li>Not use the data for commercial purposes without explicit permission</li>
              <li>Comply with applicable data protection laws and regulations</li>
            </ul>
            <p className="mt-4">
              All data accessed through ft_portal remains subject to 42&apos;s privacy policies and data protection regulations.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-mono">Account Security</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              To maintain the security of your account and the service:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Keep your 42 account credentials secure and confidential</li>
              <li>Sign out when using shared or public devices</li>
              <li>Report any security concerns or suspicious activity immediately</li>
              <li>Not share your session tokens or authentication credentials</li>
              <li>Not attempt to access other users&apos; accounts or data</li>
              <li>Use strong, unique passwords for your 42 account</li>
              <li>Enable two-factor authentication on your 42 account if available</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-mono">Changes to Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="">
              We reserve the right to modify these terms at any time. We will notify users of any material changes by updating the &quot;Last updated&quot; date at the top of this page. Continued use of <Link href="/" className="text-foreground font-mono">ft_portal</Link> after changes constitutes acceptance of the new terms. If you do not agree to the modified terms, you should discontinue use of the service.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-mono">Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="">
              If you have any questions about these terms of use, please contact us through our{" "}
              <Link
                className="text-foreground hover:underline font-mono"
                target="_blank"
                rel="noopener noreferrer"
                href="https://github.com/pquline/ft_portal"
              >
                GitHub repository
              </Link>
              {" "}by creating an issue in the repository.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
