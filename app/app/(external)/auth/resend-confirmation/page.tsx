import { AuthGuard } from "@/app/(external)/AuthGuard";
import { ResendConfirmationForm } from "@/components/auth/ResendConfirmationForm";
import { AuthLayout } from "@/components/ui/AuthLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resend Confirmation - Jiki",
  description: "Resend confirmation instructions"
};

export default function ResendConfirmationPage() {
  return (
    <AuthGuard>
      <AuthLayout>
        <ResendConfirmationForm />
      </AuthLayout>
    </AuthGuard>
  );
}
