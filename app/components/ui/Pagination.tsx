import styles from "./Pagination.module.css";
import { assembleClassNames } from "@/lib/assemble-classnames";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({ currentPage, totalPages, onPageChange, className = "" }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

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
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className={assembleClassNames(styles.pagination, className)} aria-label="Pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={assembleClassNames(styles.btn, styles.prev)}
        aria-label="Previous page"
      >
        ‹
      </button>

      {pageNumbers.map((page, index) => (
        <span key={index}>
          {page === "..." ? (
            <span className={styles.ellipsis}>...</span>
          ) : (
            <button
              onClick={() => onPageChange(page as number)}
              className={assembleClassNames(styles.btn, currentPage === page && styles.active)}
              aria-current={currentPage === page ? "page" : undefined}
            >
              {page}
            </button>
          )}
        </span>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={assembleClassNames(styles.btn, styles.next)}
        aria-label="Next page"
      >
        ›
      </button>
    </nav>
  );
}
