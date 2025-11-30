import ExercisePath from "@/components/dashboard/exercise-path/ExercisePath";
import InfoPanel from "@/components/dashboard/info-panel/InfoPanel";
import AuthenticatedSidebarLayout from "../../../components/layout/AuthenticatedSidebarLayout";

export default function DashboardPage() {
  return (
    <AuthenticatedSidebarLayout>
      <div className="flex">
        <main className="flex-1 p-6">
          <ExercisePath />
        </main>
        <InfoPanel />
      </div>
    </AuthenticatedSidebarLayout>
  );
}
