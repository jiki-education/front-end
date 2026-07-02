import shared from "@/components/landing-page/shared.module.css";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { LocaleBanner } from "../../i18n/LocaleBanner";
import { Buttons } from "./Buttons";
import { HeaderHeightSync } from "./HeaderHeightSync";

// Picks the header based on client auth state. Isolated as a client component so
// HeaderLayout itself can stay a server component (and render the server-side
// LocaleBanner).
export function Header() {
  const t = useTranslations("layout.internalHeader");

  return (
    <header className="sticky top-0 bg-white border-b-2 border-gray-200 z-modal">
      <LocaleBanner />
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
