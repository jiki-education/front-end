import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import shared from "@/components/landing-page/shared.module.css";

export default function Header() {
  const t = useTranslations("layout.internalHeader");

  return (
    <header className="fixed top-0 left-0 right-0 h-72 bg-white border-b-2 border-gray-200 z-modal">
      <div className={`${shared["lg-container"]} h-full flex items-center justify-between`}>
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

        <div className="flex items-center gap-12">
          <Link href="/dashboard" className="ui-btn ui-btn-small ui-btn-primary">
            {t("backToJiki")}
          </Link>
        </div>
      </div>
    </header>
  );
}
