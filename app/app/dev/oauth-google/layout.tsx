/**
 * Google OAuth Test Layout
 * Wraps the OAuth test page with GoogleOAuthProvider
 */

import { GoogleOAuthProvider } from "@react-oauth/google";
import styles from "./layout.module.css";

export default function OAuthTestLayout({ children }: { children: React.ReactNode }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID;

  if (!clientId) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.errorCard}>
            <h2 className={styles.errorTitle}>Configuration Error</h2>
            <p className={styles.errorText}>NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID is not set in environment variables.</p>
            <p className={styles.errorTextSpaced}>
              Add it to <code className={styles.code}>.env.local</code> to use Google OAuth.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>;
}
