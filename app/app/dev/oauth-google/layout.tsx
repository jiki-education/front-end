/**
 * Google OAuth Test Layout
 * Wraps the OAuth test page with GoogleOAuthProvider
 */

import { GoogleOAuthProvider } from "@react-oauth/google";

export default function OAuthTestLayout({ children }: { children: React.ReactNode }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!clientId) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-900 mb-2">Configuration Error</h2>
            <p className="text-red-800">NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set in environment variables.</p>
            <p className="text-red-800 mt-2">
              Add it to <code className="bg-red-100 px-1 rounded">.env.local</code> to use Google OAuth.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>;
}
