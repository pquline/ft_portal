import Link from "next/link";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

interface HeaderProps {
  hasCredentials: boolean;
}

export function Header({ hasCredentials }: HeaderProps) {
  return (
    <header className="bg-white dark:bg-secondary/50 backdrop-blur-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/ft_portal.png" alt="ft_portal logo" />
            </Avatar>
          </Link>
          <Link href="/" className="text-lg font-semibold font-mono">
            <h1 className="text-2xl font-bold text-primary-900">ft_portal</h1>
          </Link>
        </div>
        {(hasCredentials && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100/80 backdrop-blur-sm text-green-800 font-mono">
            API Connected
          </span>
        )) || (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100/80 backdrop-blur-sm text-red-800 font-mono">
            API Not Connected
          </span>
        )}
      </div>
    </header>
  );
}
