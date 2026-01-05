import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Test Pages - Jiki",
  description: "Component test pages for development and E2E testing."
};

export default function TestIndexPage() {
  const testPages = [
    {
      category: "CodeMirror",
      pages: [
        {
          name: "Extensions",
          path: "/test/codemirror/extensions",
          description: "Test page for CodeMirror extensions"
        }
      ]
    },
    {
      category: "Coding Exercise",
      pages: [
        {
          name: "Breakpoint Gutter",
          path: "/test/coding-exercise/breakpoint-gutter",
          description: "Test breakpoint gutter functionality"
        },
        {
          name: "Breakpoint Stepper Buttons",
          path: "/test/coding-exercise/breakpoint-stepper-buttons",
          description: "Test breakpoint navigation controls"
        },
        {
          name: "Code Folding",
          path: "/test/coding-exercise/code-folding",
          description: "Test code folding functionality"
        },
        {
          name: "Frame Stepper Buttons",
          path: "/test/coding-exercise/frame-stepper-buttons",
          description: "Test frame navigation controls"
        },
        {
          name: "Orchestrator CodeMirror",
          path: "/test/coding-exercise/orchestrator-codemirror",
          description: "Test orchestrator integration with CodeMirror"
        },
        {
          name: "Scrubber Input",
          path: "/test/coding-exercise/scrubber-input",
          description: "Test timeline scrubber input control"
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Test Pages</h1>
        <p className="text-gray-600 mb-8">Component test pages for development and E2E testing</p>

        {testPages.map((category) => (
          <div key={category.category} className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">{category.category}</h2>
            <div className="grid gap-4">
              {category.pages.map((page) => (
                <Link
                  key={page.path}
                  href={page.path}
                  className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4 border border-gray-200 hover:border-blue-300"
                >
                  <h3 className="font-medium text-blue-600 hover:text-blue-800 mb-1">{page.name}</h3>
                  <p className="text-sm text-gray-600">{page.description}</p>
                  <p className="text-xs text-gray-400 mt-2 font-mono">{page.path}</p>
                </Link>
              ))}
            </div>
          </div>
        ))}

        <div className="mt-12 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> These pages are for testing purposes only and are not available in production.
          </p>
        </div>
      </div>
    </div>
  );
}
