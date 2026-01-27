import BlogPage from "@/components/blog/BlogPage";
import HeaderLayout from "@/components/layout/HeaderLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog - Jiki",
  description:
    "Read the latest articles about programming, coding challenges, and learning tips from the Jiki community."
};

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function AppBlogPage({ searchParams }: Props) {
  const { page } = await searchParams;

  return (
    <HeaderLayout>
      <BlogPage authenticated locale="en" page={page} />
    </HeaderLayout>
  );
}
