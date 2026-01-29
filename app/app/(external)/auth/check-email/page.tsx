"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import styles from "@/components/auth/AuthForm.module.css";

function CheckEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  return (
    <div className={styles.leftSide}>
      <div className={styles.formContainer}>
        <header>
          <h1>Check your email</h1>
          <p>
            We&apos;ve sent a confirmation link to <strong>{email}</strong>.
          </p>
          <p>Please check your inbox and click the link to confirm your account.</p>
        </header>

        <div className={styles.footerLinks}>
          <p>
            Didn&apos;t receive the email?{" "}
            <Link
              href={`/auth/resend-confirmation${email ? `?email=${encodeURIComponent(email)}` : ""}`}
              className="ui-link"
            >
              Resend it
            </Link>
          </p>
          <p>
            <Link href="/auth/login" className="ui-link">
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CheckEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckEmailContent />
    </Suspense>
  );
}
