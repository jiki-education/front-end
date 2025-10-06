import type Orchestrator from "../../../lib/Orchestrator";
import { testStyles } from "./styles";

interface InformationWidgetTestProps {
  orchestrator: Orchestrator;
}

export default function InformationWidgetTest({ orchestrator }: InformationWidgetTestProps) {
  const handleShowWidget = (line: number, status: "SUCCESS" | "ERROR", html: string) => {
    orchestrator.setInformationWidgetData({ line, status, html });
    orchestrator.setShouldShowInformationWidget(true);
  };

  const handleHideWidget = () => {
    orchestrator.setShouldShowInformationWidget(false);
  };

  return (
    <div style={testStyles.container}>
      <h3 style={testStyles.title}>Information Widget</h3>

      <div style={testStyles.inputGroup}>
        <label style={testStyles.label}>Line Number:</label>
        <input type="number" min="1" placeholder="Line number" id="widget-line" style={testStyles.input} />
        <label style={testStyles.label}>Status:</label>
        <select id="widget-status" style={testStyles.select}>
          <option value="SUCCESS">Success</option>
          <option value="ERROR">Error</option>
        </select>
      </div>

      <div style={testStyles.inputGroup}>
        <label style={testStyles.label}>Message:</label>
        <input
          type="text"
          placeholder="Widget message"
          id="widget-message"
          style={{ ...testStyles.input, width: "200px" }}
        />
        <button
          onClick={() => {
            const lineInput = document.getElementById("widget-line") as HTMLInputElement;
            const statusSelect = document.getElementById("widget-status") as HTMLSelectElement;
            const messageInput = document.getElementById("widget-message") as HTMLInputElement;

            const line = parseInt(lineInput.value) || 1;
            const status = statusSelect.value as "SUCCESS" | "ERROR";
            const html = messageInput.value || "Test message";

            handleShowWidget(line, status, html);
          }}
          style={testStyles.button}
        >
          Show Widget
        </button>
      </div>

      <div style={testStyles.buttonGroup}>
        <button
          onClick={() =>
            handleShowWidget(
              2,
              "SUCCESS",
              `<h2>Code Execution Successful</h2><div class="content"><p>Your <code>calculateSum</code> function executed perfectly and returned the expected result.</p><hr /><p><strong>Execution Details:</strong></p><ul><li>Runtime: <code>2.3ms</code></li><li>Memory usage: <code>1.2MB</code></li><li>All test cases passed</li></ul><p>The function correctly handles edge cases and follows best practices for error handling.</p><pre><code class="language-jikiscript hljs">function calculateSum(a, b) {
  return a + b;
}</code></pre><p>Consider adding input validation to make your code even more robust.</p></div>`
            )
          }
          style={testStyles.button}
        >
          Success on Line 2
        </button>
        <button
          onClick={() =>
            handleShowWidget(
              4,
              "ERROR",
              `<h2>Jiki couldn't understand your code</h2><div class="content"><p>There's a syntax error in your code that needs to be fixed:</p><pre><code class="language-jikiscript hljs">if (condition) {
  // Missing closing brace</code></pre><p>The <code>if</code> statement requires a closing brace <code>}</code> to complete the block.</p><p><strong>Solution:</strong> Add a closing brace at the end of your if statement.</p></div>`
            )
          }
          style={testStyles.button}
        >
          Error on Line 4
        </button>
        <button
          onClick={() =>
            handleShowWidget(
              6,
              "SUCCESS",
              `<h2>Static Analysis Report</h2><div class="content"><p>Your code has been analyzed for potential improvements and best practices.</p><hr /><p><strong>Code Quality Score:</strong> <code>8.5/10</code></p><ul><li>Variable naming follows conventions</li><li>Function complexity is optimal</li><li>No unused variables detected</li><li>Proper error handling implemented</li></ul><p>The following pattern was detected in your code:</p><pre><code class="language-jikiscript hljs">for (let i = 0; i < items.length; i++) {
  processItem(items[i]);
}</code></pre><p><strong>Suggestion:</strong> Consider using <code>forEach</code> or <code>for...of</code> loop for better readability:</p><pre><code class="language-jikiscript hljs">items.forEach(item => processItem(item));</code></pre><p>This approach is more functional and reduces the chance of off-by-one errors.</p></div>`
            )
          }
          style={testStyles.button}
        >
          Analysis on Line 6
        </button>
        <button onClick={handleHideWidget} style={testStyles.secondaryButton}>
          Hide Widget
        </button>
      </div>
    </div>
  );
}
