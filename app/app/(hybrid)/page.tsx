import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { hasServersideAccessToken } from "../../lib/auth/server-storage";

export const metadata: Metadata = {
  title: "Jiki - Learn to Code Through Interactive Exercises",
  description:
    "Master programming through hands-on coding exercises and real-world projects. Join thousands of learners practicing with instant feedback and expert mentorship."
};

export default async function RootPage() {
  const hasToken = await hasServersideAccessToken();

  if (hasToken) {
    redirect("/dashboard");
  }

  return <LandingPage />;
}

function LandingPage() {
  // Render landing page for unauthenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
          Welcome to Jiki
        </h1>
        <p className="text-xl text-gray-700 mb-12 max-w-2xl mx-auto">
          Learn to code through interactive exercises and real-world projects. Start your programming journey today.
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/auth/login"
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
          >
            Login
          </Link>
          <Link
            href="/auth/signup"
            className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors shadow-lg"
          >
            Sign Up
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="bg-white/80 backdrop-blur rounded-lg p-6 shadow-lg">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="font-semibold text-lg mb-2">Interactive Learning</h3>
            <p className="text-gray-600">Learn by doing with hands-on coding exercises and instant feedback.</p>
          </div>
          <div className="bg-white/80 backdrop-blur rounded-lg p-6 shadow-lg">
            <div className="text-3xl mb-3">📈</div>
            <h3 className="font-semibold text-lg mb-2">Track Progress</h3>
            <p className="text-gray-600">Monitor your learning journey and celebrate achievements along the way.</p>
          </div>
          <div className="bg-white/80 backdrop-blur rounded-lg p-6 shadow-lg">
            <div className="text-3xl mb-3">🚀</div>
            <h3 className="font-semibold text-lg mb-2">Real Projects</h3>
            <p className="text-gray-600">Build real-world applications and add them to your portfolio.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
