interface VisualTestResultViewProps {
  isPassing: boolean;
  errorHtml: string;
}

export function VisualTestResultView({ isPassing, errorHtml }: VisualTestResultViewProps) {
  return (
    <div className={`p-4 rounded-lg border ${isPassing ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
      <div className="flex items-center mb-2">
        <div
          className={`w-4 h-4 rounded-full flex items-center justify-center text-white text-xs ${
            isPassing ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {isPassing ? "✓" : "✗"}
        </div>
        <span className={`ml-2 font-medium ${isPassing ? "text-green-800" : "text-red-800"}`}>
          {isPassing ? "State Check Passed" : "State Check Failed"}
        </span>
      </div>
      {!isPassing && errorHtml && (
        <div className="text-sm text-red-700" dangerouslySetInnerHTML={{ __html: errorHtml }} />
      )}
    </div>
  );
}
