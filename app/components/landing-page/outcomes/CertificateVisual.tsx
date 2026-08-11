import Image from "next/image";
import { useTranslations } from "next-intl";
import certificate from "../assets/certificate.webp";
import splashStrokes from "../assets/splash-strokes.webp";
import styles from "./CertificateVisual.module.css";

export function CertificateVisual() {
  const t = useTranslations("landing.outcomes");

  return (
    <div className={styles.cert}>
      <Image
        src={certificate}
        alt={t("certificateAlt")}
        className={styles.image}
        sizes="(max-width: 900px) 90vw, 380px"
      />
      <span className={styles.verify}>
        <svg viewBox="0 0 24 24" fill="#fff" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z" />
        </svg>
        {t("shareOnLinkedIn")}
        <Image src={splashStrokes} alt="" aria-hidden="true" className={styles.splash} />
      </span>
    </div>
  );
}
