import { AuthPageWrapper } from "@/components/auth/AuthPageWrapper";
import { AuthLayout } from "@/components/ui/AuthLayout";
import { SignupForm } from "@/components/auth/SignupForm";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up - Jiki",
  description: "Create your Jiki account"
};

export default function SignupPage() {
  return (
    <AuthPageWrapper>
      <AuthLayout
        title="Sign Up"
        subtitle={
          <>
            Already got an account?{" "}
            <Link href="/auth/login" className="text-[#3b82f6] hover:text-[#2563eb] font-medium transition-colors">
              Log in.
            </Link>
          </>
        }
      >
        <SignupForm />
      </AuthLayout>
    </AuthPageWrapper>
  );
}
