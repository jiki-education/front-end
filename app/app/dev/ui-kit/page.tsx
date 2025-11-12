"use client";

import { Button, ButtonGroup, FormField, FormFieldGroup, PageHeader, PageTabs, Link } from "@/components/ui-kit";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "features", label: "Features" },
  { id: "pricing", label: "Pricing" }
];

export default function UIKitDemoPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto p-8">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold mb-2">UI Kit - Components</h1>
          <p className="text-gray-600">This page contains the component styles and examples for the design system.</p>
        </div>

        {/* Buttons Section */}
        <section className="bg-white rounded-lg shadow-sm mb-8 p-8">
          <h2 className="text-2xl font-semibold mb-8 text-gray-900">Buttons</h2>

          {/* Primary Button */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Primary Button</h3>
            <p className="text-gray-600 text-sm mb-6">
              Main call-to-action button with enhanced styling and hover states.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">Primary Button</Button>
              <Button variant="primary" loading>
                Loading...
              </Button>
              <Button variant="primary" disabled>
                Disabled
              </Button>
            </div>
          </div>

          {/* Secondary Button */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Secondary Button</h3>
            <p className="text-gray-600 text-sm mb-6">
              Secondary action button with subtle styling. Supports optional icons.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="secondary" loading>
                Processing...
              </Button>
              <Button variant="secondary" disabled>
                Disabled
              </Button>
            </div>
          </div>

          {/* Default Button */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Default Button</h3>
            <p className="text-gray-600 text-sm mb-6">Standard button with basic styling for general use.</p>
            <div className="flex flex-wrap gap-4">
              <Button>Default Button</Button>
              <Button loading>Loading...</Button>
              <Button disabled>Disabled</Button>
            </div>
          </div>

          {/* Button Group */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Button Group</h3>
            <p className="text-gray-600 text-sm mb-6">Related buttons grouped together with connected styling.</p>
            <ButtonGroup>
              <Button>First</Button>
              <Button>Second</Button>
              <Button>Third</Button>
            </ButtonGroup>
          </div>
        </section>

        {/* Form Fields Section */}
        <section className="bg-white rounded-lg shadow-sm mb-8 p-8">
          <h2 className="text-2xl font-semibold mb-8 text-gray-900">Form Fields</h2>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Individual Fields</h3>
            <p className="text-gray-600 text-sm mb-6">
              Standard form fields with label and input. Labels change color on focus.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
              <FormField label="Email Address" name="email" type="email" placeholder="Enter your email address" />
              <FormField label="Password" name="password" type="password" placeholder="Enter your password" />
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Field Groups</h3>
            <p className="text-gray-600 text-sm mb-6">Related form fields grouped together with consistent spacing.</p>
            <div className="max-w-2xl">
              <FormFieldGroup>
                <FormField label="First Name" name="firstName" placeholder="John" />
                <FormField label="Last Name" name="lastName" placeholder="Doe" />
              </FormFieldGroup>
            </div>
          </div>
        </section>

        {/* Page Header Section */}
        <section className="bg-white rounded-lg shadow-sm mb-8 p-8">
          <h2 className="text-2xl font-semibold mb-8 text-gray-900">Page Header</h2>

          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-gray-600 text-sm mb-6">
              Standard page header with title and subtitle. Used at the top of main content areas.
            </p>
            <PageHeader title="Dashboard" subtitle="Manage your account and settings" />
          </div>
        </section>

        {/* Page Tabs Section */}
        <section className="bg-white rounded-lg shadow-sm mb-8 p-8">
          <h2 className="text-2xl font-semibold mb-8 text-gray-900">Page Tabs</h2>

          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-gray-600 text-sm mb-6">
              Horizontal tab navigation for filtering or switching page views.
            </p>
            <PageTabs tabs={tabs} activeTabId="overview" onTabChange={() => {}} />
          </div>
        </section>

        {/* Links Section */}
        <section className="bg-white rounded-lg shadow-sm mb-8 p-8">
          <h2 className="text-2xl font-semibold mb-8 text-gray-900">Links</h2>

          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-gray-600 text-sm mb-6">Standard link component. Font size inherits from context.</p>
            <div className="space-y-4">
              <p className="text-base">
                This is a paragraph with a <Link href="/home">standard link</Link> embedded in text.
              </p>
              <p className="text-sm">
                Same link in <Link href="/home">smaller text</Link> context.
              </p>
              <p className="text-lg">
                And in <Link href="/home">larger text</Link> context.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
