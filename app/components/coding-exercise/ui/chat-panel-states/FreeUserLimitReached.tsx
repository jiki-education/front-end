// Non-premium user, conversation not allowed, no existing conversation
// They've used their free conversation limit
export default function FreeUserLimitReached() {
  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <p className="text-gray-600">Free user has reached their conversation limit</p>
    </div>
  );
}
