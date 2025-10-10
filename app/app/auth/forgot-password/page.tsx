import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password - Jiki",
  description: "Reset your password"
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
