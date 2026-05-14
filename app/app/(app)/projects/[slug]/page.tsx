"use client";

import Project from "@/components/project/Project";
import { use } from "react";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function ProjectPage({ params }: PageProps) {
  const { slug } = use(params);
  return <Project slug={slug} />;
}
