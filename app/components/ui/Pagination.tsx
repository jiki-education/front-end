import Link from "next/link";
import styles from "./Pagination.module.css";
import { assembleClassNames } from "@/lib/assemble-classnames";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hrefForPage: (page: number) => string;
  className?: string;
}

function getPageNumbers(currentPage: number, totalPages: number): (number | "...")[] {
  const delta = 2;
  const range: number[] = [];
  const rangeWithDots: (number | "...")[] = [];

  for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
    range.push(i);
  }

  if (currentPage - delta > 2) {
    rangeWithDots.push(1, "...");
  } else {
    rangeWithDots.push(1);
  }

  rangeWithDots.push(...range);

  if (currentPage + delta < totalPages - 1) {
    rangeWithDots.push("...", totalPages);
  } else if (totalPages > 1) {
    rangeWithDots.push(totalPages);
  }

  return rangeWithDots;
}

export default function Pagination({ currentPage, totalPages, hrefForPage, className = "" }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = getPageNumbers(currentPage, totalPages);
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <nav className={assembleClassNames(styles.pagination, className)} aria-label="Pagination">
      {hasPrev ? (
        <Link
          href={hrefForPage(currentPage - 1)}
          className={assembleClassNames(styles.btn, styles.prev)}
          aria-label="Previous page"
        >
          ‹
        </Link>
      ) : (
        <span className={assembleClassNames(styles.btn, styles.prev)} aria-disabled="true">
          ‹
        </span>
      )}

      {pageNumbers.map((page, index) => (
        <span key={index}>
          {page === "..." ? (
            <span className={styles.ellipsis}>...</span>
          ) : currentPage === page ? (
            <span className={assembleClassNames(styles.btn, styles.active)} aria-current="page">
              {page}
            </span>
          ) : (
            <Link href={hrefForPage(page)} className={styles.btn}>
              {page}
            </Link>
          )}
        </span>
      ))}

      {hasNext ? (
        <Link
          href={hrefForPage(currentPage + 1)}
          className={assembleClassNames(styles.btn, styles.next)}
          aria-label="Next page"
        >
          ›
        </Link>
      ) : (
        <span className={assembleClassNames(styles.btn, styles.next)} aria-disabled="true">
          ›
        </span>
      )}
    </nav>
  );
}
