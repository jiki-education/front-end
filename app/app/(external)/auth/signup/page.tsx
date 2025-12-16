import { SignupForm } from "@/components/auth/SignupForm";
import { ServerAuthGuard } from "@/components/layout/auth/external/ServerAuthGuard";
import { AuthLayout } from "@/components/ui/AuthLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up - Jiki",
  description: "Create your Jiki account"
};

export default function SignupPage() {
  return (
    <ServerAuthGuard>
      <AuthLayout>
        <SignupForm />
      </AuthLayout>
    </ServerAuthGuard>
  );
}
