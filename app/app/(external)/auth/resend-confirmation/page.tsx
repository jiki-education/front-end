import { ResendConfirmationForm } from "@/components/auth/ResendConfirmationForm";
import { ServerAuthGuard } from "@/components/layout/auth/external/ServerAuthGuard";
import { AuthLayout } from "@/components/ui/AuthLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resend Confirmation - Jiki",
  description: "Resend confirmation instructions"
};

export default function ResendConfirmationPage() {
  return (
    <ServerAuthGuard>
      <AuthLayout>
        <ResendConfirmationForm />
      </AuthLayout>
    </ServerAuthGuard>
  );
}
