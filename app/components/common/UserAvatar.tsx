"use client";

import { useAuthStore } from "@/lib/auth/authStore";
import { resolveApiAssetUrl } from "@/lib/api/config";

const USER_FALLBACK = "/static/icons/user-fallback.svg";

interface UserAvatarProps {
  alt?: string;
  className?: string;
}

// Renders the authenticated user's avatar (from the auth store), falling back to
// a placeholder when there's no avatar or the image fails to load.
export default function UserAvatar({ alt = "User Avatar", className }: UserAvatarProps) {
  const avatarUrl = useAuthStore((state) => state.user?.avatar_url ?? null);

  return (
    // Avatar URL is dynamic from the backend API
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={avatarUrl ? resolveApiAssetUrl(avatarUrl) : USER_FALLBACK}
      alt={alt}
      className={className}
      onError={(e) => {
        e.currentTarget.src = USER_FALLBACK;
      }}
    />
  );
}
