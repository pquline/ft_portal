import Link from "next/link";

export function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-secondary-50 flex flex-col items-center justify-between">
      <main className="flex-1 w-full flex items-center justify-center">{children}</main>
      <footer className="w-full py-6 bg-white dark:bg-secondary/50 backdrop-blur-sm border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-foreground/70 font-mono">
          <div>
            <span className="text-primary">$&#62; </span>./made
            {" "}with{" "}
            <span className="text-red-500">&lt;3</span>
            <span> on </span>
            <Link
              href="https://github.com/pquline/ft_portal"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:underline"
            >
              GitHub
            </Link>
            <span className="text-yellow-400 animate-pulse"> █</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
