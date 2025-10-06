import { AuthPageWrapper } from "@/components/auth/AuthPageWrapper";
import { SignupForm } from "@/components/auth/SignupForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign up - Jiki",
  description: "Create your Jiki account"
};

export default function SignupPage() {
  return (
    <AuthPageWrapper>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>
        <p className="mt-2 text-sm text-gray-600">Start your coding journey with Jiki today.</p>
      </div>
      <SignupForm />
    </AuthPageWrapper>
  );
}
