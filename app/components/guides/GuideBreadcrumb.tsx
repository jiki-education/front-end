import Link from "next/link";
import { localePath } from "@/lib/i18n/routes";
import styles from "./GuideBreadcrumb.module.css";

interface BreadcrumbItem {
  label: string;
  href?: string;
  isLabel?: boolean;
  isCurrent?: boolean;
}

interface GuideBreadcrumbProps {
  guideTitle: string;
  locale: string;
}

export default function GuideBreadcrumb({ guideTitle, locale }: GuideBreadcrumbProps) {
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Guides", href: localePath("/guides", locale) },
    { label: "›", isLabel: true },
    { label: guideTitle, isCurrent: true }
  ];

  return (
    <div className={styles.breadcrumb}>
      {breadcrumbItems.map((item, index) => (
        <span
          key={index}
          className={`${styles.breadcrumbItem} ${
            item.isLabel ? styles.breadcrumbLabel : item.isCurrent ? styles.breadcrumbCurrent : ""
          }`}
        >
          {item.href && !item.isCurrent ? <Link href={item.href}>{item.label}</Link> : item.label}
        </span>
      ))}
    </div>
  );
}
