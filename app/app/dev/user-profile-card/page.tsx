"use client";

import type { UserProfileData } from "@/components/dashboard/challenges-sidebar/ui/UserProfile";
import { Badges } from "@/components/dashboard/challenges-sidebar/ui/UserProfile/Badges";
import { Streak } from "@/components/dashboard/challenges-sidebar/ui/UserProfile/Streak";
import PencilIcon from "@/icons/pencil.svg";
import PremiumStarIcon from "@/icons/premium-star.svg";
import type { BadgeData } from "@/lib/api/badges";
import style from "./page.module.css";

const mockProfile: UserProfileData = {
  name: "Nicole Chalmers",
  handle: "japermian",
  streaksEnabled: true,
  currentStreak: 0
};

const mockAvatarUrl = "https://avatars.githubusercontent.com/u/1?v=4";

const mockBadges: BadgeData[] = [
  {
    id: 1,
    slug: "first-steps",
    state: "revealed",
    unlocked_at: "2024-01-01"
  },
  {
    id: 2,
    slug: "streak-starter",
    state: "unrevealed"
  },
  {
    id: 3,
    slug: "curious-mind",
    state: "revealed",
    unlocked_at: "2024-02-01"
  }
];

const mockBadgeCopy = {
  "first-steps": { name: "First Steps", description: "Completed first exercise", funFact: "" },
  "streak-starter": { name: "Streak Starter", description: "3-day streak", funFact: "" },
  "curious-mind": { name: "Curious Mind", description: "Explored 5 concepts", funFact: "" }
};

export default function UserProfileCardDevPage() {
  return (
    <div className={style.page}>
      <div className={style.toolbar}>
        <h1 className={style.title}>UserProfile Card — Before / After</h1>
        <p className={style.subtitle}>
          Left: current design (icon/flag badge). Right: new premium design (star badge + tinted background).
        </p>
      </div>

      <div className={style.compareRow}>
        <div className={style.column}>
          <div className={style.columnLabel}>Current</div>
          <CurrentCard />
        </div>

        <div className={style.column}>
          <div className={style.columnLabel}>Premium (new)</div>
          <PremiumCard />
        </div>
      </div>
    </div>
  );
}

function CurrentCard() {
  return (
    <div className={style.card}>
      <div className={style.header}>
        <button type="button" className={style.avatarButton}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={mockAvatarUrl} alt="User Avatar" />
          <div className={style.avatarOverlay}>
            <PencilIcon className={style.avatarOverlayIcon} />
          </div>
        </button>
        <div className={style.info}>
          <div className={style.name}>{mockProfile.name}</div>
          <div className={style.handle}>{mockProfile.handle}</div>
        </div>
        <Streak profile={mockProfile} />
      </div>
      <Badges badgeCopy={mockBadgeCopy} badges={mockBadges} />
    </div>
  );
}

function PremiumCard() {
  return (
    <div className={`${style.card} ${style.cardPremium}`}>
      <div className={style.header}>
        <button type="button" className={`${style.avatarButton} ${style.avatarButtonPremium}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={mockAvatarUrl} alt="User Avatar" />
          <div className={style.avatarOverlay}>
            <PencilIcon className={style.avatarOverlayIcon} />
          </div>
          <div className={style.starBadge}>
            <div className={style.starTooltip}>Premium Member</div>
            <PremiumStarIcon width={14} height={14} />
          </div>
        </button>
        <div className={style.info}>
          <div className={style.name}>{mockProfile.name}</div>
          <div className={style.handle}>{mockProfile.handle}</div>
        </div>
        <Streak profile={mockProfile} />
      </div>
      <Badges badgeCopy={mockBadgeCopy} badges={mockBadges} />
    </div>
  );
}
