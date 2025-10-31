"use client";

import { useAuthStore } from "@/stores/authStore";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function ConfirmEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { confirmEmail, isLoading, error, clearError } = useAuthStore();

  const [token, setToken] = useState("");
  const [status, setStatus] = useState<"confirming" | "success" | "error">("confirming");

  useEffect(() => {
    const tokenParam = searchParams.get("confirmation_token") || searchParams.get("token");
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setStatus("error");
    }
  }, [searchParams]);

  useEffect(() => {
    if (!token || status !== "confirming") {
      return;
    }

    const performConfirmation = async () => {
      clearError();
      try {
        await confirmEmail(token);
        setStatus("success");

        // Redirect after 3 seconds
        setTimeout(() => {
          router.push("/auth/login?confirmed=true");
        }, 3000);
      } catch (err) {
        console.error("Email confirmation failed:", err);
        setStatus("error");
      }
    };

    performConfirmation();
  }, [token, status, confirmEmail, clearError, router]);

  if (status === "confirming") {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Confirming Your Email...
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please wait while we confirm your email address.
          </p>
        </div>

        {isLoading && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        )}
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Email Confirmed!</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Your email has been confirmed successfully. Redirecting to login...
          </p>
        </div>

        <div className="rounded-md bg-green-50 p-4">
          <p className="text-sm text-green-800">
            ✓ Your email address has been verified. You can now sign in to your account.
          </p>
        </div>

        <div className="text-center">
          <Link href="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Continue to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Confirmation Failed</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          This confirmation link is invalid or has expired.
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="rounded-md bg-red-50 p-4">
        <p className="text-sm text-red-800">
          This email confirmation link is invalid or has expired. You may need to sign up again or contact support.
        </p>
      </div>

      <div className="text-center space-y-2">
        <div>
          <Link href="/auth/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign up again
          </Link>
        </div>
        <div className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}