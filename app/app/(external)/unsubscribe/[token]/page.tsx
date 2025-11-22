import { AuthPageWrapper } from "@/components/auth/AuthPageWrapper";
import { UnsubscribeContent } from "@/components/auth/UnsubscribeContent";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unsubscribe - Jiki",
  description: "Unsubscribe from Jiki emails"
};

function UnsubscribeContentWrapper() {
  return (
    <AuthPageWrapper>
      <UnsubscribeContent />
    </AuthPageWrapper>
  );
}

export default function UnsubscribePage() {
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
      <UnsubscribeContentWrapper />
    </Suspense>
  );
}
