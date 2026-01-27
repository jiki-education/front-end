// Premium user, conversation not allowed
// Temporary block (e.g., rate limit, maintenance)
export default function PremiumUserBlocked() {
  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <p className="text-gray-600">Premium user temporarily cannot start conversation</p>
    </div>
  );
}
