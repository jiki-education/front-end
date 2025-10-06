import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { EditorView } from "@codemirror/view";
function createTheme({ variant, settings, styles }) {
  const theme = EditorView.theme(
    {
      "&": {
        backgroundColor: settings.background,
        color: settings.foreground
      },
      ".cm-content": {
        caretColor: settings.caret
      },
      ".cm-cursor, .cm-dropCursor": {
        borderLeftColor: settings.caret
      },
      ".cm-activeLine": {
        backgroundColor: settings.lineHighlight
      },
      ".cm-selectionMatch": {
        backgroundColor: settings.selectionMatch
      },
      "&.cm-focused .cm-selectionBackground .cm-selectionBackground, .cm-content ::selection": {
        backgroundColor: settings.selection + " !important"
      },

      ".cm-gutters": {
        backgroundColor: settings.gutterBackground,
        color: settings.gutterForeground
      },
      ".cm-activeLineGutter": {
        backgroundColor: settings.lineHighlight
      }
    },
    {
      dark: variant === "dark"
    }
  );
  const highlightStyle = HighlightStyle.define(styles);
  const extension = [theme, syntaxHighlighting(highlightStyle)];
  return extension;
}
export default createTheme;
