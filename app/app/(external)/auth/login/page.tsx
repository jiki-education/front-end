import { AuthPageWrapper } from "@/components/auth/AuthPageWrapper";
import { AuthLayout } from "@/components/ui/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log In - Jiki",
  description: "Sign in to your Jiki account"
};

export default function LoginPage() {
  return (
    <AuthPageWrapper>
      <AuthLayout>
        <LoginForm />
      </AuthLayout>
    </AuthPageWrapper>
  );
}
