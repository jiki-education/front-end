import { AuthPageWrapper } from "@/components/auth/AuthPageWrapper";
import { AuthLayout } from "@/components/ui/AuthLayout";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password - Jiki",
  description: "Reset your password"
};

export default function ForgotPasswordPage() {
  return (
    <AuthPageWrapper>
      <AuthLayout
        title="Forgot your password?"
        subtitle={<>If you&apos;ve forgotten your password, use the form below to request a link to change it.</>}
      >
        <ForgotPasswordForm />
      </AuthLayout>
    </AuthPageWrapper>
  );
}
