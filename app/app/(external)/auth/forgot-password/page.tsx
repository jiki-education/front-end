import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { ServerAuthGuard } from "@/components/layout/auth/external/ServerAuthGuard";
import { AuthLayout } from "@/components/ui/AuthLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password - Jiki",
  description: "Reset your password"
};

export default function ForgotPasswordPage() {
  return (
    <ServerAuthGuard>
      <AuthLayout>
        <ForgotPasswordForm />
      </AuthLayout>
    </ServerAuthGuard>
  );
}
