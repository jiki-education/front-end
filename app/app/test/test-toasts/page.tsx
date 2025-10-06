"use client";

import toast from "react-hot-toast";

export default function TestToastsPage() {
  const showToast = () => toast("Here's your toast!");

  const showSuccess = () => toast.success("Successfully created!");

  const showError = () => toast.error("This didn't work.");

  const showLoading = () => {
    const loadingToast = toast.loading("Saving...");

    setTimeout(() => {
      toast.dismiss(loadingToast);
      toast.success("Saved!");
    }, 2000);
  };

  const showPromise = () => {
    const myPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.5) {
          resolve("Success!");
        } else {
          reject("Failed!");
        }
      }, 2000);
    });

    void toast.promise(myPromise, {
      loading: "Loading...",
      success: "Got the data",
      error: "Error when fetching"
    });
  };

  const showCustom = () => {
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">Custom Notification</p>
              <p className="mt-1 text-sm text-gray-500">This is a custom styled toast!</p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-200">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Close
          </button>
        </div>
      </div>
    ));
  };

  const showMultiple = () => {
    toast("First toast!");
    setTimeout(() => toast.success("Second toast!"), 500);
    setTimeout(() => toast.error("Third toast!"), 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Toast Notifications Test Page</h1>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Test Different Toast Types</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={showToast}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
            >
              Basic Toast
            </button>

            <button
              onClick={showSuccess}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Success Toast
            </button>

            <button onClick={showError} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">
              Error Toast
            </button>

            <button
              onClick={showLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Loading Toast (2s)
            </button>

            <button
              onClick={showPromise}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
            >
              Promise Toast (50/50)
            </button>

            <button
              onClick={showCustom}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
              Custom Toast
            </button>

            <button
              onClick={showMultiple}
              className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition"
            >
              Multiple Toasts
            </button>

            <button
              onClick={() => toast.dismiss()}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
            >
              Dismiss All
            </button>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-blue-900 mb-2">How to use from anywhere</h3>
          <pre className="bg-blue-100 rounded p-3 text-sm overflow-x-auto">
            <code>{`import toast from "react-hot-toast";

// Basic usage
toast("Hello World");
toast.success("Success!");
toast.error("Error!");
toast.loading("Loading...");

// With promise
toast.promise(myPromise, {
  loading: 'Loading...',
  success: 'Success!',
  error: 'Error!',
});`}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
