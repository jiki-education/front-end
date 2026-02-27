"use client";

import { Badges } from "@/components/dashboard/projects-sidebar/ui/UserProfile/Badges";
import { Streak } from "@/components/dashboard/projects-sidebar/ui/UserProfile/Streak";
import type { UserProfileData } from "@/components/dashboard/projects-sidebar/ui/UserProfile";
import type { BadgeData } from "@/lib/api/badges";
import PencilIcon from "@/icons/pencil.svg";
import PremiumStarIcon from "@/icons/premium-star.svg";
import style from "./page.module.css";

const mockProfile: UserProfileData = {
  name: "Nicole Chalmers",
  handle: "japermian",
  avatarUrl: "https://avatars.githubusercontent.com/u/1?v=4",
  streaksEnabled: true,
  currentStreak: 0
};

const mockBadges: BadgeData[] = [
  {
    id: 1,
    name: "First Steps",
    slug: "first-steps",
    description: "Completed first exercise",
    fun_fact: "",
    state: "revealed",
    num_awardees: 1000,
    unlocked_at: "2024-01-01"
  },
  {
    id: 2,
    name: "Streak Starter",
    slug: "streak-starter",
    description: "3-day streak",
    fun_fact: "",
    state: "unrevealed",
    num_awardees: 500
  },
  {
    id: 3,
    name: "Curious Mind",
    slug: "curious-mind",
    description: "Explored 5 concepts",
    fun_fact: "",
    state: "revealed",
    num_awardees: 300,
    unlocked_at: "2024-02-01"
  }
];

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
          <img src={mockProfile.avatarUrl} alt="User Avatar" />
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
      <Badges badges={mockBadges} />
    </div>
  );
}

function PremiumCard() {
  return (
    <div className={`${style.card} ${style.cardPremium}`}>
      <div className={style.header}>
        <button type="button" className={`${style.avatarButton} ${style.avatarButtonPremium}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={mockProfile.avatarUrl} alt="User Avatar" />
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
      <Badges badges={mockBadges} />
    </div>
  );
}
