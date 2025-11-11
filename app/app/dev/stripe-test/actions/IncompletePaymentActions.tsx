export function IncompletePaymentActions() {
  return (
    <div className="space-y-3">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-yellow-700">Payment In Progress</h3>
        <p className="text-sm text-gray-600">Your checkout session is awaiting payment confirmation</p>
      </div>

      <button
        disabled
        className="w-full px-4 py-3 bg-gray-600 text-white font-semibold rounded opacity-50 cursor-not-allowed"
        title="Not implemented yet"
      >
        Complete Payment
      </button>

      <button
        disabled
        className="w-full px-4 py-3 bg-red-600 text-white font-semibold rounded opacity-50 cursor-not-allowed"
        title="Not implemented yet"
      >
        Cancel Checkout
      </button>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">Checkout initiated but not completed</p>
      </div>
    </div>
  );
}
