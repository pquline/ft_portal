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
    "service agreement"
    "user guidelines",
    "API usage",
    "service agreement"
  ],
  openGraph: {
    title: "Terms of Use - ft_portal",
    description: "Rules and guidelines for using ft_portal. Learn about acceptable use, data usage policies, API limitations, and account security requirements.",
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
            <p className="">
              By accessing and using <Link href="/" className="text-foreground font-mono">ft_portal</Link>, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-mono">Service Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="">
              ft_portal is a comprehensive analytics platform that provides visualization and analysis of student data from the 42 API. The service includes evaluation analytics, academic performance tracking, hall voice integration, and data visualization tools designed for the 42 community.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-mono">Acceptable Use</CardTitle>
          </CardHeader>
          <CardContent>
            <p className=" mb-4">
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
            <CardTitle className="font-mono">API Usage & Rate Limiting</CardTitle>
          </CardHeader>
          <CardContent>
            <p className=" mb-4">
              ft_portal integrates with the 42 API and GitHub API. You agree to:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Respect the rate limits and usage policies of both the 42 API and GitHub API</li>
              <li>Not abuse or overload the APIs through excessive requests</li>
              <li>Not attempt to scrape or collect data in bulk without authorization</li>
              <li>Use the APIs in accordance with their respective terms of service</li>
              <li>Accept that API availability and response times may vary</li>
            </ul>
            <p className=" mt-4">
              We implement rate limiting and request throttling to ensure fair usage and service stability for all users.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-mono">Data Usage & Privacy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className=" mb-4">
              When using <Link href="/" className="text-foreground font-mono">ft_portal</Link>, you agree to:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Use the data only for legitimate educational or community purposes</li>
              <li>Respect student privacy and confidentiality</li>
              <li>Not use the data for harassment, discrimination, or any harmful purpose</li>
              <li>Not share or distribute student data without proper authorization</li>
              <li>Not use the data for commercial purposes without explicit permission</li>
              <li>Comply with applicable data protection laws and regulations</li>
              <li>Not use the data for harassment, discrimination, or any harmful purpose</li>
              <li>Not share or distribute student data without proper authorization</li>
              <li>Not use the data for commercial purposes without explicit permission</li>
              <li>Comply with applicable data protection laws and regulations</li>
            </ul>
            <p className=" mt-4">
              All data accessed through ft_portal remains subject to 42&apos;s privacy policies and data protection regulations.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-mono">Account Security</CardTitle>
          </CardHeader>
          <CardContent>
            <p className=" mb-4">
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
            <CardTitle className="font-mono">Intellectual Property</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="">
              ft_portal and its original content, features, and functionality are owned by the ft_portal team and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws. The service is provided as-is without any warranties regarding ownership or rights to the underlying data, which remains the property of 42 and respective data owners.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-mono">Service Availability</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="">
              ft_portal is provided on an &quot;as is&quot; and &quot;as available&quot; basis. We do not guarantee uninterrupted or error-free service. The service may be temporarily unavailable due to maintenance, updates, or technical issues. We reserve the right to modify, suspend, or discontinue the service at any time with or without notice.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-mono">Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="">
              In no event shall ft_portal, its developers, or contributors be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the service. We are not responsible for any misuse of the service, changes to the 42 API that may affect functionality, or any consequences of using the service.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-mono">Indemnification</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="">
              You agree to defend, indemnify, and hold harmless ft_portal, its developers, and contributors from and against any claims, damages, obligations, losses, liabilities, costs, or debt arising from your use of the service or violation of these terms.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-mono">Governing Law</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="">
              These terms shall be governed by and construed in accordance with the laws of the jurisdiction where the service is hosted, without regard to its conflict of law provisions. Any disputes arising from these terms or your use of the service shall be resolved through appropriate legal channels.
            </p>
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
              {" "}or by creating an issue in the repository.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
