// Non-premium user, conversation allowed, no existing conversation
// This is their first free conversation opportunity
export default function FreeUserCanStart() {
  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <p className="text-gray-600">Free user can start their first conversation</p>
    </div>
  );
}
