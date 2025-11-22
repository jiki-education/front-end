"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api/client";
import { AuthLayout } from "@/components/ui/AuthLayout";
import styles from "./AuthForm.module.css";

export function UnsubscribeContent() {
  const params = useParams();
  const token = params.token as string;

  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage("No unsubscribe token provided.");
      return;
    }

    const unsubscribe = async () => {
      try {
        await api.post(`/auth/unsubscribe/${token}`);
        setStatus("success");
      } catch {
        setStatus("error");
        setErrorMessage("This unsubscribe link is invalid or has expired.");
      }
    };

    void unsubscribe();
  }, [token]);

  return (
    <AuthLayout>
      <div className={styles.leftSide}>
        <div className={styles.formContainer}>
          {status === "processing" && (
            <div style={{ textAlign: "center" }}>
              <div
                className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
                style={{ borderColor: "var(--color-blue-600)" }}
              ></div>
              <h1 style={{ marginBottom: "16px" }}>Unsubscribing...</h1>
              <p style={{ fontSize: "15px", color: "var(--color-text-secondary)" }}>
                Please wait while we process your request.
              </p>
            </div>
          )}

          {status === "success" && (
            <div style={{ textAlign: "center" }}>
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: "var(--color-success-bg)" }}
              >
                <svg className="w-6 h-6" fill="none" stroke="var(--color-success-text)" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 style={{ marginBottom: "16px" }}>Successfully Unsubscribed</h1>
              <p style={{ fontSize: "15px", color: "var(--color-text-secondary)" }}>
                You have been unsubscribed from our mailing list.
              </p>
            </div>
          )}

          {status === "error" && (
            <div style={{ textAlign: "center" }}>
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: "var(--color-error-bg)" }}
              >
                <svg className="w-6 h-6" fill="none" stroke="var(--color-error-text)" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 style={{ marginBottom: "16px" }}>Unsubscribe Failed</h1>
              <p style={{ fontSize: "15px", color: "var(--color-text-secondary)" }}>{errorMessage}</p>
            </div>
          )}
        </div>
      </div>
    </AuthLayout>
  );
}
