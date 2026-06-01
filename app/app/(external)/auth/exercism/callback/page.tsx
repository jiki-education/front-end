import { ExercismCallbackHandler } from "@/components/auth/ExercismCallbackHandler";
import { AuthLayout } from "@/components/ui/AuthLayout";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Signing in with Exercism - Jiki",
  description: "Completing your Exercism sign in"
};

export default function ExercismCallbackPage() {
  return (
    <AuthLayout>
      <Suspense>
        <ExercismCallbackHandler />
      </Suspense>
    </AuthLayout>
  );
}
