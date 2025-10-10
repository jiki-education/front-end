import { AuthPageWrapper } from "@/components/auth/AuthPageWrapper";
import { LoginForm } from "@/components/auth/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Jiki",
  description: "Sign in to your Jiki account"
};

export default function LoginPage() {
  return (
    <AuthPageWrapper>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Sign in to your account</h2>
        <p className="mt-2 text-sm text-gray-600">Welcome back! Please enter your details.</p>
      </div>
      <LoginForm />
    </AuthPageWrapper>
  );
}
