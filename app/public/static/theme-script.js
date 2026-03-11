// Dark mode is not yet designed. Theme is forced to light until dark mode is ready.
// The dynamic theme detection logic is preserved below as dead code.

/* DEAD CODE — re-enable when dark mode design is ready:
(function () {
  try {
    var storageKey = "jiki-theme";
    var theme = localStorage.getItem(storageKey);
    var systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    var resolvedTheme = "light";
    if (theme === "dark") {
      resolvedTheme = "dark";
    } else if (theme === "system" || !theme) {
      resolvedTheme = systemPrefersDark ? "dark" : "light";
    }

    if (resolvedTheme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      document.documentElement.classList.add("dark");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    // Fallback to light theme if localStorage is not available
  }
})();
*/
