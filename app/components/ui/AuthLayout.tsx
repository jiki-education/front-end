"use client";

import type { ReactNode } from "react";

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
      <div className="flex-1 flex flex-col items-center justify-center px-15 py-15 text-white bg-gradient-to-br from-[#3b82f6] via-[#2563eb] to-[#667eea] min-h-[300px] lg:h-screen lg:sticky lg:top-0 overflow-hidden">
        <div className="text-center z-10">
          <div
            className="text-5xl lg:text-7xl font-medium mb-40 leading-none"
            style={{ textShadow: "0 4px 20px rgba(0,0,0,0.2)" }}
          >
            Jiki
          </div>
          <h1 className="text-32 font-medium mb-5 leading-tight max-w-lg" style={{ textWrap: "balance" }}>
            Your coding journey starts here
          </h1>
          <p
            className="text-18 opacity-95 max-w-md justify-self-center leading-relaxed mb-52"
            style={{ textWrap: "balance" }}
          >
            Join millions of learners transforming their careers through hands-on coding practice.
          </p>

          <div className="text-center">
            <div className="text-[10px] text-white/40 uppercase tracking-[1.5px] mb-6">Created By</div>
            <div className="text-sm text-white/75 font-medium">The team behind Exercism</div>
          </div>
        </div>
      </div>
    </div>
  );
}
