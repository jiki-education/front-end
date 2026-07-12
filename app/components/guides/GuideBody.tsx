"use client";

import MarkdownContent from "@/components/content/MarkdownContent";
import { useAuthStore } from "@/lib/auth/authStore";

interface GuideBodyProps {
  content: string;
}

/**
 * Renders a free guide's body at the scale that suits the viewer: large type
 * for logged-out visitors (matching the marketing-style hero), base type
 * inside the app for logged-in users.
 */
export default function GuideBody({ content }: GuideBodyProps) {
  const user = useAuthStore((state) => state.user);
  return <MarkdownContent content={content} variant={user ? "base" : "large"} />;
}
