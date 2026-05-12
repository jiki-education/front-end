import React from "react";
import type { Change } from "diff";
import type { IOTestExpect } from "../../lib/test-results-types";
import tableStyles from "./io/IOScenarioTable.module.css";

interface IOTestResultViewProps {
  expect: IOTestExpect;
}

export function IOTestResultView({ expect }: IOTestResultViewProps) {
  if (expect.errorHtml) {
    return (
      <div className={tableStyles.wrapper}>
        <div className="p-2 text-sm text-red-700" dangerouslySetInnerHTML={{ __html: expect.errorHtml }} />
      </div>
    );
  }

  return (
    <div className={tableStyles.wrapper}>
      <table className={tableStyles.table}>
        <tbody>
          <tr>
            <th>Code run</th>
            <td>{expect.codeRun}</td>
          </tr>
          <tr>
            <th>Expected</th>
            <td className="whitespace-pre-wrap">{renderExpected(expect.diff)}</td>
          </tr>
          <tr>
            <th>Actual</th>
            <td className="whitespace-pre-wrap">
              {expect.actual === undefined || expect.actual === null ? (
                <span className={tableStyles.removedPart}>[Your function didn&apos;t return anything]</span>
              ) : (
                renderActual(expect.diff)
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function renderExpected(diff: Change[]) {
  return diff.map((part, idx) =>
    !part.added ? (
      <span key={`expected-${idx}`} className={part.removed ? tableStyles.addedPart : ""}>
        {renderPartValue(part)}
      </span>
    ) : null
  );
}

function renderActual(diff: Change[]) {
  return diff.map((part, idx) =>
    !part.removed ? (
      <span key={`actual-${idx}`} className={part.added ? tableStyles.removedPart : ""}>
        {renderPartValue(part)}
      </span>
    ) : null
  );
}

function renderPartValue(part: Change) {
  if (part.added || part.removed) {
    return part.value;
  }
  const lines = part.value.split("\n");
  return lines.map((line, i) => (
    <React.Fragment key={i}>
      {line}
      {i < lines.length - 1 && <br />}
    </React.Fragment>
  ));
}
