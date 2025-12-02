import Link from "next/link";
import React from "react";
import styles from "@/app/styles/modules/concepts.module.css";

interface BreadcrumbItem {
  label: string;
  href?: string;
  isLabel?: boolean;
  isCurrent?: boolean;
}

interface BreadcrumbProps {
  conceptSlug?: string;
  conceptTitle?: string;
  items?: BreadcrumbItem[];
}

export default function Breadcrumb({ conceptTitle, items }: BreadcrumbProps) {
  // Generate breadcrumb items for concept hierarchy
  const breadcrumbItems: BreadcrumbItem[] = items || [
    { label: "Library:", isLabel: true },
    { label: "All Concepts", href: "/concepts" },
    { label: "›", isLabel: true },
    { label: conceptTitle || "Current Concept", isCurrent: true }
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
