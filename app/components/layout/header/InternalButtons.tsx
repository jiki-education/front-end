import { useTranslations } from "next-intl";
import Link from "next/link";

export default function InternalButtons() {
  const t = useTranslations("layout.internalHeader");

  return (
    <>
      <div className="flex items-center gap-12">
        <Link href="/dashboard" className="ui-btn ui-btn-small ui-btn-primary">
          {t("backToJiki")}
        </Link>
      </div>
    </>
  );
}
