"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useAuthStore } from "@/lib/auth/authStore";
import { trackEvent } from "@/lib/analytics";
import { formatPremiumPrice } from "@/lib/pricing";
import { staticAsset } from "@/lib/static-asset";
import { handlePurchasePremium } from "@/lib/subscriptions/handlers";
import { Testimonials } from "../PremiumUpgradeModal/Testimonials";
import styles from "./AskJikiUpsellStep.module.css";

interface AskJikiUpsellStepProps {
  exerciseSlug: string;
  onContinue: () => void;
  // Reopens this step if the student closes checkout without paying
  onCheckoutCancel: () => void;
}

// Shown after a free user completes the lesson they spent their free Ask Jiki
// conversation on. The API decides that and sends an ask_jiki_upsell event.
export function AskJikiUpsellStep({ exerciseSlug, onContinue, onCheckoutCancel }: AskJikiUpsellStepProps) {
  const t = useTranslations("modals.exerciseCompletion.askJikiUpsell");
  const tCommon = useTranslations("common");
  const user = useAuthStore((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    trackEvent("premium_modal_shown", {
      trigger: "exercise_completion_ask_jiki_upsell",
      context_type: "lesson",
      context_slug: exerciseSlug
    });
  }, [exerciseSlug]);

  const isPending = user?.premium_purchase_pending === true;
  const price = user ? formatPremiumPrice(user.premium_prices) : "";
  const priceLine = t("price", { price });

  const highlight = (chunks: React.ReactNode) => <span className={styles.highlight}>{chunks}</span>;
  const strong = (chunks: React.ReactNode) => <strong>{chunks}</strong>;

  const handleUpgrade = async () => {
    setIsLoading(true);
    try {
      // Replaces the completion modal with the checkout modal. The lesson was
      // already saved before this step could appear.
      await handlePurchasePremium({
        trigger: "exercise_completion_ask_jiki_upsell",
        returnPath: window.location.pathname,
        onCancel: onCheckoutCancel
      });
    } catch {
      // handlePurchasePremium has already toasted the reason
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.content} style={{ "--pulse-delay": pulseDelay(priceLine) } as React.CSSProperties}>
      <div className={styles.headingRow}>
        <Image className={styles.jiki} src={staticAsset("images/misc/jiki-ask.webp")} alt="" width={72} height={72} />
        <h2 className={styles.heading}>{t.rich("heading", { highlight })}</h2>
      </div>
      <p className={styles.body}>{t.rich("body", { strong })}</p>

      <p className={styles.plus}>{t.rich("plus", { strong })}</p>

      <PriceLine line={priceLine} price={price} />

      {isPending && (
        <p className={styles.pendingNote} role="status">
          {t("pendingNote")}
        </p>
      )}

      <div className={styles.buttons}>
        <button onClick={onContinue} className={`ui-btn ui-btn-large ui-btn-tertiary ${styles.button}`}>
          {t("noThanks")}
        </button>
        {!isPending && (
          <button
            onClick={handleUpgrade}
            disabled={isLoading}
            className={`ui-btn ui-btn-large ui-btn-primary ui-btn-purple ${styles.button} ${styles.upgradeButton} ${isLoading ? "ui-btn-loading" : ""}`}
          >
            {isLoading ? tCommon("processing") : t("upgrade")}
          </button>
        )}
      </div>

      <Testimonials className={styles.testimonials} />
    </div>
  );
}

// Splits the price line into letters so its colour can sweep across them, left
// to right, when the step appears. The price itself gets its own colour.
// Screen readers get the whole line once.
function PriceLine({ line, price }: { line: string; price: string }) {
  const priceStart = price ? line.indexOf(price) : -1;
  const isPriceChar = (i: number) => priceStart >= 0 && i >= priceStart && i < priceStart + price.length;

  // `position` counts UTF-16 units to match indexOf. `index` counts letters for the animation.
  let index = 0;
  let position = 0;
  const words = line.split(" ").map((word) => {
    const letters = [...word].map((char) => {
      const letter = { char, index: index++, isPrice: isPriceChar(position) };
      position += char.length;
      return letter;
    });
    position += 1;
    return letters;
  });

  return (
    <p className={styles.price} aria-label={line}>
      {words.map((letters, wordIndex) => (
        <span key={wordIndex} aria-hidden="true">
          {wordIndex > 0 && " "}
          <span className={styles.priceWord}>
            {letters.map(({ char, index: i, isPrice }) => (
              <span
                key={i}
                className={`${styles.priceChar} ${isPrice ? styles.priceAmount : ""}`}
                style={{ "--i": i } as React.CSSProperties}
              >
                {char}
              </span>
            ))}
          </span>
        </span>
      ))}
    </p>
  );
}

// The upgrade button pulses as the sweep finishes. These timings match the
// sweep's animation in the CSS module: 0.6s before it starts, 40ms per
// letter, and 0.15s for the last letter.
function pulseDelay(text: string): string {
  const letters = [...text.replace(/ /g, "")].length;
  return `${(0.6 + (letters - 1) * 0.04 + 0.15).toFixed(2)}s`;
}
