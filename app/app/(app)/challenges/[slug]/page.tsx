"use client";

import Challenge from "@/components/challenge/Challenge";
import { use } from "react";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function ChallengePage({ params }: PageProps) {
  const { slug } = use(params);
  return <Challenge slug={slug} />;
}
