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
