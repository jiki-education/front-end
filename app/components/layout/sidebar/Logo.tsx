import { useTranslations } from "next-intl";
import Image from "next/image";

export function Logo() {
  const t = useTranslations("layout.sidebar");
  return (
    <div className="logo">
      <Image
        src="/static/images/logo-sitting-large.webp"
        alt={t("logoAlt")}
        width={215}
        height={93}
        className="full-logo"
        priority
      />
    </div>
  );
}
