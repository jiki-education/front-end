import { LocaleBanner } from "../i18n/LocaleBanner";
import { ExternalFooter } from "./ExternalFooter";
import Header from "./header/Header";
import styles from "./HeaderLayout.module.css";

interface AuthenticatedHeaderLayoutProps {
  children: React.ReactNode;
}

// Server layout for the public/hybrid site. The header switch is a client child
// (auth-dependent); the LocaleBanner is server-rendered so it can read request
// headers (Accept-Language) and is skipped for crawlers.
export default function HeaderLayout({ children }: AuthenticatedHeaderLayoutProps) {
  return (
    <div className={styles.layout}>
      <Header banner={<LocaleBanner />} />
      <main className={styles.main}>{children}</main>
      <ExternalFooter />
    </div>
  );
}
