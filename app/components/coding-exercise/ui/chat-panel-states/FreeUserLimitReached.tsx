import Image from "next/image";
import { useTranslations } from "next-intl";
import { PremiumPrice } from "@/components/common/PremiumPrice";
import { showPremiumUpgradeModal } from "@/lib/modal/app";
import { staticAsset } from "@/lib/static-asset";
import styles from "./shared.module.css";
import StuckHeader from "./StuckHeader";

// Non-premium user, conversation not allowed, no existing conversation
// They've used their free conversation limit
export default function FreeUserLimitReached() {
  const t = useTranslations("codingExercise.freeUserLimitReached");
  const tCommon = useTranslations("common");
  const handleUpgradeClick = () => {
    showPremiumUpgradeModal("assistant_limit_reached");
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <StuckHeader />
        <p className={styles.description}>{t("description")}</p>

        <div className={styles.buttonWrapper}>
          <Image src={staticAsset("images/misc/arrow.png")} alt="" width={60} height={60} className={styles.arrow} />
          <button onClick={handleUpgradeClick} className="ui-btn ui-btn-primary ui-btn-purple ui-btn-default">
            {t("upgradeButton")}
          </button>
        </div>

        <p className={styles.subtleText}>
          {t.rich("price", {
            price: () => (
              <>
                <PremiumPrice interval="monthly" />
                {tCommon("perMonth")}
              </>
            )
          })}
        </p>
      </div>
    </div>
  );
}
