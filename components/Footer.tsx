import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto py-8 bg-secondary/10 backdrop-blur-sm border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-foreground/70 font-mono">
        <div className="flex justify-center gap-2 text-xs mb-4">
          <Link
            href="/about"
            className="text-foreground/80 hover:text-foreground hover:underline"
          >
            About
          </Link>
          <span className="text-foreground/80">-</span>
          <Link
            href="/privacy"
            className="text-foreground/80 hover:text-foreground hover:underline"
          >
            Privacy Policy
          </Link>
          <span className="text-foreground/80">-</span>
          <Link
            href="/terms"
            className="text-foreground/80 hover:text-foreground hover:underline"
          >
            Terms of Use
          </Link>
        </div>
        <div>
          <span className="text-primary">$</span>
          {" "}made with{" "}
          <span className="text-red-500">&lt;3</span> by{" "}
          <Link
            href="https://github.com/pquline"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:underline"
          >
            pquline
          </Link>
          <span> @ </span>
          <Link
            href="https://42.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:underline"
          >
            42 Paris
          </Link>
          <span className="text-yellow-400 animate-pulse"> █</span>
        </div>
      </div>
    </footer>
  );
}
