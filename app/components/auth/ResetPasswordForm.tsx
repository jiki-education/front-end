"use client";

import { useAuthStore } from "@/lib/auth/authStore";
import { useLocaleRoutes } from "@/lib/i18n/useLocaleRoutes";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";

export function ResetPasswordForm() {
  const t = useTranslations("auth.resetPassword");
  const routes = useLocaleRoutes();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resetPassword, isLoading, error, clearError } = useAuthStore();

  const [token] = useState(() => searchParams?.get("reset_password_token") || searchParams?.get("token") || "");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState("");

  const validate = () => {
    const errors: Record<string, string> = {};

    if (!token) {
      errors.token = t("tokenMissing");
    }

    if (!password) {
      errors.password = t("passwordRequired");
    } else if (password.length < 6) {
      errors.password = t("passwordMinLength");
    }

    if (!passwordConfirmation) {
      errors.passwordConfirmation = t("confirmationRequired");
    } else if (password !== passwordConfirmation) {
      errors.passwordConfirmation = t("passwordsDontMatch");
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    setSuccessMessage("");

    if (!validate()) {
      return;
    }

    try {
      await resetPassword({
        reset_password_token: token,
        password,
        password_confirmation: passwordConfirmation
      });
      setSuccessMessage(t("successMessage"));

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push(routes.authLogin());
      }, 3000);
    } catch (err) {
      console.error("Password reset failed:", err);
    }
  };

  // Show error if no token is provided
  if (!token) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">{t("invalidTitle")}</h2>
        </div>

        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{t("invalidMessage")}</p>
        </div>

        <div className="text-center">
          <Link href={routes.authForgotPassword()} className="font-medium text-indigo-600 hover:text-indigo-500">
            {t("requestNewLink")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">{t("title")}</h2>
        <p className="mt-2 text-center text-sm text-gray-600">{t("subtitle")}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="rounded-md bg-green-50 p-4">
            <p className="text-sm text-green-800">{successMessage}</p>
          </div>
        )}

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            {t("newPasswordLabel")}
          </label>
          <div className="mt-1">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (validationErrors.password) {
                  setValidationErrors({ ...validationErrors, password: "" });
                }
              }}
              className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              placeholder={t("newPasswordPlaceholder")}
            />
            {validationErrors.password && <p className="mt-2 text-sm text-red-600">{validationErrors.password}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="passwordConfirmation" className="block text-sm font-medium text-gray-700">
            {t("confirmPasswordLabel")}
          </label>
          <div className="mt-1">
            <input
              id="passwordConfirmation"
              name="passwordConfirmation"
              type="password"
              autoComplete="new-password"
              required
              value={passwordConfirmation}
              onChange={(e) => {
                setPasswordConfirmation(e.target.value);
                if (validationErrors.passwordConfirmation) {
                  setValidationErrors({ ...validationErrors, passwordConfirmation: "" });
                }
              }}
              className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              placeholder={t("confirmPasswordPlaceholder")}
            />
            {validationErrors.passwordConfirmation && (
              <p className="mt-2 text-sm text-red-600">{validationErrors.passwordConfirmation}</p>
            )}
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? t("submitting") : t("submit")}
          </button>
        </div>

        <div className="text-center text-sm">
          <span className="text-gray-600">{t("rememberedPrefix")}</span>
          <Link href={routes.authLogin()} className="font-medium text-indigo-600 hover:text-indigo-500">
            {t("signInLink")}
          </Link>
        </div>
      </form>
    </div>
  );
}
