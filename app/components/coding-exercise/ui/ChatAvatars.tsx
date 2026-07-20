import { useTranslations } from "next-intl";
import UserAvatar from "@/components/common/UserAvatar";
import { staticAsset } from "@/lib/static-asset";

export function JikiAvatarImg() {
  const t = useTranslations("codingExercise.avatars");
  // Plain <img> rather than next/image: next/image inserts nodes asynchronously,
  // which conflicts with React reconciliation as the message list changes.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={staticAsset("images/chat-jiki-avatar.png")} alt={t("jikiAlt")} width={36} height={36} />;
}

export function UserAvatarImg({ className }: { className?: string }) {
  const t = useTranslations("codingExercise.avatars");
  return <UserAvatar alt={t("userAlt")} className={className} />;
}
