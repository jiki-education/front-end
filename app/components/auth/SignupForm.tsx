"use client";

import { useAuthStore } from "@/stores/authStore";
import { GoogleAuthButton } from "@/components/ui/GoogleAuthButton";
import { StyledInput } from "@/components/ui/StyledInput";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";

export function SignupForm() {
  const router = useRouter();
  const { signup, isLoading, error, clearError } = useAuthStore();

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
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters";
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
      await signup({
        email,
        password,
        password_confirmation: password
      });
      router.push("/dashboard");
    } catch (err) {
      // Error is handled by the store and available in the error state
      console.error("Signup failed:", err);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <GoogleAuthButton
        onClick={() => {
          /* Google OAuth not implemented yet */
        }}
      >
        Sign Up with Google
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
        <StyledInput
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="Enter your email address"
          icon="email"
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

        <StyledInput
          id="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          placeholder="Enter your password"
          icon="password"
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

        <button
          type="submit"
          disabled={isLoading}
          className={`
            w-full px-5 py-4 
            border-2 border-[#3b82f6] rounded-xl
            text-base font-medium text-white
            bg-gradient-to-br from-[#3b82f6] to-[#2563eb]
            shadow-lg shadow-blue-200
            transition-all duration-300
            hover:border-[#2563eb] hover:shadow-xl hover:shadow-blue-300 hover:ring-4 hover:ring-blue-100
            focus:outline-none focus:ring-4 focus:ring-blue-100
            disabled:cursor-not-allowed
            ${isLoading ? "btn-loading" : ""}
          `}
          style={{
            ...(isLoading && {
              pointerEvents: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              opacity: 0.8
            })
          }}
        >
          {isLoading && (
            <div
              className="w-[18px] h-[18px] rounded-full border-2 animate-spin"
              style={{
                borderColor: "rgba(255, 255, 255, 0.3)",
                borderTopColor: "white"
              }}
            />
          )}
          {isLoading ? "Signing up..." : "Sign Up"}
        </button>

        <div className="text-center">
          <p className="text-sm text-[#4a5568]">
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
