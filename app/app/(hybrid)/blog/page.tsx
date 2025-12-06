import BlogPage from "@/components/blog/BlogPage";
import HeaderLayout from "@/components/layout/HeaderLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog - Jiki",
  description:
    "Read the latest articles about programming, coding challenges, and learning tips from the Jiki community."
};

export default function AppBlogPage() {
  // Always render authenticated view since ClientAuthGuard ensures user is authenticated
  return (
    <HeaderLayout>
      <BlogPage authenticated locale="en" />
    </HeaderLayout>
  );
}
