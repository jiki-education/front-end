"use client";

import { useAuthStore } from "@/lib/auth/authStore";
import type { ProcessedGuide } from "@/lib/content/types";
import GuideHeader from "./GuideHeader";
import LoggedInGuideHeader from "./LoggedInGuideHeader";

interface GuideDetailHeaderProps {
  guide: ProcessedGuide;
}

/**
 * Picks the guide header by viewer: the purple hero for logged-out visitors
 * (and the pre-hydration server render), the app-scale header for logged-in
 * users.
 */
export default function GuideDetailHeader({ guide }: GuideDetailHeaderProps) {
  const user = useAuthStore((state) => state.user);
  return user ? <LoggedInGuideHeader guide={guide} /> : <GuideHeader guide={guide} />;
}
