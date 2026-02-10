"use client";

import { useRef, useState } from "react";
import {
  useFloating,
  autoUpdate,
  offset,
  shift,
  useClick,
  useDismiss,
  useInteractions,
  useHover,
  useTransitionStyles,
  arrow,
  FloatingArrow,
  FloatingPortal
} from "@floating-ui/react";
import { useRouter } from "next/navigation";
import ThreeDotsIcon from "@/icons/three-dots.svg";
import { useAuthStore } from "@/lib/auth/authStore";
import styles from "./MoreMenu.module.css";

interface MoreMenuProps {
  isActive?: boolean;
}

export function MoreMenu({ isActive = false }: MoreMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const arrowRef = useRef(null);
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "right",
    strategy: "fixed",
    middleware: [offset(16), shift({ padding: 8 }), arrow({ element: arrowRef })],
    whileElementsMounted: autoUpdate
  });

  const { isMounted, styles: transitionStyles } = useTransitionStyles(context, {
    duration: 150,
    initial: { opacity: 0, transform: "translateX(-4px)" },
    open: { opacity: 1, transform: "translateX(0)" }
  });

  const hover = useHover(context, { delay: { open: 0, close: 150 } });
  const click = useClick(context);
  const dismiss = useDismiss(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([hover, click, dismiss]);

  const handleLogout = async () => {
    setIsOpen(false);
    const result = await logout();
    if (result.success) {
      router.push("/");
    }
  };

  const handleNavigation = (href: string) => {
    setIsOpen(false);
    router.push(href);
  };

  return (
    <li className={styles.moreMenuContainer}>
      <div
        ref={refs.setReference}
        className={`nav-item ${isActive ? "active" : ""} ${styles.moreButton}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        {...getReferenceProps()}
      >
        <span className="nav-icon">
          <ThreeDotsIcon />
        </span>
        <span>More</span>
      </div>

      <FloatingPortal>
        {isMounted && (
          <div
            ref={refs.setFloating}
            style={{ ...floatingStyles, zIndex: "var(--z-index-nav-popover)" }}
            {...getFloatingProps()}
          >
            <div style={transitionStyles} className={styles.dropdownMenu}>
              <FloatingArrow
                ref={arrowRef}
                context={context}
                fill="var(--color-surface-elevated)"
                width={16}
                height={8}
              />
              <button onClick={() => handleNavigation("/help")} className={styles.dropdownItem}>
                Help Center
              </button>
              <button onClick={() => handleNavigation("/forum")} className={styles.dropdownItem}>
                Forum
              </button>
              <button onClick={() => handleNavigation("/blog")} className={styles.dropdownItem}>
                Blog
              </button>
              <button onClick={handleLogout} className={styles.dropdownItem}>
                Log Out
              </button>
            </div>
          </div>
        )}
      </FloatingPortal>
    </li>
  );
}
