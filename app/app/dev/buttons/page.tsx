"use client";

export default function ButtonShowcasePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto p-32">
        <div className="mb-12">
          <h1 className="text-3xl font-bold mb-8">ui-btn Showcase</h1>
          <p className="text-gray-600">All button variants using the ui-btn class system.</p>
        </div>

        {/* Primary Buttons */}
        <section className="bg-white rounded-lg shadow-sm mb-32 p-32">
          <h2 className="text-2xl font-semibold mb-24 text-gray-900">Primary Buttons</h2>
          <div className="flex flex-wrap gap-16 items-center">
            <button className="ui-btn ui-btn-default ui-btn-primary">Blue (Default)</button>
            <button className="ui-btn ui-btn-default ui-btn-primary ui-btn-purple">Purple</button>
            <button className="ui-btn ui-btn-default ui-btn-primary ui-btn-green">Green</button>
            <button className="ui-btn ui-btn-default ui-btn-primary ui-btn-amber">Amber</button>
            <button className="ui-btn ui-btn-default ui-btn-primary ui-btn-red">Red</button>
            <button className="ui-btn ui-btn-default ui-btn-primary ui-btn-gray">Gray</button>
          </div>
        </section>

        {/* Secondary Buttons */}
        <section className="bg-white rounded-lg shadow-sm mb-32 p-32">
          <h2 className="text-2xl font-semibold mb-24 text-gray-900">Secondary Buttons</h2>
          <div className="flex flex-wrap gap-16 items-center">
            <button className="ui-btn ui-btn-default ui-btn-secondary">Blue (Default)</button>
            <button className="ui-btn ui-btn-default ui-btn-secondary ui-btn-purple">Purple</button>
            <button className="ui-btn ui-btn-default ui-btn-secondary ui-btn-green">Green</button>
            <button className="ui-btn ui-btn-default ui-btn-secondary ui-btn-amber">Amber</button>
            <button className="ui-btn ui-btn-default ui-btn-secondary ui-btn-red">Red</button>
            <button className="ui-btn ui-btn-default ui-btn-secondary ui-btn-gray">Gray</button>
          </div>
        </section>

        {/* Tertiary & Subtle */}
        <section className="bg-white rounded-lg shadow-sm mb-32 p-32">
          <h2 className="text-2xl font-semibold mb-24 text-gray-900">Tertiary & Subtle</h2>
          <div className="flex flex-wrap gap-16 items-center">
            <button className="ui-btn ui-btn-default ui-btn-tertiary">Tertiary</button>
            <button className="ui-btn ui-btn-default ui-btn-subtle">Subtle</button>
          </div>
        </section>

        {/* Danger Button */}
        <section className="bg-white rounded-lg shadow-sm mb-32 p-32">
          <h2 className="text-2xl font-semibold mb-24 text-gray-900">Danger Button</h2>
          <div className="flex flex-wrap gap-16 items-center">
            <button className="ui-btn ui-btn-default ui-btn-danger">Danger Action</button>
          </div>
        </section>

        {/* Sizes */}
        <section className="bg-white rounded-lg shadow-sm mb-32 p-32">
          <h2 className="text-2xl font-semibold mb-24 text-gray-900">Sizes</h2>
          <div className="flex flex-wrap gap-16 items-end">
            <button className="ui-btn ui-btn-small ui-btn-primary">Small</button>
            <button className="ui-btn ui-btn-default ui-btn-primary">Default</button>
            <button className="ui-btn ui-btn-large ui-btn-primary">Large</button>
            <button className="ui-btn ui-btn-xlarge ui-btn-primary">X-Large</button>
          </div>
        </section>

        {/* States */}
        <section className="bg-white rounded-lg shadow-sm mb-32 p-32">
          <h2 className="text-2xl font-semibold mb-24 text-gray-900">States</h2>
          <div className="space-y-24">
            <div>
              <h3 className="text-lg font-medium mb-16 text-gray-700">Loading</h3>
              <div className="flex flex-wrap gap-16 items-center">
                <button className="ui-btn ui-btn-default ui-btn-primary ui-btn-loading">Loading</button>
                <button className="ui-btn ui-btn-default ui-btn-secondary ui-btn-loading">Loading</button>
                <button className="ui-btn ui-btn-default ui-btn-tertiary ui-btn-loading">Loading</button>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-16 text-gray-700">Disabled</h3>
              <div className="flex flex-wrap gap-16 items-center">
                <button className="ui-btn ui-btn-default ui-btn-primary" disabled>
                  Disabled
                </button>
                <button className="ui-btn ui-btn-default ui-btn-secondary" disabled>
                  Disabled
                </button>
                <button className="ui-btn ui-btn-default ui-btn-tertiary" disabled>
                  Disabled
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* As Links */}
        <section className="bg-white rounded-lg shadow-sm mb-32 p-32">
          <h2 className="text-2xl font-semibold mb-24 text-gray-900">As Links (anchor tags)</h2>
          <div className="flex flex-wrap gap-16 items-center">
            <a href="#" className="ui-btn ui-btn-default ui-btn-primary">
              Primary Link
            </a>
            <a href="#" className="ui-btn ui-btn-default ui-btn-secondary">
              Secondary Link
            </a>
            <a href="#" className="ui-btn ui-btn-default ui-btn-tertiary">
              Tertiary Link
            </a>
          </div>
        </section>

        {/* On Dark Background */}
        <section className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-sm mb-32 p-32">
          <h2 className="text-2xl font-semibold mb-24 text-white">On Colorful Background</h2>
          <div className="flex flex-wrap gap-16 items-center">
            <button className="ui-btn ui-btn-default ui-btn-for-colorful-background">For Colorful BG</button>
          </div>
        </section>
      </div>
    </div>
  );
}
