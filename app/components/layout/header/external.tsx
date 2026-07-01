import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import shared from "@/components/landing-page/shared.module.css";
import styles from "./external.module.css";

export default function ExternalHeader() {
  const t = useTranslations("layout.externalHeader");

  return (
    <header className="fixed top-0 left-0 right-0 h-72 bg-white border-b-2 border-gray-200 z-[1000]">
      <div className={`${shared["lg-container"]} h-full flex items-center gap-36`}>
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

        <div className="flex items-center gap-4 text-gray-700 max-[719px]:hidden">
          <Link href="https://jiki.io/blog/the-backstory-of-jiki" className={styles.navLink}>
            {t("aboutJiki")}
          </Link>
          <Link href="/concepts" className={styles.navLink}>
            {t("codingConcepts")}
          </Link>
          <Link href="/premium" className={styles.navLink}>
            {t("premium")}
          </Link>
          <Link href="/testimonials" className={styles.navLink}>
            {t("testimonials")}
          </Link>
        </div>

        <div className="flex items-center gap-12 ml-auto">
          <Link href="/auth/login" className="ui-btn ui-btn-small ui-btn-secondary">
            {t("login")}
          </Link>
          <Link href="/auth/signup" className="ui-btn ui-btn-small ui-btn-primary">
            {t("signUp")}
          </Link>
        </div>
      </div>
    </header>
  );
}
