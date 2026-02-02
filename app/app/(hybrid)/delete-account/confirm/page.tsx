import { DeleteAccountConfirmContent } from "@/components/delete-account";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Delete Account - Jiki",
  description: "Confirm account deletion"
};

export default function DeleteAccountConfirmPage() {
  return (
    <Suspense>
      <DeleteAccountConfirmContent />
    </Suspense>
  );
}
