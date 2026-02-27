"use client";

import { useState } from "react";
import PersonIcon from "@/icons/person.svg";
import { resolveApiAssetUrl } from "@/lib/api/config";

interface AvatarPreviewProps {
  url: string | null;
  size: "sm" | "lg";
}

const sizeClasses = {
  sm: { container: "w-80 h-80", icon: "w-32 h-32" },
  lg: { container: "w-140 h-140", icon: "w-48 h-48" }
};

export default function AvatarPreview({ url, size }: AvatarPreviewProps) {
  const [imgError, setImgError] = useState(false);
  const classes = sizeClasses[size];

  if (url && !imgError) {
    return (
      // Avatar URL is dynamic from the backend API
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={resolveApiAssetUrl(url)}
        alt="Your avatar"
        className={`${classes.container} rounded-full object-cover flex-shrink-0`}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div
      className={`${classes.container} rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center flex-shrink-0`}
    >
      <PersonIcon className={`${classes.icon} text-gray-300`} />
    </div>
  );
}
