import { AuthGuard } from "@/app/(external)/AuthGuard";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { AuthLayout } from "@/components/ui/AuthLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password - Jiki",
  description: "Reset your password"
};

export default function ForgotPasswordPage() {
  return (
    <AuthGuard>
      <AuthLayout>
        <ForgotPasswordForm />
      </AuthLayout>
    </AuthGuard>
  );
}
