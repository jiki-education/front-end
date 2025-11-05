"use client";

import { useTheme } from "@/lib/theme";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function AccessibilityTestPage() {
  const { theme, resolvedTheme } = useTheme();

  return (
    <div className="min-h-screen bg-bg-primary p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-bg-secondary border border-border-primary rounded-lg p-6">
          <h1 className="text-3xl font-bold text-text-primary mb-4">Accessibility Test Suite</h1>
          <div className="flex items-center gap-4">
            <span className="text-text-secondary">
              Current theme: <strong className="text-text-primary">{theme}</strong>
              {theme === "system" && ` (resolved: ${resolvedTheme})`}
            </span>
            <ThemeToggle />
          </div>
        </div>

        {/* Contrast Ratio Testing */}
        <div className="bg-bg-secondary border border-border-primary rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-text-primary mb-6">Contrast Ratio Testing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Text Contrast */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-text-primary">Text Contrast</h3>
              <div className="space-y-2">
                <div className="bg-bg-primary p-3 rounded border">
                  <p className="text-text-primary">Primary text (AAA)</p>
                </div>
                <div className="bg-bg-primary p-3 rounded border">
                  <p className="text-text-secondary">Secondary text (AA)</p>
                </div>
                <div className="bg-bg-primary p-3 rounded border">
                  <p className="text-text-tertiary">Tertiary text (AA)</p>
                </div>
                <div className="bg-bg-primary p-3 rounded border">
                  <p className="text-text-muted">Muted text (AA Large)</p>
                </div>
              </div>
            </div>

            {/* Link Contrast */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-text-primary">Link Contrast</h3>
              <div className="space-y-2">
                <div className="bg-bg-primary p-3 rounded border">
                  <a href="#" className="text-link-primary hover:text-link-hover focus-ring">
                    Primary link
                  </a>
                </div>
                <div className="bg-bg-primary p-3 rounded border">
                  <a href="#" className="text-link-primary hover:text-link-hover focus-ring underline">
                    Underlined link
                  </a>
                </div>
                <div className="bg-bg-secondary p-3 rounded border">
                  <a href="#" className="text-link-primary hover:text-link-hover focus-ring">
                    Link on secondary background
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Focus States Testing */}
        <div className="bg-bg-secondary border border-border-primary rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-text-primary mb-6">Focus States</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Buttons */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-text-primary">Interactive Elements</h3>
              <div className="space-y-3">
                <button className="w-full bg-button-primary-bg text-button-primary-text px-4 py-2 rounded-md focus-ring">
                  Primary Button
                </button>
                <button className="w-full bg-button-secondary-bg text-button-secondary-text px-4 py-2 rounded-md border border-border-secondary focus-ring">
                  Secondary Button
                </button>
                <button className="w-full bg-bg-primary text-text-primary px-4 py-2 rounded-md border border-border-primary hover:bg-bg-secondary focus-ring">
                  Outline Button
                </button>
              </div>
            </div>

            {/* Form Elements */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-text-primary">Form Elements</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Text input"
                  className="w-full px-3 py-2 bg-bg-primary border border-border-primary rounded-md text-text-primary placeholder-text-tertiary focus-ring"
                />
                <select className="w-full px-3 py-2 bg-bg-primary border border-border-primary rounded-md text-text-primary focus-ring">
                  <option>Option 1</option>
                  <option>Option 2</option>
                </select>
                <textarea
                  placeholder="Textarea"
                  rows={3}
                  className="w-full px-3 py-2 bg-bg-primary border border-border-primary rounded-md text-text-primary placeholder-text-tertiary focus-ring resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Status Colors Testing */}
        <div className="bg-bg-secondary border border-border-primary rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-text-primary mb-6">Status Colors Accessibility</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-success-bg border border-success-border p-4 rounded">
              <h4 className="font-medium text-success-text mb-2">Success</h4>
              <p className="text-sm text-success-text">Action completed successfully</p>
            </div>

            <div className="bg-error-bg border border-error-border p-4 rounded">
              <h4 className="font-medium text-error-text mb-2">Error</h4>
              <p className="text-sm text-error-text">Something went wrong</p>
            </div>

            <div className="bg-warning-bg border border-warning-border p-4 rounded">
              <h4 className="font-medium text-warning-text mb-2">Warning</h4>
              <p className="text-sm text-warning-text">Please review this item</p>
            </div>

            <div className="bg-info-bg border border-info-border p-4 rounded">
              <h4 className="font-medium text-info-text mb-2">Information</h4>
              <p className="text-sm text-info-text">Additional details available</p>
            </div>
          </div>
        </div>

        {/* Keyboard Navigation Test */}
        <div className="bg-bg-secondary border border-border-primary rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-text-primary mb-6">Keyboard Navigation</h2>
          <p className="text-text-secondary mb-4">
            Use Tab to navigate through these elements. Focus rings should be clearly visible.
          </p>
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 bg-button-primary-bg text-button-primary-text rounded focus-ring">
              Button 1
            </button>
            <button className="px-4 py-2 bg-button-secondary-bg text-button-secondary-text rounded focus-ring">
              Button 2
            </button>
            <a href="#" className="px-4 py-2 text-link-primary border border-border-primary rounded focus-ring">
              Link 1
            </a>
            <a href="#" className="px-4 py-2 text-link-primary border border-border-primary rounded focus-ring">
              Link 2
            </a>
            <input
              type="text"
              placeholder="Input field"
              className="px-3 py-2 border border-border-primary rounded focus-ring"
            />
          </div>
        </div>

        {/* ARIA and Screen Reader Testing */}
        <div className="bg-bg-secondary border border-border-primary rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-text-primary mb-6">ARIA and Screen Reader Support</h2>
          <div className="space-y-4">
            <div role="alert" aria-live="polite" className="bg-error-bg border border-error-border p-4 rounded">
              <h3 className="font-medium text-error-text">Error Alert</h3>
              <p className="text-error-text">This is an important error message for screen readers.</p>
            </div>

            <div className="bg-bg-primary border border-border-primary p-4 rounded">
              <h3 className="text-text-primary mb-3">Progress Indicator</h3>
              <div
                role="progressbar"
                aria-valuenow={75}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Theme setup progress"
                className="w-full bg-bg-secondary rounded-full h-2"
              >
                <div
                  className="bg-link-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: "75%" }}
                ></div>
              </div>
              <p className="text-sm text-text-secondary mt-2">75% complete</p>
            </div>

            <div className="bg-bg-primary border border-border-primary p-4 rounded">
              <h3 className="text-text-primary mb-3">Toggle Switch</h3>
              <label className="flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only" />
                <div className="relative">
                  <div className="block bg-bg-secondary w-14 h-8 rounded-full border border-border-primary"></div>
                  <div className="absolute left-1 top-1 bg-button-primary-bg w-6 h-6 rounded-full transition focus-ring"></div>
                </div>
                <span className="ml-3 text-text-primary">Enable dark mode</span>
              </label>
            </div>
          </div>
        </div>

        {/* High Contrast Mode Notice */}
        <div className="bg-warning-bg border border-warning-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-warning-text mb-4">High Contrast Mode Support</h2>
          <p className="text-warning-text">
            This theme system automatically adapts to high contrast mode preferences. Test by enabling high contrast
            mode in your operating system settings.
          </p>
        </div>

        {/* Reduced Motion Notice */}
        <div className="bg-info-bg border border-info-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-info-text mb-4">Reduced Motion Support</h2>
          <p className="text-info-text">
            All theme transitions respect the &ldquo;prefers-reduced-motion&rdquo; setting. Animations will be disabled
            for users who prefer reduced motion.
          </p>
        </div>
      </div>
    </div>
  );
}
