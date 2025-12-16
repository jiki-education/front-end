import { LoginForm } from "@/components/auth/LoginForm";
import { ServerAuthGuard } from "@/components/layout/auth/external/ServerAuthGuard";
import { AuthLayout } from "@/components/ui/AuthLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log In - Jiki",
  description: "Sign in to your Jiki account"
};

export default function LoginPage() {
  return (
    <ServerAuthGuard>
      <AuthLayout>
        <LoginForm />
      </AuthLayout>
    </ServerAuthGuard>
  );
}
