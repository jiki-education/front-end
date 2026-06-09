import type { Metadata } from "next";
import CheckEmailClient from "./CheckEmailClient";

export const metadata: Metadata = {
  title: "Check your email - Jiki",
  description: "We've sent you a confirmation email. Check your inbox to verify your address and finish signing up."
};

export default function CheckEmailPage() {
  return <CheckEmailClient />;
}
