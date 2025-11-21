"use client";

import type { ReactNode } from "react";
import styles from "./AuthLayout.module.css";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex flex-col lg:flex-row">
      {children}

      {/* Right Side - Gradient Background */}
      <div className={styles.rightSide}>
        <div className={styles.logoLarge}>Jiki</div>
        <h1 className={styles.tagline}>Your coding journey starts here</h1>
        <p className={styles.description}>
          Join millions of learners transforming their careers through hands-on coding practice.
        </p>

        <div className={styles.creatorsBadge}>
          <div className={styles.label}>Created By</div>
          <div className={styles.brand}>The team behind Exercism</div>
        </div>
      </div>
    </div>
  );
}
