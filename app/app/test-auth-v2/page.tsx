"use client";

import { api } from "@/lib/api";
import { getToken } from "@/lib/auth/storage";
import { useAuthStore } from "@/stores/authStore";
import { useState } from "react";

export default function TestAuthV2Page() {
  const { login, signup, logout, user, isAuthenticated, error: authError } = useAuthStore();
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("password123");
  const [levels, setLevels] = useState<any>(null);
  const [testResults, setTestResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setTestResults((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const handleSignup = async () => {
    addResult("Attempting signup...");
    try {
      await signup({
        email,
        password,
        password_confirmation: password
      });
      addResult("✅ Signup successful!");
    } catch (error: any) {
      addResult(`❌ Signup failed: ${error.message}`);
    }
  };

  const handleLogin = async () => {
    addResult("Attempting login...");
    try {
      await login({ email, password });
      addResult("✅ Login successful!");

      const token = getToken();
      if (token) {
        addResult(`✅ Token stored: ${token.substring(0, 30)}...`);
      } else {
        addResult("⚠️ Warning: No token found after login");
      }
    } catch (error: any) {
      addResult(`❌ Login failed: ${error.message}`);
    }
  };

  const testLevels = async () => {
    addResult("Testing /v1/levels endpoint...");
    const token = getToken();

    if (!token) {
      addResult("❌ No token found. Please login first.");
      return;
    }

    addResult(`Using token: ${token.substring(0, 30)}...`);

    try {
      const response = await api.get("/levels");
      setLevels(response.data);
      addResult("✅ Successfully fetched levels!");
      addResult(`Received ${Array.isArray(response.data) ? response.data.length : "unknown"} levels`);
    } catch (error: any) {
      addResult(`❌ Failed to fetch levels: ${error.message}`);
      if (error.status === 401) {
        addResult("Token might be invalid or not being sent correctly");
      }
    }
  };

  const testDirectFetch = async () => {
    addResult("Testing direct fetch to /v1/levels...");
    const token = getToken();

    if (!token) {
      addResult("❌ No token found. Please login first.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3061/v1/levels", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        setLevels(data);
        addResult("✅ Direct fetch successful!");
      } else {
        const error = await response.json();
        addResult(`❌ Direct fetch failed: ${error.error?.message || response.statusText}`);
      }
    } catch (error: any) {
      addResult(`❌ Direct fetch error: ${error.message}`);
    }
  };

  const handleLogout = async () => {
    addResult("Logging out...");
    await logout();
    setLevels(null);
    addResult("✅ Logged out");
  };

  const clearResults = () => {
    setTestResults([]);
    setLevels(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Rails Auth Integration Test</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Controls */}
          <div className="space-y-6">
            {/* Auth Status */}
            <div className="bg-white rounded-lg p-6 shadow">
              <h2 className="text-xl font-semibold mb-4">Auth Status</h2>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Authenticated:</span>{" "}
                  <span className={isAuthenticated ? "text-green-600" : "text-red-600"}>
                    {isAuthenticated ? "✅ Yes" : "❌ No"}
                  </span>
                </p>
                {user && (
                  <>
                    <p>
                      <span className="font-medium">User ID:</span> {user.id}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span> {user.email}
                    </p>
                    <p>
                      <span className="font-medium">Name:</span> {user.name || "Not set"}
                    </p>
                  </>
                )}
                {getToken() && (
                  <p className="text-xs text-gray-600">
                    <span className="font-medium">Token:</span> {getToken()?.substring(0, 30)}...
                  </p>
                )}
              </div>
              {authError && <div className="mt-4 p-3 bg-red-50 text-red-700 rounded text-sm">{authError}</div>}
            </div>

            {/* Credentials */}
            <div className="bg-white rounded-lg p-6 shadow">
              <h2 className="text-xl font-semibold mb-4">Test Credentials</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg p-6 shadow">
              <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleSignup}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                >
                  1. Signup
                </button>
                <button
                  onClick={handleLogin}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                >
                  2. Login
                </button>
                <button
                  onClick={testLevels}
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
                >
                  3. Fetch Levels (API)
                </button>
                <button
                  onClick={testDirectFetch}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
                >
                  4. Fetch Levels (Direct)
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
                >
                  Logout
                </button>
                <button
                  onClick={clearResults}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            {/* Test Results */}
            <div className="bg-white rounded-lg p-6 shadow">
              <h2 className="text-xl font-semibold mb-4">Test Log</h2>
              <div className="bg-gray-50 rounded p-4 h-64 overflow-y-auto">
                {testResults.length > 0 ? (
                  <div className="space-y-1">
                    {testResults.map((result, index) => (
                      <div key={index} className="text-xs font-mono">
                        {result}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No test results yet. Try an action above.</p>
                )}
              </div>
            </div>

            {/* Levels Data */}
            {levels && (
              <div className="bg-white rounded-lg p-6 shadow">
                <h2 className="text-xl font-semibold mb-4">Levels Data</h2>
                <div className="bg-gray-50 rounded p-4 max-h-96 overflow-y-auto">
                  <pre className="text-xs">{JSON.stringify(levels, null, 2)}</pre>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="font-semibold mb-2">Test Workflow:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Try signup first (might fail if user exists - that&apos;s ok)</li>
            <li>Login with the test credentials</li>
            <li>Check that auth status shows authenticated</li>
            <li>Test fetching levels using API client</li>
            <li>If API client fails, try direct fetch to debug</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
