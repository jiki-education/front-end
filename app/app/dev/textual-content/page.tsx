/* eslint-disable react/jsx-no-comment-textnodes */
"use client";

export default function TextualContentDevPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto p-32">
        <div className="mb-12">
          <h1 className="text-3xl font-bold mb-8">Textual Content Styling</h1>
          <p className="text-gray-600">
            This page displays all the typography and admonition styles for markdown-rendered content.
          </p>
        </div>

        {/* Large Variant */}
        <section className="mb-48">
          <h2 className="text-2xl font-semibold mb-16 text-gray-900">Large Variant (default)</h2>
          <div className="ui-textual-content ui-textual-content-large">
            <h2>Heading 2 - Large Variant</h2>
            <p>
              This is a paragraph demonstrating the large variant typography. It has a font-size of 19px with generous
              line-height for readability. The text color is a dark gray (#2d3748) that provides good contrast without
              being too harsh.
            </p>

            <h3>Heading 3 - Subheading</h3>
            <p>
              Here&apos;s another paragraph with some <strong>bold text</strong> and a <a href="#">link to somewhere</a>
              . The strong text uses a darker color and 600 font-weight. Links are blue and underline on hover.
            </p>

            <p>
              You can also use <code>inline code</code> which appears with a gray background and magenta color. This is
              useful for referencing variable names or short code snippets inline.
            </p>

            <h3>Lists</h3>
            <ul>
              <li>First unordered list item</li>
              <li>Second unordered list item</li>
              <li>Third unordered list item</li>
            </ul>

            <ol>
              <li>First ordered list item</li>
              <li>Second ordered list item</li>
              <li>Third ordered list item</li>
            </ol>

            <h3>Code Blocks</h3>
            <pre>
              <code>
                {`function greet(name) {
  // This is a comment
  const message = "Hello, " + name;
  return message;
}`}
              </code>
            </pre>

            <h3>Admonitions</h3>

            <div className="admonition admonition-info">
              <div className="admonition-title">
                <span className="admonition-icon">ℹ️</span>
                Info Box
              </div>
              <div className="admonition-content">
                This is an info admonition with a purple gradient background. Use it to provide{" "}
                <strong>additional context</strong> or helpful information that supplements the main content.
              </div>
            </div>

            <div className="admonition admonition-key-point">
              <div className="admonition-title">
                <span className="admonition-icon">💡</span>
                Key Point
              </div>
              <div className="admonition-content">
                This is a key point admonition with a blue border and subtle shadow. Use it to highlight important
                concepts that readers should remember.
              </div>
            </div>

            <div className="admonition admonition-warning">
              <div className="admonition-title">
                <span className="admonition-icon">⚠️</span>
                Warning
              </div>
              <div className="admonition-content">
                This is a warning admonition with an amber background and left border. Use it to alert readers about
                potential pitfalls or important caveats.
              </div>
            </div>

            <div className="admonition admonition-try-it">
              <div className="admonition-title">
                <span className="admonition-icon">🧪</span>
                Try It
              </div>
              <div className="admonition-content">
                This is a try-it admonition with a dashed border. Use it to encourage readers to experiment with a
                concept or practice what they&apos;ve learned.
              </div>
            </div>
          </div>
        </section>

        {/* Base Variant */}
        <section className="mb-48">
          <h2 className="text-2xl font-semibold mb-16 text-gray-900">Base Variant</h2>
          <div className="ui-textual-content ui-textual-content-base">
            <h2>Heading 2 - Base Variant</h2>
            <p>
              This is a paragraph demonstrating the base variant typography. It has a slightly smaller font-size of 18px
              compared to the large variant. This is useful for denser content or when space is limited.
            </p>

            <h3>Heading 3 - Subheading</h3>
            <p>
              The base variant maintains the same styling rules but with smaller font sizes across all elements. Notice
              how <strong>bold text</strong>, <a href="#">links</a>, and <code>inline code</code> all scale
              proportionally.
            </p>

            <pre>
              <code>
                {`const example = "code block in base variant";
console.log(example);`}
              </code>
            </pre>

            <div className="admonition admonition-info">
              <div className="admonition-title">
                <span className="admonition-icon">ℹ️</span>
                Info in Base Variant
              </div>
              <div className="admonition-content">
                Admonitions also scale with the base variant, maintaining visual hierarchy while being slightly more
                compact.
              </div>
            </div>
          </div>
        </section>

        {/* Tables */}
        <section className="mb-48">
          <h2 className="text-2xl font-semibold mb-16 text-gray-900">Tables</h2>
          <div className="ui-textual-content ui-textual-content-large">
            <div className="article-table-section">
              <h3>Features of JavaScript</h3>
              <table className="article-table">
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th>Why it&apos;s excluded</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="feature-cell">
                      <span className="code-tag">var</span>
                    </td>
                    <td>
                      Use <span className="code-tag">let</span> or <span className="code-tag">const</span> instead.{" "}
                      <span className="code-tag">var</span> has confusing scoping rules that cause bugs even for
                      experienced developers.
                    </td>
                  </tr>
                  <tr>
                    <td className="feature-cell">
                      <span className="code-tag">with</span>
                    </td>
                    <td>Deprecated and confusing. Creates ambiguous code that&apos;s hard to reason about.</td>
                  </tr>
                  <tr>
                    <td className="feature-cell">
                      <span className="code-tag">debugger</span>
                    </td>
                    <td>Development tool, not needed for learning.</td>
                  </tr>
                  <tr>
                    <td className="feature-cell">
                      <span className="code-tag">void</span>
                    </td>
                    <td>Rarely useful and confusing for beginners.</td>
                  </tr>
                  <tr>
                    <td className="feature-cell">
                      <span className="code-tag">yield</span>
                    </td>
                    <td>Advanced generator feature. You&apos;ll learn about generators later in your journey.</td>
                  </tr>
                  <tr>
                    <td className="feature-cell">
                      <span className="code-tag">delete</span>
                    </td>
                    <td>Can cause confusing behaviour with arrays and objects.</td>
                  </tr>
                  <tr>
                    <td className="feature-cell">
                      <span className="code-tag">import</span> / <span className="code-tag">export</span>
                    </td>
                    <td>Module system features. Jiki handles modules differently to keep things simple.</td>
                  </tr>
                  <tr>
                    <td className="feature-cell">
                      Bitwise operators (<span className="code-tag">&</span>, <span className="code-tag">|</span>,{" "}
                      <span className="code-tag">^</span>, <span className="code-tag">~</span>,{" "}
                      <span className="code-tag">&lt;&lt;</span>, <span className="code-tag">&gt;&gt;</span>,{" "}
                      <span className="code-tag">&gt;&gt;&gt;</span>)
                    </td>
                    <td>
                      Very rarely needed and confusing when you&apos;re learning. These are for low-level bit
                      manipulation.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Syntax Highlighting Classes */}
        <section className="mb-48">
          <h2 className="text-2xl font-semibold mb-16 text-gray-900">Syntax Highlighting Classes</h2>
          <div className="ui-textual-content ui-textual-content-large">
            <p>The following syntax highlighting classes are available for code blocks:</p>
            <pre>
              <code>
                <span className="code-keyword">function</span> <span>greet</span>(name) {"{"} {"\n"}
                {"  "}
                <span className="code-comment">// This is a comment</span>
                {"\n"}
                {"  "}
                <span className="code-keyword">const</span> message ={" "}
                <span className="code-string">&quot;Hello, &quot;</span> + name;{"\n"}
                {"  "}
                <span className="code-keyword">return</span> message;{"\n"}
                {"}"}
              </code>
            </pre>
            <ul>
              <li>
                <code>.code-keyword</code> - Purple (#7c3aed) for keywords like <code>function</code>,{" "}
                <code>const</code>, <code>return</code>
              </li>
              <li>
                <code>.code-string</code> - Green for string literals
              </li>
              <li>
                <code>.code-comment</code> - Gray italic for comments
              </li>
            </ul>
          </div>
        </section>

        {/* CSS Class Reference */}
        <section className="mb-32">
          <h2 className="text-2xl font-semibold mb-16 text-gray-900">CSS Class Reference</h2>
          <div className="bg-white rounded-lg shadow-sm p-24">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-8 pr-16">Class</th>
                  <th className="text-left py-8">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-8 pr-16">
                    <code className="text-magenta-600 bg-gray-100 px-6 py-2 rounded">.ui-textual-content</code>
                  </td>
                  <td>Base class with typography and layout styles</td>
                </tr>
                <tr className="border-b">
                  <td className="py-8 pr-16">
                    <code className="text-magenta-600 bg-gray-100 px-6 py-2 rounded">.ui-textual-content-large</code>
                  </td>
                  <td>Large variant (h2: 36px, h3: 28px, body: 19px)</td>
                </tr>
                <tr className="border-b">
                  <td className="py-8 pr-16">
                    <code className="text-magenta-600 bg-gray-100 px-6 py-2 rounded">.ui-textual-content-base</code>
                  </td>
                  <td>Base variant (h2: 32px, h3: 24px, body: 18px)</td>
                </tr>
                <tr className="border-b">
                  <td className="py-8 pr-16">
                    <code className="text-magenta-600 bg-gray-100 px-6 py-2 rounded">.admonition-info</code>
                  </td>
                  <td>Purple gradient info box</td>
                </tr>
                <tr className="border-b">
                  <td className="py-8 pr-16">
                    <code className="text-magenta-600 bg-gray-100 px-6 py-2 rounded">.admonition-key-point</code>
                  </td>
                  <td>Blue bordered key point box</td>
                </tr>
                <tr className="border-b">
                  <td className="py-8 pr-16">
                    <code className="text-magenta-600 bg-gray-100 px-6 py-2 rounded">.admonition-warning</code>
                  </td>
                  <td>Amber warning box with left border</td>
                </tr>
                <tr className="border-b">
                  <td className="py-8 pr-16">
                    <code className="text-magenta-600 bg-gray-100 px-6 py-2 rounded">.admonition-try-it</code>
                  </td>
                  <td>Dashed border try-it box</td>
                </tr>
                <tr className="border-b">
                  <td className="py-8 pr-16">
                    <code className="text-magenta-600 bg-gray-100 px-6 py-2 rounded">.article-table-section</code>
                  </td>
                  <td>Wrapper for table with margin spacing</td>
                </tr>
                <tr className="border-b">
                  <td className="py-8 pr-16">
                    <code className="text-magenta-600 bg-gray-100 px-6 py-2 rounded">.article-table</code>
                  </td>
                  <td>Styled table with rounded borders</td>
                </tr>
                <tr className="border-b">
                  <td className="py-8 pr-16">
                    <code className="text-magenta-600 bg-gray-100 px-6 py-2 rounded">.feature-cell</code>
                  </td>
                  <td>Fixed-width cell for feature names (220px)</td>
                </tr>
                <tr>
                  <td className="py-8 pr-16">
                    <code className="text-magenta-600 bg-gray-100 px-6 py-2 rounded">.code-tag</code>
                  </td>
                  <td>Purple gradient inline code tag for tables</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
