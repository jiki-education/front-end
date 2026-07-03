import Link from "next/link";
import React from "react";
import { useTranslations } from "next-intl";
import styles from "@/app/styles/modules/concepts.module.css";
import { useLocaleRoutes } from "@/lib/i18n/useLocaleRoutes";
import type { ConceptAncestor } from "@/types/concepts";

interface BreadcrumbItem {
  label: string;
  href?: string;
  isLabel?: boolean;
  isCurrent?: boolean;
}

interface BreadcrumbProps {
  conceptTitle?: string;
  ancestors?: ConceptAncestor[];
}

export default function Breadcrumb({ conceptTitle, ancestors = [] }: BreadcrumbProps) {
  const routes = useLocaleRoutes();
  const t = useTranslations("concepts.breadcrumb");
  const breadcrumbItems: BreadcrumbItem[] = [];

  // If no concept title, we're on the "Coding Concepts" page
  if (!conceptTitle) {
    breadcrumbItems.push({ label: t("root"), isCurrent: true });
  } else {
    breadcrumbItems.push({ label: t("root"), href: routes.concepts() });

    // Add ancestors to breadcrumb path
    for (const ancestor of ancestors) {
      breadcrumbItems.push({ label: "›", isLabel: true });
      breadcrumbItems.push({ label: ancestor.title, href: routes.concept(ancestor.slug) });
    }

    // Add current concept
    breadcrumbItems.push({ label: "›", isLabel: true });
    breadcrumbItems.push({ label: conceptTitle, isCurrent: true });
  }

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
