import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { hasAuthenticationCookie } from "../../lib/auth/server-storage";
import { LandingPage } from "../../components/landing-page/LandingPage";

export const metadata: Metadata = {
  title: "Jiki - Learn to Code the Fun Way",
  description:
    "Learn to code through world-class teaching hundreds of fun exercises and projects. Make games, solve puzzles, learn the fun way!"
};

export default async function RootPage() {
  const hasCookie = await hasAuthenticationCookie();
  if (hasCookie) {
    return redirect("/dashboard");
  }

  return <LandingPage />;
}
