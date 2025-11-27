"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth/hooks";
import ExternalHeader from "./external";

export default function Header() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <ExternalHeader />;
  }

  return (
    <header className="fixed top-0 left-0 right-0 h-72 bg-white border-b-2 border-gray-200 flex items-center justify-between px-40 z-[1000]">
      <Link
        href="/"
        className="text-28 font-bold bg-gradient-to-br from-blue-400 to-blue-600 bg-clip-text text-transparent uppercase tracking-2"
      >
        JIKI
      </Link>

      <div className="flex items-center gap-12">
        <Link href="/dashboard" className="ui-btn ui-btn-small ui-btn-primary">
          Back to Jiki →
        </Link>
      </div>
    </header>
  );
}
