import { AuthPageWrapper } from "@/components/auth/AuthPageWrapper";
import { ConfirmEmailForm } from "@/components/auth/ConfirmEmailForm";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Confirm Email - Jiki",
  description: "Confirm your email address"
};

function ConfirmEmailContent() {
  return (
    <AuthPageWrapper>
      <ConfirmEmailForm />
    </AuthPageWrapper>
  );
}

export default function ConfirmEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <ConfirmEmailContent />
    </Suspense>
  );
}
