import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function Terms() {
  return (
    <main className="flex-1">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2 font-mono">Terms of Use</h2>
          <p className="text-muted-foreground text-sm">
            Rules and guidelines for using ft_portal
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-mono">Acceptable Use</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              By using <Link href="/" className="text-foreground font-mono">ft_portal</Link>, you agree to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
              <li>Use the service in accordance with 42&apos;s terms of service</li>
              <li>Not abuse or overload the 42 API</li>
              <li>Not share your account with others</li>
              <li>Use the data responsibly and ethically</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-mono">Data Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              When using <Link href="/" className="text-foreground font-mono">ft_portal</Link>, you agree to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
              <li>Use the data only for legitimate purposes</li>
              <li>Not scrape or collect data in bulk</li>
              <li>Respect student privacy and confidentiality</li>
              <li>Not use the data for harassment or discrimination</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-mono">Account Security</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              To maintain the security of your account:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
              <li>Keep your 42 account secure</li>
              <li>Sign out when using shared devices</li>
              <li>Report any security concerns immediately</li>
              <li>Not share your session with others</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-mono">Disclaimer</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              <Link href="/" className="text-foreground font-mono">ft_portal</Link> is provided as is without any warranties. We are not responsible for:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
              <li>Any misuse of the service</li>
              <li>Changes to the 42 API that may affect functionality</li>
              <li>Any consequences of using the service</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-mono">Changes to Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We reserve the right to modify these terms at any time. Continued use of <Link href="/" className="text-foreground font-mono">ft_portal</Link> after changes constitutes acceptance of the new terms.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
