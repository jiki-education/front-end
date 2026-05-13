import { EditorView } from "@codemirror/view";

export const placeholderTheme = EditorView.baseTheme({
  ".cm-placeholder-widget": {
    borderRadius: "8px",
    background: "transparent",
    fontFamily: "Poppins",
    padding: "2px 4px",
    color: "#76709F",
    fontSize: "14px",
    alignItems: "center"
  },
  ".tutorialMode": {
    background: "#E1EBFF",
    color: "#2E57E8"
  }
});
