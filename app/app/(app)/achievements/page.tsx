import SidebarLayout from "../../../components/layout/SidebarLayout";
import { AchievementsContent } from "./AchievementsContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Achievements - Jiki",
  description: "Track your progress and unlock achievements as you learn to code."
};

export default function AchievementsPage() {
  return (
    <SidebarLayout activeItem="achievements">
      <AchievementsContent />
    </SidebarLayout>
  );
}
