import { User } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface HeaderAvatarProps {
  profilePicture: string | null;
  login: string;
}

const HeaderAvatar = ({ profilePicture, login }: HeaderAvatarProps) => {
  const [imageError, setImageError] = useState(false);

  if (!profilePicture || !login || imageError) {
    return (
      <div
        role="img"
        aria-label={`${login || 'User'}'s avatar`}
        className="relative h-8 w-8 rounded-full overflow-hidden border border-border bg-muted flex items-center justify-center"
      >
        <User className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={`${login}'s avatar`}
      className="relative h-8 w-8 rounded-full overflow-hidden border border-border"
    >
      <Image
        src={profilePicture}
        alt={`${login}'s avatar`}
        fill
        className="object-cover"
        aria-hidden="true"
        onError={() => setImageError(true)}
        unoptimized={false}
      />
    </div>
  );
};

export default HeaderAvatar;
