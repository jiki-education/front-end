import { AuthGuard } from "@/app/(external)/AuthGuard";
import { SignupForm } from "@/components/auth/SignupForm";
import { AuthLayout } from "@/components/ui/AuthLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up - Jiki",
  description: "Create your Jiki account"
};

export default function SignupPage() {
  return (
    <AuthGuard>
      <AuthLayout>
        <SignupForm />
      </AuthLayout>
    </AuthGuard>
  );
}
