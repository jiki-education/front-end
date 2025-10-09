import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password - Jiki",
  description: "Set your new password"
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
