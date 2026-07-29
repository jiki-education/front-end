import type { MembershipTier } from "@/lib/pricing";
import { DEV_TIER_DISPLAY } from "../tiers";
import styles from "./UserInfo.module.css";

interface UserInfoProps {
  handle: string;
  email: string;
  membershipTier: MembershipTier;
}

export function UserInfo({ handle, email, membershipTier }: UserInfoProps) {
  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Current User</h2>
      <dl className={styles.list}>
        <div>
          <dt className={styles.term}>Handle:</dt>
          <dd className={styles.value}>{handle}</dd>
        </div>
        <div>
          <dt className={styles.term}>Email:</dt>
          <dd className={styles.value}>{email}</dd>
        </div>
        <div>
          <dt className={styles.term}>Membership Tier:</dt>
          <dd className={styles.value}>
            <span className={styles.badge} data-tier={getTierVariant(membershipTier)}>
              {DEV_TIER_DISPLAY[membershipTier].name}
            </span>
          </dd>
        </div>
      </dl>
    </div>
  );
}

function getTierVariant(tier: MembershipTier): string {
  switch (tier) {
    case "premium":
      return "premium";
    case "standard":
    default:
      return "standard";
  }
}
