import { useTranslations } from "next-intl";
import Image from "next/image";
import { PremiumPrice } from "@/components/common/PremiumPrice";
import UserAvatar from "@/components/common/UserAvatar";
import { staticAsset } from "@/lib/static-asset";
import styles from "./PremiumUpgradeModal.module.css";

interface PremiumPlanSectionProps {
  user: any;
  isLoading: boolean;
  onUpgrade: () => void;
}

export function PremiumPlanSection({ user, isLoading, onUpgrade }: PremiumPlanSectionProps) {
  const t = useTranslations("modals.premiumUpgrade");
  const isPending = user?.premium_purchase_pending === true;
  const promise = t("lifetimeNote");

  const strong = (chunks: React.ReactNode) => <strong>{chunks}</strong>;
  const premiumFeatures: React.ReactNode[] = [
    t.rich("featureAi", { strong }),
    t.rich("featureChallenges", { strong }),
    t.rich("featureLivestreams", { strong }),
    t.rich("featureDeepDives", { strong }),
    t.rich("featureCertificates", { strong }),
    t.rich("featureAdFree", { strong }),
    t.rich("featureEarlyAccess", { strong })
  ];

  return (
    <div className={styles.rightSide} style={{ "--pulse-delay": pulseDelay(promise) } as React.CSSProperties}>
      <h2 className={styles.premiumName}>
        {t.rich("planName", { premium: (chunks) => <span className={styles.premiumWordmark}>{chunks}</span> })}
      </h2>
      <div className={styles.premiumPrice}>
        <PremiumPrice />
      </div>
      <SweepText text={promise} className={styles.priceNote} />

      {isPending ? (
        <p className={styles.pendingNote} role="status">
          {t("pendingNote")}
        </p>
      ) : (
        <div className={styles.upgradeButtonWrap}>
          <Image
            className={styles.arrowDecoration}
            src={staticAsset("images/misc/arrow.png")}
            alt=""
            width={118}
            height={117}
            priority
          />
          <UpgradeButton user={user} isLoading={isLoading} onUpgrade={onUpgrade} />
        </div>
      )}

      <ul className={styles.premiumFeatures}>
        {premiumFeatures.map((feature, index) => (
          <li key={index}>
            <PremiumCheckIcon />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function UpgradeButton({ user, isLoading, onUpgrade }: PremiumPlanSectionProps) {
  const t = useTranslations("modals.premiumUpgrade");
  const tCommon = useTranslations("common");
  const hasAvatar = Boolean(user?.avatar_url);

  return (
    <button
      className={`ui-btn ui-btn-default ui-btn-primary ui-btn-purple ${styles.upgradeButtonLayout} ${isLoading ? "ui-btn-loading" : ""}`}
      onClick={onUpgrade}
      disabled={isLoading}
    >
      {!isLoading && hasAvatar && <UserAvatar alt={t("userAvatarAlt")} className={styles.buttonAvatar} />}
      {isLoading ? tCommon("processing") : t("upgrade")}
    </button>
  );
}

// Splits the text into letters so its colour can sweep across them, left to
// right, when the modal opens. Screen readers get the whole text once.
function SweepText({ text, className }: { text: string; className: string }) {
  let index = 0;
  const words = text.split(" ").map((word) => [...word].map((char) => ({ char, index: index++ })));

  return (
    <p className={className} aria-label={text}>
      {words.map((letters, wordIndex) => (
        <span key={wordIndex} aria-hidden="true">
          {wordIndex > 0 && " "}
          <span className={styles.sweepWord}>
            {letters.map(({ char, index: i }) => (
              <span key={i} className={styles.sweepChar} style={{ "--i": i } as React.CSSProperties}>
                {char}
              </span>
            ))}
          </span>
        </span>
      ))}
    </p>
  );
}

function PremiumCheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="currentColor" fillOpacity="0.15" />
      <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// The upgrade button pulses as the sweep finishes. These timings match the
// sweep's animation in the CSS module: 0.6s before it starts, 40ms per
// letter, and 0.15s for the last letter.
function pulseDelay(text: string): string {
  const letters = [...text.replace(/ /g, "")].length;
  return `${(0.6 + (letters - 1) * 0.04 + 0.15).toFixed(2)}s`;
}
