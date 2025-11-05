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
