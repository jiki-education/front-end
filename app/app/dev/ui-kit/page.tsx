"use client";

import { Button, ButtonGroup, FormField, FormFieldGroup, PageHeader, PageTabs, Link } from "@/components/ui-kit";
import { Icon } from "@/components/ui-kit/Icon";

export default function UIKitDemoPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto p-32">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold mb-8">UI Kit - Components</h1>
          <p className="text-gray-600">This page contains the component styles and examples for the design system.</p>
        </div>

        {/* Buttons Section */}
        <section className="bg-white rounded-lg shadow-sm mb-32 p-32">
          <h2 className="text-2xl font-semibold mb-32 text-gray-900">Buttons</h2>

          {/* Primary Button */}
          <div className="bg-gray-50 rounded-lg p-24 mb-24">
            <h3 className="text-lg font-semibold mb-8 text-gray-900">Primary Button</h3>
            <p className="text-gray-600 text-sm mb-24">
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
          <div className="bg-gray-50 rounded-lg p-24 mb-24">
            <h3 className="text-lg font-semibold mb-8 text-gray-900">Secondary Button</h3>
            <p className="text-gray-600 text-sm mb-24">
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
          <div className="bg-gray-50 rounded-lg p-24 mb-24">
            <h3 className="text-lg font-semibold mb-8 text-gray-900">Default Button</h3>
            <p className="text-gray-600 text-sm mb-24">Standard button with basic styling for general use.</p>
            <div className="flex flex-wrap gap-4">
              <Button>Default Button</Button>
              <Button loading>Loading...</Button>
              <Button disabled>Disabled</Button>
            </div>
          </div>

          {/* Button Group */}
          <div className="bg-gray-50 rounded-lg p-24">
            <h3 className="text-lg font-semibold mb-8 text-gray-900">Button Group</h3>
            <p className="text-gray-600 text-sm mb-24">Related buttons grouped together with connected styling.</p>
            <ButtonGroup>
              <Button>First</Button>
              <Button>Second</Button>
              <Button>Third</Button>
            </ButtonGroup>
          </div>
        </section>

        {/* Form Fields Section */}
        <section className="bg-white rounded-lg shadow-sm mb-32 p-32">
          <h2 className="text-2xl font-semibold mb-32 text-gray-900">Form Fields</h2>

          <div className="bg-gray-50 rounded-lg p-24 mb-24">
            <h3 className="text-lg font-semibold mb-8 text-gray-900">Standard Fields (Without Icons)</h3>
            <p className="text-gray-600 text-sm mb-24">
              Basic form fields with label and input. Labels change color on focus.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-24 max-w-4xl">
              <FormField label="Email Address" name="email" type="email" placeholder="Enter your email address" />
              <FormField label="Password" name="password" type="password" placeholder="Enter your password" />
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-24 mb-24">
            <h3 className="text-lg font-semibold mb-8 text-gray-900">Fields With Icons</h3>
            <p className="text-gray-600 text-sm mb-24">
              Form fields with icons that provide visual context. Icons maintain color consistency with field states.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-24 max-w-4xl">
              <FormField
                label="Email Address"
                name="email-icon"
                type="email"
                placeholder="Enter your email address"
                iconName="email"
              />
              <FormField
                label="Password"
                name="password-icon"
                type="password"
                placeholder="Enter your password"
                iconName="locked"
              />
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-24 mb-24">
            <h3 className="text-lg font-semibold mb-8 text-gray-900">Error States</h3>
            <p className="text-gray-600 text-sm mb-24">
              Form fields in error state with validation messages. Includes shake animation and red border.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-24 max-w-4xl">
              <FormField
                label="Email Address"
                name="email-error"
                type="email"
                placeholder="Enter your email address"
                value="invalid-email"
                error="Please enter a valid email address"
                iconName="email"
              />
              <FormField
                label="Password"
                name="password-error"
                type="password"
                placeholder="Enter your password"
                value="123"
                error="Password must be at least 8 characters"
                iconName="locked"
              />
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-24">
            <h3 className="text-lg font-semibold mb-8 text-gray-900">Field Groups</h3>
            <p className="text-gray-600 text-sm mb-24">Related form fields grouped together with consistent spacing.</p>
            <div className="max-w-2xl">
              <FormFieldGroup>
                <FormField label="First Name" name="firstName" placeholder="John" />
                <FormField label="Last Name" name="lastName" placeholder="Doe" />
              </FormFieldGroup>
            </div>
          </div>
        </section>

        {/* Page Header Section */}
        <section className="bg-white rounded-lg shadow-sm mb-32 p-32">
          <h2 className="text-2xl font-semibold mb-32 text-gray-900">Page Header</h2>

          <div className="bg-gray-50 rounded-lg p-24">
            <p className="text-gray-600 text-sm mb-24">
              Standard page header with title and subtitle. Used at the top of main content areas.
            </p>
            <PageHeader title="Dashboard" subtitle="Manage your account and settings" />
          </div>
        </section>

        {/* Page Tabs Section */}
        <section className="bg-white rounded-lg shadow-sm mb-32 p-32">
          <h2 className="text-2xl font-semibold mb-32 text-gray-900">Page Tabs</h2>

          <div className="bg-gray-50 rounded-lg p-24">
            <p className="text-gray-600 text-sm mb-24">
              Horizontal tab navigation for filtering or switching page views. Supports color variants (blue, purple,
              green, gray).
            </p>

            <div className="space-y-32">
              {/* Blue (Default) */}
              <div>
                <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-12">
                  Blue Active (Default)
                </div>
                <PageTabs
                  tabs={[
                    { id: "all", label: "All", icon: <Icon name="all" size={16} /> },
                    { id: "not-started", label: "Not started", icon: <Icon name="in-progress" size={16} /> }
                  ]}
                  activeTabId="all"
                  onTabChange={() => {}}
                  color="blue"
                />
              </div>

              {/* Purple */}
              <div>
                <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-12">Purple Active</div>
                <PageTabs
                  tabs={[
                    {
                      id: "in-progress",
                      label: "In Progress",
                      icon: <Icon name="in-progress" size={16} color="purple" />
                    },
                    { id: "other", label: "Other Tab" }
                  ]}
                  activeTabId="in-progress"
                  onTabChange={() => {}}
                  color="purple"
                />
              </div>

              {/* Green */}
              <div>
                <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-12">Green Active</div>
                <PageTabs
                  tabs={[
                    { id: "complete", label: "Complete", icon: <Icon name="complete" size={16} color="green" /> },
                    { id: "other2", label: "Other Tab" }
                  ]}
                  activeTabId="complete"
                  onTabChange={() => {}}
                  color="green"
                />
              </div>

              {/* Gray */}
              <div>
                <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-12">Gray Active</div>
                <PageTabs
                  tabs={[
                    { id: "locked", label: "Locked", icon: <Icon name="locked" size={16} color="gray-500" /> },
                    { id: "other3", label: "Other Tab" }
                  ]}
                  activeTabId="locked"
                  onTabChange={() => {}}
                  color="gray"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Icons Section */}
        <section className="bg-white rounded-lg shadow-sm mb-32 p-32">
          <h2 className="text-2xl font-semibold mb-32 text-gray-900">Icons</h2>

          <div className="bg-gray-50 rounded-lg p-24 mb-24">
            <h3 className="text-lg font-semibold mb-8 text-gray-900">Default Icons</h3>
            <p className="text-gray-600 text-sm mb-24">
              Icons without color override inherit from parent or use currentColor.
            </p>
            <div className="flex flex-wrap gap-4 items-center">
              <Icon name="email" size={24} />
              <Icon name="password" size={24} />
              <Icon name="complete" size={24} />
              <Icon name="in-progress" size={24} />
              <Icon name="locked" size={24} />
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-24 mb-24">
            <h3 className="text-lg font-semibold mb-8 text-gray-900">Custom Colors</h3>
            <p className="text-gray-600 text-sm mb-24">Icons with custom color using Tailwind color classes.</p>
            <div className="flex flex-wrap gap-4 items-center">
              <Icon name="email" size={24} color="red-500" />
              <Icon name="password" size={24} color="blue-500" />
              <Icon name="complete" size={24} color="orange-500" />
              <Icon name="in-progress" size={24} color="purple-500" />
              <Icon name="locked" size={24} color="gray-500" />
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-24">
            <h3 className="text-lg font-semibold mb-8 text-gray-900">Different Sizes</h3>
            <p className="text-gray-600 text-sm mb-24">Icons in various sizes with custom colors.</p>
            <div className="flex flex-wrap gap-4 items-center">
              <Icon name="email" size={12} color="blue-600" />
              <Icon name="email" size={16} color="blue-600" />
              <Icon name="email" size={20} color="blue-600" />
              <Icon name="email" size={24} color="blue-600" />
              <Icon name="email" size={32} color="blue-600" />
              <Icon name="email" size={40} color="blue-600" />
              <Icon name="email" size={48} color="blue-600" />
            </div>
          </div>
        </section>

        {/* Links Section */}
        <section className="bg-white rounded-lg shadow-sm mb-32 p-32">
          <h2 className="text-2xl font-semibold mb-32 text-gray-900">Links</h2>

          <div className="bg-gray-50 rounded-lg p-24">
            <p className="text-gray-600 text-sm mb-24">Standard link component. Font size inherits from context.</p>
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
