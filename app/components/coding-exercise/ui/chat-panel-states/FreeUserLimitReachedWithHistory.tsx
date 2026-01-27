// Non-premium user, conversation not allowed, but has existing conversation
// They can view their past conversation but can't continue
export default function FreeUserLimitReachedWithHistory() {
  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <p className="text-gray-600">Free user has reached limit but can view past conversation</p>
    </div>
  );
}
