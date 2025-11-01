import type { IOTestExpect } from "../../lib/test-results-types";
import type { Change } from "diff";

interface IOTestResultViewProps {
  expect: IOTestExpect;
}

export function IOTestResultView({ expect }: IOTestResultViewProps) {
  const isPassing = expect.pass;

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
          {isPassing ? "Test Passed" : "Test Failed"}
        </span>
      </div>

      {expect.errorHtml && (
        <div className="text-sm text-red-700 mb-3" dangerouslySetInnerHTML={{ __html: expect.errorHtml }} />
      )}

      {!expect.errorHtml && (
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-gray-200">
              <th className="py-2 px-3 text-left font-medium text-gray-700 bg-gray-50">Code run:</th>
              <td className="py-2 px-3 font-mono text-sm">{expect.codeRun}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <th className="py-2 px-3 text-left font-medium text-gray-700 bg-gray-50">Expected:</th>
              <td className="py-2 px-3 font-mono text-sm">
                {renderDiffValue(expect.diff, expect.expected, "expected")}
              </td>
            </tr>
            <tr>
              <th className="py-2 px-3 text-left font-medium text-gray-700 bg-gray-50">Actual:</th>
              <td className="py-2 px-3 font-mono text-sm">{renderDiffValue(expect.diff, expect.actual, "actual")}</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}

// Helper to render diff highlighting
function renderDiffValue(diff: Change[], value: any, side: "expected" | "actual") {
  // If test passed, just show the value without diff highlighting
  const valueStr = value === null ? "null" : value === undefined ? "undefined" : String(value);

  if (diff.length === 0 || diff.every((change) => !change.added && !change.removed)) {
    return <span>{valueStr}</span>;
  }

  return (
    <span>
      {diff.map((change, idx) => {
        // For expected side: show removed parts (what was expected but not in actual)
        // For actual side: show added parts (what was in actual but not expected)
        if (side === "expected" && change.removed) {
          return (
            <span key={idx} className="bg-red-200 text-red-900">
              {change.value}
            </span>
          );
        }
        if (side === "actual" && change.added) {
          return (
            <span key={idx} className="bg-green-200 text-green-900">
              {change.value}
            </span>
          );
        }
        if (!change.added && !change.removed) {
          return <span key={idx}>{change.value}</span>;
        }
        return null;
      })}
    </span>
  );
}
