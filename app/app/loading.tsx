import { cookies } from "next/headers";
import LoadingJiki from "@/components/ui/LoadingJiki";
import { INTERNAL_NAV_COOKIE } from "@/lib/middleware/internal-navigation";

export default async function Loading() {
  const cookieStore = await cookies();
  const isInternalNavigation = cookieStore.has(INTERNAL_NAV_COOKIE);

  return <LoadingJiki delayed={isInternalNavigation} />;
}
