"use client";

import type { ReactNode } from "react";
import "./authLayout.css";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: ReactNode;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="flex flex-col lg:flex-row">
      {/* Left Side - Form */}
      <div className="flex-1 bg-white flex flex-col items-center justify-center px-8 py-10 lg:px-15">
        <div className="w-full max-w-[420px]">
          <div className="mb-40">
            <h1 className="text-5xl font-medium text-[#1a365d] mb-16 leading-[1.3]">{title}</h1>
            <p className="text-[19px] text-[#718096] leading-normal">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>

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
