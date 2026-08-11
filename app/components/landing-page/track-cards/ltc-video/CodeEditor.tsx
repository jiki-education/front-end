import { CODE_TOKENS, EDIT_LINE, EDIT_PREFIX_TOKENS, EDIT_SUFFIX_TOKENS, tokenize, type Token } from "./code-listing";
import type { VideoState } from "./state";
import styles from "./LtcVideo.module.css";

/** The code editor pane, rendered from tokens so a keystroke reconciles one text node. */
export function CodeEditor({ state }: { state: VideoState }) {
  return (
    <div className={styles.editor}>
      {CODE_TOKENS.map((tokens, i) => {
        const isEditLine = tokens === null;
        const classes = [
          styles.codeLine,
          state.errorShown && i === EDIT_LINE ? styles.codeLineError : "",
          isEditLine && !state.errorShown ? styles.codeLineActive : ""
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <div
            // The edited line's key carries the flash counter, so its flash keyframe restarts each loop.
            key={isEditLine ? `edit-${state.flashKey}` : i}
            className={`${classes} ${isEditLine && state.flashKey > 0 ? styles.codeLineAdded : ""}`}
          >
            <span className={styles.lineNumber}>{i + 1}</span>
            <span className={styles.lineText}>
              {isEditLine ? <EditedLine state={state} /> : <Tokens tokens={tokens} />}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/** The one edited line, in three pieces so the caret can sit mid-line and the value be retyped in place. */
function EditedLine({ state }: { state: VideoState }) {
  return (
    <>
      <Tokens tokens={EDIT_PREFIX_TOKENS} />
      {/* The only part tokenised at render time, because it is the only part that changes. */}
      <Tokens tokens={tokenize(state.editValue)} />
      {state.caret && <span className={styles.caret} />}
      <Tokens tokens={EDIT_SUFFIX_TOKENS} />
    </>
  );
}

function Tokens({ tokens }: { tokens: Token[] }) {
  return (
    <>
      {tokens.map((token, i) =>
        token.kind === "plain" ? (
          token.text
        ) : (
          <span key={i} className={styles[token.kind]}>
            {token.text}
          </span>
        )
      )}
    </>
  );
}
