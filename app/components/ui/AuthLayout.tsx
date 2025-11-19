"use client";

import type { ReactNode } from "react";
import "./auth-layout.css";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex flex-col lg:flex-row">
      {children}

      {/* Right Side - Gradient Background */}
      <div className="right-side">
        <div className="logo-large">Jiki</div>
        <h1 className="tagline">Your coding journey starts here</h1>
        <p className="description">
          Join millions of learners transforming their careers through hands-on coding practice.
        </p>

        <div className="creators-badge">
          <div className="label">Created By</div>
          <div className="brand">The team behind Exercism</div>
        </div>
      </div>
    </div>
  );
}
