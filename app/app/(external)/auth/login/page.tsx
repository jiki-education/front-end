import { AuthGuard } from "@/app/(external)/AuthGuard";
import { LoginForm } from "@/components/auth/LoginForm";
import { AuthLayout } from "@/components/ui/AuthLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log In - Jiki",
  description: "Sign in to your Jiki account"
};

export default function LoginPage() {
  return (
    <AuthGuard>
      <AuthLayout>
        <LoginForm />
      </AuthLayout>
    </AuthGuard>
  );
}
