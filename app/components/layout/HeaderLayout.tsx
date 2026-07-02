import { LocaleBanner } from "../i18n/LocaleBanner";
import { ExternalFooter } from "./ExternalFooter";
import Header from "./header/Header";

interface AuthenticatedHeaderLayoutProps {
  children: React.ReactNode;
}

// Server layout for the public/hybrid site. The header switch is a client child
// (auth-dependent); the LocaleBanner is server-rendered so it can read request
// headers (Accept-Language) and is skipped for crawlers.
export default function HeaderLayout({ children }: AuthenticatedHeaderLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header banner={<LocaleBanner />} />
      <main className="flex-1">{children}</main>
      <ExternalFooter />
    </div>
  );
}
