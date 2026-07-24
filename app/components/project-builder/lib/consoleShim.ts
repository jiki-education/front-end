// Source for the script injected into every preview iframe. Captures console
// output and uncaught errors and posts them to the parent window. Kept as a
// string so previewBuilder can inline it into the srcdoc document.

export const CONSOLE_SHIM_SOURCE = `
(function () {
  function serialize(value) {
    if (typeof value === "string") return value;
    try {
      return JSON.stringify(value);
    } catch (e) {
      return String(value);
    }
  }

  function post(kind, payload) {
    try {
      window.parent.postMessage({ __jikiProjectBuilder: { kind: kind, ...payload } }, "*");
    } catch (e) {
      // parent gone - nothing to do
    }
  }

  ["log", "warn", "error", "info"].forEach(function (level) {
    var original = console[level];
    console[level] = function () {
      var args = Array.prototype.slice.call(arguments);
      post("console", { level: level, text: args.map(serialize).join(" ") });
      original.apply(console, args);
    };
  });

  window.addEventListener("error", function (event) {
    post("error", {
      message: event.message,
      source: event.filename || "",
      line: event.lineno || undefined
    });
  });

  window.addEventListener("unhandledrejection", function (event) {
    post("error", { message: "Unhandled promise rejection: " + serialize(event.reason), source: "", line: undefined });
  });
})();
`;
