"use client";

import shared from "@/components/landing-page/shared.module.css";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { Buttons } from "./Buttons";
import { HeaderHeightSync } from "./HeaderHeightSync";

// The public header shell. Client-safe on purpose: it imports nothing
// server-only, so both the server HeaderLayout and the client SidebarLayout can
// render it. The locale banner is server-rendered (it reads request headers), so
// it's passed in as a slot by server parents rather than imported here.
export default function Header({ banner }: { banner?: React.ReactNode }) {
  const t = useTranslations("layout.internalHeader");

  return (
    <header className="sticky top-0 bg-white border-b-2 border-gray-200 z-modal">
      {banner}
      <div className={`${shared["lg-container"]} flex items-center justify-between h-[72px]`}>
        <Link href="/" aria-label={t("homeAriaLabel")} className="flex items-center text-gray-900">
          <Image
            src="/static/images/logo-peeking.webp"
            alt={t("logoAlt")}
            width={100}
            height={40}
            className="h-40 w-auto"
            priority
          />
        </Link>

        <Buttons />
      </div>
      <HeaderHeightSync />
    </header>
  );
}
