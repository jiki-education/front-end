"use client";

import { useAuthStore } from "@/stores/authStore";
import { GoogleAuthButton } from "@/components/ui/GoogleAuthButton";
import { FormField, Button } from "@/components/ui-kit";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const { login, googleAuth, isLoading, error, clearError } = useAuthStore();

  const handleGoogleAuth = async (code: string) => {
    await googleAuth(code);
    router.push("/dashboard");
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errors: Record<string, string> = {};

    if (!email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validate()) {
      return;
    }

    try {
      await login({ email, password });
      router.push("/dashboard");
    } catch (err) {
      // Error is handled by the store and available in the error state
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <GoogleAuthButton onSuccess={handleGoogleAuth} onError={() => console.error("ERROR WITH GOOGLE LOGIN")}>
        Log In with Google
      </GoogleAuthButton>

      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-[#e2e8f0]"></div>
        <span className="text-sm font-medium text-[#718096]">OR</span>
        <div className="flex-1 h-px bg-[#e2e8f0]"></div>
      </div>

      {error && (
        <div className="bg-[#e0f5d2] border-2 border-[#78ce4d] rounded-lg p-4 text-[#2e571d] text-sm font-medium leading-relaxed">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <FormField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="Enter your email address"
          iconName="email"
          value={email}
          error={validationErrors.email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (validationErrors.email) {
              setValidationErrors({ ...validationErrors, email: "" });
            }
          }}
          required
        />

        <div className="flex flex-col gap-2.5 mb-2">
          <FormField
            id="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            iconName="locked"
            value={password}
            error={validationErrors.password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (validationErrors.password) {
                setValidationErrors({ ...validationErrors, password: "" });
              }
            }}
            required
          />

          <div className="text-right">
            <Link
              href="/auth/forgot-password"
              className="text-15 text-[#3b82f6] hover:text-[#2563eb] font-medium transition-colors"
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        <Button type="submit" variant="primary" loading={isLoading} disabled={isLoading} fullWidth>
          {isLoading ? "Logging in..." : "Log In"}
        </Button>

        <div className="text-center">
          <p className="text-15 text-[#4a5568]">
            Didn&apos;t receive your confirmation email?{" "}
            <Link
              href="/auth/resend-confirmation"
              className="text-[#3b82f6] hover:text-[#2563eb] font-medium transition-colors"
            >
              Resend it.
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
