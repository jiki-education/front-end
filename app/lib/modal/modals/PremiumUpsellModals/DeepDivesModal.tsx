"use client";

import { useTranslations } from "next-intl";
import { PremiumPrice } from "@/components/common/PremiumPrice";
import { usePremiumUpsell, type PremiumUpsellProps } from "./usePremiumUpsell";
import styles from "./DeepDivesModal.module.css";

// A Premium upsell shown after an exercise. Leads with Jeremy's Deep Dive walkthroughs.
export function DeepDivesModal(props: PremiumUpsellProps) {
  const t = useTranslations("modals.premiumUpsells.deepDives");
  const tUpsells = useTranslations("modals.premiumUpsells");
  const tCommon = useTranslations("common");
  const { isPending, isLoading, handleContinue, handleUpgrade } = usePremiumUpsell(props);

  const highlight = (chunks: React.ReactNode) => <span className={styles.highlight}>{chunks}</span>;
  const strong = (chunks: React.ReactNode) => <strong>{chunks}</strong>;

  return (
    <div className={styles.content}>
      <h2 className={styles.heading}>{t.rich("heading", { highlight })}</h2>
      <p className={styles.subheading}>{tUpsells.rich("subheading", { strong })}</p>
      <p className={styles.text}>{t.rich("text", { strong })}</p>

      <p className={styles.plus}>{t.rich("plus", { strong })}</p>

      <p className={styles.price}>{t.rich("price", { price: () => <PremiumPrice />, strong })}</p>

      {isPending && (
        <p className={styles.pendingNote} role="status">
          {t("pendingNote")}
        </p>
      )}

      <div className={styles.buttons}>
        <button onClick={handleContinue} className={`ui-btn ui-btn-tertiary ui-btn-large ${styles.button}`}>
          {tCommon("continue")}
        </button>
        {!isPending && (
          <button
            onClick={handleUpgrade}
            disabled={isLoading}
            className={`ui-btn ui-btn-primary ui-btn-purple ui-btn-large ${styles.button} ${isLoading ? "ui-btn-loading" : ""}`}
          >
            {isLoading ? tCommon("processing") : t("upgrade")}
          </button>
        )}
      </div>
    </div>
  );
}
