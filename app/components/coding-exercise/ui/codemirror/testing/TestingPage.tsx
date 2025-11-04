"use client";
import { createMockExercise } from "@/tests/mocks/exercise";
import { useRef } from "react";
import Orchestrator from "../../../lib/Orchestrator";
import OrchestratorProvider from "../../../lib/OrchestratorProvider";
import { CodeMirror } from "../CodeMirror";
import BreakpointTest from "./BreakpointTest";
import EditEditorTest from "./EditEditorTest";
import InformationWidgetTest from "./InformationWidgetTest";
import LineHighlighterTest from "./LineHighlighterTest";
import MultiLineHighlighterTest from "./MultiLineHighlighterTest";
import ReadOnlyRangesTest from "./ReadOnlyRangesTest";
import UnderlineRangeTest from "./UnderlineRangeTest";

interface TestingPageProps {
  initialCode?: string;
}

export default function TestingPage({
  initialCode = "// Test CodeMirror extensions\nfunction hello() {\n  console.log('Hello, World!');\n}\n\nhello();"
}: TestingPageProps) {
  const exercise = createMockExercise({
    slug: "testing-ui",
    stubs: { javascript: initialCode, python: initialCode, jikiscript: initialCode }
  });
  const orchestratorRef = useRef<Orchestrator>(new Orchestrator(exercise, "jikiscript"));
  const orchestrator = orchestratorRef.current;

  return (
    <OrchestratorProvider orchestrator={orchestrator}>
      <div
        style={{
          minHeight: "60vh",
          backgroundColor: "white",
          padding: "24px",
          fontFamily: "system-ui, -apple-system, sans-serif",
          color: "#1a1a1a"
        }}
      >
        <h1
          style={{
            fontSize: "28px",
            fontWeight: "600",
            marginBottom: "8px",
            color: "#111"
          }}
        >
          CodeMirror Extensions Testing UI
        </h1>
        <p
          style={{
            color: "#666",
            marginBottom: "32px",
            fontSize: "14px"
          }}
        >
          Test and interact with CodeMirror extensions using the controls below.
        </p>

        <div
          style={{
            display: "flex",
            gap: "24px",
            height: "calc(100vh - 180px)", // Adjust for header space
            minHeight: "600px"
          }}
        >
          {/* Left side - Fixed Editor */}
          <div
            style={{
              flex: "0 0 50%",
              display: "flex",
              flexDirection: "column"
            }}
          >
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "500",
                marginBottom: "12px",
                color: "#333"
              }}
            >
              Code Editor
            </h2>
            <div style={{ flex: "1", minHeight: "0" }}>
              <CodeMirror />
            </div>
          </div>

          {/* Right side - Scrollable Testing Components */}
          <div
            style={{
              flex: "1",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden"
            }}
          >
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "500",
                marginBottom: "12px",
                color: "#333"
              }}
            >
              Testing Controls
            </h2>
            <div
              style={{
                flex: "1",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                paddingRight: "8px"
              }}
            >
              <LineHighlighterTest orchestrator={orchestrator} />
              <MultiLineHighlighterTest orchestrator={orchestrator} />
              <UnderlineRangeTest orchestrator={orchestrator} />
              <ReadOnlyRangesTest orchestrator={orchestrator} />
              <InformationWidgetTest orchestrator={orchestrator} />
              <BreakpointTest orchestrator={orchestrator} />
              <EditEditorTest orchestrator={orchestrator} />
            </div>
          </div>
        </div>
      </div>
    </OrchestratorProvider>
  );
}
