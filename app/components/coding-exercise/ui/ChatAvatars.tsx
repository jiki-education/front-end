import UserAvatar from "@/components/common/UserAvatar";

export function JikiAvatarImg() {
  // Plain <img> rather than next/image: next/image inserts nodes asynchronously,
  // which conflicts with React reconciliation as the message list changes.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/static/images/chat-jiki-avatar.png" alt="Jiki" width={36} height={36} />;
}

export function UserAvatarImg({ className }: { className?: string }) {
  return <UserAvatar alt="You" className={className} />;
}
