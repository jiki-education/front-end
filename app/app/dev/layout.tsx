// Tailwind lives in app.css, which is otherwise only loaded by the (app)
// layout (external/hybrid public pages are deliberately Tailwind-free - see
// PR #783). The /dev tooling pages sit outside (app) but are built with
// Tailwind, so pull app.css in here to give every dev page the full utility
// layer without re-enabling it for the public pages.
import "../app.css";

export default function DevLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
