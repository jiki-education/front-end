import Link from "next/link";

export default function DevPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Development Tools</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-4">
          <h2 className="text-xl font-semibold mb-3">Environment Info</h2>
          <dl className="space-y-2">
            <div>
              <dt className="inline font-medium">Node Environment:</dt>
              <dd className="inline ml-2">{process.env.NODE_ENV}</dd>
            </div>
            <div>
              <dt className="inline font-medium">Next.js Version:</dt>
              <dd className="inline ml-2">{process.env.NEXT_RUNTIME ? "Edge Runtime" : "Node Runtime"}</dd>
            </div>
          </dl>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-4">
          <h2 className="text-xl font-semibold mb-3">Dev Pages</h2>
          <ul className="space-y-2">
            <li>
              <Link href="/dev/llm-chat" className="text-blue-600 hover:underline">
                LLM Chat Proxy Test
              </Link>
              <span className="text-gray-600 text-sm ml-2">- Test the LLM chat proxy with SSE streaming</span>
            </li>
            <li>
              <Link href="/dev/stripe-test" className="text-blue-600 hover:underline">
                Stripe Subscription Test
              </Link>
              <span className="text-gray-600 text-sm ml-2">
                - Test Stripe subscription flows, upgrades, downgrades, and customer portal43
              </span>
            </li>
            <li>
              <Link href="/dev/typing-test" className="text-blue-600 hover:underline">
                Typing Effect Test
              </Link>
              <span className="text-gray-600 text-sm ml-2">
                - Test TypeIt.js chat typing animation without API calls
              </span>
            </li>
            <li>
              <Link href="/dev/ui-kit" className="text-blue-600 hover:underline">
                UI Kit Demo
              </Link>
              <span className="text-gray-600 text-sm ml-2">- Simple demo of all UI kit components</span>
            </li>
          </ul>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> This page is only accessible in development mode. It will return a 404 in production.
          </p>
        </div>
      </div>
    </div>
  );
}
