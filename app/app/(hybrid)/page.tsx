import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { hasAuthenticationCookie } from "../../lib/auth/server-storage";
import { LandingPage } from "../../components/landing-page/LandingPage";
import { getAllBlogPosts } from "../../lib/content/getAllBlogPosts";

export const metadata: Metadata = {
  title: "Jiki - Learn to Code the Fun Way",
  description: "The best way to learn to code and build in the LLM-era! By the team behind Exercism"
};

export default async function RootPage() {
  const hasCookie = await hasAuthenticationCookie();
  if (hasCookie) {
    return redirect("/dashboard");
  }

  const latestPosts = getAllBlogPosts("en").slice(0, 3);

  return <LandingPage latestPosts={latestPosts} />;
}
