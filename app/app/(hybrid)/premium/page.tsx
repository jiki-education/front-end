import type { Metadata } from "next";
import { PremiumPage } from "@/components/premium/PremiumPage";

export const metadata: Metadata = {
  title: "Premium - Jiki",
  description:
    "Accelerate your road to job-ready with Jiki Premium. Full access to courses, projects, AI support, and more."
};

export default function Page() {
  return <PremiumPage />;
}
