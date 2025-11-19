import { AuthPageWrapper } from "@/components/auth/AuthPageWrapper";
import { AuthLayout } from "@/components/ui/AuthLayout";
import { ResendConfirmationForm } from "@/components/auth/ResendConfirmationForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resend Confirmation - Jiki",
  description: "Resend confirmation instructions"
};

export default function ResendConfirmationPage() {
  return (
    <AuthPageWrapper>
      <AuthLayout>
        <ResendConfirmationForm />
      </AuthLayout>
    </AuthPageWrapper>
  );
}
