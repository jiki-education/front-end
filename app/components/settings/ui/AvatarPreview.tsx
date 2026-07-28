"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import PersonIcon from "@/icons/person.svg";
import { resolveApiAssetUrl } from "@/lib/api/config";
import { assembleClassNames } from "@/lib/assemble-classnames";
import styles from "./AvatarPreview.module.css";

interface AvatarPreviewProps {
  url: string | null;
  size: "sm" | "lg";
}

export default function AvatarPreview({ url, size }: AvatarPreviewProps) {
  const t = useTranslations("settings.avatarPreview");
  const [imgError, setImgError] = useState(false);

  if (url && !imgError) {
    return (
      // Avatar URL is dynamic from the backend API
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={resolveApiAssetUrl(url)}
        alt={t("alt")}
        className={assembleClassNames(styles.avatar, styles[size])}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div className={assembleClassNames(styles.placeholder, styles[size])}>
      <PersonIcon className={assembleClassNames(styles.icon, styles[size])} />
    </div>
  );
}
