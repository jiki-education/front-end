"use client";

import Lesson from "@/components/lesson/Lesson";
import { use } from "react";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function LessonPage({ params }: PageProps) {
  const { slug } = use(params);
  return <Lesson slug={slug} />;
}
