import { AuthPageWrapper } from "@/components/auth/AuthPageWrapper";
import { AuthLayout } from "@/components/ui/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log In - Jiki",
  description: "Sign in to your Jiki account"
};

export default function LoginPage() {
  return (
    <AuthPageWrapper>
      <AuthLayout
        title="Log In"
        subtitle={
          <>
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="text-[#3b82f6] hover:text-[#2563eb] font-medium transition-colors">
              Sign up for free.
            </Link>
          </>
        }
      >
        <LoginForm />
      </AuthLayout>
    </AuthPageWrapper>
  );
}
