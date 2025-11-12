/**
 * UI Kit Demo Page
 *
 * This page demonstrates all the UI kit components in various states.
 * Used for testing and development purposes.
 */

"use client";

import { useState } from "react";
import { Button, FormField, PageHeader, PageTabs, Link } from "@/components/ui-kit";

// Sample icons (SVG components)
function ProjectsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" opacity="0.24" />
      <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M12 2L2 7L12 12L22 7L12 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="18" height="18">
      <path
        stroke="#707985"
        d="M7 12c0 1.3261 0.52678 2.5979 1.46447 3.5355C9.40215 16.4732 10.6739 17 12 17c1.3261 0 2.5979 -0.5268 3.5355 -1.4645C16.4732 14.5979 17 13.3261 17 12c0 -1.3261 -0.5268 -2.59785 -1.4645 -3.53553C14.5979 7.52678 13.3261 7 12 7c-1.3261 0 -2.59785 0.52678 -3.53553 1.46447C7.52678 9.40215 7 10.6739 7 12Z"
        strokeWidth="2"
      ></path>
      <path
        stroke="#707985"
        d="M19.7782 19.7782C17.7153 21.8411 14.9174 23 12 23c-2.91738 0 -5.71527 -1.1589 -7.77817 -3.2218S1 14.9174 1 12c0 -2.91738 1.15893 -5.71527 3.22183 -7.77817S9.08262 1 12 1c2.9174 0 5.7153 1.15893 7.7782 3.22183S23 9.08262 23 12c0 1.753 -0.4184 3.4629 -1.2 4.9961C19.1313 16.8911 17 14.6944 17 12"
        strokeWidth="2"
      ></path>
    </svg>
  );
}

function EmailIconFocused() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="18" height="18">
      <path
        stroke="#3b82f6"
        d="M7 12c0 1.3261 0.52678 2.5979 1.46447 3.5355C9.40215 16.4732 10.6739 17 12 17c1.3261 0 2.5979 -0.5268 3.5355 -1.4645C16.4732 14.5979 17 13.3261 17 12c0 -1.3261 -0.5268 -2.59785 -1.4645 -3.53553C14.5979 7.52678 13.3261 7 12 7c-1.3261 0 -2.59785 0.52678 -3.53553 1.46447C7.52678 9.40215 7 10.6739 7 12Z"
        strokeWidth="2"
      ></path>
      <path
        stroke="#3b82f6"
        d="M19.7782 19.7782C17.7153 21.8411 14.9174 23 12 23c-2.91738 0 -5.71527 -1.1589 -7.77817 -3.2218S1 14.9174 1 12c0 -2.91738 1.15893 -5.71527 3.22183 -7.77817S9.08262 1 12 1c2.9174 0 5.7153 1.15893 7.7782 3.22183S23 9.08262 23 12c0 1.753 -0.4184 3.4629 -1.2 4.9961C19.1313 16.8911 17 14.6944 17 12"
        strokeWidth="2"
      ></path>
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function AllIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2.5" />
      <rect x="3" y="13" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2.5" />
      <rect x="13" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2.5" />
      <rect x="13" y="13" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  );
}

function InProgressIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" />
      <path d="M12 7V12L15 15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export default function UIKitDemoPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

  // Tab configuration
  const tabs = [
    { id: "all", label: "All", icon: <AllIcon /> },
    { id: "in-progress", label: "In Progress", icon: <InProgressIcon />, color: "purple" as const }
  ];

  // Simulate loading
  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  // Simulate email validation
  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (value && !value.includes("@")) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-12">
      {/* Page Header */}
      <PageHeader
        icon={<ProjectsIcon />}
        title="UI Kit Demo"
        subtitle="Interactive examples of all UI kit components in various states."
      />

      {/* Page Tabs */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Page Tabs</h2>
        <PageTabs tabs={tabs} activeTabId={activeTab} onTabChange={setActiveTab} />
      </section>

      {/* Buttons Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Buttons</h2>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Primary Buttons</h3>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Primary Button</Button>
            <Button variant="primary" loading={loading}>
              {loading ? "Loading..." : "Click to Load"}
            </Button>
            <Button variant="primary" disabled>
              Disabled
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Secondary Buttons</h3>
          <div className="flex flex-wrap gap-4">
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="secondary" icon={<GoogleIcon />}>
              Sign In with Google
            </Button>
            <Button variant="secondary" loading>
              Processing...
            </Button>
            <Button variant="secondary" disabled>
              Disabled
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Full Width Buttons</h3>
          <div className="max-w-md space-y-3">
            <Button variant="primary" fullWidth onClick={handleSubmit}>
              Full Width Primary
            </Button>
            <Button variant="secondary" fullWidth>
              Full Width Secondary
            </Button>
          </div>
        </div>
      </section>

      {/* Form Fields Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Form Fields</h2>

        <div className="max-w-md space-y-6">
          <FormField
            label="Email Address"
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => handleEmailChange(e.target.value)}
            icon={<EmailIcon />}
            focusedIcon={<EmailIconFocused />}
            error={emailError}
          />

          <FormField
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <FormField label="Message" placeholder="Enter your message" error="This field is required" />
        </div>
      </section>

      {/* Links Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Links</h2>

        <div className="space-y-4">
          <p className="text-base">
            This is a paragraph with a <Link href="#demo">standard link</Link> in the middle.
          </p>

          <p className="text-sm">
            This is smaller text with a <Link href="#demo">smaller link</Link> that inherits the font size.
          </p>

          <p className="text-lg">
            This is larger text with a <Link href="#demo">larger link</Link> that scales appropriately.
          </p>
        </div>
      </section>

      {/* Combined Example */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Combined Example</h2>

        <div className="max-w-md p-6 border rounded-lg space-y-6">
          <PageHeader title="Sign In" subtitle="Enter your credentials to continue" />

          <div className="space-y-4">
            <FormField
              label="Email"
              type="email"
              placeholder="your@email.com"
              icon={<EmailIcon />}
              focusedIcon={<EmailIconFocused />}
            />

            <FormField label="Password" type="password" placeholder="Enter password" />
          </div>

          <Button variant="primary" fullWidth loading={loading} onClick={handleSubmit}>
            {loading ? "Signing In..." : "Sign In"}
          </Button>

          <Button variant="secondary" fullWidth icon={<GoogleIcon />}>
            Continue with Google
          </Button>

          <p className="text-center text-sm text-gray-600">
            Don&apos;t have an account? <Link href="#signup">Sign up here</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
