// Type stubs for useScrubber and related components

export interface StaticError {
  message: string;
  line?: number;
  column?: number;
  endLine?: number;
  endColumn?: number;
  // TODO: edit this
  type: string;
}

export interface EditorStoreState {
  breakpoints: number[];
  foldedLines: number[];
  setHighlightedLine: (line: number | undefined) => void;
  setHighlightedLineColor: (color: string) => void;
  setInformationWidgetData: (data: { html?: string; line: number; status: "SUCCESS" | "ERROR" }) => void;
  shouldShowInformationWidget: boolean;
  setShouldShowInformationWidget: (value: boolean) => void;
  setUnderlineRange: (range: { from: number; to: number } | null) => void;
}

export interface AnimationTimelineStoreState {
  setIsTimelineComplete: (value: boolean) => void;
  setShouldAutoplayAnimation: (value: boolean) => void;
}

export interface ShowErrorParams {
  error: StaticError;
  setHighlightedLine: (line: number | undefined) => void;
  setHighlightedLineColor: (color: string) => void;
  setInformationWidgetData: (data: { html?: string; line: number; status: "SUCCESS" | "ERROR" }) => void;
  setShouldShowInformationWidget: (value: boolean) => void;
  setUnderlineRange: (range: { from: number; to: number } | null) => void;
  editorView: unknown;
  context?: string;
}

export type ShowErrorFunction = (params: ShowErrorParams) => void;
export type ScrollToLineFunction = (editorView: unknown, line: number) => void;
export type CleanUpEditorFunction = (editorView: unknown) => void;
