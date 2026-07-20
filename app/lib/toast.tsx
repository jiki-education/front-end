"use client";

/**
 * Keyed toast helpers.
 *
 * Fire toasts by translation key instead of a hardcoded string. Each helper
 * hands react-hot-toast a small `<ToastMessage>` element; that element runs
 * `useTranslations("toasts")` and renders the resolved copy. This works from
 * anywhere — components, hooks, Zustand stores, plain classes — because the
 * element only resolves its text when react-hot-toast renders it inside the
 * `<Toaster>`, which is mounted within the `NextIntlClientProvider` in the root
 * layout. Callers never need a hook or the current locale.
 *
 * Keys live under the `toasts` namespace in `messages/{locale}.json`. The
 * `ToastKey` type is derived from that namespace, so `pnpm typecheck` rejects
 * unknown keys.
 */

import { useTranslations } from "next-intl";
import toast, { type ToastOptions } from "react-hot-toast";

// Valid dotted keys of the `toasts` namespace, sourced from next-intl's own
// translator typing (which is generated from messages/en.json via global.d.ts).
export type ToastKey = Parameters<ReturnType<typeof useTranslations<"toasts">>>[0];
export type ToastValues = Record<string, string | number>;

function ToastMessage({ id, values }: { id: ToastKey; values?: ToastValues }) {
  const t = useTranslations("toasts");
  return <>{t(id, values)}</>;
}

export function toastError(id: ToastKey, values?: ToastValues, options?: ToastOptions) {
  return toast.error(<ToastMessage id={id} values={values} />, options);
}

export function toastSuccess(id: ToastKey, values?: ToastValues, options?: ToastOptions) {
  return toast.success(<ToastMessage id={id} values={values} />, options);
}

export function toastMessage(id: ToastKey, values?: ToastValues, options?: ToastOptions) {
  return toast(<ToastMessage id={id} values={values} />, options);
}

export function toastLoading(id: ToastKey, values?: ToastValues, options?: ToastOptions) {
  return toast.loading(<ToastMessage id={id} values={values} />, options);
}
