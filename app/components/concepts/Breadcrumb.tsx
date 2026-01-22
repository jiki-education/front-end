import Link from "next/link";
import React from "react";
import styles from "@/app/styles/modules/concepts.module.css";
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
  const breadcrumbItems: BreadcrumbItem[] = [{ label: "Library:", isLabel: true }];

  // If no concept title, we're on the "All Concepts" page
  if (!conceptTitle) {
    breadcrumbItems.push({ label: "All Concepts", isCurrent: true });
  } else {
    breadcrumbItems.push({ label: "All Concepts", href: "/concepts" });

    // Add ancestors to breadcrumb path
    for (const ancestor of ancestors) {
      breadcrumbItems.push({ label: "›", isLabel: true });
      breadcrumbItems.push({ label: ancestor.title, href: `/concepts/${ancestor.slug}` });
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
